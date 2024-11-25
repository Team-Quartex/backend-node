import express from 'express'
import { login,register,logOut } from '../controllers/auth.js';
import { topusers, userDetails , addfollower , userPost ,updateduserDetails} from '../controllers/user.js';

const router = express.Router();

router.post('/register',register);
// Post - http://localhost:8000/api/users/register body - {"username":"hansaka","email":"hansaka@gmail.com","password":"123456","name":"shana"}

router.post('/login',login);
// POST - http://localhost:8000/api/users/login  body- {"username":"hansaka","password":"123456"}

router.get('/logout',logOut);
// GET - http://localhost:8000/api/users/logout

router.get('/topusers',topusers)

router.get('/userDetails',userDetails)

router.get('/addfollower',addfollower)

router.get('/userposts',userPost)

router.put('/update',updateduserDetails)






export default router