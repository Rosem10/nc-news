const {
  getUpdatedCommentVotes,
  removeComment
} = require("../models/commentsModel");

const sendUpdatedCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  getUpdatedCommentVotes(comment_id, inc_votes)
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found"
        });
      }
      const commentsObj = { ...comments };
      res.status(200).send({ comment: commentsObj[0] });
    })
    .catch(next);
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(comment => {
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: "Not Found"
        });
      } else {
        res.sendStatus(204);
      }
    })
    .catch(next);
};

module.exports = { sendUpdatedCommentVotes, deleteComment };
