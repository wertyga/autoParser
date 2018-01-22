import express from 'express';
const log = require('../common/log')(module);

import Categories from '../models/categories';

const route = express.Router();

route.get('/fetch-categories', (req, res) => {
    res.json('fetch-cats')
});

route.get('/get-categories', (req, res) => {
    Categories
        .where({ id: 1 })
        .fetch()
        .then(categories => {
            if(categories) {
                res.json({ categories: JSON.parse(categories.get('title')) });
            } else {
                res.json({ categories: [] });
            }
        })
        .catch(err => {
            log.error(err.message);
            res.status(500).json({ error: err })
        })
});


export default route;