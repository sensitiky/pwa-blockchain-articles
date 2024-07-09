import { Injectable } from '@nestjs/common';
import { Database } from 'sqlite';
import openDatabase from './database/database';
import { User } from './user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseService {
  private db: Database | null = null;

  constructor() {}

  async initialize(): Promise<void> {
    this.db = await openDatabase();
    await this.createUsersTable();
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db.get('SELECT * FROM users WHERE email = ?', email);
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db.get('SELECT * FROM users WHERE username = ?', username);
  }

  async createUser(userData: User): Promise<User> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    const { username, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      username,
      email,
      hashedPassword,
    );
    return this.findUserByUsername(username);
  }

  private async createUsersTable() {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
      )
    `);
  }
}
