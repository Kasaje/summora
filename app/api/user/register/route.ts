import { userService } from "@/backend/service/userService";
import { CustomError } from "@/backend/utils/customError";
import { generateAPIResponse, getBody } from "@/backend/utils/function";
import { IbodyRegister } from "@/backend/utils/interface";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    console.log("========== START REGISTER =============");

    const { username, password, name } = await getBody<IbodyRegister>(request);

    if (!username || !password || !name) {
      return NextResponse.json(JSON.stringify({ message: "Missing required fields." }), {
        status: 400,
      });
    }

    await userService.register(username, password, {
      username,
      name,
      passwordHash: "",
      isLogin: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log("========== END REGISTER =============");
    return generateAPIResponse({ message: "User registered successfully." }, 201);
  } catch (error: unknown) {
    console.log("========== ERROR REGISTER =============", error);
    if (error instanceof CustomError)
      return generateAPIResponse({ message: error.message }, error.status);
    return generateAPIResponse(
      { message: (error as { message: string }).message || "Internal Server Error" },
      (error as { status: number }).status || 500
    );
  }
};
