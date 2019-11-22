const articlesRouter = require("express").Router();
const {
  sendArticleObjectById,
  sendUpdatedVotesObject,
  sendComment,
  sendAllComments,
  sendAllArticles
} = require("../controllers/articlesController");

articlesRouter.route("/").get(sendAllArticles);

articlesRouter
  .route("/:articleId")
  .get(sendArticleObjectById)
  .patch(sendUpdatedVotesObject);

articlesRouter
  .route("/:articleId/comments")
  .get(sendAllComments)
  .post(sendComment);

module.exports = articlesRouter;
