import { Iuser } from "@/utils/interface";
import {
  transactionCategoryConnection,
  transactionConnection,
  userConnection,
} from "../lib/index";

export const userRepository = {
  async getByUsername(username: string) {
    return await userConnection.findOne({ username });
  },

  async create(userInfo: Iuser) {
    await userConnection.insertOne({
      ...userInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    });
  },

  async update(username: string, updateInfo: Iuser) {
    await userConnection.updateOne({ username }, { $set: updateInfo });
  },

  async delete(username: string) {
    await userConnection.deleteOne({ username });
    await transactionConnection.deleteMany({ userId: username });
    await transactionCategoryConnection.deleteMany({ userId: username });
  },
};
