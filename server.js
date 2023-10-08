const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const postRouter = require("./Routes/posts.js");
const userRouter = require("./Routes/user.js");

//config
const app = express();
dotenv.config();

//middleware
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

//Routes
app.use("/posts", postRouter);
app.use("/users", userRouter);

//Database Connection
mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log("Sevrer running on port " + PORT);
    });
  })
  .catch((err) => console.log("Database Not Conntected ! " + err.message));
