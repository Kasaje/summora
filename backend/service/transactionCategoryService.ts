import { ItransactionCategory, ItransactionCategoryRepository } from "@/backend/utils/interface";

export class TransactioncategoryService implements ItransactionCategoryRepository {
  constructor(private transactionCategoryRepository: ItransactionCategoryRepository) {}

  async initializeDefaultCategories(userID: string) {
    await this.transactionCategoryRepository.initializeDefaultCategories(userID);
  }

  async listByUserID(userID: string) {
    return await this.transactionCategoryRepository.listByUserID(userID);
  }

  async create(userID: string, info: ItransactionCategory) {
    await this.transactionCategoryRepository.create(userID, info);
  }

  async update(id: string, updateInfo: ItransactionCategory) {
    await this.transactionCategoryRepository.update(id, updateInfo);
  }

  async delete(id: string) {
    await this.transactionCategoryRepository.delete(id);
  }
}
