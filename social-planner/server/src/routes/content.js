import express from "express";
import { ObjectId } from "mongodb";
import { getDatabase } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = {};

    if (req.query.accountId) {
      query.accountId = new ObjectId(req.query.accountId);
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.from || req.query.to) {
      query.scheduledDate = {};

      if (req.query.from) {
        query.scheduledDate.$gte = req.query.from;
      }

      if (req.query.to) {
        query.scheduledDate.$lte = req.query.to;
      }
    }

    const content = await getDatabase()
      .collection("content")
      .find(query)
      .sort({ scheduledDate: 1, scheduledTime: 1 })
      .toArray();

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Failed to load content" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      accountId,
      title,
      contentType,
      caption,
      songName,
      hashtags,
      youtubeTitle,
      youtubeDescription,
      youtubeTags,
      quoraQuestion,
      quoraAnswer,
      scheduledDate,
      scheduledTime,
      status,
      sourceType,
      sourceUrl,
      notes,
      publishedUrl
    } = req.body;

    if (!accountId || !title || !contentType) {
      return res.status(400).json({
        message: "Account, title, and content type are required"
      });
    }

    const content = {
      accountId: new ObjectId(accountId),
      title,
      contentType,
      caption: caption || "",
      songName: songName || "",
      hashtags: hashtags || "",
      youtubeTitle: youtubeTitle || "",
      youtubeDescription: youtubeDescription || "",
      youtubeTags: youtubeTags || "",
      quoraQuestion: quoraQuestion || "",
      quoraAnswer: quoraAnswer || "",
      scheduledDate: scheduledDate || "",
      scheduledTime: scheduledTime || "",
      status: status || "Draft",
      sourceType: sourceType || "Original idea",
      sourceUrl: sourceUrl || "",
      notes: notes || "",
      publishedUrl: publishedUrl || "",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await getDatabase()
      .collection("content")
      .insertOne(content);

    res.status(201).json({
      ...content,
      _id: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create content" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "contentType",
      "caption",
      "songName",
      "hashtags",
      "youtubeTitle",
      "youtubeDescription",
      "youtubeTags",
      "quoraQuestion",
      "quoraAnswer",
      "scheduledDate",
      "scheduledTime",
      "status",
      "sourceType",
      "sourceUrl",
      "notes",
      "publishedUrl"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    updates.updatedAt = new Date();

    const result = await getDatabase()
      .collection("content")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: updates }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Content not found" });
    }

    const updatedContent = await getDatabase()
      .collection("content")
      .findOne({ _id: new ObjectId(req.params.id) });

    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: "Failed to update content" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await getDatabase()
      .collection("content")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.json({ message: "Content deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete content" });
  }
});

export default router;