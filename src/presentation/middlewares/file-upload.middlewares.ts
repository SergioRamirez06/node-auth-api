import { NextFunction, Request, Response } from "express";



export class FileUploadMiddleware {

    static containFile( req: Request, res: Response, next: NextFunction ) {

        if ( !req.files || Object.keys( req.files ).length === 0 ) {
            res.status(400).json({ error: 'seleciona una imagen' })
        }

        if( !Array.isArray( req.files!.file) ) {
            req.body.file = [ req.files!.file ]
        }else{
            req.body.file = req.files!.file
        }

        next();

    }
}