import { Injectable } from '@nestjs/common';
import { Database } from 'sqlite';
import openDatabase from './database/database';
import { User } from './user.interface';
import * as bcrypt from 'bcrypt';
import { CreateArticleDto } from './dto/user.dto';

@Injectable()
export class DatabaseService {
  private db: Database | null = null;

  constructor() {
    this.initialize();
  }

  async initialize(): Promise<void> {
    this.db = await openDatabase();
    await this.createUsersTable();
    await this.createArticlesTable();
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    const user = await this.db.get<User>(
      'SELECT * FROM users WHERE email = ?',
      email,
    );
    return user || undefined;
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    const user = await this.db.get<User>(
      'SELECT * FROM users WHERE username = ?',
      username,
    );
    return user || undefined;
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
    const user = await this.findUserByUsername(username);
    if (!user) {
      throw new Error('User creation failed');
    }
    return user;
  }

  async createArticle(
    articleData: CreateArticleDto & { author: string },
  ): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    const { category, isBlockchainSpecific, tags, title, description, author } =
      articleData;
    await this.db.run(
      'INSERT INTO articles (category, isBlockchainSpecific, tags, title, description, author) VALUES (?, ?, ?, ?, ?, ?)',
      category,
      isBlockchainSpecific,
      JSON.stringify(tags),
      title,
      description,
      author,
    );
  }

  private async createUsersTable(): Promise<void> {
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

  private async createArticlesTable(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        isBlockchainSpecific BOOLEAN NOT NULL,
        tags TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        author TEXT NOT NULL
      )
    `);
  }
}
