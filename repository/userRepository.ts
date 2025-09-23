import { Iuser } from "@/interface";
import { userConnection } from "../lib/userConnection";

export const userRepository = {
  async getByUsername(username: string) {
    return await userConnection.findOne({ username });
  },

  async create(userInfo: Iuser) {
    await userConnection.insertOne({
      ...userInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: true,
    });
  },

  async update(username: string, updateInfo: Iuser) {
    await userConnection.updateOne({ username }, { $set: updateInfo });
  },

  async delete(username: string) {
    await userConnection.updateOne({ username }, { $set: { status: false } });
  },
};
