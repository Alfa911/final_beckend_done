import {Strategy as GoogleStrategy} from 'passport-google-oauth2';
import 'dotenv/config';
import Passport from "passport";
import {createError} from "../helpers";
import User from "../models/user";
import bcrypt from "bcryptjs";

const {GOOGLE_CLIENT_ID = '', GOOGLE_CLIENT_SECRET = ''} = process.env;
const authUser = async (request: any, accessToken: any, refreshToken: any, profile: any, done: any) => {
    if (!profile.email) {
        return done(createError(400))
    }
    let user = await User.find({'email': profile.email});
    if (!user) {
        const password = "";
        const hashPassword = bcrypt.hashSync(password, 8);
        const registerUser = await User.create({email: profile.email, password: hashPassword});
        return done(null, registerUser);
    }
    return done(null, user);
};
Passport.use('google', new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback: true
    }, authUser)
);

export default Passport;