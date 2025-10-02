import { Iuser } from "@/backend/utils/interface";
import bcrypt from "bcrypt";
import { userRepository } from "@/backend/repository/userRepository";
import { transactionCategoryRepository } from "@/backend/repository/transactionCategoryRepository";

export const userService = {
  async register(username: string, password: string, info: Iuser): Promise<void> {
    const user = await userRepository.getByUsername(username);

    if (user) throw { message: "Username already exists.", status: 400 };

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = await userRepository.create({
      ...info,
      username,
      passwordHash,
    });

    const userID = newUser.insertedId.toString();
    await transactionCategoryRepository.initializeDefaultCategoriees(userID);
  },

  async getByUsername(username: string): Promise<Iuser | null> {
    return userRepository.getByUsername(username);
  },

  async delete(username: string): Promise<void> {
    await userRepository.delete(username);
  },
};
