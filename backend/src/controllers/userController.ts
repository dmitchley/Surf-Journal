import express, { Request, Response } from 'express';
import { db } from '../db';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import redis, { createClient } from 'redis';

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

// Connect Redis client
client.connect().catch((err) => {
  console.error("Failed to connect to Redis", err);
});

const generateToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '30d' });
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, role }: User = req.body;

  try {
    if (!username || !email || !password) {
      res.status(400).json({ message: "Please add all fields" });
      return;
    }


    const emailCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }


    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (username, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const result = await db.query(query, [username, email, hashedPassword, role || 'user']);

    if (result.rows.length > 0) {
      res.status(201).json({
        message: "User created successfully",
        id: result.rows[0].id,
        username,
        email,
      });
    } else {
      res.status(400).json({ message: "User creation failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];



    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);


      if (isMatch) {
        const token = generateToken(user.id);



        res.status(200).json({
          id: user.id,
          username: user.username,
          email: user.email,
          token: token,
          role: user.role,
        });
      } else {
        res.status(400).json({ message: "Invalid credentials: password mismatch" });
      }
    } else {
      res.status(400).json({ message: "Invalid credentials: user not found" });
    }
  } catch (error) {
    console.error('Error during login:', error); // Log the error
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};



export const UpdateUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, role }: Partial<User> = req.body; // Allow partial updates
  const userId = req.params.id;

  try {
    const result = await db.query(
      'UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4 RETURNING *',
      [username, email, role, userId]
    );
    const updatedUser = result.rows[0];

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
};

export const updateUserPassword = async (req: Request, res: Response): Promise<void> => {
  const { password } = req.body;
  const userId = req.params.id;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await db.query(
      'UPDATE users SET password = $1 WHERE id = $2 RETURNING *',
      [hashedPassword, userId]
    );

    const updatedUser = result.rows[0];

    if (updatedUser) {
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: "shit" });
  }
};

// admin functions

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;

  try {

    const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }


    await db.query('DELETE FROM users WHERE id = $1', [userId]);
    res.status(200).json({ message: `User ${user.username} deleted` });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const cacheKey = "all_users";

  try {

    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      console.log("Returning cached user data");
      res.status(200).json(JSON.parse(cachedData));
      return;
    }


    const result = await db.query('SELECT id, username, email, password, role FROM users');


    if (result.rows.length > 0) {
      await client.set(cacheKey, JSON.stringify(result.rows), {
        EX: 3600,
      });
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: "No users found" });
    }
  } catch (err) {
    const error = err as Error;
    console.error("Error in getAllUsers:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export const selectPreferences = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const {
    preferred_wave_min,
    preferred_wave_max,
    preferred_wave_direction,
    preferred_wind_direction,
    preferred_location
  } = req.body;

  // Validate input
  if (!preferred_wave_min || !preferred_wave_max || !preferred_wave_direction || !preferred_wind_direction || !preferred_location) {
    res.status(400).json({ message: 'Please provide all preferences' });
    return;
  }

  try {

    const existingPreferences = await db.query('SELECT * FROM user_preferences WHERE user_id = $1', [userId]);

    if (existingPreferences.rows.length > 0) {
      // Update the user's preferences
      const updateQuery = `
        UPDATE user_preferences
        SET preferred_wave_min = $1, preferred_wave_max = $2, preferred_wave_direction = $3,
            preferred_wind_direction = $4, preferred_location = $5, updated_at = NOW()
        WHERE user_id = $6
        RETURNING *;
      `;
      const updatedPreferences = await db.query(updateQuery, [
        preferred_wave_min,
        preferred_wave_max,
        preferred_wave_direction,
        preferred_wind_direction,
        preferred_location,
        userId
      ]);

      res.status(200).json({
        message: 'Preferences updated successfully',
        preferences: updatedPreferences.rows[0]
      });
    } else {
      // Insert new preferences for the user
      const insertQuery = `
        INSERT INTO user_preferences (user_id, preferred_wave_min, preferred_wave_max, preferred_wave_direction, preferred_wind_direction, preferred_location)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const newPreferences = await db.query(insertQuery, [
        userId,
        preferred_wave_min,
        preferred_wave_max,
        preferred_wave_direction,
        preferred_wind_direction,
        preferred_location
      ]);

      res.status(201).json({
        message: 'Preferences saved successfully',
        preferences: newPreferences.rows[0]
      });
    }
  } catch (err) {
    let error = err as Error;
    console.error('Error saving preferences:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getAllUserPreferences = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = `
      SELECT u.id AS user_id, u.username, u.email, p.preferred_wave_min, p.preferred_wave_max, 
             p.preferred_wave_direction, p.preferred_wind_direction, p.preferred_location, 
             p.created_at, p.updated_at
      FROM user_preferences p
      JOIN users u ON p.user_id = u.id;
    `;

    const result = await db.query(query);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ message: 'No user preferences found' });
    }
  } catch (err) {
    let error = err as Error;
    console.error('Error saving preferences:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};