import express from 'express'
import { login,register,logOut } from '../controllers/auth.js';

const router = express.Router();

router.post('/register',register);
// Post - http://localhost:8000/api/users/register body - {"username":"hansaka","email":"hansaka@gmail.com","password":"123456","name":"shana"}

router.post('/login',login);
// POST - http://localhost:8000/api/users/login  body- {"username":"hansaka","password":"123456"}

router.get('/logout',logOut);
// GET - http://localhost:8000/api/users/logout



export default router