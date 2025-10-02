import { middleware } from "@/backend/middleware";
import { UserRepository } from "@/backend/repository/userRepository";
import { UserService } from "@/backend/service/userService";
import { CustomError } from "@/backend/utils/customError";
import { generateAPIResponse } from "@/backend/utils/function";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    console.log("========== START GET /api/auth/me ==========");

    const { id } = await middleware(req);

    if (!id) throw new CustomError("Unauthorized", 401);

    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);

    const user = await userService.getByID(id);

    console.log("========== END GET /api/auth/me ==========");
    return generateAPIResponse(user, 200);
  } catch (error) {
    console.log("========== ERROR in GET /api/auth/me ==========", error);
    if (error instanceof CustomError)
      return generateAPIResponse({ message: error.message }, error.status);
    return generateAPIResponse(
      { message: (error as { message: string }).message || "Internal Server Error" },
      (error as { status: number }).status || 500
    );
  }
};
