const apiRouter = require("express").Router();
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const commentsRouter = require("./commentsRouter");
const articlesRouter = require("./articlesRouter");
const { methodNotAllowed } = require("../errorHandling");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter.use("/*", methodNotAllowed);
module.exports = apiRouter;
