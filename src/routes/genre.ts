import express, {NextFunction} from "express";
import {ctrlWrapper} from "../helpers";
import {authenticateUser, isAdmin, validateBody, validateId} from "../middlewares";
import GenreController from "../controllers/genreController";
import {addGenre} from "../models/genre";

const router = express.Router();
router.get('/', authenticateUser, ctrlWrapper(GenreController.list));
router.post('/', authenticateUser, isAdmin, validateBody(addGenre), ctrlWrapper(GenreController.add));
router.put('/:id', authenticateUser, isAdmin, validateId, validateBody(addGenre), ctrlWrapper(GenreController.update));
router.delete('/:id', authenticateUser, isAdmin, validateId, ctrlWrapper(GenreController.delete));
export default router;