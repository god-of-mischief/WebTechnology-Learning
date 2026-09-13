import express from 'express';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DB_NAME || 'study_roulette';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let booksCol;

async function seedIfEmpty() {
  const count = await booksCol.countDocuments();
  if (count > 0) return;

  await booksCol.insertMany([
    {
      title: 'Biology',
      chapters: ['Cell Structure', 'Genetics', 'Evolution'],
      createdAt: new Date()
    },
    {
      title: 'Mathematics',
      chapters: ['Algebra', 'Calculus', 'Probability'],
      createdAt: new Date()
    },
    {
      title: 'History',
      chapters: ['Ancient Civilizations', 'Medieval World', 'Modern Era'],
      createdAt: new Date()
    }
  ]);
}

async function start() {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);
  booksCol = db.collection('books');

  await seedIfEmpty();

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/books', async (_req, res) => {
    const books = await booksCol.find({}).sort({ createdAt: -1 }).toArray();
    res.json(books);
  });

  app.post('/api/books', async (req, res) => {
    const title = String(req.body.title || '').trim();
    const chapters = Array.isArray(req.body.chapters)
      ? req.body.chapters.map(c => String(c).trim()).filter(Boolean)
      : [];

    if (!title) {
      return res.status(400).json({ error: 'Book title is required' });
    }

    const doc = { title, chapters, createdAt: new Date() };
    const result = await booksCol.insertOne(doc);

    res.status(201).json({ _id: result.insertedId, ...doc });
  });

  app.delete('/api/books/:id', async (req, res) => {
    try {
      const result = await booksCol.deleteOne({ _id: new ObjectId(req.params.id) });
      if (!result.deletedCount) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json({ ok: true });
    } catch {
      res.status(400).json({ error: 'Invalid book id' });
    }
  });

  app.post('/api/books/:id/chapters', async (req, res) => {
    const chapter = String(req.body.chapter || '').trim();
    if (!chapter) {
      return res.status(400).json({ error: 'Chapter is required' });
    }

    try {
      const result = await booksCol.findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $push: { chapters: chapter } },
        { returnDocument: 'after' }
      );

      if (!result) {
        return res.status(404).json({ error: 'Book not found' });
      }

      res.json(result);
    } catch {
      res.status(400).json({ error: 'Invalid book id' });
    }
  });

  app.delete('/api/books/:id/chapters/:index', async (req, res) => {
    try {
      const bookId = new ObjectId(req.params.id);
      const index = Number(req.params.index);

      if (!Number.isInteger(index) || index < 0) {
        return res.status(400).json({ error: 'Invalid chapter index' });
      }

      const book = await booksCol.findOne({ _id: bookId });
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      if (!Array.isArray(book.chapters) || index >= book.chapters.length) {
        return res.status(404).json({ error: 'Chapter not found' });
      }

      book.chapters.splice(index, 1);
      await booksCol.updateOne(
        { _id: bookId },
        { $set: { chapters: book.chapters } }
      );

      res.json({ ok: true });
    } catch {
      res.status(400).json({ error: 'Invalid request' });
    }
  });

  app.get('/api/random-pick', async (_req, res) => {
    const books = await booksCol.find({}).toArray();
    const pool = [];

    for (const book of books) {
      for (const chapter of book.chapters || []) {
        pool.push({
          bookId: String(book._id),
          bookTitle: book.title,
          chapter
        });
      }
    }

    if (!pool.length) {
      return res.status(400).json({ error: 'No chapters available' });
    }

    const pick = pool[Math.floor(Math.random() * pool.length)];
    res.json(pick);
  });

  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.listen(port, () => {
    console.log(`Study Roulette running on port ${port}`);
  });
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});