import { Router } from 'express';
import { AuthMiddlewares } from '../middlewares/auth.middlewares';
import { ProductController } from './controller';
import { ProductService } from '../service/product-service';

export class ProductRoutes {

  static get routes(): Router {

    const router = Router();


    const productService = new ProductService();
    const controller = new ProductController( productService );
    
    // Definir las rutas
    router.get('/',  controller.getProduct );
    router.post('/', [ AuthMiddlewares.validateJWT ], controller.createProduct );


    return router;
  }

}

