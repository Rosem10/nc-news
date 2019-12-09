const {
  getArticleObjectById,
  getUpdatedVotesObject,
  addComment,
  fetchAllComments,
  getAllArticles
} = require("../models/articlesModel");

const sendArticleObjectById = (req, res, next) => {
  const { articleId } = req.params;
  getArticleObjectById(articleId)
    .then(article => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Not Found"
        });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};

const sendUpdatedVotesObject = (req, res, next) => {
  const inc_votes = req.body;
  const { articleId } = req.params;

  getUpdatedVotesObject(inc_votes, articleId)
    .then(article => {
      let lengthOfInc_Votes = Object.entries(inc_votes).length;
      if (lengthOfInc_Votes > 1) {
        return Promise.reject({
          status: 422,
          message: "Unprocessable Entity"
        });
      }
      const articleObj = { ...article };
      res.status(200).send({ article: articleObj[0] });
    })
    .catch(next);
};

const sendComment = (req, res, next) => {
  const { articleId } = req.params;
  const comment = req.body;

  addComment(articleId, comment)
    .then(comment => res.status(201).send({ comment: comment[0] }))
    .catch(next);
};

const sendAllComments = (req, res, next) => {
  const { articleId } = req.params;
  const column = req.query.sort_by;
  const order = req.query.order;
  fetchAllComments(articleId, column, order)
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Not Found"
        });
      }

      res.status(200).send({ comments });
    })
    .catch(next);
};

const sendAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  getAllArticles(sort_by, order, author, topic)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);

};

module.exports = {
  sendArticleObjectById,
  sendUpdatedVotesObject,
  sendComment,
  sendAllComments,
  sendAllArticles
};
