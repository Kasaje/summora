import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateAPIResponse, getBody } from "@/backend/utils/function";
import { IbodyLogin } from "@/backend/utils/interface";
import { CustomError } from "@/backend/utils/customError";
import { AuthService } from "@/backend/service/authSertvice";
import { UserRepository } from "@/backend/repository/userRepository";

export const POST = async (request: NextRequest) => {
  try {
    console.log("========== START LOGIN =============");

    const body = await getBody<IbodyLogin>(request);
    const { username, password } = body;

    // Initialize repository and service
    const userRepository = new UserRepository();
    const authService = new AuthService(userRepository);

    const { accessToken, refreshToken } = await authService.login(username, password);

    (await cookies()).set("accessToken", accessToken, {
      httpOnly: false,
      maxAge: 60 * 60,
    });

    console.log("========== END LOGIN =============");
    return NextResponse.json({ accessToken, refreshToken });
  } catch (error: unknown) {
    console.log("========== ERROR LOGIN =============", error);
    if (error instanceof CustomError)
      return NextResponse.json({ message: error.message }, { status: error.status });
    return generateAPIResponse(
      { message: (error as { message: string }).message || "Internal Server Error" },
      (error as { status: number }).status || 500
    );
  }
};
