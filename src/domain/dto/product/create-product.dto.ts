import { Validators } from "../../../config";


export class CreateProductDto {
    
    private constructor(
        public readonly name: string,
        public readonly price: number,
        public readonly available: boolean,
        public readonly descripcion: string,
        public readonly user: string, //id
        public readonly category: string, // id

    ) {}

    static create( object: { [key: string]: any } ): [string?, CreateProductDto?] {

        const { name, price, available, description, user, category } = object;

        if ( !name ) return ['Missing name'];
        if ( !user ) return ['Missing User'];
        if ( !Validators.isMongoId(user) ) return ['ivalid user id'];
        if ( !category ) return['Misiing category'];
        if ( !Validators.isMongoId(category) ) return ['ivalid category id'];

        return[ undefined, new CreateProductDto(name, price, !!available, description, user, category) ]
    }
}