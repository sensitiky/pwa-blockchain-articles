import { Injectable } from '@nestjs/common';
import { open, Database } from 'sqlite';
import { User } from './user.interface';

@Injectable()
export class DatabaseService {
  private db: Database;

  constructor() {}

  async initialize() {
    this.db = await open({
      filename: 'database.sqlite',
      driver: require('sqlite3').verbose().Database,
    });

    await this.createUsersTable();
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.db.get('SELECT * FROM users WHERE email = ?', email);
  }

  async createUser(userData: User): Promise<void> {
    const { username, email, password } = userData;
    await this.db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      username,
      email,
      password,
    );
  }

  private async createUsersTable() {
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
      )
    `);
  }

  async addUsernameColumn() {
    await this.db.run(`
      ALTER TABLE users
      ADD COLUMN username TEXT NOT NULL DEFAULT ''
    `);
  }
}
