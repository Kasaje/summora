import { userRepository } from "@/backend/repository/userRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authService = {
  async login(username: string, password: string) {
    if (!process.env.JWT_SECRET) throw new Error("JWT secret not provided.");
    const user = await userRepository.getByUsername(username);

    console.log("username, password", username, password);
    if (!user) throw { message: "User not found.", status: 404 };
    if (!user.isActive) throw { message: "User not found.", status: 404 };

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) throw { message: "Invalid password.", status: 401 };

    const accessToken = jwt.sign(
      { username: user.username, type: "access" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { username: user.username, type: "refresh" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
  },
};
