const usersRouter = require("express").Router();
const sendUserById = require("../controllers/usersController");

usersRouter.route("/:username").get(sendUserById);

module.exports = usersRouter;
