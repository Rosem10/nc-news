const articlesRouter = require("express").Router();
const {
  sendArticleObjectById,
  sendUpdatedVotesObject,
  sendComment,
  sendAllComments,
  sendAllArticles
} = require("../controllers/articlesController");

articlesRouter
  .route("/")
  .get(sendAllArticles)
  .all((req, res, next) => {
    res.status(405).send({ msg: "Method Not Allowed" });
  });

articlesRouter
  .route("/:articleId")
  .get(sendArticleObjectById)
  .patch(sendUpdatedVotesObject)
  .all((req, res, next) => {
    res.status(405).send({ msg: "Method Not Allowed" });
  });

articlesRouter
  .route("/:articleId/comments")
  .get(sendAllComments)
  .post(sendComment)
  .all((req, res, next) => {
    res.status(405).send({ msg: "Method Not Allowed" });
  });

module.exports = articlesRouter;
