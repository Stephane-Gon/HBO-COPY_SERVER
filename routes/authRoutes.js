import express from 'express';

import { register } from '../controllers/auth/registerController.js';
import { handleLogin } from '../controllers/auth/loginController.js';
import { logOut } from '../controllers/auth/logOutController.js';
import { handleRefreshToken } from '../controllers/auth/refreshController.js';
import { updateUser } from '../controllers/auth/updateUserController.js';
import { deleteUser } from '../controllers/auth/deleteUserController.js';

import { verifyJwt } from '../middlewares/verifyJwt.js';

export const router = express.Router()

router.post('/register', register)
router.post('/login', handleLogin)
router.get('/logout', logOut)
router.get('/refresh', handleRefreshToken)
router.put('/update/:id', verifyJwt, updateUser)
router.delete('/delete/:id', verifyJwt, deleteUser)



