import { middleware } from "@/backend/middleware";
import { UserRepository } from "@/backend/repository/userRepository";
import { CustomError } from "@/backend/utils/customError";

import { generateAPIResponse } from "@/backend/utils/function";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    console.log("========== START GET USER INFO =============");

    const params = req.nextUrl.searchParams;
    console.log("🚀 ~ GET ~ params:", params);

    const { username } = await middleware(req);

    if (!username) throw new CustomError("Username not found in token", 400);

    const userRepository = new UserRepository();
    const user = await userRepository.getByUsername(username);

    if (!user) throw new CustomError("User not found", 404);

    const response = {
      name: user.name,
      username: user.username,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    console.log("========== END GET USER INFO =============");
    return generateAPIResponse(response, 200);
  } catch (error) {
    console.log("========== ERROR GET USER INFO =============", error);
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    console.log("========== START UPDATE USER =============");

    const { username } = await middleware(req);

    if (!username) throw new CustomError("Username not found in token", 400);

    const body = await req.json();

    const userRepository = new UserRepository();
    await userRepository.update(username, body);

    console.log("========== END UPDATE USER =============");
    return generateAPIResponse({ message: "User updated successfully." }, 200);
  } catch (error) {
    console.log("========== ERROR UPDATE USER =============", error);
    if (error instanceof CustomError)
      return generateAPIResponse({ message: error.message }, error.status);
    return generateAPIResponse(
      { message: (error as { message: string }).message || "Internal Server Error" },
      (error as { status: number }).status || 500
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    console.log("========== START DELETE USER =============");

    const { username } = await middleware(req);

    if (!username) throw new CustomError("Username not found in token", 400);

    const userRepository = new UserRepository();
    await userRepository.delete(username);

    console.log("========== END DELETE USER =============");
    return generateAPIResponse({ message: "User deleted successfully." }, 200);
  } catch (error) {
    console.log("========== ERROR DELETE USER =============", error);
    if (error instanceof CustomError)
      return generateAPIResponse({ message: error.message }, error.status);
    return generateAPIResponse(
      { message: (error as { message: string }).message || "Internal Server Error" },
      (error as { status: number }).status || 500
    );
  }
};
