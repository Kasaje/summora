import { ItransactionCategory } from "@/utils/interface";
import { transactionCategoryConnection } from "../lib/index";
import { ObjectId } from "mongodb";

export const transactionCategoryRepository = {
  async listByUserId(userId: string) {
    return await transactionCategoryConnection.find({ userId }).toArray();
  },

  async create(userId: string, info: ItransactionCategory) {
    await transactionCategoryConnection.insertOne({
      ...info,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      // Relational
      userId,
    });
  },

  async update(id: string, updateInfo: ItransactionCategory) {
    await transactionCategoryConnection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateInfo }
    );
  },

  async delete(id: string) {
    await transactionCategoryConnection.deleteOne({ _id: new ObjectId(id) });
  },
};
