import { Itransaction, ItransactionRepository } from "../utils/interface";
import { transactionConnection } from "../lib/transactionConnection";
import { ObjectId } from "mongodb";

export class TransactionRepository implements ItransactionRepository {
  constructor() {}

  async getById(id: string): Promise<Itransaction | null> {
    return (await transactionConnection.findOne<Itransaction>({ _id: new ObjectId(id) })) || null;
  }

  async listByUserID(userID: string): Promise<Itransaction[]> {
    return await transactionConnection.find({ userID }).sort({ createdAt: -1 }).toArray();
  }

  async listByCategoryID(categoryID: string): Promise<Itransaction[]> {
    return await transactionConnection
      .find({ categoryID: new ObjectId(categoryID) })
      .sort({ createdAt: -1 })
      .toArray();
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
}
