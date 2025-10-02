import { mongoClient } from "./mongodb";
import type { Collection } from "mongodb";
import type { Itransaction } from "../utils/interface";

const databaseName = process.env.DATABASE_NAME;

if (!databaseName) throw new Error("Database name not provided");

export const transactionConnection: Collection<Itransaction> = mongoClient
  .db(databaseName)
  .collection<Itransaction>("transactions");
