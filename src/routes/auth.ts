import express, {NextFunction} from "express";
import {loginUser, registerUser} from "../models/user";
import {ctrlWrapper} from "../helpers";
import authController from "../controllers/authController";
import {authenticateUser, validateBody} from "../middlewares";
import Passport from "../middlewares/authGoogle";
import {Response} from "express";
import createJwtSession from "../helpers/createJwtSession";

const router = express.Router();
router.post('/register', validateBody(registerUser), ctrlWrapper(authController.register));
router.post('/login', validateBody(loginUser), ctrlWrapper(authController.login));

router.get('/google', Passport.authenticate('google', {scope: ['email']}));
router.get('/google/callback', Passport.authenticate('google', {session: false}),
  async  function (req:any, res:Response) {
      let token = await createJwtSession(req.user);
        res.status(200).send({token});
    });
router.post('/facebook', validateBody(loginUser), ctrlWrapper(authController.login));
router.post('/facebook/callback', validateBody(loginUser), ctrlWrapper(authController.login));
router.get('/logout', authenticateUser, ctrlWrapper(authController.logout));

export default router;