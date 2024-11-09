// src/routes/userRoutes.ts
import { Router } from 'express';
import userController from '../controllers/userController';
import { checkToken } from '../middlewares/jwt.middleware';
import userMiddleware from '../middlewares/user.middleware';

const router = Router();

router.get('/', checkToken, userController.listUsers);
router.put(
  '/:id',
  checkToken,
  userMiddleware.validateUserUpdate,
  userController.updateUser
);
router.delete(
  '/:id',
  checkToken,
  userMiddleware.validateUserDeletion,
  userController.deleteUser
);

router.get('/me', checkToken, userController.getCurrentUser);

export default router;
