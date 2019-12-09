const jsonFunc = (req, res, next) => {
  res.status(200).send({
    endpoints: {
      "GET /api": {
        description:
          "serves up a json representation of all the available endpoints of the api"
      },
      "GET /api/topics": {
        description: "serves an array of all topics",
        queries: [],
        exampleResponse: {
          topics: [{ slug: "football", description: "Footie!" }]
        }
      },
      "GET /api/articles": {
        description: "serves an array of all topics",
        queries: ["author", "topic", "sort_by", "order"],
        exampleResponse: {
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api"
          },
          "GET /api/topics": {
            description: "serves an array of all topics",
            queries: [],
            exampleResponse: {
              topics: [{ slug: "football", description: "Footie!" }]
            }
          },
          "GET /api/articles": {
            description: "serves an array of all articles",
            queries: ["author", "topic", "sort_by", "order"],
            exampleResponse: {
              articles: [
                {
                  title: "Seafood substitutions are increasing",
                  topic: "cooking",
                  author: "weegembump",
                  body: "Text from the article..",
                  created_at: 1527695953341
                }
              ]
            },
            "GET /api/articles/articleId": {
              description:
                "serves an object with information for the article specified",
              queries: [],
              exampleResponse: {
                article: {
                  article_id: 9,
                  title: "They're not exactly dogs, are they?",
                  body: "Well? Think about it.",
                  votes: 0,
                  topic: "mitch",
                  author: "butter_bridge",
                  created_at: "1986-11-23T12:21:54.171Z",
                  comment_count: "2"
                }
              }
            }
          },
          "PATCH /articles": {
            description:
              "updates article.votes when passed an inc_votes argument",
            queries: [],
            "example input": { inc_votes: 1 },
            exampleResponse: {
              article: {
                article_id: 1,
                title: "Living in the shadow of a great man",
                body: "I find this existence challenging",
                votes: 101,
                topic: "mitch",
                author: "butter_bridge",
                created_at: "2018-11-15T12:21:54.171Z"
              }
            }
          },
          "PATCH /api/articles/articleId/comments": {
            description: "returns a new comment for the passed article",
            queries: [],
            exampleInput: {
              username: "butter_bridge",
              body: "A new comment"
            },
            exampleResponse: {
              comment: {
                comment_id: 19,
                author: "butter_bridge",
                article_id: 1,
                votes: 0,
                created_at: "2019-12-09T00:00:00.000Z",
                body: "A new comment"
              }
            }
          },
          "GET /api/articles/articleId/comments": {
            description:
              "responds with an array of comments for the articleId passed",
            queries: ["sort_by", "order"],
            exampleResponse: [
              {
                comment_id: 2,
                author: "butter_bridge",
                article_id: 1,
                votes: 14,
                created_at: "2016-11-22T00:00:00.000Z",
                body:
                  "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
              },
              {
                comment_id: 3,
                author: "icellusedkars",
                article_id: 1,
                votes: 100,
                created_at: "2015-11-23T00:00:00.000Z",
                body:
                  "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works."
              },
              {
                comment_id: 4,
                author: "icellusedkars",
                article_id: 1,
                votes: -100,
                created_at: "2014-11-23T00:00:00.000Z",
                body:
                  "I carry a log — yes. Is it funny to you? It is not to me."
              }
            ]
          },
          "PATCH /api/comments/1": {
            description:
              "updates a comment's vote count by the amount indicated in the passed object",
            queries: [],
            exampleInput: { inc_votes: 4 },
            exampleResponse: {
              comment: {
                comment_id: 1,
                author: "butter_bridge",
                article_id: 9,
                votes: 20,
                created_at: "2017-11-22T00:00:00.000Z",
                body:
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
              }
            }
          },
          "DELETE /api/comments/": {
            description:
              "deletes the comment relating to the passed comment_id",
            queries: [],
            responseStatus: 204
          },
          "GET/users/username": {
            description:
              "returns the requested user object, dependent on the username passed",
            queries: [],
            exampleResponse: {
              user: {
                username: "icellusedkars",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
                name: "sam"
              }
            }
          }
        }
      }
    }
  });
};

module.exports = jsonFunc;
