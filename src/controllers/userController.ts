// src/controllers/userController.ts
import { Request, Response } from 'express';
import { connect } from '../database';
import bcrypt from 'bcrypt';

export const listUsers = async (req: Request, res: Response) => {
  try {
    const db = await connect();
    const users = await db.all(`SELECT id, name, email FROM users`);
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const db = await connect();
    const { id } = req.params;
    const { name, email, password } = req.body;

    const existingUser = await db.get(`SELECT * FROM users WHERE id = ?`, [id]);
    if (!existingUser) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    const updates = [];
    const params: any[] = [];

    if (name) {
      updates.push('name = ?');
      params.push(name);
    }

    if (email) {
      updates.push('email = ?');
      params.push(email);
    }

    if (password) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      params.push(encryptedPassword);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'Nenhum dado para atualizar.' });
      return;
    }

    params.push(id);

    await db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const db = await connect();
    const { id } = req.params;

    const ret = await db.run(`DELETE FROM users WHERE id = ?`, [id]);

    if (ret.changes === 0) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    res.status(200).json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const db = await connect();
    const userId = (req as any).user.id; 

    const user = await db.get(`SELECT id, name, email FROM users WHERE id = ?`, [userId]);

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};



export default {
  listUsers,
  getCurrentUser,
  updateUser,
  deleteUser,
};