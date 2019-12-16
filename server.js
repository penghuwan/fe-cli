
const Koa = require('koa');
const fs = require('fs');
const parse = require('co-body');
const devConfig = require('./webpack.config.js');
const webpackMiddleware = require("koa-webpack-dev-middleware");
const webpack = require('webpack');

const app = new Koa();

async function loadStatic(ctx, next) {
    let pathname = ctx.path;
    let data = null;
    let targetPath = null;
    if (pathname === '/') {
        pathname = '/main.html'
    }

    // if (pathname = '/ajax') {
    //     const req = ctx.req;
    //     const body = await parse(req);
    //     console.log(body);
    // }
    targetPath = `./${pathname}`;
    if (fs.existsSync(targetPath)) {
        data = fs.readFileSync(targetPath);
        ctx.body = data.toString();
        ctx.status = 200;
    } else {
        await next();
    }
}

app.use(webpackMiddleware(webpack(devConfig)));
app.use(loadStatic);
app.listen(3000);