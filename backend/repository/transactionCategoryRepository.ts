import { ItransactionCategory } from "@/backend/utils/interface";
import { transactionCategoryConnection } from "../lib/index";
import { ObjectId } from "mongodb";

export const transactionCategoryRepository = {
  async initializeDefaultCategoriees(userID: string) {
    const categories = ["อาหาร", "เดินทาง", "บันเทิง", "ช็อปปิ้ง", "อื่นๆ"];
    await transactionCategoryConnection.insertMany(
      categories.map((name) => ({
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userID,
      }))
    );
  },

  async listByuserID(userID: string) {
    return await transactionCategoryConnection.find({ userID }).toArray();
  },

  async create(userID: string, info: ItransactionCategory) {
    await transactionCategoryConnection.insertOne({
      ...info,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      // Relational
      userID,
    });
  },

  async update(id: string, updateInfo: ItransactionCategory) {
    await transactionCategoryConnection.updateOne({ _id: new ObjectId(id) }, { $set: updateInfo });
  },

  async delete(id: string) {
    await transactionCategoryConnection.deleteOne({ _id: new ObjectId(id) });
  },
};
