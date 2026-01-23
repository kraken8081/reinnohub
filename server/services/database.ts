import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the database file location exists
const dbPath = path.join(__dirname, '../../server/data.db');

let db: Database | null = null;

export async function getDb() {
  if (db) {
    return db;
  }

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      url TEXT NOT NULL,
      imageUrl TEXT,
      tags TEXT, -- Stored as JSON string array
      content TEXT, -- Full article content
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS project_images (
      id TEXT PRIMARY KEY,
      source_url TEXT UNIQUE,
      data BLOB NOT NULL,
      mime_type TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // Migration: Check if content column exists, if not add it
  try {
    await db.exec('ALTER TABLE projects ADD COLUMN content TEXT');
  } catch (e) {
    // Column likely already exists
  }

  return db;
}

// Initialize DB on start
getDb().then(() => {
  console.log('Database initialized successfully');
}).catch(err => {
  console.error('Failed to initialize database:', err);
});
