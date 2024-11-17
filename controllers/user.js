import {db} from '../conect.js'
import jwt from 'jsonwebtoken'  

export const topusers=(req,res)=>{
    const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q  = `SELECT userid,username,email,name,profilepic FROM users WHERE verify = 'yes' and userid != ? `;

    db.query(q,[userInfo.id],(err,data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
    })

    })
}