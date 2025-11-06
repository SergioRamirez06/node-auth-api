import { CreateProductDto, CustomError, PaginationDto } from "../../domain";
import { ProductModel } from "../../data";

export class ProductService {

    constructor(){}

    async createProduct( createProductDto: CreateProductDto ) {

        const categoryExits = await ProductModel.findOne({ name: createProductDto.name });
        if( categoryExits ) throw CustomError.badRequest('Product already exists');

        try {

            const product = new ProductModel( createProductDto );

            await product.save();

            return product;

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }
    
    async getProduct( paginationDto: PaginationDto) {

        const { page, limit } = paginationDto;

        try {
            const total =  await ProductModel.countDocuments();
            const product = await ProductModel.find()
            .skip( ( page - 1 ) * limit )
            .limit( limit )
            .populate('user')
            .populate('category')

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
                next: `api/product/?page=${ (page + 1) }&limit=${ limit }`,
                prev: ( page - 1 > 0 ) ? `api/product/?page=${ (page - 1) }&limit=${ limit }` : null,

                product: product,
            }

            
        } catch (error) {
            throw CustomError.internalServer('Internal server')
            
        }
    }
}

