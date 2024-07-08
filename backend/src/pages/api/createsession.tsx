import { NextApiRequest, NextApiResponse } from 'next';
import openDatabase from '../../database/database';

interface User {
  id: number;
  username: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username, password } = req.body; // Assuming username and password come in the request body
    const db = await openDatabase();

    // Authenticate the user (you'll need to implement this logic)
    const user: User | null = await authenticateUser(username, password);
    if (!user) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Generate sessionId and createdAt
    const sessionId = generateSessionId();
    const createdAt = new Date();

    // Insert the session into the database
    await db.run(
      'INSERT INTO sessions (sessionId, userId, createdAt) VALUES (?, ?, ?)',
      sessionId,
      user.id,
      createdAt.toISOString(), // Save the date as an ISO string
    );

    res.status(200).json({ sessionId, user: { username: user.username } });
  } catch (error) {
    console.error('Error inserting session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Function to authenticate the user (you'll need to implement this logic)
async function authenticateUser(username: string, password: string): Promise<User | null> {
  // For demonstration purposes, assume the username and password are correct
  // In a real-world scenario, you would query your database to check the credentials
  if (username === 'johnDoe' && password === 'password123') {
    return { id: 1, username: 'johnDoe' };
  } else {
    return null;
  }
}

// Function to generate sessionId (you can implement your specific logic here)
function generateSessionId(): string {
  // For demonstration purposes, generate a random sessionId
  // In a real-world scenario, you would use a more secure method to generate the sessionId
  return Math.random().toString(36).substr(2, 9);
}