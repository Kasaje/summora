import { userService } from "@/backend/service/userService";
import { NextRequest, NextResponse } from "next/server";
import { middleware } from "@/backend/middleware";

export const GET = async (request: NextRequest) => {
  try {
    console.log("========== START GET ME =============");

    const { username } = await middleware(request);

    const user = await userService.getByUsername(username);

    console.log("========== END GET ME =============");
    return NextResponse.json(
      {
        name: user?.name,
        username: user?.username,
        isActive: user?.isActive,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.log("========== ERROR GET ME =============", error);
    return NextResponse.json(
      {
        message: (error as { message: string }).message || "Internal Server Error",
      },
      { status: (error as { status: number }).status || 500 }
    );
  }
};
