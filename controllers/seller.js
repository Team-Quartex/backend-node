import { db } from "../conect.js";
import bcrypt from "bcryptjs";
import { json } from "express";
import jwt from "jsonwebtoken";

export const registerseller = (req, res) => {
  // Check user if exists
  const q = "SELECT * FROM sellers WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User Already exists");

    // create a new user
    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO sellers (`username`,`email`,`password`,`name`,`business_name`,`address`,`city`) VALUE (?)";
    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
      req.body.businessname,
      req.body.address,
      req.body.city,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created");
    });
  });
};

export const loginseller = (req, res) => {
  // quey
  const q = "SELECT * FROM sellers WHERE username = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    // check encrypt password

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!checkPassword)
      return res.status(400).json("Wrong password or username!");

    //  assign to token when user is right

    const token = jwt.sign({ id: data[0].sid }, "secretkeyseller");
    // return without password
    const { password, ...others } = data[0];

    // assign cookie
    res
      .cookie("accessTokenseller", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const sellerlogout = (req, res) => {
  res
    .clearCookie("accessTokenseller", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out!");
};

export const sellerStatics = (req, res) => {
  const token = req.cookies.accessTokenseller;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyseller", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT 
    p.sellerId,
    p.name AS productName,
    COUNT(r.reservationId) AS rentedCount, 
    SUM(r.qty) AS totalQuantity,
    SUM(r.qty * p.price) AS totalPrice, 
    SUM(r.qty * p.price) * 0.05 AS commission, 
    SUM(r.qty * p.price) - (SUM(r.qty * p.price) * 0.05) AS netTotal 
FROM 
    products p
JOIN 
    reservation r ON p.productId = r.productId
WHERE 
    p.sellerId = ?
GROUP BY
    p.productId, p.sellerId, p.name
ORDER BY
    p.productId;;`;
    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const sellerPayment = (req, res) => {
  const token = req.cookies.accessTokenseller;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyseller", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    sellerStaticsQuery(userInfo.id, res, (err, data) => {
      if (err)
        return res.status(500).json({ error: "Database error", details: err });

      // Calculate earnings
      let earnings = 0;
      data.forEach((element) => {
        const netTotal = parseFloat(element["netTotal"]);
        if (!isNaN(netTotal)) {
          earnings += netTotal;
        }
      });

      // Respond with the calculated earnings
      return res.status(200).json({ earnings });
    });
  });
};

const sellerStaticsQuery = (sellerID, res, callback) => {
  const q = `SELECT 
                p.sellerId,
                p.name AS productName,
                COUNT(r.reservationId) AS rentedCount, -- Total reservations for the product
                SUM(r.qty) AS totalQuantity, -- Total quantity rented
                SUM(r.qty * p.price) AS totalPrice, -- Total revenue
                SUM(r.qty * p.price) * 0.05 AS commission, -- 10% commission
                SUM(r.qty * p.price) - (SUM(r.qty * p.price) * 0.05) AS netTotal -- Net revenue after commission
            FROM 
                products p
            JOIN 
                reservation r ON p.productId = r.productId
            WHERE 
                p.sellerId =?
            GROUP BY 
                p.productId
            ORDER BY 
                p.name;
            `;
  db.query(q, [sellerID], (err, data) => {
    if (err) return res.status(500).json(err);
    callback(null, data);
  });
};

export const sellerWithdraw = (req, res) => {
  const token = req.cookies.accessTokenseller;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyseller", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `
      SELECT 
        seller_id,
        IFNULL(SUM(withdraw_amount), 0) AS total_withdraw 
      FROM 
        seller_withdraw
      WHERE 
        seller_id = ?;
    `;
    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data[0] || { seller_id: userInfo.id, total_withdraw: 0 });
    });
  });
};


export const addwithdraw = (req, res) => {
  const token = req.cookies.accessTokenseller;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyseller", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `INSERT INTO seller_withdraw(seller_id, withdraw_amount) VALUES (?) `;
    db.query(q, [userInfo.id, req.body.amount], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const sellerDetails = (req, res) => {
  const token = req.cookies.accessTokenseller;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyseller", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT * FROM sellers WHERE sid = ? `;
    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      const { password, ...others } = data[0];
      return res.status(200).json(others);
    });
  });
};

export const sellerUpdate = (req, res) => {
  const token = req.cookies.accessTokenseller;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyseller", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    if (err) return res.status(403).json("Token is not valid");
    var q = "";
    if (req.body.profilepic === "") {
      q = `UPDATE users SET name=?, mobile=? ,username=? WHERE userid=?`;
      db.query(
        q,
        [req.body.name, req.body.phone, req.body.username, userInfo.id],
        (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json(data);
        }
      );
    } else {
      q = `UPDATE users SET name=?, mobile=? ,username=?,profilepic=? WHERE userid=?`;
      db.query(
        q,
        [
          req.body.name,
          req.body.phone,
          req.body.username,
          req.body.profilepic,
          userInfo.id,
        ],
        (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json(data);
        }
      );
    }
  });
};
