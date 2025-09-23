import { mongoClient } from "./mongodb";
import type { Collection } from "mongodb";
import type { Iuser } from "../interface";

const databaseName = process.env.DATABASE_NAME;

if (!databaseName) throw new Error("Database name not provided");

export const userConnection: Collection<Iuser> = mongoClient
  .db(databaseName)
  .collection<Iuser>("users");
