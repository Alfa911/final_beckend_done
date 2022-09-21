import {Strategy as GoogleStrategy} from 'passport-google-oauth2';
import 'dotenv/config';
import Passport from "passport";
import {createError} from "../helpers";
import User from "../models/user";
import bcrypt from "bcryptjs";

const {GOOGLE_CLIENT_ID = '', GOOGLE_CLIENT_SECRET = '', GOOGLE_CALLBACK = ''} = process.env;
const authUser = async (request: any, accessToken: any, refreshToken: any, profile: any, done: any) => {
    if (!profile.email) {
        return done(createError(400))
    }
    let user = await User.findOne({'email': profile.email});
    if (!user) {
        const password = "not_set";
        const registerUser = await User.create({email: profile.email, password: password});
        console.log('registerUser',registerUser);
        if (!registerUser) {
            return done(createError(400));
        }
        return done(null, registerUser);
    }
    return done(null, user);
};
Passport.use('google', new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK,
        passReqToCallback: true
    }, authUser)
);

export default Passport;