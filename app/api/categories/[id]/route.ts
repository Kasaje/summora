import { middleware } from "@/backend/middleware";
import { TransactionCategoryRepository } from "@/backend/repository/transactionCategoryRepository";
import { TransactionRepository } from "@/backend/repository/transactionRepository";
import { TransactioncategoryService } from "@/backend/service/transactionCategoryService";
import { CustomError } from "@/backend/utils/customError";
import { generateAPIResponse, getBody } from "@/backend/utils/function";
import {
  IbodyCreateCategory,
  IbodyUpdateCategory,
  IparamCategory,
} from "@/backend/utils/interface";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: IparamCategory) => {
  try {
    console.log("========== START LIST CATEGORY BY ID =============");

    const { id } = await middleware(req);
    const { id: categoryID } = params;

    const transactionCategoryRepository = new TransactionCategoryRepository();
    const transactionCategoryService = new TransactioncategoryService(
      transactionCategoryRepository
    );

    if (!id) throw new CustomError("Category ID is required", 400);

    let categoryList;
    if (!categoryID || categoryID === "list")
      categoryList = await transactionCategoryService.listByUserID(id);
    else categoryList = await transactionCategoryService.getByID(categoryID);

    console.log("========== END LIST CATEGORY BY ID =============");
    return generateAPIResponse(categoryList, 200);
  } catch (error) {
    console.log("========== ERROR LIST CATEGORY BY ID =============", error);
    if (error instanceof CustomError)
      return generateAPIResponse({ message: error.message }, error.status);
    return generateAPIResponse(
      { message: (error as { message: string }).message || "Internal Server Error" },
      (error as { status: number }).status || 500
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    console.log("========== START CREATE CATEGORY =============");

    const { id: userID } = await middleware(req);

    const { name } = await getBody<IbodyCreateCategory>(req);

    if (!name) throw new CustomError("Category name is required", 400);

    const transactionCategoryRepository = new TransactionCategoryRepository();
    const transactionCategoryService = new TransactioncategoryService(
      transactionCategoryRepository
    );

    await transactionCategoryService.create(userID, { name });

    console.log("========== END CREATE CATEGORY =============");
    return generateAPIResponse({ message: "Category created successfully." }, 201);
  } catch (error) {
    console.log("========== ERROR CREATE CATEGORY =============", error);
    if (error instanceof CustomError)
      return generateAPIResponse({ message: error.message }, error.status);
    return generateAPIResponse(
      { message: (error as { message: string }).message || "Internal Server Error" },
      (error as { status: number }).status || 500
    );
  }
};

export const PUT = async (req: NextRequest, { params }: IparamCategory) => {
  try {
    console.log("========== START UPDATE CATEGORY =============");

    await middleware(req);

    const { id } = params;

    if (!id) throw new CustomError("Category ID is required", 400);

    const { name } = await getBody<IbodyUpdateCategory>(req);
    if (!name) throw new CustomError("Category name is required", 400);

    const transactionCategoryRepository = new TransactionCategoryRepository();
    const transactionCategoryService = new TransactioncategoryService(
      transactionCategoryRepository
    );

    await transactionCategoryService.update(id, { name });

    console.log("========== END UPDATE CATEGORY =============");
    return generateAPIResponse({ message: "Category updated successfully." }, 200);
  } catch (error) {
    console.log("========== ERROR UPDATE CATEGORY =============", error);
    if (error instanceof CustomError)
      return generateAPIResponse({ message: error.message }, error.status);
    return generateAPIResponse(
      { message: (error as { message: string }).message || "Internal Server Error" },
      (error as { status: number }).status || 500
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: IparamCategory) => {
  try {
    console.log("========== START DELETE CATEGORY =============");

    await middleware(req);

    const { id: categoryID } = params;

    if (!categoryID) throw new CustomError("Category ID is required", 400);

    const transactionRepository = new TransactionRepository();
    const transactionCategoryRepository = new TransactionCategoryRepository();
    const transactionCategoryService = new TransactioncategoryService(
      transactionCategoryRepository
    );

    await transactionCategoryService.delete(categoryID, transactionRepository);

    console.log("========== END DELETE CATEGORY =============");
    return generateAPIResponse({ message: "Category deleted successfully." }, 200);
  } catch (error) {
    console.log("========== ERROR DELETE CATEGORY =============", error);
    if (error instanceof CustomError)
      return generateAPIResponse({ message: error.message }, error.status);
    return generateAPIResponse(
      { message: (error as { message: string }).message || "Internal Server Error" },
      (error as { status: number }).status || 500
    );
  }
};
