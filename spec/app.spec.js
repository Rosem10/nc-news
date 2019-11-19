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

    it("GET 404 and error message for invalid username type", () => {
      return request(app)
        .get("/api/users/666")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
  });
  describe("/articles", () => {
    it("GET 200 and responds with an object", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an(object);
        });
    });
  });
});
