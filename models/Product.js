const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
   brand: String,
   name: String,
   description: String,
   deletedDate: Date
});

const Product = mongoose.model('product', productSchema);

module.exports = { Product };