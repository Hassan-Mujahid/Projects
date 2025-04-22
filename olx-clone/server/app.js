require("dotenv").config();

const { sequelize } = require("./models");
const express = require("express");
const cors = require("cors");
const userAuthRoutes = require("./routes/Auth");
const adRoutes = require("./routes/Ads");
// const { cloudinaryConfig } = require("./config/cloudinaryConfing");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cloudinaryConfig);
app.use(cors());

const connect = async () => {
  try {
    await sequelize.authenticate();
  } catch (err) {
    console.log(err);
  }
};

connect();

app.use("/user", userAuthRoutes);
app.use("/ads", adRoutes);

app.listen(5000, () => {
  console.log("olx-basic-clone is listening at port 5000");
});
