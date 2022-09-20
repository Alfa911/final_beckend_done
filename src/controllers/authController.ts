import createError from '../helpers/createError';
import User, {IUser} from '../models/user';
import {Request, Response} from "express";
import bcrypt from "bcryptjs";
import IRequest from "../types/request";
import 'dotenv/config';
import createJwtSession from './../helpers/createJwtSession';

type controllerAuth = {
    register: (req: Request, res: Response) => Promise<void | never>
    login: (req: Request, res: Response) => Promise<void | never>
    logout: (req: IRequest, res: Response) => Promise<void | never>
}
let authController: controllerAuth = {
    register: async (req: Request, res: Response): Promise<void | never> => {
        const {email, password, repeatPassword} = req.body;
        const user: IUser | null = await User.findOne({email});
        if (user) {
            throw createError(409, "User already register");
        }
        if (password !== repeatPassword) {
            throw createError(400, "password and passwordRepeat should be the same");
        }
        const hashPassword = bcrypt.hashSync(password, 8);
        const registerUser = await User.create({email, password: hashPassword});
        res.status(201).json({email: registerUser.email})
    },
    login: async (req: Request, res: Response): Promise<void | never> => {
        const {email, password} = req.body;
        let user = await User.findOne({email});
        if (!user) {
            throw createError(401);
        }
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            throw createError(401);
        }
        let token = await createJwtSession(user);
        res.json({token})
    },
    logout: async (req: IRequest, res: Response): Promise<void | never> => {
        const {id} = req.user;
        await User.findOneAndUpdate({"_id": id}, {token: ""});
        res.json({"message": "Success logout"})

    }

};


export default authController;