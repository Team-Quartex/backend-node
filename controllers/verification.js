import {db} from '../conect.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const approve=(req,res)=>{
    const token = req.cookies.accessTokenAdmin;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyAdmin", (err, admin) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `UPDATE verifiction_request SET status = 'approve' WHERE requestId=?`;
    db.query(q,[req.body.requestId], (err, data) => {
      if (err) return res.status(500).json(err);
      const uq = `UPDATE users SET verify = 'yes' WHERE userid= ?`;

      db.query(uq,[req.body.userid],(err,data)=>{
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    });
  });
}

export const decline=(req,res)=>{
    const token = req.cookies.accessTokenAdmin;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyAdmin", (err, admin) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `UPDATE verifiction_request SET status = 'decline' WHERE requestId=?`;
    db.query(q,[req.body.requestId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
}