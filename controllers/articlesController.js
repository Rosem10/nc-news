const {
  getArticleObjectById,
  getUpdatedVotesObject,
  addComment
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
          message: "UnprocessableEntity"
        });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};

const sendComment = (req, res, next) => {
  const { articleId } = req.params;
  const comment = req.body;

  addComment(articleId, comment)
    .then(comment => res.status(200).send({ comment: comment[0] }))
    .catch(next);
};
module.exports = { sendArticleObjectById, sendUpdatedVotesObject, sendComment };
