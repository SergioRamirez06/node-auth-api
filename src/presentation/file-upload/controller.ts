import { Response, Request } from "express"
import { CustomError } from "../../domain"
import { FileUploadService } from "../service";
import { UploadedFile } from "express-fileupload";



export class FileUploadController {


    constructor(
        private fileUploadService: FileUploadService,
    ) {}


     private handleError ( error: unknown, res: Response ) {
        if( error instanceof CustomError ) {
            return res.status( error.statusCode ).json({ error: error.message })
        }

        console.log({error})
        res.status(500).json({ error: 'Internal Server'})
    }

    uploadFile = async( req: Request, res: Response ) => {
        const files =  req.files;
        if ( !files || Object.keys( files ).length === 0 ) {
            res.status(400).json({ error: 'seleciona una imagen' })
        }

        const file = req.files!.file as UploadedFile;

        this.fileUploadService.uploadSingle( file )
            .then( upload => res.json( upload ) )
            .catch( error => this.handleError( error, res ) );

    }

    uploadMultipleFiles = async( req: Request, res: Response ) => {
        res.json('fileMultipleUpload')
    }
}