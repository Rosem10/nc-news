const getUpdatedCommentVotes = require("../models/commentsModel");
const sendUpdatedCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  getUpdatedCommentVotes(comment_id, inc_votes).then(votes =>
    console.log(votes)
  );
};
module.exports = sendUpdatedCommentVotes;
