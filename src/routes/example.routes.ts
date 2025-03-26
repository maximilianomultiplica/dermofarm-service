import { Router } from 'express';
import exampleController from '../controllers/example.controller';

const router = Router();

/**
 * @route GET /api/ejemplo
 * @desc Obtiene un ejemplo de respuesta
 */
router.get('/', exampleController.getExample);

/**
 * @route POST /api/ejemplo
 * @desc Crea un nuevo ejemplo
 */
router.post('/', exampleController.createExample);

export default router;
