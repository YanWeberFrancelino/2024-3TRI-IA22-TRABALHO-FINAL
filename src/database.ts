// src/database.ts
import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

let instance: Database | null = null;

export async function connect() {
  if (instance) return instance;

  try {
    const db = await open({
      filename: 'database.sqlite',
      driver: sqlite3.Database
    });
    console.log('Conectado ao banco de dados SQLite.');

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT NOT NULL UNIQUE,
        password TEXT
      )
    `);
    console.log('Tabela "users" verificada/criada.');

    const existingUser = await db.get(`SELECT * FROM users WHERE email = 'susan@mail.com'`);
    if (!existingUser) {
      const password = await bcrypt.hash('123123', 10);
      await db.run(`
        INSERT INTO users (name, email, password) 
        VALUES (?, ?, ?)
      `, ['Susan Bar', 'susan@mail.com', password]);
      console.log('Usuário "Susan Bar" inserido no banco de dados.');
    } else {
      console.log('Usuário "Susan Bar" já existe no banco de dados.');
    }

    instance = db;
    return db;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    throw error;
  }
}
