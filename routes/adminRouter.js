const express = require("express")
const {Admin}= require("../models/Admin.js");
const {hash,hashCheck}= require("../utils/encryption.js");

const router = express.Router()

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

router.post("/login", async (req,res) =>{
    const _id = req.body._id;
    const password = req.body.password;
    
    const admins= await Admin.find({_id:_id});

    if(admins.length==0){
        res.status(400).json({ message: "Incorrect Credentials" });
    }else{
        const currentAdmin =admins[0]
        const loginSuccess = await hashCheck(password,currentAdmin.password)
        if(loginSuccess){
            res.status(200).json({ message: "",_id:currentAdmin._id });
        }else{
            res.status(400).json({ message: "Incorrect Credentials" });
        }
    }
})

router.post("/",async (req,res) =>{
    const adminInput = req.body

    const admins= await Admin.find({_id:adminInput._id});

    if(admins.length>0){
        res.status(200).json({ message: "Username Taken" });
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
        res.status(200).json({ message: "Successfully Added Admin" });
    }
})

router.put("/", async (req, res) => {
    const adminInput = req.body;
    
    try {
        const admins= await Admin.find({_id:adminInput._id});
        if(admins.length==0){
            res.status(200).json({ message: "Could not verify identity" });
        }else{
            const currentAdmin =admins[0]
            const loginSuccess = await hashCheck(adminInput.password,currentAdmin.password)
            if(loginSuccess){
                const hashedPassword = await hash(adminInput.newPassword);
                currentAdmin.password = hashedPassword
                const updatedAdmin = await Admin.findByIdAndUpdate(adminInput._id, currentAdmin, { new: true });
                res.status(200).json({ message: "Password change Successful" , payload:updatedAdmin })
            }else{
                res.status(200).json({ message: "Wrong Password" });
            }
        }
        
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

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

module.exports = router