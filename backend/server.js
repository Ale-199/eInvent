//
const path = require("path");

//
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const contactRoute = require("./routes/contactRoute");
const errorHandler = require("./middleWare/errorMiddleware");

//
dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//init express
const app = express();

//Middleware
//-express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(express.json());
app.use(cookieParser());
//-express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays
app.use(
  express.urlencoded({
    extended: false,
  })
);
//-The body parser helps us pass that data and convert it to an object that
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://pinvent-app.vercel.app"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Route Middleware
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/contactus", contactRoute);

//Routes
app.get("/", (req, res) => {
  res.send("home route");
});

//Error Middleware
app.use(errorHandler);

//Connect to MOngoDB
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
