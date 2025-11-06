import { Response, Request } from "express"
import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain"
import { CategoryService } from '../service/category-service';



export class CategoryController {


    constructor(
        private categoryService: CategoryService,
    ) {}


     private handleError ( error: unknown, res: Response ) {
        if( error instanceof CustomError ) {
            return res.status( error.statusCode ).json({ error: error.message })
        }

        console.log({error})
        res.status(500).json({ error: 'Internal Server'})
    }

    createCategory = async( req: Request, res: Response ) => {
        const [ error, createCategoryDto ] = CreateCategoryDto.create( req.body )
        if( error ) return res.status(400).json({ error });

        this.categoryService.createCategory( createCategoryDto!, req.body.user )
            .then( category => res.json( category ))
            .catch( error => this.handleError( error, res ) )
            

    }

    getCategories = async( req: Request, res: Response ) => {

        const { page = 1, limit =  5 } = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
        if ( error ) return res.status(400).json({ error });

        this.categoryService.getCategories( paginationDto! )
            .then( categories => res.json( categories ) )
            .catch( error => this.handleError( error, res ) )
    }
}