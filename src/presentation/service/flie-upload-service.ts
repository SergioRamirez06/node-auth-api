import path from 'path'
import fs from 'fs';
import { UploadedFile } from "express-fileupload";
import { Uuid } from '../../config';
import { CustomError } from '../../domain';


export class FileUploadService {


    constructor(
        private readonly uuid = Uuid.v4(),
    ){
        
    }

    private checkFolder( folderPath: string ) {
        if( !fs.existsSync( folderPath ) ){
            return fs.mkdirSync( folderPath )
        }
    }

    async uploadSingle(
        file: UploadedFile,
        folder: string = 'uploads',
        validExtenxions: string[] = ['png', 'jpg', 'gif', 'jpeg']
    ) {

        try {
            
            const fileExtension = file.mimetype.split('/').at(1) ?? '';
            if( !validExtenxions.includes(fileExtension) ){
                throw CustomError.badRequest(`invalid extesion: ${fileExtension}, valid one ${ validExtenxions }`)
            }



            const destination = path.resolve( __dirname, '../../../', folder );
            this.checkFolder( destination );

            const fileName = `${ this.uuid }.${ fileExtension }`

            file.mv(`${destination}/${ fileName }`)

            return { fileName }

        } catch (error) {
            throw CustomError.internalServer(`${ error }`)
        }

    }

    async uploadMultiple(
        files: UploadedFile[],
        folder: string = 'uploads',
        validExtenxions: string[] = ['png', 'jpg', 'gif', 'jpeg']
    ){
        const fileNames = await Promise.all(
            files.map( file => this.uploadSingle( file, folder, validExtenxions) )
        );

        return fileNames;
    }
    
}