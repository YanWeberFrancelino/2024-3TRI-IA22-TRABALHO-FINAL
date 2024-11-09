// src/routes/staticRoutes.ts
import { Router } from 'express';
import path from 'path';

const router = Router();
const publicPath = path.join(__dirname, '../../public');

router.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'acesso-publico.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(publicPath, 'login.html'));
});

router.get('/registrar', (req, res) => {
  res.sendFile(path.join(publicPath, 'registrar.html'));
});

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(publicPath, 'acesso-privado.html'));
});

router.get('*', (req, res) => {
  res.status(404).sendFile(path.join(publicPath, '404.html'));
});

export default router;
