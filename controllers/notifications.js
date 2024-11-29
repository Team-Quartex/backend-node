import { db } from "../conect.js";
import {formatPostTime,formatDate} from '../resource/timeformat.js'
import jwt from "jsonwebtoken";

export const getnotifications = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT n.*,u.name,u.profilepic FROM notifications AS n
                LEFT JOIN users AS u ON u.userid = n.userfrom
                WHERE n.notifyfor = ?
                ORDER BY n.notifiedtime DESC `;
    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      const formattedData = data.map((notification) => ({
        ...notification,
        notifiedtime: formatPostTime(notification.notifiedtime), // Transform likeduser into an array
      }));

      return res.status(200).json(formattedData);
    });
  });
};

export const setviewNotification = (req,res)=>{
    const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `UPDATE notifications SET isView='yes' WHERE notifyfor = ? AND isView = 'no'`;
    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
}

export const addLikednotification = (notifiFrom, notify, postId) => {
  if (notifiFrom != notify) {
    const q = `INSERT INTO notifications (userfrom, notifyfor, notifytype, description, postId) VALUES (?)`;

    const values = [
      notifiFrom,
      notify,
      "like",
      `User ${notifiFrom} liked your post`, // More descriptive notification message
      postId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) {
        console.error(err);
      } else {
      }
    });
  }
};

export const removeLikednotification = (notifiFrom, notify, postId) => {
  if (notifiFrom != notify) {
    const q = `DELETE FROM notifications WHERE userfrom = ? AND notifyfor = ? AND postId = ? `;

    const values = [notifiFrom, notify, postId];

    db.query(q, [notifiFrom, notify, postId], (err, data) => {
      if (err) console.log(err);
    });
  }
};

export const addCommentNotification = (
  notifiFrom,
  notify,
  postId,
  desc,
  lastInsertId
) => {
  if (notifiFrom != notify) {
    const q = `INSERT INTO notifications (userfrom, notifyfor, notifytype, description, postId,commentId) VALUES (?)`;

    const values = [
      notifiFrom,
      notify,
      "comment",
      desc, // More descriptive notification message
      postId,
      lastInsertId,
    ];

    db.query(q, [values], (err, data) => {
      if (err) {
        console.error(err);
      } else {
      }
    });
  }
};

export const removeCommentnotification = (commenId) => {
  const q = `DELETE FROM notifications WHERE commentId = ?`;

  db.query(q, [commenId], (err, data) => {
    if (err) console.log(err);
  });
};

export const addFollowNotification = (notifiFrom, notify) => {
  const q = `INSERT INTO notifications (userfrom, notifyfor, notifytype) VALUES (?)`;
  const values = [notifiFrom, notify, "follow"];

  db.query(q, [values], (err, data) => {
    if (err) {
      console.error(err);
    } else {
    }
  });
};

export const removeFollownotification = (notifiFrom, notify) => {
  const q = `DELETE FROM notifications WHERE userfrom = ? AND notifyfor = ? AND notifytype = "follow" `;

  db.query(q, [notifiFrom, notify], (err, data) => {
    if (err) console.log(err);
  });
};

export const addshareNotification = (notifiFrom, notify, postId) => {
  if (notifiFrom != notify) {
    const q = `INSERT INTO notifications (userfrom, notifyfor, notifytype) VALUES (?)`;
    const values = [notifiFrom, notify, "follow"];

    db.query(q, [values], (err, data) => {
      if (err) {
        console.error(err);
      } else {
      }
    });
  }
};

export const addSellerNotifications=(proid,user,type,num,date)=>{

    const nq = "SELECT sellerId FROM products WHERE productId = ?"
    db.query(nq,[proid],(err,data)=>{
      if(err){
        console.log(err);
        return;
      }
      const sellerID = data[0].sellerId;
      const q = `INSERT INTO seller_notificatin (sellerid, userId, notification_type,productId,qtyorrate,reserveDate) VALUES (?)`;
    const values = [sellerID,user,type,proid,num,date];

    db.query(q, [values], (err, data) => {
      if (err) {
        console.error(err);
      } else {
      }
    });
    })
    
}

export const viewSellerNofification=(req,res)=>{
  const token = req.cookies.accessTokenseller;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyseller", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const q = `SELECT 
                  n.*, 
                  u.name, 
                  u.profilepic, 
                  p.name AS product, 
                  MIN(pi.imageLink) AS productImage 
              FROM 
                  seller_notificatin AS n
              LEFT JOIN 
                  users AS u ON u.userid = n.userId
              LEFT JOIN 
                  products AS p ON p.productId = n.productId
              LEFT JOIN 
                  product_images AS pi ON pi.productId = p.productId
              WHERE 
                  n.sellerid = ?
              GROUP BY 
                  n.notification_id, u.name, u.profilepic, p.name
              ORDER BY 
                  n.notifyTime DESC;`;
    db.query(q, [userInfo.id], (err, data) => {
      console.log(err)
      if (err) return res.status(500).json(err);
      const formattedData = data.map((notification) => ({
        ...notification,
        reserveDate: formatDate(notification.reserveDate,"dateonly")
        // reserveDate: formatPostTime(notification.reserveDate,"dateonly"), // Transform likeduser into an array
      }));
      return res.status(200).json(formattedData);
    });
  });
}

export const sellerSetviewNotification = (req,res)=>{
  const token = req.cookies.accessTokenseller;
  if (!token) return res.status(401).json("Not Logged in!");

  jwt.verify(token, "secretkeyseller", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

  const q = `UPDATE seller_notificatin SET isView='yes' WHERE sellerid = ? AND isView = 'no'`;
  db.query(q, [userInfo.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});
}