process.env.NODE_ENV = "test";

const request = require("supertest");
const { expect } = require("chai");
const app = require("../app");
const connection = require("../db/connection");
const chai = require("chai");
const chaiSorted = require("chai-sorted");

chai.use(chaiSorted);

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  it("GET 405 and error message when request made for Method that is not defined", () => {
    return request(app)
      .delete("/api")
      .expect(405)
      .then(({ body }) => {
        expect(body.msg).to.equal("Method Not Allowed");
      });
  });

  describe("/topics", () => {
    it("GET 200: responds with an array of topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.be.an("array");
          expect(body.topics[0]).to.contain.keys("slug", "description");
        });
    });
    it("GET 405 and error message if request made to an method that doesn't exist", () => {
      return request(app)
        .patch("/api/topics")
        .send({ name: "Graham" })
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
  });

  describe("/users", () => {
    it("GET 200, returns the requested user object, dependent on the username passed", () => {
      return request(app)
        .get("/api/users/icellusedkars") // give us the object matching the username
        .expect(200)
        .then(({ body }) => {
          expect(body.user.username).to.eql("icellusedkars");
          expect(body.user.username).to.be.a("string");
        });
    });

    it("GET 404 and error message for a username that doesn't exist", () => {
      return request(app)
        .get("/api/users/notUsername")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
  });
  describe("/articles", () => {
    it("GET 200 and responds with an object", () => {
      return request(app)
        .get("/api/articles/9")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("object");
        });
    });

    it("GET 200 and responds with an object including a count of all the comments that have a matching article_id to this article", () => {
      return request(app)
        .get("/api/articles/9")
        .expect(200)
        .then(({ body }) => {
          expect(body.article.comment_count).to.equal("2");
        });
    });
    it("GET 405 and error message for method that isn't allowed on /articles route", () => {
      return request(app)
        .put("/api/articles")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("GET 405 and error message for method not allowed on /articles/:articleId route", () => {
      return request(app)
        .put("/api/articles/1")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("GET 404 and error message for article that doesn't exist", () => {
      return request(app)
        .get("/api/articles/666")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
    it("GET 400 and error message for wrong type of article_id", () => {
      return request(app)
        .get("/api/articles/invalidArticleId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("PATCH 200 and updates article.votes when passed an inc_votes", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(101);
          const array = Array.isArray(body.article);
          expect(array).to.equal(false);
        });
    });
    it("PATCH 200 and unchanged response if patch request made with no info in it", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 0 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(100);
        });
    });
    it("PATCH 200 and unchanged response if no 'inc_votes' included in the request", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(100);
        });
    });
    it("PATCH 400 and error message if wrong data type included as inc_votes: value", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "cats" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql("Bad Request");
        });
    });
    it("PATCH 422 and error message if given additional information on the request", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1, name: "Rose" })
        .expect(422)
        .then(({ body }) => {
          expect(body.msg).to.eql("Unprocessable Entity");
        });
    });
    it("POST 201 and returns a new comment for the passed article", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
          body: "A new comment"
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment.body).to.equal("A new comment");
          expect(body.comment.author).to.equal("butter_bridge");
        });
    });
    it("GET 405 and returns an error message when method requested is not defined", () => {
      return request(app)
        .put("/api/articles/1/comments")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("POST 404 and returns an error message when comment is submitted to article_id that doesn't exist", () => {
      return request(app)
        .post("/api/articles/666/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("POST 404 and returns an error message when object submitted is missing information", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("POST 404 and returns an error message when username submitted doesn't exist", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "buster_bridge", body: "la la la" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
    it("POST 400 and error message when Article id is invalid type", () => {
      return request(app)
        .post("/api/articles/something/comments")
        .send({
          username: "butter_bridge",
          body: "A new comment"
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("GET 200 and responds with an array of comments for the articleId passed", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.a("object");
        });
    });
    it("GET 200 and sorts response according to sort_by query passed", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.sortedBy("votes", { descending: true });
        });
    });
    it("GET 200 and orders the response according to the order query passed", () => {
      return request(app)
        .get("/api/articles/1/comments?")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("GET 400 and error message when receiving an invalid article_id type", () => {
      return request(app)
        .get(
          "/api/articles/invalid_article_id/comments?sort_by=votes&&order_by=desc"
        )
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("GET 404 and error message when receiving a valid article_id that doesn't exist", () => {
      return request(app)
        .get("/api/articles/9999/comments?sort_by=votes&&order_by=desc")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
    it("GET 200 and empty array for a valid article_id with no attached comments", () => {
      return request(app)
        .get("/api/articles/12/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.eql([]);
        });
    });
    it("GET 400 and error message when receiving an invalid column value to sort by", () => {
      return request(app)
        .get("/api/articles/9999/comments?sort_by=not_a_column&&order_by=desc")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("GET 400 and error message when receiving an invalid order by command", () => {
      return request(app)
        .get(
          "/api/articles/9999/comments?sort_by=not_a_column&&order_by=invalid_order_by"
        )
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("GET 200 and responds with an array of article objects with the correct keys", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0]).to.contain.keys(
            "author",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
    it("*GET 200 and responds with articles ordered according to the column passed in as the sort_by query", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("GET 200 and accepts a sort_by query, which sorts the articles by any valid column passed", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("votes", { descending: true });
        });
    });
    it("GET 200 and accepts an order_by query, which defaults to descending", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("votes", { descending: true });
        });
    });
    it("GET 200 and accepts and order_by query which alters the result returned when passed ascending", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&&order=ASC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("created_at", {
            descending: false
          });
        });
    });
    it("GET 200 and accepts an author query, which filters the values by username specified in the query", () => {
      return request(app)
        .get("/api/articles?author=icellusedkars")
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article =>
            expect(article.author).to.equal("icellusedkars")
          );
        });
    });
    it("GET 404 and error message when passed an author that doesn't exist", () => {
      //not sure how to separate this from author that exists but has no articles
      return request(app)
        .get("/api/articles?author=icellusedjars")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });

    it("GET 200 and returns an unfiltered array if passed an author that exists, but has no associate articles", () => {
      return request(app)
        .get("/api/articles?author=lurker")
        .expect(200);
    });

    it("GET 200 and filters the values by topic specified in query", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach(article =>
            expect(article.topic).to.equal("cats")
          );
        });
    });
    it("GET 200 Returns unfiltered articles if passed an invalid query", () => {
      return request(app)
        .get("/api/articles?dogs=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.eql([
            {
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 100,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z",
              comment_count: "13"
            },
            {
              article_id: 2,
              title: "Sony Vaio; or, The Laptop",
              body:
                "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
              votes: 0,
              topic: "mitch",
              author: "icellusedkars",
              created_at: "2014-11-16T12:21:54.171Z",
              comment_count: "0"
            },
            {
              article_id: 3,
              title: "Eight pug gifs that remind me of mitch",
              body: "some gifs",
              votes: 0,
              topic: "mitch",
              author: "icellusedkars",
              created_at: "2010-11-17T12:21:54.171Z",
              comment_count: "0"
            },
            {
              article_id: 4,
              title: "Student SUES Mitch!",
              body:
                "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
              votes: 0,
              topic: "mitch",
              author: "rogersop",
              created_at: "2006-11-18T12:21:54.171Z",
              comment_count: "0"
            },
            {
              article_id: 5,
              title: "UNCOVERED: catspiracy to bring down democracy",
              body: "Bastet walks amongst us, and the cats are taking arms!",
              votes: 0,
              topic: "cats",
              author: "rogersop",
              created_at: "2002-11-19T12:21:54.171Z",
              comment_count: "2"
            },
            {
              article_id: 6,
              title: "A",
              body: "Delicious tin of cat food",
              votes: 0,
              topic: "mitch",
              author: "icellusedkars",
              created_at: "1998-11-20T12:21:54.171Z",
              comment_count: "1"
            },
            {
              article_id: 7,
              title: "Z",
              body: "I was hungry.",
              votes: 0,
              topic: "mitch",
              author: "icellusedkars",
              created_at: "1994-11-21T12:21:54.171Z",
              comment_count: "0"
            },
            {
              article_id: 8,
              title: "Does Mitch predate civilisation?",
              body:
                "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
              votes: 0,
              topic: "mitch",
              author: "icellusedkars",
              created_at: "1990-11-22T12:21:54.171Z",
              comment_count: "0"
            },
            {
              article_id: 9,
              title: "They're not exactly dogs, are they?",
              body: "Well? Think about it.",
              votes: 0,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "1986-11-23T12:21:54.171Z",
              comment_count: "2"
            },
            {
              article_id: 10,
              title: "Seven inspirational thought leaders from Manchester UK",
              body: "Who are we kidding, there is only one, and it's Mitch!",
              votes: 0,
              topic: "mitch",
              author: "rogersop",
              created_at: "1982-11-24T12:21:54.171Z",
              comment_count: "0"
            },
            {
              article_id: 11,
              title: "Am I a cat?",
              body:
                "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
              votes: 0,
              topic: "mitch",
              author: "icellusedkars",
              created_at: "1978-11-25T12:21:54.171Z",
              comment_count: "0"
            },
            {
              article_id: 12,
              title: "Moustache",
              body: "Have you seen the size of that thing?",
              votes: 0,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "1974-11-26T12:21:54.171Z",
              comment_count: "0"
            }
          ]);
        });
    });
    it("GET 404 and returns error message if passed a topic value that doesn't exist", () => {
      return request(app)
        .get("/api/articles?topic=otters")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
  });
  describe("comments", () => {
    it("PATCH 200 and updates a comment's vote count by the amount indicated in the passed object", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 4 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(20);
          const commentsArray = Array.isArray(body.comment);
          expect(commentsArray).to.equal(false);
          expect(body).to.contain.keys("comment");
        });
    });
    it("PATCH 200 and returns an unaltered array when passed additional values to patch", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: 4, LeedsUnited: 5 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).to.eql({
            comment_id: 2,
            author: "butter_bridge",
            article_id: 1,
            votes: 18,
            created_at: "2016-11-22T00:00:00.000Z",
            body:
              "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
          });
        });
    });
    it("PATCH 400 and returns error message when passed an inc_votes value that doesn't exist", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: "Rocketship" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("PATCH 404 and returns error message when passed an object to an article_id that doesn't exist", () => {
      return request(app)
        .patch("/api/comments/21222")
        .send({ inc_votes: 4 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
    it("PATCH 200 and sends unchanged comment when sent a body with no inc_votes value", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ name: "Rocketship" })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).to.eql({
            comment_id: 2,
            author: "butter_bridge",
            article_id: 1,
            votes: 14,
            created_at: "2016-11-22T00:00:00.000Z",
            body:
              "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
          });
        });
    });
    it("PATCH 405 and returns an error message when method requested is not defined", () => {
      return request(app)
        .put("/api/comments/1")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method Not Allowed");
        });
    });
    it("PATCH 400 and returns an error message when passed an invalid comment_id", () => {
      return request(app)
        .patch("/api/comments/Rocketship")
        .send({ inc_votes: 4 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("PATCH 200 and deletes the comment relating to the passed comment_id", () => {
      return request(app)
        .delete("/api/comments/2")
        .expect(204);
    });
    it("PATCH 404 and returns an error message if the requested comment to be deleted doesn't exist", () => {
      return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
    it("PATCH 400 and returns an error messaage when passed a comment_id of an invalid type", () => {
      return request(app)
        .delete("/api/comments/notNumber")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
  });
});
