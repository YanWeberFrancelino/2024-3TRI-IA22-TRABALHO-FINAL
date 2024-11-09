// routes/index.ts
import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import staticRoutes from './staticRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/', staticRoutes);

export default router;
