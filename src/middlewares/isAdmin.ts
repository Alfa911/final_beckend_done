import {createError} from '../helpers/index'
import {Response, NextFunction} from "express";
import {IUser} from "../models/user";

const isAdmin = (req: any, res: Response, next: NextFunction) => {
    const user: IUser = req.user;
    if (!user.isAdmin) {
        return next(createError(403))
    }
    next();
}
export default isAdmin;