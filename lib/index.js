"use strict";

const noop = require("noop6")
    , pug = require("pug")

/*!
 * init
 *
 * @name init
 * @function
 * @param {Object} config The configuration object:
 *
 *  - `disableCache` (Boolean): If `true`, the cache will be disabled.
 */
exports.init = function (config) {
    Bloggify.renderer.registerRenderer("pug", exports.render);
};

/*!
 * factory
 * Returns a HTTP request handler.
 *
 * @name factory
 * @function
 * @param {Function} cb The callback function.
 * @returns {Function} The request handler.
 */
exports.factory = function (cb) {
    return function (ctx) {
        return cb(function (path, data, cb) {
            return exports.render(ctx, path, data, cb);
        }, ctx);
    };
};

/*!
 * render
 * Renders the file.
 *
 * @name render
 * @function
 * @param {ctx} ctx The context.
 * @param {String} path The file path.
 * @param {Object} data The template data.
 * @param {Function} cb The callback function.
 */
exports.render = function (ctx, data, tmpl, cb) {
    cb = cb || noop;
    let html = null;
    try {
        html = pug.renderFile(tmpl.path, data);
    } catch (err) {
        return cb(err);
    }
    data.statusCode = data.statusCode || data.error && data.error.statusCode || 200;
    ctx.end(html, data.statusCode);

    cb(null, html);
};
