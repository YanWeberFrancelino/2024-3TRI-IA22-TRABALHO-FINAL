// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import staticRoutes from './staticRoutes';
import courseRoutes from './courseRoutes'; 

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/cursos', courseRoutes);
router.use('/', staticRoutes);

export default router;
