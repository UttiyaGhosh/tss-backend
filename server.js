const express = require("express");
const cookieParser = require("cookie-parser")
const cookieSession = require('cookie-session');
const cors = require("cors");
const app = express();
require('dotenv').config();
const { connect } = require("./utils/mongoose_conn.js");

const port = process.env.PORT
const cookieKey = process.env.COOKIE_KEY

app.use(cookieParser(cookieKey))
app.use(cookieSession({
    name: 'session',
    keys: [cookieKey],
    maxAge: 1000*60*30
  }));
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cors());

const adminRouter = require("./routes/adminRouter")
const productRouter = require("./routes/productRouter.js")

app.use("/api/admin",adminRouter)
app.use("/api/product",productRouter)


connect().then((connectedClient) => {
    client = connectedClient;
    console.log(`Connected to MongoDB: ${process.env.DB_NAME}`);
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});

app.listen(port, () => {
    console.log(`Server listening to port ${port}`)
})