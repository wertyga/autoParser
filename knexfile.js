// Update with your config settings.

module.exports = {

    development: {
        client: 'pg',
        connection: {
            database: 'auto-parser',
            user:     'wertyga',
            password: 'wertygan'
        },
        migrations: {
            directory: __dirname + '/server/db/knex_migrations',
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: __dirname + '/server/db/seeds'
        },
        // debug: true,
        pool: {
            afterCreate: function(conn, done) {
                conn.query('SET timezone="UTC";', err => {
                    if(err) {
                        done(err, conn);
                    } else {
                        done(err, conn);
                    }
                })
            }
        }
    },

    production: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user:     'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }

};
