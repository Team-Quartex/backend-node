import { db } from "../conect.js";
import jwt from "jsonwebtoken";
import {formatDate} from '../resource/timeformat.js'
import { addSellerNotifications } from "./notifications.js";


export const checkReservation = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `
                                SELECT 
                    i.productId, 
                    i.name, 
                    i.qty AS totalQuantity,
                    COALESCE(SUM(r.qty), 0) AS reservedQuantity,
                    (i.qty - COALESCE(SUM(r.qty), 0)) AS availableQuantity
                FROM 
                    products i
                LEFT JOIN 
                    reservation r ON i.productId = r.productId 
                            AND (
                                r.startDate <= ? AND r.endDate >= ?
                            )
                WHERE 
                    i.productId = ?
                GROUP BY 
                    i.productId;`;

    db.query(
      q,
      [req.query.end, req.query.start, req.query.itemId],
      (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      }
    );
  });
};

export const addReservation = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q =
      "INSERT INTO reservation(`productId`, `userId`, `qty`, `startDate`, `endDate`) VALUES (?,?,?,?,?);";

    db.query(
      q,
      [
        req.body.productId,
        userInfo.id,
        req.body.quantity,
        req.body.start,
        req.body.end,
      ],
      (err, result) => {
        if (err) return res.status(500).json(err);
        addSellerNotifications(req.body.productId,userInfo.id,"reserve",req.body.quantity,req.body.start)
        return res.status(200).json("Reservation added successfully!");
      }
    );
  });
};

export const UserReservationsList = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT 
                  re.*,
                  p.productId,
                  p.name AS productName,
                  se.name AS sellerName,
                  MIN(pi.imageLink) AS productImage,
                  (re.qty * p.price) AS tot
              FROM reservation AS re
              JOIN products AS p ON p.productId = re.productId
              LEFT JOIN product_images AS pi ON pi.productId = p.productId
              LEFT JOIN sellers AS se ON se.sid = p.sellerId
              WHERE re.reservationId IN (
                  SELECT reservationId FROM reservation WHERE userId = 1
              )
              GROUP BY re.reservationId, p.productId, p.name, se.name
              ORDER BY re.orderTime DESC;`;

    db.query(q, [userInfo.id], (err, result) => {
      if (err) return res.status(500).json(err);
      const formattedData = result.map((reservation) => ({
        ...reservation,
        orderTime: formatDate(reservation.orderTime,""), // Transform likeduser into an array
        startDate: formatDate(reservation.startDate,"dateonly"), // Transform likeduser into an array
        endDate: formatDate(reservation.endDate,"dateonly"), // Transform likeduser into an array
      }));
      return res.status(200).json(formattedData);
    });
  });
};

export const sellerReservationsList = (req, res) => {
  const token = req.cookies.accessTokenseller;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyseller", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT re.*,p.productId,p.name  
              FROM reservation AS re 
              JOIN products AS p ON p.productId = re.productId 
              LEFT JOIN product_images AS pi ON pi.productId = p.productId 
              LEFT JOIN users AS u ON u.userid = re.userId
              WHERE p.sellerId = 2
              ORDER BY re.orderTime DESC`;
    db.query(q, [userInfo.id], (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json("Reservation added successfully!");
    });
  });
};

export const getSellerDateReservation = (req, res) => {
  const token = req.cookies.accessTokenseller;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyseller", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT 
                  r.*, 
                  u.name AS userName, 
                  s.name,
                  p.name AS productName,
                  p.price AS price,
                  u.email AS email,
                  CASE 
                      WHEN r.startDate = ? THEN 'Pick up'
                      WHEN r.endDate = ? THEN 'Receive'
                  END AS status
              FROM reservation AS r
              JOIN products AS p ON p.productId = r.productId
              LEFT JOIN sellers AS s ON s.sid = p.sellerId
              LEFT JOIN users AS u ON u.userid = r.userId
              WHERE (r.startDate = ? OR r.endDate = ?)
                AND s.sid = ?;`;
    db.query(q, [req.query.date,req.query.date,req.query.date,req.query.date,userInfo.id], (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(result);
    });
  });
};
