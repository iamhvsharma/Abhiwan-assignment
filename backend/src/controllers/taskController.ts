import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { getIO } from "../utils/socket";

export const createTask = async (req: any, res: Response) => {
  const { title, description, assignedToId, workspaceNumber } = req.body;
  const managerId = req.user.id;

  try {
    const workspace = await prisma.workspace.findUnique({
      where: { workspaceNumber },
      include: { members: true },
    });

    if (!workspace || workspace.createdBy !== managerId) {
      return res
        .status(403)
        .json({ msg: "Unauthorized or workspace not found" });
    }

    const isMember = workspace.members.some((m) => m.id === assignedToId);
    if (!isMember)
      return res.status(400).json({ msg: "Assigned user not in workspace" });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        workspaceId: workspace.id,
        assignedToId,
        createdById: managerId,
      },
      include: {
        assignedTo: { select: { id: true, name: true } },
        notes: true,
      },
    });

    // 🔄 Emit to workspace room
    const io = getIO();
    io.to(workspaceNumber.toString()).emit("task:created", task);

    res.status(201).json({ msg: "Task created", task });
  } catch (err) {
    res.status(500).json({ msg: "Internal error" });
  }
};

export const getTasks = async (req: any, res: Response) => {
  const workspaceNumber = Number(req.params.workspaceNumber);
  if (!workspaceNumber || isNaN(workspaceNumber))
    return res.status(400).json({ msg: "Invalid workspace number" });

  try {
    const workspace = await prisma.workspace.findUnique({
      where: { workspaceNumber },
    });

    if (!workspace) return res.status(404).json({ msg: "Workspace not found" });

    const tasks = await prisma.task.findMany({
      where: { workspaceId: workspace.id },
      include: {
        assignedTo: { select: { id: true, name: true } },
        notes: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ tasks });
  } catch (err) {
    res.status(500).json({ msg: "Internal error" });
  }
};

export const updateTask = async (req: any, res: Response) => {
  const { taskId } = req.params;
  const managerId = req.user.id;

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { workspace: true },
    });

    if (!task) return res.status(404).json({ msg: "Task not found" });

    const workspace = await prisma.workspace.findUnique({
      where: { id: task.workspaceId },
    });

    if (!workspace || workspace.createdBy !== managerId)
      return res.status(403).json({ msg: "Unauthorized" });

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: req.body,
      include: {
        assignedTo: { select: { id: true, name: true } },
        notes: true,
      },
    });

    // 🔄 Emit update
    const io = getIO();
    io.to(workspace.workspaceNumber.toString()).emit("task:updated", updated);

    res.status(200).json({ msg: "Task updated", task: updated });
  } catch (err) {
    res.status(500).json({ msg: "Internal error" });
  }
};

export const deleteTask = async (req: any, res: Response) => {
  const { taskId } = req.params;
  const managerId = req.user.id;

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { workspace: true },
    });
    if (!task) return res.status(404).json({ msg: "Task not found" });

    const workspace = await prisma.workspace.findUnique({
      where: { id: task.workspaceId },
    });
    if (!workspace || workspace.createdBy !== managerId)
      return res.status(403).json({ msg: "Unauthorized" });

    await prisma.task.delete({ where: { id: taskId } });

    // 🔄 Emit deletion
    const io = getIO();
    io.to(workspace.workspaceNumber.toString()).emit("task:deleted", {
      taskId,
    });

    res.status(200).json({ msg: "Task deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Internal error" });
  }
};

export const updateTaskStatus = async (req: any, res: Response) => {
  const { taskId, status } = req.body;
  const userId = req.user.id;

  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task || task.assignedToId !== userId)
      return res
        .status(403)
        .json({ msg: "Not authorized to update this task" });

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    const workspace = await prisma.workspace.findUnique({
      where: { id: task.workspaceId },
    });

    const io = getIO();
    io.to(workspace!.workspaceNumber.toString()).emit("task:status", {
      taskId,
      status,
    });

    res.status(200).json({ msg: "Status updated", task: updated });
  } catch (err) {
    res.status(500).json({ msg: "Internal error" });
  }
};

export const addNote = async (req: any, res: Response) => {
  const { taskId, note } = req.body;
  const userId = req.user.id;

  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.assignedToId !== userId)
      return res.status(403).json({ msg: "Not authorized" });

    const createdNote = await prisma.progressNote.create({
      data: {
        taskId,
        userId,
        note,
      },
    });

    const workspace = await prisma.workspace.findUnique({
      where: { id: task.workspaceId },
    });

    const io = getIO();
    io.to(workspace!.workspaceNumber.toString()).emit("task:note", {
      taskId,
      note: createdNote,
    });

    res.status(201).json({ msg: "Note added", note: createdNote });
  } catch (err) {
    res.status(500).json({ msg: "Internal error" });
  }
};
