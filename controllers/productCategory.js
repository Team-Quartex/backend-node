import {db} from '../conect.js'
import jwt from 'jsonwebtoken'

export const allCategory = (req,res) =>{
  //   const token = req.cookies.accessToken;
  // if (!token) return res.status(401).json("Not Logged in!");

  // jwt.verify(token, "secretkey", (err, userInfo) => {
  //   if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT * FROM product_category`;

    db.query(q,(err,data)=>{
        if(err) return res.status(500).json("Internal Server Error");
        return res.status(200).json(data);
    });

// });
}