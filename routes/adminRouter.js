const express = require("express")
const {Admin}= require("../models/Admin.js");
const {hash,hashCheck}= require("../utils/encryption.js");
const jwt = require('jsonwebtoken');

const router = express.Router()
const secret = process.env.JWT_SECRET;

router.get("/all", async(req,res)=>{
    try{
        const admins = await Admin.find({deletedDate:null});
        res.status(200).json(admins)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.get("/", async(req,res)=>{
    const searchQuery = req.body
    try{
        const admins = await Admin.find(searchQuery);
        res.status(200).json(admins[0])
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.post("/",async (req,res) =>{
    const adminInput = req.body

    const admins= await Admin.find({_id:adminInput._id});

    if(admins.length>0){
        res.status(200).json({ error: "Username Taken" });
    }else{
        const hashedPassword = await hash(adminInput.password);
        let admin = new Admin(
            {
                _id:adminInput._id,
                name:adminInput.name,
                password:hashedPassword,
                designation:adminInput.designation,
                joinDate:adminInput.joinDate
            }
        )
        await admin.save();
        res.status(200).json({ success: "Admin added" });
    }
})

router.delete("/", async (req, res) => {
    const deleteQuery = req.query
    try {
        const deletedAdmin = await Admin.findByIdAndUpdate(deleteQuery._id, {$set:{deletedDate:new Date()}}, { new: true });
        res.status(200).json(deletedAdmin)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/login", async (req,res) =>{
    const username = req.body.username;
    const password = req.body.password;
    let isError = false
    if(username==""){
        message.usernameError = "Username is empty. Try again."
        isError = true
    }
    if(password==""){
        message.passwordError = "Password is empty. Try again."
        isError = true
    }
    $users= await User.find({username:username});

    if($users.length==0){
        message.passwordError = "No user exists with given username. Please register."
        res.render("user/login",{message})
    }else{
        const currentUser =$users[0]
        const loginSuccess = await hashCheck(password,currentUser.password)
        if(loginSuccess){
            const token = jwt.sign({username: req.body.username}, secret, { expiresIn: '1h' });
            req.session.username = username;
            req.session.token = token
            res.redirect("/user/dashboard")
        }else{
            message.passwordError = "Incorrect password."
            res.render("user/login",{message})
        }
    }
})

module.exports = router