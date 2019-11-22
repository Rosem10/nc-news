const commentsRouter = require("express").Router();
const sendUpdatedCommentVotes = require("../controllers/commentsController");

commentsRouter.route("/:comment_id").patch(sendUpdatedCommentVotes);


module.exports = commentsRouter;
