import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { config } from './config/env';

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private configureMiddlewares(): void {
    // Seguridad y configuraciones básicas
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    this.app.use(config.apiPrefix, routes);
  }

  private setupErrorHandling(): void {
    // Manejo de rutas no encontradas
    this.app.all('*', notFoundHandler);

    // Middleware de manejo de errores
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${config.port}`);
      console.log(`Entorno: ${config.nodeEnv}`);
    });
  }
}

export default App;