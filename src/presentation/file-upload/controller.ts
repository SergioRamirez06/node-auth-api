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
        const type = req.params.type;
        const file = req.body.file.at(0) as UploadedFile;

        
        this.fileUploadService.uploadSingle( file, `uploads/${type}` )
            .then( upload => res.json( upload ) )
            .catch( error => this.handleError( error, res ) );

    }

    uploadMultipleFiles = async( req: Request, res: Response ) => {
        const type = req.params.type;
        const files = req.body.file as UploadedFile[];


        this.fileUploadService.uploadMultiple( files, `uploads/${type}` )
            .then( upload => res.json( upload ) )
            .catch( error => this.handleError( error, res ) );

    }
}