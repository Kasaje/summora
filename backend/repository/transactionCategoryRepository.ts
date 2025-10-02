import { Iuser } from "@/backend/utils/interface";
import { transactionCategoryConnection, transactionConnection, userConnection } from "../lib/index";

export class TransactionCategoryRepository {
  constructor() {}

  async initializeDefaultCategories(userID: string) {
    const categories = ["อาหาร", "เดินทาง", "บันเทิง", "ช็อปปิ้ง", "อื่นๆ"];
    await transactionCategoryConnection.insertMany(
      categories.map((name) => ({
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userID,
      }))
    );
  }

  async listByUserID(userID: string) {
    return await transactionCategoryConnection.find({ userID }).toArray();
  }

  async create(userInfo: Iuser) {
    const newUser = await userConnection.insertOne({
      ...userInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    });
    return newUser;
  }

  async update(username: string, updateInfo: Iuser) {
    await userConnection.updateOne({ username }, { $set: updateInfo });
  }

  async delete(username: string) {
    await userConnection.deleteOne({ username });
    await transactionConnection.deleteMany({ userID: username });
    await transactionCategoryConnection.deleteMany({ userID: username });
  }
}
