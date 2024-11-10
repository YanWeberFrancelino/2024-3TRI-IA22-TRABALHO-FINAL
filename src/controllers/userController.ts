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

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const db = await connect();
    const userId = (req as any).user.id;

    const user = await db.get(`SELECT id, name, email FROM users WHERE id = ?`, [
      userId,
    ]);

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

export const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const db = await connect();
    const userId = (req as any).user.id;
    const { name, email } = req.body;

    const existingUser = await db.get(`SELECT * FROM users WHERE id = ?`, [
      userId,
    ]);
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
      const emailExists = await db.get(
        `SELECT * FROM users WHERE email = ? AND id != ?`,
        [email, userId]
      );
      if (emailExists) {
        res.status(400).json({ error: 'Email já está em uso.' });
        return;
      }
      updates.push('email = ?');
      params.push(email);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'Nenhum dado para atualizar.' });
      return;
    }

    params.push(userId);

    await db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    res.status(200).json({ message: 'Dados atualizados com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const db = await connect();
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await db.get(`SELECT * FROM users WHERE id = ?`, [userId]);
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      res.status(401).json({ error: 'Senha atual incorreta.' });
      return;
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    await db.run(`UPDATE users SET password = ? WHERE id = ?`, [
      encryptedPassword,
      userId,
    ]);

    res.status(200).json({ message: 'Senha alterada com sucesso!' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const deleteCurrentUser = async (req: Request, res: Response) => {
  try {
    const db = await connect();
    const userId = (req as any).user.id;
    const { password } = req.body;

    const user = await db.get(`SELECT * FROM users WHERE id = ?`, [userId]);

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      res.status(401).json({ error: 'Senha incorreta.' });
      return;
    }

    await db.run(`DELETE FROM users WHERE id = ?`, [userId]);

    res.status(200).json({ message: 'Conta apagada com sucesso!' });
  } catch (error) {
    console.error('Erro ao apagar usuário:', error);
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

export default {
  listUsers,
  getCurrentUser,
  updateCurrentUser,
  changePassword,
  deleteCurrentUser,
  updateUser,
  deleteUser,
};


