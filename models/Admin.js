const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
   _id:String,
   name: String,
   designation: String,
   joinDate:Date,
   password: String,
   deletedDate: Date
});

const Admin = mongoose.model('admin', adminSchema);

module.exports = { Admin };