import mongoose from "mongoose";
import {Document} from "mongoose";
import Joi from "joi";

export interface ICountry extends Document {
    name: string;
}

const {Schema, model} = mongoose;

let countrySchema = new Schema<ICountry>(
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
countrySchema.post("findOneAndUpdate", handleErrors);
countrySchema.post("updateOne", handleErrors);
countrySchema.post("save", handleErrors);
const Country = model('country', countrySchema);
export const addCountry = Joi.object({
    name: Joi.string().min(3).required(),
});

export default Country;