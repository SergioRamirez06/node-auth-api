import { BcryptAdapter, envs, JwtAdapter } from '../../config';
import { UserModel } from '../../data';
import { CustomError, RegisterUserDto, UserEntity, LoginUserDto } from '../../domain';
import { EmailService } from './email-service';

export class AuthService {


    constructor(
        private readonly emailService: EmailService,
    ) {}


    public async registerUser ( registerUserDto: RegisterUserDto ) {

        const emailExists = await UserModel.findOne({ email: registerUserDto.email });
        if( emailExists ) throw CustomError.badRequest('El correo ingresado ya se encuentra registrado. Intenta con otro email.')

        try {
            const user = new UserModel( registerUserDto );

            user.password = BcryptAdapter.hash( registerUserDto.password );
            await user.save();

            await this.sendEmailValidatoLink( user.email );

            const { password, ...userEntity } = UserEntity.fromObject(user);

            const token = await JwtAdapter.generateToke({ user: user.id })
            if( !token ) throw CustomError.internalServer('No se recibió el token de autenticación')


            return {
                user: userEntity,
                token: token,
            }; 
            
        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
            
        }

    }

    public async loginUser( loginUserDto: LoginUserDto ) {
        const user = await UserModel.findOne({ email: loginUserDto.email });
        if ( !user ) throw CustomError.badRequest('El correo no está registrado');

        const isPassword = BcryptAdapter.compare( loginUserDto.password, user.password );
        if ( !isPassword ) throw CustomError.badRequest('Password no valido');

        const { password, ...userEntity } = UserEntity.fromObject( user );

        const token = await JwtAdapter.generateToke({ id: user.id })
        if( !token ) throw CustomError.internalServer('No se recibió el token de autenticación')

        return {
            user: userEntity,
            token: token,
        }
    };

    private async sendEmailValidatoLink ( email: string ) {
        const token = await JwtAdapter.generateToke({ email });
        if( !token ) throw CustomError.internalServer('Token No creado');

        const link = `${ envs.WEBSERVICE_URL }/auth/email-validate/${ token }`;
        const html = `
               <!doctype html>
                <html lang="es">
                <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <title>Confirma tu correo</title>
                <style>
                @media only screen and (max-width: 480px) {
                    .container { width: 100% !important; padding: 20px !important; }
                    .btn { width: 100% !important; box-sizing: border-box; }
                }
                </style>
                </head>
                <body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;">
                    <tr>
                    <td align="center" style="padding:30px 16px;">
                        <table width="600" class="container" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="padding:16px 24px;background:linear-gradient(90deg,#6C63FF,#4AB3FF);color:#fff;">
                            <img src="https://via.placeholder.com/100x30?text=Logo" alt="Logo" width="100" style="display:block;border:0;">
                            </td>
                        </tr>

                        <!-- Contenido -->
                        <tr>
                            <td style="padding:32px 24px;text-align:center;">
                            <h2 style="margin:0 0 12px;color:#111827;">Hola {{name}} 👋</h2>
                            <p style="margin:0 0 20px;color:#6b7280;">Confirma tu correo para activar tu cuenta en <strong>[NombreApp]</strong>.</p>
                            <a href="${ link }" target="_blank" class="btn" style="display:inline-block;padding:12px 22px;background:linear-gradient(90deg,#6C63FF,#4AB3FF);color:#fff;border-radius:6px;text-decoration:none;font-weight:600;">Confirmar correo</a>
                            <p style="margin:20px 0 0;font-size:13px;color:#9ca3af;">Si no funciona, copia este enlace: <br><a href="{{confirmation_link}}" style="color:#4AB3FF;">{{confirmation_link}}</a></p>
                            <h1>${ email }</h1>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding:16px 24px;text-align:center;font-size:12px;color:#9ca3af;background:#fafafa;">
                            © <span id="year">2025</span> [NombreApp]. Todos los derechos reservados.
                            </td>
                        </tr>

                        </table>
                    </td>
                    </tr>
                </table>
                </body>
                </html>

        `

        const options = {
            to: email,
            subject: 'Email De Confirmacion',
            htmlBody: html
        }

        const isSend = await this.emailService.sendEmail(options);
        if( !isSend ) throw CustomError.internalServer('Correo no enviado');
        
        return true;

    }

    public async emailValidate( token: string ) {

        const payload = await JwtAdapter.validateToken(token)
        if( !payload ) throw CustomError.badRequest('token no valido');

        const { email } = payload as { email: string };
        if( !email ) throw CustomError.badRequest('email de token no es valido');

        const user = await UserModel.findOne({ email });
        if( !user ) throw CustomError.internalServer('user no existe');

        user.emailValidate =  true;
        await user.save();

        return true

    }
}