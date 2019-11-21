const express = require("express");
const apiRouter = require("./Routes/apiRouter");
const {
  routeNotExist,
  psqlErrors,
  notFound,
  serverError,
  noContent,
  unprocessableEntity
} = require("./errorHandling");
const app = express();

app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", routeNotExist);
app.use(psqlErrors);
app.use(notFound);
app.use(noContent);
app.use(unprocessableEntity);
app.use(serverError);

module.exports = app;
