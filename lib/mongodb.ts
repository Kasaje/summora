import { MongoClient } from "mongodb";

const mongoDBConnectionString = process.env.MONGODB_CONNECTION_STRING;

if (!mongoDBConnectionString)
  throw new Error("MongoDB connection string not provided");

const client = new MongoClient(mongoDBConnectionString);

export const mongoClient = client;
