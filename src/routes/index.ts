import { Router } from 'express';
import exampleRoutes from './example.routes';

const router = Router();

// Documentación de rutas principales
/**
 * @route /api/ejemplo
 * @desc Rutas de ejemplo
 */
router.use('/ejemplo', exampleRoutes);

// Agregar más rutas según sea necesario
// router.use('/usuarios', usuarioRoutes);
// router.use('/productos', productoRoutes);

export default router;
