const { expect } = require("chai");

const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns a single object with a correctly formatted date, when passed an array", () => {
    const list = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const actual = formatDates(list);
    const reformattedDate = new Date(1542284514171).toDateString();
    expect(actual).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: `${reformattedDate}`,
        votes: 100
      }
    ]);
  });
  it("returns a new array", () => {
    const list = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const actual = formatDates(list);
    const expected = [
      {
        title: "Living in the shadow of a great man",  
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "Thu Nov 15 2018",
        votes: 100
      }
    ];
    expect(actual).to.not.equal(expected);
  });

  it("returns a multiple correctly formatted objects", () => {
    const list = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1542284514171
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1542284514171
      }
    ];
    const actual = formatDates(list);
    const expected = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: "Thu Nov 15 2018"
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: "Thu Nov 15 2018"
      }
    ];
  });
});

describe("makeRefObj", () => {
  it("returns an object", () => {
    const actual = makeRefObj([]);
    const expected = {};
    expect(actual).to.eql(expected);
  });

  it("returns an object of key value pairs of article title : article_id", () => {
    let actual = makeRefObj([
      {
        article_id: 1,
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: "Thu Nov 15 2018"
      }
    ]);
    let expected = { "Student SUES Mitch!": 1 };
    expect(actual).to.eql(expected);
    actual = makeRefObj([
      {
        article_id: 1,
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: "Thu Nov 15 2018"
      },
      {
        article_id: 6,
        title: "Let's party",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: "Thu Nov 15 2018"
      }
    ]);
    expected = { "Student SUES Mitch!": 1, "Let's party": 6 };
    expect(actual).to.eql(expected);
  });
});

describe("formatComments", () => {
  it("returns a new array", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const testArticleRef = { "They're not exactly dogs, are they?": 1 };
    const actual = formatComments(comments, testArticleRef);
    expect(actual).to.not.equal(comments);
  });
  it("returns a new array with the objects inside reformatted to have an author key, instead of created_by", () => {
    const comments = [
      {
        created_by: "butter_bridge"
      }
    ];
    expect(formatComments(comments)).to.eql([
      {
        author: "butter_bridge"
      }
    ]);
  });
  it("returns a new array with the objects inside reformatted to have an article_id, instead of belongs_to", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    formatComments(comments, {});
    expect(comments).to.eql([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ]);
  });
  it("The value of the new article_id key is id corresponding to the original title value provided", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const articleRef = { "They're not exactly dogs, are they?": 1 };
    expect(formatComments(comments, articleRef)).to.eql([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        created_at: "Wed Nov 22 2017",
        author: "butter_bridge",
        article_id: 1
      }
    ]);
  });
  it("returns a created_at value as a date object", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        created_at: 1511354163389,
        author: "butter_bridge",
        article_id: 1
      }
    ];
    const actual = formatComments(comments, {});
    const newDate = new Date(comments[0].created_at).toDateString();
    const expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        created_at: `${newDate}`,
        author: "butter_bridge",
        article_id: 1
      }
    ];
    expect(actual).to.eql(expected);
  });
});
