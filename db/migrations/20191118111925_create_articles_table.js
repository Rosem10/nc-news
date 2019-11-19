exports.up = function(knex) {
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title").notNullable();
    articlesTable.text("body").notNullable();
    articlesTable.integer("votes");
    articlesTable.string("topic").references("topics.slug");
    articlesTable
      .string("author")
      .notNullable()
      .references("users.username");
    articlesTable.string("created_at").notNullable();
  });
};
exports.down = function(knex) {
  return knex.schema.dropTable("articles");
};
