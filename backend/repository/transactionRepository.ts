import {
  Itransaction,
  ItransactionCategoryRepository,
  ItransactionRepository,
} from "../utils/interface";
import { transactionConnection } from "../lib/transactionConnection";
import { ObjectId } from "mongodb";

export class TransactionRepository implements ItransactionRepository {
  constructor() {}

  async getByID(id: string): Promise<Itransaction | null> {
    const transaction = (await transactionConnection.findOne({ _id: new ObjectId(id) })) || null;
    return transaction ? this.map(transaction) : null;
  }

  async listByUserID(
    userID: string,
    transactionCategoryRepository: ItransactionCategoryRepository
  ): Promise<Itransaction[]> {
    const transactionList = await transactionConnection
      .find({ userID })
      .sort({ createdAt: -1 })
      .toArray();

    return Promise.all(
      transactionList.map(async (t) => {
        const categoryName = await transactionCategoryRepository.getByID(t.categoryID);
        return { ...this.map(t), categoryName: categoryName?.name || "Unknown" };
      })
    );
  }

  async listByCategoryID(categoryID: string): Promise<Itransaction[]> {
    const transactionList = await transactionConnection
      .find({ categoryID })
      .sort({ createdAt: -1 })
      .toArray();
    return transactionList.map(this.map);
  }

  async create(userID: string, info: Itransaction): Promise<void> {
    await transactionConnection.insertOne({
      ...info,
      userID,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async update(id: string, updateInfo: Partial<Itransaction>): Promise<void> {
    const updateData = { ...updateInfo, updatedAt: new Date().toISOString() };
    await transactionConnection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
  }

  async delete(id: string): Promise<void> {
    await transactionConnection.deleteOne({ _id: new ObjectId(id) });
  }

  private map(data: Itransaction & { _id: ObjectId }): Itransaction & { id: string } {
    const { _id, ...rest } = data;
    return {
      id: _id.toString(),
      ...rest,
    };
  }
}
