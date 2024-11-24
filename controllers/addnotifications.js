import {db} from '../conect.js'
import jwt from 'jsonwebtoken'

export const addLikednotification = (notifiFrom,notify) =>{
    console.log('hello');
    const q = `INSERT INTO notifications (userfrom, notifyfor, notifytype,description) VALUES (?)`;

    const values =[
        notifiFrom,
        notify,
        "like",
        `user like youre post`
    ]

    db.query(q,[values],(err,data)=>{
        if (err) return console.log(err);
        console.log(data)
    })
}