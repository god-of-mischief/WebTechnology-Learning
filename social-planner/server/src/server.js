import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./db.js";
import accountsRouter from "./routes/accounts.js";
import contentRouter from "./routes/content.js";

import { connectDatabase, getDatabase } from "./db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Social Planner API is running" });
});

app.use("/api/accounts", accountsRouter);
app.use("/api/content", contentRouter);

const port = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });

  //temp
  app.get("/api/debug/database", async (req, res) => {
  try {
    const database = getDatabase();

    const collections = await database
      .listCollections()
      .toArray();

    const accountCount = await database
      .collection("accounts")
      .countDocuments();

    res.json({
      databaseName: database.databaseName,
      collections: collections.map((collection) => collection.name),
      accountCount
    });
  } catch (error) {
    res.status(500).json({
      message: "Database diagnostic failed",
      error: error.message
    });
  }
});