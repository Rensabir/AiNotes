const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
const dbPath = path.resolve(__dirname, "notes.db");
let db;

function connectToDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("Database connection error:", err.message);
        reject(err);
      } else {
        console.log("Connected to the SQLite database.");
        resolve(db);
      }
    });
  });
}

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        date INTEGER NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0
      )
      `,
      (err) => {
        if (err) {
          console.error("Table creation error:", err.message);
          reject(err);
        } else {
          console.log("Notes table created or already exists.");
          resolve();
        }
      }
    );
  });
}

async function getDb() {
  if (!db) {
    try {
      await connectToDatabase();
      await initializeDatabase();
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error; // Re-throw to prevent further operations
    }
  }
  return db;
}

// API Endpoints (Route Handlers)
app.get("/notes", async (req, res) => {
  try {
    const database = await getDb();
    database.all("SELECT * FROM notes", [], (err, rows) => {
      if (err) {
        console.error("Error fetching notes:", err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log("Sending notes:", rows);
      res.json(rows);
    });
  } catch (error) {
    console.error("Error getting notes:", error);
    res.status(500).json({ error: "Failed to get notes" });
  }
});

app.post("/notes", async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const date = new Date().getTime();
    const database = await getDb();

    database.run(
      "INSERT INTO notes (title, description, category, date, completed) VALUES (?, ?, ?, ?, ?)",
      [title, description, category, date, 0],
      function (err) {
        if (err) {
          console.error("Error creating note:", err.message);
          res.status(500).json({ error: err.message });
        } else {
          const newNote = {
            id: this.lastID,
            title,
            description,
            category,
            date,
            completed: false,
          };
          res.status(201).json(newNote);
        }
      }
    );
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
});

app.put("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;
    const date = new Date().getTime();
    const database = await getDb();

    database.run(
      "UPDATE notes SET title = ?, description = ?, category = ?, date = ? WHERE id = ?",
      [title, description, category, date, id],
      (err) => {
        if (err) {
          console.error("Error updating note:", err.message);
          res.status(500).json({ error: err.message });
        } else {
          const updatedNote = {
            id: parseInt(id),
            title,
            description,
            category,
            date,
          };
          res.json(updatedNote);
        }
      }
    );
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
});

app.delete("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const database = await getDb();

    database.run("DELETE FROM notes WHERE id = ?", [id], (err) => {
      if (err) {
        console.error("Error deleting note:", err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: parseInt(id) });
      }
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

module.exports = app;
