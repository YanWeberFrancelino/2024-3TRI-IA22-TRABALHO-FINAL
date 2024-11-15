import { Request, Response } from 'express';
import { connect } from '../database';
import bcrypt from 'bcrypt';
import { signJWT } from '../utils/jwtPromise';

export const register = async (req: Request, res: Response) => {
  try {
    const db = await connect();
    const { name, email, password } = req.body;

    const existingUser = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
    if (existingUser) {
      res.status(400).json({ error: 'Email já está em uso.' });
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const ret = await db.run(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
      [name, email, encryptedPassword]
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso!',
      userId: ret.lastID,
      name,
      email,
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const db = await connect();
    const { email, password } = req.body;

    const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);

    if (!user) {
      res.status(401).json({ error: 'Usuário não encontrado.' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      res.status(401).json({ error: 'Senha incorreta.' });
      return;
    }

    const token = await signJWT({ id: user.id, email: user.email, name: user.name });

    res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
