import { Router } from 'express';
import { register, login } from '../controllers/authController';
import userMiddleware from '../middlewares/user.middleware';

const router = Router();

router.post('/register', userMiddleware.validateUserRegistration, register);
router.post('/login', userMiddleware.validateUserLogin, login);

export default router;
