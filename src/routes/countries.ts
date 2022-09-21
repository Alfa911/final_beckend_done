import express, {NextFunction} from "express";
import {ctrlWrapper} from "../helpers";
import {authenticateUser, isAdmin, validateBody, validateId} from "../middlewares";
import CountryController from "../controllers/countryController";
import {addCountry} from "../models/country";
import {addGenre} from "../models/genre";
import GenreController from "../controllers/genreController";

const router = express.Router();
router.get('/', authenticateUser, ctrlWrapper(CountryController.list));
router.post('/', authenticateUser, isAdmin, validateBody(addCountry), ctrlWrapper(CountryController.add));
router.put('/:id', authenticateUser, isAdmin, validateId, validateBody(addCountry), ctrlWrapper(CountryController.update));
router.delete('/:id', authenticateUser, isAdmin, validateId, ctrlWrapper(CountryController.delete));
export default router;