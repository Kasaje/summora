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
};
