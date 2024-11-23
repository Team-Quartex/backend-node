import { db } from "../conect.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = (req,res)=>{
    // Check user if exists
    const q = "SELECT * FROM users WHERE username = ?";
    db.query(q,[req.body.username],(err,data)=>{
        if(err) return res.status(500).json(err);
        if(data.length) return res.status(409).json("User Already exists");

        // create a new user
        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password,salt);

        const q = "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";
        const values = [req.body.username,req.body.email,hashedPassword,req.body.name]
        db.query(q,[values],(err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("User has been created");
        });
    });
}

export const login = (req,res)=>{
    // quey
    const q = "SELECT * FROM users WHERE username = ?";
    db.query(q,[req.body.username],(err,data)=>{
        if(err) return res.status(500).json(err);
        if(data.length === 0 )return res.clearCookie('accessToken').status(404).json("User not found!");

        // check encrypt password

        const checkPassword = bcrypt.compareSync(req.body.password,data[0].password);
        if(!checkPassword) return res.clearCookie('accessToken').status(400).json("Wrong password or username!");
        
        //  assign to token when user is right

        const token = jwt.sign({id: data[0].userid},"secretkey");
        // return without password
        const {password, ...others} = data[0];
        // assign cookie
        let thirtyDays = 1000 * 60 * 60 * 24 * 30;
        
        res.cookie("accessToken",token,{
            maxAge: thirtyDays,
            secure:true,
            httpOnly: true,
            sameSite:"None",
        }).status(200).json(others);
    })

}

export const logOut = (req,res)=>{
    res.clearCookie("accessToken",{
        secure: true,
        sameSite:"none"
    }).status(200).json("User has been logged out!")
}

