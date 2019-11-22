const commentsRouter = require("express").Router();
const {
  sendUpdatedCommentVotes,
  deleteComment
} = require("../controllers/commentsController");

commentsRouter
  .route("/:comment_id")
  .patch(sendUpdatedCommentVotes)
  .delete(deleteComment);

module.exports = commentsRouter;
