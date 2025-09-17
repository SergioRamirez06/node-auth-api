import { BcryptAdapter, JwtAdapter } from '../../config';
import { UserModel } from '../../data';
import { CustomError, RegisterUserDto, UserEntity, LoginUserDto } from '../../domain';

export class AuthService {


    constructor() {}


    public async registerUser ( registerUserDto: RegisterUserDto ) {

        const emailExists = await UserModel.findOne({ email: registerUserDto.email });
        if( emailExists ) throw CustomError.badRequest('El correo ingresado ya se encuentra registrado. Intenta con otro email.')

        try {
            const user = new UserModel( registerUserDto );

            user.password = BcryptAdapter.hash( registerUserDto.password );
            await user.save();

            const { password, ...userEntity } = UserEntity.fromObject(user);

            const token = await JwtAdapter.generateToke({ user: user.id, name: user.name, email: user.email })
            if( !token ) throw CustomError.internalServer('No se recibió el token de autenticación')


            return {
                user: userEntity,
                token: token,
            }; 
            
        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
            
        }

    }

    public async loginUser(loginUserDto: LoginUserDto) {
        const user = await UserModel.findOne({ email: loginUserDto.email });
        if (!user) throw CustomError.badRequest('El correo no está registrado');

        const isPassword = BcryptAdapter.compare(loginUserDto.password, user.password);
        if (!isPassword) throw CustomError.badRequest('Contraseña equivocada');

        const { password, ...userEntity } = UserEntity.fromObject(user);

        const token = await JwtAdapter.generateToke({ id: user.id, name: user.name, email: user.email })
        if( !token ) throw CustomError.internalServer('No se recibió el token de autenticación')

        return {
            user: userEntity,
            token: token,
        }
    };
}