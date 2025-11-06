import { Router } from 'express';
import { AuthMiddlewares } from '../middlewares/auth.middlewares';
import { CategoryService } from '../service/category-service';
import { CategoryController } from './controller';

export class CategoryRoutes {

  static get routes(): Router {

    const router = Router();


    const categoryService = new CategoryService();
    const controller = new CategoryController( categoryService );
    
    // Definir las rutas
    router.get('/',  controller.getCategories );
    router.post('/', [ AuthMiddlewares.validateJWT ], controller.createCategory );


    return router;
  }

}

