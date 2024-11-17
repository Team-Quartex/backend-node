import { db } from "../conect.js";
import jwt from "jsonwebtoken";

export const addproduct = (req,res)=>{
    const token = req.cookies.accessTokenseller;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyseller", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "INSERT INTO products (`name`,`description`,`location`,`price`,`categoryId`,`sellerId`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.desc,
        req.body.location,
        req.body.price,
        req.body.category,
        userInfo.id
    ]
        db.query(q,[values] ,(err, data) => {
            const proId = data.insertId;
            if (err) return res.status(500).json(err);
            if(req.body.images.length===0) return res.status(200).json("Product has been created.");
            for(const image of req.body.images){
                const qimage = "INSERT INTO `product_images`(`productId`, `imageLink`) VALUES (?)";
                const imageValuse = [
                    proId,
                    image
                ]
                db.query(qimage,[imageValuse],(err,dataimage)=>{
                    if (err) return res.status(500).json(err);
                })
            }
            return res.status(200).json("Product has been created.");
        });
    });
}

export const  getsellerproducts = (req,res) =>{
    const token = req.cookies.accessTokenseller;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyseller", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT 
                    p.*, 
                    u.sid AS UserId, 
                    u.name, 
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

        db.query(q, [userInfo.id] ,(err, data) => {
        if (err) return res.status(500).json(err);

        // Transform the `images` field from comma-separated string to an array
        const formattedData = data.map((post) => ({
            ...post,
            images: post.images ? post.images.split(",") : [], // Handle null values for posts without images
        }));

        return res.status(200).json(formattedData);
        });
    });
}

export const  getallproducts = (req,res) =>{
    const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `
        SELECT 
            p.*, 
            u.sid AS UserId, 
            u.name, 
            GROUP_CONCAT(pi.imageLink) AS images
        FROM products AS p
        JOIN sellers AS u ON u.sid = p.sellerId
        LEFT JOIN product_images AS pi ON pi.productId = p.productId
        GROUP BY p.productId, u.sid
        ORDER bY p.postAt DESC`;

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
}