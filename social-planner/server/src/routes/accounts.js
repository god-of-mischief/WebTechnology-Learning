import express from "express";
import { ObjectId } from "mongodb";
import { getDatabase } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const accounts = await getDatabase()
      .collection("accounts")
      .find({ active: true })
      .sort({ platform: 1, name: 1 })
      .toArray();

    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: "Failed to load accounts" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, platform, username, profileUrl, color, notes } = req.body;

    if (!name || !platform) {
      return res.status(400).json({
        message: "Account name and platform are required"
      });
    }

    const account = {
      name,
      platform,
      username: username || "",
      profileUrl: profileUrl || "",
      color: color || "#6366f1",
      notes: notes || "",
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await getDatabase()
      .collection("accounts")
      .insertOne(account);

    res.status(201).json({
      ...account,
      _id: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create account" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await getDatabase()
      .collection("accounts")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { active: false, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({ message: "Account archived" });
  } catch (error) {
    res.status(500).json({ message: "Failed to archive account" });
  }
});

export default router;