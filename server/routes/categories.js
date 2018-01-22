import express from 'express';
import rp from 'request-promise';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';

import parseConfig from '../data/parserConfig';
import flatten from 'lodash/flatten';

const log = require('../common/log')(module);

import Categories from '../models/categories';

const route = express.Router();

function getAvCategories() {
    const rpOptions = {
        url: parseConfig.av.categoriesPage,
        encoding: null,
        transform: function(body, resp) {
            let decodeBody = iconv.encode(iconv.decode(body, 'windows-1251'), 'utf8').toString();
            return cheerio.load(decodeBody);
        }
    };

    return rp(rpOptions)
        .then(cr => {
            let result = [];
            cr('.brandsitem a').each((i, elem) => {
                const resultObj = {
                    name: cr(elem).find('span').text().trim().replace(/[0-9]/g, ''),
                    cnt: +cr(elem).find('small').text().trim()
                };
                result.push(resultObj);
            });
            return result;
        })
        .catch(err => {
            console.error(err.message);
            log.error(err.message);
        })
};

function getAbwCategories() {
    const rpOptions = {
        url: parseConfig.abw.categoriesPage,
        encoding: null,
        transform: function(body, resp) {
            return cheerio.load(body);
        }
    };

    return rp(rpOptions)
        .then(cr => {
            let result = [];
            cr('.filter-marka-item').each((i, elem) => {
                const resultObj = {
                    name: cr(elem).text().trim().replace(/[0-9]/g, ''),
                    cnt: +cr(elem).find('span').text().trim()
                };
                result.push(resultObj);
            });
            return result;
        })
        .catch(err => {
            console.error(err.message);
            log.error(err.message);
        })
};


route.get('/fetch-categories', (req, res) => {
    Promise.all([
        getAbwCategories(),
        getAvCategories()
    ])
        .then(result => {
            let resultObj = {};
            flatten(result).forEach(item => {
                let rewrite = false;
                for(let key in resultObj) {
                    if(key.toLowerCase() === item.name.toLowerCase()) {
                        resultObj[key] = {
                            ...resultObj[key],
                            cnt: resultObj[key].cnt + item.cnt
                        };
                        rewrite = true;
                    };
                };

                if(!rewrite) {
                    resultObj[item.name] = item;
                }
            });

            const titles = Object.keys(resultObj).map(item => {
                return resultObj[item];
            });

            return Categories.where({ id: 1 }).fetch()
                .then(categories => {
                    let saveObj = {
                        titles: JSON.stringify(titles)
                    };
                    if(categories) {
                        saveObj.id = 1;
                        return new Categories(saveObj).save();
                    } else {
                        return new Categories(saveObj).save();
                    };
                })
        })
        .then(() => res.json('success'))
        .catch(err => {
            console.error(err.message)
            log.error(err.message);
        })
});

route.get('/get-categories', (req, res) => {
    Categories
        .where({ id: 1 })
        .fetch()
        .then(categories => {
            if(categories) {
                res.json({ categories: categories.get('titles') });
            } else {
                res.json({ categories: [] });
            }
        })
        .catch(err => {
            log.error(err.message);
            res.status(500).json({ error: err });
        })
});


export default route;