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

const addComment = (article_id, comment) => {
  return connection
    .insert({
      author: comment.username,
      article_id: article_id,
      body: comment.body,
      created_at: new Date().toDateString()
    })
    .into("comments")
    .returning("*");
};

const fetchAllComments = (articleId, column = "comment_id", order = "desc") => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", articleId)
    .orderBy(column, order)
    .returning("*");
};

const getAllArticles = (
  sort_by = "created_at",
  order_by = "DESC",
  author,
  topic
) => {
  if (author) {
    return connection
      .select("articles.*")
      .where("articles.author", author)
      .count({ comment_count: "comments.article_id" })
      .from("articles")
      .leftJoin("comments", "comments.article_id", "articles.article_id")
      .groupBy("articles.article_id")
      .orderBy(sort_by, order_by)
      .returning("*");
  }
  if (topic) {
    return connection
      .select("articles.*")
      .where("articles.topic", topic)
      .count({ comment_count: "comments.article_id" })
      .from("articles")
      .leftJoin("comments", "comments.article_id", "articles.article_id")
      .groupBy("articles.article_id")
      .orderBy(sort_by, order_by)
      .returning("*");
  }
  if (!author && !topic) {
    return connection
      .select("articles.*")
      .count({ comment_count: "comments.article_id" })
      .from("articles")
      .leftJoin("comments", "comments.article_id", "articles.article_id")
      .groupBy("articles.article_id")
      .orderBy(sort_by, order_by)
      .returning("*");
  }
};

module.exports = {
  getArticleObjectById,
  getUpdatedVotesObject,
  addComment,
  fetchAllComments,
  getAllArticles
};
