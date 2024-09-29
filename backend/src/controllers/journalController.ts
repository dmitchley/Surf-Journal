import { Request, Response } from 'express';
import { db } from '../db';
import { Journal } from '../models/journal';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import redis, { createClient } from 'redis';

const generateToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '30d' });
};

// Redis Client Setup
const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});



client.connect().catch((err) => {
  console.error("Failed to connect to Redis", err);
});

export const createJournal = async (req: Request, res: Response): Promise<void> => {
  const { text, time, wave, wave_direction, wind_direction, location, user_id }: Journal = req.body;

  // Handle image file if provided
  const image = req.file ? fs.readFileSync(req.file.path) : null;

  try {
    // Ensure required fields are present
    if (!text || !user_id) {
      res.status(400).json({ message: "Please add required fields: text and user_id" });
      return;
    }

    // Insert the journal entry into the database
    const query = `
      INSERT INTO journal (text, time, wave, wave_direction, wind_direction, location, image, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `;
    const result = await db.query(query, [text, time, wave, wave_direction, wind_direction, location, image, user_id]);

    // Respond with success if the journal was created
    if (result.rows.length > 0) {
      res.status(201).json({
        message: "Journal created successfully",
        id: result.rows[0].id,
      });
    } else {
      res.status(400).json({ message: "Journal creation failed" });
    }
  } catch (err) {
    let error = err as Error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteJournal = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM journal WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Journal entry deleted successfully' });
    } else {
      res.status(404).json({ message: 'Journal entry not found' });
    }
  } catch (err) {
    let error = err as Error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateJournal = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Get journal ID from the route parameters
  const { text, time, wave, wave_direction, wind_direction, location, user_id } = req.body;

  try {
    // Check if required fields are present
    if (!text || !user_id) {
      res.status(400).json({ message: 'Text and user_id are required fields' });
      return;
    }

    // Update the journal entry in the database
    const query = `
      UPDATE journal
      SET text = $1, time = $2, wave = $3, wave_direction = $4, wind_direction = $5, location = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 AND user_id = $8
      RETURNING *;
    `;
    const result = await db.query(query, [text, time, wave, wave_direction, wind_direction, location, id, user_id]);

    // Respond based on whether the journal entry was updated
    if (result.rowCount > 0) {
      res.status(200).json({
        message: 'Journal updated successfully',
        journal: result.rows[0],
      });
    } else {
      res.status(404).json({ message: 'Journal entry not found or unauthorized' });
    }
  } catch (err) {
    let error = err as Error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const addCommentToJournal = async (req: Request, res: Response): Promise<void> => {
  const { journal_id, user_id, text } = req.body;


  if (!journal_id || !user_id || !text) {
    res.status(400).json({ message: 'Journal ID, User ID, and comment text are required' });
    return;
  }

  try {

    const query = `
      INSERT INTO journal_comments (journal_id, user_id, text)
      VALUES ($1, $2, $3)
      RETURNING id, journal_id, user_id, text, created_at;
    `;
    const result = await db.query(query, [journal_id, user_id, text]);

    // Respond with success if the comment was created
    if (result.rows.length > 0) {
      res.status(201).json({
        message: 'Comment added successfully',
        comment: result.rows[0],
      });
    } else {
      res.status(400).json({ message: 'Failed to add comment' });
    }
  } catch (err) {
    let error = err as Error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getAllJournals = async (req: Request, res: Response): Promise<void> => {
  const cacheKey = "all_journals";

  try {

    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      console.log("Returning cached data");
      res.json(JSON.parse(cachedData));
      return;
    }


    const query = `
      SELECT id, text, time, wave, wave_direction, wind_direction, location, user_id
      FROM journal;
    `;
    const result = await db.query(query);


    await client.set(cacheKey, JSON.stringify(result.rows), {
      EX: 3600,
    });

    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: "No journals found" });
    }
  } catch (error) {
    console.error("Error fetching journals or interacting with Redis", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getPersonalJournals = async (req: Request, res: Response): Promise<void> => {
  const { user_id } = req.params;
  const cacheKey = `personal_journals:${user_id}`;

  try {

    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      console.log("Returning cached personal journals");
      res.json(JSON.parse(cachedData));
      return;
    }


    const query = `
      SELECT id, text, time, wave, wave_direction, wind_direction, location, image, user_id, created_at, updated_at
      FROM journal
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await db.query(query, [user_id]);


    if (result.rows.length > 0) {
      await client.set(cacheKey, JSON.stringify(result.rows), {
        EX: 3600,
      });
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: 'No journals found for this user' });
    }
  } catch (err) {
    console.error("Error fetching personal journals or interacting with Redis", err);
    let error = err as Error;
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

