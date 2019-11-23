const topicsRouter = require("express").Router();
const sendAllTopics = require("../controllers/topicsController");

topicsRouter
  .route("/")
  .get(sendAllTopics)
  .all((req, res, next) => {
    res.status(405).send({ msg: "Method Not Allowed" });
  });

module.exports = topicsRouter;
