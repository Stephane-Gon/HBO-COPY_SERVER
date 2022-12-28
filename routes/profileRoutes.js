import express from 'express';

import { deletePersona } from '../controllers/profile/deletePersonaController.js';
import { updatePersona } from '../controllers/profile/updatePersonaController.js';
import { addPersona } from '../controllers/profile/addPersonaController.js';
import { addPin } from '../controllers/profile/addPinController.js';
import { checkPin } from '../controllers/profile/checkPinController.js';
import { replacePin } from '../controllers/profile/replacePinController.js';
import { addFavorite } from '../controllers/profile/addFavouriteController.js';
import { deleteFavorite } from '../controllers/profile/deleteFavoriteController.js';

export const router = express.Router()
router.post('/add', addPersona)
router.put('/update/:personaId', updatePersona)
router.delete('/delete/:personaId', deletePersona)
router.post('/pin/add', addPin)
router.post('/pin/check', checkPin)
router.put('/pin/replace', replacePin)
router.post('/favorite/add', addFavorite)
router.delete('/favorite/delete', deleteFavorite)
