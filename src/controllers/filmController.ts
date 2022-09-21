import {Request, Response} from "express";
import IRequest from "../types/request";
import Film from "../models/film";
import User, {IUser} from "../models/user";
import {createError} from "../helpers";

type controllerFilm = {
    list: (req: IRequest, res: Response) => Promise<void | never>
    add: (req: IRequest, res: Response) => Promise<void | never>
    favorite: (req: IRequest, res: Response) => Promise<void | never>
    watch: (req: IRequest, res: Response) => Promise<void | never>
    deleteById: (req: IRequest, res: Response) => Promise<void | never>
    deleteMany: (req: IRequest, res: Response) => Promise<void | never>
}

function prepareUpdate(idsList: [], listUser: [string]): any {

    let oldList: [] = [];
    // @ts-ignore
    listUser.forEach((element) => oldList.push(element.toString()));

    return idsList.filter(x => !oldList.includes(x))
        .concat(oldList.filter(x => !idsList.includes(x)));
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
    favorite: async (req: IRequest, res: Response): Promise<void | never> => {
        const user: IUser = req.user;
        let {id} = req.body;
        let diff = prepareUpdate(id, user.favorite);
        let newUser = await User.findByIdAndUpdate(user.id,
            {favorite: diff}, {new: true});
        if (!newUser) {
            throw createError(400);
        }
        res.json({"list": newUser.favorite})

    },
    watch: async (req: IRequest, res: Response): Promise<void | never> => {
        const user = req.user;
        const {id} = req.body;
        let diff = prepareUpdate(id, user.watch);
        const newUser: IUser | null = await User.findByIdAndUpdate(user.id, {watch: diff}, {new: true});
        if (!newUser) {
            throw createError(400);
        }
        res.json({"list": newUser.watch})
    },
    deleteById: async (req: IRequest, res: Response): Promise<void | never> => {
        const {id} = req.params;
        let result = await Film.findByIdAndRemove({"_id": id});
        if (!result) {
            throw createError(404);
        }
        await User.updateMany({}, {$pull: {favorite: id, watch: id}});
        res.json(result)
    },
    deleteMany: async (req: IRequest, res: Response): Promise<void | never> => {
        const {id} = req.params;
        let result = await Film.deleteMany({"_id": id});
        if (!result) {
            throw createError(404);
        }
        await User.updateMany({}, {$pull: {favorite: id, watch: id}});
        res.json(result)
    },

}

export default FilmController;