const articlesRouter = require("express").Router();
const {
  sendArticleObjectById,
  sendUpdatedVotesObject,
  sendComment
} = require("../controllers/articlesController");

articlesRouter
  .route("/:articleId")
  .get(sendArticleObjectById)
  .patch(sendUpdatedVotesObject);

articlesRouter.route("/:articleId/comments").post(sendComment);

module.exports = articlesRouter;
