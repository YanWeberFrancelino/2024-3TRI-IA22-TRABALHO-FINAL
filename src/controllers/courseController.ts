import { Request, Response } from 'express';
import { connect } from '../database';

export const listCursos = async (req: Request, res: Response) => {
  try {
    const db = await connect();
    const cursos = await db.all(`SELECT * FROM cursos`);
    res.status(200).json(cursos);
  } catch (error) {
    console.error('Erro ao listar cursos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const getCursoDetalhes = async (req: Request, res: Response) => {
  try {
    const db = await connect();
    const { id } = req.params;

    const curso = await db.get(`SELECT * FROM cursos WHERE id = ?`, [id]);
    if (!curso) {
      res.status(404).json({ error: 'Curso não encontrado.' });
      return;
    }

    const modulos = await db.all(`SELECT * FROM modulos WHERE curso_id = ? ORDER BY ordem`, [id]);

    for (const modulo of modulos) {
      const aulas = await db.all(`SELECT * FROM aulas WHERE modulo_id = ? ORDER BY ordem`, [modulo.id]);

      for (const aula of aulas) {
        const quiz = await db.get(`SELECT * FROM quizzes WHERE aula_id = ?`, [aula.id]);
        if (quiz) {
          const questions = await db.all(`SELECT * FROM quiz_questions WHERE quiz_id = ?`, [quiz.id]);

          const formattedQuestions = questions.map(q => ({
            id: q.id,
            question: q.question,
            options: JSON.parse(q.options),
            correct_option: q.correct_option,
          }));

          aula.quiz = {
            id: quiz.id,
            questions: formattedQuestions,
          };
        } else {
          aula.quiz = null;
        }
      }

      modulo.aulas = aulas;
    }

    curso.modulos = modulos;

    res.status(200).json(curso);
  } catch (error) {
    console.error('Erro ao obter detalhes do curso:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const getAulaDetalhes = async (req: Request, res: Response) => {
    try {
      const db = await connect();
      const { id } = req.params;
  
      const aula = await db.get(`SELECT * FROM aulas WHERE id = ?`, [id]);
      if (!aula) {
        res.status(404).json({ error: 'Aula não encontrada.' });
        return;
      }
  
      const modulo = await db.get(`SELECT curso_id FROM modulos WHERE id = ?`, [aula.modulo_id]);
      if (!modulo) {
        res.status(404).json({ error: 'Módulo da aula não encontrado.' });
        return;
      }
  
      const curso_id = modulo.curso_id;
  
      const quiz = await db.get(`SELECT * FROM quizzes WHERE aula_id = ?`, [aula.id]);
      if (quiz) {
        const questions = await db.all(`SELECT * FROM quiz_questions WHERE quiz_id = ?`, [quiz.id]);
  
        const formattedQuestions = questions.map(q => ({
          id: q.id,
          question: q.question,
          options: JSON.parse(q.options),
          correct_option: q.correct_option,
        }));
  
        aula.quiz = {
          id: quiz.id,
          questions: formattedQuestions,
        };
      } else {
        aula.quiz = null;
      }
  
      aula.curso_id = curso_id;
  
      res.status(200).json(aula);
    } catch (error) {
      console.error('Erro ao obter detalhes da aula:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  };
  
  export default {
    listCursos,
    getCursoDetalhes,
    getAulaDetalhes, 
  };
  
