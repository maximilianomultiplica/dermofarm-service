import { Request, Response, NextFunction } from 'express';

export class ExampleController {
  /**
   * Obtiene un ejemplo de respuesta
   */
  public getExample = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      res.status(200).json({
        success: true,
        message: 'Hola desde el microservicio 🚀',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Crea un nuevo ejemplo (simulado)
   */
  public createExample = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req.body;
      
      // Validación básica
      if (!data || Object.keys(data).length === 0) {
        const error: any = new Error('Se requiere información para crear el ejemplo');
        error.statusCode = 400;
        throw error;
      }

      res.status(201).json({
        success: true,
        message: 'Ejemplo creado correctamente',
        data: {
          ...data,
          id: Date.now(),
          createdAt: new Date().toISOString()
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new ExampleController();