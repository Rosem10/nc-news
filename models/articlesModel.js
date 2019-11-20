const connection = require("../db/connection");

const getArticleObjectById = articleId => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .count({ comment_count: "comments.comment_id" })
    .where("articles.article_id", articleId)
    .first();
};

const getUpdatedVotesObject = (inc_votes, articleId) => {
  return connection("articles")
    .where("article_id", articleId)
    .increment("votes", inc_votes.inc_votes || 0)
    .returning("*");
};

const addComment = () => {};

module.exports = { getArticleObjectById, getUpdatedVotesObject, addComment };
