import { db } from "../conect.js";
import jwt from "jsonwebtoken";
import { addSellerNotifications } from "./notifications.js";

export const addproduct = (req,res)=>{
    const token = req.cookies.accessTokenseller;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyseller", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "INSERT INTO products (`name`,`description`,`price`,`categoryId`,`qty`,`sellerId`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.desc,
        req.body.price,
        req.body.category,
        req.body.qty,
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
            addSellerNotifications(proId,"","product",0,"");
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
            u.name AS sellername,
            u.profilepic AS profile,
            u.email,
            GROUP_CONCAT(DISTINCT pi.imageLink) AS images,
            AVG(pr.reviewRate) AS avgReviewRate,
            COUNT(pr.reviewRate) AS totalReviews,
            CASE 
                WHEN EXISTS (
                    SELECT 1 
                    FROM product_favourite AS pf 
                    WHERE pf.productId = p.productId AND pf.userId = ?
                ) THEN 'Yes'
                ELSE 'No'
            END AS isFavourite
        FROM products AS p
        JOIN sellers AS u ON u.sid = p.sellerId
        LEFT JOIN product_images AS pi ON pi.productId = p.productId
        LEFT JOIN product_reviews AS pr ON pr.productId = p.productId
        GROUP BY p.productId, u.sid
        ORDER BY p.postAt DESC;`;

        db.query(q,[userInfo.id], (err, data) => {
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

export const getSingleProduct = (req,res)=>{
    const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `
        SELECT 
            p.*, 
            u.name AS sellername,
            u.profilepic AS profile,
            u.email,
            u.email AS email,
            GROUP_CONCAT(DISTINCT pi.imageLink) AS images,
            AVG(pr.reviewRate) AS avgReviewRate,
            COUNT(pr.reviewRate) AS totalReviews,
            CASE 
                WHEN EXISTS (
                    SELECT 1 
                    FROM product_favourite AS pf 
                    WHERE pf.productId = p.productId AND pf.userId = ?
                ) THEN 'Yes'
                ELSE 'No'
            END AS isFavourite
        FROM products AS p
        JOIN sellers AS u ON u.sid = p.sellerId
        LEFT JOIN product_images AS pi ON pi.productId = p.productId
        LEFT JOIN product_reviews AS pr ON pr.productId = p.productId
        WHERE p.productId = ?
        GROUP BY p.productId, u.sid
        ORDER BY p.postAt DESC;`;

        db.query(q,[userInfo.id,req.query.id], (err, data) => {
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


export const productapprove=(req,res)=>{
    const token = req.cookies.accessTokenAdmin;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyAdmin", (err, admin) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `UPDATE products SET status = 'available' WHERE productId=?`;
    db.query(q,[req.body.productId], (err, data) => {
        if (err) return res.status(500).json(err);
        addSellerNotifications(req.body.productId,"","product",2,"");
        return res.status(200).json(data);
      });
  });
}

export const productdecline=(req,res)=>{
    const token = req.cookies.accessTokenAdmin;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyAdmin", (err, admin) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `UPDATE products SET status = 'decline' WHERE productId=?`;
    db.query(q,[req.body.productId], (err, data) => {
        if (err) return res.status(500).json(err);
        addSellerNotifications(req.body.productId,"","product",1,"");
        return res.status(200).json(data);
      });
  });
}