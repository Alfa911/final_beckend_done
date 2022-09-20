import {Request, Response} from "express";
import IRequest from "../types/request";
import Film from "../models/film";
import User, {IUser} from "../models/user";
import {createError} from "../helpers";
type controllerFilm = {
    list: (req: IRequest, res: Response) => Promise<void | never>
    add: (req: IRequest, res: Response) => Promise<void | never>
    addFavorite: (req: IRequest, res: Response) => Promise<void | never>
    removeFavorite: (req: IRequest, res: Response) => Promise<void | never>
    addWatch: (req: IRequest, res: Response) => Promise<void | never>
    removeWatch: (req: IRequest, res: Response) => Promise<void | never>
}
let FilmController: controllerFilm = {
    list: async (req: IRequest, res: Response): Promise<void | never> => {
        const user: IUser = req.user;
        let {perPage = 10, page = 1} = req.query;

        let list = await Film.find({}).limit(+perPage)
            .skip(+perPage * (+page - 1))
            .sort('-createdOn')
            .populate('country')
            .populate('genre')
        .select('-owner');
        let result = {
            list: list,
            page: page,
            perPage: perPage,
            favorite: [],
            watch: [],
        };
        if (user) {
            result.favorite = user.favorite ? user.favorite : [];
            result.watch = user.watch ? user.watch : [];
        }

        res.status(200).json(result)
    },

    add: async (req: IRequest, res: Response): Promise<void | never> => {
        const user: IUser = req.user;
        const {name, year, country, genre, links} = req.body;
        const newFilm = await Film.create({name, year, country, genre, links, owner: user.id});
        res.status(200).json(newFilm)
    },
    addFavorite: async (req: IRequest, res: Response): Promise<void | never> => {
        const user = req.user;
        const {id} = req.body;
        const newUser: IUser | null = await User.findByIdAndUpdate(user.id, {$push: {favorite: [id]}}, {new: true});
        if (!newUser) {
            throw createError(400);
        }
        res.json({"list": newUser.favorite})

    },
    removeFavorite: async (req: IRequest, res: Response): Promise<void | never> => {

        const user = req.user;
        const {id} = req.body;
        const newUser: IUser | null = await User.findByIdAndUpdate(user.id, {$pull: {favorite: [id]}}, {new: true});
        if (!newUser) {
            throw createError(400);
        }
        res.json({"list": newUser.favorite})

    },
    addWatch: async (req: IRequest, res: Response): Promise<void | never> => {
        const user = req.user;
        const {id} = req.body;
        const newUser: IUser | null = await User.findByIdAndUpdate(user.id, {$push: {watch: [id]}}, {new: true});
        if (!newUser) {
            throw createError(400);
        }
        res.json({"list": newUser.watch})

    },
    removeWatch: async (req: IRequest, res: Response): Promise<void | never> => {
        const user = req.user;
        const {id} = req.body;
        const newUser: IUser | null = await User.findByIdAndUpdate(user.id, {$pull: {watch: [id]}}, {new: true});
        if (!newUser) {
            throw createError(400);
        }
        res.json({"list": newUser.watch})


    }
}

export default FilmController;