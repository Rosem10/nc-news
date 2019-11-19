const express = require("express");
const apiRouter = require("./Routes/apiRouter");

const app = express();

app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "route does not exist" });
});

app.use((err, req, res, next) => {
  // if () {
  res.status(404).send({ msg: "Not Found" });
  // } else {
  //   next(err)
  // }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
