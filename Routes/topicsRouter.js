const topicsRouter = require("express").Router();
const sendAllTopics = require("../controllers/topicsController");

topicsRouter.route("/").get(sendAllTopics);

module.exports = topicsRouter;
