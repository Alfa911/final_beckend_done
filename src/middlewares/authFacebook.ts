import {Strategy as FacebookStrategy} from 'passport-facebook';
import 'dotenv/config';
import Passport from "passport";
import {createError} from "../helpers";
import User from "../models/user";
import bcrypt from "bcryptjs";

const {FACEBOOK_CLIENT_ID = '', FACEBOOK_CLIENT_SECRET = '', FACEBOOK_CALLBACK = ''} = process.env;
const authUser = async (request: any, accessToken: any, refreshToken: any, profile: any, done: any) => {
    let email = profile.emails[0].value;
    if (!email) {
        return done(createError(400))
    }
    let user = await User.findOne({'email': email});
    console.log('user',user);
    
    if (!user) {
        const password = "not_set";
        const registerUser = await User.create({email: email, password: password});
        console.log('registerUser',registerUser);
        if (!registerUser) {
            return done(createError(400));
        }
        return done(null, registerUser);
    }
    return done(null, user);
};
Passport.use('facebook', new FacebookStrategy({
        passReqToCallback: true,
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL: FACEBOOK_CALLBACK,
        profileFields: ['email']
    }, authUser)
);

export default Passport;