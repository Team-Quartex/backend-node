import {db} from '../conect.js'
import jwt from 'jsonwebtoken'

export const addreview = (req,res) =>{
    const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = "INSERT INTO product_reviews (`productId`,`reviewRate`,`review_content`,`userId`) VALUES (?)";
    const values = [
        req.body.proId,
        req.body.count,
        req.body.content,
        userInfo.id
    ]
        db.query(q,[values] ,(err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json("Review has been created has been created");
        });
    });
}

export const getReviews = (req,res)=>{
    const q = `SELECT * FROM product_reviews WHERE productId = ?`;

    db.query(q,[req.query.productId],(err,data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
}

export const starCount = (req,res)=>{
    const q = `SELECT 
                    AVG(reviewRate) AS averageReviewRate 
                FROM 
                    product_reviews 
                WHERE 
                    productId = ?;
                `;

    db.query(q,[req.query.productId],(err,data)=>{
        if(err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
}