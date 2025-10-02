import { CustomError } from "../utils/customError";
import {
  Isummary,
  Itransaction,
  ItransactionCategoryRepository,
  ItransactionRepository,
} from "../utils/interface";

export class TransactionService implements ItransactionRepository {
  constructor(private transactionRepository: ItransactionRepository) {}

  async getByID(id: string): Promise<Itransaction | null> {
    return await this.transactionRepository.getByID(id);
  }

  async listByUserID(
    userID: string,
    transactionCategoryRepository: ItransactionCategoryRepository
  ): Promise<Itransaction[]> {
    return await this.transactionRepository.listByUserID(userID, transactionCategoryRepository);
  }

  async listByCategoryID(categoryID: string): Promise<Itransaction[]> {
    return await this.transactionRepository.listByCategoryID(categoryID);
  }

  async create(userID: string, info: Partial<Itransaction>): Promise<void> {
    if (!info.type || !["income", "expense"].includes(info.type))
      throw new CustomError("Invalid or missing transaction type", 400);
    if (!info.date) throw new CustomError("Missing transaction date", 400);
    if (!info.categoryID) throw new CustomError("Missing transaction categoryID", 400);
    if (info.amount === undefined || info.amount === null || isNaN(info.amount))
      throw new CustomError("Invalid or missing transaction amount", 400);
    if (info.amount <= 0)
      throw new CustomError("Transaction amount must be greater than zero", 400);
    if (!info.description) info.description = "";

    await this.transactionRepository.create(userID, info);
  }

  async update(id: string, updateInfo: Partial<Itransaction>): Promise<void> {
    const updateData = { ...updateInfo, updatedAt: new Date().toISOString() };
    await this.transactionRepository.update(id, updateData);
  }

  async delete(id: string): Promise<void> {
    await this.transactionRepository.delete(id);
  }

  async summary(userID: string): Promise<Isummary> {
    return await this.transactionRepository.summary(userID);
  }
}
