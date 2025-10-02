import { userService } from "@/backend/service/userService";
import { NextRequest } from "next/server";
import { middleware } from "@/backend/middleware";
import { generateAPIResponse } from "@/backend/utils/function";

export const GET = async (request: NextRequest) => {
  try {
    console.log("========== START GET ME =============");

    const { username } = await middleware(request);

    const user = await userService.getByUsername(username);
    const data = {
      name: user?.name,
      username: user?.username,
      isActive: user?.isActive,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
    };

    console.log("========== END GET ME =============");
    return generateAPIResponse(data, 200);
  } catch (error: unknown) {
    console.log("========== ERROR GET ME =============", error);
    if (error instanceof Error) return generateAPIResponse({ message: error.message }, 500);
    return generateAPIResponse(
      { message: (error as { message: string }).message || "Internal Server Error" },
      (error as { status: number }).status || 500
    );
  }
};
