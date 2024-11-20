import {db} from '../conect.js'
import jwt from 'jsonwebtoken'  

export const topusers=(req,res)=>{
    const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q  = `SELECT 
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

    db.query(q,[userInfo.id,userInfo.id],(err,data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
    })

    })
}

export const userDetails= (req,res) =>{
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q  = `SELECT 
                  u.*,
                  (SELECT COUNT(*) FROM user_follows WHERE folowing_by = u.userid) AS followers_count,
                  (SELECT COUNT(*) FROM user_follows WHERE follow = u.userid) AS following_count
              FROM users AS u
              WHERE u.userid = ?;`;

    db.query(q,[userInfo.id],(err,data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json(data[0]);
    })

    })
}

export const addfollower= (req,res) =>{
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");
    
    const q  = "INSERT INTO user_follows (`follow`, `folowing_by`) VALUES (?);";
    const values = [
      req.query.following,
      userInfo.id
  ];
  
    db.query(q,[values],(err,data)=>{
        console.log(err)
        if(err) return res.status(500).json(err);
        return res.status(200).json(data[0]);
    })

    })
}