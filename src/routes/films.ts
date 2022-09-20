import express, {NextFunction} from "express";
import {ctrlWrapper} from "../helpers";
import {authenticateUser, validateBody} from "../middlewares";
import FilmController from "../controllers/filmController";
import {authenticateUserNotRequire} from "../middlewares/authenticate";
import {addFilm} from "../models/film";
import CountryController from "../controllers/countryController";
import GenreController from "../controllers/genreController";
import {addGenre} from "../models/genre";

const router = express.Router();
router.get('/', authenticateUserNotRequire, ctrlWrapper(FilmController.list));
router.post('/', authenticateUser, validateBody(addFilm), ctrlWrapper(FilmController.add));
router.get('/countries', ctrlWrapper(CountryController.list));
router.get('/genre', ctrlWrapper(GenreController.list));
router.post('/genre', validateBody(addGenre), ctrlWrapper(GenreController.add));

export default router;