import { db } from "../conect.js";
import jwt from "jsonwebtoken";

export const getComments = (req,res)=>{
    const q = `SELECT * FROM post_comments WHERE postId = ?`;

    db.query(q,[req.query.postId],(err,data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
}

export const addComment = (req, res) => {

    const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "INSERT INTO post_comments (`postId`,`content`,`userId`) VALUES (?)";
    const values = [
        req.body.postId,
        req.body.content,
        userInfo.id
    ]
        db.query(q,[values] ,(err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json("Comment has been created has been created");
        });
    });

};
