import {db} from '../conect.js'
import jwt from 'jsonwebtoken'

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

