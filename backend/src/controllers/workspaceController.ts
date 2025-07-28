import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { getIO } from "../utils/socket";

export const createWorkspace = async (req: any, res: Response) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ msg: "Name is required" });

  try {
    // 🔒 Check if this manager already created a workspace
    const existing = await prisma.workspace.findFirst({
      where: { createdBy: req.user.id },
    });

    if (existing) {
      return res.status(400).json({ msg: "You already created a workspace." });
    }

    const last = await prisma.workspace.findFirst({
      orderBy: { workspaceNumber: "desc" },
    });

    const nextWorkspaceNumber = last ? last.workspaceNumber + 1 : 1001;

    const workspace = await prisma.workspace.create({
      data: {
        name,
        workspaceNumber: nextWorkspaceNumber,
        createdBy: req.user.id,
        members: { connect: { id: req.user.id } },
      },
    });

    res.status(201).json({ msg: "Workspace created", workspace });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const joinWorkspace = async (req: any, res: Response) => {
  const { workspaceNumber } = req.body;

  try {
    const workspace = await prisma.workspace.findUnique({
      where: { workspaceNumber },
      include: { members: true },
    });

    if (!workspace) return res.status(404).json({ msg: "Workspace not found" });

    // Check if already a member
    if (workspace.members.some((m) => m.id === req.user.id)) {
      return res.status(400).json({ msg: "Already a member" });
    }

    await prisma.workspace.update({
      where: { workspaceNumber },
      data: {
        members: { connect: { id: req.user.id } },
      },
    });

    // Emit socket event for real-time update
    const io = getIO();
    io.to(workspaceNumber.toString()).emit("workspace:memberJoined", {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });

    res.status(200).json({ msg: "Joined workspace", workspaceNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal error" });
  }
};

export const getWorkspace = async (req: any, res: Response) => {
  const workspaceNumber = Number(req.params.workspaceNumber);
  if (!workspaceNumber || isNaN(workspaceNumber)) {
    return res
      .status(400)
      .json({ msg: "workspaceNumber param is required and must be a number" });
  }
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { workspaceNumber },
      include: {
        manager: {
          select: {
            name: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
    if (!workspace) return res.status(404).json({ msg: "Not found" });
    res.status(200).json({ workspace });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal error" });
  }
};

export const leaveWorkspace = async (req: any, res: Response) => {
  const userId = req.user.id;
  const { workspaceNumber } = req.body;

  try {
    if (!workspaceNumber) {
      return res.status(400).json({ msg: "workspaceNumber is required" });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { workspaceNumber },
      include: { members: true },
    });
    if (!workspace) {
      return res.status(404).json({ msg: "Workspace not found" });
    }
    if (!workspace.members.some((m) => m.id === userId)) {
      return res
        .status(400)
        .json({ msg: "You are not a member of this workspace" });
    }

    await prisma.workspace.update({
      where: { workspaceNumber },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    });

    // Emit socket event for real-time update
    const io = getIO();
    io.to(workspaceNumber.toString()).emit("workspace:memberRemoved", {
      userId: req.user.id,
      userName: req.user.name,
    });

    res.status(200).json({ msg: "You have left the workspace" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal error" });
  }
};

export const removeUserFromWorkspace = async (req: any, res: Response) => {
  const managerId = req.user.id;
  const { userId, workspaceId } = req.body;

  try {
    if (!userId || !workspaceId) {
      return res
        .status(400)
        .json({ msg: "userId and workspaceId are required" });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { manager: true, members: true },
    });
    if (!workspace) {
      return res.status(404).json({ msg: "Workspace not found" });
    }
    if (workspace.createdBy !== managerId) {
      return res
        .status(403)
        .json({ msg: "You are not the manager of this workspace" });
    }

    const userToRemove = workspace.members.find((m) => m.id === userId);
    if (!userToRemove) {
      return res
        .status(400)
        .json({ msg: "User is not a member of this workspace" });
    }

    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    });

    // Emit socket event for real-time update
    const io = getIO();
    io.to(workspace.workspaceNumber.toString()).emit(
      "workspace:memberRemoved",
      {
        userId,
        userName: userToRemove.name,
      }
    );

    res.status(200).json({ msg: "User removed from workspace" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal error" });
  }
};

export const getManagerWorkspaces = async (req: any, res: Response) => {
  const managerId = req.user.id;

  try {
    const workspaces = await prisma.workspace.findMany({
      where: { createdBy: managerId },
      include: {
        manager: {
          select: { name: true, email: true },
        },
        members: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ workspaces });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const inviteUserToWorkspace = async (req: any, res: Response) => {
  const managerId = req.user.id;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }

  try {
    // Find the workspace created by the manager
    const workspace = await prisma.workspace.findFirst({
      where: { createdBy: managerId },
      include: { members: true },
    });

    if (!workspace) {
      return res.status(404).json({ msg: "Workspace not found for manager" });
    }

    // Find user to invite
    const userToInvite = await prisma.user.findUnique({
      where: { email },
      include: { workspaces: true },
    });

    if (!userToInvite) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Prevent duplicate joining
    const alreadyMember = workspace.members.some(
      (m) => m.id === userToInvite.id
    );
    if (alreadyMember) {
      return res.status(400).json({ msg: "User is already in the workspace" });
    }

    // Add to workspace members
    await prisma.workspace.update({
      where: { id: workspace.id },
      data: {
        members: {
          connect: { id: userToInvite.id },
        },
      },
    });

    // Emit socket event for real-time update
    const io = getIO();
    io.to(workspace.workspaceNumber.toString()).emit("workspace:memberJoined", {
      id: userToInvite.id,
      name: userToInvite.name,
      email: userToInvite.email,
      role: userToInvite.role,
    });

    res.status(200).json({
      msg: `User ${userToInvite.name} added to workspace #${workspace.workspaceNumber}`,
    });
  } catch (err) {
    console.error("Invite error:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getUserWorkspace = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        manager: { select: { name: true } },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (workspaces.length === 0) {
      return res.status(404).json({ msg: "No workspace found for user" });
    }

    // Since you only allow one workspace per user for now
    return res.status(200).json({ workspace: workspaces[0] });
  } catch (err) {
    console.error("Error fetching user workspace:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};
