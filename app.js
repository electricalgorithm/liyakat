const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')

const app = express();
const port = process.env.PORT || 5353;

require("dotenv").config();

app.use(express.urlencoded( {extended: true} ));
app.use(express.static("public"));
app.use(expressLayouts);
app.use(cookieParser());

app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

const routes = require("./server/routes/entryRoutes.js");
app.use("/", routes);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Check the database connection.
const db = mongoose.connection;
db.on("error", console.error.bind(console, "> Connection error with database."))
db.once("open", function() {
    console.log("> Connected to database.")
})

app.listen(port, () => console.log(`> Sunucu ${port}'da çalıştırıldı.`))