import { db } from "../conect.js";
import {addLikednotification , removeLikednotification} from './notifications.js'
import jwt from "jsonwebtoken";

export const getLikes = (req,res)=>{
    const q = `SELECT userid FROM post_likes WHERE postId = ?`;

    db.query(q,[req.query.postId],(err,data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json(data.map(like=>like.userid));
    });
}

export const addLike = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not Logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "INSERT INTO post_likes (`postId`,`userId`) VALUES (?)";
    const values = [
        req.body.postId,
        userInfo.id
    ]
        db.query(q,[values] ,(err, data) => {
            if(err) return res.status(500).json(err);
            addLikednotification(userInfo.id,req.body.postuser,req.body.postId);
            // return res.status(200).json("Post has been Liked");
        });
    });

};

export const deleteLike = (req, res) => {
      console.log('hello');

    console.log(req.body.postId);
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not Logged in!");
    jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "DELETE FROM post_likes WHERE `postId`= ? AND `userId`=?";
        db.query(q,[req.body.postId,userInfo.id] ,(err, data) => {
            console.log(err);
            if(err) return res.status(500).json(err);
            removeLikednotification(userInfo.id,req.body.postuser,req.body.postId)
            return res.status(200).json("Post has been Disliked");
        });
    });

};