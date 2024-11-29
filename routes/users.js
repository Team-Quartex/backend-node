import express from 'express'
import { login,register,logOut } from '../controllers/auth.js';
import { topusers, userDetails , addfollower  ,updateduserDetails , otherUserDetails ,recentFollow ,recentPhotos} from '../controllers/user.js';
import { requestverify } from '../controllers/verification.js';

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


router.put('/update',updateduserDetails)

router.get("/otheruser",otherUserDetails)

router.get("/recentFollows",recentFollow)

router.get("/recentPhotos",recentPhotos)

router.post("/reqverify",requestverify)







export default router