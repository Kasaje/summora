import { middleware } from "@/backend/middleware";
import { TransactionCategoryRepository } from "@/backend/repository/transactionCategoryRepository";
import { TransactionRepository } from "@/backend/repository/transactionRepository";
import { TransactionService } from "@/backend/service/transactionService";
import { CustomError } from "@/backend/utils/customError";
import { generateAPIResponse, getBody } from "@/backend/utils/function";
import { IparamTransaction, Itransaction } from "@/backend/utils/interface";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: IparamTransaction) => {
  try {
    console.log("========== START GET TRANSACTION ==========");

    const { id } = await middleware(req);

    const { id: transactionID } = params;

    const transactionCategoryRepository = new TransactionCategoryRepository();
    const transactionRepository = new TransactionRepository();
    const transactionService = new TransactionService(transactionRepository);

    let response;
    if (!transactionID || transactionID === "list")
      response = await transactionService.listByUserID(id, transactionCategoryRepository);
    else response = await transactionService.getByID(transactionID);

    console.log("========== END GET TRANSACTION ==========");
    return generateAPIResponse(response, 200);
  } catch (error) {
    console.log("========== ERROR GET TRANSACTION ==========", error);
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
    console.log("========== START POST TRANSACTION ==========");

    const { id } = await middleware(req);

    const body = await getBody<Partial<Itransaction>>(req);

    if (!body || Object.keys(body).length === 0) throw new CustomError("No data provided", 400);

    const transactionRepository = new TransactionRepository();
    const transactionService = new TransactionService(transactionRepository);

    await transactionService.create(id, body);

    console.log("========== END POST TRANSACTION ==========");
    return generateAPIResponse({ message: "Transaction created successfully" }, 201);
  } catch (error) {
    console.log("========== ERROR POST TRANSACTION ==========", error);
    if (error instanceof CustomError)
      return generateAPIResponse({ message: error.message }, error.status);
    return generateAPIResponse(
      { message: (error as { message: string }).message || "Internal Server Error" },
      (error as { status: number }).status || 500
    );
  }
};

export const PUT = async (req: NextRequest, { params }: IparamTransaction) => {
  try {
    console.log("========== START PUT TRANSACTION ==========");

    await middleware(req);

    const { id: transactionID } = params;

    const body = await getBody<Partial<Itransaction>>(req);

    if (!transactionID) throw new CustomError("Transaction ID is required", 400);

    const transactionRepository = new TransactionRepository();
    const transactionService = new TransactionService(transactionRepository);

    await transactionService.update(transactionID, body);

    console.log("========== END PUT TRANSACTION ==========");
    return generateAPIResponse({ message: "Transaction updated successfully" }, 200);
  } catch (error) {
    console.log("========== ERROR PUT TRANSACTION ==========", error);
    if (error instanceof CustomError)
      return generateAPIResponse({ message: error.message }, error.status);
    return generateAPIResponse(
      { message: (error as { message: string }).message || "Internal Server Error" },
      (error as { status: number }).status || 500
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: IparamTransaction) => {
  try {
    console.log("========== START DELETE TRANSACTION ==========");

    await middleware(req);

    const { id: transactionID } = params;

    if (!transactionID) throw new CustomError("Transaction ID is required", 400);

    const transactionRepository = new TransactionRepository();
    const transactionService = new TransactionService(transactionRepository);

    await transactionService.delete(transactionID);

    console.log("========== END DELETE TRANSACTION ==========");
    return generateAPIResponse({ message: "Transaction deleted successfully" }, 200);
  } catch (error) {
    console.log("========== ERROR DELETE TRANSACTION ==========", error);
    if (error instanceof CustomError)
      return generateAPIResponse({ message: error.message }, error.status);
    return generateAPIResponse(
      { message: (error as { message: string }).message || "Internal Server Error" },
      (error as { status: number }).status || 500
    );
  }
};
