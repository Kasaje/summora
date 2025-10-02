import { NextRequest } from "next/server";
import { CustomError } from "./customError";

export const generateAPIResponse = (data: unknown, status: number) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

export const getBody = async <T>(request: NextRequest): Promise<T> => {
  try {
    const body = await request.json();
    if (!Object.keys(body).length) throw new CustomError("Body not found.", 400);
    return body as T;
  } catch (error) {
    throw new CustomError("Body not found.", 400);
  }
};
