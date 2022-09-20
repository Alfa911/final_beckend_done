import mongoose from "mongoose";
import {Document} from "mongoose";
import Joi from "joi";

export interface IFilm extends Document {
    name: string;
    owner: any;
    year: number;
    country: any;
    genre: any;
    links: any;
    favorite?: boolean,
    watch?: boolean,
}

const {Schema, model} = mongoose;

let filmSchema = new Schema<IFilm>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        year: {type: Number, min: 1895, max: (new Date()).getFullYear()},
        links: [String],
        country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'country',
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        genre: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'genre',
            required: true
        }],
    }
);

interface ErrorStatus extends Error {
    status?: number
    code: number
}

let handleErrors = (error: ErrorStatus, next: (error?: ErrorStatus) => void): void => {
    if (error && error instanceof Error) {
        error.status = 400;
        let {name, code} = error;
        if (code === 11000 || name === 'MongoServerError') {
            error.status = 409;
        }
        return next(error);
    }
    next();
};
filmSchema.post("findOneAndUpdate", handleErrors);
filmSchema.post("updateOne", handleErrors);
filmSchema.post("save", handleErrors);
const Film = model('film', filmSchema);
export const addFilm = Joi.object({
    name: Joi.string().min(3).required(),
    year: Joi.number().min(1895).max((new Date()).getFullYear()).required(),
    links: Joi.array().required(),
    genre: Joi.array().required(),
    country: Joi.string().required(),
});

export default Film;