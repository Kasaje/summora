import { userService } from "@/service/userService";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    console.log("========== START REGISTER =============");

    const { username, password, name } = await request.json();

    if (!username || !password || !name) {
      return NextResponse.json(
        JSON.stringify({ message: "Missing required fields." }),
        { status: 400 }
      );
    }

    await userService.register(username, password, {
      username,
      name,
      passwordHash: "",
      isLogin: false,
      status: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log("========== END REGISTER =============");
    return NextResponse.json(
      { message: "User registered." },
      {
        status: 201,
      }
    );
  } catch (error: unknown) {
    console.log("========== ERROR REGISTER =============", error);
    return NextResponse.json(
      {
        message:
          (error as { message: string }).message || "Internal Server Error",
      },
      { status: (error as { status: number }).status || 500 }
    );
  }
};
