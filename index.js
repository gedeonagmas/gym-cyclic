const express = require("express");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const app = express();
const router = require("./routes/routes");
const { errorController } = require("./controller/errorController");
const mongodb = require("./config/db");

// process.on("uncaughtException", (err) => {
//   console.log("SHUTTING DOWN");
//   console.log(err.name, err.message);
//   process.exit(1);
// });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/gym/app/v1",router);

app.all("*", (req, res, next) => {
  res.status(200).json({ message: `${req.originalUrl} is invalid url` });
  next();
});

app.use(errorController);

app.use(express.static(path.join(__dirname, "./client/dist")));
app.get("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

mongodb()
  .then(() => {
    app.listen(3000, (err) => {
      if (err) console.log(err);
      console.log("gym server connected on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

// process.on("unhandledRejection", (err) => {
//   console.log("SHUTTING DOWN");
//   console.log(err.message, err.name);
//   server.close(() => {
//     process.exit(1);
//   });
// });
