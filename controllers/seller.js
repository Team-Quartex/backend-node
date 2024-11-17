import {db} from "../conect.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const registerseller = (req,res)=>{
    // Check user if exists
    const q = "SELECT * FROM sellers WHERE username = ?";
    db.query(q,[req.body.username],(err,data)=>{
        if(err) return res.status(500).json(err);
        if(data.length) return res.status(409).json("User Already exists");

        // create a new user
        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password,salt);

        const q = "INSERT INTO sellers (`username`,`email`,`password`,`name`,`business_name`,`address`,`city`) VALUE (?)";
        const values = [
            req.body.username,
            req.body.email,
            hashedPassword,
            req.body.name,
            req.body.businessname,
            req.body.address,
            req.body.city    
        ]
        db.query(q,[values],(err,data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("User has been created");
        });
    });
}

export const loginseller = (req,res)=>{
    // quey
    const q = "SELECT * FROM sellers WHERE username = ?";
    db.query(q,[req.body.username],(err,data)=>{
        if(err) return res.status(500).json(err);
        if(data.length === 0 )return res.status(404).json("User not found!");

        // check encrypt password

        const checkPassword = bcrypt.compareSync(req.body.password,data[0].password);
        if(!checkPassword) return res.status(400).json("Wrong password or username!");
        
        //  assign to token when user is right

        const token = jwt.sign({id: data[0].sid},"secretkeyseller");
        // return without password
        const {password, ...others} = data[0];

        // assign cookie
        res.cookie("accessTokenseller",token,{
            httpOnly: true,
        }).status(200).json(others);
    })

}

export const sellerlogout = (req,res)=>{
    res.clearCookie("accessTokenseller",{
        secure: true,
        sameSite:"none"
    }).status(200).json("User has been logged out!")
}
