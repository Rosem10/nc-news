const connection = require("../db/connection");

const getUpdatedCommentVotes = (comment_id, inc_votes) => {
  return connection("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", inc_votes || 0)
    .returning("*")
    .then(response => response);
};

const removeComment = comment_id => {
  return connection("comments")
    .where("comment_id", comment_id)
    .del();
};

module.exports = { getUpdatedCommentVotes, removeComment };
