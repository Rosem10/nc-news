const commentsRouter = require("express").Router();
const {
  sendUpdatedCommentVotes,
  deleteComment
} = require("../controllers/commentsController");

commentsRouter
  .route("/:comment_id")
  .patch(sendUpdatedCommentVotes)
  .delete(deleteComment)
  .all((req, res, next) => {
    res.status(405).send({ msg: "Method Not Allowed" })
  });

module.exports = commentsRouter;
