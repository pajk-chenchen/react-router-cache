import { jsx } from 'react/jsx-runtime';
import React, { useRef, useState, useEffect } from 'react';
import { pathToRegexp } from 'path-to-regexp';
import { createHashHistory } from 'history';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var __assign = function () {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var initialContext = {};
var HistoryContext = React.createContext(initialContext);

var initialContext$1 = {};
var RouterContext = React.createContext(initialContext$1);

var cache = {};
var cacheLimit = 10000;
var cacheCount = 0;
function compilePath(path, options) {
    var cacheKey = "" + options.end + options.strict + options.sensitive;
    var pathCache = cache[cacheKey] || (cache[cacheKey] = {});
    if (pathCache[path])
        return pathCache[path];
    var keys = [];
    var regexp = pathToRegexp(path, keys, options);
    var result = { regexp: regexp, keys: keys };
    if (cacheCount < cacheLimit) {
        pathCache[path] = result;
        cacheCount++;
    }
    return result;
}
/**
 * Public API for matching a URL pathname to a path.
 */
function matchPath(pathname, options) {
    var cpOptions = options;
    if (typeof options === "string" || Array.isArray(options)) {
        cpOptions = { path: options, exact: false, strict: false, sensitive: false };
    }
    var path = cpOptions.path, _a = cpOptions.exact, exact = _a === void 0 ? false : _a, _b = cpOptions.strict, strict = _b === void 0 ? false : _b, _c = cpOptions.sensitive, sensitive = _c === void 0 ? false : _c;
    var paths = [].concat(path || []);
    return paths.reduce(function (matched, path) {
        if (!path && path !== "")
            return null;
        if (matched)
            return matched;
        var _a = compilePath(path, {
            end: exact,
            strict: strict,
            sensitive: sensitive
        }), regexp = _a.regexp, keys = _a.keys;
        var match = regexp.exec(pathname);
        if (!match)
            return null;
        var url = match[0], values = match.slice(1);
        var isExact = pathname === url;
        if (exact && !isExact)
            return null;
        return {
            path: path,
            url: path === "/" && url === "" ? "/" : url,
            isExact: isExact,
            params: keys.reduce(function (memo, key, index) {
                memo[key.name] = values[index];
                return memo;
            }, {})
        };
    }, null);
}

var cachelist = [];
var Cache = {
    floor: 0,
    add: function (cache) {
        cachelist.push({
            cache: cache,
            floor: this.floor
        });
    },
    reduce: function (cache) {
        for (var i = cachelist.length - 1; i >= 0; i++) {
            var cur = cachelist[i];
            if (cur.cache.key === cache.key) {
                cachelist.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    getCache: function () {
        return cachelist;
    },
    getCurrentCache: function () {
        return cachelist[cachelist.length - 1];
    }
};

var MAX_SCROLL = 20;
function CacheComponent(props) {
    var cacheCmp = useRef(null);
    var start = useRef({ x: 0, y: 0 });
    var _a = useState({}), style = _a[0], setStyle = _a[1];
    useEffect(function () {
        if (!props.show) {
            return removeListener;
        }
        var element = cacheCmp.current;
        console.log(queryCssInStyleLabel('.cache'));
        if (!queryCssInStyleLabel('.cache')) {
            createStyle("\n        .cache {\n          width: 100%;\n          height: 100%;\n          position: absolute;\n          left: 0;\n          top: 0;\n          background-color: #FFFFFF;\n        }\n        .show {\n          transform: translate(100%, 0);\n          -webkit-transform: translate(100%, 0);\n          transition: transform .5s ease-in-out;\n          -webkit-transition: transform .5s ease-in-out;\n        }\n      ");
        }
        if (element) {
            element.addEventListener('touchstart', touchstart);
            element.addEventListener('touchmove', touchmove);
            element.addEventListener('touchend', touchend);
            element.addEventListener('touchcancel', touchend);
        }
        return removeListener;
    }, [props.show]);
    function removeListener() {
        var element = cacheCmp.current;
        if (element) {
            element.removeEventListener('touchstart', touchstart);
            element.removeEventListener('touchmove', touchmove);
            element.removeEventListener('touchend', touchend);
            element.removeEventListener('touchcancel', touchend);
        }
    }
    useEffect(function () {
        if (props.show) {
            setTimeout(function () {
                setStyle({
                    transform: "translate(0, 0)"
                });
            }, 20);
        }
    }, [props.show]);
    function queryCssInStyleLabel(classname) {
        var styles = Array.from(document.styleSheets);
        return Boolean(styles.filter(function (item) {
            var cssRules = Array.from(item.cssRules);
            return Boolean(cssRules.filter(function (itm) {
                if (itm instanceof CSSStyleRule) {
                    return itm.selectorText.indexOf(classname) !== -1;
                }
                return false;
            }).length);
        }).length);
    }
    function createStyle(css) {
        var style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);
    }
    function touchstart(e) {
        var _a = e.touches[0], pageX = _a.pageX, pageY = _a.pageY;
        start.current = { x: pageX, y: pageY };
    }
    function touchmove(e) {
        var _a = e.touches[0], pageX = _a.pageX, pageY = _a.pageY;
        var _b = start.current, x = _b.x, y = _b.y;
        if (Math.abs(pageX - x) > Math.abs(pageY - y)) {
            if (pageX - x > 0) {
                setStyle({
                    transform: "translate(" + (pageX - x) + "px, 0)",
                    transition: 'none'
                });
            }
        }
    }
    function touchend(e) {
        var pageX = e.changedTouches[0].pageX;
        var x = start.current.x;
        var element = cacheCmp.current;
        var width = (element === null || element === void 0 ? void 0 : element.offsetWidth) || 0;
        if (pageX - x > MAX_SCROLL * width / 100) {
            // 关闭当前页面
            if (deleteCacheWhenBack()) {
                setStyle({
                    transform: "translate(100%, 0)",
                    transition: 'transform .5s ease-in-out'
                });
            }
            else {
                setStyle({
                    transform: "translate(0, 0)",
                    transition: 'transform .5s ease-in-out'
                });
            }
        }
        else {
            setStyle({
                transform: "translate(0, 0)",
                transition: 'transform .5s ease-in-out'
            });
        }
    }
    function deleteCacheWhenBack() {
        var options = props.options;
        var history = options.history, location = options.location;
        var caches = Cache.getCache();
        if (caches.length <= 1)
            return false;
        Cache.reduce(location);
        setTimeout(function () {
            history.back();
        }, 500);
        return true;
    }
    return jsx("div", __assign({ className: "cache " + (props.show ? 'show' : 'hide'), ref: cacheCmp, style: props.show ? style : {} }, { children: React.createElement(props.component, props.options) }), void 0);
}

var Route = function (props) { return jsx(RouterContext.Consumer, { children: function (context) {
        var location = context.location || {};
        var match = matchPath(location.pathname, props);
        var that = __assign(__assign({}, context), { location: location, match: match });
        var component = props.component;
        return jsx(RouterContext.Provider, __assign({ value: that }, { children: jsx(CacheComponent, { component: component, options: that, show: that.match }, void 0) }), void 0);
    } }, void 0); };

var Router = function (props) {
    var _isMounted = useRef(false);
    var _pendingLocation = useRef(null);
    var unliten = useRef(null);
    var _a = useState({}), location = _a[0], setLocation = _a[1];
    var _b = useState(null), routes = _b[0], setRoutes = _b[1];
    useEffect(function () {
        setLocation(props.history.location);
        unliten.current = props.history.listen(function (res) {
            if (_isMounted.current) {
                setLocation(res.location);
                checkLastPath(res.location);
                checkPathInChildren();
            }
            else {
                _pendingLocation.current = location;
            }
        });
        _isMounted.current = true;
        var caches = Cache.getCache();
        if (caches.length < 1) {
            Cache.add(props.history.location);
            checkPathInChildren();
        }
        return function () {
            if (unliten.current) {
                unliten.current();
                _isMounted.current = false;
                _pendingLocation.current = null;
            }
        };
    }, []);
    function checkPathInChildren() {
        var children = props.children;
        var caches = Cache.getCache();
        var cloneRoutes = caches.map(function (item, index) {
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (matchPath(item.cache.pathname || '', child.props.path)) {
                    return React.cloneElement(child, { key: child.props.path + "_" + index });
                }
            }
        }).filter(function (item) { return item; });
        setRoutes(cloneRoutes);
    }
    function checkLastPath(location) {
        var caches = Cache.getCache();
        if (caches.length < 1)
            return;
        var lastCache = caches[caches.length - 1] || {};
        var _a = lastCache.cache, cache = _a === void 0 ? {} : _a;
        if (location.key !== cache.key) {
            Cache.add(location);
        }
    }
    useEffect(function () {
        if (_pendingLocation.current) {
            setLocation(__assign({}, _pendingLocation.current));
        }
    }, [_pendingLocation.current]);
    return jsx(RouterContext.Provider, __assign({ value: {
            history: props.history,
            location: location,
            match: computeRootMatch(location.pathname)
        } }, { children: jsx(HistoryContext.Provider, { children: routes, value: props.history }, void 0) }), void 0);
};
function computeRootMatch(pathname) {
    return {
        path: '/',
        url: '/',
        params: {},
        isExact: pathname === '/'
    };
}

var BrowserRouter = function (props) {
    var history = createHashHistory();
    return jsx(Router, { history: history, children: props.children }, void 0);
};

export { BrowserRouter, Route };
//# sourceMappingURL=index.js.map
