import jwt from "jsonwebtoken";
import "dotenv/config";

interface jwtPayload {
  id: string;
  email:string;
  role:string
}

export const generateAccessToken = (payload: jwtPayload): string => {
  try {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "15m",
    });
  } catch (err) {
    throw new Error("Failed to generate access token");
  }
};

export const generateRefreshToken = (payload: jwtPayload) => {
  const refreshToken=jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "2d",
  });
  return refreshToken;
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
};
