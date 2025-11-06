import { Router } from 'express';
import { FileUploadService } from '../service';
import { FileUploadController } from './controller';

export class FileProductRoutes {

  static get routes(): Router {

    const router = Router();


    const productService = new FileUploadService();
    const controller = new FileUploadController(productService)
    
    // Definir las rutas
    router.post('/single/:type',  controller.uploadFile );
    router.post('/fileMultipleUpload/:type', controller.uploadMultipleFiles );

    
    return router;
  }

}

