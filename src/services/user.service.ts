import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const signup = async (email: string, password: string, name: string, role? : Role) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed, name, role:  role || Role.GUEST },
  });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret", {
    expiresIn: "7d",
  });

  return { token, user };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret", {
    expiresIn: "7d",
  });

  return { token, user };
};

export const getMe = async (id: string) => {
  return prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true } });
};
