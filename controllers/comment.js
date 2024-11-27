import { db } from "../conect.js";
import jwt from "jsonwebtoken";
import {addCommentNotification,removeCommentnotification} from './notifications.js'
import {formatPostTime} from '../resource/timeformat.js'


export const getComments = (req,res)=>{
    const q = `SELECT u.username,u.profilepic,pc.content,pc.createat FROM post_comments AS pc 
            LEFT JOIN users AS u ON u.userid = pc.userID
            WHERE postId = ?`;

    db.query(q,[req.query.postId],(err,data)=>{
        if(err) return res.status(500).json(err);
        const formattedData = data.map((comment) => ({
            ...comment,
            createat: formatPostTime(comment.createat), // Transform likeduser into an array
          }));
        return res.status(200).json(formattedData);
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
            if(err) return res.status(500).json(err);
            const lastInsertId = data.insertId;
            addCommentNotification(userInfo.id,req.body.postuser,req.body.postId,req.body.content,lastInsertId)
            return res.status(200).json("Comment has been created has been created");
        });
    });
};

export const deletecomment = (req,res) =>{
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not Logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid");
        
    const q = `DELETE FROM post_comments WHERE commenId = ?`;

    db.query(q,[req.body.postId],(err,data)=>{
        if(err) return res.status(500).json(err);
        removeCommentnotification(userInfo.id,req.body.postuser,req.body.postId)
        return res.status(200).json("Comment Has been deleted!")
    })

    })
}