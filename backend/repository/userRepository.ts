import { Iuser } from "@/backend/utils/interface";
import { transactionCategoryConnection, transactionConnection, userConnection } from "../lib/index";
import { ObjectId } from "mongodb";

export class UserRepository {
  constructor() {}

  async getByID(id: string): Promise<Iuser | null> {
    const user = await userConnection.findOne({ _id: new ObjectId(id) });
    return user ? this.map(user) : null;
  }

  async getByUsername(username: string): Promise<Iuser | null> {
    const user = await userConnection.findOne({ username });
    return user ? this.map(user) : null;
  }

  async create(userInfo: Iuser): Promise<{ insertedId: ObjectId }> {
    const newUser = await userConnection.insertOne({
      ...userInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    });
    return { insertedId: newUser.insertedId };
  }

  async update(username: string, updateInfo: Iuser): Promise<void> {
    const updateData = { ...updateInfo, updatedAt: new Date().toISOString() };
    await userConnection.updateOne({ username }, { $set: updateData });
  }

  async delete(username: string): Promise<void> {
    await userConnection.deleteOne({ username });
    await transactionConnection.deleteMany({ userID: username });
    await transactionCategoryConnection.deleteMany({ userID: username });
  }

  private map(user: Iuser & { _id: ObjectId }): Iuser {
    return {
      id: user._id.toString(),
      username: user.username,
      name: user.name,
      passwordHash: user.passwordHash,
      isLogin: user.isLogin,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
