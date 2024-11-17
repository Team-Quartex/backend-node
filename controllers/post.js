import { db } from "../conect.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `
        SELECT 
            p.*, 
            u.userid AS UserId, 
            u.name, 
            u.profilePic,
            GROUP_CONCAT(pi.imageLink) AS images
        FROM posts AS p
        JOIN users AS u ON u.userid = p.userId
        LEFT JOIN post_image AS pi ON pi.postId = p.postId
        GROUP BY p.postId, u.userid
        ORDER bY p.postTime DESC;
        `;

        db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);

        // Transform the `images` field from comma-separated string to an array
        const formattedData = data.map((post) => ({
            ...post,
            images: post.images ? post.images.split(",") : [], // Handle null values for posts without images
        }));

        return res.status(200).json(formattedData);
        });
    });
};


export const addPost = (req, res) => {

    const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "INSERT INTO posts (`description`,`location`,`userId`) VALUES (?)";
    const values = [
        req.body.desc,
        req.body.location,
        userInfo.id
    ]
        db.query(q,[values] ,(err, data) => {
            const postId = data.insertId;
            if (err) return res.status(500).json(err);
            if(req.body.images.length===0) return res.status(200).json("Post has been created12");
            for(const image of req.body.images){
                const qimage = "INSERT INTO post_image (`postId`, `imageLink`) VALUES (?)";
                const imageValuse = [
                    postId,
                    image
                ]
                db.query(qimage,[imageValuse],(err,dataimage)=>{
                    if (err) return res.status(500).json(err);
                })
            }
            return res.status(200).json("Post has been created1");
        });
    });

};
