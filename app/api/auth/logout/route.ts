import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    console.log("========== START LOGOUT =============");

    const response = new Response(JSON.stringify({ message: "Logged out" }), {
      status: 200,
    });

    response.headers.append(
      "Set-Cookie",
      `accessToken=; HttpOnly; Path=/; Max-Age=0`
    );
    response.headers.append(
      "Set-Cookie",
      `refreshToken=; HttpOnly; Path=/; Max-Age=0`
    );

    console.log("========== END LOGOUT =============");
    return response;
  } catch (error: unknown) {
    console.log("========== ERROR LOGOUT =============", error);
    return NextResponse.json(
      {
        message:
          (error as { message: string }).message || "Internal Server Error",
      },
      { status: (error as { status: number }).status || 500 }
    );
  }
};
