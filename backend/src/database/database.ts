import { open, Database } from 'sqlite';

async function openDatabase(): Promise<Database> {
  const db = await open({
    filename: 'database.sqlite',
    driver: require('sqlite3').verbose().Database
  });
  return db;
}

export default openDatabase;
