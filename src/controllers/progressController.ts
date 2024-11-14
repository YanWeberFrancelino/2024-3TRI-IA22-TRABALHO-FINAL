// src/controllers/progressController.ts
import { Request, Response } from 'express';
import { connect } from '../database';

export const markAulaConcluida = async (req: Request, res: Response) => {
  try {
    const db = await connect();
    const usuario_id = (req as any).user.id;
    const { aula_id } = req.body;

    const aula = await db.get(`SELECT * FROM aulas WHERE id = ?`, [aula_id]);
    if (!aula) {
      res.status(404).json({ error: 'Aula não encontrada.' });
      return;
    }

    const curso = await db.get(`
      SELECT cursos.id AS curso_id
      FROM cursos
      JOIN modulos ON cursos.id = modulos.curso_id
      JOIN aulas ON modulos.id = aulas.modulo_id
      JOIN inscricoes ON cursos.id = inscricoes.curso_id
      WHERE aulas.id = ? AND inscricoes.usuario_id = ?
    `, [aula_id, usuario_id]);

    if (!curso) {
      res.status(403).json({ error: 'Você não está inscrito no curso desta aula.' });
      return;
    }

    const existingProgresso = await db.get(
      `SELECT * FROM progresso WHERE usuario_id = ? AND aula_id = ?`,
      [usuario_id, aula_id]
    );

    if (existingProgresso) {
      if (existingProgresso.concluido) {
        res.status(400).json({ error: 'Aula já marcada como concluída.' });
        return;
      }
      await db.run(
        `UPDATE progresso SET concluido = TRUE, data_conclusao = CURRENT_TIMESTAMP WHERE id = ?`,
        [existingProgresso.id]
      );
    } else {
      await db.run(
        `INSERT INTO progresso (usuario_id, aula_id, concluido, data_conclusao) VALUES (?, ?, TRUE, CURRENT_TIMESTAMP)`,
        [usuario_id, aula_id]
      );
    }

    const totalAulas = await db.get(
      `SELECT COUNT(aulas.id) AS total FROM aulas 
       JOIN modulos ON aulas.modulo_id = modulos.id
       WHERE modulos.curso_id = ?`,
      [curso.curso_id]
    );

    const aulasConcluidas = await db.get(
      `SELECT COUNT(progresso.id) AS concluido FROM progresso
       JOIN aulas ON progresso.aula_id = aulas.id
       JOIN modulos ON aulas.modulo_id = modulos.id
       WHERE progresso.usuario_id = ? AND modulos.curso_id = ? AND progresso.concluido = TRUE`,
      [usuario_id, curso.curso_id]
    );

    const progressoPercentual = totalAulas.total > 0
      ? Math.round((aulasConcluidas.concluido / totalAulas.total) * 100)
      : 0;

    await db.run(
      `UPDATE inscricoes SET progresso = ?, ultimo_acesso = CURRENT_TIMESTAMP WHERE usuario_id = ? AND curso_id = ?`,
      [progressoPercentual, usuario_id, curso.curso_id]
    );

    res.status(200).json({ message: 'Aula marcada como concluída.', progresso: progressoPercentual });
  } catch (error) {
    console.error('Erro ao marcar aula como concluída:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const getProgressoCurso = async (req: Request, res: Response) => {
  try {
    const db = await connect();
    const usuario_id = (req as any).user.id;
    const { curso_id } = req.params;

    const inscricao = await db.get(
      `SELECT * FROM inscricoes WHERE usuario_id = ? AND curso_id = ?`,
      [usuario_id, curso_id]
    );

    if (!inscricao) {
      res.status(404).json({ error: 'Você não está inscrito neste curso.' });
      return;
    }

    const progresso = inscricao.progresso;

    res.status(200).json({ curso_id, progresso });
  } catch (error) {
    console.error('Erro ao obter progresso do curso:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export default {
    markAulaConcluida,
    getProgressoCurso
  };