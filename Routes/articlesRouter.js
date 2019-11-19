const articlesRouter = require("express").Router();
const sendArticleObjectById = require("../controllers/articlesController");

articlesRouter.route("/").get(sendArticleObjectById);

module.exports = articlesRouter;
