import express, {NextFunction, Response} from "express";
import passport from "../middlewares/authFacebook";
import Passport from "../middlewares/authGoogle";
import createJwtSession from "../helpers/createJwtSession";
const router = express.Router();
router.get('/', passport.authenticate('facebook', {scope: ['email']}));
router.get('/callback', Passport.authenticate('facebook', {session: false}),
    async function (req: any, res: Response) {
        let token = await createJwtSession(req.user);
        res.status(200).send({token});
    });

export default router;