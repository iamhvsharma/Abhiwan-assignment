import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";
import { verifyToken } from "../utils/jwt";

export const requireAuth = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ msg: "Invalid token" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token invalid" });
  }
};

export const requireRole = (role: "MANAGER" | "TEAM") => {
  return (req: any, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      return res.status(403).json({ msg: "Forbidden: Insufficient role" });
    }
    next();
  };
};
