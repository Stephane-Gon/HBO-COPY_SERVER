import express from 'express';

import { getUsers } from '../controllers/users/getUsersController.js';
import { verifyJwt } from '../middlewares/verifyJwt.js';

export const router = express.Router()

router.get('/', verifyJwt, getUsers)
