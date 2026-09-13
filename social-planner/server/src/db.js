import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

let database;

export async function connectDatabase() {
  await client.connect();
  database = client.db(process.env.DATABASE_NAME);
  console.log("MongoDB connected");
}

export function getDatabase() {
  if (!database) {
    throw new Error("Database has not been connected");
  }

  return database;
}