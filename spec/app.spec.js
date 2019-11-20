process.env.NODE_ENV = "test";
const request = require("supertest");
const { expect } = require("chai");
const app = require("../app");
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
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
    it("GET 404 and error message for article that doesn't exist", () => {
      //will not give us an error, will give an empty array
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
          expect(body.article[0].votes).to.equal(101);
        });
    });
    it("PATCH 200 and unchanged error message if no 'inc_votes' included in the request", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(200)
        .then(({ body }) => {
          expect(body.article[0].votes).to.equal(100);
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
    it("POST 200 and returns a new comment for the passed article", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          butter_bridge: "A new comment"
        })
        .expect(200)
        .then(({ body }) => {
          console.log(body);
        });
    });
  });
});
