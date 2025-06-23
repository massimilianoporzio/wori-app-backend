import { Request, Response } from "express";
import pool from "../models/db";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "worisecretkey";

export const register = async (req: Request, res: Response) => {
  //1. get username, email and password from request body
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username, email and password are required" });
  }
  //2. insert username and password into the database
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Store the user in the database
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );
    //3 return message with user ID
    const user = result.rows[0];

    res.status(201).json({ message: "User registered successfully", user });
    return;
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  //1. get username and password from request body
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    //2. check if user exists in the database (using email)
    const result = await pool.query(
      "SELECT id, password FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = result.rows[0];

    //3. compare password with hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    //4. generate JWT token
    const token = "dummy_token"; // Replace with actual JWT generation logic
    // const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    //5. return token to the client
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
