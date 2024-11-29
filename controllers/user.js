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

export const otherUserDetails = (req,res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT 
                  u.*,
                  (SELECT COUNT(*) FROM user_follows WHERE folowing_by = u.userid) AS followers_count,
                  (SELECT COUNT(*) FROM user_follows WHERE follow = u.userid) AS following_count,
                  CASE 
                      WHEN uf.folowing_by IS NOT NULL THEN 'yes'
                      ELSE 'no'
                  END AS isFollowed
              FROM users AS u
              LEFT JOIN user_follows AS uf 
                  ON uf.follow = u.userid AND uf.folowing_by = ?
              WHERE u.userid = ?;`;

    db.query(q, [userInfo.id,req.query.uid], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data[0]);
    });
  });
}

export const recentFollow = (req,res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT u.userid,u.username,u.profilepic FROM 
                user_follows AS uf 
                LEFT JOIN users AS u on u.userid = uf.folowing_by 
                WHERE uf.follow = ?
                LIMIT 6;`;

    db.query(q, [req.query.uid], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
}

export const recentPhotos = (req,res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT pi.imageLink
              FROM post_image AS pi
              LEFT JOIN posts AS p ON pi.postId = p.postId
              WHERE p.userId = ?
              ORDER BY p.postTime DESC
              LIMIT 4;`;

    db.query(q, [req.query.uid], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
}


