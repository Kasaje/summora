import {
  ItransactionCategory,
  ItransactionCategoryRepository,
  ItransactionRepository,
} from "@/backend/utils/interface";
import { CustomError } from "../utils/customError";

export class TransactioncategoryService implements ItransactionCategoryRepository {
  constructor(private transactionCategoryRepository: ItransactionCategoryRepository) {}

  async getByID(id: string): Promise<ItransactionCategory | null> {
    return await this.transactionCategoryRepository.getByID(id);
  }

  async initializeDefaultCategories(userID: string): Promise<void> {
    await this.transactionCategoryRepository.initializeDefaultCategories(userID);
  }

  async listByUserID(userID: string): Promise<ItransactionCategory[]> {
    return await this.transactionCategoryRepository.listByUserID(userID);
  }

  async create(userID: string, info: Partial<ItransactionCategory>): Promise<void> {
    await this.transactionCategoryRepository.create(userID, info);
  }

  async update(id: string, updateInfo: Partial<ItransactionCategory>): Promise<void> {
    await this.transactionCategoryRepository.update(id, updateInfo);
  }

  async delete(id: string, transactionRepository: ItransactionRepository): Promise<void> {
    const category = await transactionRepository.listByCategoryID(id);

    if (category.length > 0)
      throw new CustomError("Cannot delete category with existing transactions", 400);

    await this.transactionCategoryRepository.delete(id, transactionRepository);
  }
}
