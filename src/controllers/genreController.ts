import IRequest from "../types/request";
import {Response} from "express";
import Genre from "../models/genre";

type controllerGenre = {
    list: (req: Request, res: Response) => Promise<void | never>
    add: (req: IRequest, res: Response) => Promise<void | never>
}
let GenreController: controllerGenre = {
    list: async (req: Request, res: Response): Promise<void | never> => {
        let list = await Genre.find({}).sort('name');
        res.status(200).json(list)
    },
    add: async (req: IRequest, res: Response): Promise<void | never> => {
        const {name} = req.body;
        const newCountry = await Genre.create({name});
        res.status(200).json(newCountry)
    },
}
export default GenreController;