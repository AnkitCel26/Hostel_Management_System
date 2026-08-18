import { GraphQLError } from "graphql";
import { AppDataSource } from "../../config/db.ts";
import { User } from "../../entities/user.entity.ts";
import { hashPassword, verifyPassword } from "../../utils/password.ts";
import type { Response } from "express";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.ts";
import { Pg } from "../../entities/pg.entity.ts";
import { Room } from "../../entities/room.entity.ts";
import { Tenant } from "../../entities/tenant.entity.ts";

const userRepo = AppDataSource.getRepository(User);
const pgRepo = AppDataSource.getRepository(Pg);
const roomRepo = AppDataSource.getRepository(Room);
const tenantRepo = AppDataSource.getRepository(Tenant);

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string,
  phone: string,
) => {
  if (!name || !email || !password || !role || !phone) {
    throw new GraphQLError("All fields are required");
  }

  if (!/^\d{10}$/.test(phone)) {
    throw new GraphQLError("Phone number must contain exactly 10 digits");
  }

  const existingUser = await userRepo.findOne({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    throw new GraphQLError("Email already exists");
  }

  try {
    const hashedPassword = await hashPassword(password);

    const user = userRepo.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
    });

    const savedUser = await userRepo.save(user);

    return {
      message: "Registration successful",
      user: savedUser,
    };
  } catch (error) {
    throw new GraphQLError("Registration Failed");
  }
};

export const loginUser = async (
  email: string,
  password: string,
  res: Response,
) => {
  if (!email || !password) {
    throw new GraphQLError("Email and password are required");
  }

  const user = await userRepo.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new GraphQLError("Invalid email or password");
  }

  if (!user.isActive) {
    throw new GraphQLError("User account is inactive");
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw new GraphQLError("Invalid email or password");
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });

  return {
    message: "Login successful",
    user,
  };
};

export const logoutUser = async (res: Response) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
    });

    return {
      message: "Logout successful",
    };
  } catch (error) {
    console.error("Logout error:", error);

    throw new GraphQLError("Logout failed");
  }
};

export const updateProfile = async (
  userId: string,
  name?: string,
  phone?: string,
) => {
  if (!name && !phone) {
    throw new GraphQLError("At least one field is required");
  }

  if (phone && !/^\d{10}$/.test(phone)) {
    throw new GraphQLError("Phone number must contain exactly 10 digits");
  }

  const user = await userRepo.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new GraphQLError("User not found");
  }

  if (!user.isActive) {
    throw new GraphQLError("User account is inactive");
  }

  if (name) {
    user.name = name;
  }

  if (phone) {
    user.phone = phone;
  }

  const updatedUser = await userRepo.save(user);

  return {
    message: "Profile updated successfully",
    user: updatedUser,
  };
};

export const allUsers = async () => {
  try {
    const users = await userRepo.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone:true,
        isActive: true,
      },
    });
    return users;
  } catch (error) {
    throw new GraphQLError("Failed to fetch all users");
  }
};

export const me = async (userId: string) => {
  const user = await userRepo.findOne({ where: { id: userId } });

  if (!user) {
    throw new GraphQLError("User not found");
  }

  return user;
};

export const getAdminDashboardStats = async () => {
  try {
    const totalPgs = await pgRepo.count();

    const activePgs = await pgRepo.count({
      where: {
        isActive: true,
      },
    });

    const totalRooms = await roomRepo.count();

    const totalTenants = await tenantRepo.count();

    const rooms = await roomRepo.find();

    const occupiedBeds = rooms.reduce(
      (total, room) => total + room.occupiedNo,
      0,
    );

    const availableBeds = rooms.reduce(
      (total, room) => total + (room.capacity - room.occupiedNo),
      0,
    );

    const fullRooms = rooms.filter(
      (room) => room.occupiedNo >= room.capacity,
    ).length;

    const availableRooms = rooms.filter(
      (room) => room.occupiedNo < room.capacity,
    ).length;

    return {
      totalPgs,
      activePgs,
      totalRooms,
      totalTenants,
      occupiedBeds,
      availableBeds,
      fullRooms,
      availableRooms,
    };
  } catch (error) {
    throw new GraphQLError(
      "Failed to fetch admin dashboard statistics",
    );
  }
};