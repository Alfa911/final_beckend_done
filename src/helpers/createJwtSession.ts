import jwt from "jsonwebtoken";
import User, {IUser} from "../models/user";
import 'dotenv/config';

const {SECRET_JWT = ''} = process.env;
const createJwtSession = async function (user: IUser) {
    const payload = {id: user._id};
    const token = jwt.sign(payload, SECRET_JWT, {expiresIn: '1h'});
    await User.updateOne({'_id': user.id}, {token: token});
    return token;
};

export default createJwtSession;