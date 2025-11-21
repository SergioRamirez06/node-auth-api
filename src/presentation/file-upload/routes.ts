import { Router } from 'express';
import { FileUploadService } from '../service';
import { FileUploadController } from './controller';
import { FileUploadMiddleware } from '../middlewares/file-upload.middlewares';
import { TypesMiddleware } from '../middlewares/types.middlewares';

export class FileProductRoutes {

  static get routes(): Router {

    const router = Router();


    const productService = new FileUploadService();
    const controller = new FileUploadController(productService)

    router.use( FileUploadMiddleware.containFile )
    router.use( TypesMiddleware.validTypes(['users', 'products', 'categories']))
    
    // Definir las rutas
    router.post('/single/:type',  controller.uploadFile );
    router.post('/Multiple/:type', controller.uploadMultipleFiles );

    
    return router;
  }

}

