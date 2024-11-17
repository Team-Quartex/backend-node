import { db } from "../conect.js";
import jwt from "jsonwebtoken";

export const getsavedpost = (req,res)=>{

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not Logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT 
                    p.*, 
                    u.userid AS UserId, 
                    u.name, 
                    u.profilePic,
                    GROUP_CONCAT(pi.imageLink) AS images
                FROM posts AS p
                JOIN users AS u ON u.userid = p.userId
                LEFT JOIN post_image AS pi ON pi.postId = p.postId
                WHERE p.postId IN (
                    SELECT postId FROM saved_posts WHERE userId = ?
                )
                GROUP BY p.postId, u.userid
                ORDER BY p.postTime DESC;
                `;

                db.query(q,[userInfo.id],(err,data)=>{
                if(err) return res.status(500).json(err);

                const formattedData = data.map((post) => ({
                    ...post,
                    images: post.images ? post.images.split(",") : [], // Handle null values for posts without images
                }));

                return res.status(200).json(formattedData);
                });
    }); 
}

export const addsavedpost = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not Logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "INSERT INTO saved_posts (`postId`,`userId`) VALUES (?)";
    const values = [
        req.body.postId,
        userInfo.id
    ]
        db.query(q,[values] ,(err, data) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json("Post has been add to Savelist");
        });
    });

};

export const reomvesavedpost = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not Logged in!");
    jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "DELETE FROM saved_posts WHERE `postId`= ? AND `userId`=?";
        db.query(q,[req.query.postId,userInfo.id] ,(err, data) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json("Post removed in saved list");
        });
    });

};