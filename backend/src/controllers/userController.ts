import express, { Request, Response } from 'express';
import { db } from '../db';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
  try {


    const result = await db.query('SELECT id, username, email,password, role FROM users');




    if (result.rows.length > 0) {
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

