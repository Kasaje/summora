import { userService } from "@/backend/service/userService";
import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from "jsonwebtoken";

export const DELETE = async (request: NextRequest) => {
  try {
    console.log("========== START DELETE USER =============");

    if (!process.env.JWT_SECRET) throw { message: "JWT_SECRET not set", status: 500 };

    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized: No token provided." }, { status: 401 });
    }

    const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET) as {
      username: string;
    };

    const username = payload.username as string;
    if (!username) {
      return NextResponse.json({ message: "Unauthorized: Invalid token." }, { status: 401 });
    }

    await userService.delete(username);

    console.log("========== END DELETE USER =============");
    return NextResponse.json({ message: "User deleted successfully." }, { status: 200 });
  } catch (error: unknown) {
    console.log("========== ERROR DELETE USER =============", error);
    return NextResponse.json(
      {
        message: (error as { message: string }).message || "Internal Server Error",
      },
      { status: (error as { status: number }).status || 500 }
    );
  }
};
