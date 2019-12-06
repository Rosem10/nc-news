exports.up = function(knex) {
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary();
    commentsTable
      .string("author")
      .notNullable()
      .references("users.username");
    commentsTable
      .integer("article_id")
      .notNullable()
      .references("articles.article_id");
    commentsTable
      .integer("votes")
      .notNullable()
      .defaultTo(0);
    commentsTable.timestamp("created_at").notNullable();
    commentsTable.text("body").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("comments");
};
