import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import User from './Schema/User.js';
import {nanoid} from 'nanoid';

const app = express();
const PORT = 3000;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

app.use(express.json())

mongoose.connect(process.env.DB_LOCATION,{
    autoIndex: true
});

const generateUsername = async (email) => {
    let username = email.split('@')[0];
    let usernameExists = await User.exists({ "personal_info.username": username}).then((result) => result)

    usernameExists ? username += nanoid().substring(0,5) : "";

    return username

}

app.post("/signup", (req, res) => {

    let { fullname, email, password } = req.body;
    if(fullname.length < 3){
        return res.status(403).json({ 'error': 'Full name must be atleat 3 letters long'})
    }

    if (!email.length) {
        return res.status(403).json({ 'error': 'Enter your email'})
    }

    if (!emailRegex.test(email)){
        return res.status(403).json({ 'error': 'Email is invalid'})
    }

    if (!passwordRegex.test(password)){
        return res.status(403).json({ 'error': 'Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase'})
    }

    bcrypt.hash(password, 10, async (err, hashed_password) => {
        let username = await generateUsername(email);
        let user = new User({
            personal_info: {
                fullname,
                email,
                password: hashed_password,
                username,
            }
        })

        user.save().then((u) => {
            return res.status(200).json({ user: u })
        })
        .catch(err => {

            if (err.code == 11000) {
                return res.status(500).json({ "error": "Email already exists"})
            }

            return res.status(500).json({"error": err.message})
        })
        

    })

    // return res.status(200).json({ 'status': 'Okay'})
})

app.listen(PORT, () => {
    console.log("listening on port -> " + PORT);
    
})