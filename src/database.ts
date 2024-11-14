// src/database.ts
import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

let instance: Database | null = null;

interface QuizQuestion {
  question: string;
  options: string[];
  correct_option: string;
}

interface Aula {
  titulo: string;
  conteudo: string;
  ordem: number;
  quizzes: QuizQuestion[];
}

interface Modulo {
  nome: string;
  ordem: number;
  aulas: Aula[];
}

interface Curso {
  nome: string;
  descricao: string;
  imagem: string;
  modulos: Modulo[];
}

interface CursosData {
  cursos: Curso[];
}

export async function connect() {
  if (instance) return instance;

  try {
    const db = await open({
      filename: 'database.sqlite',
      driver: sqlite3.Database,
    });
    console.log('Conectado ao banco de dados SQLite.');

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT NOT NULL UNIQUE,
        password TEXT
      );

      CREATE TABLE IF NOT EXISTS cursos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        descricao TEXT,
        imagem TEXT,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS modulos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        curso_id INTEGER NOT NULL,
        nome TEXT NOT NULL,
        ordem INTEGER,
        UNIQUE(curso_id, nome),
        FOREIGN KEY (curso_id) REFERENCES cursos(id)
      );

      CREATE TABLE IF NOT EXISTS aulas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        modulo_id INTEGER NOT NULL,
        titulo TEXT NOT NULL,
        conteudo TEXT,
        ordem INTEGER,
        UNIQUE(modulo_id, titulo),
        FOREIGN KEY (modulo_id) REFERENCES modulos(id)
      );

      CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        aula_id INTEGER NOT NULL,
        FOREIGN KEY (aula_id) REFERENCES aulas(id)
      );

      CREATE TABLE IF NOT EXISTS quiz_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        options TEXT NOT NULL,
        correct_option TEXT NOT NULL,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
      );

      CREATE TABLE IF NOT EXISTS inscricoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        curso_id INTEGER NOT NULL,
        data_inscricao DATETIME DEFAULT CURRENT_TIMESTAMP,
        progresso INTEGER DEFAULT 0,
        ultimo_acesso DATETIME,
        FOREIGN KEY (usuario_id) REFERENCES users(id),
        FOREIGN KEY (curso_id) REFERENCES cursos(id),
        UNIQUE(usuario_id, curso_id)
      );

      CREATE TABLE IF NOT EXISTS progresso (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        aula_id INTEGER NOT NULL,
        concluido BOOLEAN DEFAULT FALSE,
        data_conclusao DATETIME,
        FOREIGN KEY (usuario_id) REFERENCES users(id),
        FOREIGN KEY (aula_id) REFERENCES aulas(id),
        UNIQUE(usuario_id, aula_id)
      );
    `);
    console.log('Tabelas verificadas/criadas.');

    await populateCursos(db);

    const existingUser = await db.get(
      `SELECT * FROM users WHERE email = 'teste@mail.com'`
    );
    if (!existingUser) {
      const password = await bcrypt.hash('123123', 10);
      await db.run(
        `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
        ['Teste', 'teste@mail.com', password]
      );
      console.log('Usuário "Teste" inserido no banco de dados.');
    } else {
      console.log('Usuário "Teste" já existe no banco de dados.');
    }

    instance = db;
    return db;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    throw error;
  }
}

async function populateCursos(db: Database) {
  try {
    const dataPath = path.join(__dirname, '..', 'data', 'cursos.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const cursosData: CursosData = JSON.parse(rawData);

    for (const curso of cursosData.cursos) {
      const cursoExistente = await db.get(
        `SELECT id FROM cursos WHERE nome = ?`,
        [curso.nome]
      );
      let cursoId: number;

      if (cursoExistente) {
        cursoId = cursoExistente.id;
        console.log(`Curso "${curso.nome}" já existe com ID ${cursoId}.`);
      } else {
        const retCurso = await db.run(
          `INSERT INTO cursos (nome, descricao, imagem) VALUES (?, ?, ?)`,
          [curso.nome, curso.descricao, curso.imagem]
        );
        cursoId = retCurso.lastID!;
        console.log(`Curso "${curso.nome}" inserido com ID ${cursoId}.`);
      }

      for (const modulo of curso.modulos) {
        const moduloExistente = await db.get(
          `SELECT id FROM modulos WHERE curso_id = ? AND nome = ?`,
          [cursoId, modulo.nome]
        );
        let moduloId: number;

        if (moduloExistente) {
          moduloId = moduloExistente.id;
          console.log(`Módulo "${modulo.nome}" já existe com ID ${moduloId}.`);
        } else {
          const retModulo = await db.run(
            `INSERT INTO modulos (curso_id, nome, ordem) VALUES (?, ?, ?)`,
            [cursoId, modulo.nome, modulo.ordem]
          );
          moduloId = retModulo.lastID!;
          console.log(`Módulo "${modulo.nome}" inserido com ID ${moduloId}.`);
        }

        for (const aula of modulo.aulas) {
          const aulaExistente = await db.get(
            `SELECT id FROM aulas WHERE modulo_id = ? AND titulo = ?`,
            [moduloId, aula.titulo]
          );
          let aulaId: number;

          if (aulaExistente) {
            aulaId = aulaExistente.id;
            console.log(`Aula "${aula.titulo}" já existe com ID ${aulaId}.`);
          } else {
            const retAula = await db.run(
              `INSERT INTO aulas (modulo_id, titulo, conteudo, ordem) VALUES (?, ?, ?, ?)`,
              [moduloId, aula.titulo, aula.conteudo, aula.ordem]
            );
            aulaId = retAula.lastID!;
            console.log(`Aula "${aula.titulo}" inserida com ID ${aulaId}.`);
          }

          if (aula.quizzes && aula.quizzes.length > 0) {
            const quizExistente = await db.get(
              `SELECT id FROM quizzes WHERE aula_id = ?`,
              [aulaId]
            );
            let quizId: number;

            if (quizExistente) {
              quizId = quizExistente.id;
              console.log(`Quiz para a Aula ID ${aulaId} já existe.`);
            } else {
              const retQuiz = await db.run(
                `INSERT INTO quizzes (aula_id) VALUES (?)`,
                [aulaId]
              );
              quizId = retQuiz.lastID!;
              console.log(`Quiz inserido para a Aula ID ${aulaId}.`);
            }

            for (const question of aula.quizzes) {
              const questionExistente = await db.get(
                `SELECT id FROM quiz_questions WHERE quiz_id = ? AND question = ?`,
                [quizId, question.question]
              );

              if (questionExistente) {
                console.log(`Pergunta "${question.question}" já existe.`);
              } else {
                await db.run(
                  `INSERT INTO quiz_questions (quiz_id, question, options, correct_option) VALUES (?, ?, ?, ?)`,
                  [
                    quizId,
                    question.question,
                    JSON.stringify(question.options),
                    question.correct_option,
                  ]
                );
                console.log(
                  `Pergunta "${question.question}" inserida no Quiz ID ${quizId}.`
                );
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Erro ao popular cursos:', error);
  }
}

export default {
  connect,
};
