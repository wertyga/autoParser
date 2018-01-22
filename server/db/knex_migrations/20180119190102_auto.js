
exports.up = function(knex, Promise) {
    return knex.schema.createTable('categories', t => {
        t.increments();
        t.json('titles');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('categories');
};
