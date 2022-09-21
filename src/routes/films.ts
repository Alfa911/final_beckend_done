import express, {NextFunction} from "express";
import {ctrlWrapper} from "../helpers";
import {authenticateUser, validateBody, validateId} from "../middlewares";
import FilmController from "../controllers/filmController";
import {addFilm, changeFavoriteWatch} from "../models/film";

const router = express.Router();
router.get('/', authenticateUser, ctrlWrapper(FilmController.list));
router.post('/', authenticateUser, validateBody(addFilm), ctrlWrapper(FilmController.add));
router.put('/favorite', authenticateUser, validateBody(changeFavoriteWatch), ctrlWrapper(FilmController.favorite));
router.put('/watch', authenticateUser, validateBody(changeFavoriteWatch), ctrlWrapper(FilmController.watch));
router.delete('/:id', authenticateUser, validateId, ctrlWrapper(FilmController.deleteById));
router.delete('/', authenticateUser, validateBody(changeFavoriteWatch), ctrlWrapper(FilmController.deleteMany));

export default router;