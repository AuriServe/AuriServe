/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../node_modules/preact/compat/dist/compat.module.js":
/*!***********************************************************!*\
  !*** ../node_modules/preact/compat/dist/compat.module.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports startTransition, useDeferredValue, useTransition, useInsertionEffect, useSyncExternalStore, version, Children, render, hydrate, unmountComponentAtNode, createPortal, createFactory, cloneElement, isValidElement, findDOMNode, PureComponent, memo, forwardRef, flushSync, unstable_batchedUpdates, StrictMode, Suspense, SuspenseList, lazy, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED */
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact/hooks */ "../node_modules/preact/hooks/dist/hooks.module.js");
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact */ "../node_modules/preact/dist/preact.module.js");





function S(n, t) {
  for (var e in t) n[e] = t[e];

  return n;
}

function g(n, t) {
  for (var e in n) if ("__source" !== e && !(e in t)) return !0;

  for (var r in t) if ("__source" !== r && n[r] !== t[r]) return !0;

  return !1;
}

function C(n) {
  this.props = n;
}

function E(n, t) {
  function e(n) {
    var e = this.props.ref,
        r = e == n.ref;
    return !r && e && (e.call ? e(null) : e.current = null), t ? !t(this.props, n) || !r : g(this.props, n);
  }

  function r(t) {
    return this.shouldComponentUpdate = e, (0,preact__WEBPACK_IMPORTED_MODULE_1__.createElement)(n, t);
  }

  return r.displayName = "Memo(" + (n.displayName || n.name) + ")", r.prototype.isReactComponent = !0, r.__f = !0, r;
}

(C.prototype = new preact__WEBPACK_IMPORTED_MODULE_1__.Component()).isPureReactComponent = !0, C.prototype.shouldComponentUpdate = function (n, t) {
  return g(this.props, n) || g(this.state, t);
};
var w = preact__WEBPACK_IMPORTED_MODULE_1__.options.__b;

preact__WEBPACK_IMPORTED_MODULE_1__.options.__b = function (n) {
  n.type && n.type.__f && n.ref && (n.props.ref = n.ref, n.ref = null), w && w(n);
};

var x = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;

function R(n) {
  function t(t) {
    var e = S({}, t);
    return delete e.ref, n(e, t.ref || null);
  }

  return t.$$typeof = x, t.render = t, t.prototype.isReactComponent = t.__f = !0, t.displayName = "ForwardRef(" + (n.displayName || n.name) + ")", t;
}

var N = function (n, t) {
  return null == n ? null : (0,preact__WEBPACK_IMPORTED_MODULE_1__.toChildArray)((0,preact__WEBPACK_IMPORTED_MODULE_1__.toChildArray)(n).map(t));
},
    k = {
  map: N,
  forEach: N,
  count: function (n) {
    return n ? (0,preact__WEBPACK_IMPORTED_MODULE_1__.toChildArray)(n).length : 0;
  },
  only: function (n) {
    var t = (0,preact__WEBPACK_IMPORTED_MODULE_1__.toChildArray)(n);
    if (1 !== t.length) throw "Children.only";
    return t[0];
  },
  toArray: preact__WEBPACK_IMPORTED_MODULE_1__.toChildArray
},
    A = preact__WEBPACK_IMPORTED_MODULE_1__.options.__e;

preact__WEBPACK_IMPORTED_MODULE_1__.options.__e = function (n, t, e, r) {
  if (n.then) for (var u, o = t; o = o.__;) if ((u = o.__c) && u.__c) return null == t.__e && (t.__e = e.__e, t.__k = e.__k), u.__c(n, t);
  A(n, t, e, r);
};

var O = preact__WEBPACK_IMPORTED_MODULE_1__.options.unmount;

function T() {
  this.__u = 0, this.t = null, this.__b = null;
}

function L(n) {
  var t = n.__.__c;
  return t && t.__a && t.__a(n);
}

function U(n) {
  var t, e, r;

  function u(u) {
    if (t || (t = n()).then(function (n) {
      e = n.default || n;
    }, function (n) {
      r = n;
    }), r) throw r;
    if (!e) throw t;
    return (0,preact__WEBPACK_IMPORTED_MODULE_1__.createElement)(e, u);
  }

  return u.displayName = "Lazy", u.__f = !0, u;
}

function D() {
  this.u = null, this.o = null;
}

preact__WEBPACK_IMPORTED_MODULE_1__.options.unmount = function (n) {
  var t = n.__c;
  t && t.__R && t.__R(), t && !0 === n.__h && (n.type = null), O && O(n);
}, (T.prototype = new preact__WEBPACK_IMPORTED_MODULE_1__.Component()).__c = function (n, t) {
  var e = t.__c,
      r = this;
  null == r.t && (r.t = []), r.t.push(e);

  var u = L(r.__v),
      o = !1,
      i = function () {
    o || (o = !0, e.__R = null, u ? u(l) : l());
  };

  e.__R = i;

  var l = function () {
    if (! --r.__u) {
      if (r.state.__a) {
        var n = r.state.__a;

        r.__v.__k[0] = function n(t, e, r) {
          return t && (t.__v = null, t.__k = t.__k && t.__k.map(function (t) {
            return n(t, e, r);
          }), t.__c && t.__c.__P === e && (t.__e && r.insertBefore(t.__e, t.__d), t.__c.__e = !0, t.__c.__P = r)), t;
        }(n, n.__c.__P, n.__c.__O);
      }

      var t;

      for (r.setState({
        __a: r.__b = null
      }); t = r.t.pop();) t.forceUpdate();
    }
  },
      f = !0 === t.__h;

  r.__u++ || f || r.setState({
    __a: r.__b = r.__v.__k[0]
  }), n.then(i, i);
}, T.prototype.componentWillUnmount = function () {
  this.t = [];
}, T.prototype.render = function (n, t) {
  if (this.__b) {
    if (this.__v.__k) {
      var e = document.createElement("div"),
          r = this.__v.__k[0].__c;

      this.__v.__k[0] = function n(t, e, r) {
        return t && (t.__c && t.__c.__H && (t.__c.__H.__.forEach(function (n) {
          "function" == typeof n.__c && n.__c();
        }), t.__c.__H = null), null != (t = S({}, t)).__c && (t.__c.__P === r && (t.__c.__P = e), t.__c = null), t.__k = t.__k && t.__k.map(function (t) {
          return n(t, e, r);
        })), t;
      }(this.__b, e, r.__O = r.__P);
    }

    this.__b = null;
  }

  var u = t.__a && (0,preact__WEBPACK_IMPORTED_MODULE_1__.createElement)(preact__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, n.fallback);
  return u && (u.__h = null), [(0,preact__WEBPACK_IMPORTED_MODULE_1__.createElement)(preact__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, t.__a ? null : n.children), u];
};

var F = function (n, t, e) {
  if (++e[1] === e[0] && n.o.delete(t), n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.o.size)) for (e = n.u; e;) {
    for (; e.length > 3;) e.pop()();

    if (e[1] < e[0]) break;
    n.u = e = e[2];
  }
};

function I(n) {
  return this.getChildContext = function () {
    return n.context;
  }, n.children;
}

function M(n) {
  var t = this,
      e = n.i;
  t.componentWillUnmount = function () {
    (0,preact__WEBPACK_IMPORTED_MODULE_1__.render)(null, t.l), t.l = null, t.i = null;
  }, t.i && t.i !== e && t.componentWillUnmount(), n.__v ? (t.l || (t.i = e, t.l = {
    nodeType: 1,
    parentNode: e,
    childNodes: [],
    appendChild: function (n) {
      this.childNodes.push(n), t.i.appendChild(n);
    },
    insertBefore: function (n, e) {
      this.childNodes.push(n), t.i.appendChild(n);
    },
    removeChild: function (n) {
      this.childNodes.splice(this.childNodes.indexOf(n) >>> 1, 1), t.i.removeChild(n);
    }
  }), (0,preact__WEBPACK_IMPORTED_MODULE_1__.render)((0,preact__WEBPACK_IMPORTED_MODULE_1__.createElement)(I, {
    context: t.context
  }, n.__v), t.l)) : t.l && t.componentWillUnmount();
}

function V(n, t) {
  var e = (0,preact__WEBPACK_IMPORTED_MODULE_1__.createElement)(M, {
    __v: n,
    i: t
  });
  return e.containerInfo = t, e;
}

(D.prototype = new preact__WEBPACK_IMPORTED_MODULE_1__.Component()).__a = function (n) {
  var t = this,
      e = L(t.__v),
      r = t.o.get(n);
  return r[0]++, function (u) {
    var o = function () {
      t.props.revealOrder ? (r.push(u), F(t, n, r)) : u();
    };

    e ? e(o) : o();
  };
}, D.prototype.render = function (n) {
  this.u = null, this.o = new Map();
  var t = (0,preact__WEBPACK_IMPORTED_MODULE_1__.toChildArray)(n.children);
  n.revealOrder && "b" === n.revealOrder[0] && t.reverse();

  for (var e = t.length; e--;) this.o.set(t[e], this.u = [1, 0, this.u]);

  return n.children;
}, D.prototype.componentDidUpdate = D.prototype.componentDidMount = function () {
  var n = this;
  this.o.forEach(function (t, e) {
    F(n, e, t);
  });
};

var W = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103,
    P = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,
    $ = "undefined" != typeof document,
    j = function (n) {
  return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/i : /fil|che|ra/i).test(n);
};

function z(n, t, e) {
  return null == t.__k && (t.textContent = ""), (0,preact__WEBPACK_IMPORTED_MODULE_1__.render)(n, t), "function" == typeof e && e(), n ? n.__c : null;
}

function B(n, t, e) {
  return (0,preact__WEBPACK_IMPORTED_MODULE_1__.hydrate)(n, t), "function" == typeof e && e(), n ? n.__c : null;
}

preact__WEBPACK_IMPORTED_MODULE_1__.Component.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function (n) {
  Object.defineProperty(preact__WEBPACK_IMPORTED_MODULE_1__.Component.prototype, n, {
    configurable: !0,
    get: function () {
      return this["UNSAFE_" + n];
    },
    set: function (t) {
      Object.defineProperty(this, n, {
        configurable: !0,
        writable: !0,
        value: t
      });
    }
  });
});
var H = preact__WEBPACK_IMPORTED_MODULE_1__.options.event;

function Z() {}

function Y() {
  return this.cancelBubble;
}

function q() {
  return this.defaultPrevented;
}

preact__WEBPACK_IMPORTED_MODULE_1__.options.event = function (n) {
  return H && (n = H(n)), n.persist = Z, n.isPropagationStopped = Y, n.isDefaultPrevented = q, n.nativeEvent = n;
};

var G,
    J = {
  configurable: !0,
  get: function () {
    return this.class;
  }
},
    K = preact__WEBPACK_IMPORTED_MODULE_1__.options.vnode;

preact__WEBPACK_IMPORTED_MODULE_1__.options.vnode = function (n) {
  var t = n.type,
      e = n.props,
      r = e;

  if ("string" == typeof t) {
    var u = -1 === t.indexOf("-");

    for (var o in r = {}, e) {
      var i = e[o];
      $ && "children" === o && "noscript" === t || "value" === o && "defaultValue" in e && null == i || ("defaultValue" === o && "value" in e && null == e.value ? o = "value" : "download" === o && !0 === i ? i = "" : /ondoubleclick/i.test(o) ? o = "ondblclick" : /^onchange(textarea|input)/i.test(o + t) && !j(e.type) ? o = "oninput" : /^onfocus$/i.test(o) ? o = "onfocusin" : /^onblur$/i.test(o) ? o = "onfocusout" : /^on(Ani|Tra|Tou|BeforeInp|Compo)/.test(o) ? o = o.toLowerCase() : u && P.test(o) ? o = o.replace(/[A-Z0-9]/g, "-$&").toLowerCase() : null === i && (i = void 0), /^oninput$/i.test(o) && (o = o.toLowerCase(), r[o] && (o = "oninputCapture")), r[o] = i);
    }

    "select" == t && r.multiple && Array.isArray(r.value) && (r.value = (0,preact__WEBPACK_IMPORTED_MODULE_1__.toChildArray)(e.children).forEach(function (n) {
      n.props.selected = -1 != r.value.indexOf(n.props.value);
    })), "select" == t && null != r.defaultValue && (r.value = (0,preact__WEBPACK_IMPORTED_MODULE_1__.toChildArray)(e.children).forEach(function (n) {
      n.props.selected = r.multiple ? -1 != r.defaultValue.indexOf(n.props.value) : r.defaultValue == n.props.value;
    })), n.props = r, e.class != e.className && (J.enumerable = "className" in e, null != e.className && (r.class = e.className), Object.defineProperty(r, "className", J));
  }

  n.$$typeof = W, K && K(n);
};

var Q = preact__WEBPACK_IMPORTED_MODULE_1__.options.__r;

preact__WEBPACK_IMPORTED_MODULE_1__.options.__r = function (n) {
  Q && Q(n), G = n.__c;
};

var X = {
  ReactCurrentDispatcher: {
    current: {
      readContext: function (n) {
        return G.__n[n.__c].props.value;
      }
    }
  }
},
    nn = "17.0.2";

function tn(n) {
  return preact__WEBPACK_IMPORTED_MODULE_1__.createElement.bind(null, n);
}

function en(n) {
  return !!n && n.$$typeof === W;
}

function rn(n) {
  return en(n) ? preact__WEBPACK_IMPORTED_MODULE_1__.cloneElement.apply(null, arguments) : n;
}

function un(n) {
  return !!n.__k && ((0,preact__WEBPACK_IMPORTED_MODULE_1__.render)(null, n), !0);
}

function on(n) {
  return n && (n.base || 1 === n.nodeType && n) || null;
}

var ln = function (n, t) {
  return n(t);
},
    fn = function (n, t) {
  return n(t);
},
    cn = preact__WEBPACK_IMPORTED_MODULE_1__.Fragment;

function an(n) {
  n();
}

function sn(n) {
  return n;
}

function hn() {
  return [!1, an];
}

var vn = preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect;

function dn(t, u) {
  var o = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useState)(u),
      i = o[0],
      l = o[1],
      f = u();
  return (0,preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(function () {
    f !== i && l(function () {
      return f;
    });
  }, [t, f, u]), (0,preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    return t(function () {
      l(function () {
        return u();
      });
    });
  }, [t, u]), i;
}

/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
  useState: preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useState,
  useReducer: preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useReducer,
  useEffect: preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useEffect,
  useLayoutEffect: preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect,
  useInsertionEffect: preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect,
  useTransition: hn,
  useDeferredValue: sn,
  useSyncExternalStore: dn,
  startTransition: an,
  useRef: preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useRef,
  useImperativeHandle: preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useImperativeHandle,
  useMemo: preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useMemo,
  useCallback: preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useCallback,
  useContext: preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useContext,
  useDebugValue: preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useDebugValue,
  version: "17.0.2",
  Children: k,
  render: z,
  hydrate: B,
  unmountComponentAtNode: un,
  createPortal: V,
  createElement: preact__WEBPACK_IMPORTED_MODULE_1__.createElement,
  createContext: preact__WEBPACK_IMPORTED_MODULE_1__.createContext,
  createFactory: tn,
  cloneElement: rn,
  createRef: preact__WEBPACK_IMPORTED_MODULE_1__.createRef,
  Fragment: preact__WEBPACK_IMPORTED_MODULE_1__.Fragment,
  isValidElement: en,
  findDOMNode: on,
  Component: preact__WEBPACK_IMPORTED_MODULE_1__.Component,
  PureComponent: C,
  memo: E,
  forwardRef: R,
  flushSync: fn,
  unstable_batchedUpdates: ln,
  StrictMode: preact__WEBPACK_IMPORTED_MODULE_1__.Fragment,
  Suspense: T,
  SuspenseList: D,
  lazy: U,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: X
});


/***/ }),

/***/ "../node_modules/preact/dist/preact.module.js":
/*!****************************************************!*\
  !*** ../node_modules/preact/dist/preact.module.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ P),
/* harmony export */   "hydrate": () => (/* binding */ S),
/* harmony export */   "createElement": () => (/* binding */ h),
/* harmony export */   "h": () => (/* binding */ h),
/* harmony export */   "Fragment": () => (/* binding */ p),
/* harmony export */   "createRef": () => (/* binding */ y),
/* harmony export */   "isValidElement": () => (/* binding */ i),
/* harmony export */   "Component": () => (/* binding */ d),
/* harmony export */   "cloneElement": () => (/* binding */ q),
/* harmony export */   "createContext": () => (/* binding */ B),
/* harmony export */   "toChildArray": () => (/* binding */ x),
/* harmony export */   "options": () => (/* binding */ l)
/* harmony export */ });
var n,
    l,
    u,
    i,
    t,
    o,
    r,
    f = {},
    e = [],
    c = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

function s(n, l) {
  for (var u in l) n[u] = l[u];

  return n;
}

function a(n) {
  var l = n.parentNode;
  l && l.removeChild(n);
}

function h(l, u, i) {
  var t,
      o,
      r,
      f = {};

  for (r in u) "key" == r ? t = u[r] : "ref" == r ? o = u[r] : f[r] = u[r];

  if (arguments.length > 2 && (f.children = arguments.length > 3 ? n.call(arguments, 2) : i), "function" == typeof l && null != l.defaultProps) for (r in l.defaultProps) void 0 === f[r] && (f[r] = l.defaultProps[r]);
  return v(l, f, t, o, null);
}

function v(n, i, t, o, r) {
  var f = {
    type: n,
    props: i,
    key: t,
    ref: o,
    __k: null,
    __: null,
    __b: 0,
    __e: null,
    __d: void 0,
    __c: null,
    __h: null,
    constructor: void 0,
    __v: null == r ? ++u : r
  };
  return null == r && null != l.vnode && l.vnode(f), f;
}

function y() {
  return {
    current: null
  };
}

function p(n) {
  return n.children;
}

function d(n, l) {
  this.props = n, this.context = l;
}

function _(n, l) {
  if (null == l) return n.__ ? _(n.__, n.__.__k.indexOf(n) + 1) : null;

  for (var u; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) return u.__e;

  return "function" == typeof n.type ? _(n) : null;
}

function k(n) {
  var l, u;

  if (null != (n = n.__) && null != n.__c) {
    for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) {
      n.__e = n.__c.base = u.__e;
      break;
    }

    return k(n);
  }
}

function b(n) {
  (!n.__d && (n.__d = !0) && t.push(n) && !g.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || setTimeout)(g);
}

function g() {
  for (var n; g.__r = t.length;) n = t.sort(function (n, l) {
    return n.__v.__b - l.__v.__b;
  }), t = [], n.some(function (n) {
    var l, u, i, t, o, r;
    n.__d && (o = (t = (l = n).__v).__e, (r = l.__P) && (u = [], (i = s({}, t)).__v = t.__v + 1, j(r, t, i, l.__n, void 0 !== r.ownerSVGElement, null != t.__h ? [o] : null, u, null == o ? _(t) : o, t.__h), z(u, t), t.__e != o && k(t)));
  });
}

function w(n, l, u, i, t, o, r, c, s, a) {
  var h,
      y,
      d,
      k,
      b,
      g,
      w,
      x = i && i.__k || e,
      C = x.length;

  for (u.__k = [], h = 0; h < l.length; h++) if (null != (k = u.__k[h] = null == (k = l[h]) || "boolean" == typeof k ? null : "string" == typeof k || "number" == typeof k || "bigint" == typeof k ? v(null, k, null, null, k) : Array.isArray(k) ? v(p, {
    children: k
  }, null, null, null) : k.__b > 0 ? v(k.type, k.props, k.key, null, k.__v) : k)) {
    if (k.__ = u, k.__b = u.__b + 1, null === (d = x[h]) || d && k.key == d.key && k.type === d.type) x[h] = void 0;else for (y = 0; y < C; y++) {
      if ((d = x[y]) && k.key == d.key && k.type === d.type) {
        x[y] = void 0;
        break;
      }

      d = null;
    }
    j(n, k, d = d || f, t, o, r, c, s, a), b = k.__e, (y = k.ref) && d.ref != y && (w || (w = []), d.ref && w.push(d.ref, null, k), w.push(y, k.__c || b, k)), null != b ? (null == g && (g = b), "function" == typeof k.type && k.__k === d.__k ? k.__d = s = m(k, s, n) : s = A(n, k, d, x, b, s), "function" == typeof u.type && (u.__d = s)) : s && d.__e == s && s.parentNode != n && (s = _(d));
  }

  for (u.__e = g, h = C; h--;) null != x[h] && ("function" == typeof u.type && null != x[h].__e && x[h].__e == u.__d && (u.__d = _(i, h + 1)), N(x[h], x[h]));

  if (w) for (h = 0; h < w.length; h++) M(w[h], w[++h], w[++h]);
}

function m(n, l, u) {
  for (var i, t = n.__k, o = 0; t && o < t.length; o++) (i = t[o]) && (i.__ = n, l = "function" == typeof i.type ? m(i, l, u) : A(u, i, i, t, i.__e, l));

  return l;
}

function x(n, l) {
  return l = l || [], null == n || "boolean" == typeof n || (Array.isArray(n) ? n.some(function (n) {
    x(n, l);
  }) : l.push(n)), l;
}

function A(n, l, u, i, t, o) {
  var r, f, e;
  if (void 0 !== l.__d) r = l.__d, l.__d = void 0;else if (null == u || t != o || null == t.parentNode) n: if (null == o || o.parentNode !== n) n.appendChild(t), r = null;else {
    for (f = o, e = 0; (f = f.nextSibling) && e < i.length; e += 2) if (f == t) break n;

    n.insertBefore(t, o), r = o;
  }
  return void 0 !== r ? r : t.nextSibling;
}

function C(n, l, u, i, t) {
  var o;

  for (o in u) "children" === o || "key" === o || o in l || H(n, o, null, u[o], i);

  for (o in l) t && "function" != typeof l[o] || "children" === o || "key" === o || "value" === o || "checked" === o || u[o] === l[o] || H(n, o, l[o], u[o], i);
}

function $(n, l, u) {
  "-" === l[0] ? n.setProperty(l, u) : n[l] = null == u ? "" : "number" != typeof u || c.test(l) ? u : u + "px";
}

function H(n, l, u, i, t) {
  var o;

  n: if ("style" === l) {
    if ("string" == typeof u) n.style.cssText = u;else {
      if ("string" == typeof i && (n.style.cssText = i = ""), i) for (l in i) u && l in u || $(n.style, l, "");
      if (u) for (l in u) i && u[l] === i[l] || $(n.style, l, u[l]);
    }
  } else if ("o" === l[0] && "n" === l[1]) o = l !== (l = l.replace(/Capture$/, "")), l = l.toLowerCase() in n ? l.toLowerCase().slice(2) : l.slice(2), n.l || (n.l = {}), n.l[l + o] = u, u ? i || n.addEventListener(l, o ? T : I, o) : n.removeEventListener(l, o ? T : I, o);else if ("dangerouslySetInnerHTML" !== l) {
    if (t) l = l.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");else if ("href" !== l && "list" !== l && "form" !== l && "tabIndex" !== l && "download" !== l && l in n) try {
      n[l] = null == u ? "" : u;
      break n;
    } catch (n) {}
    "function" == typeof u || (null != u && (!1 !== u || "a" === l[0] && "r" === l[1]) ? n.setAttribute(l, u) : n.removeAttribute(l));
  }
}

function I(n) {
  this.l[n.type + !1](l.event ? l.event(n) : n);
}

function T(n) {
  this.l[n.type + !0](l.event ? l.event(n) : n);
}

function j(n, u, i, t, o, r, f, e, c) {
  var a,
      h,
      v,
      y,
      _,
      k,
      b,
      g,
      m,
      x,
      A,
      C,
      $,
      H = u.type;

  if (void 0 !== u.constructor) return null;
  null != i.__h && (c = i.__h, e = u.__e = i.__e, u.__h = null, r = [e]), (a = l.__b) && a(u);

  try {
    n: if ("function" == typeof H) {
      if (g = u.props, m = (a = H.contextType) && t[a.__c], x = a ? m ? m.props.value : a.__ : t, i.__c ? b = (h = u.__c = i.__c).__ = h.__E : ("prototype" in H && H.prototype.render ? u.__c = h = new H(g, x) : (u.__c = h = new d(g, x), h.constructor = H, h.render = O), m && m.sub(h), h.props = g, h.state || (h.state = {}), h.context = x, h.__n = t, v = h.__d = !0, h.__h = []), null == h.__s && (h.__s = h.state), null != H.getDerivedStateFromProps && (h.__s == h.state && (h.__s = s({}, h.__s)), s(h.__s, H.getDerivedStateFromProps(g, h.__s))), y = h.props, _ = h.state, v) null == H.getDerivedStateFromProps && null != h.componentWillMount && h.componentWillMount(), null != h.componentDidMount && h.__h.push(h.componentDidMount);else {
        if (null == H.getDerivedStateFromProps && g !== y && null != h.componentWillReceiveProps && h.componentWillReceiveProps(g, x), !h.__e && null != h.shouldComponentUpdate && !1 === h.shouldComponentUpdate(g, h.__s, x) || u.__v === i.__v) {
          h.props = g, h.state = h.__s, u.__v !== i.__v && (h.__d = !1), h.__v = u, u.__e = i.__e, u.__k = i.__k, u.__k.forEach(function (n) {
            n && (n.__ = u);
          }), h.__h.length && f.push(h);
          break n;
        }

        null != h.componentWillUpdate && h.componentWillUpdate(g, h.__s, x), null != h.componentDidUpdate && h.__h.push(function () {
          h.componentDidUpdate(y, _, k);
        });
      }
      if (h.context = x, h.props = g, h.__v = u, h.__P = n, A = l.__r, C = 0, "prototype" in H && H.prototype.render) h.state = h.__s, h.__d = !1, A && A(u), a = h.render(h.props, h.state, h.context);else do {
        h.__d = !1, A && A(u), a = h.render(h.props, h.state, h.context), h.state = h.__s;
      } while (h.__d && ++C < 25);
      h.state = h.__s, null != h.getChildContext && (t = s(s({}, t), h.getChildContext())), v || null == h.getSnapshotBeforeUpdate || (k = h.getSnapshotBeforeUpdate(y, _)), $ = null != a && a.type === p && null == a.key ? a.props.children : a, w(n, Array.isArray($) ? $ : [$], u, i, t, o, r, f, e, c), h.base = u.__e, u.__h = null, h.__h.length && f.push(h), b && (h.__E = h.__ = null), h.__e = !1;
    } else null == r && u.__v === i.__v ? (u.__k = i.__k, u.__e = i.__e) : u.__e = L(i.__e, u, i, t, o, r, f, c);

    (a = l.diffed) && a(u);
  } catch (n) {
    u.__v = null, (c || null != r) && (u.__e = e, u.__h = !!c, r[r.indexOf(e)] = null), l.__e(n, u, i);
  }
}

function z(n, u) {
  l.__c && l.__c(u, n), n.some(function (u) {
    try {
      n = u.__h, u.__h = [], n.some(function (n) {
        n.call(u);
      });
    } catch (n) {
      l.__e(n, u.__v);
    }
  });
}

function L(l, u, i, t, o, r, e, c) {
  var s,
      h,
      v,
      y = i.props,
      p = u.props,
      d = u.type,
      k = 0;
  if ("svg" === d && (o = !0), null != r) for (; k < r.length; k++) if ((s = r[k]) && "setAttribute" in s == !!d && (d ? s.localName === d : 3 === s.nodeType)) {
    l = s, r[k] = null;
    break;
  }

  if (null == l) {
    if (null === d) return document.createTextNode(p);
    l = o ? document.createElementNS("http://www.w3.org/2000/svg", d) : document.createElement(d, p.is && p), r = null, c = !1;
  }

  if (null === d) y === p || c && l.data === p || (l.data = p);else {
    if (r = r && n.call(l.childNodes), h = (y = i.props || f).dangerouslySetInnerHTML, v = p.dangerouslySetInnerHTML, !c) {
      if (null != r) for (y = {}, k = 0; k < l.attributes.length; k++) y[l.attributes[k].name] = l.attributes[k].value;
      (v || h) && (v && (h && v.__html == h.__html || v.__html === l.innerHTML) || (l.innerHTML = v && v.__html || ""));
    }

    if (C(l, p, y, o, c), v) u.__k = [];else if (k = u.props.children, w(l, Array.isArray(k) ? k : [k], u, i, t, o && "foreignObject" !== d, r, e, r ? r[0] : i.__k && _(i, 0), c), null != r) for (k = r.length; k--;) null != r[k] && a(r[k]);
    c || ("value" in p && void 0 !== (k = p.value) && (k !== l.value || "progress" === d && !k || "option" === d && k !== y.value) && H(l, "value", k, y.value, !1), "checked" in p && void 0 !== (k = p.checked) && k !== l.checked && H(l, "checked", k, y.checked, !1));
  }
  return l;
}

function M(n, u, i) {
  try {
    "function" == typeof n ? n(u) : n.current = u;
  } catch (n) {
    l.__e(n, i);
  }
}

function N(n, u, i) {
  var t, o;

  if (l.unmount && l.unmount(n), (t = n.ref) && (t.current && t.current !== n.__e || M(t, null, u)), null != (t = n.__c)) {
    if (t.componentWillUnmount) try {
      t.componentWillUnmount();
    } catch (n) {
      l.__e(n, u);
    }
    t.base = t.__P = null;
  }

  if (t = n.__k) for (o = 0; o < t.length; o++) t[o] && N(t[o], u, "function" != typeof n.type);
  i || null == n.__e || a(n.__e), n.__e = n.__d = void 0;
}

function O(n, l, u) {
  return this.constructor(n, u);
}

function P(u, i, t) {
  var o, r, e;
  l.__ && l.__(u, i), r = (o = "function" == typeof t) ? null : t && t.__k || i.__k, e = [], j(i, u = (!o && t || i).__k = h(p, null, [u]), r || f, f, void 0 !== i.ownerSVGElement, !o && t ? [t] : r ? null : i.firstChild ? n.call(i.childNodes) : null, e, !o && t ? t : r ? r.__e : i.firstChild, o), z(e, u);
}

function S(n, l) {
  P(n, l, S);
}

function q(l, u, i) {
  var t,
      o,
      r,
      f = s({}, l.props);

  for (r in u) "key" == r ? t = u[r] : "ref" == r ? o = u[r] : f[r] = u[r];

  return arguments.length > 2 && (f.children = arguments.length > 3 ? n.call(arguments, 2) : i), v(l.type, f, t || l.key, o || l.ref, null);
}

function B(n, l) {
  var u = {
    __c: l = "__cC" + r++,
    __: n,
    Consumer: function (n, l) {
      return n.children(l);
    },
    Provider: function (n) {
      var u, i;
      return this.getChildContext || (u = [], (i = {})[l] = this, this.getChildContext = function () {
        return i;
      }, this.shouldComponentUpdate = function (n) {
        this.props.value !== n.value && u.some(b);
      }, this.sub = function (n) {
        u.push(n);
        var l = n.componentWillUnmount;

        n.componentWillUnmount = function () {
          u.splice(u.indexOf(n), 1), l && l.call(n);
        };
      }), n.children;
    }
  };
  return u.Provider.__ = u.Consumer.contextType = u;
}

n = e.slice, l = {
  __e: function (n, l, u, i) {
    for (var t, o, r; l = l.__;) if ((t = l.__c) && !t.__) try {
      if ((o = t.constructor) && null != o.getDerivedStateFromError && (t.setState(o.getDerivedStateFromError(n)), r = t.__d), null != t.componentDidCatch && (t.componentDidCatch(n, i || {}), r = t.__d), r) return t.__E = t;
    } catch (l) {
      n = l;
    }

    throw n;
  }
}, u = 0, i = function (n) {
  return null != n && void 0 === n.constructor;
}, d.prototype.setState = function (n, l) {
  var u;
  u = null != this.__s && this.__s !== this.state ? this.__s : this.__s = s({}, this.state), "function" == typeof n && (n = n(s({}, u), this.props)), n && s(u, n), null != n && this.__v && (l && this.__h.push(l), b(this));
}, d.prototype.forceUpdate = function (n) {
  this.__v && (this.__e = !0, n && this.__h.push(n), b(this));
}, d.prototype.render = p, t = [], g.__r = 0, r = 0;


/***/ }),

/***/ "../node_modules/preact/hooks/dist/hooks.module.js":
/*!*********************************************************!*\
  !*** ../node_modules/preact/hooks/dist/hooks.module.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useState": () => (/* binding */ p),
/* harmony export */   "useReducer": () => (/* binding */ y),
/* harmony export */   "useEffect": () => (/* binding */ _),
/* harmony export */   "useLayoutEffect": () => (/* binding */ h),
/* harmony export */   "useRef": () => (/* binding */ s),
/* harmony export */   "useImperativeHandle": () => (/* binding */ A),
/* harmony export */   "useMemo": () => (/* binding */ F),
/* harmony export */   "useCallback": () => (/* binding */ T),
/* harmony export */   "useContext": () => (/* binding */ q),
/* harmony export */   "useDebugValue": () => (/* binding */ x),
/* harmony export */   "useErrorBoundary": () => (/* binding */ V)
/* harmony export */ });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "../node_modules/preact/dist/preact.module.js");

var t,
    r,
    u,
    i,
    o = 0,
    c = [],
    f = [],
    e = preact__WEBPACK_IMPORTED_MODULE_0__.options.__b,
    a = preact__WEBPACK_IMPORTED_MODULE_0__.options.__r,
    v = preact__WEBPACK_IMPORTED_MODULE_0__.options.diffed,
    l = preact__WEBPACK_IMPORTED_MODULE_0__.options.__c,
    m = preact__WEBPACK_IMPORTED_MODULE_0__.options.unmount;

function d(t, u) {
  preact__WEBPACK_IMPORTED_MODULE_0__.options.__h && preact__WEBPACK_IMPORTED_MODULE_0__.options.__h(r, t, o || u), o = 0;
  var i = r.__H || (r.__H = {
    __: [],
    __h: []
  });
  return t >= i.__.length && i.__.push({
    __V: f
  }), i.__[t];
}

function p(n) {
  return o = 1, y(z, n);
}

function y(n, u, i) {
  var o = d(t++, 2);

  if (o.t = n, !o.__c && (o.__ = [i ? i(u) : z(void 0, u), function (n) {
    var t = o.__N ? o.__N[0] : o.__[0],
        r = o.t(t, n);
    t !== r && (o.__N = [r, o.__[1]], o.__c.setState({}));
  }], o.__c = r, !o.__c.u)) {
    o.__c.__H.u = !0;
    var c = o.__c.shouldComponentUpdate;

    o.__c.shouldComponentUpdate = function (n, t, r) {
      if (!o.__c.__H) return !0;

      var u = o.__c.__H.__.filter(function (n) {
        return n.__c;
      });

      return u.every(function (n) {
        return !n.__N;
      }) ? !c || c(n, t, r) : !u.every(function (n) {
        if (!n.__N) return !0;
        var t = n.__[0];
        return n.__ = n.__N, n.__N = void 0, t === n.__[0];
      }) && (!c || c(n, t, r));
    };
  }

  return o.__N || o.__;
}

function _(u, i) {
  var o = d(t++, 3);
  !preact__WEBPACK_IMPORTED_MODULE_0__.options.__s && w(o.__H, i) && (o.__ = u, o.i = i, r.__H.__h.push(o));
}

function h(u, i) {
  var o = d(t++, 4);
  !preact__WEBPACK_IMPORTED_MODULE_0__.options.__s && w(o.__H, i) && (o.__ = u, o.i = i, r.__h.push(o));
}

function s(n) {
  return o = 5, F(function () {
    return {
      current: n
    };
  }, []);
}

function A(n, t, r) {
  o = 6, h(function () {
    return "function" == typeof n ? (n(t()), function () {
      return n(null);
    }) : n ? (n.current = t(), function () {
      return n.current = null;
    }) : void 0;
  }, null == r ? r : r.concat(n));
}

function F(n, r) {
  var u = d(t++, 7);
  return w(u.__H, r) ? (u.__V = n(), u.i = r, u.__h = n, u.__V) : u.__;
}

function T(n, t) {
  return o = 8, F(function () {
    return n;
  }, t);
}

function q(n) {
  var u = r.context[n.__c],
      i = d(t++, 9);
  return i.c = n, u ? (null == i.__ && (i.__ = !0, u.sub(r)), u.props.value) : n.__;
}

function x(t, r) {
  preact__WEBPACK_IMPORTED_MODULE_0__.options.useDebugValue && preact__WEBPACK_IMPORTED_MODULE_0__.options.useDebugValue(r ? r(t) : t);
}

function V(n) {
  var u = d(t++, 10),
      i = p();
  return u.__ = n, r.componentDidCatch || (r.componentDidCatch = function (n) {
    u.__ && u.__(n), i[1](n);
  }), [i[0], function () {
    i[1](void 0);
  }];
}

function b() {
  for (var t; t = c.shift();) if (t.__P && t.__H) try {
    t.__H.__h.forEach(j), t.__H.__h.forEach(k), t.__H.__h = [];
  } catch (r) {
    t.__H.__h = [], preact__WEBPACK_IMPORTED_MODULE_0__.options.__e(r, t.__v);
  }
}

preact__WEBPACK_IMPORTED_MODULE_0__.options.__b = function (n) {
  r = null, e && e(n);
}, preact__WEBPACK_IMPORTED_MODULE_0__.options.__r = function (n) {
  a && a(n), t = 0;
  var i = (r = n.__c).__H;
  i && (u === r ? (i.__h = [], r.__h = [], i.__.forEach(function (n) {
    n.__N && (n.__ = n.__N), n.__V = f, n.__N = n.i = void 0;
  })) : (i.__h.forEach(j), i.__h.forEach(k), i.__h = [])), u = r;
}, preact__WEBPACK_IMPORTED_MODULE_0__.options.diffed = function (t) {
  v && v(t);
  var o = t.__c;
  o && o.__H && (o.__H.__h.length && (1 !== c.push(o) && i === preact__WEBPACK_IMPORTED_MODULE_0__.options.requestAnimationFrame || ((i = preact__WEBPACK_IMPORTED_MODULE_0__.options.requestAnimationFrame) || function (n) {
    var t,
        r = function () {
      clearTimeout(u), g && cancelAnimationFrame(t), setTimeout(n);
    },
        u = setTimeout(r, 100);

    g && (t = requestAnimationFrame(r));
  })(b)), o.__H.__.forEach(function (n) {
    n.i && (n.__H = n.i), n.__V !== f && (n.__ = n.__V), n.i = void 0, n.__V = f;
  })), u = r = null;
}, preact__WEBPACK_IMPORTED_MODULE_0__.options.__c = function (t, r) {
  r.some(function (t) {
    try {
      t.__h.forEach(j), t.__h = t.__h.filter(function (n) {
        return !n.__ || k(n);
      });
    } catch (u) {
      r.some(function (n) {
        n.__h && (n.__h = []);
      }), r = [], preact__WEBPACK_IMPORTED_MODULE_0__.options.__e(u, t.__v);
    }
  }), l && l(t, r);
}, preact__WEBPACK_IMPORTED_MODULE_0__.options.unmount = function (t) {
  m && m(t);
  var r,
      u = t.__c;
  u && u.__H && (u.__H.__.forEach(function (n) {
    try {
      j(n);
    } catch (n) {
      r = n;
    }
  }), r && preact__WEBPACK_IMPORTED_MODULE_0__.options.__e(r, u.__v));
};
var g = "function" == typeof requestAnimationFrame;

function j(n) {
  var t = r,
      u = n.__c;
  "function" == typeof u && (n.__c = void 0, u()), r = t;
}

function k(n) {
  var t = r;
  n.__c = n.__(), r = t;
}

function w(n, t) {
  return !n || n.length !== t.length || t.some(function (t, r) {
    return t !== n[r];
  });
}

function z(n, t) {
  return "function" == typeof t ? t(n) : t;
}



/***/ }),

/***/ "../node_modules/preact-render-to-string/dist/index.mjs":
/*!**************************************************************!*\
  !*** ../node_modules/preact-render-to-string/dist/index.mjs ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderToString": () => (/* binding */ m)
/* harmony export */ });
/* unused harmony exports render, renderToStaticMarkup, shallowRender */
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "../node_modules/preact/dist/preact.module.js");
var r=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i,n=/[&<>"]/;function o(e){var t=String(e);return n.test(t)?t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):t}var a=function(e,t){return String(e).replace(/(\n+)/g,"$1"+(t||"\t"))},i=function(e,t,r){return String(e).length>(t||40)||!r&&-1!==String(e).indexOf("\n")||-1!==String(e).indexOf("<")},l={};function s(e){var t="";for(var n in e){var o=e[n];null!=o&&""!==o&&(t&&(t+=" "),t+="-"==n[0]?n:l[n]||(l[n]=n.replace(/([A-Z])/g,"-$1").toLowerCase()),t+=": ",t+=o,"number"==typeof o&&!1===r.test(n)&&(t+="px"),t+=";")}return t||void 0}function f(e,t){for(var r in t)e[r]=t[r];return e}function u(e,t){return Array.isArray(t)?t.reduce(u,e):null!=t&&!1!==t&&e.push(t),e}var c={shallow:!0},p=[],_=/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/,d=/[\s\n\\/='"\0<>]/;function v(){this.__d=!0}m.render=m;var g=function(e,t){return m(e,t,c)},h=[];function m(t,r,n){r=r||{},n=n||{};var o=preact__WEBPACK_IMPORTED_MODULE_0__.options.__s;preact__WEBPACK_IMPORTED_MODULE_0__.options.__s=!0;var a=x(t,r,n);return preact__WEBPACK_IMPORTED_MODULE_0__.options.__c&&preact__WEBPACK_IMPORTED_MODULE_0__.options.__c(t,h),h.length=0,preact__WEBPACK_IMPORTED_MODULE_0__.options.__s=o,a}function x(r,n,l,c,g,h){if(null==r||"boolean"==typeof r)return"";if("object"!=typeof r)return o(r);var m=l.pretty,y=m&&"string"==typeof m?m:"\t";if(Array.isArray(r)){for(var b="",S=0;S<r.length;S++)m&&S>0&&(b+="\n"),b+=x(r[S],n,l,c,g,h);return b}var k,w=r.type,O=r.props,C=!1;if("function"==typeof w){if(C=!0,!l.shallow||!c&&!1!==l.renderRootComponent){if(w===preact__WEBPACK_IMPORTED_MODULE_0__.Fragment){var A=[];return u(A,r.props.children),x(A,n,l,!1!==l.shallowHighOrder,g,h)}var H,j=r.__c={__v:r,context:n,props:r.props,setState:v,forceUpdate:v,__d:!0,__h:[]};preact__WEBPACK_IMPORTED_MODULE_0__.options.__b&&preact__WEBPACK_IMPORTED_MODULE_0__.options.__b(r);var F=preact__WEBPACK_IMPORTED_MODULE_0__.options.__r;if(w.prototype&&"function"==typeof w.prototype.render){var M=w.contextType,T=M&&n[M.__c],$=null!=M?T?T.props.value:M.__:n;(j=r.__c=new w(O,$)).__v=r,j._dirty=j.__d=!0,j.props=O,null==j.state&&(j.state={}),null==j._nextState&&null==j.__s&&(j._nextState=j.__s=j.state),j.context=$,w.getDerivedStateFromProps?j.state=f(f({},j.state),w.getDerivedStateFromProps(j.props,j.state)):j.componentWillMount&&(j.componentWillMount(),j.state=j._nextState!==j.state?j._nextState:j.__s!==j.state?j.__s:j.state),F&&F(r),H=j.render(j.props,j.state,j.context)}else for(var L=w.contextType,E=L&&n[L.__c],D=null!=L?E?E.props.value:L.__:n,N=0;j.__d&&N++<25;)j.__d=!1,F&&F(r),H=w.call(r.__c,O,D);return j.getChildContext&&(n=f(f({},n),j.getChildContext())),preact__WEBPACK_IMPORTED_MODULE_0__.options.diffed&&preact__WEBPACK_IMPORTED_MODULE_0__.options.diffed(r),x(H,n,l,!1!==l.shallowHighOrder,g,h)}w=(k=w).displayName||k!==Function&&k.name||function(e){var t=(Function.prototype.toString.call(e).match(/^\s*function\s+([^( ]+)/)||"")[1];if(!t){for(var r=-1,n=p.length;n--;)if(p[n]===e){r=n;break}r<0&&(r=p.push(e)-1),t="UnnamedComponent"+r}return t}(k)}var P,R,U="<"+w;if(O){var W=Object.keys(O);l&&!0===l.sortAttributes&&W.sort();for(var q=0;q<W.length;q++){var z=W[q],I=O[z];if("children"!==z){if(!d.test(z)&&(l&&l.allAttributes||"key"!==z&&"ref"!==z&&"__self"!==z&&"__source"!==z)){if("defaultValue"===z)z="value";else if("defaultChecked"===z)z="checked";else if("defaultSelected"===z)z="selected";else if("className"===z){if(void 0!==O.class)continue;z="class"}else g&&/^xlink:?./.test(z)&&(z=z.toLowerCase().replace(/^xlink:?/,"xlink:"));if("htmlFor"===z){if(O.for)continue;z="for"}"style"===z&&I&&"object"==typeof I&&(I=s(I)),"a"===z[0]&&"r"===z[1]&&"boolean"==typeof I&&(I=String(I));var V=l.attributeHook&&l.attributeHook(z,I,n,l,C);if(V||""===V)U+=V;else if("dangerouslySetInnerHTML"===z)R=I&&I.__html;else if("textarea"===w&&"value"===z)P=I;else if((I||0===I||""===I)&&"function"!=typeof I){if(!(!0!==I&&""!==I||(I=z,l&&l.xml))){U=U+" "+z;continue}if("value"===z){if("select"===w){h=I;continue}"option"===w&&h==I&&void 0===O.selected&&(U+=" selected")}U=U+" "+z+'="'+o(I)+'"'}}}else P=I}}if(m){var Z=U.replace(/\n\s*/," ");Z===U||~Z.indexOf("\n")?m&&~U.indexOf("\n")&&(U+="\n"):U=Z}if(U+=">",d.test(w))throw new Error(w+" is not a valid HTML tag name in "+U);var B,G=_.test(w)||l.voidElements&&l.voidElements.test(w),J=[];if(R)m&&i(R)&&(R="\n"+y+a(R,y)),U+=R;else if(null!=P&&u(B=[],P).length){for(var K=m&&~U.indexOf("\n"),Q=!1,X=0;X<B.length;X++){var Y=B[X];if(null!=Y&&!1!==Y){var ee=x(Y,n,l,!0,"svg"===w||"foreignObject"!==w&&g,h);if(m&&!K&&i(ee)&&(K=!0),ee)if(m){var te=ee.length>0&&"<"!=ee[0];Q&&te?J[J.length-1]+=ee:J.push(ee),Q=te}else J.push(ee)}}if(m&&K)for(var re=J.length;re--;)J[re]="\n"+y+a(J[re],y)}if(J.length||R)U+=J.join("");else if(l&&l.xml)return U.substring(0,U.length-1)+" />";return!G||B||R?(m&&~U.indexOf("\n")&&(U+="\n"),U=U+"</"+w+">"):U=U.replace(/>$/," />"),U}m.shallowRender=g;/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (m);
//# sourceMappingURL=index.module.js.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************!*\
  !*** ./Main.ts ***!
  \*****************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Component": () => (/* reexport safe */ preact__WEBPACK_IMPORTED_MODULE_0__.Component),
/* harmony export */   "Fragment": () => (/* reexport safe */ preact__WEBPACK_IMPORTED_MODULE_0__.Fragment),
/* harmony export */   "cloneElement": () => (/* reexport safe */ preact__WEBPACK_IMPORTED_MODULE_0__.cloneElement),
/* harmony export */   "createContext": () => (/* reexport safe */ preact__WEBPACK_IMPORTED_MODULE_0__.createContext),
/* harmony export */   "createElement": () => (/* reexport safe */ preact__WEBPACK_IMPORTED_MODULE_0__.createElement),
/* harmony export */   "createRef": () => (/* reexport safe */ preact__WEBPACK_IMPORTED_MODULE_0__.createRef),
/* harmony export */   "h": () => (/* reexport safe */ preact__WEBPACK_IMPORTED_MODULE_0__.h),
/* harmony export */   "hydrate": () => (/* reexport safe */ preact__WEBPACK_IMPORTED_MODULE_0__.hydrate),
/* harmony export */   "isValidElement": () => (/* reexport safe */ preact__WEBPACK_IMPORTED_MODULE_0__.isValidElement),
/* harmony export */   "options": () => (/* reexport safe */ preact__WEBPACK_IMPORTED_MODULE_0__.options),
/* harmony export */   "render": () => (/* reexport safe */ preact__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "toChildArray": () => (/* reexport safe */ preact__WEBPACK_IMPORTED_MODULE_0__.toChildArray),
/* harmony export */   "useCallback": () => (/* reexport safe */ preact_hooks__WEBPACK_IMPORTED_MODULE_2__.useCallback),
/* harmony export */   "useContext": () => (/* reexport safe */ preact_hooks__WEBPACK_IMPORTED_MODULE_2__.useContext),
/* harmony export */   "useDebugValue": () => (/* reexport safe */ preact_hooks__WEBPACK_IMPORTED_MODULE_2__.useDebugValue),
/* harmony export */   "useEffect": () => (/* reexport safe */ preact_hooks__WEBPACK_IMPORTED_MODULE_2__.useEffect),
/* harmony export */   "useErrorBoundary": () => (/* reexport safe */ preact_hooks__WEBPACK_IMPORTED_MODULE_2__.useErrorBoundary),
/* harmony export */   "useImperativeHandle": () => (/* reexport safe */ preact_hooks__WEBPACK_IMPORTED_MODULE_2__.useImperativeHandle),
/* harmony export */   "useLayoutEffect": () => (/* reexport safe */ preact_hooks__WEBPACK_IMPORTED_MODULE_2__.useLayoutEffect),
/* harmony export */   "useMemo": () => (/* reexport safe */ preact_hooks__WEBPACK_IMPORTED_MODULE_2__.useMemo),
/* harmony export */   "useReducer": () => (/* reexport safe */ preact_hooks__WEBPACK_IMPORTED_MODULE_2__.useReducer),
/* harmony export */   "useRef": () => (/* reexport safe */ preact_hooks__WEBPACK_IMPORTED_MODULE_2__.useRef),
/* harmony export */   "useState": () => (/* reexport safe */ preact_hooks__WEBPACK_IMPORTED_MODULE_2__.useState),
/* harmony export */   "renderToString": () => (/* reexport safe */ preact_render_to_string__WEBPACK_IMPORTED_MODULE_3__.renderToString)
/* harmony export */ });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "../node_modules/preact/dist/preact.module.js");
/* harmony import */ var preact_compat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact/compat */ "../node_modules/preact/compat/dist/compat.module.js");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! preact/hooks */ "../node_modules/preact/hooks/dist/hooks.module.js");
/* harmony import */ var preact_render_to_string__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! preact-render-to-string */ "../node_modules/preact-render-to-string/dist/index.mjs");




 // eslint-disable-next-line
// @ts-ignore

globalThis.__AURISERVE = {
  h: preact__WEBPACK_IMPORTED_MODULE_0__.h
};
})();

window.__ASP_AURISERVE_PREACT = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=client.js.map
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../../common/build/util.js":
/*!*************************************!*\
  !*** ../../../common/build/util.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
__webpack_unused_export__ = exports.merge = void 0;

function merge(...classes) {
  return classes.filter(s => s).join(' ');
}

exports.merge = merge;

function sign(num) {
  return num < 0 ? -1 : num > 0 ? 1 : 0;
}

__webpack_unused_export__ = sign;

/***/ }),

/***/ "./Static.tsx":
/*!********************!*\
  !*** ./Static.tsx ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Static)
/* harmony export */ });
/* harmony import */ var common_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! common/util */ "../../../common/build/util.js");

const identifier = 'hydrated:static';
/**
 * All content rendered as a child of this component will be left untouched on the client,
 * unless they are themselves hydrated components. This is useful for doing
 * intensive rendering on the server without having to send all of the data to the client.
 * Children render as direct children of the parent component.
 */

function Static(props) {
  return typeof window === 'undefined' ? __AURISERVE.h("div", {
    class: (0,common_util__WEBPACK_IMPORTED_MODULE_0__.merge)(identifier, props.class),
    style: props.style
  }, props.children) : __AURISERVE.h("div", {
    class: (0,common_util__WEBPACK_IMPORTED_MODULE_0__.merge)(identifier, props.class),
    style: props.style,
    dangerouslySetInnerHTML: {
      __html: ''
    }
  });
}

/***/ }),

/***/ "preact":
/*!*****************************************!*\
  !*** external "__ASP_AURISERVE_PREACT" ***!
  \*****************************************/
/***/ ((module) => {

module.exports = window["__ASP_AURISERVE_PREACT"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************!*\
  !*** ./Client.ts ***!
  \*******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Static": () => (/* reexport safe */ _Static__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "hydrate": () => (/* binding */ hydrate)
/* harmony export */ });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "preact");
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(preact__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Static__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Static */ "./Static.tsx");
/* eslint-disable @typescript-eslint/ban-ts-comment */
 // import Static from './Static';

 // import * as Preact from 'preact';
// import * as PreactHooks from 'preact/hooks';
// import * as PreactCompat from 'preact/compat';
// // @ts-ignore
// window.__AS_PREACT = Preact;
// // @ts-ignore
// window.__AS_PREACT_HOOKS = PreactHooks;
// // @ts-ignore
// window.__AS_PREACT_COMPAT = PreactCompat;
// // @ts-ignore
// window.__AURISERVE = {};
// // @ts-ignore
// window.__AURISERVE.hydrated = {};
// //@ts-ignore
// window.__AURISERVE.hydrated.Static = Static;

function hydrate(identifier, element) {
  window.setTimeout(() => {
    document.querySelectorAll(`[data-element="${identifier}"]`).forEach(elem => {
      const script = elem.querySelector(':scope > script');
      const props = JSON.parse(script.innerText);
      script.remove();
      (0,preact__WEBPACK_IMPORTED_MODULE_0__.hydrate)((0,preact__WEBPACK_IMPORTED_MODULE_0__.h)(element, props), elem);
    }, 200);
  });
}
})();

window.__ASP_HYDRATED = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=client.js.map
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../../common/build/assert.js":
/*!***************************************!*\
  !*** ../../../common/build/assert.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*!
 * Assertion functions to streamline sanitization and validation.
 */

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.assertSchema = exports.matchesSchema = exports.isRawObject = exports.isType = exports.assertEq = exports.assert = exports.AssertError = void 0;
/** An error caused by a failed assertion. */

class AssertError extends Error {
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) Error.captureStackTrace(this, AssertError);
    this.name = 'AssertError';
  }

}

exports.AssertError = AssertError;
/**
 * Implementation of assert, as defined by the above overloads.
 *
 * @param condition - The condition to test.
 * @param message - The message to store in the error.
 * @param other - The first value is the custom error type, if any, and the remainder are additional parameters.
 */

function assert(condition, message, ...other) {
  var _a;

  if (!condition) throw new ((_a = other[0]) !== null && _a !== void 0 ? _a : AssertError)(message, ...(other.length > 1 ? other.slice(1) : []));
}

exports.assert = assert;
/**
 * Implementation of assertEq, as defined by the above overloads.
 *
 * @param a - The first value to check.
 * @param b - The second value to check.
 * @param message - The message to store in the error.
 * @param other - The first value is the custom error type, if any, and the remainder are additional parameters.
 */

function assertEq(a, b, message, ...other) {
  // eslint-disable-next-line
  // @ts-ignore
  if (a !== b) return assert(false, `${message} (${a} != ${b})`, ...other);
}

exports.assertEq = assertEq;
/**
 * Given a primitive type name or prototype, checks if the value provided is of the given type.
 * If the type is a primitive type name, it will perform a `typeof` check, with the special case that `undefined`
 * will not be considered of type 'object', use 'undefined' to check for undefined values.
 * Otherwise, it will perform an instanceof check on the value.
 *
 * @param val - The value to check the type of.
 * @param type - A primitive type name (e.g, string, number, boolean, undefined), or a prototype.
 * @returns true if the value is the given type, false otherwise.
 */

function isType(val, type) {
  if (type === 'any') return true;

  if (typeof type === 'string') {
    if (type === 'undefined') return val === undefined;
    if (typeof val === type) return true;
  } else if (val instanceof type) return true;

  return false;
}

exports.isType = isType;

function isRawObject(obj) {
  return obj && obj.constructor === Object || false;
}

exports.isRawObject = isRawObject;

function isSchema(val) {
  return isRawObject(val);
}

function isPrimitiveArray(str) {
  return str.includes('[]');
}

function matchesSchema(object, schema, path = '') {
  if (!isRawObject(object)) return 'Not an object.';

  for (const [key, validation] of Object.entries(schema)) {
    const validations = Array.isArray(validation) ? validation : [validation];
    const extraKeys = Object.keys(object).filter(key => schema[key] === undefined).map(key => `'${path}${key}'`);

    if (extraKeys.length > 0) {
      const keysStr = extraKeys.length === 1 ? extraKeys[0] : extraKeys.length === 2 ? `${extraKeys[0]} and ${extraKeys[1]}` : `${extraKeys.slice(0, -1).join(', ')}, and ${extraKeys.slice(-1)}`;
      return `Unknown propert${extraKeys.length >= 2 ? 'ies' : 'y'} ${keysStr}.`;
    }

    let anyValid = false;

    for (const validation of validations) {
      if (isSchema(validation)) {
        const matches = matchesSchema(object[key], validation, `${path}${key}.`);

        if (matches === true) {
          anyValid = true;
          break;
        }
      } else if (isPrimitiveArray(validation)) {
        const nonArrayPrimitive = validation.replace('[]', '');

        if (Array.isArray(object[key])) {
          let valid = true;

          for (const val of object[key]) {
            if (!isType(val, nonArrayPrimitive)) {
              valid = false;
              break;
            }
          }

          if (valid) {
            anyValid = true;
            break;
          }
        }
      } else if (isType(object[key], validation)) {
        anyValid = true;
        break;
      }
    }

    if (!anyValid) {
      const typesArr = validations.map(v => isRawObject(v) ? '[subschema]' : v.toString());
      const typesStr = typesArr.length === 1 ? typesArr[0] : typesArr.length === 2 ? `${typesArr[0]} or ${typesArr[1]}` : `${typesArr.slice(0, -1).join(', ')}, or ${typesArr.slice(-1)}`;
      return `'${path}${key}' must be ${typesStr}.`;
    }
  }

  return true;
}

exports.matchesSchema = matchesSchema;

function assertSchema(object, schema, message, ...other) {
  const matches = matchesSchema(object, schema); // eslint-disable-next-line
  // @ts-ignore

  if (typeof matches === 'string') assert(false, `${message}: ${matches}`, ...other);
}

exports.assertSchema = assertSchema;

/***/ }),

/***/ "../../../common/build/color.js":
/*!**************************************!*\
  !*** ../../../common/build/color.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.to = exports.isHSVA = exports.isRGBA = exports.isHex = void 0;

const assert_1 = __webpack_require__(/*! ./assert */ "../../../common/build/assert.js");
/** Checks if the color provided is in Hexadecimal format. */


function isHex(color) {
  return typeof color === 'string' && color[0] === '#' && (color.length === 7 || color.length === 9);
}

exports.isHex = isHex;
/** Checks if the color provided is in RGBA format. */

function isRGBA(color) {
  return typeof color !== 'string' && 'r' in color;
}

exports.isRGBA = isRGBA;
/** Checks if the Color provided is in HSVA format. */

function isHSVA(color) {
  return typeof color !== 'string' && 'h' in color;
}

exports.isHSVA = isHSVA;

function to(color, format) {
  const c = isHex(color) ? HexToHSVA(color) : isRGBA(color) ? RGBAtoHSVA(color) : color;

  switch (format) {
    case 'hex':
      return HSVAtoHex(c);

    case 'rgba':
      return HSVAtoRGBA(c);

    case 'hsva':
      return c;

    default:
      assert_1.assert(false, `Invalid format '${format}' provided.`);
  }
}

exports.to = to;
/**
 * Converts an HSVA Color to RGBA.
 * Source: https://stackoverflow.com/questions/17242144/#comment24984878_17242144
 *
 * @param hsva - The HSVA value to convert.
 * @returns the RGBA representation.
 */

function HSVAtoRGBA(hsva = {
  h: 0,
  s: 0,
  v: 0,
  a: 1
}) {
  let r = 0,
      g = 0,
      b = 0;
  const i = Math.floor(hsva.h * 6);
  const f = hsva.h * 6 - i;
  const p = hsva.v * (1 - hsva.s);
  const q = hsva.v * (1 - f * hsva.s);
  const t = hsva.v * (1 - (1 - f) * hsva.s);

  switch (i % 6) {
    default:
      break;

    case 0:
      r = hsva.v;
      g = t;
      b = p;
      break;

    case 1:
      r = q;
      g = hsva.v;
      b = p;
      break;

    case 2:
      r = p;
      g = hsva.v;
      b = t;
      break;

    case 3:
      r = p;
      g = q;
      b = hsva.v;
      break;

    case 4:
      r = t;
      g = p;
      b = hsva.v;
      break;

    case 5:
      r = hsva.v;
      g = p;
      b = q;
      break;
  }

  return {
    r: r * 255,
    g: g * 255,
    b: b * 255,
    a: hsva.a * 255
  };
}
/**
 * Converts an RGBA Color to HSVA.
 * Source: https://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript
 *
 * @param rgba - The RGBA value to convert.
 * @returns the HSVA representation.
 */


function RGBAtoHSVA(rgba = {
  r: 0,
  g: 0,
  b: 0,
  a: 1
}) {
  let rr;
  let gg;
  let bb;
  let h = 0;
  let s;
  const a = rgba.a / 255;
  const v = Math.max(rgba.r, rgba.g, rgba.b) / 255;
  const diff = v - Math.min(rgba.r, rgba.g, rgba.b) / 255;

  const diffc = c => (v - c) / 6 / diff + 1 / 2;

  if (diff === 0) h = s = 0;else {
    s = diff / v;
    rr = diffc(rgba.r / 255);
    gg = diffc(rgba.g / 255);
    bb = diffc(rgba.b / 255);
    if (rgba.r / 255 === v) h = bb - gg;else if (rgba.g / 255 === v) h = 1 / 3 + rr - bb;else if (rgba.b / 255 === v) h = 2 / 3 + gg - rr;
    if (h < 0) h += 1;else if (h > 1) h -= 1;
  }
  return {
    h,
    s,
    v,
    a
  };
}
/**
 * Converts a numeric value from 0-255
 * to a hexadecimal string from 00-ff.
 */


function componentToHex(c) {
  const hex = Math.floor(c).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}
/**
 * Converts an RGBA Color to a Hex string.
 * Source: https://stackoverflow.com/a/5624139
 *
 * @param rgb - The RGBA value to convert.
 * @returns the hexadecimal string representation.
 */


function RGBAtoHex(rgb = {
  r: 0,
  g: 0,
  b: 0,
  a: 255
}) {
  return `#${componentToHex(rgb.r)}${componentToHex(rgb.g)}${componentToHex(rgb.b)}${rgb.a === 255 ? '' : componentToHex(rgb.a)}`;
}
/**
 * Converts a Hex string to an RGBA Color.
 *
 * @param hex - The hexadecimal string to convert.
 * @returns the RGBA representation.
 */


function HexToRGBA(hex) {
  const r = parseInt(`0x${hex[1]}${hex[2]}`, 16);
  const g = parseInt(`0x${hex[3]}${hex[4]}`, 16);
  const b = parseInt(`0x${hex[5]}${hex[6]}`, 16);
  let a = parseInt(`0x${hex[7]}${hex[8]}`, 16);
  if (Number.isNaN(a)) a = 255;
  return {
    r,
    g,
    b,
    a
  };
}
/**
 * Converts an HSVA Color to a Hex string.
 *
 * @param hsva - The HSVA value to convert.
 * @returns the hexadecimal string representation.
 */


function HSVAtoHex(hsva = {
  h: 0,
  s: 0,
  v: 0,
  a: 1
}) {
  return RGBAtoHex(HSVAtoRGBA(hsva));
}
/**
 * Converts a Hex string to an RGBA Color.
 *
 * @param hex - The hexadecimal string to convert.
 * @returns the RGBA representation.
 */


function HexToHSVA(hex) {
  return RGBAtoHSVA(HexToRGBA(hex));
}

/***/ }),

/***/ "../../../common/build/format.js":
/*!***************************************!*\
  !*** ../../../common/build/format.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.titleCase = exports.identifier = exports.date = exports.vector = exports.bytes = void 0;

const tslib_1 = __webpack_require__(/*! tslib */ "../../../node_modules/tslib/tslib.es6.js");

const dayjs_1 = tslib_1.__importDefault(__webpack_require__(/*! dayjs */ "../../../common/node_modules/dayjs/dayjs.min.js"));

const relativeTime_1 = tslib_1.__importDefault(__webpack_require__(/*! dayjs/plugin/relativeTime */ "../../../common/node_modules/dayjs/plugin/relativeTime.js"));

const advancedFormat_1 = tslib_1.__importDefault(__webpack_require__(/*! dayjs/plugin/advancedFormat */ "../../../common/node_modules/dayjs/plugin/advancedFormat.js"));

dayjs_1.default.extend(relativeTime_1.default);
dayjs_1.default.extend(advancedFormat_1.default);
/** Byte size tiers. */

const tiers = ['B', 'KB', 'MB', 'GB'];
/**
 * Converts a byte value into a human readable value, such as '242 KB', '3.4 MB', etc.
 *
 * @param bytes - The byte value to convert.
 * @returns the formatted value.
 */

function bytes(bytes) {
  bytes = Math.round(bytes);
  let tier = 0;

  while (bytes > 800 && tier < tiers.length - 1) {
    tier++;
    bytes /= 1024;
  }

  return `${Math.ceil(bytes)} ${tiers[tier]}`;
}

exports.bytes = bytes;
/**
 * Converts an vector matching the format { x, y } or { width, height }
 * into a string such as '50 × 62'.
 *
 * @param vec - The vector to convert.
 * @returns the formatted value.
 */

function vector(vec) {
  var _a, _b;

  return `${(_a = vec.x) !== null && _a !== void 0 ? _a : vec.width} × ${(_b = vec.y) !== null && _b !== void 0 ? _b : vec.height}`;
}

exports.vector = vector;
/**
 * Converts a Javascript Date into a human-readable string of the format '2 hours ago',
 * '3 days ago', '2 weeks ago', 'on January 3rd', or 'on January 3rd, 2019', depending on the current date.
 *
 * @param date - The date to convert.
 * @returns a human-readable date.
 */

function date(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (Date.now() - +d < 1000 * 60 * 60 * 24 * 3) return dayjs_1.default(date).fromNow();else if (d.getFullYear() === new Date().getFullYear()) return `on ${dayjs_1.default(date).format('MMMM Do')}`;
  return `on ${dayjs_1.default(date).format('MMMM Do, YYYY')}`;
}

exports.date = date; // export function fileNameToName(name: string, len?: number) {
// 	let preExtension = name.substring(0, name.lastIndexOf('.') < 0 ? name.length : name.lastIndexOf('.'));
// 	let cleanName = preExtension.replace(/[_-]+/g, ' ').split(' ').map((str) => {
// 		if (str.length < 2) return str;
// 		const firstChar = str[0];
// 		const rest = str.substring(1);
// 		return firstChar.toUpperCase() + rest.toLowerCase();
// 	}).join(' ');
// 	if (len && cleanName.length > len) cleanName = cleanName.substring(0, len);
// 	return cleanName;
// }

/**
 * Converts a string to a valid ascii lowercase + underscores identifier,
 * by replacing specifal characters with underscores and trimming.
 * Returns null if the resultant string is empty or outside of the length constraints.
 *
 * @param str - The string to sanitize.
 * @param min - The minimum length of the resultant string. Default 3.
 * @param max - The maximum length of the resultant string. Default 32.
 * @param clamp - Whether or not to clamp the string to the maximum length if it is longer. Default true.
 * @returns the sanitized string, or null if the string does not meet the constraints provided.
 */

function identifier(str, min = 3, max = 32, clamp = true) {
  const sanitized = str.toLowerCase() // lowercase the identifier
  .replace(/[ -]/g, '_') // replace space-like characters with underscores
  .replace(/[^a-zA-Z0-9_]/g, '') // remove all other non-alphanumeric characters
  .split('_').filter(Boolean).join('_'); // trim underscore whitespace

  if (sanitized.length > max && clamp) return sanitized.substring(0, max);
  if (sanitized.length < min || sanitized.length > max) return null;
  return sanitized;
}

exports.identifier = identifier;
/**
 * Title cases a string by replacing underscores and hyphens
 * with spaces and capitalizing the first letter of each word.
 *
 * @param str - The string to title case.
 * @returns the title-cased string.
 */

function titleCase(str) {
  return str.replace(/[_-]/g, ' ').replace(/\w\S*/g, str => {
    var _a, _b, _c, _d;

    return ((_b = (_a = str.charAt(0)) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '') + ((_d = (_c = str.substring(1)) === null || _c === void 0 ? void 0 : _c.toLowerCase()) !== null && _d !== void 0 ? _d : '');
  });
}

exports.titleCase = titleCase;

/***/ }),

/***/ "../../../common/build/index.js":
/*!**************************************!*\
  !*** ../../../common/build/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
});
__webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = exports.merge = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = void 0;

var path_1 = __webpack_require__(/*! ./path */ "../../../common/build/path.js");

__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return path_1.traversePath;
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return path_1.buildPath;
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return path_1.splitPath;
  }
});

var format_1 = __webpack_require__(/*! ./format */ "../../../common/build/format.js");

__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return format_1.bytes;
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return format_1.vector;
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return format_1.date;
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return format_1.identifier;
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return format_1.titleCase;
  }
});

var color_1 = __webpack_require__(/*! ./color */ "../../../common/build/color.js");

__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return color_1.isHex;
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return color_1.isRGBA;
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return color_1.isHSVA;
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return color_1.to;
  }
});

var util_1 = __webpack_require__(/*! ./util */ "../../../common/build/util.js");

Object.defineProperty(exports, "merge", ({
  enumerable: true,
  get: function () {
    return util_1.merge;
  }
}));
__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return util_1.sign;
  }
});

var version_1 = __webpack_require__(/*! ./version */ "../../../common/build/version.js");

__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return __importDefault(version_1).default;
  }
});

var assert_1 = __webpack_require__(/*! ./assert */ "../../../common/build/assert.js");

__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return assert_1.AssertError;
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return assert_1.assert;
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return assert_1.assertEq;
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return assert_1.isType;
  }
});
__webpack_unused_export__ = ({
  enumerable: true,
  get: function () {
    return assert_1.assertSchema;
  }
});

/***/ }),

/***/ "../../../common/build/path.js":
/*!*************************************!*\
  !*** ../../../common/build/path.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.splitPath = exports.buildPath = exports.traversePath = void 0;

const assert_1 = __webpack_require__(/*! ./assert */ "../../../common/build/assert.js");

function descend(seg, object) {
  if (typeof seg === 'number') {
    assert_1.assert(Array.isArray(object), `Invalid Array index into Value '${JSON.stringify(object)}'.`);
    assert_1.assert(object.length > seg, `Index '${seg}' is missing in Array '${JSON.stringify(object)}'.`);
    return object[seg];
  }

  assert_1.assert(object !== undefined && typeof object === 'object', `Value is not an object: '${object}'.`);
  assert_1.assert(seg in object, `Object is missing property '${seg}': '${JSON.stringify(object)}'.`);
  return object[seg];
}

function traversePath(object, path) {
  splitPath(path).forEach(seg => object = descend(seg, object));
  return object;
}

exports.traversePath = traversePath;

function buildPath(...segs) {
  return segs.filter(seg => seg !== '').reduce((p, c, i) => p += Number.isInteger(c) ? `[${c.toString()}]` : (i !== 0 ? '.' : '') + c, '');
}

exports.buildPath = buildPath;

function splitPath(path) {
  return path.replace(/\[/g, '.[').split('.').filter(Boolean).map(seg => {
    if (seg.startsWith('[')) {
      assert_1.assert(seg.endsWith(']'), `Invalid path array segment '${seg}'. [1]`);
      const num = Number.parseInt(seg.substring(1, seg.length - 1), 10);
      assert_1.assert(!Number.isNaN(num), `Invalid path array segment '${seg}'. [2]`);
      return num;
    }

    return seg;
  });
}

exports.splitPath = splitPath;

/***/ }),

/***/ "../../../common/build/util.js":
/*!*************************************!*\
  !*** ../../../common/build/util.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.sign = exports.merge = void 0;

function merge(...classes) {
  return classes.filter(s => s).join(' ');
}

exports.merge = merge;

function sign(num) {
  return num < 0 ? -1 : num > 0 ? 1 : 0;
}

exports.sign = sign;

/***/ }),

/***/ "../../../common/build/version.js":
/*!****************************************!*\
  !*** ../../../common/build/version.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

const assert_1 = __webpack_require__(/*! ./assert */ "../../../common/build/assert.js");
/**
 * Represents a version string implementing a subset of the SemVer format.
 * Does not support pre-release versions or tags.
 */


class Version {
  /**
   * Constructs a new Version object out of a version string.
   * Throws an AssertError if the version string does not match the required format.
   */
  constructor(str) {
    const parts = str.trim().split('.');
    assert_1.assert(parts.length === 3, `Invalid version string: '${str}'.`);
    this.major = parseInt(parts[0], 10);
    this.minor = parseInt(parts[1], 10);
    this.patch = parseInt(parts[2], 10);
  }
  /**
   * Checks if this Version object satisfies the range string specified.
   * Note: only exact versions, ^, ~, and x are supported. Ranges ard pre-release tags are not supported.
   *
   * @param range - The range string to check against.
   * @returns a boolean indicating if the version matches.
   */


  matches(range) {
    const strParts = range.trim().split('.');
    let minorFuzzy = strParts[1] === 'x';

    if (!minorFuzzy && strParts[0].startsWith('^')) {
      strParts[0] = strParts[0].substring(1).trim();
      minorFuzzy = true;
    }

    let patchFuzzy = strParts[2] === 'x';

    if (!patchFuzzy && strParts[0].startsWith('~')) {
      strParts[0] = strParts[0].substring(1).trim();
      patchFuzzy = true;
    }

    const majorFuzzy = strParts[0].startsWith('x');
    minorFuzzy || (minorFuzzy = majorFuzzy);
    patchFuzzy || (patchFuzzy = minorFuzzy);
    const major = strParts[0] === 'x' ? 0 : parseInt(strParts[0], 10);
    const minor = strParts[1] === 'x' || strParts[1] === undefined ? 0 : parseInt(strParts[1], 10);
    const patch = strParts[2] === 'x' || strParts[2] === undefined ? 0 : parseInt(strParts[2], 10);
    if (major !== this.major) return majorFuzzy ? this.major >= major : false;
    if (minor !== this.minor) return minorFuzzy ? this.minor >= minor : false;
    if (patch !== this.patch) return patchFuzzy ? this.patch >= patch : false;
    return true;
  }

}

exports["default"] = Version;

/***/ }),

/***/ "../../../common/node_modules/dayjs/dayjs.min.js":
/*!*******************************************************!*\
  !*** ../../../common/node_modules/dayjs/dayjs.min.js ***!
  \*******************************************************/
/***/ (function(module) {

!function (t, e) {
   true ? module.exports = e() : 0;
}(this, function () {
  "use strict";

  var t = 1e3,
      e = 6e4,
      n = 36e5,
      r = "millisecond",
      i = "second",
      s = "minute",
      u = "hour",
      a = "day",
      o = "week",
      f = "month",
      h = "quarter",
      c = "year",
      d = "date",
      $ = "Invalid Date",
      l = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,
      y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,
      M = {
    name: "en",
    weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
    months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_")
  },
      m = function (t, e, n) {
    var r = String(t);
    return !r || r.length >= e ? t : "" + Array(e + 1 - r.length).join(n) + t;
  },
      g = {
    s: m,
    z: function (t) {
      var e = -t.utcOffset(),
          n = Math.abs(e),
          r = Math.floor(n / 60),
          i = n % 60;
      return (e <= 0 ? "+" : "-") + m(r, 2, "0") + ":" + m(i, 2, "0");
    },
    m: function t(e, n) {
      if (e.date() < n.date()) return -t(n, e);
      var r = 12 * (n.year() - e.year()) + (n.month() - e.month()),
          i = e.clone().add(r, f),
          s = n - i < 0,
          u = e.clone().add(r + (s ? -1 : 1), f);
      return +(-(r + (n - i) / (s ? i - u : u - i)) || 0);
    },
    a: function (t) {
      return t < 0 ? Math.ceil(t) || 0 : Math.floor(t);
    },
    p: function (t) {
      return {
        M: f,
        y: c,
        w: o,
        d: a,
        D: d,
        h: u,
        m: s,
        s: i,
        ms: r,
        Q: h
      }[t] || String(t || "").toLowerCase().replace(/s$/, "");
    },
    u: function (t) {
      return void 0 === t;
    }
  },
      D = "en",
      v = {};

  v[D] = M;

  var p = function (t) {
    return t instanceof _;
  },
      S = function (t, e, n) {
    var r;
    if (!t) return D;
    if ("string" == typeof t) v[t] && (r = t), e && (v[t] = e, r = t);else {
      var i = t.name;
      v[i] = t, r = i;
    }
    return !n && r && (D = r), r || !n && D;
  },
      w = function (t, e) {
    if (p(t)) return t.clone();
    var n = "object" == typeof e ? e : {};
    return n.date = t, n.args = arguments, new _(n);
  },
      O = g;

  O.l = S, O.i = p, O.w = function (t, e) {
    return w(t, {
      locale: e.$L,
      utc: e.$u,
      x: e.$x,
      $offset: e.$offset
    });
  };

  var _ = function () {
    function M(t) {
      this.$L = S(t.locale, null, !0), this.parse(t);
    }

    var m = M.prototype;
    return m.parse = function (t) {
      this.$d = function (t) {
        var e = t.date,
            n = t.utc;
        if (null === e) return new Date(NaN);
        if (O.u(e)) return new Date();
        if (e instanceof Date) return new Date(e);

        if ("string" == typeof e && !/Z$/i.test(e)) {
          var r = e.match(l);

          if (r) {
            var i = r[2] - 1 || 0,
                s = (r[7] || "0").substring(0, 3);
            return n ? new Date(Date.UTC(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s)) : new Date(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s);
          }
        }

        return new Date(e);
      }(t), this.$x = t.x || {}, this.init();
    }, m.init = function () {
      var t = this.$d;
      this.$y = t.getFullYear(), this.$M = t.getMonth(), this.$D = t.getDate(), this.$W = t.getDay(), this.$H = t.getHours(), this.$m = t.getMinutes(), this.$s = t.getSeconds(), this.$ms = t.getMilliseconds();
    }, m.$utils = function () {
      return O;
    }, m.isValid = function () {
      return !(this.$d.toString() === $);
    }, m.isSame = function (t, e) {
      var n = w(t);
      return this.startOf(e) <= n && n <= this.endOf(e);
    }, m.isAfter = function (t, e) {
      return w(t) < this.startOf(e);
    }, m.isBefore = function (t, e) {
      return this.endOf(e) < w(t);
    }, m.$g = function (t, e, n) {
      return O.u(t) ? this[e] : this.set(n, t);
    }, m.unix = function () {
      return Math.floor(this.valueOf() / 1e3);
    }, m.valueOf = function () {
      return this.$d.getTime();
    }, m.startOf = function (t, e) {
      var n = this,
          r = !!O.u(e) || e,
          h = O.p(t),
          $ = function (t, e) {
        var i = O.w(n.$u ? Date.UTC(n.$y, e, t) : new Date(n.$y, e, t), n);
        return r ? i : i.endOf(a);
      },
          l = function (t, e) {
        return O.w(n.toDate()[t].apply(n.toDate("s"), (r ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e)), n);
      },
          y = this.$W,
          M = this.$M,
          m = this.$D,
          g = "set" + (this.$u ? "UTC" : "");

      switch (h) {
        case c:
          return r ? $(1, 0) : $(31, 11);

        case f:
          return r ? $(1, M) : $(0, M + 1);

        case o:
          var D = this.$locale().weekStart || 0,
              v = (y < D ? y + 7 : y) - D;
          return $(r ? m - v : m + (6 - v), M);

        case a:
        case d:
          return l(g + "Hours", 0);

        case u:
          return l(g + "Minutes", 1);

        case s:
          return l(g + "Seconds", 2);

        case i:
          return l(g + "Milliseconds", 3);

        default:
          return this.clone();
      }
    }, m.endOf = function (t) {
      return this.startOf(t, !1);
    }, m.$set = function (t, e) {
      var n,
          o = O.p(t),
          h = "set" + (this.$u ? "UTC" : ""),
          $ = (n = {}, n[a] = h + "Date", n[d] = h + "Date", n[f] = h + "Month", n[c] = h + "FullYear", n[u] = h + "Hours", n[s] = h + "Minutes", n[i] = h + "Seconds", n[r] = h + "Milliseconds", n)[o],
          l = o === a ? this.$D + (e - this.$W) : e;

      if (o === f || o === c) {
        var y = this.clone().set(d, 1);
        y.$d[$](l), y.init(), this.$d = y.set(d, Math.min(this.$D, y.daysInMonth())).$d;
      } else $ && this.$d[$](l);

      return this.init(), this;
    }, m.set = function (t, e) {
      return this.clone().$set(t, e);
    }, m.get = function (t) {
      return this[O.p(t)]();
    }, m.add = function (r, h) {
      var d,
          $ = this;
      r = Number(r);

      var l = O.p(h),
          y = function (t) {
        var e = w($);
        return O.w(e.date(e.date() + Math.round(t * r)), $);
      };

      if (l === f) return this.set(f, this.$M + r);
      if (l === c) return this.set(c, this.$y + r);
      if (l === a) return y(1);
      if (l === o) return y(7);
      var M = (d = {}, d[s] = e, d[u] = n, d[i] = t, d)[l] || 1,
          m = this.$d.getTime() + r * M;
      return O.w(m, this);
    }, m.subtract = function (t, e) {
      return this.add(-1 * t, e);
    }, m.format = function (t) {
      var e = this;
      if (!this.isValid()) return $;

      var n = t || "YYYY-MM-DDTHH:mm:ssZ",
          r = O.z(this),
          i = this.$locale(),
          s = this.$H,
          u = this.$m,
          a = this.$M,
          o = i.weekdays,
          f = i.months,
          h = function (t, r, i, s) {
        return t && (t[r] || t(e, n)) || i[r].substr(0, s);
      },
          c = function (t) {
        return O.s(s % 12 || 12, t, "0");
      },
          d = i.meridiem || function (t, e, n) {
        var r = t < 12 ? "AM" : "PM";
        return n ? r.toLowerCase() : r;
      },
          l = {
        YY: String(this.$y).slice(-2),
        YYYY: this.$y,
        M: a + 1,
        MM: O.s(a + 1, 2, "0"),
        MMM: h(i.monthsShort, a, f, 3),
        MMMM: h(f, a),
        D: this.$D,
        DD: O.s(this.$D, 2, "0"),
        d: String(this.$W),
        dd: h(i.weekdaysMin, this.$W, o, 2),
        ddd: h(i.weekdaysShort, this.$W, o, 3),
        dddd: o[this.$W],
        H: String(s),
        HH: O.s(s, 2, "0"),
        h: c(1),
        hh: c(2),
        a: d(s, u, !0),
        A: d(s, u, !1),
        m: String(u),
        mm: O.s(u, 2, "0"),
        s: String(this.$s),
        ss: O.s(this.$s, 2, "0"),
        SSS: O.s(this.$ms, 3, "0"),
        Z: r
      };

      return n.replace(y, function (t, e) {
        return e || l[t] || r.replace(":", "");
      });
    }, m.utcOffset = function () {
      return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
    }, m.diff = function (r, d, $) {
      var l,
          y = O.p(d),
          M = w(r),
          m = (M.utcOffset() - this.utcOffset()) * e,
          g = this - M,
          D = O.m(this, M);
      return D = (l = {}, l[c] = D / 12, l[f] = D, l[h] = D / 3, l[o] = (g - m) / 6048e5, l[a] = (g - m) / 864e5, l[u] = g / n, l[s] = g / e, l[i] = g / t, l)[y] || g, $ ? D : O.a(D);
    }, m.daysInMonth = function () {
      return this.endOf(f).$D;
    }, m.$locale = function () {
      return v[this.$L];
    }, m.locale = function (t, e) {
      if (!t) return this.$L;
      var n = this.clone(),
          r = S(t, e, !0);
      return r && (n.$L = r), n;
    }, m.clone = function () {
      return O.w(this.$d, this);
    }, m.toDate = function () {
      return new Date(this.valueOf());
    }, m.toJSON = function () {
      return this.isValid() ? this.toISOString() : null;
    }, m.toISOString = function () {
      return this.$d.toISOString();
    }, m.toString = function () {
      return this.$d.toUTCString();
    }, M;
  }(),
      b = _.prototype;

  return w.prototype = b, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", f], ["$y", c], ["$D", d]].forEach(function (t) {
    b[t[1]] = function (e) {
      return this.$g(e, t[0], t[1]);
    };
  }), w.extend = function (t, e) {
    return t.$i || (t(e, _, w), t.$i = !0), w;
  }, w.locale = S, w.isDayjs = p, w.unix = function (t) {
    return w(1e3 * t);
  }, w.en = v[D], w.Ls = v, w.p = {}, w;
});

/***/ }),

/***/ "../../../common/node_modules/dayjs/plugin/advancedFormat.js":
/*!*******************************************************************!*\
  !*** ../../../common/node_modules/dayjs/plugin/advancedFormat.js ***!
  \*******************************************************************/
/***/ (function(module) {

!function (e, t) {
   true ? module.exports = t() : 0;
}(this, function () {
  "use strict";

  return function (e, t, r) {
    var n = t.prototype,
        s = n.format;
    r.en.ordinal = function (e) {
      var t = ["th", "st", "nd", "rd"],
          r = e % 100;
      return "[" + e + (t[(r - 20) % 10] || t[r] || t[0]) + "]";
    }, n.format = function (e) {
      var t = this,
          r = this.$locale(),
          n = this.$utils(),
          a = (e || "YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g, function (e) {
        switch (e) {
          case "Q":
            return Math.ceil((t.$M + 1) / 3);

          case "Do":
            return r.ordinal(t.$D);

          case "gggg":
            return t.weekYear();

          case "GGGG":
            return t.isoWeekYear();

          case "wo":
            return r.ordinal(t.week(), "W");

          case "w":
          case "ww":
            return n.s(t.week(), "w" === e ? 1 : 2, "0");

          case "W":
          case "WW":
            return n.s(t.isoWeek(), "W" === e ? 1 : 2, "0");

          case "k":
          case "kk":
            return n.s(String(0 === t.$H ? 24 : t.$H), "k" === e ? 1 : 2, "0");

          case "X":
            return Math.floor(t.$d.getTime() / 1e3);

          case "x":
            return t.$d.getTime();

          case "z":
            return "[" + t.offsetName() + "]";

          case "zzz":
            return "[" + t.offsetName("long") + "]";

          default:
            return e;
        }
      });
      return s.bind(this)(a);
    };
  };
});

/***/ }),

/***/ "../../../common/node_modules/dayjs/plugin/relativeTime.js":
/*!*****************************************************************!*\
  !*** ../../../common/node_modules/dayjs/plugin/relativeTime.js ***!
  \*****************************************************************/
/***/ (function(module) {

!function (r, e) {
   true ? module.exports = e() : 0;
}(this, function () {
  "use strict";

  return function (r, e, t) {
    r = r || {};
    var n = e.prototype,
        o = {
      future: "in %s",
      past: "%s ago",
      s: "a few seconds",
      m: "a minute",
      mm: "%d minutes",
      h: "an hour",
      hh: "%d hours",
      d: "a day",
      dd: "%d days",
      M: "a month",
      MM: "%d months",
      y: "a year",
      yy: "%d years"
    };

    function i(r, e, t, o) {
      return n.fromToBase(r, e, t, o);
    }

    t.en.relativeTime = o, n.fromToBase = function (e, n, i, d, u) {
      for (var f, a, s, l = i.$locale().relativeTime || o, h = r.thresholds || [{
        l: "s",
        r: 44,
        d: "second"
      }, {
        l: "m",
        r: 89
      }, {
        l: "mm",
        r: 44,
        d: "minute"
      }, {
        l: "h",
        r: 89
      }, {
        l: "hh",
        r: 21,
        d: "hour"
      }, {
        l: "d",
        r: 35
      }, {
        l: "dd",
        r: 25,
        d: "day"
      }, {
        l: "M",
        r: 45
      }, {
        l: "MM",
        r: 10,
        d: "month"
      }, {
        l: "y",
        r: 17
      }, {
        l: "yy",
        d: "year"
      }], m = h.length, c = 0; c < m; c += 1) {
        var y = h[c];
        y.d && (f = d ? t(e).diff(i, y.d, !0) : i.diff(e, y.d, !0));
        var p = (r.rounding || Math.round)(Math.abs(f));

        if (s = f > 0, p <= y.r || !y.r) {
          p <= 1 && c > 0 && (y = h[c - 1]);
          var v = l[y.l];
          u && (p = u("" + p)), a = "string" == typeof v ? v.replace("%d", p) : v(p, n, y.l, s);
          break;
        }
      }

      if (n) return a;
      var M = s ? l.future : l.past;
      return "function" == typeof M ? M(a) : M.replace("%s", a);
    }, n.to = function (r, e) {
      return i(r, e, this, !0);
    }, n.from = function (r, e) {
      return i(r, e, this);
    };

    var d = function (r) {
      return r.$u ? t.utc() : t();
    };

    n.toNow = function (r) {
      return this.to(d(this), r);
    }, n.fromNow = function (r) {
      return this.from(d(this), r);
    };
  };
});

/***/ }),

/***/ "../../../node_modules/tslib/tslib.es6.js":
/*!************************************************!*\
  !*** ../../../node_modules/tslib/tslib.es6.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "__extends": () => (/* binding */ __extends),
/* harmony export */   "__assign": () => (/* binding */ __assign),
/* harmony export */   "__rest": () => (/* binding */ __rest),
/* harmony export */   "__decorate": () => (/* binding */ __decorate),
/* harmony export */   "__param": () => (/* binding */ __param),
/* harmony export */   "__metadata": () => (/* binding */ __metadata),
/* harmony export */   "__awaiter": () => (/* binding */ __awaiter),
/* harmony export */   "__generator": () => (/* binding */ __generator),
/* harmony export */   "__createBinding": () => (/* binding */ __createBinding),
/* harmony export */   "__exportStar": () => (/* binding */ __exportStar),
/* harmony export */   "__values": () => (/* binding */ __values),
/* harmony export */   "__read": () => (/* binding */ __read),
/* harmony export */   "__spread": () => (/* binding */ __spread),
/* harmony export */   "__spreadArrays": () => (/* binding */ __spreadArrays),
/* harmony export */   "__spreadArray": () => (/* binding */ __spreadArray),
/* harmony export */   "__await": () => (/* binding */ __await),
/* harmony export */   "__asyncGenerator": () => (/* binding */ __asyncGenerator),
/* harmony export */   "__asyncDelegator": () => (/* binding */ __asyncDelegator),
/* harmony export */   "__asyncValues": () => (/* binding */ __asyncValues),
/* harmony export */   "__makeTemplateObject": () => (/* binding */ __makeTemplateObject),
/* harmony export */   "__importStar": () => (/* binding */ __importStar),
/* harmony export */   "__importDefault": () => (/* binding */ __importDefault),
/* harmony export */   "__classPrivateFieldGet": () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   "__classPrivateFieldSet": () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   "__classPrivateFieldIn": () => (/* binding */ __classPrivateFieldIn)
/* harmony export */ });
/******************************************************************************
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

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};
function __rest(s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}
function __decorate(decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param(paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
}
function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}
var __createBinding = Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);

  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }

  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
};
function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
      m = s && o[s],
      i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
}
/** @deprecated */

function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
}
/** @deprecated */

function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
}
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []),
      i,
      q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i;

  function verb(n) {
    if (g[n]) i[n] = function (v) {
      return new Promise(function (a, b) {
        q.push([n, v, a, b]) > 1 || resume(n, v);
      });
    };
  }

  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }

  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }

  function fulfill(value) {
    resume("next", value);
  }

  function reject(value) {
    resume("throw", value);
  }

  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function () {
    return this;
  }, i;

  function verb(n, f) {
    i[n] = o[n] ? function (v) {
      return (p = !p) ? {
        value: __await(o[n](v)),
        done: n === "return"
      } : f ? f(v) : v;
    } : f;
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
      i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);

  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }

  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
}
function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
}
;

var __setModuleDefault = Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
}
function __importDefault(mod) {
  return mod && mod.__esModule ? mod : {
    default: mod
  };
}
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

/***/ }),

/***/ "./layout/Carousel.tsx":
/*!*****************************!*\
  !*** ./layout/Carousel.tsx ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Carousel": () => (/* binding */ Carousel)
/* harmony export */ });
/* harmony import */ var common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! common */ "../../../common/build/index.js");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact/hooks */ "preact/hooks");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(preact_hooks__WEBPACK_IMPORTED_MODULE_0__);



// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  hydrate,
  Static
} = __webpack_require__(/*! hydrated */ "hydrated"); // import as from 'auriserve';


// const { hydrate, Static } = as.hydrated;
const identifier = 'base:carousel';

function RawCarousel(props) {
  var _props$speed, _props$style;

  const elemRef = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const children = Array.isArray(props.children) ? props.children : [props.children];
  (_props$speed = props.speed) !== null && _props$speed !== void 0 ? _props$speed : props.speed = 200;
  (0,preact_hooks__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const elem = elemRef.current;
    const items = elem.querySelector('.carousel-items');
    const container = items.children[0];
    let active = 0;
    elem.classList.remove('static');
    container.children[0].classList.add('active');
    items.style.height = `${container.children[0].clientHeight}px`;
    let cycling = true;
    let interval;
    const observer = new IntersectionObserver(entries => {
      const intersecting = entries[0].isIntersecting;

      if (intersecting && !interval && cycling) {
        interval = setInterval(() => {
          move(1, 'right', false);
        }, props.interval);
      } else if (!intersecting && interval && cycling) {
        clearInterval(interval);
        interval = 0;
      }
    }, {
      threshold: 0.5
    });
    observer.observe(elem);

    function move(offset, direction, user) {
      if (user && cycling) {
        clearInterval(interval);
        interval = 0;
        cycling = false;
        observer.disconnect();
      }

      const prevElem = container.children[active];
      active = (active + offset + container.children.length * 4) % container.children.length;
      const nextElem = container.children[active];
      prevElem.style.transitionDuration = `${props.speed}ms`;
      prevElem.classList.add(direction === 'right' ? 'transition-left' : 'transition-right');
      nextElem.classList.add('active');
      nextElem.classList.add(direction === 'right' ? 'transition-right' : 'transition-left');
      items.style.height = `${nextElem.clientHeight}px`;
      setTimeout(() => {
        requestAnimationFrame(() => {
          nextElem.style.transitionDuration = `${props.speed}ms`;
          requestAnimationFrame(() => {
            nextElem.classList.remove(direction === 'right' ? 'transition-right' : 'transition-left');
          });
        });
        setTimeout(() => {
          nextElem.style.transitionDuration = '';
        }, props.speed);
      }, props.speed / 2);
      setTimeout(() => {
        prevElem.classList.remove('active');
        prevElem.classList.remove(direction === 'right' ? 'transition-left' : 'transition-right');
        prevElem.style.transitionDuration = '';
      }, props.speed);
    }

    const buttons = Array.prototype.slice.call(elem.querySelectorAll('.button-arrow'));

    if (buttons.length) {
      buttons[0].addEventListener('click', () => move(-1, 'left', true));
      buttons[1].addEventListener('click', () => move(1, 'right', true));
    }
  }, [props.interval, props.speed]);
  return __AURISERVE.h("div", {
    ref: elemRef,
    class: (0,common__WEBPACK_IMPORTED_MODULE_1__.merge)(identifier, props.class, 'static'),
    style: {
      maxWidth: props.width ? `${props.width}px` : undefined,
      ...(props.pagination === 'arrows' ? {
        paddingLeft: 64,
        paddingRight: 64
      } : {}),
      ...((_props$style = props.style) !== null && _props$style !== void 0 ? _props$style : {})
    }
  }, __AURISERVE.h("div", {
    class: "carousel-items",
    style: {
      transitionDuration: `${props.speed * 1.5}ms`
    }
  }, __AURISERVE.h(Static, null, children.map((child, i) => __AURISERVE.h("div", {
    key: i,
    class: "carousel-item"
  }, child)))), props.pagination === 'arrows' && __AURISERVE.h("button", {
    class: "button-arrow",
    "aria-label": "Previous"
  }), props.pagination === 'arrows' && __AURISERVE.h("button", {
    class: "button-arrow",
    "aria-label": "Next"
  }));
}

const Carousel = hydrate(identifier, RawCarousel);
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
  identifier,
  component: Carousel
});

/***/ }),

/***/ "preact/hooks":
/*!*****************************************!*\
  !*** external "__ASP_AURISERVE_PREACT" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = window["__ASP_AURISERVE_PREACT"];

/***/ }),

/***/ "hydrated":
/*!*********************************!*\
  !*** external "__ASP_HYDRATED" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["__ASP_HYDRATED"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*******************!*\
  !*** ./Client.ts ***!
  \*******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _layout_Carousel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./layout/Carousel */ "./layout/Carousel.tsx");
// import './layout/Carousel'


function keep(_thing) {
  /* nothing */
}

;
keep(_layout_Carousel__WEBPACK_IMPORTED_MODULE_0__.Carousel);
})();

window.__ASP_ELEMENTS_BASE = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=client.js.map
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./common/ContactForm.tsx":
/*!********************************!*\
  !*** ./common/ContactForm.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var hydrated__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hydrated */ "hydrated");
/* harmony import */ var hydrated__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hydrated__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact/hooks */ "preact/hooks");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(preact_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* eslint-disable react-hooks/rules-of-hooks */


const identifier = 'tax_calculator:contact_form';

function getTemplateMessage(name, email, municipality, raw) {
  let message = `<p>Hey there! My name is <strong>${name}</strong>,<br/>and I'm contacting you on behalf of the municipality of <strong>${municipality}</strong>.</p><p>We are in need of a simple, user-friendly, and secure Tax Calculator for our residents to use, and your tool looks perfect. We'd love to get in contact.</p><p>You can reach me at <strong>${email}</strong>.<br/>Thanks!</p>`;
  if (raw) message = message.replace(/<\/p>/g, '\n\n').replace(/<br\/>/g, '\n').replace(/<\/?\w+>/g, '');
  return message;
}

function RawContactForm() {
  const form = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const [name, setName] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [email, setEmail] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [municipality, setMunicipality] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [message, setMessage] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [hydrated, setHydrated] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [disabled, setDisabled] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [submitted, setSubmitted] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [template, setTemplate] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
  (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => setHydrated(true), []);
  const rawTemplate = getTemplateMessage(name || 'John Doe', email || 'johndoe@example.com', municipality || 'Townsville', true);
  (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (template) setMessage(rawTemplate);
  }, [name, email, municipality, rawTemplate, template]);

  function handleEditMessage() {
    if (!template) return;
    setMessage(rawTemplate);
    setTemplate(false);
  }

  function handleActivateTemplate() {
    if (message === rawTemplate) {
      setMessage('');
      setTemplate(true);
    }
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    setDisabled(true);
    fetch('/form/contact', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        municipality,
        message
      })
    }).then(() => setTimeout(() => setSubmitted(true), 500));
  }

  if (!hydrated) return null;
  if (submitted) return __AURISERVE.h("div", {
    class: `${identifier} submitted`
  }, __AURISERVE.h("h6", null, "Submission Recieved!"), __AURISERVE.h("p", null, "Thanks for reaching out, we'll make sure to get back to you in the next couple of business days."));
  return __AURISERVE.h("form", {
    class: identifier,
    ref: form,
    onSubmit: handleSubmit,
    disabled: disabled
  }, __AURISERVE.h("div", {
    class: "left"
  }, __AURISERVE.h("label", null, __AURISERVE.h("span", null, "Name"), __AURISERVE.h("input", {
    disabled: disabled,
    maxLength: 64,
    required: true,
    type: "text",
    placeholder: "John Doe",
    value: name,
    onChange: evt => setName(evt.target.value)
  })), __AURISERVE.h("label", null, __AURISERVE.h("span", null, "Municipality"), __AURISERVE.h("input", {
    disabled: disabled,
    maxLength: 64,
    required: true,
    type: "text",
    placeholder: "Townsville",
    value: municipality,
    onChange: evt => setMunicipality(evt.target.value)
  })), __AURISERVE.h("label", null, __AURISERVE.h("span", null, "Email"), __AURISERVE.h("input", {
    disabled: disabled,
    maxLength: 128,
    required: true,
    name: "email",
    type: "email",
    placeholder: "johndoe@example.com",
    value: email,
    onChange: evt => setEmail(evt.target.value)
  })), __AURISERVE.h("hr", null), __AURISERVE.h("button", {
    type: "submit",
    disabled: disabled
  }, __AURISERVE.h("span", null, "Send Message"))), __AURISERVE.h("div", {
    class: "right"
  }, __AURISERVE.h("label", null, __AURISERVE.h("span", null, "Message"), __AURISERVE.h("div", {
    class: "message-container"
  }, __AURISERVE.h("textarea", {
    maxLength: 1024 * 1024,
    disabled: disabled,
    onFocus: handleEditMessage,
    onBlur: handleActivateTemplate,
    name: "message",
    onChange: evt => setMessage(evt.target.value)
  }, message), template && __AURISERVE.h("div", {
    class: "message-template",
    dangerouslySetInnerHTML: {
      __html: getTemplateMessage(name || 'John Doe', email || 'johndoe@example.com', municipality || 'Townsville')
    }
  })))));
}

const ContactForm = (0,hydrated__WEBPACK_IMPORTED_MODULE_0__.hydrate)(identifier, RawContactForm);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  identifier,
  component: ContactForm
});

/***/ }),

/***/ "./common/QuoteGenerator.tsx":
/*!***********************************!*\
  !*** ./common/QuoteGenerator.tsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var hydrated__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hydrated */ "hydrated");
/* harmony import */ var hydrated__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hydrated__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact/hooks */ "preact/hooks");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(preact_hooks__WEBPACK_IMPORTED_MODULE_1__);


const identifier = 'tax_calculator:quote_generator';
const quotes = [1000, 1500, 2000, 2500, 3500];
const residents = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 13000, 16000, 19000, 21000, 25000, 40000, 55000, 70000, 85000, 100000];

function RawQuoteGenerator() {
  const currentValueAnim = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const currentPopAnim = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const [value, setValue] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(5);
  const [quote, setQuote] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(quotes[Math.floor(value / 5)]);
  const [population, setPopulation] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(residents[value]);
  const percent = value / 20 * 100;

  function handleChange(evt) {
    const newValue = parseInt(evt.target.value, 10);
    setValue(newValue);
    const lastQuote = quotes[Math.floor(value / 5)];
    const currQuote = quotes[Math.floor(newValue / 5)];
    const lastPop = residents[value];
    const currPop = residents[newValue];

    if (lastQuote !== currQuote) {
      if (currentValueAnim.current) {
        currentValueAnim.current.abort();
      }

      const aborter = new AbortController();
      currentValueAnim.current = aborter;
      let frame = 0;
      const maxFrames = 11;

      function callback() {
        if (aborter.signal.aborted) return;
        setQuote(lastQuote + (currQuote - lastQuote) * frame / maxFrames);
        if (frame++ < maxFrames) requestAnimationFrame(callback);
      }

      callback();
    }

    if (lastPop !== currPop) {
      if (currentPopAnim.current) {
        currentPopAnim.current.abort();
      }

      const aborter = new AbortController();
      currentPopAnim.current = aborter;
      let frame = 0;
      const maxFrames = 5;

      function callback() {
        if (aborter.signal.aborted) return;
        setPopulation(lastPop + (currPop - lastPop) * frame / maxFrames);
        if (frame++ < maxFrames) requestAnimationFrame(callback);
      }

      callback();
    }
  }

  return __AURISERVE.h("div", {
    class: identifier
  }, __AURISERVE.h("label", null, __AURISERVE.h("div", {
    class: "numbers"
  }, __AURISERVE.h("p", {
    class: "population"
  }, __AURISERVE.h("span", {
    class: "value"
  }, Intl.NumberFormat('en-us', {
    useGrouping: false,
    maximumFractionDigits: 0
  }).format(population), population === 100000 && '+'), __AURISERVE.h("span", {
    class: "label"
  }, " Residents")), __AURISERVE.h("p", {
    class: "evaluation"
  }, __AURISERVE.h("span", {
    class: "value"
  }, "$", Intl.NumberFormat('en-us', {
    maximumFractionDigits: 0,
    useGrouping: false
  }).format(quote)), __AURISERVE.h("span", {
    class: "label"
  }, " / year"))), __AURISERVE.h("input", {
    type: "range",
    min: "0",
    max: "20",
    step: "1",
    value: value,
    onChange: handleChange,
    style: {
      background: `linear-gradient(to right, #60A5FA, #60A5FA ${percent}%, #A4B0C2 ${percent}%, #A4B0C2)`
    }
  }), __AURISERVE.h("div", {
    class: "notches"
  }, __AURISERVE.h("span", {
    class: value >= 0 ? 'active' : ''
  }, "0"), __AURISERVE.h("span", {
    class: value >= 5 ? 'active' : ''
  }, "5k"), __AURISERVE.h("span", {
    class: value >= 10 ? 'active' : ''
  }, "10k"), __AURISERVE.h("span", {
    class: value >= 15 ? 'active' : ''
  }, "25k"), __AURISERVE.h("span", {
    class: value >= 20 ? 'active' : ''
  }, "100k+"))));
}

const QuoteGenerator = (0,hydrated__WEBPACK_IMPORTED_MODULE_0__.hydrate)(identifier, RawQuoteGenerator);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  identifier,
  component: QuoteGenerator
});

/***/ }),

/***/ "./common/UnsubscribeForm.tsx":
/*!************************************!*\
  !*** ./common/UnsubscribeForm.tsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var hydrated__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hydrated */ "hydrated");
/* harmony import */ var hydrated__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hydrated__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! preact/hooks */ "preact/hooks");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(preact_hooks__WEBPACK_IMPORTED_MODULE_1__);


const identifier = 'tax_calculator:unsubscribe_form';

function RawUnsubscribeForm() {
  const [email, setEmail] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)('');
  const [hydrated, setHydrated] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [disabled, setDisabled] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [submitted, setSubmitted] = (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  (0,preact_hooks__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => setHydrated(true), []);

  function handleSubmit(evt) {
    evt.preventDefault();
    setDisabled(true);
    fetch('/form/unsubscribe', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email
      })
    }).then(() => setTimeout(() => {
      setSubmitted(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }, 500));
  }

  if (!hydrated) return null;
  if (submitted) return __AURISERVE.h("div", {
    class: `${identifier} submitted`
  }, __AURISERVE.h("h6", null, "You have been unsubscribed."), __AURISERVE.h("p", null, "Redirecting to the home page..."));
  return __AURISERVE.h("form", {
    class: identifier,
    onSubmit: handleSubmit,
    disabled: disabled
  }, __AURISERVE.h("label", null, __AURISERVE.h("span", null, "Email"), __AURISERVE.h("input", {
    disabled: disabled,
    maxLength: 128,
    required: true,
    type: "email",
    placeholder: "johndoe@example.com",
    value: email,
    onChange: evt => setEmail(evt.target.value)
  })), __AURISERVE.h("button", {
    type: "submit",
    disabled: disabled
  }, __AURISERVE.h("span", null, "Unsubscribe")));
}

const UnsubscribeForm = (0,hydrated__WEBPACK_IMPORTED_MODULE_0__.hydrate)(identifier, RawUnsubscribeForm);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  identifier,
  component: UnsubscribeForm
});

/***/ }),

/***/ "preact/hooks":
/*!*****************************************!*\
  !*** external "__ASP_AURISERVE_PREACT" ***!
  \*****************************************/
/***/ ((module) => {

module.exports = window["__ASP_AURISERVE_PREACT"];

/***/ }),

/***/ "hydrated":
/*!*********************************!*\
  !*** external "__ASP_HYDRATED" ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["__ASP_HYDRATED"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./client/Main.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_ContactForm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/ContactForm */ "./common/ContactForm.tsx");
/* harmony import */ var _common_QuoteGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/QuoteGenerator */ "./common/QuoteGenerator.tsx");
/* harmony import */ var _common_UnsubscribeForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/UnsubscribeForm */ "./common/UnsubscribeForm.tsx");




function keep(_t) {
  /* don't tree shake pls */
}

;
keep(_common_ContactForm__WEBPACK_IMPORTED_MODULE_0__["default"]);
keep(_common_QuoteGenerator__WEBPACK_IMPORTED_MODULE_1__["default"]);
keep(_common_UnsubscribeForm__WEBPACK_IMPORTED_MODULE_2__["default"]);
})();

window.__ASP_TAX_CALCULATOR = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=client.js.map