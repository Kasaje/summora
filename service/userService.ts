import { Iuser } from "@/interface";
import bcrypt from "bcrypt";
import { userRepository } from "@/repository/userRepository";

export const userService = {
  async register(
    username: string,
    password: string,
    info: Iuser
  ): Promise<void> {
    const user = await userRepository.getByUsername(username);

    if (user) throw { message: "Username already exists.", status: 400 };

    const passwordHash = await bcrypt.hash(password, 12);
    await userRepository.create({ ...info, username, passwordHash });
  },

  async getByUsername(username: string): Promise<Iuser | null> {
    return userRepository.getByUsername(username);
  },

  async delete(username: string): Promise<void> {
    await userRepository.delete(username);
  },
};
