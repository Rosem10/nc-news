const apiRouter = require("express").Router();
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const commentsRouter = require("./commentsRouter");
const articlesRouter = require("./articlesRouter");
const jsonFunc = require("../controllers/apiController");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter
  .route("/")
  .get(jsonFunc)
  .all((req, res, next) => {
    res.status(405).send({ msg: "Method Not Allowed" });
  });

module.exports = apiRouter;
