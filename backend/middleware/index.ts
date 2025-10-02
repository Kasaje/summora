import { NextApiRequest } from "next";
import { CustomError } from "../utils/customError";
import jsonwebtoken from "jsonwebtoken";

export const middleware = async (request: NextApiRequest): Promise<{ username: string }> => {
  const token = request.headers["authorization"]?.split(" ")[1];
  if (!token) throw new CustomError("Unauthorized", 401);
  if (!process.env.JWT_SECRET) throw new CustomError("JWT_SECRET not set", 500);
  if (!token) throw new CustomError("Unauthorized: No token provided.", 401);
  const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET) as {
    username: string;
  };
  return { username: payload.username };
};
