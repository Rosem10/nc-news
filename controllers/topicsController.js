const getAllTopics = require("../models/topicsModel");

const sendAllTopics = (req, res, next) => {
  getAllTopics()
    .then(topics => res.status(200).send({ topics }))
    .catch(next);
};

module.exports = sendAllTopics;
