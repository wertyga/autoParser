import express from 'express';
import bodyParser from 'body-parser';

import path from 'path';
import cluster from 'cluster';
import http from 'http';

import config from './common/config';
const log = require('./common/log')(module);


// ****************** Import routes *************
import categories from './routes/categories';

//***********************************************

const dev = process.env.NODE_ENV.trim() === 'development';


const app = express();

if (dev ? false : cluster.isMaster) {

    let cpuCount = require('os').cpus().length;

    for (let i = 0; i < cpuCount; i += 1) {
        cluster.schedulingPolicy = cluster.SCHED_NONE;
        cluster.fork();
    }

    cluster.on('exit', function (worker) {
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();
    });

} else {

    const server = http.createServer(app);

    //****************** Webpack ********************
    if(dev) {
        const webpack = require('webpack');
        const webpackConfig = require('../webpack.dev.config');
        const webpackHotMiddleware = require('webpack-hot-middleware');
        const webpackMiddleware = require('webpack-dev-middleware');

        const compiler = webpack(webpackConfig);

        app.use(webpackMiddleware(compiler, {
            hot: true,
            publicPath: webpackConfig.output.publicPath,
            noInfo: true
        }));
        app.use(webpackHotMiddleware(compiler));
    }

    //**********************************************

    app.use(bodyParser.json());
    // app.use(cookieParser());
    if(!dev) app.use(express.static(path.join(__dirname, '..', 'client', 'static')));
    app.use(express.static(path.join(__dirname, config.uploads.directory)));

    //************************* GARBAGE magic ***********************************

    // Для работы с garbage collector запустите проект с параметрами:
    // node --nouse-idle-notification --expose-gc app.js
    if(!dev) {
        let gcInterval;

        function init() {
            gcInterval = setInterval(function () {
                gcDo();
            }, 60000);
        };

        function gcDo() {
            global.gc();
            clearInterval(gcInterval);
            init();
        };

        init();
    }

    //************************************************************

    //******************************** Routes ***************************

    app.use('/categories', categories);

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'))
    });


    //******************************** Run server ***************************

    app.listen(config.PORT, () => console.log(`Server run on ${config.PORT} port`));
};

//******************************** Uncaught Exception ***************************

process.on('uncaughtException', function (err) {
    log.error((new Date).toUTCString() + ' uncaughtException:', err.message);
    log.error(err.stack);
    process.exit(1);
});






