import { Router } from 'express';
import courseController from '../controllers/courseController';
import enrollmentController from '../controllers/enrollmentController';
import progressController from '../controllers/progressController';
import { checkToken } from '../middlewares/jwt.middleware';
import { validateEnrollment, validateProgress } from '../middlewares/course.middleware';
import courseMiddleware from '../middlewares/course.middleware';

const router = Router();

router.get('/inscricoes', checkToken, enrollmentController.listInscricoes);

// Rotas públicas
router.get('/', courseController.listCursos);
router.get('/aulas/:id', courseController.getAulaDetalhes);

router.get('/:id', courseMiddleware.validateCourseId, courseController.getCursoDetalhes);

// Rotas protegidas
router.post('/inscrever', checkToken, validateEnrollment, enrollmentController.enrollInCurso);
router.post('/progresso/concluir', checkToken, validateProgress, progressController.markAulaConcluida);
router.get('/progresso/:curso_id', checkToken, progressController.getProgressoCurso);

export default router;
