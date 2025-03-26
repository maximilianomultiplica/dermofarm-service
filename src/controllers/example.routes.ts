import { Request, Response } from 'express';

export const getExample = (_req: Request, res: Response): void => {
  res.json({ message: 'Hola desde el microservicio 🚀' });
};
