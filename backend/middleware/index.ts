import { CustomError } from "../utils/customError";
import jsonwebtoken from "jsonwebtoken";
import { NextRequest } from "next/server";
import { IresponseMiddleware } from "../utils/interface";

export const middleware = async (request: NextRequest): Promise<IresponseMiddleware> => {
  try {
    const token = request.cookies.get("accessToken")?.value;
    if (!token) throw new CustomError("Unauthorized", 401);
    if (!process.env.JWT_SECRET) throw new CustomError("JWT_SECRET not set", 500);
    if (!token) throw new CustomError("Unauthorized: No token provided.", 401);
    const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET) as {
      id: string;
      username: string;
    };
    return { id: payload.id, username: payload.username };
  } catch (error) {
    console.log("Middleware error:", error);
    if (error instanceof jsonwebtoken.JsonWebTokenError) {
      throw new CustomError("Unauthorized: Invalid token.", 401);
    } else if (error instanceof jsonwebtoken.TokenExpiredError) {
      throw new CustomError("Unauthorized: Token has expired.", 401);
    } else if (error instanceof CustomError) {
      throw error;
    } else {
      throw new CustomError("Internal Server Error", 500);
    }
  }
};
