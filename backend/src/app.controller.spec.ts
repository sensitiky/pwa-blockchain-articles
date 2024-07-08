import { Database } from 'sqlite';
import openDatabase  from './database/database'; 

describe('Database Tests', () => {
  let db: Database;

  beforeAll(async () => {
    db = await openDatabase();
  });

  afterAll(async () => {
    await db.close(); 
  });

  it('should open the SQLite database', async () => {
    expect(db).toBeDefined();
  });

});