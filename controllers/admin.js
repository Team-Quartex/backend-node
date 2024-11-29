import {db} from '../conect.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import {formatPostTime} from '../resource/timeformat.js'

export const login = (req,res)=>{
    // quey
    const q = "SELECT * FROM admin WHERE username = ?";
    db.query(q,[req.body.username],(err,data)=>{
        if(err) return res.status(500).json(err);
        if(data.length === 0 )return res.clearCookie('accessTokenAdmin').status(404).json("User not found!");

        // check encrypt password

        const checkPassword = bcrypt.compareSync(req.body.password,data[0].password);
        if(!checkPassword) return res.clearCookie('accessTokenAdmin').status(400).json("Wrong password or username!");
        
        //  assign to token when user is right

        const token = jwt.sign({id: data[0].userid},"secretkeyAdmin");
        // return without password
        const {password, ...others} = data[0];
        // assign cookie
        let thirtyDays = 1000 * 60 * 60 * 24 * 30;
        
        res.cookie("accessTokenAdmin",token,{
            maxAge: thirtyDays,
            secure:true,
            httpOnly: true,
            sameSite:"None",
        }).status(200).json(others);
    })

}

export const logOut = (req,res)=>{
    res.clearCookie("accessTokenAdmin",{
        secure: true,
        sameSite:"none"
    }).status(200).json("User has been logged out!")
}


export const allUsers=(req,res)=>{
    const token = req.cookies.accessTokenAdmin;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyAdmin", (err, admin) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT userid,username,email FROM users`;
    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
}

export const userPost = (req,res) =>{
    const token = req.cookies.accessTokenAdmin;
    if (!token) return res.status(401).json("Not Logged in!");
  
    jwt.verify(token, "secretkeyAdmin", (err, admin) => {
      if (err) return res.status(403).json("Token is not valid");
  
      const q = `SELECT 
                    p.*,
                    COUNT(DISTINCT pc.postId) AS comments,
                    COUNT(DISTINCT pl.userId) AS likeduser,
                    GROUP_CONCAT(DISTINCT pi.imageLink) AS images
                FROM posts AS p
                JOIN users AS u ON u.userid = p.userId
                LEFT JOIN post_image AS pi ON pi.postId = p.postId
                LEFT JOIN post_likes AS pl ON pl.postId = p.postId
                LEFT JOIN post_comments AS pc ON pc.postId = p.postId
                where u.userid = ?
                GROUP BY p.postId, u.userid
                ORDER BY p.postTime DESC`;
        db.query(q, [req.query.uid], (err, data) => {
        if (err) return res.status(500).json(err);

        // Transform the `images` field from comma-separated string to an array
        const formattedData = data.map((post) => ({
            ...post,
            images: post.images ? post.images.split(",") : [], // Transform images into an array
            postTime: formatPostTime(post.postTime), // Transform likeduser into an array
        }));

        return res.status(200).json(formattedData);
        });
    });
}

export const allsellers=(req,res)=>{
    const token = req.cookies.accessTokenAdmin;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyAdmin", (err, admin) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT sid,name,email FROM sellers`;
    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
}

export const sellerProducts = (req,res) =>{
    const token = req.cookies.accessTokenAdmin;
    if (!token) return res.status(401).json("Not Logged in!");
  
    jwt.verify(token, "secretkeyAdmin", (err, admin) => {
      if (err) return res.status(403).json("Token is not valid");
  
      const q = `SELECT 
                    p.*,
                    u.name AS username,  
                    GROUP_CONCAT(pi.imageLink) AS images
                FROM 
                    products AS p
                JOIN 
                    sellers AS u ON u.sid = p.sellerId
                LEFT JOIN 
                    product_images AS pi ON pi.productId = p.productId
                WHERE 
                    u.sid = ?
                GROUP BY 
                    p.productId, u.sid
                ORDER BY 
                    p.postAt DESC;`;
        db.query(q, [req.query.sid], (err, data) => {
        if (err) return res.status(500).json(err);

        // Transform the `images` field from comma-separated string to an array
        const formattedData = data.map((post) => ({
            ...post,
            images: post.images ? post.images.split(",") : [], // Transform images into an array
            postTime: formatPostTime(post.postTime), // Transform likeduser into an array
        }));

        return res.status(200).json(formattedData);
        });
    });
}

export const verificationRequest = (req,res) =>{
    const token = req.cookies.accessTokenAdmin;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyAdmin", (err, admin) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT v.*,u.userid,u.username,u.email FROM verifiction_request AS v LEFT JOIN users AS u ON u.userid = v.userId WHERE status='pending'`;
    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      const formattedData = data.map((request) => ({
        ...request,
        requestAt: formatPostTime(request.requestAt),
    }));
      return res.status(200).json(formattedData);
    });
  });
}

export const paymentTable = (req,res) =>{
    const token = req.cookies.accessTokenAdmin;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyAdmin", (err, admin) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `
        SELECT 
            u.name AS userName,
            s.name AS sellerName,
            p.name AS productName,
            r.qty AS quantity,
            SUM(r.qty * COALESCE(p.price, 0)) AS totPrice,
            SUM(r.qty * COALESCE(p.price, 0)) * 0.05 AS commission
        FROM 
            reservation AS r 
        LEFT JOIN 
            products AS p ON p.productId = r.productId
        LEFT JOIN 
            sellers AS s ON s.sid = p.sellerId
        LEFT JOIN 
            users AS u ON u.userid = r.userId
        GROUP BY 
            u.name, s.name, p.name, r.qty;`;
    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
}