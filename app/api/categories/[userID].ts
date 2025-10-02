import { middleware } from "@/backend/middleware";
import { TransactioncategoryService } from "@/backend/service/transactionCategoryService";
import { CustomError } from "@/backend/utils/customError";
import { generateAPIResponse } from "@/backend/utils/function";
import { NextApiRequest, NextApiResponse } from "next";

export const GET = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    console.log("========== START LIST CATEGORIES =============");

    await middleware(request);

    const userID = request.query.userID;

    if (!userID) throw new CustomError("UserID is required", 400);
    if (typeof userID !== "string") throw new CustomError("UserID must be a string", 400);

    const transactionCategoryService = new TransactioncategoryService();
    const categories = await transactionCategoryService.listByuserID(userID);

    console.log("========== END LIST CATEGORIES =============");
    return generateAPIResponse(categories, 200);
  } catch (error) {
    console.log("========== ERROR LIST CATEGORIES =============", error);
    if (error instanceof CustomError)
      return generateAPIResponse({ message: error.message }, error.status);
    return generateAPIResponse({ message: "Internal Server Error" }, 500);
  }
};
