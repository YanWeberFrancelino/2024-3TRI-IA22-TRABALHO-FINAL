import { Request, Response } from 'express';
import { connect } from '../database';

export const enrollInCurso = async (req: Request, res: Response) => {
  try {
    const db = await connect();
    const usuario_id = (req as any).user.id;
    const { curso_id } = req.body;

    const curso = await db.get(`SELECT * FROM cursos WHERE id = ?`, [curso_id]);
    if (!curso) {
      res.status(404).json({ error: 'Curso não encontrado.' });
      return;
    }

    const existingInscricao = await db.get(
      `SELECT * FROM inscricoes WHERE usuario_id = ? AND curso_id = ?`,
      [usuario_id, curso_id]
    );
    if (existingInscricao) {
      res.status(400).json({ error: 'Você já está inscrito neste curso.' });
      return;
    }

    const ret = await db.run(
      `INSERT INTO inscricoes (usuario_id, curso_id) VALUES (?, ?)`,
      [usuario_id, curso_id]
    );

    res.status(201).json({
      message: 'Inscrição realizada com sucesso!',
      inscricaoId: ret.lastID,
      curso_id,
    });
  } catch (error) {
    console.error('Erro ao inscrever-se no curso:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const listInscricoes = async (req: Request, res: Response) => {
    try {
      const db = await connect();
      const usuario_id = (req as any).user.id;
  
      const inscricoes = await db.all(
        `SELECT 
           cursos.id AS curso_id, 
           cursos.nome, 
           cursos.descricao, 
           cursos.imagem, 
           inscricoes.data_inscricao, 
           inscricoes.progresso, 
           inscricoes.ultimo_acesso
         FROM inscricoes
         JOIN cursos ON inscricoes.curso_id = cursos.id
         WHERE inscricoes.usuario_id = ?`,
        [usuario_id]
      );
  
      res.status(200).json(inscricoes);
    } catch (error) {
      console.error('Erro ao listar inscrições:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  };
  

export default {
  enrollInCurso,
  listInscricoes
};
