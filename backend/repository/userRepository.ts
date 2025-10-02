import { Iuser } from "@/backend/utils/interface";
import { transactionCategoryConnection, transactionConnection, userConnection } from "../lib/index";

export const userRepository = {
  async getByUsername(username: string) {
    return await userConnection.findOne({ username });
  },

  async create(userInfo: Iuser) {
    const newUser = await userConnection.insertOne({
      ...userInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    });

    return newUser;
  },

  async update(username: string, updateInfo: Iuser) {
    await userConnection.updateOne({ username }, { $set: updateInfo });
  },

  async delete(username: string) {
    await userConnection.deleteOne({ username });
    await transactionConnection.deleteMany({ userID: username });
    await transactionCategoryConnection.deleteMany({ userID: username });
  },
};
