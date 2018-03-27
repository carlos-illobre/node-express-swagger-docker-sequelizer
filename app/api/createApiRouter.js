const glob = require('glob');
const express = require('express');

module.exports = () => glob.sync('**/*.js', { cwd: `${__dirname}/` })
.filter(filename => !filename.endsWith('.test.js'))
.reduce((prev, filename) => [...prev, require(`./${filename}`)], [])
.filter(router => Object.getPrototypeOf(router) == express.Router)
.reduce(
    (rootRouter, router) => rootRouter.use(router),
    express.Router({ mergeParams: true })
);
