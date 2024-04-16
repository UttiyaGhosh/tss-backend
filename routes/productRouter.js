const express = require("express")
const {Product}= require("../models/Product.js");

const router = express.Router()

router.get("/all", async(req,res)=>{
    try{
        const products = await Product.find({deletedDate:null});
        res.status(200).json(products)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.get("/", async(req,res)=>{
    const searchQuery = req.body
    try{
        const products = await Product.find(searchQuery);
        res.status(200).json(products[0])
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.post("/", async(req,res)=>{
    const productInput = req.body
    let product = new Product(
        {
            brand: productInput.brand,
            name: productInput.name,
            description: productInput.description,
        }
    )
    try{
        const savedProduct = await product.save();
        res.status(201).json(savedProduct)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.put("/", async (req, res) => {
    const productInput = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productInput._id, productInput, { new: true });
        res.status(200).json(updatedProduct)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/", async (req, res) => {
    const deleteQuery = req.query
    try {
        const deletedProduct = await Product.findByIdAndUpdate(deleteQuery._id, {$set:{deletedDate:new Date()}}, { new: true });
        res.status(200).json(deletedProduct)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router