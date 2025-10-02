import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IauthService, IuserRepository } from "../utils/interface";

export class AuthService implements IauthService {
  constructor(private userRepository: IuserRepository) {}

  async login(username: string, password: string) {
    if (!process.env.JWT_SECRET) throw new Error("JWT secret not provided.");
    const user = await this.userRepository.getByUsername(username);

    console.log("username, password", username, password);
    if (!user) throw { message: "User not found.", status: 404 };
    if (!user.isActive) throw { message: "User not found.", status: 404 };

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) throw { message: "Invalid password.", status: 401 };

    const accessToken = jwt.sign(
      { username: user.username, id: user.id, type: "access" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { username: user.username, id: user.id, type: "refresh" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
  }

  async verifyToken(token: string) {
    if (!process.env.JWT_SECRET) throw new Error("JWT secret not provided.");
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
        username: string;
        type: string;
      };
      if (payload.type !== "access") throw { message: "Invalid token type.", status: 401 };
      return { id: payload.id, username: payload.username };
    } catch (error) {
      throw { message: "Invalid or expired token.", status: 401 };
    }
  }
}
