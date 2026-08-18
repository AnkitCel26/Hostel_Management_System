import { GraphQLError } from "graphql";
import type { Request, Response } from "express";
import { generateAccessToken, verifyRefreshToken } from "../../utils/jwt.ts";
import { User } from "../../entities/user.entity.ts";
import { AppDataSource } from "../../config/db.ts";

const userRepo = AppDataSource.getRepository(User);

export const refreshAccessToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new GraphQLError("Refresh token missing");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(token) as {
      id: string;
      email: string;
      role: string;
    };
  } catch (error) {
    res.clearCookie("accessToken", { httpOnly: true });
    res.clearCookie("refreshToken", { httpOnly: true });
    throw new GraphQLError("Invalid or expired refresh token");
  }

  const user = await userRepo.findOne({ where: { id: decoded.id } });

  if (!user || !user.isActive) {
    res.clearCookie("accessToken", { httpOnly: true });
    res.clearCookie("refreshToken", { httpOnly: true });
    throw new GraphQLError("User not found or inactive");
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = generateAccessToken(payload);

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
  });

  return {
    message: "Token refreshed",
  };
};