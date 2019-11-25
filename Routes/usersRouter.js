const usersRouter = require("express").Router();
const sendUserById = require("../controllers/usersController");

usersRouter
  .route("/:username")
  .get(sendUserById)
  .all((req, res, next) => {
    res.status(405).send("Method Not Allowed");
  });

module.exports = usersRouter;
