import IRequest from "../types/request";
import {Response} from "express";
import Country from "../models/country";
import Genre from "../models/genre";

type controllerCountry= {
    list: (req: Request, res: Response) => Promise<void | never>
    add: (req: IRequest, res: Response) => Promise<void | never>
    update: (req: IRequest, res: Response) => Promise<void | never>
    delete: (req: IRequest, res: Response) => Promise<void | never>
}
let CountryController: controllerCountry = {
    list: async (req: Request, res: Response): Promise<void | never> => {

        let list = await Country.find({}).sort('name');


        res.status(200).json(list)
    },
    add: async (req: IRequest, res: Response): Promise<void | never> => {
        const {name} = req.body;
        const newCountry = await Country.create({name});
        res.status(200).json(newCountry)
    },
    update: async (req: IRequest, res: Response): Promise<void | never> => {
        const {id} = req.params;
        const {name} = req.body;
        const newCountry = await Country.findOneAndUpdate({_id: id}, {name}, {new: true});
        res.status(200).json(newCountry)
    },
    delete: async (req: IRequest, res: Response): Promise<void | never> => {
        const {id} = req.params;
        const newCountry = await Country.findByIdAndRemove({"_id": id});
        res.status(200).json(newCountry)
    },
}
export default CountryController;