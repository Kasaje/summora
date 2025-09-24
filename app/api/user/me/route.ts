import { userService } from "@/service/userService";
import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from "jsonwebtoken";

export const POST = async (request: NextRequest) => {
  try {
    console.log("========== START GET ME =============");

    if (!process.env.JWT_SECRET)
      throw { message: "JWT_SECRET not set", status: 500 };

    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided." },
        { status: 401 }
      );
    }

    const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET) as {
      username: string;
    };
    const username = payload.username as string;

    const user = await userService.getByUsername(username);

    console.log("========== END GET ME =============");
    return NextResponse.json(
      {
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
        message:
          (error as { message: string }).message || "Internal Server Error",
      },
      { status: (error as { status: number }).status || 500 }
    );
  }
};
