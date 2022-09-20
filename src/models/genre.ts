import mongoose from "mongoose";
import {Document} from "mongoose";
import Joi from "joi";

export interface IGenre extends Document {
    name: string;
}

const {Schema, model} = mongoose;
let genreSchema = new Schema<IGenre>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        }
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
genreSchema.post("findOneAndUpdate", handleErrors);
genreSchema.post("updateOne", handleErrors);
genreSchema.post("save", handleErrors);
const Genre = model('genre', genreSchema);
export const addGenre = Joi.object({
    name: Joi.string().min(3).required(),
});
export default Genre;