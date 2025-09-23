import { authService } from "@/service/authSertvice";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async (request: NextRequest) => {
  try {
    console.log("========== START LOGIN =============");

    const { username, password } = await request.json();

    const { accessToken, refreshToken } = await authService.login(
      username,
      password
    );

    (await cookies()).set("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60,
    });

    console.log("========== END LOGIN =============");
    return NextResponse.json({ accessToken, refreshToken });
  } catch (error: unknown) {
    console.log("========== ERROR LOGIN =============", error);
    return NextResponse.json(
      {
        message:
          (error as { message: string }).message || "Internal Server Error",
      },
      { status: (error as { status: number }).status || 500 }
    );
  }
};
