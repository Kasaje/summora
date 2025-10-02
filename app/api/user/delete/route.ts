import { userService } from "@/backend/service/userService";
import { NextRequest } from "next/server";
import { middleware } from "@/backend/middleware";
import { CustomError } from "@/backend/utils/customError";
import { generateAPIResponse } from "@/backend/utils/function";

export const DELETE = async (request: NextRequest) => {
  try {
    console.log("========== START DELETE USER =============");

    const { username } = await middleware(request);

    if (!username) throw new CustomError("Username not found in token", 400);

    await userService.delete(username);

    console.log("========== END DELETE USER =============");
    return generateAPIResponse({ message: "User deleted successfully." }, 200);
  } catch (error: unknown) {
    console.log("========== ERROR DELETE USER =============", error);
    if (error instanceof CustomError)
      return generateAPIResponse({ message: error.message }, error.status);
    return generateAPIResponse(
      { message: (error as { message: string }).message || "Internal Server Error" },
      (error as { status: number }).status || 500
    );
  }
};
