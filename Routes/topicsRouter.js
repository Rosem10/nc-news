const topicsRouter = require("express").Router();
const sendAllTopics = require("../controllers/topicsController");
const send405error = require("../errorHandling");

topicsRouter
  .route("/")
  .get(sendAllTopics)
  .all((req, res, next) => {
    res.status(405).send({ msg: "Method Not Allowed" });
  });

module.exports = topicsRouter;
