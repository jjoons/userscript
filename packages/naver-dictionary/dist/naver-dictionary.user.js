// ==UserScript==
// @name         Naver Dictionary
// @namespace    https://github.com/jjoons
// @version      0.1.0
// @author       jjoons
// @description  불편한 부분을 수정하며 개선 사항을 추가합니다.
// @icon         https://icons.duckduckgo.com/ip3/dict.naver.com.ico
// @homepage     https://github.com/jjoons/userscript
// @match        https://hanja.dict.naver.com/
// @require      https://cdn.jsdelivr.net/npm/preact@10.26.5/dist/preact.min.js
// @grant        GM_addElement
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const _=document.createElement("style");_.textContent=o,document.head.append(_)})(" ._toolbarWrap_8mzlf_1{position:fixed;bottom:1rem;right:1rem;z-index:9999}[data-theme=dark] ._toolbarWrap_8mzlf_1{color:#ddd}._toolbarWrap_8mzlf_1>._toolbar_8mzlf_1{display:flex;flex-direction:column;gap:.5rem}._toolbarWrap_8mzlf_1>._toolbar_8mzlf_1 ._button_8mzlf_15{background-color:#eeeeeeb3;padding:.625rem;line-height:0;border:1px solid #222;border-radius:.5rem;-webkit-backdrop-filter:blur(.5rem);backdrop-filter:blur(.5rem);color:#111}._toolbarWrap_8mzlf_1>._toolbar_8mzlf_1 ._button_8mzlf_15:hover{background-color:#bbb}[data-theme=dark] ._toolbarWrap_8mzlf_1>._toolbar_8mzlf_1 ._button_8mzlf_15{background-color:#222222b3;border-color:#444;color:#eee}[data-theme=dark] ._toolbarWrap_8mzlf_1>._toolbar_8mzlf_1 ._button_8mzlf_15:hover{background-color:#333}._popupWrap_y8a68_1{position:fixed;top:0;bottom:0;left:0;right:0;background-color:#0000004d;z-index:19999;display:flex;justify-content:center;align-items:center}._popupWrap_y8a68_1>._popup_y8a68_1{flex-grow:1;margin:0 auto;max-width:32rem;background-color:#fff;padding:1.5rem;border-radius:1rem;box-shadow:.25rem}._popupWrap_y8a68_1>._popup_y8a68_1>._popupHeader_y8a68_22{margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:center}._popupWrap_y8a68_1>._popup_y8a68_1>._popupHeader_y8a68_22>._popupTitle_y8a68_28{font-size:1.5rem}._popupWrap_y8a68_1>._popup_y8a68_1>._popupHeader_y8a68_22>._closeButton_y8a68_31{line-height:0;padding:.25rem}[data-theme=dark] ._popupWrap_y8a68_1>._popup_y8a68_1>._popupHeader_y8a68_22>._closeButton_y8a68_31{color:#eee}[data-theme=dark] ._popupWrap_y8a68_1>._popup_y8a68_1{background-color:#222;color:#eee} ");

(function (preact) {
  'use strict';

  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
  var _a, _DEFAULT_BASE_NODE, _instances, _observer, _baseNode, _isStarted, _subscribers, __DOMObserver_static, staticInitEventListener_fn, __DOMObserver_instances, mutationCallback_fn, start_fn, stop_fn, removeThisInstanceIfInactive_fn, removeThisInstance_fn;
  var f$1 = 0;
  function u$1(e2, t2, n, o2, i2, u2) {
    t2 || (t2 = {});
    var a2, c2, p2 = t2;
    if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
    var l2 = { type: e2, props: p2, key: n, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f$1, __i: -1, __u: 0, __source: i2, __self: u2 };
    if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
    return preact.options.vnode && preact.options.vnode(l2), l2;
  }
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var isEmpty = (str) => str.length === 0;
  var isBlank = (str) => {
    if (isEmpty(str)) return true;
    return str.trim().length === 0;
  };
  var DOMObserver = (_a = class {
    /**
     *
     */
    constructor(options2) {
      __privateAdd(this, __DOMObserver_instances);
      __privateAdd(this, _observer);
      /** 변경 사항을 감지할 `Node` */
      __privateAdd(this, _baseNode);
      __privateAdd(this, _isStarted, false);
      __privateAdd(this, _subscribers, []);
      __privateSet(this, _observer, new MutationObserver(__privateMethod(this, __DOMObserver_instances, mutationCallback_fn).bind(this)));
      __privateSet(this, _baseNode, options2.baseNode);
    }
    /**
     * {@linkcode DOMObserver} 클래스를 만들 때 사용되는 정적 메소드
     *
     * @param options 인스턴스를 생성할 때 사용하는 옵션
     */
    static getInstance(options2 = {}) {
      let { baseNode } = options2;
      if (!baseNode) {
        baseNode = __privateGet(_a, _DEFAULT_BASE_NODE);
      }
      if (!(baseNode instanceof Node)) {
        throw new Error("The type of the baseNode property must be of type Node");
      }
      for (const ins2 of __privateGet(this, _instances)) {
        if (__privateGet(ins2, _baseNode) === baseNode) {
          return ins2;
        }
      }
      const ins = new this({ baseNode });
      __privateGet(this, _instances).push(ins);
      return ins;
    }
    /**
     * `Element` 감지를 위해 구독하는 메소드
     *
     * @param options 모니터링할 때 사용하는 옵션
     * @returns
     */
    subscribe(options2) {
      const { selector, onAdd, onRemove, onAttribute } = options2;
      if (selector && isBlank(selector)) throw new Error("Selector is blank");
      if (!onAdd && !onRemove && !onAttribute) {
        throw new Error("You must register at least one type of listener");
      }
      __privateGet(this, _subscribers).push(options2);
      if (!__privateGet(this, _isStarted)) {
        __privateMethod(this, __DOMObserver_instances, start_fn).call(this);
      }
      return {
        unsubscribe: () => {
          const subscriberIndex = __privateGet(this, _subscribers).indexOf(options2);
          if (subscriberIndex >= 0) {
            __privateGet(this, _subscribers).splice(subscriberIndex, 1);
          }
          __privateMethod(this, __DOMObserver_instances, removeThisInstanceIfInactive_fn).call(this);
        }
      };
    }
  }, _DEFAULT_BASE_NODE = new WeakMap(), _instances = new WeakMap(), _observer = new WeakMap(), _baseNode = new WeakMap(), _isStarted = new WeakMap(), _subscribers = new WeakMap(), __DOMObserver_static = new WeakSet(), staticInitEventListener_fn = function() {
    if (!__privateGet(this, _DEFAULT_BASE_NODE) && document.body instanceof Node) {
      __privateSet(this, _DEFAULT_BASE_NODE, document.body);
    }
  }, __DOMObserver_instances = new WeakSet(), /**
   * {@linkcode MutationObserver} Callback 함수
   *
   * @param muts
   */
  mutationCallback_fn = function(muts) {
    for (const mut of muts) {
      if (mut.type === "childList") {
        for (const addedNode of Array.from(mut.addedNodes)) {
          if (addedNode instanceof Element) {
            for (const { onAdd, selector, deep = {} } of __privateGet(this, _subscribers)) {
              if (onAdd) {
                if (selector) {
                  if (addedNode.matches(selector)) {
                    onAdd({ node: addedNode });
                  } else if (deep.add === "single") {
                    const el = addedNode.querySelector(selector);
                    if (el) onAdd({ node: el, deep: deep.add });
                  } else if (deep.add === "all") {
                    for (const el of Array.from(addedNode.querySelectorAll(selector))) {
                      onAdd({ node: el, deep: deep.add });
                    }
                  }
                } else onAdd({ node: addedNode });
              }
            }
          }
        }
        for (const removedNodes of Array.from(mut.removedNodes)) {
          if (removedNodes instanceof Element) {
            for (const { onRemove, selector, deep = {} } of __privateGet(this, _subscribers)) {
              if (onRemove) {
                if (selector) {
                  if (removedNodes.matches(selector)) {
                    onRemove({ node: removedNodes });
                  } else if (deep.remove === "single") {
                    const el = removedNodes.querySelector(selector);
                    if (el) onRemove({ node: el, deep: deep.remove });
                  } else if (deep.remove === "all") {
                    for (const el of Array.from(removedNodes.querySelectorAll(selector))) {
                      onRemove({ node: el, deep: deep.remove });
                    }
                  }
                } else onRemove({ node: removedNodes });
              }
            }
          }
        }
      } else if (mut.type === "attributes" && mut.target instanceof Element) {
        for (const { onAttribute, selector, deep = {} } of __privateGet(this, _subscribers)) {
          if (onAttribute) {
            if (selector) {
              if (mut.target.matches(selector)) {
                onAttribute({
                  node: mut.target,
                  attributeName: mut.attributeName,
                  oldValue: mut.oldValue
                });
              } else if (deep.attribute === "single") {
                const el = mut.target.querySelector(selector);
                if (el)
                  onAttribute({
                    node: el,
                    attributeName: mut.attributeName,
                    oldValue: mut.oldValue,
                    deep: deep.attribute
                  });
              } else if (deep.attribute === "all") {
                for (const el of Array.from(mut.target.querySelectorAll(selector))) {
                  onAttribute({
                    node: el,
                    attributeName: mut.attributeName,
                    oldValue: mut.oldValue,
                    deep: deep.attribute
                  });
                }
              }
            } else
              onAttribute({
                node: mut.target,
                attributeName: mut.attributeName,
                oldValue: mut.oldValue
              });
          }
        }
      }
    }
  }, /**
   * `MutationObserver`를 시작하는 메소드
   */
  start_fn = function() {
    __privateGet(this, _observer).observe(__privateGet(this, _baseNode), {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true
    });
    __privateSet(this, _isStarted, true);
  }, /**
   * `MutationObserver`를 정지하는 메소드
   */
  stop_fn = function() {
    __privateGet(this, _observer).disconnect();
    __privateSet(this, _isStarted, false);
  }, /**
   * 조건에 해당하는지 확인한 다음 인스턴스 모음 객체에서 인스턴스를 삭제하는 메소드 실행
   *
   * @returns 삭제 조건에 해당할 경우 `true` 반환
   */
  removeThisInstanceIfInactive_fn = function() {
    if (__privateGet(this, _subscribers).length > 0) return false;
    return __privateMethod(this, __DOMObserver_instances, removeThisInstance_fn).call(this);
  }, /**
   * 인스턴스 모음 객체에서 인스턴스를 제거하는 메소드
   *
   * @returns 삭제되었을 경우 `true` 반환
   */
  removeThisInstance_fn = function() {
    const index = __privateGet(_a, _instances).indexOf(this);
    if (index < 0) return false;
    __privateMethod(this, __DOMObserver_instances, stop_fn).call(this);
    const deletedInstances = __privateGet(_a, _instances).splice(index, 1);
    return deletedInstances.length === 1;
  }, __privateAdd(_a, __DOMObserver_static), __privateAdd(_a, _DEFAULT_BASE_NODE, document.body), __privateAdd(_a, _instances, []), addEventListener("DOMContentLoaded", __privateMethod(_a, __DOMObserver_static, staticInitEventListener_fn).bind(_a)), addEventListener("load", __privateMethod(_a, __DOMObserver_static, staticInitEventListener_fn).bind(_a)), _a);
  var onBodyReady = (callback) => {
    if (document.body instanceof HTMLElement) {
      callback(document.body);
      return;
    }
    const observer = new MutationObserver((_, obs) => {
      if (document.body instanceof HTMLElement) {
        obs.disconnect();
        callback(document.body);
      }
    });
    observer.observe(document.documentElement, {
      childList: true
    });
    return () => {
      observer.disconnect();
    };
  };
  var t, r, u, i, o = 0, f = [], c = preact.options, e = c.__b, a = c.__r, v = c.diffed, l = c.__c, m = c.unmount, s = c.__;
  function p(n, t2) {
    c.__h && c.__h(r, n, o || t2), o = 0;
    var u2 = r.__H || (r.__H = { __: [], __h: [] });
    return n >= u2.__.length && u2.__.push({}), u2.__[n];
  }
  function d(n) {
    return o = 1, h(D$1, n);
  }
  function h(n, u2, i2) {
    var o2 = p(t++, 2);
    if (o2.t = n, !o2.__c && (o2.__ = [D$1(void 0, u2), function(n2) {
      var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n2);
      t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
    }], o2.__c = r, !r.__f)) {
      var f2 = function(n2, t2, r2) {
        if (!o2.__c.__H) return true;
        var u3 = o2.__c.__H.__.filter(function(n3) {
          return !!n3.__c;
        });
        if (u3.every(function(n3) {
          return !n3.__N;
        })) return !c2 || c2.call(this, n2, t2, r2);
        var i3 = o2.__c.props !== n2;
        return u3.forEach(function(n3) {
          if (n3.__N) {
            var t3 = n3.__[0];
            n3.__ = n3.__N, n3.__N = void 0, t3 !== n3.__[0] && (i3 = true);
          }
        }), c2 && c2.call(this, n2, t2, r2) || i3;
      };
      r.__f = true;
      var c2 = r.shouldComponentUpdate, e2 = r.componentWillUpdate;
      r.componentWillUpdate = function(n2, t2, r2) {
        if (this.__e) {
          var u3 = c2;
          c2 = void 0, f2(n2, t2, r2), c2 = u3;
        }
        e2 && e2.call(this, n2, t2, r2);
      }, r.shouldComponentUpdate = f2;
    }
    return o2.__N || o2.__;
  }
  function y(n, u2) {
    var i2 = p(t++, 3);
    !c.__s && C(i2.__H, u2) && (i2.__ = n, i2.u = u2, r.__H.__h.push(i2));
  }
  function x(n) {
    var u2 = r.context[n.__c], i2 = p(t++, 9);
    return i2.c = n, u2 ? (null == i2.__ && (i2.__ = true, u2.sub(r)), u2.props.value) : n.__;
  }
  function j$1() {
    for (var n; n = f.shift(); ) if (n.__P && n.__H) try {
      n.__H.__h.forEach(z), n.__H.__h.forEach(B$1), n.__H.__h = [];
    } catch (t2) {
      n.__H.__h = [], c.__e(t2, n.__v);
    }
  }
  c.__b = function(n) {
    r = null, e && e(n);
  }, c.__ = function(n, t2) {
    n && t2.__k && t2.__k.__m && (n.__m = t2.__k.__m), s && s(n, t2);
  }, c.__r = function(n) {
    a && a(n), t = 0;
    var i2 = (r = n.__c).__H;
    i2 && (u === r ? (i2.__h = [], r.__h = [], i2.__.forEach(function(n2) {
      n2.__N && (n2.__ = n2.__N), n2.u = n2.__N = void 0;
    })) : (i2.__h.forEach(z), i2.__h.forEach(B$1), i2.__h = [], t = 0)), u = r;
  }, c.diffed = function(n) {
    v && v(n);
    var t2 = n.__c;
    t2 && t2.__H && (t2.__H.__h.length && (1 !== f.push(t2) && i === c.requestAnimationFrame || ((i = c.requestAnimationFrame) || w)(j$1)), t2.__H.__.forEach(function(n2) {
      n2.u && (n2.__H = n2.u), n2.u = void 0;
    })), u = r = null;
  }, c.__c = function(n, t2) {
    t2.some(function(n2) {
      try {
        n2.__h.forEach(z), n2.__h = n2.__h.filter(function(n3) {
          return !n3.__ || B$1(n3);
        });
      } catch (r2) {
        t2.some(function(n3) {
          n3.__h && (n3.__h = []);
        }), t2 = [], c.__e(r2, n2.__v);
      }
    }), l && l(n, t2);
  }, c.unmount = function(n) {
    m && m(n);
    var t2, r2 = n.__c;
    r2 && r2.__H && (r2.__H.__.forEach(function(n2) {
      try {
        z(n2);
      } catch (n3) {
        t2 = n3;
      }
    }), r2.__H = void 0, t2 && c.__e(t2, r2.__v));
  };
  var k = "function" == typeof requestAnimationFrame;
  function w(n) {
    var t2, r2 = function() {
      clearTimeout(u2), k && cancelAnimationFrame(t2), setTimeout(n);
    }, u2 = setTimeout(r2, 100);
    k && (t2 = requestAnimationFrame(r2));
  }
  function z(n) {
    var t2 = r, u2 = n.__c;
    "function" == typeof u2 && (n.__c = void 0, u2()), r = t2;
  }
  function B$1(n) {
    var t2 = r;
    n.__c = n.__(), r = t2;
  }
  function C(n, t2) {
    return !n || n.length !== t2.length || t2.some(function(t3, r2) {
      return t3 !== n[r2];
    });
  }
  function D$1(n, t2) {
    return "function" == typeof t2 ? t2(n) : t2;
  }
  function g(n, t2) {
    for (var e2 in t2) n[e2] = t2[e2];
    return n;
  }
  function E(n, t2) {
    for (var e2 in n) if ("__source" !== e2 && !(e2 in t2)) return true;
    for (var r2 in t2) if ("__source" !== r2 && n[r2] !== t2[r2]) return true;
    return false;
  }
  function N(n, t2) {
    this.props = n, this.context = t2;
  }
  (N.prototype = new preact.Component()).isPureReactComponent = true, N.prototype.shouldComponentUpdate = function(n, t2) {
    return E(this.props, n) || E(this.state, t2);
  };
  var T = preact.options.__b;
  preact.options.__b = function(n) {
    n.type && n.type.__f && n.ref && (n.props.ref = n.ref, n.ref = null), T && T(n);
  };
  var A = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
  function D(n) {
    function t2(t3) {
      var e2 = g({}, t3);
      return delete e2.ref, n(e2, t3.ref || null);
    }
    return t2.$$typeof = A, t2.render = t2, t2.prototype.isReactComponent = t2.__f = true, t2.displayName = "ForwardRef(" + (n.displayName || n.name) + ")", t2;
  }
  var F = preact.options.__e;
  preact.options.__e = function(n, t2, e2, r2) {
    if (n.then) {
      for (var u2, o2 = t2; o2 = o2.__; ) if ((u2 = o2.__c) && u2.__c) return null == t2.__e && (t2.__e = e2.__e, t2.__k = e2.__k), u2.__c(n, t2);
    }
    F(n, t2, e2, r2);
  };
  var U = preact.options.unmount;
  function V(n, t2, e2) {
    return n && (n.__c && n.__c.__H && (n.__c.__H.__.forEach(function(n2) {
      "function" == typeof n2.__c && n2.__c();
    }), n.__c.__H = null), null != (n = g({}, n)).__c && (n.__c.__P === e2 && (n.__c.__P = t2), n.__c.__e = true, n.__c = null), n.__k = n.__k && n.__k.map(function(n2) {
      return V(n2, t2, e2);
    })), n;
  }
  function W(n, t2, e2) {
    return n && e2 && (n.__v = null, n.__k = n.__k && n.__k.map(function(n2) {
      return W(n2, t2, e2);
    }), n.__c && n.__c.__P === t2 && (n.__e && e2.appendChild(n.__e), n.__c.__e = true, n.__c.__P = e2)), n;
  }
  function P() {
    this.__u = 0, this.o = null, this.__b = null;
  }
  function j(n) {
    var t2 = n.__.__c;
    return t2 && t2.__a && t2.__a(n);
  }
  function B() {
    this.i = null, this.l = null;
  }
  preact.options.unmount = function(n) {
    var t2 = n.__c;
    t2 && t2.__R && t2.__R(), t2 && 32 & n.__u && (n.type = null), U && U(n);
  }, (P.prototype = new preact.Component()).__c = function(n, t2) {
    var e2 = t2.__c, r2 = this;
    null == r2.o && (r2.o = []), r2.o.push(e2);
    var u2 = j(r2.__v), o2 = false, i2 = function() {
      o2 || (o2 = true, e2.__R = null, u2 ? u2(c2) : c2());
    };
    e2.__R = i2;
    var c2 = function() {
      if (!--r2.__u) {
        if (r2.state.__a) {
          var n2 = r2.state.__a;
          r2.__v.__k[0] = W(n2, n2.__c.__P, n2.__c.__O);
        }
        var t3;
        for (r2.setState({ __a: r2.__b = null }); t3 = r2.o.pop(); ) t3.forceUpdate();
      }
    };
    r2.__u++ || 32 & t2.__u || r2.setState({ __a: r2.__b = r2.__v.__k[0] }), n.then(i2, i2);
  }, P.prototype.componentWillUnmount = function() {
    this.o = [];
  }, P.prototype.render = function(n, e2) {
    if (this.__b) {
      if (this.__v.__k) {
        var r2 = document.createElement("div"), o2 = this.__v.__k[0].__c;
        this.__v.__k[0] = V(this.__b, r2, o2.__O = o2.__P);
      }
      this.__b = null;
    }
    var i2 = e2.__a && preact.createElement(preact.Fragment, null, n.fallback);
    return i2 && (i2.__u &= -33), [preact.createElement(preact.Fragment, null, e2.__a ? null : n.children), i2];
  };
  var H = function(n, t2, e2) {
    if (++e2[1] === e2[0] && n.l.delete(t2), n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.l.size)) for (e2 = n.i; e2; ) {
      for (; e2.length > 3; ) e2.pop()();
      if (e2[1] < e2[0]) break;
      n.i = e2 = e2[2];
    }
  };
  (B.prototype = new preact.Component()).__a = function(n) {
    var t2 = this, e2 = j(t2.__v), r2 = t2.l.get(n);
    return r2[0]++, function(u2) {
      var o2 = function() {
        t2.props.revealOrder ? (r2.push(u2), H(t2, n, r2)) : u2();
      };
      e2 ? e2(o2) : o2();
    };
  }, B.prototype.render = function(n) {
    this.i = null, this.l = /* @__PURE__ */ new Map();
    var t2 = preact.toChildArray(n.children);
    n.revealOrder && "b" === n.revealOrder[0] && t2.reverse();
    for (var e2 = t2.length; e2--; ) this.l.set(t2[e2], this.i = [1, 0, this.i]);
    return n.children;
  }, B.prototype.componentDidUpdate = B.prototype.componentDidMount = function() {
    var n = this;
    this.l.forEach(function(t2, e2) {
      H(n, e2, t2);
    });
  };
  var q = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103, G = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, J = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, K = /[A-Z0-9]/g, Q = "undefined" != typeof document, X = function(n) {
    return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n);
  };
  preact.Component.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t2) {
    Object.defineProperty(preact.Component.prototype, t2, { configurable: true, get: function() {
      return this["UNSAFE_" + t2];
    }, set: function(n) {
      Object.defineProperty(this, t2, { configurable: true, writable: true, value: n });
    } });
  });
  var en = preact.options.event;
  function rn() {
  }
  function un() {
    return this.cancelBubble;
  }
  function on() {
    return this.defaultPrevented;
  }
  preact.options.event = function(n) {
    return en && (n = en(n)), n.persist = rn, n.isPropagationStopped = un, n.isDefaultPrevented = on, n.nativeEvent = n;
  };
  var ln = { enumerable: false, configurable: true, get: function() {
    return this.class;
  } }, fn = preact.options.vnode;
  preact.options.vnode = function(n) {
    "string" == typeof n.type && function(n2) {
      var t2 = n2.props, e2 = n2.type, u2 = {}, o2 = -1 === e2.indexOf("-");
      for (var i2 in t2) {
        var c2 = t2[i2];
        if (!("value" === i2 && "defaultValue" in t2 && null == c2 || Q && "children" === i2 && "noscript" === e2 || "class" === i2 || "className" === i2)) {
          var l2 = i2.toLowerCase();
          "defaultValue" === i2 && "value" in t2 && null == t2.value ? i2 = "value" : "download" === i2 && true === c2 ? c2 = "" : "translate" === l2 && "no" === c2 ? c2 = false : "o" === l2[0] && "n" === l2[1] ? "ondoubleclick" === l2 ? i2 = "ondblclick" : "onchange" !== l2 || "input" !== e2 && "textarea" !== e2 || X(t2.type) ? "onfocus" === l2 ? i2 = "onfocusin" : "onblur" === l2 ? i2 = "onfocusout" : J.test(i2) && (i2 = l2) : l2 = i2 = "oninput" : o2 && G.test(i2) ? i2 = i2.replace(K, "-$&").toLowerCase() : null === c2 && (c2 = void 0), "oninput" === l2 && u2[i2 = l2] && (i2 = "oninputCapture"), u2[i2] = c2;
        }
      }
      "select" == e2 && u2.multiple && Array.isArray(u2.value) && (u2.value = preact.toChildArray(t2.children).forEach(function(n3) {
        n3.props.selected = -1 != u2.value.indexOf(n3.props.value);
      })), "select" == e2 && null != u2.defaultValue && (u2.value = preact.toChildArray(t2.children).forEach(function(n3) {
        n3.props.selected = u2.multiple ? -1 != u2.defaultValue.indexOf(n3.props.value) : u2.defaultValue == n3.props.value;
      })), t2.class && !t2.className ? (u2.class = t2.class, Object.defineProperty(u2, "className", ln)) : (t2.className && !t2.class || t2.class && t2.className) && (u2.class = u2.className = t2.className), n2.props = u2;
    }(n), n.$$typeof = q, fn && fn(n);
  };
  var an = preact.options.__r;
  preact.options.__r = function(n) {
    an && an(n), n.__c;
  };
  var sn = preact.options.diffed;
  preact.options.diffed = function(n) {
    sn && sn(n);
    var t2 = n.props, e2 = n.__e;
    null != e2 && "textarea" === n.type && "value" in t2 && t2.value !== e2.value && (e2.value = null == t2.value ? "" : t2.value);
  };
  const defaultIconDimensions = Object.freeze(
    {
      left: 0,
      top: 0,
      width: 16,
      height: 16
    }
  );
  const defaultIconTransformations = Object.freeze({
    rotate: 0,
    vFlip: false,
    hFlip: false
  });
  const defaultIconProps = Object.freeze({
    ...defaultIconDimensions,
    ...defaultIconTransformations
  });
  const defaultExtendedIconProps = Object.freeze({
    ...defaultIconProps,
    body: "",
    hidden: false
  });
  function mergeIconTransformations(obj1, obj2) {
    const result = {};
    if (!obj1.hFlip !== !obj2.hFlip) {
      result.hFlip = true;
    }
    if (!obj1.vFlip !== !obj2.vFlip) {
      result.vFlip = true;
    }
    const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
    if (rotate) {
      result.rotate = rotate;
    }
    return result;
  }
  function mergeIconData(parent, child) {
    const result = mergeIconTransformations(parent, child);
    for (const key in defaultExtendedIconProps) {
      if (key in defaultIconTransformations) {
        if (key in parent && !(key in result)) {
          result[key] = defaultIconTransformations[key];
        }
      } else if (key in child) {
        result[key] = child[key];
      } else if (key in parent) {
        result[key] = parent[key];
      }
    }
    return result;
  }
  function getIconsTree(data, names) {
    const icons = data.icons;
    const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
    const resolved = /* @__PURE__ */ Object.create(null);
    function resolve(name) {
      if (icons[name]) {
        return resolved[name] = [];
      }
      if (!(name in resolved)) {
        resolved[name] = null;
        const parent = aliases[name] && aliases[name].parent;
        const value = parent && resolve(parent);
        if (value) {
          resolved[name] = [parent].concat(value);
        }
      }
      return resolved[name];
    }
    Object.keys(icons).concat(Object.keys(aliases)).forEach(resolve);
    return resolved;
  }
  function internalGetIconData(data, name, tree) {
    const icons = data.icons;
    const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
    let currentProps = {};
    function parse(name2) {
      currentProps = mergeIconData(
        icons[name2] || aliases[name2],
        currentProps
      );
    }
    parse(name);
    tree.forEach(parse);
    return mergeIconData(data, currentProps);
  }
  function parseIconSet(data, callback) {
    const names = [];
    if (typeof data !== "object" || typeof data.icons !== "object") {
      return names;
    }
    if (data.not_found instanceof Array) {
      data.not_found.forEach((name) => {
        callback(name, null);
        names.push(name);
      });
    }
    const tree = getIconsTree(data);
    for (const name in tree) {
      const item = tree[name];
      if (item) {
        callback(name, internalGetIconData(data, name, item));
        names.push(name);
      }
    }
    return names;
  }
  const optionalPropertyDefaults = {
    provider: "",
    aliases: {},
    not_found: {},
    ...defaultIconDimensions
  };
  function checkOptionalProps(item, defaults) {
    for (const prop in defaults) {
      if (prop in item && typeof item[prop] !== typeof defaults[prop]) {
        return false;
      }
    }
    return true;
  }
  function quicklyValidateIconSet(obj) {
    if (typeof obj !== "object" || obj === null) {
      return null;
    }
    const data = obj;
    if (typeof data.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") {
      return null;
    }
    if (!checkOptionalProps(obj, optionalPropertyDefaults)) {
      return null;
    }
    const icons = data.icons;
    for (const name in icons) {
      const icon = icons[name];
      if (
        // Name cannot be empty
        !name || // Must have body
        typeof icon.body !== "string" || // Check other props
        !checkOptionalProps(
          icon,
          defaultExtendedIconProps
        )
      ) {
        return null;
      }
    }
    const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
    for (const name in aliases) {
      const icon = aliases[name];
      const parent = icon.parent;
      if (
        // Name cannot be empty
        !name || // Parent must be set and point to existing icon
        typeof parent !== "string" || !icons[parent] && !aliases[parent] || // Check other props
        !checkOptionalProps(
          icon,
          defaultExtendedIconProps
        )
      ) {
        return null;
      }
    }
    return data;
  }
  const matchIconName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  const stringToIcon = (value, validate, allowSimpleName, provider = "") => {
    const colonSeparated = value.split(":");
    if (value.slice(0, 1) === "@") {
      if (colonSeparated.length < 2 || colonSeparated.length > 3) {
        return null;
      }
      provider = colonSeparated.shift().slice(1);
    }
    if (colonSeparated.length > 3 || !colonSeparated.length) {
      return null;
    }
    if (colonSeparated.length > 1) {
      const name2 = colonSeparated.pop();
      const prefix = colonSeparated.pop();
      const result = {
        // Allow provider without '@': "provider:prefix:name"
        provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
        prefix,
        name: name2
      };
      return validate && !validateIconName(result) ? null : result;
    }
    const name = colonSeparated[0];
    const dashSeparated = name.split("-");
    if (dashSeparated.length > 1) {
      const result = {
        provider,
        prefix: dashSeparated.shift(),
        name: dashSeparated.join("-")
      };
      return validate && !validateIconName(result) ? null : result;
    }
    if (allowSimpleName && provider === "") {
      const result = {
        provider,
        prefix: "",
        name
      };
      return validate && !validateIconName(result, allowSimpleName) ? null : result;
    }
    return null;
  };
  const validateIconName = (icon, allowSimpleName) => {
    if (!icon) {
      return false;
    }
    return !!// Check prefix: cannot be empty, unless allowSimpleName is enabled
    // Check name: cannot be empty
    ((allowSimpleName && icon.prefix === "" || !!icon.prefix) && !!icon.name);
  };
  const dataStorage = /* @__PURE__ */ Object.create(null);
  function newStorage(provider, prefix) {
    return {
      provider,
      prefix,
      icons: /* @__PURE__ */ Object.create(null),
      missing: /* @__PURE__ */ new Set()
    };
  }
  function getStorage(provider, prefix) {
    const providerStorage = dataStorage[provider] || (dataStorage[provider] = /* @__PURE__ */ Object.create(null));
    return providerStorage[prefix] || (providerStorage[prefix] = newStorage(provider, prefix));
  }
  function addIconSet(storage2, data) {
    if (!quicklyValidateIconSet(data)) {
      return [];
    }
    return parseIconSet(data, (name, icon) => {
      if (icon) {
        storage2.icons[name] = icon;
      } else {
        storage2.missing.add(name);
      }
    });
  }
  function addIconToStorage(storage2, name, icon) {
    try {
      if (typeof icon.body === "string") {
        storage2.icons[name] = { ...icon };
        return true;
      }
    } catch (err) {
    }
    return false;
  }
  let simpleNames = false;
  function allowSimpleNames(allow) {
    if (typeof allow === "boolean") {
      simpleNames = allow;
    }
    return simpleNames;
  }
  function getIconData(name) {
    const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
    if (icon) {
      const storage2 = getStorage(icon.provider, icon.prefix);
      const iconName = icon.name;
      return storage2.icons[iconName] || (storage2.missing.has(iconName) ? null : void 0);
    }
  }
  function addIcon(name, data) {
    const icon = stringToIcon(name, true, simpleNames);
    if (!icon) {
      return false;
    }
    const storage2 = getStorage(icon.provider, icon.prefix);
    if (data) {
      return addIconToStorage(storage2, icon.name, data);
    } else {
      storage2.missing.add(icon.name);
      return true;
    }
  }
  function addCollection(data, provider) {
    if (typeof data !== "object") {
      return false;
    }
    if (typeof provider !== "string") {
      provider = data.provider || "";
    }
    if (simpleNames && !provider && !data.prefix) {
      let added = false;
      if (quicklyValidateIconSet(data)) {
        data.prefix = "";
        parseIconSet(data, (name, icon) => {
          if (addIcon(name, icon)) {
            added = true;
          }
        });
      }
      return added;
    }
    const prefix = data.prefix;
    if (!validateIconName({
      prefix,
      name: "a"
    })) {
      return false;
    }
    const storage2 = getStorage(provider, prefix);
    return !!addIconSet(storage2, data);
  }
  const defaultIconSizeCustomisations = Object.freeze({
    width: null,
    height: null
  });
  const defaultIconCustomisations = Object.freeze({
    // Dimensions
    ...defaultIconSizeCustomisations,
    // Transformations
    ...defaultIconTransformations
  });
  const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
  const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
  function calculateSize(size, ratio, precision) {
    if (ratio === 1) {
      return size;
    }
    precision = precision || 100;
    if (typeof size === "number") {
      return Math.ceil(size * ratio * precision) / precision;
    }
    if (typeof size !== "string") {
      return size;
    }
    const oldParts = size.split(unitsSplit);
    if (oldParts === null || !oldParts.length) {
      return size;
    }
    const newParts = [];
    let code = oldParts.shift();
    let isNumber = unitsTest.test(code);
    while (true) {
      if (isNumber) {
        const num = parseFloat(code);
        if (isNaN(num)) {
          newParts.push(code);
        } else {
          newParts.push(Math.ceil(num * ratio * precision) / precision);
        }
      } else {
        newParts.push(code);
      }
      code = oldParts.shift();
      if (code === void 0) {
        return newParts.join("");
      }
      isNumber = !isNumber;
    }
  }
  function splitSVGDefs(content, tag = "defs") {
    let defs = "";
    const index = content.indexOf("<" + tag);
    while (index >= 0) {
      const start = content.indexOf(">", index);
      const end = content.indexOf("</" + tag);
      if (start === -1 || end === -1) {
        break;
      }
      const endEnd = content.indexOf(">", end);
      if (endEnd === -1) {
        break;
      }
      defs += content.slice(start + 1, end).trim();
      content = content.slice(0, index).trim() + content.slice(endEnd + 1);
    }
    return {
      defs,
      content
    };
  }
  function mergeDefsAndContent(defs, content) {
    return defs ? "<defs>" + defs + "</defs>" + content : content;
  }
  function wrapSVGContent(body, start, end) {
    const split = splitSVGDefs(body);
    return mergeDefsAndContent(split.defs, start + split.content + end);
  }
  const isUnsetKeyword = (value) => value === "unset" || value === "undefined" || value === "none";
  function iconToSVG(icon, customisations) {
    const fullIcon = {
      ...defaultIconProps,
      ...icon
    };
    const fullCustomisations = {
      ...defaultIconCustomisations,
      ...customisations
    };
    const box = {
      left: fullIcon.left,
      top: fullIcon.top,
      width: fullIcon.width,
      height: fullIcon.height
    };
    let body = fullIcon.body;
    [fullIcon, fullCustomisations].forEach((props) => {
      const transformations = [];
      const hFlip = props.hFlip;
      const vFlip = props.vFlip;
      let rotation = props.rotate;
      if (hFlip) {
        if (vFlip) {
          rotation += 2;
        } else {
          transformations.push(
            "translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")"
          );
          transformations.push("scale(-1 1)");
          box.top = box.left = 0;
        }
      } else if (vFlip) {
        transformations.push(
          "translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")"
        );
        transformations.push("scale(1 -1)");
        box.top = box.left = 0;
      }
      let tempValue;
      if (rotation < 0) {
        rotation -= Math.floor(rotation / 4) * 4;
      }
      rotation = rotation % 4;
      switch (rotation) {
        case 1:
          tempValue = box.height / 2 + box.top;
          transformations.unshift(
            "rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")"
          );
          break;
        case 2:
          transformations.unshift(
            "rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")"
          );
          break;
        case 3:
          tempValue = box.width / 2 + box.left;
          transformations.unshift(
            "rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")"
          );
          break;
      }
      if (rotation % 2 === 1) {
        if (box.left !== box.top) {
          tempValue = box.left;
          box.left = box.top;
          box.top = tempValue;
        }
        if (box.width !== box.height) {
          tempValue = box.width;
          box.width = box.height;
          box.height = tempValue;
        }
      }
      if (transformations.length) {
        body = wrapSVGContent(
          body,
          '<g transform="' + transformations.join(" ") + '">',
          "</g>"
        );
      }
    });
    const customisationsWidth = fullCustomisations.width;
    const customisationsHeight = fullCustomisations.height;
    const boxWidth = box.width;
    const boxHeight = box.height;
    let width;
    let height;
    if (customisationsWidth === null) {
      height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
      width = calculateSize(height, boxWidth / boxHeight);
    } else {
      width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
      height = customisationsHeight === null ? calculateSize(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
    }
    const attributes = {};
    const setAttr = (prop, value) => {
      if (!isUnsetKeyword(value)) {
        attributes[prop] = value.toString();
      }
    };
    setAttr("width", width);
    setAttr("height", height);
    const viewBox = [box.left, box.top, boxWidth, boxHeight];
    attributes.viewBox = viewBox.join(" ");
    return {
      attributes,
      viewBox,
      body
    };
  }
  const regex = /\sid="(\S+)"/g;
  const randomPrefix = "IconifyId" + Date.now().toString(16) + (Math.random() * 16777216 | 0).toString(16);
  let counter = 0;
  function replaceIDs(body, prefix = randomPrefix) {
    const ids = [];
    let match;
    while (match = regex.exec(body)) {
      ids.push(match[1]);
    }
    if (!ids.length) {
      return body;
    }
    const suffix = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
    ids.forEach((id) => {
      const newID = typeof prefix === "function" ? prefix(id) : prefix + (counter++).toString();
      const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      body = body.replace(
        // Allowed characters before id: [#;"]
        // Allowed characters after id: [)"], .[a-z]
        new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', "g"),
        "$1" + newID + suffix + "$3"
      );
    });
    body = body.replace(new RegExp(suffix, "g"), "");
    return body;
  }
  const storage = /* @__PURE__ */ Object.create(null);
  function setAPIModule(provider, item) {
    storage[provider] = item;
  }
  function getAPIModule(provider) {
    return storage[provider] || storage[""];
  }
  function createAPIConfig(source) {
    let resources;
    if (typeof source.resources === "string") {
      resources = [source.resources];
    } else {
      resources = source.resources;
      if (!(resources instanceof Array) || !resources.length) {
        return null;
      }
    }
    const result = {
      // API hosts
      resources,
      // Root path
      path: source.path || "/",
      // URL length limit
      maxURL: source.maxURL || 500,
      // Timeout before next host is used.
      rotate: source.rotate || 750,
      // Timeout before failing query.
      timeout: source.timeout || 5e3,
      // Randomise default API end point.
      random: source.random === true,
      // Start index
      index: source.index || 0,
      // Receive data after time out (used if time out kicks in first, then API module sends data anyway).
      dataAfterTimeout: source.dataAfterTimeout !== false
    };
    return result;
  }
  const configStorage = /* @__PURE__ */ Object.create(null);
  const fallBackAPISources = [
    "https://api.simplesvg.com",
    "https://api.unisvg.com"
  ];
  const fallBackAPI = [];
  while (fallBackAPISources.length > 0) {
    if (fallBackAPISources.length === 1) {
      fallBackAPI.push(fallBackAPISources.shift());
    } else {
      if (Math.random() > 0.5) {
        fallBackAPI.push(fallBackAPISources.shift());
      } else {
        fallBackAPI.push(fallBackAPISources.pop());
      }
    }
  }
  configStorage[""] = createAPIConfig({
    resources: ["https://api.iconify.design"].concat(fallBackAPI)
  });
  function addAPIProvider(provider, customConfig) {
    const config = createAPIConfig(customConfig);
    if (config === null) {
      return false;
    }
    configStorage[provider] = config;
    return true;
  }
  function getAPIConfig(provider) {
    return configStorage[provider];
  }
  const detectFetch = () => {
    let callback;
    try {
      callback = fetch;
      if (typeof callback === "function") {
        return callback;
      }
    } catch (err) {
    }
  };
  let fetchModule = detectFetch();
  function calculateMaxLength(provider, prefix) {
    const config = getAPIConfig(provider);
    if (!config) {
      return 0;
    }
    let result;
    if (!config.maxURL) {
      result = 0;
    } else {
      let maxHostLength = 0;
      config.resources.forEach((item) => {
        const host = item;
        maxHostLength = Math.max(maxHostLength, host.length);
      });
      const url = prefix + ".json?icons=";
      result = config.maxURL - maxHostLength - config.path.length - url.length;
    }
    return result;
  }
  function shouldAbort(status) {
    return status === 404;
  }
  const prepare = (provider, prefix, icons) => {
    const results = [];
    const maxLength = calculateMaxLength(provider, prefix);
    const type = "icons";
    let item = {
      type,
      provider,
      prefix,
      icons: []
    };
    let length = 0;
    icons.forEach((name, index) => {
      length += name.length + 1;
      if (length >= maxLength && index > 0) {
        results.push(item);
        item = {
          type,
          provider,
          prefix,
          icons: []
        };
        length = name.length;
      }
      item.icons.push(name);
    });
    results.push(item);
    return results;
  };
  function getPath(provider) {
    if (typeof provider === "string") {
      const config = getAPIConfig(provider);
      if (config) {
        return config.path;
      }
    }
    return "/";
  }
  const send = (host, params, callback) => {
    if (!fetchModule) {
      callback("abort", 424);
      return;
    }
    let path = getPath(params.provider);
    switch (params.type) {
      case "icons": {
        const prefix = params.prefix;
        const icons = params.icons;
        const iconsList = icons.join(",");
        const urlParams = new URLSearchParams({
          icons: iconsList
        });
        path += prefix + ".json?" + urlParams.toString();
        break;
      }
      case "custom": {
        const uri = params.uri;
        path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
        break;
      }
      default:
        callback("abort", 400);
        return;
    }
    let defaultError = 503;
    fetchModule(host + path).then((response) => {
      const status = response.status;
      if (status !== 200) {
        setTimeout(() => {
          callback(shouldAbort(status) ? "abort" : "next", status);
        });
        return;
      }
      defaultError = 501;
      return response.json();
    }).then((data) => {
      if (typeof data !== "object" || data === null) {
        setTimeout(() => {
          if (data === 404) {
            callback("abort", data);
          } else {
            callback("next", defaultError);
          }
        });
        return;
      }
      setTimeout(() => {
        callback("success", data);
      });
    }).catch(() => {
      callback("next", defaultError);
    });
  };
  const fetchAPIModule = {
    prepare,
    send
  };
  function sortIcons(icons) {
    const result = {
      loaded: [],
      missing: [],
      pending: []
    };
    const storage2 = /* @__PURE__ */ Object.create(null);
    icons.sort((a2, b) => {
      if (a2.provider !== b.provider) {
        return a2.provider.localeCompare(b.provider);
      }
      if (a2.prefix !== b.prefix) {
        return a2.prefix.localeCompare(b.prefix);
      }
      return a2.name.localeCompare(b.name);
    });
    let lastIcon = {
      provider: "",
      prefix: "",
      name: ""
    };
    icons.forEach((icon) => {
      if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) {
        return;
      }
      lastIcon = icon;
      const provider = icon.provider;
      const prefix = icon.prefix;
      const name = icon.name;
      const providerStorage = storage2[provider] || (storage2[provider] = /* @__PURE__ */ Object.create(null));
      const localStorage = providerStorage[prefix] || (providerStorage[prefix] = getStorage(provider, prefix));
      let list;
      if (name in localStorage.icons) {
        list = result.loaded;
      } else if (prefix === "" || localStorage.missing.has(name)) {
        list = result.missing;
      } else {
        list = result.pending;
      }
      const item = {
        provider,
        prefix,
        name
      };
      list.push(item);
    });
    return result;
  }
  function removeCallback(storages, id) {
    storages.forEach((storage2) => {
      const items = storage2.loaderCallbacks;
      if (items) {
        storage2.loaderCallbacks = items.filter((row) => row.id !== id);
      }
    });
  }
  function updateCallbacks(storage2) {
    if (!storage2.pendingCallbacksFlag) {
      storage2.pendingCallbacksFlag = true;
      setTimeout(() => {
        storage2.pendingCallbacksFlag = false;
        const items = storage2.loaderCallbacks ? storage2.loaderCallbacks.slice(0) : [];
        if (!items.length) {
          return;
        }
        let hasPending = false;
        const provider = storage2.provider;
        const prefix = storage2.prefix;
        items.forEach((item) => {
          const icons = item.icons;
          const oldLength = icons.pending.length;
          icons.pending = icons.pending.filter((icon) => {
            if (icon.prefix !== prefix) {
              return true;
            }
            const name = icon.name;
            if (storage2.icons[name]) {
              icons.loaded.push({
                provider,
                prefix,
                name
              });
            } else if (storage2.missing.has(name)) {
              icons.missing.push({
                provider,
                prefix,
                name
              });
            } else {
              hasPending = true;
              return true;
            }
            return false;
          });
          if (icons.pending.length !== oldLength) {
            if (!hasPending) {
              removeCallback([storage2], item.id);
            }
            item.callback(
              icons.loaded.slice(0),
              icons.missing.slice(0),
              icons.pending.slice(0),
              item.abort
            );
          }
        });
      });
    }
  }
  let idCounter = 0;
  function storeCallback(callback, icons, pendingSources) {
    const id = idCounter++;
    const abort = removeCallback.bind(null, pendingSources, id);
    if (!icons.pending.length) {
      return abort;
    }
    const item = {
      id,
      icons,
      callback,
      abort
    };
    pendingSources.forEach((storage2) => {
      (storage2.loaderCallbacks || (storage2.loaderCallbacks = [])).push(item);
    });
    return abort;
  }
  function listToIcons(list, validate = true, simpleNames2 = false) {
    const result = [];
    list.forEach((item) => {
      const icon = typeof item === "string" ? stringToIcon(item, validate, simpleNames2) : item;
      if (icon) {
        result.push(icon);
      }
    });
    return result;
  }
  var defaultConfig = {
    resources: [],
    index: 0,
    timeout: 2e3,
    rotate: 750,
    random: false,
    dataAfterTimeout: false
  };
  function sendQuery(config, payload, query, done) {
    const resourcesCount = config.resources.length;
    const startIndex = config.random ? Math.floor(Math.random() * resourcesCount) : config.index;
    let resources;
    if (config.random) {
      let list = config.resources.slice(0);
      resources = [];
      while (list.length > 1) {
        const nextIndex = Math.floor(Math.random() * list.length);
        resources.push(list[nextIndex]);
        list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
      }
      resources = resources.concat(list);
    } else {
      resources = config.resources.slice(startIndex).concat(config.resources.slice(0, startIndex));
    }
    const startTime = Date.now();
    let status = "pending";
    let queriesSent = 0;
    let lastError;
    let timer = null;
    let queue = [];
    let doneCallbacks = [];
    if (typeof done === "function") {
      doneCallbacks.push(done);
    }
    function resetTimer() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }
    function abort() {
      if (status === "pending") {
        status = "aborted";
      }
      resetTimer();
      queue.forEach((item) => {
        if (item.status === "pending") {
          item.status = "aborted";
        }
      });
      queue = [];
    }
    function subscribe(callback, overwrite) {
      if (overwrite) {
        doneCallbacks = [];
      }
      if (typeof callback === "function") {
        doneCallbacks.push(callback);
      }
    }
    function getQueryStatus() {
      return {
        startTime,
        payload,
        status,
        queriesSent,
        queriesPending: queue.length,
        subscribe,
        abort
      };
    }
    function failQuery() {
      status = "failed";
      doneCallbacks.forEach((callback) => {
        callback(void 0, lastError);
      });
    }
    function clearQueue() {
      queue.forEach((item) => {
        if (item.status === "pending") {
          item.status = "aborted";
        }
      });
      queue = [];
    }
    function moduleResponse(item, response, data) {
      const isError = response !== "success";
      queue = queue.filter((queued) => queued !== item);
      switch (status) {
        case "pending":
          break;
        case "failed":
          if (isError || !config.dataAfterTimeout) {
            return;
          }
          break;
        default:
          return;
      }
      if (response === "abort") {
        lastError = data;
        failQuery();
        return;
      }
      if (isError) {
        lastError = data;
        if (!queue.length) {
          if (!resources.length) {
            failQuery();
          } else {
            execNext();
          }
        }
        return;
      }
      resetTimer();
      clearQueue();
      if (!config.random) {
        const index = config.resources.indexOf(item.resource);
        if (index !== -1 && index !== config.index) {
          config.index = index;
        }
      }
      status = "completed";
      doneCallbacks.forEach((callback) => {
        callback(data);
      });
    }
    function execNext() {
      if (status !== "pending") {
        return;
      }
      resetTimer();
      const resource = resources.shift();
      if (resource === void 0) {
        if (queue.length) {
          timer = setTimeout(() => {
            resetTimer();
            if (status === "pending") {
              clearQueue();
              failQuery();
            }
          }, config.timeout);
          return;
        }
        failQuery();
        return;
      }
      const item = {
        status: "pending",
        resource,
        callback: (status2, data) => {
          moduleResponse(item, status2, data);
        }
      };
      queue.push(item);
      queriesSent++;
      timer = setTimeout(execNext, config.rotate);
      query(resource, payload, item.callback);
    }
    setTimeout(execNext);
    return getQueryStatus;
  }
  function initRedundancy(cfg) {
    const config = {
      ...defaultConfig,
      ...cfg
    };
    let queries = [];
    function cleanup() {
      queries = queries.filter((item) => item().status === "pending");
    }
    function query(payload, queryCallback, doneCallback) {
      const query2 = sendQuery(
        config,
        payload,
        queryCallback,
        (data, error) => {
          cleanup();
          if (doneCallback) {
            doneCallback(data, error);
          }
        }
      );
      queries.push(query2);
      return query2;
    }
    function find(callback) {
      return queries.find((value) => {
        return callback(value);
      }) || null;
    }
    const instance = {
      query,
      find,
      setIndex: (index) => {
        config.index = index;
      },
      getIndex: () => config.index,
      cleanup
    };
    return instance;
  }
  function emptyCallback$1() {
  }
  const redundancyCache = /* @__PURE__ */ Object.create(null);
  function getRedundancyCache(provider) {
    if (!redundancyCache[provider]) {
      const config = getAPIConfig(provider);
      if (!config) {
        return;
      }
      const redundancy = initRedundancy(config);
      const cachedReundancy = {
        config,
        redundancy
      };
      redundancyCache[provider] = cachedReundancy;
    }
    return redundancyCache[provider];
  }
  function sendAPIQuery(target, query, callback) {
    let redundancy;
    let send2;
    if (typeof target === "string") {
      const api = getAPIModule(target);
      if (!api) {
        callback(void 0, 424);
        return emptyCallback$1;
      }
      send2 = api.send;
      const cached = getRedundancyCache(target);
      if (cached) {
        redundancy = cached.redundancy;
      }
    } else {
      const config = createAPIConfig(target);
      if (config) {
        redundancy = initRedundancy(config);
        const moduleKey = target.resources ? target.resources[0] : "";
        const api = getAPIModule(moduleKey);
        if (api) {
          send2 = api.send;
        }
      }
    }
    if (!redundancy || !send2) {
      callback(void 0, 424);
      return emptyCallback$1;
    }
    return redundancy.query(query, send2, callback)().abort;
  }
  function emptyCallback() {
  }
  function loadedNewIcons(storage2) {
    if (!storage2.iconsLoaderFlag) {
      storage2.iconsLoaderFlag = true;
      setTimeout(() => {
        storage2.iconsLoaderFlag = false;
        updateCallbacks(storage2);
      });
    }
  }
  function checkIconNamesForAPI(icons) {
    const valid = [];
    const invalid = [];
    icons.forEach((name) => {
      (name.match(matchIconName) ? valid : invalid).push(name);
    });
    return {
      valid,
      invalid
    };
  }
  function parseLoaderResponse(storage2, icons, data) {
    function checkMissing() {
      const pending = storage2.pendingIcons;
      icons.forEach((name) => {
        if (pending) {
          pending.delete(name);
        }
        if (!storage2.icons[name]) {
          storage2.missing.add(name);
        }
      });
    }
    if (data && typeof data === "object") {
      try {
        const parsed = addIconSet(storage2, data);
        if (!parsed.length) {
          checkMissing();
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }
    checkMissing();
    loadedNewIcons(storage2);
  }
  function parsePossiblyAsyncResponse(response, callback) {
    if (response instanceof Promise) {
      response.then((data) => {
        callback(data);
      }).catch(() => {
        callback(null);
      });
    } else {
      callback(response);
    }
  }
  function loadNewIcons(storage2, icons) {
    if (!storage2.iconsToLoad) {
      storage2.iconsToLoad = icons;
    } else {
      storage2.iconsToLoad = storage2.iconsToLoad.concat(icons).sort();
    }
    if (!storage2.iconsQueueFlag) {
      storage2.iconsQueueFlag = true;
      setTimeout(() => {
        storage2.iconsQueueFlag = false;
        const { provider, prefix } = storage2;
        const icons2 = storage2.iconsToLoad;
        delete storage2.iconsToLoad;
        if (!icons2 || !icons2.length) {
          return;
        }
        const customIconLoader = storage2.loadIcon;
        if (storage2.loadIcons && (icons2.length > 1 || !customIconLoader)) {
          parsePossiblyAsyncResponse(
            storage2.loadIcons(icons2, prefix, provider),
            (data) => {
              parseLoaderResponse(storage2, icons2, data);
            }
          );
          return;
        }
        if (customIconLoader) {
          icons2.forEach((name) => {
            const response = customIconLoader(name, prefix, provider);
            parsePossiblyAsyncResponse(response, (data) => {
              const iconSet = data ? {
                prefix,
                icons: {
                  [name]: data
                }
              } : null;
              parseLoaderResponse(storage2, [name], iconSet);
            });
          });
          return;
        }
        const { valid, invalid } = checkIconNamesForAPI(icons2);
        if (invalid.length) {
          parseLoaderResponse(storage2, invalid, null);
        }
        if (!valid.length) {
          return;
        }
        const api = prefix.match(matchIconName) ? getAPIModule(provider) : null;
        if (!api) {
          parseLoaderResponse(storage2, valid, null);
          return;
        }
        const params = api.prepare(provider, prefix, valid);
        params.forEach((item) => {
          sendAPIQuery(provider, item, (data) => {
            parseLoaderResponse(storage2, item.icons, data);
          });
        });
      });
    }
  }
  const loadIcons = (icons, callback) => {
    const cleanedIcons = listToIcons(icons, true, allowSimpleNames());
    const sortedIcons = sortIcons(cleanedIcons);
    if (!sortedIcons.pending.length) {
      let callCallback = true;
      if (callback) {
        setTimeout(() => {
          if (callCallback) {
            callback(
              sortedIcons.loaded,
              sortedIcons.missing,
              sortedIcons.pending,
              emptyCallback
            );
          }
        });
      }
      return () => {
        callCallback = false;
      };
    }
    const newIcons = /* @__PURE__ */ Object.create(null);
    const sources = [];
    let lastProvider, lastPrefix;
    sortedIcons.pending.forEach((icon) => {
      const { provider, prefix } = icon;
      if (prefix === lastPrefix && provider === lastProvider) {
        return;
      }
      lastProvider = provider;
      lastPrefix = prefix;
      sources.push(getStorage(provider, prefix));
      const providerNewIcons = newIcons[provider] || (newIcons[provider] = /* @__PURE__ */ Object.create(null));
      if (!providerNewIcons[prefix]) {
        providerNewIcons[prefix] = [];
      }
    });
    sortedIcons.pending.forEach((icon) => {
      const { provider, prefix, name } = icon;
      const storage2 = getStorage(provider, prefix);
      const pendingQueue = storage2.pendingIcons || (storage2.pendingIcons = /* @__PURE__ */ new Set());
      if (!pendingQueue.has(name)) {
        pendingQueue.add(name);
        newIcons[provider][prefix].push(name);
      }
    });
    sources.forEach((storage2) => {
      const list = newIcons[storage2.provider][storage2.prefix];
      if (list.length) {
        loadNewIcons(storage2, list);
      }
    });
    return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
  };
  function mergeCustomisations(defaults, item) {
    const result = {
      ...defaults
    };
    for (const key in item) {
      const value = item[key];
      const valueType = typeof value;
      if (key in defaultIconSizeCustomisations) {
        if (value === null || value && (valueType === "string" || valueType === "number")) {
          result[key] = value;
        }
      } else if (valueType === typeof result[key]) {
        result[key] = key === "rotate" ? value % 4 : value;
      }
    }
    return result;
  }
  const separator = /[\s,]+/;
  function flipFromString(custom, flip) {
    flip.split(separator).forEach((str) => {
      const value = str.trim();
      switch (value) {
        case "horizontal":
          custom.hFlip = true;
          break;
        case "vertical":
          custom.vFlip = true;
          break;
      }
    });
  }
  function rotateFromString(value, defaultValue = 0) {
    const units = value.replace(/^-?[0-9.]*/, "");
    function cleanup(value2) {
      while (value2 < 0) {
        value2 += 4;
      }
      return value2 % 4;
    }
    if (units === "") {
      const num = parseInt(value);
      return isNaN(num) ? 0 : cleanup(num);
    } else if (units !== value) {
      let split = 0;
      switch (units) {
        case "%":
          split = 25;
          break;
        case "deg":
          split = 90;
      }
      if (split) {
        let num = parseFloat(value.slice(0, value.length - units.length));
        if (isNaN(num)) {
          return 0;
        }
        num = num / split;
        return num % 1 === 0 ? cleanup(num) : 0;
      }
    }
    return defaultValue;
  }
  function iconToHTML(body, attributes) {
    let renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
    for (const attr in attributes) {
      renderAttribsHTML += " " + attr + '="' + attributes[attr] + '"';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg"' + renderAttribsHTML + ">" + body + "</svg>";
  }
  function encodeSVGforURL(svg) {
    return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
  }
  function svgToData(svg) {
    return "data:image/svg+xml," + encodeSVGforURL(svg);
  }
  function svgToURL(svg) {
    return 'url("' + svgToData(svg) + '")';
  }
  let policy;
  function createPolicy() {
    try {
      policy = window.trustedTypes.createPolicy("iconify", {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        createHTML: (s2) => s2
      });
    } catch (err) {
      policy = null;
    }
  }
  function cleanUpInnerHTML(html) {
    if (policy === void 0) {
      createPolicy();
    }
    return policy ? policy.createHTML(html) : html;
  }
  const defaultExtendedIconCustomisations = {
    ...defaultIconCustomisations,
    inline: false
  };
  const svgDefaults = {
    "xmlns": "http://www.w3.org/2000/svg",
    "xmlnsXlink": "http://www.w3.org/1999/xlink",
    "aria-hidden": true,
    "role": "img"
  };
  const commonProps = {
    display: "inline-block"
  };
  const monotoneProps = {
    backgroundColor: "currentColor"
  };
  const coloredProps = {
    backgroundColor: "transparent"
  };
  const propsToAdd = {
    Image: "var(--svg)",
    Repeat: "no-repeat",
    Size: "100% 100%"
  };
  const propsToAddTo = {
    WebkitMask: monotoneProps,
    mask: monotoneProps,
    background: coloredProps
  };
  for (const prefix in propsToAddTo) {
    const list = propsToAddTo[prefix];
    for (const prop in propsToAdd) {
      list[prefix + prop] = propsToAdd[prop];
    }
  }
  const inlineDefaults = {
    ...defaultExtendedIconCustomisations,
    inline: true
  };
  function fixSize(value) {
    return value + (value.match(/^[-0-9.]+$/) ? "px" : "");
  }
  const render = (icon, props, name) => {
    const defaultProps = props.inline ? inlineDefaults : defaultExtendedIconCustomisations;
    const customisations = mergeCustomisations(defaultProps, props);
    const mode = props.mode || "svg";
    const style2 = {};
    const customStyle = props.style || {};
    const componentProps = {
      ...mode === "svg" ? svgDefaults : {}
    };
    if (name) {
      const iconName = stringToIcon(name, false, true);
      if (iconName) {
        const classNames = ["iconify"];
        const props2 = [
          "provider",
          "prefix"
        ];
        for (const prop of props2) {
          if (iconName[prop]) {
            classNames.push("iconify--" + iconName[prop]);
          }
        }
        componentProps.className = classNames.join(" ");
      }
    }
    for (let key in props) {
      const value = props[key];
      if (value === void 0) {
        continue;
      }
      switch (key) {
        // Properties to ignore
        case "icon":
        case "style":
        case "children":
        case "onLoad":
        case "mode":
        case "ssr":
          break;
        // Forward ref
        case "_ref":
          componentProps.ref = value;
          break;
        // Merge class names
        case "className":
          componentProps[key] = (componentProps[key] ? componentProps[key] + " " : "") + value;
          break;
        // Boolean attributes
        case "inline":
        case "hFlip":
        case "vFlip":
          customisations[key] = value === true || value === "true" || value === 1;
          break;
        // Flip as string: 'horizontal,vertical'
        case "flip":
          if (typeof value === "string") {
            flipFromString(customisations, value);
          }
          break;
        // Color: copy to style
        case "color":
          style2.color = value;
          break;
        // Rotation as string
        case "rotate":
          if (typeof value === "string") {
            customisations[key] = rotateFromString(value);
          } else if (typeof value === "number") {
            customisations[key] = value;
          }
          break;
        // Remove aria-hidden
        case "ariaHidden":
        case "aria-hidden":
          if (value !== true && value !== "true") {
            delete componentProps["aria-hidden"];
          }
          break;
        // Copy missing property if it does not exist in customisations
        default:
          if (defaultProps[key] === void 0) {
            componentProps[key] = value;
          }
      }
    }
    const item = iconToSVG(icon, customisations);
    const renderAttribs = item.attributes;
    if (customisations.inline) {
      style2.verticalAlign = "-0.125em";
    }
    if (mode === "svg") {
      componentProps.style = {
        ...style2,
        ...customStyle
      };
      Object.assign(componentProps, renderAttribs);
      let localCounter = 0;
      let id = props.id;
      if (typeof id === "string") {
        id = id.replace(/-/g, "_");
      }
      componentProps.dangerouslySetInnerHTML = {
        __html: cleanUpInnerHTML(replaceIDs(item.body, id ? () => id + "ID" + localCounter++ : "iconifyReact"))
      };
      return preact.createElement("svg", componentProps);
    }
    const { body, width, height } = icon;
    const useMask = mode === "mask" || (mode === "bg" ? false : body.indexOf("currentColor") !== -1);
    const html = iconToHTML(body, {
      ...renderAttribs,
      width: width + "",
      height: height + ""
    });
    componentProps.style = {
      ...style2,
      "--svg": svgToURL(html),
      "width": fixSize(renderAttribs.width),
      "height": fixSize(renderAttribs.height),
      ...commonProps,
      ...useMask ? monotoneProps : coloredProps,
      ...customStyle
    };
    return preact.createElement("span", componentProps);
  };
  allowSimpleNames(true);
  setAPIModule("", fetchAPIModule);
  if (typeof document !== "undefined" && typeof window !== "undefined") {
    const _window = window;
    if (_window.IconifyPreload !== void 0) {
      const preload = _window.IconifyPreload;
      const err = "Invalid IconifyPreload syntax.";
      if (typeof preload === "object" && preload !== null) {
        (preload instanceof Array ? preload : [preload]).forEach((item) => {
          try {
            if (
              // Check if item is an object and not null/array
              typeof item !== "object" || item === null || item instanceof Array || // Check for 'icons' and 'prefix'
              typeof item.icons !== "object" || typeof item.prefix !== "string" || // Add icon set
              !addCollection(item)
            ) {
              console.error(err);
            }
          } catch (e2) {
            console.error(err);
          }
        });
      }
    }
    if (_window.IconifyProviders !== void 0) {
      const providers = _window.IconifyProviders;
      if (typeof providers === "object" && providers !== null) {
        for (let key in providers) {
          const err = "IconifyProviders[" + key + "] is invalid.";
          try {
            const value = providers[key];
            if (typeof value !== "object" || !value || value.resources === void 0) {
              continue;
            }
            if (!addAPIProvider(key, value)) {
              console.error(err);
            }
          } catch (e2) {
            console.error(err);
          }
        }
      }
    }
  }
  function IconComponent(props) {
    const [mounted, setMounted] = d(!!props.ssr);
    const [abort, setAbort] = d({});
    function getInitialState(mounted2) {
      if (mounted2) {
        const name2 = props.icon;
        if (typeof name2 === "object") {
          return {
            name: "",
            data: name2
          };
        }
        const data2 = getIconData(name2);
        if (data2) {
          return {
            name: name2,
            data: data2
          };
        }
      }
      return {
        name: ""
      };
    }
    const [state, setState] = d(getInitialState(!!props.ssr));
    function cleanup() {
      const callback = abort.callback;
      if (callback) {
        callback();
        setAbort({});
      }
    }
    function changeState(newState) {
      if (JSON.stringify(state) !== JSON.stringify(newState)) {
        cleanup();
        setState(newState);
        return true;
      }
    }
    function updateState() {
      var _a2;
      const name2 = props.icon;
      if (typeof name2 === "object") {
        changeState({
          name: "",
          data: name2
        });
        return;
      }
      const data2 = getIconData(name2);
      if (changeState({
        name: name2,
        data: data2
      })) {
        if (data2 === void 0) {
          const callback = loadIcons([name2], updateState);
          setAbort({
            callback
          });
        } else if (data2) {
          (_a2 = props.onLoad) === null || _a2 === void 0 ? void 0 : _a2.call(props, name2);
        }
      }
    }
    y(() => {
      setMounted(true);
      return cleanup;
    }, []);
    y(() => {
      if (mounted) {
        updateState();
      }
    }, [props.icon, mounted]);
    const { name, data } = state;
    if (!data) {
      return props.children ? props.children : props.fallback ? props.fallback : preact.createElement("span", {});
    }
    return render({
      ...defaultIconProps,
      ...data
    }, props, name);
  }
  const Icon = D((props, ref) => IconComponent({
    ...props,
    _ref: ref
  }));
  D((props, ref) => IconComponent({
    inline: true,
    ...props,
    _ref: ref
  }));
  const SettingsContext = preact.createContext({
    isOpen: false,
    open: () => {
    },
    close: () => {
    }
  });
  const SettingsProvider = ({ children }) => {
    const [isOpen, setOpen] = d(false);
    const open = () => {
      if (!isOpen) {
        setOpen(true);
        document.body.style.overflow = "hidden";
      }
    };
    const close = () => {
      if (isOpen) {
        setOpen(false);
        document.body.style.overflow = "";
      }
    };
    return /* @__PURE__ */ u$1(SettingsContext.Provider, { value: { isOpen, open, close }, children });
  };
  const ThemeContext = preact.createContext({
    theme: "light"
  });
  const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = d(getPageTheme());
    y(() => {
      const bodyObserver = DOMObserver.getInstance({ baseNode: document.body });
      const subscriber = bodyObserver.subscribe({
        selector: null,
        onAttribute: ({ node, attributeName }) => {
          if (node === document.body && attributeName === "class") {
            setTheme(getPageTheme());
          }
        }
      });
      return () => {
        subscriber.unsubscribe();
      };
    });
    return /* @__PURE__ */ u$1(ThemeContext.Provider, { value: { theme }, children });
  };
  const getPageTheme = () => {
    if (document.body.classList.contains("is-darkmode")) {
      return "dark";
    }
    return "light";
  };
  const AppProviders = ({ children }) => {
    return /* @__PURE__ */ u$1(ThemeProvider, { children: /* @__PURE__ */ u$1(SettingsProvider, { children }) });
  };
  const toolbarWrap = "_toolbarWrap_8mzlf_1";
  const toolbar = "_toolbar_8mzlf_1";
  const button = "_button_8mzlf_15";
  const style$1 = {
    toolbarWrap,
    toolbar,
    button
  };
  const ICON_SIZE = 20;
  const FloatingToolbar = () => {
    const settingsContext = x(SettingsContext);
    const scrollToTop = () => {
      scroll({ top: 0, behavior: "smooth" });
    };
    return /* @__PURE__ */ u$1("div", { className: style$1.toolbarWrap, children: /* @__PURE__ */ u$1("div", { className: style$1.toolbar, children: [
      /* @__PURE__ */ u$1("button", { type: "button", class: style$1.button, onClick: settingsContext.open, children: /* @__PURE__ */ u$1(Icon, { icon: "tabler:settings", width: ICON_SIZE, height: ICON_SIZE }) }),
      /* @__PURE__ */ u$1("button", { type: "button", class: style$1.button, onClick: scrollToTop, children: /* @__PURE__ */ u$1(Icon, { icon: "carbon:up-to-top", width: ICON_SIZE, height: ICON_SIZE }) })
    ] }) });
  };
  const popupWrap = "_popupWrap_y8a68_1";
  const popup = "_popup_y8a68_1";
  const popupHeader = "_popupHeader_y8a68_22";
  const popupTitle = "_popupTitle_y8a68_28";
  const closeButton = "_closeButton_y8a68_31";
  const style = {
    popupWrap,
    popup,
    popupHeader,
    popupTitle,
    closeButton
  };
  const SettingsPanel = () => {
    const settingsContext = x(SettingsContext);
    const onClose = () => {
      settingsContext.close();
    };
    return /* @__PURE__ */ u$1(preact.Fragment, { children: settingsContext.isOpen && /* @__PURE__ */ u$1("div", { className: style.popupWrap, children: /* @__PURE__ */ u$1("div", { className: style.popup, children: [
      /* @__PURE__ */ u$1("div", { className: style.popupHeader, children: [
        /* @__PURE__ */ u$1("div", { className: style.popupTitle, children: "설정" }),
        /* @__PURE__ */ u$1("button", { type: "button", onClick: onClose, className: style.closeButton, children: /* @__PURE__ */ u$1(Icon, { icon: "material-symbols-light:close", width: 28, height: 28 }) })
      ] }),
      /* @__PURE__ */ u$1("div", { className: style.popupContents, children: /* @__PURE__ */ u$1("div", { children: "구현 예정" }) })
    ] }) }) });
  };
  const App = () => {
    const themeContext = x(ThemeContext);
    return /* @__PURE__ */ u$1("div", { id: "us_n_dict_wrap", "data-theme": themeContext.theme, children: [
      /* @__PURE__ */ u$1(SettingsPanel, {}),
      /* @__PURE__ */ u$1(FloatingToolbar, {})
    ] });
  };
  let isInitialized$1 = false;
  const initHanjaInfoPage = () => {
    if (!isInitialized$1) {
      const domObserver = DOMObserver.getInstance();
      domObserver.subscribe({
        selector: '[lang*="ko"]',
        onAdd: ({ node }) => {
          if (!node.dataset.naverDictCustomCorrection) {
            if (node.matches(".section_hanja_info ul.hanja_list > li.hanja_item .hanja_word")) {
              const descEl = node.nextElementSibling;
              if (descEl instanceof HTMLElement && descEl.matches(".desc")) {
                if (descEl.innerText.includes("일본자")) {
                  node.lang = "ja";
                  node.dataset.naverDictCustomCorrection = "true";
                } else if (descEl.innerText.includes("간체자")) {
                  node.lang = "zh-CN";
                  node.dataset.naverDictCustomCorrection = "true";
                }
              }
            }
          }
        },
        deep: {
          add: "all"
        }
      });
      isInitialized$1 = true;
    }
  };
  const styleCssText = ':root{--font-sans-ko: "Noto Sans CJK KR", "Noto Sans KR", sans-serif;--font-serif-ko: "Noto Serif CJK KR", "Noto Serif KR", var(--font-serif-zh-fallback), serif;--font-sans-ja: "Noto Sans CJK JP", "Noto Sans JP", sans-serif;--font-serif-ja: "Noto Serif CJK JP", "Noto Serif JP", var(--font-serif-zh-fallback), serif;--font-sans-zh-cn: "Noto Sans CJK SC", "Noto Sans SC", sans-serif;--font-serif-zh-cn: "Noto Serif CJK SC", "Noto Serif SC", var(--font-serif-zh-fallback), serif;--font-serif-zh-fallback: "BabelStone Han"}body:lang(ko),body :lang(ko){font-family:var(--font-sans-ko)}body:lang(ja),body :lang(ja){font-family:var(--font-sans-ja)}body:lang(zh),body :lang(zh){font-family:var(--font-sans-zh-cn)}:lang(ko)[data-type=quant],:lang(ko) [data-type=quant],:lang(ko)[href^="#/entry/ccko/"],:lang(ko) [href^="#/entry/ccko/"]{font-family:var(--font-serif-ko)}:lang(ja)[data-type=quant],:lang(ja) [data-type=quant]{font-family:var(--font-serif-ja)}:lang(zh)[data-type=quant],:lang(zh) [data-type=quant]{font-family:var(--font-serif-zh-cn)}#header #searchArea .ly_my_keyword>ul.list_word>li>.addible>.word_wrap:lang(ko){font-family:var(--font-serif-ko)}#header #searchArea .keyword_search_inner .keyword:lang(ko){font-family:var(--font-sans-ko)}#header #searchArea #ac_layer ul.list_word>li .word_wrap:lang(ko){font-family:var(--font-sans-ko)}#header #searchArea #ac_layer ul.list_word>li .word_wrap:lang(ko)>.match_word{font-family:var(--font-sans-ko)}#header #write_device>dl>dd#writeDevice>table>tbody td{font-family:var(--font-serif-ko)}.searching_words .word_item a[href^="#/entry/ccko/"]:lang(ko){font-family:var(--font-serif-ko)}.searching_words .word_item a[href^="#/entry/ccko/"]:lang(ko)>strong.highlight{font-family:var(--font-serif-ko)}#tooltipLayer_hanja_zoom>#tooltipLayer_hanja_zoom_list .u_word_zoom{font-family:var(--font-serif-ko)!important}#tooltipLayer_dict>dl.u_helpdict_area>dt.u_headword>.u_btn_headword:lang(ko){font-family:var(--font-serif-ko)!important}#tooltipLayer_dict>dl.u_helpdict_area>dt.u_headword>.u_btn_headword:lang(ko)>.u_origin_word{font-family:var(--font-sans-ko)}#tooltipLayer_dict>dl.u_helpdict_area>dd.u_definition>ul.u_mean_word>li.u_mean_word_item>.u_word_mean{font-family:var(--font-sans-ko)!important}#tooltipLayer_dict>dl.u_helpdict_area>dd.u_definition>ul.u_mean_word>li.u_mean_word_item>.u_word_mean>.u_words_num{font-family:var(--font-sans-ko)}#tooltipLayer_dict>dl.u_helpdict_area>dd.u_definition>ul.u_mean_word>li.u_mean_word_item .u_option_radical:lang(ko){font-family:var(--font-serif-ko)}.search_area .my_keyword_list>li>a.my_keyword:lang(ko){font-family:var(--font-serif-ko)}.component_entry .entry_title .word:lang(ko){font-family:var(--font-serif-ko)}#searchLetterPage_content>.row .hanja_link:lang(ko){font-family:var(--font-serif-ko)}#searchLetterPage_content>.row .hanja_link:lang(ko)>strong.highlight{font-family:var(--font-serif-ko)}#searchPage_entry .row .link:lang(ko){font-family:var(--font-serif-ko)}#searchPage_entry .row .link:lang(ko)>strong.highlight{font-family:var(--font-serif-ko)}#footer>.btn_top{display:none}';
  let isInitialized = false;
  const styleEl = _GM_addStyle(styleCssText);
  styleEl.dataset.styleName = "hanja-init";
  const initHanja = () => {
    if (!isInitialized) {
      const headObserver = DOMObserver.getInstance({
        baseNode: document.head
      });
      const domObserver = DOMObserver.getInstance();
      headObserver.subscribe({
        selector: 'style[data-style-name="global"]',
        onAdd: ({ node }) => {
          node.after(styleEl);
        }
      });
      domObserver.subscribe({
        selector: '[lang*="zh"]',
        onAdd: ({ node }) => {
          if (!node.dataset.naverDictCustomHanja) {
            if (node.dataset.naverDictCustomCorrection !== "true") {
              node.lang = "ko";
            }
            node.dataset.naverDictCustomHanja = "true";
          }
        },
        deep: {
          add: "all"
        }
      });
      isInitialized = true;
    }
  };
  const globalCssText = "#us_n_dict_root{all:initial}";
  function hookSpaNavigation() {
    const origPushState = history.pushState;
    history.pushState = function(...args) {
      origPushState.apply(this, args);
      window.dispatchEvent(new Event("routechange"));
    };
    window.addEventListener("popstate", () => {
      window.dispatchEvent(new Event("routechange"));
    });
    window.addEventListener("hashchange", () => {
      window.dispatchEvent(new Event("routechange"));
    });
  }
  hookSpaNavigation();
  const globalStyleEl = _GM_addStyle(globalCssText);
  globalStyleEl.dataset.styleName = "global";
  const rootEl = document.createElement("div");
  rootEl.id = "us_n_dict_root";
  const bootstrap = () => {
    const { host, pathname, search, hash } = location;
    if (host === "hanja.dict.naver.com" && pathname === "/" && search === "") {
      initHanja();
      if (hash.startsWith("#/main")) ;
      else if (hash.startsWith("#/entry/ccko/")) {
        initHanjaInfoPage();
      } else if (hash.startsWith("#/search?")) ;
    }
  };
  const init = () => {
    const headObserver = DOMObserver.getInstance({ baseNode: document.head });
    headObserver.subscribe({
      selector: 'link[rel="stylesheet"][href^="https://ssl.pstatic.net"]',
      onAdd: () => {
        document.head.append(globalStyleEl);
      }
    });
    document.body.after(rootEl);
    preact.render(
      /* @__PURE__ */ u$1(AppProviders, { children: /* @__PURE__ */ u$1(App, {}) }),
      rootEl
    );
    bootstrap();
  };
  onBodyReady(init);
  addEventListener("routechange", bootstrap);

})(preact);