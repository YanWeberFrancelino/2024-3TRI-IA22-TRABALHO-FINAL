// src/routes/userRoutes.ts
import { Router } from 'express';
import userController from '../controllers/userController';
import { checkToken } from '../middlewares/jwt.middleware';
import userMiddleware from '../middlewares/user.middleware';

const router = Router();

router.get('/', checkToken, userController.listUsers);
router.get('/me', checkToken, userController.getCurrentUser);

router.put(
  '/me',
  checkToken,
  userMiddleware.validateUserUpdate,
  userController.updateCurrentUser
);

router.put(
  '/me/password',
  checkToken,
  userMiddleware.validatePasswordChange,
  userController.changePassword
);

router.delete(
  '/me',
  checkToken,
  userMiddleware.validateUserDeletion,
  userController.deleteCurrentUser
);

export default router;
