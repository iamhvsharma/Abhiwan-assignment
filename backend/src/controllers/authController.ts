import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma";
import { generateToken } from "../utils/jwt";
import { registerSchema, loginSchema } from "../utils/zodSchemas";

export const register = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validatedData = registerSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res
        .status(400)
        .json({ msg: "Validation error", errors: validatedData.error.message });
    }

    const { name, email, password, role } = validatedData.data;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    const token = generateToken({ id: user.id, role: user.role });

    return res.status(201).json({
      msg: "User registered",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err: any) {
    // Handle Zod validation errors
    if (err.name === "ZodError") {
      return res.status(400).json({
        msg: "Validation error",
        errors: err.errors.map((error: any) => ({
          field: error.path.join("."),
          message: error.message,
        })),
      });
    }

    console.error(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const validatedData = loginSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res
        .status(400)
        .json({ msg: "Validation error", errors: validatedData.error.message });
    }

    const { email, password } = validatedData.data;

    if (!email || !password)
      return res.status(400).json({ msg: "Email and password are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = generateToken({ id: user.id, role: user.role });

    return res.status(200).json({
      msg: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err: any) {
    // Handle Zod validation errors
    if (err.name === "ZodError") {
      return res.status(400).json({
        msg: "Validation error",
        errors: err.errors.map((error: any) => ({
          field: error.path.join("."),
          message: error.message,
        })),
      });
    }

    console.error(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        workspaces: true
      },
    });

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};
