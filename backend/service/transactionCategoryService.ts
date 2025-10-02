import { transactionCategoryRepository } from "@/backend/repository/transactionCategoryRepository";
import { ItransactionCategory } from "@/backend/utils/interface";

export class TransactioncategoryService {
  constructor() {}

  async listByuserID(userID: string) {
    return await transactionCategoryRepository.listByuserID(userID);
  }

  async create(userID: string, info: ItransactionCategory) {
    await transactionCategoryRepository.create(userID, info);
  }

  async delete(id: string) {
    await transactionCategoryRepository.delete(id);
  }
}
