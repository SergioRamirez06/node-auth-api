import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from "../../domain";
import { CategoryModel } from "../../data";

export class CategoryService {

    constructor(){}

    async createCategory( createCategoryDto: CreateCategoryDto, user: UserEntity ) {

        const categoryExits = await CategoryModel.findOne({ name: createCategoryDto.name });
        if( categoryExits ) throw CustomError.badRequest('category already exists');

        try {

            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id,
            });

            await category.save();

            return {
                id: category.id,
                name: category.name,
                available: category.available
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }
    
    async getCategories( paginationDto: PaginationDto) {

        const { page, limit } = paginationDto;

        try {
            const total =  await CategoryModel.countDocuments();
            const categories = await CategoryModel.find()
            .skip( ( page - 1 ) * limit )
            .limit( limit )
            .lean() as any[];

            // const [total, categories] = await Promise.all([
            //     CategoryModel.countDocuments(),
            //     CategoryModel.find()
            //     .skip( ( page - 1 ) * limit )
            //     .limit( limit )
            // ])

            return {
                page: page,
                limit: limit,
                total: total,
                next: `api/category/?page=${ (page + 1) }&limit=${ limit }`,
                prev: ( page - 1 > 0 ) ? `api/category/?page=${ (page - 1) }&limit=${ limit }` : null,

                categories: categories.map( category => ({
                    id: category.id,
                    name: category.name,
                    available: category.available
                }))
            }

            
        } catch (error) {
            throw CustomError.internalServer('Internal server')
            
        }
    }
}

