import { db } from "../conect.js";
import jwt from "jsonwebtoken";
import {formatPostTime} from '../resource/timeformat.js'

export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT p.*, u.userid AS UserId, u.name, u.profilePic, u.verify, 
        COUNT(DISTINCT pc.postId) AS comments, GROUP_CONCAT(DISTINCT pl.userId) AS likeduser, -- Use DISTINCT here 
        GROUP_CONCAT(DISTINCT pi.imageLink) AS images, 
        CASE WHEN uf.folowing_by IS NOT NULL THEN 'yes' ELSE 'no' END AS isFollowed, 
        CASE WHEN sp.userId IS NOT NULL THEN 'yes' ELSE 'no' END AS isSaved 
        FROM posts AS p JOIN users AS u ON u.userid = p.userId 
        LEFT JOIN post_image AS pi ON pi.postId = p.postId 
        LEFT JOIN post_likes AS pl ON pl.postId = p.postId 
        LEFT JOIN post_comments AS pc ON pc.postId = p.postId 
        LEFT JOIN user_follows AS uf ON uf.follow = u.userid AND uf.folowing_by = ? 
        LEFT JOIN saved_posts AS sp ON sp.postId = p.postId AND sp.userId = ? 
        GROUP BY p.postId, u.userid 
        ORDER BY p.postTime DESC`;

        db.query(q,[userInfo.id,userInfo.id], (err, data) => {
        if (err) return res.status(500).json(err);

        // Transform the `images` field from comma-separated string to an array
        const formattedData = data.map((post) => ({
            ...post,
            images: post.images ? post.images.split(",") : [], // Transform images into an array
            likeduser: post.likeduser ? post.likeduser.split(",") : [],
            postTime: formatPostTime(post.postTime), // Transform likeduser into an array
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

export const userPost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not Logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid");
  
      const q = `SELECT 
                      p.*, 
                      u.userid AS UserId, 
                      u.name, 
                      u.profilePic,
                      u.verify,
                      COUNT(DISTINCT pc.postId) AS comments,
                      GROUP_CONCAT(DISTINCT pl.userId) AS likeduser, -- Use DISTINCT here
                      GROUP_CONCAT(pi.imageLink) AS images,
                      CASE 
                          WHEN uf.folowing_by IS NOT NULL THEN 'yes'
                          ELSE 'yes'
                      END AS isFollowed,
                      CASE WHEN sp.userId IS NOT NULL THEN 'yes' ELSE 'no' END AS isSaved 
                  FROM posts AS p
                  JOIN users AS u ON u.userid = p.userId
                  LEFT JOIN post_image AS pi ON pi.postId = p.postId
                  LEFT JOIN post_likes AS pl ON pl.postId = p.postId
                  LEFT JOIN post_comments AS pc ON pc.postId = p.postId
                  LEFT JOIN 
                      user_follows AS uf ON uf.follow = u.userid AND uf.folowing_by = ?
                  LEFT JOIN saved_posts AS sp ON sp.postId = p.postId AND sp.userId = ?
                  where u.userid = ?
                  GROUP BY p.postId, u.userid
                  ORDER BY p.postTime DESC`;
  
      db.query(q, [userInfo.id,userInfo.id, req.query.uid], (err, data) => {
        if (err) return res.status(500).json(err);
  
        // Transform the `images` field from comma-separated string to an array
        const formattedData = data.map((post) => ({
          ...post,
          images: post.images ? post.images.split(",") : [], // Transform images into an array
          likeduser: post.likeduser ? post.likeduser.split(",") : [],
          postTime: formatPostTime(post.postTime), // Transform likeduser into an array
        }));
  
        return res.status(200).json(formattedData);
      });
    });
  };