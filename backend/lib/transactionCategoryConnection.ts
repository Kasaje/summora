import { mongoClient } from "./mongodb";
import type { Collection } from "mongodb";
import type { ItransactionCategory } from "../utils/interface";

const databaseName = process.env.DATABASE_NAME;

if (!databaseName) throw new Error("Database name not provided");

export const transactionCategoryConnection: Collection<ItransactionCategory> =
  mongoClient
    .db(databaseName)
    .collection<ItransactionCategory>("transactionCategories");
