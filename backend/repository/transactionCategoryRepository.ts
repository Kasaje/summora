import { ItransactionCategory, ItransactionCategoryRepository } from "@/backend/utils/interface";
import { transactionCategoryConnection, transactionConnection } from "../lib/index";
import { ObjectId } from "mongodb";

export class TransactionCategoryRepository implements ItransactionCategoryRepository {
  constructor() {}

  async initializeDefaultCategories(userID: string): Promise<void> {
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

  async getByID(id: string): Promise<ItransactionCategory | null> {
    const category = await transactionCategoryConnection.findOne({ _id: new ObjectId(id) });
    return category ? this.map(category) : null;
  }

  async listByUserID(userID: string): Promise<ItransactionCategory[]> {
    const categories = await transactionCategoryConnection
      .find({ userID })
      .sort({ createdAt: -1 })
      .toArray();
    return categories.map(this.map);
  }

  async create(userID: string, info: ItransactionCategory): Promise<void> {
    await transactionCategoryConnection.insertOne({
      ...info,
      userID,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async update(id: string, updateInfo: ItransactionCategory): Promise<void> {
    const updateData = { ...updateInfo, updatedAt: new Date().toISOString() };
    await transactionCategoryConnection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  }

  async delete(id: string): Promise<void> {
    await transactionCategoryConnection.deleteOne({ _id: new ObjectId(id) });
    await transactionConnection.deleteMany({ categoryID: new ObjectId(id) });
    await transactionCategoryConnection.deleteMany({ _id: new ObjectId(id) });
  }

  private map(
    categories: ItransactionCategory & { _id: ObjectId }
  ): ItransactionCategory & { id: string } {
    return {
      id: categories._id.toString(),
      name: categories.name,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
      userID: categories.userID,
    };
  }
}
