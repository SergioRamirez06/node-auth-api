import { Request, Response } from "express";
import { AuthService } from "../service/auth-service";
import { CustomError, RegisterUserDto, LoginUserDto } from "../../domain";

export class AuthController {

    constructor (
        private authService: AuthService
    ) {}
    
    private handleError ( error: unknown, res: Response ) {
        if( error instanceof CustomError ) {
            return res.status( error.statusCode ).json({ error: error.message })
        }

        console.log({error})
        res.status(500).json({ error: 'Internal Server'})
    }

    registerUser = ( req: Request, res: Response ) => {
        const [error, registerUserDto] = RegisterUserDto.create( req.body );
        if( error ) return res.status(400).json({error});

        this.authService.registerUser(registerUserDto!)
        .then( ( user )  => res.json( user ))
        .catch( error => this.handleError(error, res ) )
    }

    loginUser = ( req: Request, res: Response ) => {
        const [error, loginUserDto] = LoginUserDto.create( req.body )
        if( error ) return res.status(400).json({error});

        this.authService.loginUser(loginUserDto!)
        .then( (user) => res.json( user ) )
        .catch( error => this.handleError( error, res ) )
    }

    emailValidate = ( req: Request, res: Response ) => {

        res.json('emailValidate')
    }
}