import { db } from "../conect.js";
import jwt from "jsonwebtoken";
import { addFollowNotification } from "./notifications.js";

export const topusers = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT 
    u.userid, 
    u.username, 
    u.email, 
    u.name, 
    u.profilepic
FROM 
    users AS u
LEFT JOIN 
    user_follows AS uf 
ON 
    uf.follow = u.userid AND uf.folowing_by = ?
WHERE 
    u.verify = 'yes' 
    AND u.userid != ?
    AND uf.follow IS NULL;`;

    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const userDetails = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT 
                  u.*,
                  (SELECT COUNT(*) FROM user_follows WHERE folowing_by = u.userid) AS followers_count,
                  (SELECT COUNT(*) FROM user_follows WHERE follow = u.userid) AS following_count
              FROM users AS u
              WHERE u.userid = ?;`;

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data[0]);
    });
  });
};

export const addfollower = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "INSERT INTO user_follows (`follow`, `folowing_by`) VALUES (?);";
    const values = [req.query.following, userInfo.id];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      addFollowNotification(userInfo.id, req.query.following);
      return res.status(200).json(data[0]);
    });
  });
};

export const userPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    q = `SELECT 
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
                    END AS isFollowed
                FROM posts AS p
                JOIN users AS u ON u.userid = p.userId
                LEFT JOIN post_image AS pi ON pi.postId = p.postId
                LEFT JOIN post_likes AS pl ON pl.postId = p.postId
                LEFT JOIN post_comments AS pc ON pc.postId = p.postId
                LEFT JOIN 
                    user_follows AS uf ON uf.follow = u.userid AND uf.folowing_by = ?
                where u.userid = ?
                GROUP BY p.postId, u.userid
                ORDER BY p.postTime DESC`;

    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
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

export const updateduserDetails = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");
    var q = '';
    if(req.body.profilepic===""){
        q = `UPDATE users SET name=?, mobile=? ,address=? WHERE userid=?`;
        db.query(q,[req.body.name,req.body.phone,req.body.address,userInfo.id],(err,data)=>{
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    }else{
        q = `UPDATE users SET name=?, mobile=? ,address=?,profilepic=? WHERE userid=?`;
        db.query(q,[req.body.name,req.body.phone,req.body.address,req.body.profilepic,userInfo.id],(err,data)=>{
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    }

  });
};
