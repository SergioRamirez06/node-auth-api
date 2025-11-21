import { Response, Request } from "express"
import { CustomError } from "../../domain"
import path from "path"
import fs from 'fs';



export class ImageController {


    constructor() {}


     private handleError ( error: unknown, res: Response ) {
        if( error instanceof CustomError ) {
            return res.status( error.statusCode ).json({ error: error.message })
        }

        console.log({error})
        res.status(500).json({ error: 'Internal Server'})
    }

    getImage = (req: Request, res: Response) => {

        const { type = '', img = '' } = req.params;

        const imagePath = path.resolve( __dirname, `../../../uploads/${type}/${img}`)
        console.log(imagePath)

        if( !fs.readFileSync( imagePath) ) {
            return res.status(400).json({error: `no se encuentra el tyoe ${type} and ${img}`} )
        }

        return imagePath
    }
}