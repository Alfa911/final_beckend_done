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


router.get('/logout', authenticateUser, ctrlWrapper(authController.logout));

export default router;