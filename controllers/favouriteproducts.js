import { db } from "../conect.js";
import jwt from "jsonwebtoken";

export const addfavourite = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");
    const q  = "INSERT INTO product_favourite(`userId`, `productId`) VALUES (?)";
    console.log('id'+ userInfo.id)
    console.log('pro'+ req.body.productid)
    const values = [
        userInfo.id,
        req.body.productid
    ]
    db.query(q,[values],(err,data)=>{
        console.log(err);
        if(err) return res.status(500).json(err);
        return res.status(200).json("Added to Favourite")
    });

  });
};

export const removeFavourite = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not Logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid");
        const q = `DELETE FROM product_favourite WHERE userId = ? AND productId = ?`;
        const values = [
            userInfo.id,
            req.body.productid
        ];
        db.query(q, values, (err, data) => { // Pass values directly here
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }
            return res.status(200).json("Removed from Favourites");
        });
    });
};
