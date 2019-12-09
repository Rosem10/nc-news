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

const fetchAllComments = (articleId, column = "created_at", order = "desc") => {
  return connection
    .select("*")
    .from("comments")
    .where("article_id", articleId)
    .orderBy(column, order)
    .then(comments => {
      const checkArticleExists = articleId
        ? doesItExist(articleId, "articles", "articles.article_id")
        : null;
      return Promise.all([checkArticleExists, comments]);
    })
    .then(response => {
      if (response[0] === false) {
        return Promise.reject({
          status: 404,
          msg: "Not Found"
        });
      } else {
        return response[1];
      }
    });
};

const getAllArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  return connection
    .select("articles.*")
    .count({ comment_count: "comments.article_id" })
    .from("articles")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)
    .modify(query => {
      if (author) query.where({ "articles.author": author });
      if (topic) query.where({ "articles.topic": topic });
    })
    .then(articles => {
      const checkTopicExists = topic
        ? doesItExist(topic, "topics", "topics.slug")
        : null;
      const checkAuthorExists = author
        ? doesItExist(author, "users", "users.username")
        : null;
      return Promise.all([checkTopicExists, checkAuthorExists, articles]).then(
        ([checkTopicExists, checkAuthorExists, articles]) => {
          if (checkAuthorExists === false) {
            return Promise.reject({
              status: 404,
              msg: "Not Found"
            });
          }
          if (checkTopicExists === false) {
            return Promise.reject({
              status: 404,
              msg: "Not Found"
            });
          } else {
            return articles;
          }
        }
      );
    });
};

const doesItExist = (query, table, column) => {
  return connection
    .select("*")
    .from(table)
    .where(column, query)
    .then(returned => {
      if (returned.length === 0) {
        return false;
      } else return true;
    });
  // if (author) {
  //   doesAuthorExist = connection
  //     .select("username")
  //     .from("users")
  //     .where("username", author)
  //     .then(users => {
  //       if (users.length === 0) {
  //         return Promise.reject({
  //           status: 404,
  //           msg: "Not Found"
  //         });
  //       }
  //     });
  //   if (topic) {
  //     doesTopicExist = connection
  //       .select("slug")
  //       .from("topics")
  //       .where("slug", topic)
  //       .then(users => {
  //         if (users.length === 0) {
  //           return Promise.reject({
  //             status: 404,
  //             msg: "Not Found"
  //           });
  //         }
  //       });

  //     return Promise.all([doesAuthorExist, doesTopicExist]);
  //   }
  // }
};

module.exports = {
  getArticleObjectById,
  getUpdatedVotesObject,
  addComment,
  fetchAllComments,
  getAllArticles
};
