const getUpdatedCommentsVotes = (comment_id, inc_votes) => {
  console.log(comment_id, inc_votes);
  return connection("articles")
    .where("comments.comment_id")
    .from("commets")
    .returning("*");
};

module.exports = getUpdatedCommentsVotes;
