import { Request, Response } from "express";
import sql from "../models/supaDB";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "worisecretkey";

export const countUsers = async (req: Request, res: Response) => {
  try {
    // Count the number of users in the database
    const result = await sql`SELECT COUNT(*) FROM public.users`;
    console.log("Count result:", result);
    const count = parseInt(result[0].count, 10);   
    // Return the count of users
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    // Fetch all users from the database
    const result = await sql`SELECT * FROM users`;
    const users = result;

    // Return the list of users
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const register = async (req: Request, res: Response): Promise<any> => {
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
    const result = await sql`
      INSERT INTO users (username, email, password) VALUES (${username}, ${email}, ${hashedPassword}) RETURNING *`;
    //3 return message with user ID
    const user = result[0];

    res.status(201).json({ message: "User registered successfully", user });
    return;
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  //1. get username and password from request body
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email and password are required" });
  }

  try {
    //2. check if user exists in the database (using email)
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result[0];

    //3. compare password with hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    //4. generate JWT token
    // const token = "dummy_token"; // Replace with actual JWT generation logic
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "10h",
    });

    //5. return token to the client
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
