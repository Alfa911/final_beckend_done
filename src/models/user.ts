import mongoose from "mongoose";
import {Document} from "mongoose";
import Joi from "joi";

export interface IUser extends Document {
    email: string;
    password: string;
    token: string;
    isAdmin: boolean,
    favorite: any,
    watch: any,
}

const {Schema, model} = mongoose;

const emailRegex = new RegExp(/^[\w\-\.]+[\w]+@([\w-]+\.)+[a-zA-Z]*$/);
let userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            match: emailRegex
        },
        password: {
            type: String,
            required: true,
        },
        token: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        favorite: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'film',
                required: true
            }
        ],
        watch: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'film',
                required: true
            }
        ]
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
userSchema.post("findOneAndUpdate", handleErrors);
userSchema.post("updateOne", handleErrors);
userSchema.post("save", handleErrors);
const User = model('user', userSchema);

export const registerUser = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(3).required(),
    repeatPassword: Joi.string().min(3).required(),
});
export const loginUser = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});
export default User;