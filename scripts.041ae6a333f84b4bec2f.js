if (
  ((function(t) {
    var e,
      n,
      r = "0.5.0",
      i = "hasOwnProperty",
      o = /[\.\/]/,
      a = /\s*,\s*/,
      s = function(t, e) {
        return t - e;
      },
      l = { n: {} },
      u = function() {
        for (var t = 0, e = this.length; e > t; t++)
          if (void 0 !== this[t]) return this[t];
      },
      c = function() {
        for (var t = this.length; --t; ) if (void 0 !== this[t]) return this[t];
      },
      f = Object.prototype.toString,
      h = String,
      d =
        Array.isArray ||
        function(t) {
          return t instanceof Array || "[object Array]" == f.call(t);
        };
    (eve = function(t, r) {
      var i,
        o = n,
        a = Array.prototype.slice.call(arguments, 2),
        l = eve.listeners(t),
        f = 0,
        h = [],
        d = {},
        p = [],
        g = e;
      (p.firstDefined = u), (p.lastDefined = c), (e = t), (n = 0);
      for (var v = 0, m = l.length; m > v; v++)
        "zIndex" in l[v] &&
          (h.push(l[v].zIndex), l[v].zIndex < 0 && (d[l[v].zIndex] = l[v]));
      for (h.sort(s); h[f] < 0; )
        if (((i = d[h[f++]]), p.push(i.apply(r, a)), n)) return (n = o), p;
      for (v = 0; m > v; v++)
        if ("zIndex" in (i = l[v]))
          if (i.zIndex == h[f]) {
            if ((p.push(i.apply(r, a)), n)) break;
            do {
              if (((i = d[h[++f]]) && p.push(i.apply(r, a)), n)) break;
            } while (i);
          } else d[i.zIndex] = i;
        else if ((p.push(i.apply(r, a)), n)) break;
      return (n = o), (e = g), p;
    }),
      (eve._events = l),
      (eve.listeners = function(t) {
        var e,
          n,
          r,
          i,
          a,
          s,
          u,
          c,
          f = d(t) ? t : t.split(o),
          h = l,
          p = [h],
          g = [];
        for (i = 0, a = f.length; a > i; i++) {
          for (c = [], s = 0, u = p.length; u > s; s++)
            for (n = [(h = p[s].n)[f[i]], h["*"]], r = 2; r--; )
              (e = n[r]) && (c.push(e), (g = g.concat(e.f || [])));
          p = c;
        }
        return g;
      }),
      (eve.separator = function(t) {
        t
          ? ((t = "[" + (t = h(t).replace(/(?=[\.\^\]\[\-])/g, "\\")) + "]"),
            (o = new RegExp(t)))
          : (o = /[\.\/]/);
      }),
      (eve.on = function(t, e) {
        if ("function" != typeof e) return function() {};
        for (
          var n = d(t) ? (d(t[0]) ? t : [t]) : h(t).split(a),
            r = 0,
            i = n.length;
          i > r;
          r++
        )
          !(function(t) {
            for (
              var n, r = d(t) ? t : h(t).split(o), i = l, a = 0, s = r.length;
              s > a;
              a++
            )
              i =
                ((i = i.n).hasOwnProperty(r[a]) && i[r[a]]) ||
                (i[r[a]] = { n: {} });
            for (i.f = i.f || [], a = 0, s = i.f.length; s > a; a++)
              if (i.f[a] == e) {
                n = !0;
                break;
              }
            !n && i.f.push(e);
          })(n[r]);
        return function(t) {
          +t == +t && (e.zIndex = +t);
        };
      }),
      (eve.f = function(t) {
        var e = [].slice.call(arguments, 1);
        return function() {
          eve.apply(
            null,
            [t, null].concat(e).concat([].slice.call(arguments, 0))
          );
        };
      }),
      (eve.stop = function() {
        n = 1;
      }),
      (eve.nt = function(t) {
        var n = d(e) ? e.join(".") : e;
        return t
          ? new RegExp("(?:\\.|\\/|^)" + t + "(?:\\.|\\/|$)").test(n)
          : n;
      }),
      (eve.nts = function() {
        return d(e) ? e : e.split(o);
      }),
      (eve.off = eve.unbind = function(t, e) {
        if (t) {
          var n = d(t) ? (d(t[0]) ? t : [t]) : h(t).split(a);
          if (n.length > 1)
            for (var r = 0, s = n.length; s > r; r++) eve.off(n[r], e);
          else {
            n = d(t) ? t : h(t).split(o);
            var u,
              c,
              f,
              p,
              g,
              v = [l],
              m = [];
            for (r = 0, s = n.length; s > r; r++)
              for (p = 0; p < v.length; p += f.length - 2) {
                if (((f = [p, 1]), (u = v[p].n), "*" != n[r]))
                  u[n[r]] && (f.push(u[n[r]]), m.unshift({ n: u, name: n[r] }));
                else
                  for (c in u)
                    u[i](c) && (f.push(u[c]), m.unshift({ n: u, name: c }));
                v.splice.apply(v, f);
              }
            for (r = 0, s = v.length; s > r; r++)
              for (u = v[r]; u.n; ) {
                if (e) {
                  if (u.f) {
                    for (p = 0, g = u.f.length; g > p; p++)
                      if (u.f[p] == e) {
                        u.f.splice(p, 1);
                        break;
                      }
                    !u.f.length && delete u.f;
                  }
                  for (c in u.n)
                    if (u.n[i](c) && u.n[c].f) {
                      var y = u.n[c].f;
                      for (p = 0, g = y.length; g > p; p++)
                        if (y[p] == e) {
                          y.splice(p, 1);
                          break;
                        }
                      !y.length && delete u.n[c].f;
                    }
                } else
                  for (c in (delete u.f, u.n))
                    u.n[i](c) && u.n[c].f && delete u.n[c].f;
                u = u.n;
              }
            t: for (r = 0, s = m.length; s > r; r++) {
              for (c in (u = m[r]).n[u.name].f) continue t;
              for (c in u.n[u.name].n) continue t;
              delete u.n[u.name];
            }
          }
        } else eve._events = l = { n: {} };
      }),
      (eve.once = function(t, e) {
        var n = function() {
          return eve.off(t, n), e.apply(this, arguments);
        };
        return eve.on(t, n);
      }),
      (eve.version = r),
      (eve.toString = function() {
        return "You are running Eve " + r;
      }),
      "undefined" != typeof module && module.exports
        ? (module.exports = eve)
        : "function" == typeof define && define.amd
          ? define("eve", [], function() {
              return eve;
            })
          : (t.eve = eve);
  })(this),
  (function(t, e) {
    if ("function" == typeof define && define.amd)
      define(["eve"], function(n) {
        return e(t, n);
      });
    else if ("undefined" != typeof exports) {
      var n = require("eve");
      module.exports = e(t, n);
    } else e(t, t.eve);
  })(window || this, function(t, e) {
    var n = (function(e) {
        var n,
          r = {},
          i =
            t.requestAnimationFrame ||
            t.webkitRequestAnimationFrame ||
            t.mozRequestAnimationFrame ||
            t.oRequestAnimationFrame ||
            t.msRequestAnimationFrame ||
            function(t) {
              return setTimeout(t, 16, new Date().getTime()), !0;
            },
          o =
            Array.isArray ||
            function(t) {
              return (
                t instanceof Array ||
                "[object Array]" == Object.prototype.toString.call(t)
              );
            },
          a = 0,
          s = "M" + (+new Date()).toString(36),
          l = function() {
            return s + (a++).toString(36);
          },
          u =
            Date.now ||
            function() {
              return +new Date();
            },
          c = function(t) {
            var e = this;
            if (null == t) return e.s;
            var n = e.s - t;
            (e.b += e.dur * n), (e.B += e.dur * n), (e.s = t);
          },
          f = function(t) {
            return null == t ? this.spd : void (this.spd = t);
          },
          h = function(t) {
            var e = this;
            return null == t
              ? e.dur
              : ((e.s = (e.s * t) / e.dur), void (e.dur = t));
          },
          d = function() {
            var t = this;
            delete r[t.id], t.update(), e("mina.stop." + t.id, t);
          },
          p = function() {
            var t = this;
            t.pdif || (delete r[t.id], t.update(), (t.pdif = t.get() - t.b));
          },
          g = function() {
            var t = this;
            t.pdif &&
              ((t.b = t.get() - t.pdif), delete t.pdif, (r[t.id] = t), m());
          },
          v = function() {
            var t,
              e = this;
            if (o(e.start)) {
              t = [];
              for (var n = 0, r = e.start.length; r > n; n++)
                t[n] = +e.start[n] + (e.end[n] - e.start[n]) * e.easing(e.s);
            } else t = +e.start + (e.end - e.start) * e.easing(e.s);
            e.set(t);
          },
          m = function(t) {
            if (t) {
              var o = 0;
              for (var a in r)
                if (r.hasOwnProperty(a)) {
                  var s = r[a],
                    l = s.get();
                  o++,
                    (s.s = (l - s.b) / (s.dur / s.spd)),
                    s.s >= 1 &&
                      (delete r[a],
                      (s.s = 1),
                      o--,
                      (function(t) {
                        setTimeout(function() {
                          e("mina.finish." + t.id, t);
                        });
                      })(s)),
                    s.update();
                }
              n = !!o && i(m);
            } else n || (n = i(m));
          },
          y = function(t, e, n, i, o, a, s) {
            var u = {
              id: l(),
              start: t,
              end: e,
              b: n,
              s: 0,
              dur: i - n,
              spd: 1,
              get: o,
              set: a,
              easing: s || y.linear,
              status: c,
              speed: f,
              duration: h,
              stop: d,
              pause: p,
              resume: g,
              update: v
            };
            r[u.id] = u;
            var b,
              x = 0;
            for (b in r) if (r.hasOwnProperty(b) && 2 == ++x) break;
            return 1 == x && m(), u;
          };
        return (
          (y.time = u),
          (y.getById = function(t) {
            return r[t] || null;
          }),
          (y.linear = function(t) {
            return t;
          }),
          (y.easeout = function(t) {
            return Math.pow(t, 1.7);
          }),
          (y.easein = function(t) {
            return Math.pow(t, 0.48);
          }),
          (y.easeinout = function(t) {
            if (1 == t) return 1;
            if (0 == t) return 0;
            var e = 0.48 - t / 1.04,
              n = Math.sqrt(0.1734 + e * e),
              r = n - e,
              i = -n - e,
              o =
                Math.pow(Math.abs(r), 1 / 3) * (0 > r ? -1 : 1) +
                Math.pow(Math.abs(i), 1 / 3) * (0 > i ? -1 : 1) +
                0.5;
            return 3 * (1 - o) * o * o + o * o * o;
          }),
          (y.backin = function(t) {
            if (1 == t) return 1;
            var e = 1.70158;
            return t * t * ((e + 1) * t - e);
          }),
          (y.backout = function(t) {
            if (0 == t) return 0;
            var e = 1.70158;
            return (t -= 1) * t * ((e + 1) * t + e) + 1;
          }),
          (y.elastic = function(t) {
            return t == !!t
              ? t
              : Math.pow(2, -10 * t) *
                  Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) +
                  1;
          }),
          (y.bounce = function(t) {
            var e,
              n = 7.5625,
              r = 2.75;
            return (
              1 / r > t
                ? (e = n * t * t)
                : 2 / r > t
                  ? (e = n * (t -= 1.5 / r) * t + 0.75)
                  : 2.5 / r > t
                    ? (e = n * (t -= 2.25 / r) * t + 0.9375)
                    : (e = n * (t -= 2.625 / r) * t + 0.984375),
              e
            );
          }),
          (t.mina = y),
          y
        );
      })(void 0 === e ? function() {} : e),
      r = (function(t) {
        function n(t, e) {
          if (t) {
            if (t.nodeType) return d(t);
            if (i(t, "array") && n.set) return n.set.apply(n, t);
            if (t instanceof u) return t;
            if (null == e) return d((t = p.doc.querySelector(String(t))));
          }
          return new h(
            (t = null == t ? "100%" : t),
            (e = null == e ? "100%" : e)
          );
        }
        function r(t, e) {
          if (e) {
            if (
              ("#text" == t &&
                (t = p.doc.createTextNode(e.text || e["#text"] || "")),
              "#comment" == t &&
                (t = p.doc.createComment(e.text || e["#text"] || "")),
              "string" == typeof t && (t = r(t)),
              "string" == typeof e)
            )
              return 1 == t.nodeType
                ? "xlink:" == e.substring(0, 6)
                  ? t.getAttributeNS(I, e.substring(6))
                  : "xml:" == e.substring(0, 4)
                    ? t.getAttributeNS(M, e.substring(4))
                    : t.getAttribute(e)
                : "text" == e
                  ? t.nodeValue
                  : null;
            if (1 == t.nodeType) {
              for (var n in e)
                if (e[v](n)) {
                  var i = m(e[n]);
                  i
                    ? "xlink:" == n.substring(0, 6)
                      ? t.setAttributeNS(I, n.substring(6), i)
                      : "xml:" == n.substring(0, 4)
                        ? t.setAttributeNS(M, n.substring(4), i)
                        : t.setAttribute(n, i)
                    : t.removeAttribute(n);
                }
            } else "text" in e && (t.nodeValue = e.text);
          } else t = p.doc.createElementNS(M, t);
          return t;
        }
        function i(t, e) {
          return "finite" == (e = m.prototype.toLowerCase.call(e))
            ? isFinite(t)
            : !(
                "array" != e ||
                !(t instanceof Array || (Array.isArray && Array.isArray(t)))
              ) ||
                (("null" == e && null === t) ||
                  (e == typeof t && null !== t) ||
                  ("object" == e && t === Object(t)) ||
                  k
                    .call(t)
                    .slice(8, -1)
                    .toLowerCase() == e);
        }
        function o(t, e, n) {
          return function r() {
            var i = Array.prototype.slice.call(arguments, 0),
              o = i.join("\u2400"),
              a = (r.cache = r.cache || {}),
              s = (r.count = r.count || []);
            return a[v](o)
              ? ((function(t, e) {
                  for (var n = 0, r = t.length; r > n; n++)
                    if (t[n] === e) return t.push(t.splice(n, 1)[0]);
                })(s, o),
                n ? n(a[o]) : a[o])
              : (s.length >= 1e3 && delete a[s.shift()],
                s.push(o),
                (a[o] = t.apply(e, i)),
                n ? n(a[o]) : a[o]);
          };
        }
        function a(t) {
          return ((t % 360) * E) / 180;
        }
        function s(t) {
          return (
            (t.node.ownerSVGElement && d(t.node.ownerSVGElement)) ||
            n.select("svg")
          );
        }
        function l(t) {
          i(t, "array") || (t = Array.prototype.slice.call(arguments, 0));
          for (var e = 0, n = 0, r = this.node; this[e]; ) delete this[e++];
          for (e = 0; e < t.length; e++)
            "set" == t[e].type
              ? t[e].forEach(function(t) {
                  r.appendChild(t.node);
                })
              : r.appendChild(t[e].node);
          var o = r.childNodes;
          for (e = 0; e < o.length; e++) this[n++] = d(o[e]);
          return this;
        }
        function u(t) {
          if (t.snap in R) return R[t.snap];
          var e;
          try {
            e = t.ownerSVGElement;
          } catch (t) {}
          (this.node = t),
            e && (this.paper = new h(e)),
            (this.type = t.tagName || t.nodeName);
          var n = (this.id = L(this));
          if (
            ((this.anims = {}),
            (this._ = { transform: [] }),
            (t.snap = n),
            (R[n] = this),
            "g" == this.type && (this.add = l),
            this.type in { g: 1, mask: 1, pattern: 1, symbol: 1 })
          )
            for (var r in h.prototype)
              h.prototype[v](r) && (this[r] = h.prototype[r]);
        }
        function c(t) {
          this.node = t;
        }
        function f(t, e) {
          var n = r(t);
          return e.appendChild(n), d(n);
        }
        function h(t, e) {
          var n,
            i,
            o,
            a = h.prototype;
          if (t && t.tagName && "svg" == t.tagName.toLowerCase()) {
            if (t.snap in R) return R[t.snap];
            var s = t.ownerDocument;
            for (var l in ((n = new u(t)),
            (i = t.getElementsByTagName("desc")[0]),
            (o = t.getElementsByTagName("defs")[0]),
            i ||
              ((i = r("desc")).appendChild(
                s.createTextNode("Created with Snap")
              ),
              n.node.appendChild(i)),
            o || ((o = r("defs")), n.node.appendChild(o)),
            (n.defs = o),
            a))
              a[v](l) && (n[l] = a[l]);
            n.paper = n.root = n;
          } else
            r((n = f("svg", p.doc.body)).node, {
              height: e,
              version: 1.1,
              width: t,
              xmlns: M
            });
          return n;
        }
        function d(t) {
          return t
            ? t instanceof u || t instanceof c
              ? t
              : t.tagName && "svg" == t.tagName.toLowerCase()
                ? new h(t)
                : t.tagName &&
                  "object" == t.tagName.toLowerCase() &&
                  "image/svg+xml" == t.type
                  ? new h(t.contentDocument.getElementsByTagName("svg")[0])
                  : new u(t)
            : t;
        }
        (n.version = "0.5.1"),
          (n.toString = function() {
            return "Snap v" + this.version;
          }),
          (n._ = {});
        var p = { win: t.window, doc: t.window.document };
        n._.glob = p;
        var v = "hasOwnProperty",
          m = String,
          y = parseFloat,
          b = parseInt,
          x = Math,
          w = x.max,
          C = x.min,
          T = x.abs,
          E = (x.pow, x.PI),
          S = (x.round, ""),
          k = Object.prototype.toString,
          A = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\))\s*$/i,
          F = ((n._.separator = /[,\s]+/), /[\s]*,[\s]*/),
          D = { hs: 1, rg: 1 },
          N = /([a-z])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/gi,
          $ = /([rstm])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/gi,
          j = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\s]*,?[\s]*/gi,
          B = 0,
          O = "S" + (+new Date()).toString(36),
          L = function(t) {
            return (t && t.type ? t.type : S) + O + (B++).toString(36);
          },
          I = "http://www.w3.org/1999/xlink",
          M = "http://www.w3.org/2000/svg",
          R = {};
        (n.url = function(t) {
          return "url('#" + t + "')";
        }),
          (n._.$ = r),
          (n._.id = L),
          (n.format = (function() {
            var t = /\{([^\}]+)\}/g,
              e = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,
              n = function(t, n, r) {
                var i = r;
                return (
                  n.replace(e, function(t, e, n, r, o) {
                    (e = e || r),
                      i &&
                        (e in i && (i = i[e]),
                        "function" == typeof i && o && (i = i()));
                  }),
                  (i = (null == i || i == r ? t : i) + "")
                );
              };
            return function(e, r) {
              return m(e).replace(t, function(t, e) {
                return n(t, e, r);
              });
            };
          })()),
          (n._.clone = function t(e) {
            if ("function" == typeof e || Object(e) !== e) return e;
            var n = new e.constructor();
            for (var r in e) e[v](r) && (n[r] = t(e[r]));
            return n;
          }),
          (n._.cacher = o),
          (n.rad = a),
          (n.deg = function(t) {
            return ((180 * t) / E) % 360;
          }),
          (n.sin = function(t) {
            return x.sin(n.rad(t));
          }),
          (n.tan = function(t) {
            return x.tan(n.rad(t));
          }),
          (n.cos = function(t) {
            return x.cos(n.rad(t));
          }),
          (n.asin = function(t) {
            return n.deg(x.asin(t));
          }),
          (n.acos = function(t) {
            return n.deg(x.acos(t));
          }),
          (n.atan = function(t) {
            return n.deg(x.atan(t));
          }),
          (n.atan2 = function(t) {
            return n.deg(x.atan2(t));
          }),
          (n.angle = function t(e, n, r, i, o, a) {
            if (null == o) {
              var s = e - r,
                l = n - i;
              return s || l
                ? (180 + (180 * x.atan2(-l, -s)) / E + 360) % 360
                : 0;
            }
            return t(e, n, o, a) - t(r, i, o, a);
          }),
          (n.len = function(t, e, r, i) {
            return Math.sqrt(n.len2(t, e, r, i));
          }),
          (n.len2 = function(t, e, n, r) {
            return (t - n) * (t - n) + (e - r) * (e - r);
          }),
          (n.closestPoint = function(t, e, n) {
            function r(t) {
              var r = t.x - e,
                i = t.y - n;
              return r * r + i * i;
            }
            for (
              var i,
                o,
                a,
                s,
                l = t.node,
                u = l.getTotalLength(),
                c = (u / l.pathSegList.numberOfItems) * 0.125,
                f = 1 / 0,
                h = 0;
              u >= h;
              h += c
            )
              (s = r((a = l.getPointAtLength(h)))) < f &&
                ((i = a), (o = h), (f = s));
            for (c *= 0.5; c > 0.5; ) {
              var d, p, g, v, m, y;
              (g = o - c) >= 0 && (m = r((d = l.getPointAtLength(g)))) < f
                ? ((i = d), (o = g), (f = m))
                : (v = o + c) <= u && (y = r((p = l.getPointAtLength(v)))) < f
                  ? ((i = p), (o = v), (f = y))
                  : (c *= 0.5);
            }
            return { x: i.x, y: i.y, length: o, distance: Math.sqrt(f) };
          }),
          (n.is = i),
          (n.snapTo = function(t, e, n) {
            if (((n = i(n, "finite") ? n : 10), i(t, "array"))) {
              for (var r = t.length; r--; ) if (T(t[r] - e) <= n) return t[r];
            } else {
              var o = e % (t = +t);
              if (n > o) return e - o;
              if (o > t - n) return e - o + t;
            }
            return e;
          }),
          (n.getRGB = o(function(t) {
            if (!t || (t = m(t)).indexOf("-") + 1)
              return {
                r: -1,
                g: -1,
                b: -1,
                hex: "none",
                error: 1,
                toString: H
              };
            if ("none" == t)
              return { r: -1, g: -1, b: -1, hex: "none", toString: H };
            if (
              (!(D[v](t.toLowerCase().substring(0, 2)) || "#" == t.charAt()) &&
                (t = P(t)),
              !t)
            )
              return {
                r: -1,
                g: -1,
                b: -1,
                hex: "none",
                error: 1,
                toString: H
              };
            var e,
              r,
              o,
              a,
              s,
              l,
              u = t.match(A);
            return u
              ? (u[2] &&
                  ((o = b(u[2].substring(5), 16)),
                  (r = b(u[2].substring(3, 5), 16)),
                  (e = b(u[2].substring(1, 3), 16))),
                u[3] &&
                  ((o = b((s = u[3].charAt(3)) + s, 16)),
                  (r = b((s = u[3].charAt(2)) + s, 16)),
                  (e = b((s = u[3].charAt(1)) + s, 16))),
                u[4] &&
                  ((l = u[4].split(F)),
                  (e = y(l[0])),
                  "%" == l[0].slice(-1) && (e *= 2.55),
                  (r = y(l[1])),
                  "%" == l[1].slice(-1) && (r *= 2.55),
                  (o = y(l[2])),
                  "%" == l[2].slice(-1) && (o *= 2.55),
                  "rgba" == u[1].toLowerCase().slice(0, 4) && (a = y(l[3])),
                  l[3] && "%" == l[3].slice(-1) && (a /= 100)),
                u[5]
                  ? ((l = u[5].split(F)),
                    (e = y(l[0])),
                    "%" == l[0].slice(-1) && (e /= 100),
                    (r = y(l[1])),
                    "%" == l[1].slice(-1) && (r /= 100),
                    (o = y(l[2])),
                    "%" == l[2].slice(-1) && (o /= 100),
                    ("deg" == l[0].slice(-3) || "\xb0" == l[0].slice(-1)) &&
                      (e /= 360),
                    "hsba" == u[1].toLowerCase().slice(0, 4) && (a = y(l[3])),
                    l[3] && "%" == l[3].slice(-1) && (a /= 100),
                    n.hsb2rgb(e, r, o, a))
                  : u[6]
                    ? ((l = u[6].split(F)),
                      (e = y(l[0])),
                      "%" == l[0].slice(-1) && (e /= 100),
                      (r = y(l[1])),
                      "%" == l[1].slice(-1) && (r /= 100),
                      (o = y(l[2])),
                      "%" == l[2].slice(-1) && (o /= 100),
                      ("deg" == l[0].slice(-3) || "\xb0" == l[0].slice(-1)) &&
                        (e /= 360),
                      "hsla" == u[1].toLowerCase().slice(0, 4) && (a = y(l[3])),
                      l[3] && "%" == l[3].slice(-1) && (a /= 100),
                      n.hsl2rgb(e, r, o, a))
                    : ((e = C(x.round(e), 255)),
                      (r = C(x.round(r), 255)),
                      (o = C(x.round(o), 255)),
                      (a = C(w(a, 0), 1)),
                      ((u = { r: e, g: r, b: o, toString: H }).hex =
                        "#" +
                        (16777216 | o | (r << 8) | (e << 16))
                          .toString(16)
                          .slice(1)),
                      (u.opacity = i(a, "finite") ? a : 1),
                      u))
              : { r: -1, g: -1, b: -1, hex: "none", error: 1, toString: H };
          }, n)),
          (n.hsb = o(function(t, e, r) {
            return n.hsb2rgb(t, e, r).hex;
          })),
          (n.hsl = o(function(t, e, r) {
            return n.hsl2rgb(t, e, r).hex;
          })),
          (n.rgb = o(function(t, e, n, r) {
            if (i(r, "finite")) {
              var o = x.round;
              return "rgba(" + [o(t), o(e), o(n), +r.toFixed(2)] + ")";
            }
            return (
              "#" + (16777216 | n | (e << 8) | (t << 16)).toString(16).slice(1)
            );
          }));
        var P = function(t) {
            var e =
                p.doc.getElementsByTagName("head")[0] ||
                p.doc.getElementsByTagName("svg")[0],
              n = "rgb(255, 0, 0)";
            return (P = o(function(t) {
              if ("red" == t.toLowerCase()) return n;
              (e.style.color = n), (e.style.color = t);
              var r = p.doc.defaultView
                .getComputedStyle(e, S)
                .getPropertyValue("color");
              return r == n ? null : r;
            }))(t);
          },
          q = function() {
            return "hsb(" + [this.h, this.s, this.b] + ")";
          },
          _ = function() {
            return "hsl(" + [this.h, this.s, this.l] + ")";
          },
          H = function() {
            return 1 == this.opacity || null == this.opacity
              ? this.hex
              : "rgba(" + [this.r, this.g, this.b, this.opacity] + ")";
          },
          U = function(t, e, r) {
            if (
              (null == e &&
                i(t, "object") &&
                "r" in t &&
                "g" in t &&
                "b" in t &&
                ((r = t.b), (e = t.g), (t = t.r)),
              null == e && i(t, string))
            ) {
              var o = n.getRGB(t);
              (t = o.r), (e = o.g), (r = o.b);
            }
            return (
              (t > 1 || e > 1 || r > 1) && ((t /= 255), (e /= 255), (r /= 255)),
              [t, e, r]
            );
          },
          W = function(t, e, r, o) {
            var a = {
              r: (t = x.round(255 * t)),
              g: (e = x.round(255 * e)),
              b: (r = x.round(255 * r)),
              opacity: i(o, "finite") ? o : 1,
              hex: n.rgb(t, e, r),
              toString: H
            };
            return i(o, "finite") && (a.opacity = o), a;
          };
        (n.color = function(t) {
          var e;
          return (
            i(t, "object") && "h" in t && "s" in t && "b" in t
              ? ((e = n.hsb2rgb(t)),
                (t.r = e.r),
                (t.g = e.g),
                (t.b = e.b),
                (t.opacity = 1),
                (t.hex = e.hex))
              : i(t, "object") && "h" in t && "s" in t && "l" in t
                ? ((e = n.hsl2rgb(t)),
                  (t.r = e.r),
                  (t.g = e.g),
                  (t.b = e.b),
                  (t.opacity = 1),
                  (t.hex = e.hex))
                : (i(t, "string") && (t = n.getRGB(t)),
                  i(t, "object") &&
                  "r" in t &&
                  "g" in t &&
                  "b" in t &&
                  !("error" in t)
                    ? ((e = n.rgb2hsl(t)),
                      (t.h = e.h),
                      (t.s = e.s),
                      (t.l = e.l),
                      (e = n.rgb2hsb(t)),
                      (t.v = e.b))
                    : (((t = {
                        hex: "none"
                      }).r = t.g = t.b = t.h = t.s = t.v = t.l = -1),
                      (t.error = 1))),
            (t.toString = H),
            t
          );
        }),
          (n.hsb2rgb = function(t, e, n, r) {
            var o, a, s, l, u;
            return (
              i(t, "object") &&
                "h" in t &&
                "s" in t &&
                "b" in t &&
                ((n = t.b), (e = t.s), (r = t.o), (t = t.h)),
              (o = a = s = n - (u = n * e)),
              (o += [
                u,
                (l = u * (1 - T(((t = ((t *= 360) % 360) / 60) % 2) - 1))),
                0,
                0,
                l,
                u
              ][(t = ~~t)]),
              (a += [l, u, u, l, 0, 0][t]),
              (s += [0, 0, l, u, u, l][t]),
              W(o, a, s, r)
            );
          }),
          (n.hsl2rgb = function(t, e, n, r) {
            var o, a, s, l, u;
            return (
              i(t, "object") &&
                "h" in t &&
                "s" in t &&
                "l" in t &&
                ((n = t.l), (e = t.s), (t = t.h)),
              (t > 1 || e > 1 || n > 1) && ((t /= 360), (e /= 100), (n /= 100)),
              (t = ((t *= 360) % 360) / 60),
              (o = a = s = n - (u = 2 * e * (0.5 > n ? n : 1 - n)) / 2),
              (o += [u, (l = u * (1 - T((t % 2) - 1))), 0, 0, l, u][(t = ~~t)]),
              (a += [l, u, u, l, 0, 0][t]),
              (s += [0, 0, l, u, u, l][t]),
              W(o, a, s, r)
            );
          }),
          (n.rgb2hsb = function(t, e, n) {
            var r, i;
            return (
              (t = (n = U(t, e, n))[0]),
              (e = n[1]),
              (n = n[2]),
              {
                h:
                  ((((0 == (i = (r = w(t, e, n)) - C(t, e, n))
                    ? null
                    : r == t
                      ? (e - n) / i
                      : r == e
                        ? (n - t) / i + 2
                        : (t - e) / i + 4) +
                    360) %
                    6) *
                    60) /
                  360,
                s: 0 == i ? 0 : i / r,
                b: r,
                toString: q
              }
            );
          }),
          (n.rgb2hsl = function(t, e, n) {
            var r, i, o, a;
            return (
              (t = (n = U(t, e, n))[0]),
              (e = n[1]),
              (n = n[2]),
              (r = ((i = w(t, e, n)) + (o = C(t, e, n))) / 2),
              {
                h:
                  ((((0 == (a = i - o)
                    ? null
                    : i == t
                      ? (e - n) / a
                      : i == e
                        ? (n - t) / a + 2
                        : (t - e) / a + 4) +
                    360) %
                    6) *
                    60) /
                  360,
                s: 0 == a ? 0 : 0.5 > r ? a / (2 * r) : a / (2 - 2 * r),
                l: r,
                toString: _
              }
            );
          }),
          (n.parsePathString = function(t) {
            if (!t) return null;
            var e = n.path(t);
            if (e.arr) return n.path.clone(e.arr);
            var r = {
                a: 7,
                c: 6,
                o: 2,
                h: 1,
                l: 2,
                m: 2,
                r: 4,
                q: 4,
                s: 4,
                t: 2,
                v: 1,
                u: 3,
                z: 0
              },
              o = [];
            return (
              i(t, "array") && i(t[0], "array") && (o = n.path.clone(t)),
              o.length ||
                m(t).replace(N, function(t, e, n) {
                  var i = [],
                    a = e.toLowerCase();
                  if (
                    (n.replace(j, function(t, e) {
                      e && i.push(+e);
                    }),
                    "m" == a &&
                      i.length > 2 &&
                      (o.push([e].concat(i.splice(0, 2))),
                      (a = "l"),
                      (e = "m" == e ? "l" : "L")),
                    "o" == a && 1 == i.length && o.push([e, i[0]]),
                    "r" == a)
                  )
                    o.push([e].concat(i));
                  else
                    for (
                      ;
                      i.length >= r[a] &&
                      (o.push([e].concat(i.splice(0, r[a]))), r[a]);

                    );
                }),
              (o.toString = n.path.toString),
              (e.arr = n.path.clone(o)),
              o
            );
          });
        var V = (n.parseTransformString = function(t) {
          if (!t) return null;
          var e = [];
          return (
            i(t, "array") && i(t[0], "array") && (e = n.path.clone(t)),
            e.length ||
              m(t).replace($, function(t, n, r) {
                var i = [];
                n.toLowerCase(),
                  r.replace(j, function(t, e) {
                    e && i.push(+e);
                  }),
                  e.push([n].concat(i));
              }),
            (e.toString = n.path.toString),
            e
          );
        });
        (n._.svgTransform2string = function(t) {
          var e = [];
          return (
            (t = t.replace(/(?:^|\s)(\w+)\(([^)]+)\)/g, function(t, n, r) {
              return (
                (r = r.split(/\s*,\s*|\s+/)),
                "rotate" == n && 1 == r.length && r.push(0, 0),
                "scale" == n &&
                  (r.length > 2
                    ? (r = r.slice(0, 2))
                    : 2 == r.length && r.push(0, 0),
                  1 == r.length && r.push(r[0], 0, 0)),
                "skewX" == n
                  ? e.push(["m", 1, 0, x.tan(a(r[0])), 1, 0, 0])
                  : "skewY" == n
                    ? e.push(["m", 1, x.tan(a(r[0])), 0, 1, 0, 0])
                    : e.push([n.charAt(0)].concat(r)),
                t
              );
            })),
            e
          );
        }),
          (n._.rgTransform = /^[a-z][\s]*-?\.?\d/i),
          (n._.transform2matrix = function(t, e) {
            var r = V(t),
              i = new n.Matrix();
            if (r)
              for (var o = 0, a = r.length; a > o; o++) {
                var s,
                  l,
                  u,
                  c,
                  f,
                  h = r[o],
                  d = h.length,
                  p = m(h[0]).toLowerCase(),
                  g = h[0] != p,
                  v = g ? i.invert() : 0;
                "t" == p && 2 == d
                  ? i.translate(h[1], 0)
                  : "t" == p && 3 == d
                    ? g
                      ? ((s = v.x(0, 0)),
                        (l = v.y(0, 0)),
                        (u = v.x(h[1], h[2])),
                        (c = v.y(h[1], h[2])),
                        i.translate(u - s, c - l))
                      : i.translate(h[1], h[2])
                    : "r" == p
                      ? 2 == d
                        ? ((f = f || e),
                          i.rotate(h[1], f.x + f.width / 2, f.y + f.height / 2))
                        : 4 == d &&
                          (g
                            ? ((u = v.x(h[2], h[3])),
                              (c = v.y(h[2], h[3])),
                              i.rotate(h[1], u, c))
                            : i.rotate(h[1], h[2], h[3]))
                      : "s" == p
                        ? 2 == d || 3 == d
                          ? ((f = f || e),
                            i.scale(
                              h[1],
                              h[d - 1],
                              f.x + f.width / 2,
                              f.y + f.height / 2
                            ))
                          : 4 == d
                            ? g
                              ? ((u = v.x(h[2], h[3])),
                                (c = v.y(h[2], h[3])),
                                i.scale(h[1], h[1], u, c))
                              : i.scale(h[1], h[1], h[2], h[3])
                            : 5 == d &&
                              (g
                                ? ((u = v.x(h[3], h[4])),
                                  (c = v.y(h[3], h[4])),
                                  i.scale(h[1], h[2], u, c))
                                : i.scale(h[1], h[2], h[3], h[4]))
                        : "m" == p &&
                          7 == d &&
                          i.add(h[1], h[2], h[3], h[4], h[5], h[6]);
              }
            return i;
          }),
          (n._unit2px = function(t, e, n) {
            function i(t) {
              if (null == t) return S;
              if (t == +t) return t;
              r(c, { width: t });
              try {
                return c.getBBox().width;
              } catch (t) {
                return 0;
              }
            }
            function o(t) {
              if (null == t) return S;
              if (t == +t) return t;
              r(c, { height: t });
              try {
                return c.getBBox().height;
              } catch (t) {
                return 0;
              }
            }
            function a(r, i) {
              null == e
                ? (u[r] = i(t.attr(r) || 0))
                : r == e && (u = i(null == n ? t.attr(r) || 0 : n));
            }
            var l = s(t).node,
              u = {},
              c = l.querySelector(".svg---mgr");
            switch (
              (c ||
                (r((c = r("rect")), {
                  x: -9e9,
                  y: -9e9,
                  width: 10,
                  height: 10,
                  class: "svg---mgr",
                  fill: "none"
                }),
                l.appendChild(c)),
              t.type)
            ) {
              case "rect":
                a("rx", i), a("ry", o);
              case "image":
                a("width", i), a("height", o);
              case "text":
                a("x", i), a("y", o);
                break;
              case "circle":
                a("cx", i), a("cy", o), a("r", i);
                break;
              case "ellipse":
                a("cx", i), a("cy", o), a("rx", i), a("ry", o);
                break;
              case "line":
                a("x1", i), a("x2", i), a("y1", o), a("y2", o);
                break;
              case "marker":
                a("refX", i),
                  a("markerWidth", i),
                  a("refY", o),
                  a("markerHeight", o);
                break;
              case "radialGradient":
                a("fx", i), a("fy", o);
                break;
              case "tspan":
                a("dx", i), a("dy", o);
                break;
              default:
                a(e, i);
            }
            return l.removeChild(c), u;
          }),
          p.doc.contains || p.doc.compareDocumentPosition,
          (n._.getSomeDefs = function(t) {
            var e =
                (t.node.ownerSVGElement && d(t.node.ownerSVGElement)) ||
                (t.node.parentNode && d(t.node.parentNode)) ||
                n.select("svg") ||
                n(0, 0),
              r = e.select("defs"),
              i = null != r && r.node;
            return i || (i = f("defs", e.node).node), i;
          }),
          (n._.getSomeSVG = s),
          (n.select = function(t) {
            return (
              (t = m(t).replace(/([^\\]):/g, "$1\\:")),
              d(p.doc.querySelector(t))
            );
          }),
          (n.selectAll = function(t) {
            for (
              var e = p.doc.querySelectorAll(t), r = (n.set || Array)(), i = 0;
              i < e.length;
              i++
            )
              r.push(d(e[i]));
            return r;
          }),
          setInterval(function() {
            for (var t in R)
              if (R[v](t)) {
                var e = R[t],
                  n = e.node;
                (("svg" != e.type && !n.ownerSVGElement) ||
                  ("svg" == e.type &&
                    (!n.parentNode ||
                      ("ownerSVGElement" in n.parentNode &&
                        !n.ownerSVGElement)))) &&
                  delete R[t];
              }
          }, 1e4),
          (u.prototype.attr = function(t, n) {
            var r = this,
              o = r.node;
            if (!t) {
              if (1 != o.nodeType) return { text: o.nodeValue };
              for (
                var a = o.attributes, s = {}, l = 0, u = a.length;
                u > l;
                l++
              )
                s[a[l].nodeName] = a[l].nodeValue;
              return s;
            }
            if (i(t, "string")) {
              if (!(arguments.length > 1))
                return e("snap.util.getattr." + t, r).firstDefined();
              var c = {};
              (c[t] = n), (t = c);
            }
            for (var f in t) t[v](f) && e("snap.util.attr." + f, r, t[f]);
            return r;
          }),
          (n.parse = function(t) {
            var e = p.doc.createDocumentFragment(),
              n = !0,
              r = p.doc.createElement("div");
            if (
              ((t = m(t)).match(/^\s*<\s*svg(?:\s|>)/) ||
                ((t = "<svg>" + t + "</svg>"), (n = !1)),
              (r.innerHTML = t),
              (t = r.getElementsByTagName("svg")[0]))
            )
              if (n) e = t;
              else for (; t.firstChild; ) e.appendChild(t.firstChild);
            return new c(e);
          }),
          (n.fragment = function() {
            for (
              var t = Array.prototype.slice.call(arguments, 0),
                e = p.doc.createDocumentFragment(),
                r = 0,
                i = t.length;
              i > r;
              r++
            ) {
              var o = t[r];
              o.node && o.node.nodeType && e.appendChild(o.node),
                o.nodeType && e.appendChild(o),
                "string" == typeof o && e.appendChild(n.parse(o).node);
            }
            return new c(e);
          }),
          (n._.make = f),
          (n._.wrap = d),
          (h.prototype.el = function(t, e) {
            var n = f(t, this.node);
            return e && n.attr(e), n;
          }),
          (u.prototype.children = function() {
            for (
              var t = [], e = this.node.childNodes, r = 0, i = e.length;
              i > r;
              r++
            )
              t[r] = n(e[r]);
            return t;
          }),
          (u.prototype.toJSON = function() {
            var t = [];
            return (
              (function t(e, n) {
                for (var r = 0, i = e.length; i > r; r++) {
                  var o = { type: e[r].type, attr: e[r].attr() },
                    a = e[r].children();
                  n.push(o), a.length && t(a, (o.childNodes = []));
                }
              })([this], t),
              t[0]
            );
          }),
          e.on("snap.util.getattr", function() {
            var t = e.nt(),
              n = (t = t.substring(t.lastIndexOf(".") + 1)).replace(
                /[A-Z]/g,
                function(t) {
                  return "-" + t.toLowerCase();
                }
              );
            return z[v](n)
              ? this.node.ownerDocument.defaultView
                  .getComputedStyle(this.node, null)
                  .getPropertyValue(n)
              : r(this.node, t);
          });
        var z = {
          "alignment-baseline": 0,
          "baseline-shift": 0,
          clip: 0,
          "clip-path": 0,
          "clip-rule": 0,
          color: 0,
          "color-interpolation": 0,
          "color-interpolation-filters": 0,
          "color-profile": 0,
          "color-rendering": 0,
          cursor: 0,
          direction: 0,
          display: 0,
          "dominant-baseline": 0,
          "enable-background": 0,
          fill: 0,
          "fill-opacity": 0,
          "fill-rule": 0,
          filter: 0,
          "flood-color": 0,
          "flood-opacity": 0,
          font: 0,
          "font-family": 0,
          "font-size": 0,
          "font-size-adjust": 0,
          "font-stretch": 0,
          "font-style": 0,
          "font-variant": 0,
          "font-weight": 0,
          "glyph-orientation-horizontal": 0,
          "glyph-orientation-vertical": 0,
          "image-rendering": 0,
          kerning: 0,
          "letter-spacing": 0,
          "lighting-color": 0,
          marker: 0,
          "marker-end": 0,
          "marker-mid": 0,
          "marker-start": 0,
          mask: 0,
          opacity: 0,
          overflow: 0,
          "pointer-events": 0,
          "shape-rendering": 0,
          "stop-color": 0,
          "stop-opacity": 0,
          stroke: 0,
          "stroke-dasharray": 0,
          "stroke-dashoffset": 0,
          "stroke-linecap": 0,
          "stroke-linejoin": 0,
          "stroke-miterlimit": 0,
          "stroke-opacity": 0,
          "stroke-width": 0,
          "text-anchor": 0,
          "text-decoration": 0,
          "text-rendering": 0,
          "unicode-bidi": 0,
          visibility: 0,
          "word-spacing": 0,
          "writing-mode": 0
        };
        e.on("snap.util.attr", function(t) {
          var n = e.nt(),
            i = {};
          i[(n = n.substring(n.lastIndexOf(".") + 1))] = t;
          var o = n.replace(/-(\w)/gi, function(t, e) {
              return e.toUpperCase();
            }),
            a = n.replace(/[A-Z]/g, function(t) {
              return "-" + t.toLowerCase();
            });
          z[v](a) ? (this.node.style[o] = null == t ? S : t) : r(this.node, i);
        }),
          h.prototype,
          (n.ajax = function(t, n, r, o) {
            var a = new XMLHttpRequest(),
              s = L();
            if (a) {
              if (i(n, "function")) (o = r), (r = n), (n = null);
              else if (i(n, "object")) {
                var l = [];
                for (var u in n)
                  n.hasOwnProperty(u) &&
                    l.push(
                      encodeURIComponent(u) + "=" + encodeURIComponent(n[u])
                    );
                n = l.join("&");
              }
              return (
                a.open(n ? "POST" : "GET", t, !0),
                n &&
                  (a.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
                  a.setRequestHeader(
                    "Content-type",
                    "application/x-www-form-urlencoded"
                  )),
                r &&
                  (e.once("snap.ajax." + s + ".0", r),
                  e.once("snap.ajax." + s + ".200", r),
                  e.once("snap.ajax." + s + ".304", r)),
                (a.onreadystatechange = function() {
                  4 == a.readyState &&
                    e("snap.ajax." + s + "." + a.status, o, a);
                }),
                4 == a.readyState ? a : (a.send(n), a)
              );
            }
          }),
          (n.load = function(t, e, r) {
            n.ajax(t, function(t) {
              var i = n.parse(t.responseText);
              r ? e.call(r, i) : e(i);
            });
          });
        var G = function(t) {
          var e = t.getBoundingClientRect(),
            n = t.ownerDocument,
            r = n.body,
            i = n.documentElement,
            o = i.clientTop || r.clientTop || 0,
            a = i.clientLeft || r.clientLeft || 0;
          return {
            y: e.top + (g.win.pageYOffset || i.scrollTop || r.scrollTop) - o,
            x: e.left + (g.win.pageXOffset || i.scrollLeft || r.scrollLeft) - a
          };
        };
        return (
          (n.getElementByPoint = function(t, e) {
            var n = (this.canvas, p.doc.elementFromPoint(t, e));
            if (p.win.opera && "svg" == n.tagName) {
              var r = G(n),
                i = n.createSVGRect();
              (i.x = t - r.x), (i.y = e - r.y), (i.width = i.height = 1);
              var o = n.getIntersectionList(i, null);
              o.length && (n = o[o.length - 1]);
            }
            return n ? d(n) : null;
          }),
          (n.plugin = function(t) {
            t(n, u, h, p, c);
          }),
          (p.win.Snap = n),
          n
        );
      })(t || this);
    return (
      r.plugin(function(n, r, i, o, a) {
        function s(t, e) {
          if (null == e) {
            var r = !0;
            if (
              !(e =
                "linearGradient" == t.type || "radialGradient" == t.type
                  ? t.node.getAttribute("gradientTransform")
                  : "pattern" == t.type
                    ? t.node.getAttribute("patternTransform")
                    : t.node.getAttribute("transform"))
            )
              return new n.Matrix();
            e = n._.svgTransform2string(e);
          } else (e = n._.rgTransform.test(e) ? f(e).replace(/\.{3}|\u2026/g, t._.transform || "") : n._.svgTransform2string(e)), c(e, "array") && (e = n.path ? n.path.toString.call(e) : f(e)), (t._.transform = e);
          var i = n._.transform2matrix(e, t.getBBox(1));
          return r ? i : void (t.matrix = i);
        }
        function l(t) {
          return function() {
            var e = t ? "<" + this.type : "",
              n = this.node.attributes,
              r = this.node.childNodes;
            if (t)
              for (var i = 0, o = n.length; o > i; i++)
                e +=
                  " " +
                  n[i].name +
                  '="' +
                  n[i].value.replace(/"/g, '\\"') +
                  '"';
            if (r.length) {
              for (t && (e += ">"), i = 0, o = r.length; o > i; i++)
                3 == r[i].nodeType
                  ? (e += r[i].nodeValue)
                  : 1 == r[i].nodeType && (e += v(r[i]).toString());
              t && (e += "</" + this.type + ">");
            } else t && (e += "/>");
            return e;
          };
        }
        var u = r.prototype,
          c = n.is,
          f = String,
          h = n._unit2px,
          d = n._.$,
          p = n._.make,
          g = n._.getSomeDefs,
          v = n._.wrap;
        u.getBBox = function(t) {
          if ("tspan" == this.type)
            return n._.box(this.node.getClientRects().item(0));
          if (!n.Matrix || !n.path) return this.node.getBBox();
          var e = this,
            r = new n.Matrix();
          if (e.removed) return n._.box();
          for (; "use" == e.type; )
            if (
              (t ||
                (r = r.add(
                  e
                    .transform()
                    .localMatrix.translate(e.attr("x") || 0, e.attr("y") || 0)
                )),
              e.original)
            )
              e = e.original;
            else {
              var i = e.attr("xlink:href");
              e = e.original = e.node.ownerDocument.getElementById(
                i.substring(i.indexOf("#") + 1)
              );
            }
          var o = e._,
            a = n.path.get[e.type] || n.path.get.deflt;
          try {
            return t
              ? ((o.bboxwt = a
                  ? n.path.getBBox((e.realPath = a(e)))
                  : n._.box(e.node.getBBox())),
                n._.box(o.bboxwt))
              : ((e.realPath = a(e)),
                (e.matrix = e.transform().localMatrix),
                (o.bbox = n.path.getBBox(
                  n.path.map(e.realPath, r.add(e.matrix))
                )),
                n._.box(o.bbox));
          } catch (t) {
            return n._.box();
          }
        };
        var m = function() {
          return this.string;
        };
        (u.transform = function(t) {
          var e = this._;
          if (null == t) {
            for (
              var r,
                i = this,
                o = new n.Matrix(this.node.getCTM()),
                a = s(this),
                l = [a],
                u = new n.Matrix(),
                c = a.toTransformString(),
                h = f(a) == f(this.matrix) ? f(e.transform) : c;
              "svg" != i.type && (i = i.parent());

            )
              l.push(s(i));
            for (r = l.length; r--; ) u.add(l[r]);
            return {
              string: h,
              globalMatrix: o,
              totalMatrix: u,
              localMatrix: a,
              diffMatrix: o.clone().add(a.invert()),
              global: o.toTransformString(),
              total: u.toTransformString(),
              local: c,
              toString: m
            };
          }
          return (
            t instanceof n.Matrix
              ? ((this.matrix = t), (this._.transform = t.toTransformString()))
              : s(this, t),
            this.node &&
              ("linearGradient" == this.type || "radialGradient" == this.type
                ? d(this.node, { gradientTransform: this.matrix })
                : "pattern" == this.type
                  ? d(this.node, { patternTransform: this.matrix })
                  : d(this.node, { transform: this.matrix })),
            this
          );
        }),
          (u.parent = function() {
            return v(this.node.parentNode);
          }),
          (u.append = u.add = function(t) {
            if (t) {
              if ("set" == t.type) {
                var e = this;
                return (
                  t.forEach(function(t) {
                    e.add(t);
                  }),
                  this
                );
              }
              (t = v(t)), this.node.appendChild(t.node), (t.paper = this.paper);
            }
            return this;
          }),
          (u.appendTo = function(t) {
            return t && (t = v(t)).append(this), this;
          }),
          (u.prepend = function(t) {
            if (t) {
              if ("set" == t.type) {
                var e,
                  n = this;
                return (
                  t.forEach(function(t) {
                    e ? e.after(t) : n.prepend(t), (e = t);
                  }),
                  this
                );
              }
              var r = (t = v(t)).parent();
              this.node.insertBefore(t.node, this.node.firstChild),
                this.add && this.add(),
                (t.paper = this.paper),
                this.parent() && this.parent().add(),
                r && r.add();
            }
            return this;
          }),
          (u.prependTo = function(t) {
            return (t = v(t)).prepend(this), this;
          }),
          (u.before = function(t) {
            if ("set" == t.type) {
              var e = this;
              return (
                t.forEach(function(t) {
                  var n = t.parent();
                  e.node.parentNode.insertBefore(t.node, e.node), n && n.add();
                }),
                this.parent().add(),
                this
              );
            }
            var n = (t = v(t)).parent();
            return (
              this.node.parentNode.insertBefore(t.node, this.node),
              this.parent() && this.parent().add(),
              n && n.add(),
              (t.paper = this.paper),
              this
            );
          }),
          (u.after = function(t) {
            var e = (t = v(t)).parent();
            return (
              this.node.nextSibling
                ? this.node.parentNode.insertBefore(
                    t.node,
                    this.node.nextSibling
                  )
                : this.node.parentNode.appendChild(t.node),
              this.parent() && this.parent().add(),
              e && e.add(),
              (t.paper = this.paper),
              this
            );
          }),
          (u.insertBefore = function(t) {
            t = v(t);
            var e = this.parent();
            return (
              t.node.parentNode.insertBefore(this.node, t.node),
              (this.paper = t.paper),
              e && e.add(),
              t.parent() && t.parent().add(),
              this
            );
          }),
          (u.insertAfter = function(t) {
            t = v(t);
            var e = this.parent();
            return (
              t.node.parentNode.insertBefore(this.node, t.node.nextSibling),
              (this.paper = t.paper),
              e && e.add(),
              t.parent() && t.parent().add(),
              this
            );
          }),
          (u.remove = function() {
            var t = this.parent();
            return (
              this.node.parentNode &&
                this.node.parentNode.removeChild(this.node),
              delete this.paper,
              (this.removed = !0),
              t && t.add(),
              this
            );
          }),
          (u.select = function(t) {
            return v(this.node.querySelector(t));
          }),
          (u.selectAll = function(t) {
            for (
              var e = this.node.querySelectorAll(t),
                r = (n.set || Array)(),
                i = 0;
              i < e.length;
              i++
            )
              r.push(v(e[i]));
            return r;
          }),
          (u.asPX = function(t, e) {
            return null == e && (e = this.attr(t)), +h(this, t, e);
          }),
          (u.use = function() {
            var t,
              e = this.node.id;
            return (
              e || ((e = this.id), d(this.node, { id: e })),
              (t =
                "linearGradient" == this.type ||
                "radialGradient" == this.type ||
                "pattern" == this.type
                  ? p(this.type, this.node.parentNode)
                  : p("use", this.node.parentNode)),
              d(t.node, { "xlink:href": "#" + e }),
              (t.original = this),
              t
            );
          }),
          (u.clone = function() {
            var t = v(this.node.cloneNode(!0));
            return (
              d(t.node, "id") && d(t.node, { id: t.id }),
              (function(t) {
                function e(t, e) {
                  var r = d(t.node, e);
                  (r = (r = r && r.match(a)) && r[2]) &&
                    "#" == r.charAt() &&
                    (r = r.substring(1)) &&
                    (l[r] = (l[r] || []).concat(function(r) {
                      var i = {};
                      (i[e] = n.url(r)), d(t.node, i);
                    }));
                }
                function r(t) {
                  var e = d(t.node, "xlink:href");
                  e &&
                    "#" == e.charAt() &&
                    (e = e.substring(1)) &&
                    (l[e] = (l[e] || []).concat(function(e) {
                      t.attr("xlink:href", "#" + e);
                    }));
                }
                for (
                  var i,
                    o = t.selectAll("*"),
                    a = /^\s*url\(("|'|)(.*)\1\)\s*$/,
                    s = [],
                    l = {},
                    u = 0,
                    c = o.length;
                  c > u;
                  u++
                ) {
                  e((i = o[u]), "fill"),
                    e(i, "stroke"),
                    e(i, "filter"),
                    e(i, "mask"),
                    e(i, "clip-path"),
                    r(i);
                  var f = d(i.node, "id");
                  f && (d(i.node, { id: i.id }), s.push({ old: f, id: i.id }));
                }
                for (u = 0, c = s.length; c > u; u++) {
                  var h = l[s[u].old];
                  if (h)
                    for (var p = 0, g = h.length; g > p; p++) h[p](s[u].id);
                }
              })(t),
              t.insertAfter(this),
              t
            );
          }),
          (u.toDefs = function() {
            return g(this).appendChild(this.node), this;
          }),
          (u.pattern = u.toPattern = function(t, e, n, r) {
            var i = p("pattern", g(this));
            return (
              null == t && (t = this.getBBox()),
              c(t, "object") &&
                "x" in t &&
                ((e = t.y), (n = t.width), (r = t.height), (t = t.x)),
              d(i.node, {
                x: t,
                y: e,
                width: n,
                height: r,
                patternUnits: "userSpaceOnUse",
                id: i.id,
                viewBox: [t, e, n, r].join(" ")
              }),
              i.node.appendChild(this.node),
              i
            );
          }),
          (u.marker = function(t, e, n, r, i, o) {
            var a = p("marker", g(this));
            return (
              null == t && (t = this.getBBox()),
              c(t, "object") &&
                "x" in t &&
                ((e = t.y),
                (n = t.width),
                (r = t.height),
                (i = t.refX || t.cx),
                (o = t.refY || t.cy),
                (t = t.x)),
              d(a.node, {
                viewBox: [t, e, n, r].join(" "),
                markerWidth: n,
                markerHeight: r,
                orient: "auto",
                refX: i || 0,
                refY: o || 0,
                id: a.id
              }),
              a.node.appendChild(this.node),
              a
            );
          });
        var y = {};
        (u.data = function(t, r) {
          var i = (y[this.id] = y[this.id] || {});
          if (0 == arguments.length)
            return e("snap.data.get." + this.id, this, i, null), i;
          if (1 == arguments.length) {
            if (n.is(t, "object")) {
              for (var o in t) t.hasOwnProperty(o) && this.data(o, t[o]);
              return this;
            }
            return e("snap.data.get." + this.id, this, i[t], t), i[t];
          }
          return (i[t] = r), e("snap.data.set." + this.id, this, r, t), this;
        }),
          (u.removeData = function(t) {
            return (
              null == t
                ? (y[this.id] = {})
                : y[this.id] && delete y[this.id][t],
              this
            );
          }),
          (u.outerSVG = u.toString = l(1)),
          (u.innerSVG = l()),
          (u.toDataURL = function() {
            if (t && t.btoa) {
              var e = this.getBBox(),
                r = n.format(
                  '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{width}" height="{height}" viewBox="{x} {y} {width} {height}">{contents}</svg>',
                  {
                    x: +e.x.toFixed(3),
                    y: +e.y.toFixed(3),
                    width: +e.width.toFixed(3),
                    height: +e.height.toFixed(3),
                    contents: this.outerSVG()
                  }
                );
              return (
                "data:image/svg+xml;base64," +
                btoa(unescape(encodeURIComponent(r)))
              );
            }
          }),
          (a.prototype.select = u.select),
          (a.prototype.selectAll = u.selectAll);
      }),
      r.plugin(function(t, r, i, o, a) {
        function s(t, e, n) {
          return function(r) {
            var i = r.slice(t, e);
            return 1 == i.length && (i = i[0]), n ? n(i) : i;
          };
        }
        var l = r.prototype,
          u = t.is,
          c = String,
          f = "hasOwnProperty",
          h = function(t, e, r, i) {
            "function" != typeof r || r.length || ((i = r), (r = n.linear)),
              (this.attr = t),
              (this.dur = e),
              r && (this.easing = r),
              i && (this.callback = i);
          };
        (t._.Animation = h),
          (t.animation = function(t, e, n, r) {
            return new h(t, e, n, r);
          }),
          (l.inAnim = function() {
            var t = this,
              e = [];
            for (var n in t.anims)
              t.anims[f](n) &&
                (function(t) {
                  e.push({
                    anim: new h(t._attrs, t.dur, t.easing, t._callback),
                    mina: t,
                    curStatus: t.status(),
                    status: function(e) {
                      return t.status(e);
                    },
                    stop: function() {
                      t.stop();
                    }
                  });
                })(t.anims[n]);
            return e;
          }),
          (t.animate = function(t, r, i, o, a, s) {
            "function" != typeof a || a.length || ((s = a), (a = n.linear));
            var l = n.time(),
              u = n(t, r, l, l + o, n.time, i, a);
            return s && e.once("mina.finish." + u.id, s), u;
          }),
          (l.stop = function() {
            for (var t = this.inAnim(), e = 0, n = t.length; n > e; e++)
              t[e].stop();
            return this;
          }),
          (l.animate = function(t, r, i, o) {
            "function" != typeof i || i.length || ((o = i), (i = n.linear)),
              t instanceof h &&
                ((o = t.callback), (i = t.easing), (r = t.dur), (t = t.attr));
            var a,
              l,
              d,
              p,
              g = [],
              v = [],
              m = {},
              y = this;
            for (var b in t)
              if (t[f](b)) {
                y.equal
                  ? ((a = (p = y.equal(b, c(t[b]))).from),
                    (l = p.to),
                    (d = p.f))
                  : ((a = +y.attr(b)), (l = +t[b]));
                var x = u(a, "array") ? a.length : 1;
                (m[b] = s(g.length, g.length + x, d)),
                  (g = g.concat(a)),
                  (v = v.concat(l));
              }
            var w = n.time(),
              C = n(
                g,
                v,
                w,
                w + r,
                n.time,
                function(t) {
                  var e = {};
                  for (var n in m) m[f](n) && (e[n] = m[n](t));
                  y.attr(e);
                },
                i
              );
            return (
              (y.anims[C.id] = C),
              (C._attrs = t),
              (C._callback = o),
              e("snap.animcreated." + y.id, C),
              e.once("mina.finish." + C.id, function() {
                e.off("mina.*." + C.id), delete y.anims[C.id], o && o.call(y);
              }),
              e.once("mina.stop." + C.id, function() {
                e.off("mina.*." + C.id), delete y.anims[C.id];
              }),
              y
            );
          });
      }),
      r.plugin(function(t, e, n, r, i) {
        function o(t, e, n, r, i, o) {
          return null == e && "[object SVGMatrix]" == a.call(t)
            ? ((this.a = t.a),
              (this.b = t.b),
              (this.c = t.c),
              (this.d = t.d),
              (this.e = t.e),
              void (this.f = t.f))
            : void (null != t
                ? ((this.a = +t),
                  (this.b = +e),
                  (this.c = +n),
                  (this.d = +r),
                  (this.e = +i),
                  (this.f = +o))
                : ((this.a = 1),
                  (this.b = 0),
                  (this.c = 0),
                  (this.d = 1),
                  (this.e = 0),
                  (this.f = 0)));
        }
        var a = Object.prototype.toString,
          s = String,
          l = Math;
        !(function(e) {
          function n(t) {
            return t[0] * t[0] + t[1] * t[1];
          }
          function r(t) {
            var e = l.sqrt(n(t));
            t[0] && (t[0] /= e), t[1] && (t[1] /= e);
          }
          (e.add = function(t, e, n, r, i, a) {
            if (t && t instanceof o)
              return this.add(t.a, t.b, t.c, t.d, t.e, t.f);
            var s = t * this.a + e * this.c,
              l = t * this.b + e * this.d;
            return (
              (this.e += i * this.a + a * this.c),
              (this.f += i * this.b + a * this.d),
              (this.c = n * this.a + r * this.c),
              (this.d = n * this.b + r * this.d),
              (this.a = s),
              (this.b = l),
              this
            );
          }),
            (o.prototype.multLeft = function(t, e, n, r, i, a) {
              if (t && t instanceof o)
                return this.multLeft(t.a, t.b, t.c, t.d, t.e, t.f);
              var s = t * this.a + n * this.b,
                l = t * this.c + n * this.d,
                u = t * this.e + n * this.f + i;
              return (
                (this.b = e * this.a + r * this.b),
                (this.d = e * this.c + r * this.d),
                (this.f = e * this.e + r * this.f + a),
                (this.a = s),
                (this.c = l),
                (this.e = u),
                this
              );
            }),
            (e.invert = function() {
              var t = this,
                e = t.a * t.d - t.b * t.c;
              return new o(
                t.d / e,
                -t.b / e,
                -t.c / e,
                t.a / e,
                (t.c * t.f - t.d * t.e) / e,
                (t.b * t.e - t.a * t.f) / e
              );
            }),
            (e.clone = function() {
              return new o(this.a, this.b, this.c, this.d, this.e, this.f);
            }),
            (e.translate = function(t, e) {
              return (
                (this.e += t * this.a + e * this.c),
                (this.f += t * this.b + e * this.d),
                this
              );
            }),
            (e.scale = function(t, e, n, r) {
              return (
                null == e && (e = t),
                (n || r) && this.translate(n, r),
                (this.a *= t),
                (this.b *= t),
                (this.c *= e),
                (this.d *= e),
                (n || r) && this.translate(-n, -r),
                this
              );
            }),
            (e.rotate = function(e, n, r) {
              (e = t.rad(e)), (n = n || 0), (r = r || 0);
              var i = +l.cos(e).toFixed(9),
                o = +l.sin(e).toFixed(9);
              return this.add(i, o, -o, i, n, r), this.add(1, 0, 0, 1, -n, -r);
            }),
            (e.skewX = function(t) {
              return this.skew(t, 0);
            }),
            (e.skewY = function(t) {
              return this.skew(0, t);
            }),
            (e.skew = function(e, n) {
              (e = e || 0), (n = n || 0), (e = t.rad(e)), (n = t.rad(n));
              var r = l.tan(e).toFixed(9),
                i = l.tan(n).toFixed(9);
              return this.add(1, i, r, 1, 0, 0);
            }),
            (e.x = function(t, e) {
              return t * this.a + e * this.c + this.e;
            }),
            (e.y = function(t, e) {
              return t * this.b + e * this.d + this.f;
            }),
            (e.get = function(t) {
              return +this[s.fromCharCode(97 + t)].toFixed(4);
            }),
            (e.toString = function() {
              return (
                "matrix(" +
                [
                  this.get(0),
                  this.get(1),
                  this.get(2),
                  this.get(3),
                  this.get(4),
                  this.get(5)
                ].join() +
                ")"
              );
            }),
            (e.offset = function() {
              return [this.e.toFixed(4), this.f.toFixed(4)];
            }),
            (e.determinant = function() {
              return this.a * this.d - this.b * this.c;
            }),
            (e.split = function() {
              var e = {};
              (e.dx = this.e), (e.dy = this.f);
              var i = [[this.a, this.b], [this.c, this.d]];
              (e.scalex = l.sqrt(n(i[0]))),
                r(i[0]),
                (e.shear = i[0][0] * i[1][0] + i[0][1] * i[1][1]),
                (i[1] = [
                  i[1][0] - i[0][0] * e.shear,
                  i[1][1] - i[0][1] * e.shear
                ]),
                (e.scaley = l.sqrt(n(i[1]))),
                r(i[1]),
                (e.shear /= e.scaley),
                this.determinant() < 0 && (e.scalex = -e.scalex);
              var o = i[0][1],
                a = i[1][1];
              return (
                0 > a
                  ? ((e.rotate = t.deg(l.acos(a))),
                    0 > o && (e.rotate = 360 - e.rotate))
                  : (e.rotate = t.deg(l.asin(o))),
                (e.isSimple = !(
                  +e.shear.toFixed(9) ||
                  (e.scalex.toFixed(9) != e.scaley.toFixed(9) && e.rotate)
                )),
                (e.isSuperSimple =
                  !+e.shear.toFixed(9) &&
                  e.scalex.toFixed(9) == e.scaley.toFixed(9) &&
                  !e.rotate),
                (e.noRotation = !+e.shear.toFixed(9) && !e.rotate),
                e
              );
            }),
            (e.toTransformString = function(t) {
              var e = t || this.split();
              return +e.shear.toFixed(9)
                ? "m" +
                    [
                      this.get(0),
                      this.get(1),
                      this.get(2),
                      this.get(3),
                      this.get(4),
                      this.get(5)
                    ]
                : ((e.scalex = +e.scalex.toFixed(4)),
                  (e.scaley = +e.scaley.toFixed(4)),
                  (e.rotate = +e.rotate.toFixed(4)),
                  (e.dx || e.dy
                    ? "t" + [+e.dx.toFixed(4), +e.dy.toFixed(4)]
                    : "") +
                    (e.rotate ? "r" + [+e.rotate.toFixed(4), 0, 0] : "") +
                    (1 != e.scalex || 1 != e.scaley
                      ? "s" + [e.scalex, e.scaley, 0, 0]
                      : ""));
            });
        })(o.prototype),
          (t.Matrix = o),
          (t.matrix = function(t, e, n, r, i, a) {
            return new o(t, e, n, r, i, a);
          });
      }),
      r.plugin(function(t, n, r, i, o) {
        function a(r) {
          return function(i) {
            if (
              (e.stop(),
              i instanceof o &&
                1 == i.node.childNodes.length &&
                ("radialGradient" == i.node.firstChild.tagName ||
                  "linearGradient" == i.node.firstChild.tagName ||
                  "pattern" == i.node.firstChild.tagName) &&
                ((i = i.node.firstChild), h(this).appendChild(i), (i = c(i))),
              i instanceof n)
            )
              if (
                "radialGradient" == i.type ||
                "linearGradient" == i.type ||
                "pattern" == i.type
              ) {
                i.node.id || p(i.node, { id: i.id });
                var a = g(i.node.id);
              } else a = i.attr(r);
            else if ((a = t.color(i)).error) {
              var s = t(h(this).ownerSVGElement).gradient(i);
              s
                ? (s.node.id || p(s.node, { id: s.id }), (a = g(s.node.id)))
                : (a = i);
            } else a = v(a);
            var l = {};
            (l[r] = a), p(this.node, l), (this.node.style[r] = y);
          };
        }
        function s(t) {
          e.stop(), t == +t && (t += "px"), (this.node.style.fontSize = t);
        }
        function l() {
          return e.stop(), this.node.style.fontSize;
        }
        var u = t._.make,
          c = t._.wrap,
          f = t.is,
          h = t._.getSomeDefs,
          d = /^url\((['"]?)([^)]+)\1\)$/,
          p = t._.$,
          g = t.url,
          v = String,
          m = t._.separator,
          y = "";
        (t.deurl = function(t) {
          var e = String(t).match(d);
          return e ? e[2] : t;
        }),
          e.on("snap.util.attr.mask", function(t) {
            if (t instanceof n || t instanceof o) {
              if (
                (e.stop(),
                t instanceof o &&
                  1 == t.node.childNodes.length &&
                  ((t = t.node.firstChild), h(this).appendChild(t), (t = c(t))),
                "mask" == t.type)
              )
                var r = t;
              else (r = u("mask", h(this))).node.appendChild(t.node);
              !r.node.id && p(r.node, { id: r.id }),
                p(this.node, { mask: g(r.id) });
            }
          }),
          (function(t) {
            e.on("snap.util.attr.clip", t),
              e.on("snap.util.attr.clip-path", t),
              e.on("snap.util.attr.clipPath", t);
          })(function(t) {
            if (t instanceof n || t instanceof o) {
              e.stop();
              for (var r, i = t.node; i; ) {
                if ("clipPath" === i.nodeName) {
                  r = new n(i);
                  break;
                }
                if ("svg" === i.nodeName) {
                  r = void 0;
                  break;
                }
                i = i.parentNode;
              }
              r ||
                ((r = u("clipPath", h(this))).node.appendChild(t.node),
                !r.node.id && p(r.node, { id: r.id })),
                p(this.node, { "clip-path": g(r.node.id || r.id) });
            }
          }),
          e.on("snap.util.attr.fill", a("fill")),
          e.on("snap.util.attr.stroke", a("stroke"));
        var b = /^([lr])(?:\(([^)]*)\))?(.*)$/i;
        e.on("snap.util.grad.parse", function(t) {
          function e(t, e) {
            for (var n = (e - s) / (t - l), r = l; t > r; r++)
              o[r].offset = +(+s + n * (r - l)).toFixed(2);
            (l = t), (s = e);
          }
          var n = (t = v(t)).match(b);
          if (!n) return null;
          var r = n[1],
            i = n[2],
            o = n[3];
          1 ==
            (i = i.split(/\s*,\s*/).map(function(t) {
              return +t == t ? +t : t;
            })).length &&
            0 == i[0] &&
            (i = []);
          var a = (o = (o = o.split("-")).map(function(t) {
              var e = { color: (t = t.split(":"))[0] };
              return t[1] && (e.offset = parseFloat(t[1])), e;
            })).length,
            s = 0,
            l = 0;
          a--;
          for (var u = 0; a > u; u++) "offset" in o[u] && e(u, o[u].offset);
          return (
            (o[a].offset = o[a].offset || 100),
            e(a, o[a].offset),
            { type: r, params: i, stops: o }
          );
        }),
          e.on("snap.util.attr.d", function(n) {
            e.stop(),
              f(n, "array") &&
                f(n[0], "array") &&
                (n = t.path.toString.call(n)),
              (n = v(n)).match(/[ruo]/i) && (n = t.path.toAbsolute(n)),
              p(this.node, { d: n });
          })(-1),
          e.on("snap.util.attr.#text", function(t) {
            e.stop(), (t = v(t));
            for (var n = i.doc.createTextNode(t); this.node.firstChild; )
              this.node.removeChild(this.node.firstChild);
            this.node.appendChild(n);
          })(-1),
          e.on("snap.util.attr.path", function(t) {
            e.stop(), this.attr({ d: t });
          })(-1),
          e.on("snap.util.attr.class", function(t) {
            e.stop(), (this.node.className.baseVal = t);
          })(-1),
          e.on("snap.util.attr.viewBox", function(t) {
            var n;
            (n =
              f(t, "object") && "x" in t
                ? [t.x, t.y, t.width, t.height].join(" ")
                : f(t, "array")
                  ? t.join(" ")
                  : t),
              p(this.node, { viewBox: n }),
              e.stop();
          })(-1),
          e.on("snap.util.attr.transform", function(t) {
            this.transform(t), e.stop();
          })(-1),
          e.on("snap.util.attr.r", function(t) {
            "rect" == this.type && (e.stop(), p(this.node, { rx: t, ry: t }));
          })(-1),
          e.on("snap.util.attr.textpath", function(t) {
            if ((e.stop(), "text" == this.type)) {
              var r, i, o;
              if (!t && this.textPath) {
                for (i = this.textPath; i.node.firstChild; )
                  this.node.appendChild(i.node.firstChild);
                return i.remove(), void delete this.textPath;
              }
              if (f(t, "string")) {
                var a = h(this),
                  s = c(a.parentNode).path(t);
                a.appendChild(s.node), (r = s.id), s.attr({ id: r });
              } else
                (t = c(t)) instanceof n &&
                  ((r = t.attr("id")) || ((r = t.id), t.attr({ id: r })));
              if (r)
                if (((i = this.textPath), (o = this.node), i))
                  i.attr({ "xlink:href": "#" + r });
                else {
                  for (
                    i = p("textPath", { "xlink:href": "#" + r });
                    o.firstChild;

                  )
                    i.appendChild(o.firstChild);
                  o.appendChild(i), (this.textPath = c(i));
                }
            }
          })(-1),
          e.on("snap.util.attr.text", function(t) {
            if ("text" == this.type) {
              for (
                var n = this.node,
                  r = function(t) {
                    var e = p("tspan");
                    if (f(t, "array"))
                      for (var n = 0; n < t.length; n++) e.appendChild(r(t[n]));
                    else e.appendChild(i.doc.createTextNode(t));
                    return e.normalize && e.normalize(), e;
                  };
                n.firstChild;

              )
                n.removeChild(n.firstChild);
              for (var o = r(t); o.firstChild; ) n.appendChild(o.firstChild);
            }
            e.stop();
          })(-1),
          e.on("snap.util.attr.fontSize", s)(-1),
          e.on("snap.util.attr.font-size", s)(-1),
          e.on("snap.util.getattr.transform", function() {
            return e.stop(), this.transform();
          })(-1),
          e.on("snap.util.getattr.textpath", function() {
            return e.stop(), this.textPath;
          })(-1),
          (function() {
            function n(n) {
              return function() {
                e.stop();
                var r = i.doc.defaultView
                  .getComputedStyle(this.node, null)
                  .getPropertyValue("marker-" + n);
                return "none" == r ? r : t(i.doc.getElementById(r.match(d)[1]));
              };
            }
            function r(t) {
              return function(n) {
                e.stop();
                var r = "marker" + t.charAt(0).toUpperCase() + t.substring(1);
                if ("" != n && n) {
                  if ("marker" == n.type) {
                    var i = n.node.id;
                    return (
                      i || p(n.node, { id: n.id }),
                      void (this.node.style[r] = g(i))
                    );
                  }
                } else this.node.style[r] = "none";
              };
            }
            e.on("snap.util.getattr.marker-end", n("end"))(-1),
              e.on("snap.util.getattr.markerEnd", n("end"))(-1),
              e.on("snap.util.getattr.marker-start", n("start"))(-1),
              e.on("snap.util.getattr.markerStart", n("start"))(-1),
              e.on("snap.util.getattr.marker-mid", n("mid"))(-1),
              e.on("snap.util.getattr.markerMid", n("mid"))(-1),
              e.on("snap.util.attr.marker-end", r("end"))(-1),
              e.on("snap.util.attr.markerEnd", r("end"))(-1),
              e.on("snap.util.attr.marker-start", r("start"))(-1),
              e.on("snap.util.attr.markerStart", r("start"))(-1),
              e.on("snap.util.attr.marker-mid", r("mid"))(-1),
              e.on("snap.util.attr.markerMid", r("mid"))(-1);
          })(),
          e.on("snap.util.getattr.r", function() {
            return "rect" == this.type &&
              p(this.node, "rx") == p(this.node, "ry")
              ? (e.stop(), p(this.node, "rx"))
              : void 0;
          })(-1),
          e.on("snap.util.getattr.text", function() {
            if ("text" == this.type || "tspan" == this.type) {
              e.stop();
              var t = (function t(e) {
                for (
                  var n = [], r = e.childNodes, i = 0, o = r.length;
                  o > i;
                  i++
                ) {
                  var a = r[i];
                  3 == a.nodeType && n.push(a.nodeValue),
                    "tspan" == a.tagName &&
                      (1 == a.childNodes.length && 3 == a.firstChild.nodeType
                        ? n.push(a.firstChild.nodeValue)
                        : n.push(t(a)));
                }
                return n;
              })(this.node);
              return 1 == t.length ? t[0] : t;
            }
          })(-1),
          e.on("snap.util.getattr.#text", function() {
            return this.node.textContent;
          })(-1),
          e.on("snap.util.getattr.fill", function(n) {
            if (!n) {
              e.stop();
              var r = e("snap.util.getattr.fill", this, !0).firstDefined();
              return t(t.deurl(r)) || r;
            }
          })(-1),
          e.on("snap.util.getattr.stroke", function(n) {
            if (!n) {
              e.stop();
              var r = e("snap.util.getattr.stroke", this, !0).firstDefined();
              return t(t.deurl(r)) || r;
            }
          })(-1),
          e.on("snap.util.getattr.viewBox", function() {
            e.stop();
            var n = p(this.node, "viewBox");
            return n
              ? ((n = n.split(m)), t._.box(+n[0], +n[1], +n[2], +n[3]))
              : void 0;
          })(-1),
          e.on("snap.util.getattr.points", function() {
            var t = p(this.node, "points");
            return e.stop(), t ? t.split(m) : void 0;
          })(-1),
          e.on("snap.util.getattr.path", function() {
            var t = p(this.node, "d");
            return e.stop(), t;
          })(-1),
          e.on("snap.util.getattr.class", function() {
            return this.node.className.baseVal;
          })(-1),
          e.on("snap.util.getattr.fontSize", l)(-1),
          e.on("snap.util.getattr.font-size", l)(-1);
      }),
      r.plugin(function(t, e, n, r, i) {
        var o = /\S+/g,
          a = String,
          s = e.prototype;
        (s.addClass = function(t) {
          var e,
            n,
            r,
            i = a(t || "").match(o) || [],
            s = this.node,
            l = s.className.baseVal,
            u = l.match(o) || [];
          if (i.length) {
            for (e = 0; (n = i[e++]); ) ~u.indexOf(n) || u.push(n);
            l != (r = u.join(" ")) && (s.className.baseVal = r);
          }
          return this;
        }),
          (s.removeClass = function(t) {
            var e,
              n,
              r,
              i,
              s = a(t || "").match(o) || [],
              l = this.node,
              u = l.className.baseVal,
              c = u.match(o) || [];
            if (c.length) {
              for (e = 0; (r = s[e++]); ) ~(n = c.indexOf(r)) && c.splice(n, 1);
              u != (i = c.join(" ")) && (l.className.baseVal = i);
            }
            return this;
          }),
          (s.hasClass = function(t) {
            return !!~(this.node.className.baseVal.match(o) || []).indexOf(t);
          }),
          (s.toggleClass = function(t, e) {
            if (null != e) return e ? this.addClass(t) : this.removeClass(t);
            var n,
              r,
              i,
              a,
              s = (t || "").match(o) || [],
              l = this.node,
              u = l.className.baseVal,
              c = u.match(o) || [];
            for (n = 0; (i = s[n++]); )
              ~(r = c.indexOf(i)) ? c.splice(r, 1) : c.push(i);
            return u != (a = c.join(" ")) && (l.className.baseVal = a), this;
          });
      }),
      r.plugin(function(t, n, r, i, o) {
        function a(t) {
          return t;
        }
        var s = {
            "+": function(t, e) {
              return t + e;
            },
            "-": function(t, e) {
              return t - e;
            },
            "/": function(t, e) {
              return t / e;
            },
            "*": function(t, e) {
              return t * e;
            }
          },
          l = String,
          u = /[a-z]+$/i,
          c = /^\s*([+\-\/*])\s*=\s*([\d.eE+\-]+)\s*([^\d\s]+)?\s*$/;
        e.on("snap.util.attr", function(t) {
          var n = l(t).match(c);
          if (n) {
            var r = e.nt(),
              i = r.substring(r.lastIndexOf(".") + 1),
              o = this.attr(i),
              a = {};
            e.stop();
            var f = n[3] || "",
              h = o.match(u),
              d = s[n[1]];
            if (
              (h && h == f
                ? (t = d(parseFloat(o), +n[2]))
                : ((o = this.asPX(i)),
                  (t = d(this.asPX(i), this.asPX(i, n[2] + f)))),
              isNaN(o) || isNaN(t))
            )
              return;
            (a[i] = t), this.attr(a);
          }
        })(-10),
          e.on("snap.util.equal", function(t, n) {
            var r = l(this.attr(t) || ""),
              i = l(n).match(c);
            if (i) {
              e.stop();
              var o = i[3] || "",
                f = r.match(u),
                h = s[i[1]];
              return f && f == o
                ? {
                    from: parseFloat(r),
                    to: h(parseFloat(r), +i[2]),
                    f: (function(t) {
                      return function(e) {
                        return +e.toFixed(3) + t;
                      };
                    })(f)
                  }
                : {
                    from: (r = this.asPX(t)),
                    to: h(r, this.asPX(t, i[2] + o)),
                    f: a
                  };
            }
          })(-10);
      }),
      r.plugin(function(n, r, i, o, a) {
        var s = i.prototype,
          l = n.is;
        (s.rect = function(t, e, n, r, i, o) {
          var a;
          return (
            null == o && (o = i),
            l(t, "object") && "[object Object]" == t
              ? (a = t)
              : null != t &&
                ((a = { x: t, y: e, width: n, height: r }),
                null != i && ((a.rx = i), (a.ry = o))),
            this.el("rect", a)
          );
        }),
          (s.circle = function(t, e, n) {
            var r;
            return (
              l(t, "object") && "[object Object]" == t
                ? (r = t)
                : null != t && (r = { cx: t, cy: e, r: n }),
              this.el("circle", r)
            );
          });
        var u = (function() {
          function t() {
            this.parentNode.removeChild(this);
          }
          return function(e, n) {
            var r = o.doc.createElement("img"),
              i = o.doc.body;
            (r.style.cssText = "position:absolute;left:-9999em;top:-9999em"),
              (r.onload = function() {
                n.call(r), (r.onload = r.onerror = null), i.removeChild(r);
              }),
              (r.onerror = t),
              i.appendChild(r),
              (r.src = e);
          };
        })();
        (s.image = function(t, e, r, i, o) {
          var a = this.el("image");
          if (l(t, "object") && "src" in t) a.attr(t);
          else if (null != t) {
            var s = { "xlink:href": t, preserveAspectRatio: "none" };
            null != e && null != r && ((s.x = e), (s.y = r)),
              null != i && null != o
                ? ((s.width = i), (s.height = o))
                : u(t, function() {
                    n._.$(a.node, {
                      width: this.offsetWidth,
                      height: this.offsetHeight
                    });
                  }),
              n._.$(a.node, s);
          }
          return a;
        }),
          (s.ellipse = function(t, e, n, r) {
            var i;
            return (
              l(t, "object") && "[object Object]" == t
                ? (i = t)
                : null != t && (i = { cx: t, cy: e, rx: n, ry: r }),
              this.el("ellipse", i)
            );
          }),
          (s.path = function(t) {
            var e;
            return (
              l(t, "object") && !l(t, "array") ? (e = t) : t && (e = { d: t }),
              this.el("path", e)
            );
          }),
          (s.group = s.g = function(t) {
            var e = this.el("g");
            return (
              1 == arguments.length && t && !t.type
                ? e.attr(t)
                : arguments.length &&
                  e.add(Array.prototype.slice.call(arguments, 0)),
              e
            );
          }),
          (s.svg = function(t, e, n, r, i, o, a, s) {
            var u = {};
            return (
              l(t, "object") && null == e
                ? (u = t)
                : (null != t && (u.x = t),
                  null != e && (u.y = e),
                  null != n && (u.width = n),
                  null != r && (u.height = r),
                  null != i &&
                    null != o &&
                    null != a &&
                    null != s &&
                    (u.viewBox = [i, o, a, s])),
              this.el("svg", u)
            );
          }),
          (s.mask = function(t) {
            var e = this.el("mask");
            return (
              1 == arguments.length && t && !t.type
                ? e.attr(t)
                : arguments.length &&
                  e.add(Array.prototype.slice.call(arguments, 0)),
              e
            );
          }),
          (s.ptrn = function(t, e, n, r, i, o, a, s) {
            if (l(t, "object")) var u = t;
            else
              (u = { patternUnits: "userSpaceOnUse" }),
                t && (u.x = t),
                e && (u.y = e),
                null != n && (u.width = n),
                null != r && (u.height = r),
                (u.viewBox =
                  null != i && null != o && null != a && null != s
                    ? [i, o, a, s]
                    : [t || 0, e || 0, n || 0, r || 0]);
            return this.el("pattern", u);
          }),
          (s.use = function(t) {
            return null != t
              ? (t instanceof r &&
                  (t.attr("id") || t.attr({ id: n._.id(t) }),
                  (t = t.attr("id"))),
                "#" == String(t).charAt() && (t = t.substring(1)),
                this.el("use", { "xlink:href": "#" + t }))
              : r.prototype.use.call(this);
          }),
          (s.symbol = function(t, e, n, r) {
            var i = {};
            return (
              null != t &&
                null != e &&
                null != n &&
                null != r &&
                (i.viewBox = [t, e, n, r]),
              this.el("symbol", i)
            );
          }),
          (s.text = function(t, e, n) {
            var r = {};
            return (
              l(t, "object")
                ? (r = t)
                : null != t && (r = { x: t, y: e, text: n || "" }),
              this.el("text", r)
            );
          }),
          (s.line = function(t, e, n, r) {
            var i = {};
            return (
              l(t, "object")
                ? (i = t)
                : null != t && (i = { x1: t, x2: n, y1: e, y2: r }),
              this.el("line", i)
            );
          }),
          (s.polyline = function(t) {
            arguments.length > 1 &&
              (t = Array.prototype.slice.call(arguments, 0));
            var e = {};
            return (
              l(t, "object") && !l(t, "array")
                ? (e = t)
                : null != t && (e = { points: t }),
              this.el("polyline", e)
            );
          }),
          (s.polygon = function(t) {
            arguments.length > 1 &&
              (t = Array.prototype.slice.call(arguments, 0));
            var e = {};
            return (
              l(t, "object") && !l(t, "array")
                ? (e = t)
                : null != t && (e = { points: t }),
              this.el("polygon", e)
            );
          }),
          (function() {
            function r() {
              return this.selectAll("stop");
            }
            function i(t, e) {
              var r = c("stop"),
                i = { offset: +e + "%" };
              (t = n.color(t)),
                (i["stop-color"] = t.hex),
                t.opacity < 1 && (i["stop-opacity"] = t.opacity),
                c(r, i);
              for (var o, a = this.stops(), s = 0; s < a.length; s++) {
                if (parseFloat(a[s].attr("offset")) > e) {
                  this.node.insertBefore(r, a[s].node), (o = !0);
                  break;
                }
              }
              return o || this.node.appendChild(r), this;
            }
            function o() {
              if ("linearGradient" == this.type) {
                var t = c(this.node, "x1") || 0,
                  e = c(this.node, "x2") || 1,
                  r = c(this.node, "y1") || 0,
                  i = c(this.node, "y2") || 0;
                return n._.box(t, r, math.abs(e - t), math.abs(i - r));
              }
              var o = this.node.cx || 0.5,
                a = this.node.cy || 0.5,
                s = this.node.r || 0;
              return n._.box(o - s, a - s, 2 * s, 2 * s);
            }
            function a(t) {
              var r = t,
                i = this.stops();
              if (
                ("string" == typeof t &&
                  (r = e(
                    "snap.util.grad.parse",
                    null,
                    "l(0,0,0,1)" + t
                  ).firstDefined().stops),
                n.is(r, "array"))
              ) {
                for (var o = 0; o < i.length; o++)
                  if (r[o]) {
                    var a = n.color(r[o].color),
                      s = { offset: r[o].offset + "%" };
                    (s["stop-color"] = a.hex),
                      a.opacity < 1 && (s["stop-opacity"] = a.opacity),
                      i[o].attr(s);
                  } else i[o].remove();
                for (o = i.length; o < r.length; o++)
                  this.addStop(r[o].color, r[o].offset);
                return this;
              }
            }
            function l(t, e, s, l, u) {
              var f = n._.make("linearGradient", t);
              return (
                (f.stops = r),
                (f.addStop = i),
                (f.getBBox = o),
                (f.setStops = a),
                null != e && c(f.node, { x1: e, y1: s, x2: l, y2: u }),
                f
              );
            }
            function u(t, e, a, s, l, u) {
              var f = n._.make("radialGradient", t);
              return (
                (f.stops = r),
                (f.addStop = i),
                (f.getBBox = o),
                null != e && c(f.node, { cx: e, cy: a, r: s }),
                null != l && null != u && c(f.node, { fx: l, fy: u }),
                f
              );
            }
            var c = n._.$;
            (s.gradient = function(t) {
              return (function(t, n) {
                var r,
                  i = e("snap.util.grad.parse", null, n).firstDefined();
                if (!i) return null;
                i.params.unshift(t),
                  (r =
                    "l" == i.type.toLowerCase()
                      ? l.apply(0, i.params)
                      : u.apply(0, i.params)),
                  i.type != i.type.toLowerCase() &&
                    c(r.node, { gradientUnits: "userSpaceOnUse" });
                for (var o = i.stops, a = o.length, s = 0; a > s; s++) {
                  var f = o[s];
                  r.addStop(f.color, f.offset);
                }
                return r;
              })(this.defs, t);
            }),
              (s.gradientLinear = function(t, e, n, r) {
                return l(this.defs, t, e, n, r);
              }),
              (s.gradientRadial = function(t, e, n, r, i) {
                return u(this.defs, t, e, n, r, i);
              }),
              (s.toString = function() {
                var t,
                  e = this.node.ownerDocument,
                  r = e.createDocumentFragment(),
                  i = e.createElement("div"),
                  o = this.node.cloneNode(!0);
                return (
                  r.appendChild(i),
                  i.appendChild(o),
                  n._.$(o, { xmlns: "http://www.w3.org/2000/svg" }),
                  (t = i.innerHTML),
                  r.removeChild(r.firstChild),
                  t
                );
              }),
              (s.toDataURL = function() {
                return t && t.btoa
                  ? "data:image/svg+xml;base64," +
                      btoa(unescape(encodeURIComponent(this)))
                  : void 0;
              }),
              (s.clear = function() {
                for (var t, e = this.node.firstChild; e; )
                  (t = e.nextSibling),
                    "defs" != e.tagName
                      ? e.parentNode.removeChild(e)
                      : s.clear.call({ node: e }),
                    (e = t);
              });
          })();
      }),
      r.plugin(function(t, e, n, r) {
        function i(t) {
          var e = (i.ps = i.ps || {});
          return (
            e[t] ? (e[t].sleep = 100) : (e[t] = { sleep: 100 }),
            setTimeout(function() {
              for (var n in e)
                e[j](n) && n != t && (e[n].sleep--, !e[n].sleep && delete e[n]);
            }),
            e[t]
          );
        }
        function o(t, e, n, r) {
          return (
            null == t && (t = e = n = r = 0),
            null == e && ((e = t.y), (n = t.width), (r = t.height), (t = t.x)),
            {
              x: t,
              y: e,
              width: n,
              w: n,
              height: r,
              h: r,
              x2: t + n,
              y2: e + r,
              cx: t + n / 2,
              cy: e + r / 2,
              r1: L.min(n, r) / 2,
              r2: L.max(n, r) / 2,
              r0: L.sqrt(n * n + r * r) / 2,
              path: x(t, e, n, r),
              vb: [t, e, n, r].join(" ")
            }
          );
        }
        function a() {
          return this.join(",").replace(B, "$1");
        }
        function s(t) {
          var e = $(t);
          return (e.toString = a), e;
        }
        function l(t, e, n, r, i, o, a, s, l) {
          return null == l
            ? g(t, e, n, r, i, o, a, s)
            : c(
                t,
                e,
                n,
                r,
                i,
                o,
                a,
                s,
                (function(t, e, n, r, i, o, a, s, l) {
                  if (!(0 > l || g(t, e, n, r, i, o, a, s) < l)) {
                    var u,
                      c = 0.5,
                      f = 1 - c;
                    for (u = g(t, e, n, r, i, o, a, s, f); q(u - l) > 0.01; )
                      (c /= 2),
                        (u = g(
                          t,
                          e,
                          n,
                          r,
                          i,
                          o,
                          a,
                          s,
                          (f += (l > u ? 1 : -1) * c)
                        ));
                    return f;
                  }
                })(t, e, n, r, i, o, a, s, l)
              );
        }
        function u(n, r) {
          function i(t) {
            return +(+t).toFixed(3);
          }
          return t._.cacher(
            function(t, o, a) {
              t instanceof e && (t = t.attr("d"));
              for (
                var s,
                  u,
                  f,
                  h,
                  d,
                  p = "",
                  g = {},
                  v = 0,
                  m = 0,
                  y = (t = A(t)).length;
                y > m;
                m++
              ) {
                if ("M" == (f = t[m])[0]) (s = +f[1]), (u = +f[2]);
                else {
                  if (
                    v + (h = l(s, u, f[1], f[2], f[3], f[4], f[5], f[6])) >
                    o
                  ) {
                    if (r && !g.start) {
                      if (
                        ((p += [
                          "C" +
                            i(
                              (d = l(
                                s,
                                u,
                                f[1],
                                f[2],
                                f[3],
                                f[4],
                                f[5],
                                f[6],
                                o - v
                              )).start.x
                            ),
                          i(d.start.y),
                          i(d.m.x),
                          i(d.m.y),
                          i(d.x),
                          i(d.y)
                        ]),
                        a)
                      )
                        return p;
                      (g.start = p),
                        (p = [
                          "M" + i(d.x),
                          i(d.y) + "C" + i(d.n.x),
                          i(d.n.y),
                          i(d.end.x),
                          i(d.end.y),
                          i(f[5]),
                          i(f[6])
                        ].join()),
                        (v += h),
                        (s = +f[5]),
                        (u = +f[6]);
                      continue;
                    }
                    if (!n && !r)
                      return l(s, u, f[1], f[2], f[3], f[4], f[5], f[6], o - v);
                  }
                  (v += h), (s = +f[5]), (u = +f[6]);
                }
                p += f.shift() + f;
              }
              return (
                (g.end = p),
                n ? v : r ? g : c(s, u, f[0], f[1], f[2], f[3], f[4], f[5], 1)
              );
            },
            null,
            t._.clone
          );
        }
        function c(t, e, n, r, i, o, a, s, l) {
          var u = 1 - l,
            c = P(u, 3),
            f = P(u, 2),
            h = l * l,
            d = h * l,
            p = t + 2 * l * (n - t) + h * (i - 2 * n + t),
            g = e + 2 * l * (r - e) + h * (o - 2 * r + e),
            v = n + 2 * l * (i - n) + h * (a - 2 * i + n),
            m = r + 2 * l * (o - r) + h * (s - 2 * o + r);
          return {
            x: c * t + 3 * f * l * n + 3 * u * l * l * i + d * a,
            y: c * e + 3 * f * l * r + 3 * u * l * l * o + d * s,
            m: { x: p, y: g },
            n: { x: v, y: m },
            start: { x: u * t + l * n, y: u * e + l * r },
            end: { x: u * i + l * a, y: u * o + l * s },
            alpha: 90 - (180 * L.atan2(p - v, g - m)) / I
          };
        }
        function f(e, n, r, i, a, s, l, u) {
          t.is(e, "array") || (e = [e, n, r, i, a, s, l, u]);
          var c = k.apply(null, e);
          return o(c.min.x, c.min.y, c.max.x - c.min.x, c.max.y - c.min.y);
        }
        function h(t, e, n) {
          return (
            e >= t.x && e <= t.x + t.width && n >= t.y && n <= t.y + t.height
          );
        }
        function d(t, e) {
          return (
            (t = o(t)),
            h((e = o(e)), t.x, t.y) ||
              h(e, t.x2, t.y) ||
              h(e, t.x, t.y2) ||
              h(e, t.x2, t.y2) ||
              h(t, e.x, e.y) ||
              h(t, e.x2, e.y) ||
              h(t, e.x, e.y2) ||
              h(t, e.x2, e.y2) ||
              (((t.x < e.x2 && t.x > e.x) || (e.x < t.x2 && e.x > t.x)) &&
                ((t.y < e.y2 && t.y > e.y) || (e.y < t.y2 && e.y > t.y)))
          );
        }
        function p(t, e, n, r, i) {
          return (
            t *
              (t * (-3 * e + 9 * n - 9 * r + 3 * i) + 6 * e - 12 * n + 6 * r) -
            3 * e +
            3 * n
          );
        }
        function g(t, e, n, r, i, o, a, s, l) {
          null == l && (l = 1);
          for (
            var u = (l = l > 1 ? 1 : 0 > l ? 0 : l) / 2,
              c = [
                -0.1252,
                0.1252,
                -0.3678,
                0.3678,
                -0.5873,
                0.5873,
                -0.7699,
                0.7699,
                -0.9041,
                0.9041,
                -0.9816,
                0.9816
              ],
              f = [
                0.2491,
                0.2491,
                0.2335,
                0.2335,
                0.2032,
                0.2032,
                0.1601,
                0.1601,
                0.1069,
                0.1069,
                0.0472,
                0.0472
              ],
              h = 0,
              d = 0;
            12 > d;
            d++
          ) {
            var g = u * c[d] + u,
              v = p(g, t, n, i, a),
              m = p(g, e, r, o, s),
              y = v * v + m * m;
            h += f[d] * L.sqrt(y);
          }
          return u * h;
        }
        function v(t, e, n, r, i, o, a, s) {
          if (
            !(
              R(t, n) < M(i, a) ||
              M(t, n) > R(i, a) ||
              R(e, r) < M(o, s) ||
              M(e, r) > R(o, s)
            )
          ) {
            var l = (t - n) * (o - s) - (e - r) * (i - a);
            if (l) {
              var u =
                  ((t * r - e * n) * (i - a) - (t - n) * (i * s - o * a)) / l,
                c = ((t * r - e * n) * (o - s) - (e - r) * (i * s - o * a)) / l,
                f = +u.toFixed(2),
                h = +c.toFixed(2);
              if (
                !(
                  f < +M(t, n).toFixed(2) ||
                  f > +R(t, n).toFixed(2) ||
                  f < +M(i, a).toFixed(2) ||
                  f > +R(i, a).toFixed(2) ||
                  h < +M(e, r).toFixed(2) ||
                  h > +R(e, r).toFixed(2) ||
                  h < +M(o, s).toFixed(2) ||
                  h > +R(o, s).toFixed(2)
                )
              )
                return { x: u, y: c };
            }
          }
        }
        function m(t, e, n) {
          if (!d(f(t), f(e))) return n ? 0 : [];
          for (
            var r = ~~(g.apply(0, t) / 8),
              i = ~~(g.apply(0, e) / 8),
              o = [],
              a = [],
              s = {},
              l = n ? 0 : [],
              u = 0;
            r + 1 > u;
            u++
          ) {
            var h = c.apply(0, t.concat(u / r));
            o.push({ x: h.x, y: h.y, t: u / r });
          }
          for (u = 0; i + 1 > u; u++)
            (h = c.apply(0, e.concat(u / i))),
              a.push({ x: h.x, y: h.y, t: u / i });
          for (u = 0; r > u; u++)
            for (var p = 0; i > p; p++) {
              var m = o[u],
                y = o[u + 1],
                b = a[p],
                x = a[p + 1],
                w = q(y.x - m.x) < 0.001 ? "y" : "x",
                C = q(x.x - b.x) < 0.001 ? "y" : "x",
                T = v(m.x, m.y, y.x, y.y, b.x, b.y, x.x, x.y);
              if (T) {
                if (s[T.x.toFixed(4)] == T.y.toFixed(4)) continue;
                s[T.x.toFixed(4)] = T.y.toFixed(4);
                var E = m.t + q((T[w] - m[w]) / (y[w] - m[w])) * (y.t - m.t),
                  S = b.t + q((T[C] - b[C]) / (x[C] - b[C])) * (x.t - b.t);
                E >= 0 &&
                  1 >= E &&
                  S >= 0 &&
                  1 >= S &&
                  (n ? l++ : l.push({ x: T.x, y: T.y, t1: E, t2: S }));
              }
            }
          return l;
        }
        function y(t, e, n) {
          (t = A(t)), (e = A(e));
          for (
            var r,
              i,
              o,
              a,
              s,
              l,
              u,
              c,
              f,
              h,
              d = n ? 0 : [],
              p = 0,
              g = t.length;
            g > p;
            p++
          ) {
            var v = t[p];
            if ("M" == v[0]) (r = s = v[1]), (i = l = v[2]);
            else {
              "C" == v[0]
                ? ((r = (f = [r, i].concat(v.slice(1)))[6]), (i = f[7]))
                : ((f = [r, i, r, i, s, l, s, l]), (r = s), (i = l));
              for (var y = 0, b = e.length; b > y; y++) {
                var x = e[y];
                if ("M" == x[0]) (o = u = x[1]), (a = c = x[2]);
                else {
                  "C" == x[0]
                    ? ((o = (h = [o, a].concat(x.slice(1)))[6]), (a = h[7]))
                    : ((h = [o, a, o, a, u, c, u, c]), (o = u), (a = c));
                  var w = m(f, h, n);
                  if (n) d += w;
                  else {
                    for (var C = 0, T = w.length; T > C; C++)
                      (w[C].segment1 = p),
                        (w[C].segment2 = y),
                        (w[C].bez1 = f),
                        (w[C].bez2 = h);
                    d = d.concat(w);
                  }
                }
              }
            }
          }
          return d;
        }
        function b(t) {
          var e = i(t);
          if (e.bbox) return $(e.bbox);
          if (!t) return o();
          for (
            var n, r = 0, a = 0, s = [], l = [], u = 0, c = (t = A(t)).length;
            c > u;
            u++
          )
            if ("M" == (n = t[u])[0])
              (r = n[1]), (a = n[2]), s.push(r), l.push(a);
            else {
              var f = k(r, a, n[1], n[2], n[3], n[4], n[5], n[6]);
              (s = s.concat(f.min.x, f.max.x)),
                (l = l.concat(f.min.y, f.max.y)),
                (r = n[5]),
                (a = n[6]);
            }
          var h = M.apply(0, s),
            d = M.apply(0, l),
            p = o(h, d, R.apply(0, s) - h, R.apply(0, l) - d);
          return (e.bbox = $(p)), p;
        }
        function x(t, e, n, r, i) {
          if (i)
            return [
              ["M", +t + +i, e],
              ["l", n - 2 * i, 0],
              ["a", i, i, 0, 0, 1, i, i],
              ["l", 0, r - 2 * i],
              ["a", i, i, 0, 0, 1, -i, i],
              ["l", 2 * i - n, 0],
              ["a", i, i, 0, 0, 1, -i, -i],
              ["l", 0, 2 * i - r],
              ["a", i, i, 0, 0, 1, i, -i],
              ["z"]
            ];
          var o = [["M", t, e], ["l", n, 0], ["l", 0, r], ["l", -n, 0], ["z"]];
          return (o.toString = a), o;
        }
        function w(t, e, n, r, i) {
          if (
            (null == i && null == r && (r = n),
            (t = +t),
            (e = +e),
            (n = +n),
            (r = +r),
            null != i)
          )
            var o = Math.PI / 180,
              s = t + n * Math.cos(-r * o),
              l = t + n * Math.cos(-i * o),
              u = [
                ["M", s, e + n * Math.sin(-r * o)],
                ["A", n, n, 0, +(i - r > 180), 0, l, e + n * Math.sin(-i * o)]
              ];
          else
            u = [
              ["M", t, e],
              ["m", 0, -r],
              ["a", n, r, 0, 1, 1, 0, 2 * r],
              ["a", n, r, 0, 1, 1, 0, -2 * r],
              ["z"]
            ];
          return (u.toString = a), u;
        }
        function C(e) {
          var n = i(e);
          if (n.abs) return s(n.abs);
          if (
            ((N(e, "array") && N(e && e[0], "array")) ||
              (e = t.parsePathString(e)),
            !e || !e.length)
          )
            return [["M", 0, 0]];
          var r,
            o = [],
            l = 0,
            u = 0,
            c = 0,
            f = 0,
            h = 0;
          "M" == e[0][0] &&
            ((c = l = +e[0][1]), (f = u = +e[0][2]), h++, (o[0] = ["M", l, u]));
          for (
            var d,
              p,
              g =
                3 == e.length &&
                "M" == e[0][0] &&
                "R" == e[1][0].toUpperCase() &&
                "Z" == e[2][0].toUpperCase(),
              v = h,
              m = e.length;
            m > v;
            v++
          ) {
            if ((o.push((d = [])), (r = (p = e[v])[0]) != r.toUpperCase()))
              switch (((d[0] = r.toUpperCase()), d[0])) {
                case "A":
                  (d[1] = p[1]),
                    (d[2] = p[2]),
                    (d[3] = p[3]),
                    (d[4] = p[4]),
                    (d[5] = p[5]),
                    (d[6] = +p[6] + l),
                    (d[7] = +p[7] + u);
                  break;
                case "V":
                  d[1] = +p[1] + u;
                  break;
                case "H":
                  d[1] = +p[1] + l;
                  break;
                case "R":
                  for (
                    var y = [l, u].concat(p.slice(1)), b = 2, x = y.length;
                    x > b;
                    b++
                  )
                    (y[b] = +y[b] + l), (y[++b] = +y[b] + u);
                  o.pop(), (o = o.concat(F(y, g)));
                  break;
                case "O":
                  o.pop(),
                    (y = w(l, u, p[1], p[2])).push(y[0]),
                    (o = o.concat(y));
                  break;
                case "U":
                  o.pop(),
                    (o = o.concat(w(l, u, p[1], p[2], p[3]))),
                    (d = ["U"].concat(o[o.length - 1].slice(-2)));
                  break;
                case "M":
                  (c = +p[1] + l), (f = +p[2] + u);
                default:
                  for (b = 1, x = p.length; x > b; b++)
                    d[b] = +p[b] + (b % 2 ? l : u);
              }
            else if ("R" == r)
              (y = [l, u].concat(p.slice(1))),
                o.pop(),
                (o = o.concat(F(y, g))),
                (d = ["R"].concat(p.slice(-2)));
            else if ("O" == r)
              o.pop(), (y = w(l, u, p[1], p[2])).push(y[0]), (o = o.concat(y));
            else if ("U" == r)
              o.pop(),
                (o = o.concat(w(l, u, p[1], p[2], p[3]))),
                (d = ["U"].concat(o[o.length - 1].slice(-2)));
            else for (var C = 0, T = p.length; T > C; C++) d[C] = p[C];
            if ("O" != (r = r.toUpperCase()))
              switch (d[0]) {
                case "Z":
                  (l = +c), (u = +f);
                  break;
                case "H":
                  l = d[1];
                  break;
                case "V":
                  u = d[1];
                  break;
                case "M":
                  (c = d[d.length - 2]), (f = d[d.length - 1]);
                default:
                  (l = d[d.length - 2]), (u = d[d.length - 1]);
              }
          }
          return (o.toString = a), (n.abs = s(o)), o;
        }
        function T(t, e, n, r) {
          return [t, e, n, r, n, r];
        }
        function E(t, e, n, r, i, o) {
          var a = 1 / 3,
            s = 2 / 3;
          return [
            a * t + s * n,
            a * e + s * r,
            a * i + s * n,
            a * o + s * r,
            i,
            o
          ];
        }
        function S(e, n, r, i, o, a, s, l, u, c) {
          var f,
            h = (120 * I) / 180,
            d = (I / 180) * (+o || 0),
            p = [],
            g = t._.cacher(function(t, e, n) {
              return {
                x: t * L.cos(n) - e * L.sin(n),
                y: t * L.sin(n) + e * L.cos(n)
              };
            });
          if (!r || !i) return [e, n, l, u, l, u];
          if (c) (E = c[0]), (k = c[1]), (C = c[2]), (T = c[3]);
          else {
            (e = (f = g(e, n, -d)).x),
              (n = f.y),
              (l = (f = g(l, u, -d)).x),
              (u = f.y);
            var v = (L.cos((I / 180) * o), L.sin((I / 180) * o), (e - l) / 2),
              m = (n - u) / 2,
              y = (v * v) / (r * r) + (m * m) / (i * i);
            y > 1 && ((r *= y = L.sqrt(y)), (i *= y));
            var b = r * r,
              x = i * i,
              w =
                (a == s ? -1 : 1) *
                L.sqrt(
                  q((b * x - b * m * m - x * v * v) / (b * m * m + x * v * v))
                ),
              C = (w * r * m) / i + (e + l) / 2,
              T = (w * -i * v) / r + (n + u) / 2,
              E = L.asin(((n - T) / i).toFixed(9)),
              k = L.asin(((u - T) / i).toFixed(9));
            (E = C > e ? I - E : E),
              (k = C > l ? I - k : k),
              0 > E && (E = 2 * I + E),
              0 > k && (k = 2 * I + k),
              s && E > k && (E -= 2 * I),
              !s && k > E && (k -= 2 * I);
          }
          var A = k - E;
          if (q(A) > h) {
            var F = k,
              D = l,
              N = u;
            (k = E + h * (s && k > E ? 1 : -1)),
              (p = S(
                (l = C + r * L.cos(k)),
                (u = T + i * L.sin(k)),
                r,
                i,
                o,
                0,
                s,
                D,
                N,
                [k, F, C, T]
              ));
          }
          A = k - E;
          var $ = L.cos(E),
            j = L.sin(E),
            B = L.cos(k),
            O = L.sin(k),
            M = L.tan(A / 4),
            R = (4 / 3) * r * M,
            P = (4 / 3) * i * M,
            _ = [e, n],
            H = [e + R * j, n - P * $],
            U = [l + R * O, u - P * B],
            W = [l, u];
          if (((H[0] = 2 * _[0] - H[0]), (H[1] = 2 * _[1] - H[1]), c))
            return [H, U, W].concat(p);
          for (
            var V = [],
              z = 0,
              G = (p = [H, U, W]
                .concat(p)
                .join()
                .split(",")).length;
            G > z;
            z++
          )
            V[z] = z % 2 ? g(p[z - 1], p[z], d).y : g(p[z], p[z + 1], d).x;
          return V;
        }
        function k(t, e, n, r, i, o, a, s) {
          for (
            var l, u, c, f, h, d, p, g, v = [], m = [[], []], y = 0;
            2 > y;
            ++y
          )
            if (
              (0 == y
                ? ((u = 6 * t - 12 * n + 6 * i),
                  (l = -3 * t + 9 * n - 9 * i + 3 * a),
                  (c = 3 * n - 3 * t))
                : ((u = 6 * e - 12 * r + 6 * o),
                  (l = -3 * e + 9 * r - 9 * o + 3 * s),
                  (c = 3 * r - 3 * e)),
              q(l) < 1e-12)
            ) {
              if (q(u) < 1e-12) continue;
              (f = -c / u) > 0 && 1 > f && v.push(f);
            } else
              (p = u * u - 4 * c * l),
                (g = L.sqrt(p)),
                0 > p ||
                  ((h = (-u + g) / (2 * l)) > 0 && 1 > h && v.push(h),
                  (d = (-u - g) / (2 * l)) > 0 && 1 > d && v.push(d));
          for (var b, x = v.length, w = x; x--; )
            (b = 1 - (f = v[x])),
              (m[0][x] =
                b * b * b * t +
                3 * b * b * f * n +
                3 * b * f * f * i +
                f * f * f * a),
              (m[1][x] =
                b * b * b * e +
                3 * b * b * f * r +
                3 * b * f * f * o +
                f * f * f * s);
          return (
            (m[0][w] = t),
            (m[1][w] = e),
            (m[0][w + 1] = a),
            (m[1][w + 1] = s),
            (m[0].length = m[1].length = w + 2),
            {
              min: { x: M.apply(0, m[0]), y: M.apply(0, m[1]) },
              max: { x: R.apply(0, m[0]), y: R.apply(0, m[1]) }
            }
          );
        }
        function A(t, e) {
          var n = !e && i(t);
          if (!e && n.curve) return s(n.curve);
          for (
            var r = C(t),
              o = e && C(e),
              a = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null },
              l = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null },
              u = function(t, e, n) {
                var r, i;
                if (!t) return ["C", e.x, e.y, e.x, e.y, e.x, e.y];
                switch (
                  (!(t[0] in { T: 1, Q: 1 }) && (e.qx = e.qy = null), t[0])
                ) {
                  case "M":
                    (e.X = t[1]), (e.Y = t[2]);
                    break;
                  case "A":
                    t = ["C"].concat(S.apply(0, [e.x, e.y].concat(t.slice(1))));
                    break;
                  case "S":
                    "C" == n || "S" == n
                      ? ((r = 2 * e.x - e.bx), (i = 2 * e.y - e.by))
                      : ((r = e.x), (i = e.y)),
                      (t = ["C", r, i].concat(t.slice(1)));
                    break;
                  case "T":
                    "Q" == n || "T" == n
                      ? ((e.qx = 2 * e.x - e.qx), (e.qy = 2 * e.y - e.qy))
                      : ((e.qx = e.x), (e.qy = e.y)),
                      (t = ["C"].concat(E(e.x, e.y, e.qx, e.qy, t[1], t[2])));
                    break;
                  case "Q":
                    (e.qx = t[1]),
                      (e.qy = t[2]),
                      (t = ["C"].concat(E(e.x, e.y, t[1], t[2], t[3], t[4])));
                    break;
                  case "L":
                    t = ["C"].concat(T(e.x, e.y, t[1], t[2]));
                    break;
                  case "H":
                    t = ["C"].concat(T(e.x, e.y, t[1], e.y));
                    break;
                  case "V":
                    t = ["C"].concat(T(e.x, e.y, e.x, t[1]));
                    break;
                  case "Z":
                    t = ["C"].concat(T(e.x, e.y, e.X, e.Y));
                }
                return t;
              },
              c = function(t, e) {
                if (t[e].length > 7) {
                  t[e].shift();
                  for (var n = t[e]; n.length; )
                    (h[e] = "A"),
                      o && (d[e] = "A"),
                      t.splice(e++, 0, ["C"].concat(n.splice(0, 6)));
                  t.splice(e, 1), (m = R(r.length, (o && o.length) || 0));
                }
              },
              f = function(t, e, n, i, a) {
                t &&
                  e &&
                  "M" == t[a][0] &&
                  "M" != e[a][0] &&
                  (e.splice(a, 0, ["M", i.x, i.y]),
                  (n.bx = 0),
                  (n.by = 0),
                  (n.x = t[a][1]),
                  (n.y = t[a][2]),
                  (m = R(r.length, (o && o.length) || 0)));
              },
              h = [],
              d = [],
              p = "",
              g = "",
              v = 0,
              m = R(r.length, (o && o.length) || 0);
            m > v;
            v++
          ) {
            r[v] && (p = r[v][0]),
              "C" != p && ((h[v] = p), v && (g = h[v - 1])),
              (r[v] = u(r[v], a, g)),
              "A" != h[v] && "C" == p && (h[v] = "C"),
              c(r, v),
              o &&
                (o[v] && (p = o[v][0]),
                "C" != p && ((d[v] = p), v && (g = d[v - 1])),
                (o[v] = u(o[v], l, g)),
                "A" != d[v] && "C" == p && (d[v] = "C"),
                c(o, v)),
              f(r, o, a, l, v),
              f(o, r, l, a, v);
            var y = r[v],
              b = o && o[v],
              x = y.length,
              w = o && b.length;
            (a.x = y[x - 2]),
              (a.y = y[x - 1]),
              (a.bx = O(y[x - 4]) || a.x),
              (a.by = O(y[x - 3]) || a.y),
              (l.bx = o && (O(b[w - 4]) || l.x)),
              (l.by = o && (O(b[w - 3]) || l.y)),
              (l.x = o && b[w - 2]),
              (l.y = o && b[w - 1]);
          }
          return o || (n.curve = s(r)), o ? [r, o] : r;
        }
        function F(t, e) {
          for (var n = [], r = 0, i = t.length; i - 2 * !e > r; r += 2) {
            var o = [
              { x: +t[r - 2], y: +t[r - 1] },
              { x: +t[r], y: +t[r + 1] },
              { x: +t[r + 2], y: +t[r + 3] },
              { x: +t[r + 4], y: +t[r + 5] }
            ];
            e
              ? r
                ? i - 4 == r
                  ? (o[3] = { x: +t[0], y: +t[1] })
                  : i - 2 == r &&
                    ((o[2] = { x: +t[0], y: +t[1] }),
                    (o[3] = { x: +t[2], y: +t[3] }))
                : (o[0] = { x: +t[i - 2], y: +t[i - 1] })
              : i - 4 == r
                ? (o[3] = o[2])
                : r || (o[0] = { x: +t[r], y: +t[r + 1] }),
              n.push([
                "C",
                (-o[0].x + 6 * o[1].x + o[2].x) / 6,
                (-o[0].y + 6 * o[1].y + o[2].y) / 6,
                (o[1].x + 6 * o[2].x - o[3].x) / 6,
                (o[1].y + 6 * o[2].y - o[3].y) / 6,
                o[2].x,
                o[2].y
              ]);
          }
          return n;
        }
        var D = e.prototype,
          N = t.is,
          $ = t._.clone,
          j = "hasOwnProperty",
          B = /,?([a-z]),?/gi,
          O = parseFloat,
          L = Math,
          I = L.PI,
          M = L.min,
          R = L.max,
          P = L.pow,
          q = L.abs,
          _ = u(1),
          H = u(),
          U = u(0, 1),
          W = t._unit2px,
          V = {
            path: function(t) {
              return t.attr("path");
            },
            circle: function(t) {
              var e = W(t);
              return w(e.cx, e.cy, e.r);
            },
            ellipse: function(t) {
              var e = W(t);
              return w(e.cx || 0, e.cy || 0, e.rx, e.ry);
            },
            rect: function(t) {
              var e = W(t);
              return x(e.x || 0, e.y || 0, e.width, e.height, e.rx, e.ry);
            },
            image: function(t) {
              var e = W(t);
              return x(e.x || 0, e.y || 0, e.width, e.height);
            },
            line: function(t) {
              return (
                "M" +
                [
                  t.attr("x1") || 0,
                  t.attr("y1") || 0,
                  t.attr("x2"),
                  t.attr("y2")
                ]
              );
            },
            polyline: function(t) {
              return "M" + t.attr("points");
            },
            polygon: function(t) {
              return "M" + t.attr("points") + "z";
            },
            deflt: function(t) {
              var e = t.node.getBBox();
              return x(e.x, e.y, e.width, e.height);
            }
          };
        (t.path = i),
          (t.path.getTotalLength = _),
          (t.path.getPointAtLength = H),
          (t.path.getSubpath = function(t, e, n) {
            if (this.getTotalLength(t) - n < 1e-6) return U(t, e).end;
            var r = U(t, n, 1);
            return e ? U(r, e).end : r;
          }),
          (D.getTotalLength = function() {
            return this.node.getTotalLength
              ? this.node.getTotalLength()
              : void 0;
          }),
          (D.getPointAtLength = function(t) {
            return H(this.attr("d"), t);
          }),
          (D.getSubpath = function(e, n) {
            return t.path.getSubpath(this.attr("d"), e, n);
          }),
          (t._.box = o),
          (t.path.findDotsAtSegment = c),
          (t.path.bezierBBox = f),
          (t.path.isPointInsideBBox = h),
          (t.closest = function(e, n, r, i) {
            for (
              var a = 100,
                s = o(e - a / 2, n - a / 2, a, a),
                l = [],
                u = r[0].hasOwnProperty("x")
                  ? function(t) {
                      return { x: r[t].x, y: r[t].y };
                    }
                  : function(t) {
                      return { x: r[t], y: i[t] };
                    },
                c = 0;
              1e6 >= a && !c;

            ) {
              for (var f = 0, d = r.length; d > f; f++) {
                var p = u(f);
                if (h(s, p.x, p.y)) {
                  c++, l.push(p);
                  break;
                }
              }
              c || (s = o(e - (a *= 2) / 2, n - a / 2, a, a));
            }
            if (1e6 != a) {
              var g,
                v = 1 / 0;
              for (f = 0, d = l.length; d > f; f++) {
                var m = t.len(e, n, l[f].x, l[f].y);
                v > m && ((v = m), (l[f].len = m), (g = l[f]));
              }
              return g;
            }
          }),
          (t.path.isBBoxIntersect = d),
          (t.path.intersection = function(t, e) {
            return y(t, e);
          }),
          (t.path.intersectionNumber = function(t, e) {
            return y(t, e, 1);
          }),
          (t.path.isPointInside = function(t, e, n) {
            var r = b(t);
            return (
              h(r, e, n) && y(t, [["M", e, n], ["H", r.x2 + 10]], 1) % 2 == 1
            );
          }),
          (t.path.getBBox = b),
          (t.path.get = V),
          (t.path.toRelative = function(e) {
            var n = i(e),
              r = String.prototype.toLowerCase;
            if (n.rel) return s(n.rel);
            (t.is(e, "array") && t.is(e && e[0], "array")) ||
              (e = t.parsePathString(e));
            var o = [],
              l = 0,
              u = 0,
              c = 0,
              f = 0,
              h = 0;
            "M" == e[0][0] &&
              ((c = l = e[0][1]), (f = u = e[0][2]), h++, o.push(["M", l, u]));
            for (var d = h, p = e.length; p > d; d++) {
              var g = (o[d] = []),
                v = e[d];
              if (v[0] != r.call(v[0]))
                switch (((g[0] = r.call(v[0])), g[0])) {
                  case "a":
                    (g[1] = v[1]),
                      (g[2] = v[2]),
                      (g[3] = v[3]),
                      (g[4] = v[4]),
                      (g[5] = v[5]),
                      (g[6] = +(v[6] - l).toFixed(3)),
                      (g[7] = +(v[7] - u).toFixed(3));
                    break;
                  case "v":
                    g[1] = +(v[1] - u).toFixed(3);
                    break;
                  case "m":
                    (c = v[1]), (f = v[2]);
                  default:
                    for (var m = 1, y = v.length; y > m; m++)
                      g[m] = +(v[m] - (m % 2 ? l : u)).toFixed(3);
                }
              else {
                (g = o[d] = []),
                  "m" == v[0] && ((c = v[1] + l), (f = v[2] + u));
                for (var b = 0, x = v.length; x > b; b++) o[d][b] = v[b];
              }
              var w = o[d].length;
              switch (o[d][0]) {
                case "z":
                  (l = c), (u = f);
                  break;
                case "h":
                  l += +o[d][w - 1];
                  break;
                case "v":
                  u += +o[d][w - 1];
                  break;
                default:
                  (l += +o[d][w - 2]), (u += +o[d][w - 1]);
              }
            }
            return (o.toString = a), (n.rel = s(o)), o;
          }),
          (t.path.toAbsolute = C),
          (t.path.toCubic = A),
          (t.path.map = function(t, e) {
            if (!e) return t;
            var n, r, i, o, a, s, l;
            for (i = 0, a = (t = A(t)).length; a > i; i++)
              for (o = 1, s = (l = t[i]).length; s > o; o += 2)
                (n = e.x(l[o], l[o + 1])),
                  (r = e.y(l[o], l[o + 1])),
                  (l[o] = n),
                  (l[o + 1] = r);
            return t;
          }),
          (t.path.toString = a),
          (t.path.clone = s);
      }),
      r.plugin(function(t, r, i, o) {
        var a = Math.max,
          s = Math.min,
          l = function(t) {
            if (
              ((this.items = []),
              (this.bindings = {}),
              (this.length = 0),
              (this.type = "set"),
              t)
            )
              for (var e = 0, n = t.length; n > e; e++)
                t[e] &&
                  ((this[this.items.length] = this.items[this.items.length] =
                    t[e]),
                  this.length++);
          },
          u = l.prototype;
        (u.push = function() {
          for (var t, e, n = 0, r = arguments.length; r > n; n++)
            (t = arguments[n]) &&
              ((this[(e = this.items.length)] = this.items[e] = t),
              this.length++);
          return this;
        }),
          (u.pop = function() {
            return this.length && delete this[this.length--], this.items.pop();
          }),
          (u.forEach = function(t, e) {
            for (var n = 0, r = this.items.length; r > n; n++)
              if (!1 === t.call(e, this.items[n], n)) return this;
            return this;
          }),
          (u.animate = function(r, i, o, a) {
            "function" != typeof o || o.length || ((a = o), (o = n.linear)),
              r instanceof t._.Animation &&
                ((a = r.callback), (o = r.easing), (i = o.dur), (r = r.attr));
            var s = arguments;
            if (t.is(r, "array") && t.is(s[s.length - 1], "array")) var l = !0;
            var u,
              c = function() {
                u ? (this.b = u) : (u = this.b);
              },
              f = 0,
              h = this,
              d =
                a &&
                function() {
                  ++f == h.length && a.call(this);
                };
            return this.forEach(function(t, n) {
              e.once("snap.animcreated." + t.id, c),
                l ? s[n] && t.animate.apply(t, s[n]) : t.animate(r, i, o, d);
            });
          }),
          (u.remove = function() {
            for (; this.length; ) this.pop().remove();
            return this;
          }),
          (u.bind = function(t, e, n) {
            var r = {};
            if ("function" == typeof e) this.bindings[t] = e;
            else {
              var i = n || t;
              this.bindings[t] = function(t) {
                (r[i] = t), e.attr(r);
              };
            }
            return this;
          }),
          (u.attr = function(t) {
            var e = {};
            for (var n in t)
              this.bindings[n] ? this.bindings[n](t[n]) : (e[n] = t[n]);
            for (var r = 0, i = this.items.length; i > r; r++)
              this.items[r].attr(e);
            return this;
          }),
          (u.clear = function() {
            for (; this.length; ) this.pop();
          }),
          (u.splice = function(t, e, n) {
            (t = 0 > t ? a(this.length + t, 0) : t),
              (e = a(0, s(this.length - t, e)));
            var r,
              i = [],
              o = [],
              u = [];
            for (r = 2; r < arguments.length; r++) u.push(arguments[r]);
            for (r = 0; e > r; r++) o.push(this[t + r]);
            for (; r < this.length - t; r++) i.push(this[t + r]);
            var c = u.length;
            for (r = 0; r < c + i.length; r++)
              this.items[t + r] = this[t + r] = c > r ? u[r] : i[r - c];
            for (r = this.items.length = this.length -= e - c; this[r]; )
              delete this[r++];
            return new l(o);
          }),
          (u.exclude = function(t) {
            for (var e = 0, n = this.length; n > e; e++)
              if (this[e] == t) return this.splice(e, 1), !0;
            return !1;
          }),
          (u.insertAfter = function(t) {
            for (var e = this.items.length; e--; ) this.items[e].insertAfter(t);
            return this;
          }),
          (u.getBBox = function() {
            for (
              var t = [], e = [], n = [], r = [], i = this.items.length;
              i--;

            )
              if (!this.items[i].removed) {
                var o = this.items[i].getBBox();
                t.push(o.x),
                  e.push(o.y),
                  n.push(o.x + o.width),
                  r.push(o.y + o.height);
              }
            return {
              x: (t = s.apply(0, t)),
              y: (e = s.apply(0, e)),
              x2: (n = a.apply(0, n)),
              y2: (r = a.apply(0, r)),
              width: n - t,
              height: r - e,
              cx: t + (n - t) / 2,
              cy: e + (r - e) / 2
            };
          }),
          (u.clone = function(t) {
            t = new l();
            for (var e = 0, n = this.items.length; n > e; e++)
              t.push(this.items[e].clone());
            return t;
          }),
          (u.toString = function() {
            return "Snap\u2018s set";
          }),
          (u.type = "set"),
          (t.Set = l),
          (t.set = function() {
            var t = new l();
            return (
              arguments.length &&
                t.push.apply(t, Array.prototype.slice.call(arguments, 0)),
              t
            );
          });
      }),
      r.plugin(function(t, n, r, i) {
        function o(t) {
          var e = t[0];
          switch (e.toLowerCase()) {
            case "t":
              return [e, 0, 0];
            case "m":
              return [e, 1, 0, 0, 1, 0, 0];
            case "r":
              return 4 == t.length ? [e, 0, t[2], t[3]] : [e, 0];
            case "s":
              return 5 == t.length
                ? [e, 1, 1, t[3], t[4]]
                : 3 == t.length
                  ? [e, 1, 1]
                  : [e, 1];
          }
        }
        function a(e, n, r) {
          (e = e || new t.Matrix()),
            (n = n || new t.Matrix()),
            (e = t.parseTransformString(e.toTransformString()) || []),
            (n = t.parseTransformString(n.toTransformString()) || []);
          for (
            var i,
              a,
              s,
              l,
              u = Math.max(e.length, n.length),
              h = [],
              d = [],
              p = 0;
            u > p;
            p++
          ) {
            if (
              ((s = e[p] || o(n[p])),
              (l = n[p] || o(s)),
              s[0] != l[0] ||
                ("r" == s[0].toLowerCase() && (s[2] != l[2] || s[3] != l[3])) ||
                ("s" == s[0].toLowerCase() && (s[3] != l[3] || s[4] != l[4])))
            ) {
              (e = t._.transform2matrix(e, r())),
                (n = t._.transform2matrix(n, r())),
                (h = [["m", e.a, e.b, e.c, e.d, e.e, e.f]]),
                (d = [["m", n.a, n.b, n.c, n.d, n.e, n.f]]);
              break;
            }
            for (
              h[p] = [], d[p] = [], i = 0, a = Math.max(s.length, l.length);
              a > i;
              i++
            )
              i in s && (h[p][i] = s[i]), i in l && (d[p][i] = l[i]);
          }
          return { from: f(h), to: f(d), f: c(h) };
        }
        function s(t) {
          return t;
        }
        function l(t) {
          return t.join(" ");
        }
        function u(e) {
          return t.rgb(e[0], e[1], e[2], e[3]);
        }
        function c(t) {
          var e,
            n,
            r,
            i,
            o,
            a,
            s = 0,
            l = [];
          for (e = 0, n = t.length; n > e; e++) {
            for (
              o = "[", a = ['"' + t[e][0] + '"'], r = 1, i = t[e].length;
              i > r;
              r++
            )
              a[r] = "val[" + s++ + "]";
            (o += a + "]"), (l[e] = o);
          }
          return Function("val", "return Snap.path.toString.call([" + l + "])");
        }
        function f(t) {
          for (var e = [], n = 0, r = t.length; r > n; n++)
            for (var i = 1, o = t[n].length; o > i; i++) e.push(t[n][i]);
          return e;
        }
        function h(t) {
          return isFinite(t);
        }
        var d = {},
          p = /[%a-z]+$/i,
          g = String;
        (d.stroke = d.fill = "colour"),
          (n.prototype.equal = function(t, n) {
            return e("snap.util.equal", this, t, n).firstDefined();
          }),
          e.on("snap.util.equal", function(e, n) {
            var r,
              i,
              o = g(this.attr(e) || ""),
              v = this;
            if ("colour" == d[e])
              return (
                (r = t.color(o)),
                (i = t.color(n)),
                {
                  from: [r.r, r.g, r.b, r.opacity],
                  to: [i.r, i.g, i.b, i.opacity],
                  f: u
                }
              );
            if ("viewBox" == e)
              return {
                from: (r = this.attr(e)
                  .vb.split(" ")
                  .map(Number)),
                to: (i = n.split(" ").map(Number)),
                f: l
              };
            if (
              "transform" == e ||
              "gradientTransform" == e ||
              "patternTransform" == e
            )
              return (
                "string" == typeof n && (n = g(n).replace(/\.{3}|\u2026/g, o)),
                a(
                  (o = this.matrix),
                  (n = t._.rgTransform.test(n)
                    ? t._.transform2matrix(n, this.getBBox())
                    : t._.transform2matrix(
                        t._.svgTransform2string(n),
                        this.getBBox()
                      )),
                  function() {
                    return v.getBBox(1);
                  }
                )
              );
            if ("d" == e || "path" == e)
              return {
                from: f((r = t.path.toCubic(o, n))[0]),
                to: f(r[1]),
                f: c(r[0])
              };
            if ("points" == e)
              return {
                from: (r = g(o).split(t._.separator)),
                to: (i = g(n).split(t._.separator)),
                f: function(t) {
                  return t;
                }
              };
            if (h(o) && h(n))
              return { from: parseFloat(o), to: parseFloat(n), f: s };
            var m = o.match(p),
              y = g(n).match(p);
            return m &&
              (function(e, n) {
                return (
                  !(!t.is(e, "array") || !t.is(n, "array")) &&
                  e.toString() == n.toString()
                );
              })(m, y)
              ? {
                  from: parseFloat(o),
                  to: parseFloat(n),
                  f: (function(t) {
                    return function(e) {
                      return +e.toFixed(3) + t;
                    };
                  })(m)
                }
              : { from: this.asPX(e), to: this.asPX(e, n), f: s };
          });
      }),
      r.plugin(function(t, n, r, i) {
        for (
          var o = n.prototype,
            a = ("createTouch" in i.doc),
            s = [
              "click",
              "dblclick",
              "mousedown",
              "mousemove",
              "mouseout",
              "mouseover",
              "mouseup",
              "touchstart",
              "touchmove",
              "touchend",
              "touchcancel"
            ],
            l = {
              mousedown: "touchstart",
              mousemove: "touchmove",
              mouseup: "touchend"
            },
            u = function(t, e) {
              var n = "y" == t ? "scrollTop" : "scrollLeft",
                r = e && e.node ? e.node.ownerDocument : i.doc;
              return r[(n in r.documentElement) ? "documentElement" : "body"][
                n
              ];
            },
            c = function() {
              return this.originalEvent.preventDefault();
            },
            f = function() {
              return this.originalEvent.stopPropagation();
            },
            h = function(t, e, n, r) {
              var i = a && l[e] ? l[e] : e,
                o = function(i) {
                  var o = u("y", r),
                    s = u("x", r);
                  if (a && l.hasOwnProperty(e))
                    for (
                      var h = 0, d = i.targetTouches && i.targetTouches.length;
                      d > h;
                      h++
                    )
                      if (
                        i.targetTouches[h].target == t ||
                        t.contains(i.targetTouches[h].target)
                      ) {
                        var p = i;
                        ((i = i.targetTouches[h]).originalEvent = p),
                          (i.preventDefault = c),
                          (i.stopPropagation = f);
                        break;
                      }
                  var g = i.clientX + s,
                    v = i.clientY + o;
                  return n.call(r, i, g, v);
                };
              return (
                e !== i && t.addEventListener(e, o, !1),
                t.addEventListener(i, o, !1),
                function() {
                  return (
                    e !== i && t.removeEventListener(e, o, !1),
                    t.removeEventListener(i, o, !1),
                    !0
                  );
                }
              );
            },
            d = [],
            p = function(t) {
              for (
                var n,
                  r = t.clientX,
                  i = t.clientY,
                  o = u("y"),
                  s = u("x"),
                  l = d.length;
                l--;

              ) {
                if (((n = d[l]), a)) {
                  for (var c, f = t.touches && t.touches.length; f--; )
                    if (
                      (c = t.touches[f]).identifier == n.el._drag.id ||
                      n.el.node.contains(c.target)
                    ) {
                      (r = c.clientX),
                        (i = c.clientY),
                        (t.originalEvent
                          ? t.originalEvent
                          : t
                        ).preventDefault();
                      break;
                    }
                } else t.preventDefault();
                var h = n.el.node;
                h.nextSibling,
                  h.parentNode,
                  h.style.display,
                  (r += s),
                  (i += o),
                  e(
                    "snap.drag.move." + n.el.id,
                    n.move_scope || n.el,
                    r - n.el._drag.x,
                    i - n.el._drag.y,
                    r,
                    i,
                    t
                  );
              }
            },
            g = function(n) {
              t.unmousemove(p).unmouseup(g);
              for (var r, i = d.length; i--; )
                ((r = d[i]).el._drag = {}),
                  e(
                    "snap.drag.end." + r.el.id,
                    r.end_scope || r.start_scope || r.move_scope || r.el,
                    n
                  ),
                  e.off("snap.drag.*." + r.el.id);
              d = [];
            },
            v = s.length;
          v--;

        )
          !(function(e) {
            (t[e] = o[e] = function(n, r) {
              if (t.is(n, "function"))
                (this.events = this.events || []),
                  this.events.push({
                    name: e,
                    f: n,
                    unbind: h(this.node || document, e, n, r || this)
                  });
              else
                for (var i = 0, o = this.events.length; o > i; i++)
                  if (this.events[i].name == e)
                    try {
                      this.events[i].f.call(this);
                    } catch (t) {}
              return this;
            }),
              (t["un" + e] = o["un" + e] = function(t) {
                for (var n = this.events || [], r = n.length; r--; )
                  if (n[r].name == e && (n[r].f == t || !t))
                    return (
                      n[r].unbind(),
                      n.splice(r, 1),
                      !n.length && delete this.events,
                      this
                    );
                return this;
              });
          })(s[v]);
        (o.hover = function(t, e, n, r) {
          return this.mouseover(t, n).mouseout(e, r || n);
        }),
          (o.unhover = function(t, e) {
            return this.unmouseover(t).unmouseout(e);
          });
        var m = [];
        (o.drag = function(n, r, i, o, a, s) {
          function l(l, u, c) {
            (l.originalEvent || l).preventDefault(),
              (f._drag.x = u),
              (f._drag.y = c),
              (f._drag.id = l.identifier),
              !d.length && t.mousemove(p).mouseup(g),
              d.push({ el: f, move_scope: o, start_scope: a, end_scope: s }),
              r && e.on("snap.drag.start." + f.id, r),
              n && e.on("snap.drag.move." + f.id, n),
              i && e.on("snap.drag.end." + f.id, i),
              e("snap.drag.start." + f.id, a || o || f, u, c, l);
          }
          function u(t, n, r) {
            e("snap.draginit." + f.id, f, t, n, r);
          }
          var c,
            f = this;
          return arguments.length
            ? (e.on("snap.draginit." + f.id, l),
              (f._drag = {}),
              m.push({ el: f, start: l, init: u }),
              f.mousedown(u),
              f)
            : f.drag(
                function(t, e) {
                  this.attr({ transform: c + (c ? "T" : "t") + [t, e] });
                },
                function() {
                  c = this.transform().local;
                }
              );
        }),
          (o.undrag = function() {
            for (var n = m.length; n--; )
              m[n].el == this &&
                (this.unmousedown(m[n].init),
                m.splice(n, 1),
                e.unbind("snap.drag.*." + this.id),
                e.unbind("snap.draginit." + this.id));
            return !m.length && t.unmousemove(p).unmouseup(g), this;
          });
      }),
      r.plugin(function(t, n, r, i) {
        var o = (n.prototype, r.prototype),
          a = /^\s*url\((.+)\)/,
          s = String,
          l = t._.$;
        (t.filter = {}),
          (o.filter = function(e) {
            var r = this;
            "svg" != r.type && (r = r.paper);
            var i = t.parse(s(e)),
              o = t._.id(),
              a = (r.node.offsetWidth, r.node.offsetHeight, l("filter"));
            return (
              l(a, { id: o, filterUnits: "userSpaceOnUse" }),
              a.appendChild(i.node),
              r.defs.appendChild(a),
              new n(a)
            );
          }),
          e.on("snap.util.getattr.filter", function() {
            e.stop();
            var n = l(this.node, "filter");
            if (n) {
              var r = s(n).match(a);
              return r && t.select(r[1]);
            }
          }),
          e.on("snap.util.attr.filter", function(r) {
            if (r instanceof n && "filter" == r.type) {
              e.stop();
              var i = r.node.id;
              i || (l(r.node, { id: r.id }), (i = r.id)),
                l(this.node, { filter: t.url(i) });
            }
            (r && "none" != r) ||
              (e.stop(), this.node.removeAttribute("filter"));
          }),
          (t.filter.blur = function(e, n) {
            null == e && (e = 2);
            var r = null == n ? e : [e, n];
            return t.format('<feGaussianBlur stdDeviation="{def}"/>', {
              def: r
            });
          }),
          (t.filter.blur.toString = function() {
            return this();
          }),
          (t.filter.shadow = function(e, n, r, i, o) {
            return (
              null == o &&
                (null == i
                  ? ((o = r), (r = 4), (i = "#000"))
                  : ((o = i), (i = r), (r = 4))),
              null == r && (r = 4),
              null == o && (o = 1),
              null == e && ((e = 0), (n = 2)),
              null == n && (n = e),
              (i = t.color(i)),
              t.format(
                '<feGaussianBlur in="SourceAlpha" stdDeviation="{blur}"/><feOffset dx="{dx}" dy="{dy}" result="offsetblur"/><feFlood flood-color="{color}"/><feComposite in2="offsetblur" operator="in"/><feComponentTransfer><feFuncA type="linear" slope="{opacity}"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>',
                { color: i, dx: e, dy: n, blur: r, opacity: o }
              )
            );
          }),
          (t.filter.shadow.toString = function() {
            return this();
          }),
          (t.filter.grayscale = function(e) {
            return (
              null == e && (e = 1),
              t.format(
                '<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {b} {h} 0 0 0 0 0 1 0"/>',
                {
                  a: 0.2126 + 0.7874 * (1 - e),
                  b: 0.7152 - 0.7152 * (1 - e),
                  c: 0.0722 - 0.0722 * (1 - e),
                  d: 0.2126 - 0.2126 * (1 - e),
                  e: 0.7152 + 0.2848 * (1 - e),
                  f: 0.0722 - 0.0722 * (1 - e),
                  g: 0.2126 - 0.2126 * (1 - e),
                  h: 0.0722 + 0.9278 * (1 - e)
                }
              )
            );
          }),
          (t.filter.grayscale.toString = function() {
            return this();
          }),
          (t.filter.sepia = function(e) {
            return (
              null == e && (e = 1),
              t.format(
                '<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {h} {i} 0 0 0 0 0 1 0"/>',
                {
                  a: 0.393 + 0.607 * (1 - e),
                  b: 0.769 - 0.769 * (1 - e),
                  c: 0.189 - 0.189 * (1 - e),
                  d: 0.349 - 0.349 * (1 - e),
                  e: 0.686 + 0.314 * (1 - e),
                  f: 0.168 - 0.168 * (1 - e),
                  g: 0.272 - 0.272 * (1 - e),
                  h: 0.534 - 0.534 * (1 - e),
                  i: 0.131 + 0.869 * (1 - e)
                }
              )
            );
          }),
          (t.filter.sepia.toString = function() {
            return this();
          }),
          (t.filter.saturate = function(e) {
            return (
              null == e && (e = 1),
              t.format('<feColorMatrix type="saturate" values="{amount}"/>', {
                amount: 1 - e
              })
            );
          }),
          (t.filter.saturate.toString = function() {
            return this();
          }),
          (t.filter.hueRotate = function(e) {
            return (
              (e = e || 0),
              t.format('<feColorMatrix type="hueRotate" values="{angle}"/>', {
                angle: e
              })
            );
          }),
          (t.filter.hueRotate.toString = function() {
            return this();
          }),
          (t.filter.invert = function(e) {
            return (
              null == e && (e = 1),
              t.format(
                '<feComponentTransfer><feFuncR type="table" tableValues="{amount} {amount2}"/><feFuncG type="table" tableValues="{amount} {amount2}"/><feFuncB type="table" tableValues="{amount} {amount2}"/></feComponentTransfer>',
                { amount: e, amount2: 1 - e }
              )
            );
          }),
          (t.filter.invert.toString = function() {
            return this();
          }),
          (t.filter.brightness = function(e) {
            return (
              null == e && (e = 1),
              t.format(
                '<feComponentTransfer><feFuncR type="linear" slope="{amount}"/><feFuncG type="linear" slope="{amount}"/><feFuncB type="linear" slope="{amount}"/></feComponentTransfer>',
                { amount: e }
              )
            );
          }),
          (t.filter.brightness.toString = function() {
            return this();
          }),
          (t.filter.contrast = function(e) {
            return (
              null == e && (e = 1),
              t.format(
                '<feComponentTransfer><feFuncR type="linear" slope="{amount}" intercept="{amount2}"/><feFuncG type="linear" slope="{amount}" intercept="{amount2}"/><feFuncB type="linear" slope="{amount}" intercept="{amount2}"/></feComponentTransfer>',
                { amount: e, amount2: 0.5 - e / 2 }
              )
            );
          }),
          (t.filter.contrast.toString = function() {
            return this();
          });
      }),
      r.plugin(function(t, e, n, r, i) {
        var o = t._.box,
          a = t.is,
          s = /^[^a-z]*([tbmlrc])/i,
          l = function() {
            return "T" + this.dx + "," + this.dy;
          };
        (e.prototype.getAlign = function(t, e) {
          null == e && a(t, "string") && ((e = t), (t = null));
          var n = (t = t || this.paper).getBBox ? t.getBBox() : o(t),
            r = this.getBBox(),
            i = {};
          switch ((e = (e = e && e.match(s)) ? e[1].toLowerCase() : "c")) {
            case "t":
              (i.dx = 0), (i.dy = n.y - r.y);
              break;
            case "b":
              (i.dx = 0), (i.dy = n.y2 - r.y2);
              break;
            case "m":
              (i.dx = 0), (i.dy = n.cy - r.cy);
              break;
            case "l":
              (i.dx = n.x - r.x), (i.dy = 0);
              break;
            case "r":
              (i.dx = n.x2 - r.x2), (i.dy = 0);
              break;
            default:
              (i.dx = n.cx - r.cx), (i.dy = 0);
          }
          return (i.toString = l), i;
        }),
          (e.prototype.align = function(t, e) {
            return this.transform("..." + this.getAlign(t, e));
          });
      }),
      r.plugin(function(e, n, r, i) {
        function o(t) {
          t = t.split(/(?=#)/);
          var e = new String(t[5]);
          return (
            (e[50] = t[0]),
            (e[100] = t[1]),
            (e[200] = t[2]),
            (e[300] = t[3]),
            (e[400] = t[4]),
            (e[500] = t[5]),
            (e[600] = t[6]),
            (e[700] = t[7]),
            (e[800] = t[8]),
            (e[900] = t[9]),
            t[10] &&
              ((e.A100 = t[10]),
              (e.A200 = t[11]),
              (e.A400 = t[12]),
              (e.A700 = t[13])),
            e
          );
        }
        (e.mui = {}),
          (e.flat = {}),
          (e.mui.red = o(
            "#ffebee#ffcdd2#ef9a9a#e57373#ef5350#f44336#e53935#d32f2f#c62828#b71c1c#ff8a80#ff5252#ff1744#d50000"
          )),
          (e.mui.pink = o(
            "#FCE4EC#F8BBD0#F48FB1#F06292#EC407A#E91E63#D81B60#C2185B#AD1457#880E4F#FF80AB#FF4081#F50057#C51162"
          )),
          (e.mui.purple = o(
            "#F3E5F5#E1BEE7#CE93D8#BA68C8#AB47BC#9C27B0#8E24AA#7B1FA2#6A1B9A#4A148C#EA80FC#E040FB#D500F9#AA00FF"
          )),
          (e.mui.deeppurple = o(
            "#EDE7F6#D1C4E9#B39DDB#9575CD#7E57C2#673AB7#5E35B1#512DA8#4527A0#311B92#B388FF#7C4DFF#651FFF#6200EA"
          )),
          (e.mui.indigo = o(
            "#E8EAF6#C5CAE9#9FA8DA#7986CB#5C6BC0#3F51B5#3949AB#303F9F#283593#1A237E#8C9EFF#536DFE#3D5AFE#304FFE"
          )),
          (e.mui.blue = o(
            "#E3F2FD#BBDEFB#90CAF9#64B5F6#64B5F6#2196F3#1E88E5#1976D2#1565C0#0D47A1#82B1FF#448AFF#2979FF#2962FF"
          )),
          (e.mui.lightblue = o(
            "#E1F5FE#B3E5FC#81D4FA#4FC3F7#29B6F6#03A9F4#039BE5#0288D1#0277BD#01579B#80D8FF#40C4FF#00B0FF#0091EA"
          )),
          (e.mui.cyan = o(
            "#E0F7FA#B2EBF2#80DEEA#4DD0E1#26C6DA#00BCD4#00ACC1#0097A7#00838F#006064#84FFFF#18FFFF#00E5FF#00B8D4"
          )),
          (e.mui.teal = o(
            "#E0F2F1#B2DFDB#80CBC4#4DB6AC#26A69A#009688#00897B#00796B#00695C#004D40#A7FFEB#64FFDA#1DE9B6#00BFA5"
          )),
          (e.mui.green = o(
            "#E8F5E9#C8E6C9#A5D6A7#81C784#66BB6A#4CAF50#43A047#388E3C#2E7D32#1B5E20#B9F6CA#69F0AE#00E676#00C853"
          )),
          (e.mui.lightgreen = o(
            "#F1F8E9#DCEDC8#C5E1A5#AED581#9CCC65#8BC34A#7CB342#689F38#558B2F#33691E#CCFF90#B2FF59#76FF03#64DD17"
          )),
          (e.mui.lime = o(
            "#F9FBE7#F0F4C3#E6EE9C#DCE775#D4E157#CDDC39#C0CA33#AFB42B#9E9D24#827717#F4FF81#EEFF41#C6FF00#AEEA00"
          )),
          (e.mui.yellow = o(
            "#FFFDE7#FFF9C4#FFF59D#FFF176#FFEE58#FFEB3B#FDD835#FBC02D#F9A825#F57F17#FFFF8D#FFFF00#FFEA00#FFD600"
          )),
          (e.mui.amber = o(
            "#FFF8E1#FFECB3#FFE082#FFD54F#FFCA28#FFC107#FFB300#FFA000#FF8F00#FF6F00#FFE57F#FFD740#FFC400#FFAB00"
          )),
          (e.mui.orange = o(
            "#FFF3E0#FFE0B2#FFCC80#FFB74D#FFA726#FF9800#FB8C00#F57C00#EF6C00#E65100#FFD180#FFAB40#FF9100#FF6D00"
          )),
          (e.mui.deeporange = o(
            "#FBE9E7#FFCCBC#FFAB91#FF8A65#FF7043#FF5722#F4511E#E64A19#D84315#BF360C#FF9E80#FF6E40#FF3D00#DD2C00"
          )),
          (e.mui.brown = o(
            "#EFEBE9#D7CCC8#BCAAA4#A1887F#8D6E63#795548#6D4C41#5D4037#4E342E#3E2723"
          )),
          (e.mui.grey = o(
            "#FAFAFA#F5F5F5#EEEEEE#E0E0E0#BDBDBD#9E9E9E#757575#616161#424242#212121"
          )),
          (e.mui.bluegrey = o(
            "#ECEFF1#CFD8DC#B0BEC5#90A4AE#78909C#607D8B#546E7A#455A64#37474F#263238"
          )),
          (e.flat.turquoise = "#1abc9c"),
          (e.flat.greensea = "#16a085"),
          (e.flat.sunflower = "#f1c40f"),
          (e.flat.orange = "#f39c12"),
          (e.flat.emerland = "#2ecc71"),
          (e.flat.nephritis = "#27ae60"),
          (e.flat.carrot = "#e67e22"),
          (e.flat.pumpkin = "#d35400"),
          (e.flat.peterriver = "#3498db"),
          (e.flat.belizehole = "#2980b9"),
          (e.flat.alizarin = "#e74c3c"),
          (e.flat.pomegranate = "#c0392b"),
          (e.flat.amethyst = "#9b59b6"),
          (e.flat.wisteria = "#8e44ad"),
          (e.flat.clouds = "#ecf0f1"),
          (e.flat.silver = "#bdc3c7"),
          (e.flat.wetasphalt = "#34495e"),
          (e.flat.midnightblue = "#2c3e50"),
          (e.flat.concrete = "#95a5a6"),
          (e.flat.asbestos = "#7f8c8d"),
          (e.importMUIColors = function() {
            for (var n in e.mui) e.mui.hasOwnProperty(n) && (t[n] = e.mui[n]);
          });
      }),
      r
    );
  }),
  (function(t, e) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports
      ? (module.exports = t.document
          ? e(t, !0)
          : function(t) {
              if (!t.document)
                throw new Error("jQuery requires a window with a document");
              return e(t);
            })
      : e(t);
  })("undefined" != typeof window ? window : this, function(t, e) {
    "use strict";
    var n = [],
      r = t.document,
      i = Object.getPrototypeOf,
      o = n.slice,
      a = n.concat,
      s = n.push,
      l = n.indexOf,
      u = {},
      c = u.toString,
      f = u.hasOwnProperty,
      h = f.toString,
      d = h.call(Object),
      p = {},
      g = function(t) {
        return "function" == typeof t && "number" != typeof t.nodeType;
      },
      v = function(t) {
        return null != t && t === t.window;
      },
      m = { type: !0, src: !0, noModule: !0 };
    function y(t, e, n) {
      var i,
        o = (e = e || r).createElement("script");
      if (((o.text = t), n)) for (i in m) n[i] && (o[i] = n[i]);
      e.head.appendChild(o).parentNode.removeChild(o);
    }
    function b(t) {
      return null == t
        ? t + ""
        : "object" == typeof t || "function" == typeof t
          ? u[c.call(t)] || "object"
          : typeof t;
    }
    var x = function(t, e) {
        return new x.fn.init(t, e);
      },
      w = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    function C(t) {
      var e = !!t && "length" in t && t.length,
        n = b(t);
      return (
        !g(t) &&
        !v(t) &&
        ("array" === n ||
          0 === e ||
          ("number" == typeof e && e > 0 && e - 1 in t))
      );
    }
    (x.fn = x.prototype = {
      jquery: "3.3.1",
      constructor: x,
      length: 0,
      toArray: function() {
        return o.call(this);
      },
      get: function(t) {
        return null == t
          ? o.call(this)
          : t < 0
            ? this[t + this.length]
            : this[t];
      },
      pushStack: function(t) {
        var e = x.merge(this.constructor(), t);
        return (e.prevObject = this), e;
      },
      each: function(t) {
        return x.each(this, t);
      },
      map: function(t) {
        return this.pushStack(
          x.map(this, function(e, n) {
            return t.call(e, n, e);
          })
        );
      },
      slice: function() {
        return this.pushStack(o.apply(this, arguments));
      },
      first: function() {
        return this.eq(0);
      },
      last: function() {
        return this.eq(-1);
      },
      eq: function(t) {
        var e = this.length,
          n = +t + (t < 0 ? e : 0);
        return this.pushStack(n >= 0 && n < e ? [this[n]] : []);
      },
      end: function() {
        return this.prevObject || this.constructor();
      },
      push: s,
      sort: n.sort,
      splice: n.splice
    }),
      (x.extend = x.fn.extend = function() {
        var t,
          e,
          n,
          r,
          i,
          o,
          a = arguments[0] || {},
          s = 1,
          l = arguments.length,
          u = !1;
        for (
          "boolean" == typeof a && ((u = a), (a = arguments[s] || {}), s++),
            "object" == typeof a || g(a) || (a = {}),
            s === l && ((a = this), s--);
          s < l;
          s++
        )
          if (null != (t = arguments[s]))
            for (e in t)
              (n = a[e]),
                a !== (r = t[e]) &&
                  (u && r && (x.isPlainObject(r) || (i = Array.isArray(r)))
                    ? (i
                        ? ((i = !1), (o = n && Array.isArray(n) ? n : []))
                        : (o = n && x.isPlainObject(n) ? n : {}),
                      (a[e] = x.extend(u, o, r)))
                    : void 0 !== r && (a[e] = r));
        return a;
      }),
      x.extend({
        expando: "jQuery" + ("3.3.1" + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(t) {
          throw new Error(t);
        },
        noop: function() {},
        isPlainObject: function(t) {
          var e, n;
          return (
            !(!t || "[object Object]" !== c.call(t)) &&
            (!(e = i(t)) ||
              ("function" ==
                typeof (n = f.call(e, "constructor") && e.constructor) &&
                h.call(n) === d))
          );
        },
        isEmptyObject: function(t) {
          var e;
          for (e in t) return !1;
          return !0;
        },
        globalEval: function(t) {
          y(t);
        },
        each: function(t, e) {
          var n,
            r = 0;
          if (C(t))
            for (n = t.length; r < n && !1 !== e.call(t[r], r, t[r]); r++);
          else for (r in t) if (!1 === e.call(t[r], r, t[r])) break;
          return t;
        },
        trim: function(t) {
          return null == t ? "" : (t + "").replace(w, "");
        },
        makeArray: function(t, e) {
          var n = e || [];
          return (
            null != t &&
              (C(Object(t))
                ? x.merge(n, "string" == typeof t ? [t] : t)
                : s.call(n, t)),
            n
          );
        },
        inArray: function(t, e, n) {
          return null == e ? -1 : l.call(e, t, n);
        },
        merge: function(t, e) {
          for (var n = +e.length, r = 0, i = t.length; r < n; r++)
            t[i++] = e[r];
          return (t.length = i), t;
        },
        grep: function(t, e, n) {
          for (var r = [], i = 0, o = t.length, a = !n; i < o; i++)
            !e(t[i], i) !== a && r.push(t[i]);
          return r;
        },
        map: function(t, e, n) {
          var r,
            i,
            o = 0,
            s = [];
          if (C(t))
            for (r = t.length; o < r; o++)
              null != (i = e(t[o], o, n)) && s.push(i);
          else for (o in t) null != (i = e(t[o], o, n)) && s.push(i);
          return a.apply([], s);
        },
        guid: 1,
        support: p
      }),
      "function" == typeof Symbol &&
        (x.fn[Symbol.iterator] = n[Symbol.iterator]),
      x.each(
        "Boolean Number String Function Array Date RegExp Object Error Symbol".split(
          " "
        ),
        function(t, e) {
          u["[object " + e + "]"] = e.toLowerCase();
        }
      );
    var T = (function(t) {
      var e,
        n,
        r,
        i,
        o,
        a,
        s,
        l,
        u,
        c,
        f,
        h,
        d,
        p,
        g,
        v,
        m,
        y,
        b,
        x = "sizzle" + 1 * new Date(),
        w = t.document,
        C = 0,
        T = 0,
        E = at(),
        S = at(),
        k = at(),
        A = function(t, e) {
          return t === e && (f = !0), 0;
        },
        F = {}.hasOwnProperty,
        D = [],
        N = D.pop,
        $ = D.push,
        j = D.push,
        B = D.slice,
        O = function(t, e) {
          for (var n = 0, r = t.length; n < r; n++) if (t[n] === e) return n;
          return -1;
        },
        L =
          "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        I = "[\\x20\\t\\r\\n\\f]",
        M = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
        R =
          "\\[" +
          I +
          "*(" +
          M +
          ")(?:" +
          I +
          "*([*^$|!~]?=)" +
          I +
          "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" +
          M +
          "))|)" +
          I +
          "*\\]",
        P =
          ":(" +
          M +
          ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" +
          R +
          ")*)|.*)\\)|)",
        q = new RegExp(I + "+", "g"),
        _ = new RegExp("^" + I + "+|((?:^|[^\\\\])(?:\\\\.)*)" + I + "+$", "g"),
        H = new RegExp("^" + I + "*," + I + "*"),
        U = new RegExp("^" + I + "*([>+~]|" + I + ")" + I + "*"),
        W = new RegExp("=" + I + "*([^\\]'\"]*?)" + I + "*\\]", "g"),
        V = new RegExp(P),
        z = new RegExp("^" + M + "$"),
        G = {
          ID: new RegExp("^#(" + M + ")"),
          CLASS: new RegExp("^\\.(" + M + ")"),
          TAG: new RegExp("^(" + M + "|[*])"),
          ATTR: new RegExp("^" + R),
          PSEUDO: new RegExp("^" + P),
          CHILD: new RegExp(
            "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
              I +
              "*(even|odd|(([+-]|)(\\d*)n|)" +
              I +
              "*(?:([+-]|)" +
              I +
              "*(\\d+)|))" +
              I +
              "*\\)|)",
            "i"
          ),
          bool: new RegExp("^(?:" + L + ")$", "i"),
          needsContext: new RegExp(
            "^" +
              I +
              "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
              I +
              "*((?:-\\d)?\\d*)" +
              I +
              "*\\)|)(?=[^-]|$)",
            "i"
          )
        },
        X = /^(?:input|select|textarea|button)$/i,
        Y = /^h\d$/i,
        Q = /^[^{]+\{\s*\[native \w/,
        J = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        Z = /[+~]/,
        K = new RegExp("\\\\([\\da-f]{1,6}" + I + "?|(" + I + ")|.)", "ig"),
        tt = function(t, e, n) {
          var r = "0x" + e - 65536;
          return r != r || n
            ? e
            : r < 0
              ? String.fromCharCode(r + 65536)
              : String.fromCharCode((r >> 10) | 55296, (1023 & r) | 56320);
        },
        et = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
        nt = function(t, e) {
          return e
            ? "\0" === t
              ? "\ufffd"
              : t.slice(0, -1) +
                "\\" +
                t.charCodeAt(t.length - 1).toString(16) +
                " "
            : "\\" + t;
        },
        rt = function() {
          h();
        },
        it = yt(
          function(t) {
            return !0 === t.disabled && ("form" in t || "label" in t);
          },
          { dir: "parentNode", next: "legend" }
        );
      try {
        j.apply((D = B.call(w.childNodes)), w.childNodes),
          D[w.childNodes.length].nodeType;
      } catch (t) {
        j = {
          apply: D.length
            ? function(t, e) {
                $.apply(t, B.call(e));
              }
            : function(t, e) {
                for (var n = t.length, r = 0; (t[n++] = e[r++]); );
                t.length = n - 1;
              }
        };
      }
      function ot(t, e, r, i) {
        var o,
          s,
          u,
          c,
          f,
          p,
          m,
          y = e && e.ownerDocument,
          C = e ? e.nodeType : 9;
        if (
          ((r = r || []),
          "string" != typeof t || !t || (1 !== C && 9 !== C && 11 !== C))
        )
          return r;
        if (
          !i &&
          ((e ? e.ownerDocument || e : w) !== d && h(e), (e = e || d), g)
        ) {
          if (11 !== C && (f = J.exec(t)))
            if ((o = f[1])) {
              if (9 === C) {
                if (!(u = e.getElementById(o))) return r;
                if (u.id === o) return r.push(u), r;
              } else if (
                y &&
                (u = y.getElementById(o)) &&
                b(e, u) &&
                u.id === o
              )
                return r.push(u), r;
            } else {
              if (f[2]) return j.apply(r, e.getElementsByTagName(t)), r;
              if (
                (o = f[3]) &&
                n.getElementsByClassName &&
                e.getElementsByClassName
              )
                return j.apply(r, e.getElementsByClassName(o)), r;
            }
          if (n.qsa && !k[t + " "] && (!v || !v.test(t))) {
            if (1 !== C) (y = e), (m = t);
            else if ("object" !== e.nodeName.toLowerCase()) {
              for (
                (c = e.getAttribute("id"))
                  ? (c = c.replace(et, nt))
                  : e.setAttribute("id", (c = x)),
                  s = (p = a(t)).length;
                s--;

              )
                p[s] = "#" + c + " " + mt(p[s]);
              (m = p.join(",")), (y = (Z.test(t) && gt(e.parentNode)) || e);
            }
            if (m)
              try {
                return j.apply(r, y.querySelectorAll(m)), r;
              } catch (t) {
              } finally {
                c === x && e.removeAttribute("id");
              }
          }
        }
        return l(t.replace(_, "$1"), e, r, i);
      }
      function at() {
        var t = [];
        return function e(n, i) {
          return (
            t.push(n + " ") > r.cacheLength && delete e[t.shift()],
            (e[n + " "] = i)
          );
        };
      }
      function st(t) {
        return (t[x] = !0), t;
      }
      function lt(t) {
        var e = d.createElement("fieldset");
        try {
          return !!t(e);
        } catch (t) {
          return !1;
        } finally {
          e.parentNode && e.parentNode.removeChild(e), (e = null);
        }
      }
      function ut(t, e) {
        for (var n = t.split("|"), i = n.length; i--; ) r.attrHandle[n[i]] = e;
      }
      function ct(t, e) {
        var n = e && t,
          r =
            n &&
            1 === t.nodeType &&
            1 === e.nodeType &&
            t.sourceIndex - e.sourceIndex;
        if (r) return r;
        if (n) for (; (n = n.nextSibling); ) if (n === e) return -1;
        return t ? 1 : -1;
      }
      function ft(t) {
        return function(e) {
          return "input" === e.nodeName.toLowerCase() && e.type === t;
        };
      }
      function ht(t) {
        return function(e) {
          var n = e.nodeName.toLowerCase();
          return ("input" === n || "button" === n) && e.type === t;
        };
      }
      function dt(t) {
        return function(e) {
          return "form" in e
            ? e.parentNode && !1 === e.disabled
              ? "label" in e
                ? "label" in e.parentNode
                  ? e.parentNode.disabled === t
                  : e.disabled === t
                : e.isDisabled === t || (e.isDisabled !== !t && it(e) === t)
              : e.disabled === t
            : "label" in e && e.disabled === t;
        };
      }
      function pt(t) {
        return st(function(e) {
          return (
            (e = +e),
            st(function(n, r) {
              for (var i, o = t([], n.length, e), a = o.length; a--; )
                n[(i = o[a])] && (n[i] = !(r[i] = n[i]));
            })
          );
        });
      }
      function gt(t) {
        return t && void 0 !== t.getElementsByTagName && t;
      }
      for (e in ((n = ot.support = {}),
      (o = ot.isXML = function(t) {
        var e = t && (t.ownerDocument || t).documentElement;
        return !!e && "HTML" !== e.nodeName;
      }),
      (h = ot.setDocument = function(t) {
        var e,
          i,
          a = t ? t.ownerDocument || t : w;
        return a !== d && 9 === a.nodeType && a.documentElement
          ? ((p = (d = a).documentElement),
            (g = !o(d)),
            w !== d &&
              (i = d.defaultView) &&
              i.top !== i &&
              (i.addEventListener
                ? i.addEventListener("unload", rt, !1)
                : i.attachEvent && i.attachEvent("onunload", rt)),
            (n.attributes = lt(function(t) {
              return (t.className = "i"), !t.getAttribute("className");
            })),
            (n.getElementsByTagName = lt(function(t) {
              return (
                t.appendChild(d.createComment("")),
                !t.getElementsByTagName("*").length
              );
            })),
            (n.getElementsByClassName = Q.test(d.getElementsByClassName)),
            (n.getById = lt(function(t) {
              return (
                (p.appendChild(t).id = x),
                !d.getElementsByName || !d.getElementsByName(x).length
              );
            })),
            n.getById
              ? ((r.filter.ID = function(t) {
                  var e = t.replace(K, tt);
                  return function(t) {
                    return t.getAttribute("id") === e;
                  };
                }),
                (r.find.ID = function(t, e) {
                  if (void 0 !== e.getElementById && g) {
                    var n = e.getElementById(t);
                    return n ? [n] : [];
                  }
                }))
              : ((r.filter.ID = function(t) {
                  var e = t.replace(K, tt);
                  return function(t) {
                    var n =
                      void 0 !== t.getAttributeNode && t.getAttributeNode("id");
                    return n && n.value === e;
                  };
                }),
                (r.find.ID = function(t, e) {
                  if (void 0 !== e.getElementById && g) {
                    var n,
                      r,
                      i,
                      o = e.getElementById(t);
                    if (o) {
                      if ((n = o.getAttributeNode("id")) && n.value === t)
                        return [o];
                      for (i = e.getElementsByName(t), r = 0; (o = i[r++]); )
                        if ((n = o.getAttributeNode("id")) && n.value === t)
                          return [o];
                    }
                    return [];
                  }
                })),
            (r.find.TAG = n.getElementsByTagName
              ? function(t, e) {
                  return void 0 !== e.getElementsByTagName
                    ? e.getElementsByTagName(t)
                    : n.qsa
                      ? e.querySelectorAll(t)
                      : void 0;
                }
              : function(t, e) {
                  var n,
                    r = [],
                    i = 0,
                    o = e.getElementsByTagName(t);
                  if ("*" === t) {
                    for (; (n = o[i++]); ) 1 === n.nodeType && r.push(n);
                    return r;
                  }
                  return o;
                }),
            (r.find.CLASS =
              n.getElementsByClassName &&
              function(t, e) {
                if (void 0 !== e.getElementsByClassName && g)
                  return e.getElementsByClassName(t);
              }),
            (m = []),
            (v = []),
            (n.qsa = Q.test(d.querySelectorAll)) &&
              (lt(function(t) {
                (p.appendChild(t).innerHTML =
                  "<a id='" +
                  x +
                  "'></a><select id='" +
                  x +
                  "-\r\\' msallowcapture=''><option selected=''></option></select>"),
                  t.querySelectorAll("[msallowcapture^='']").length &&
                    v.push("[*^$]=" + I + "*(?:''|\"\")"),
                  t.querySelectorAll("[selected]").length ||
                    v.push("\\[" + I + "*(?:value|" + L + ")"),
                  t.querySelectorAll("[id~=" + x + "-]").length || v.push("~="),
                  t.querySelectorAll(":checked").length || v.push(":checked"),
                  t.querySelectorAll("a#" + x + "+*").length ||
                    v.push(".#.+[+~]");
              }),
              lt(function(t) {
                t.innerHTML =
                  "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var e = d.createElement("input");
                e.setAttribute("type", "hidden"),
                  t.appendChild(e).setAttribute("name", "D"),
                  t.querySelectorAll("[name=d]").length &&
                    v.push("name" + I + "*[*^$|!~]?="),
                  2 !== t.querySelectorAll(":enabled").length &&
                    v.push(":enabled", ":disabled"),
                  (p.appendChild(t).disabled = !0),
                  2 !== t.querySelectorAll(":disabled").length &&
                    v.push(":enabled", ":disabled"),
                  t.querySelectorAll("*,:x"),
                  v.push(",.*:");
              })),
            (n.matchesSelector = Q.test(
              (y =
                p.matches ||
                p.webkitMatchesSelector ||
                p.mozMatchesSelector ||
                p.oMatchesSelector ||
                p.msMatchesSelector)
            )) &&
              lt(function(t) {
                (n.disconnectedMatch = y.call(t, "*")),
                  y.call(t, "[s!='']:x"),
                  m.push("!=", P);
              }),
            (v = v.length && new RegExp(v.join("|"))),
            (m = m.length && new RegExp(m.join("|"))),
            (e = Q.test(p.compareDocumentPosition)),
            (b =
              e || Q.test(p.contains)
                ? function(t, e) {
                    var n = 9 === t.nodeType ? t.documentElement : t,
                      r = e && e.parentNode;
                    return (
                      t === r ||
                      !(
                        !r ||
                        1 !== r.nodeType ||
                        !(n.contains
                          ? n.contains(r)
                          : t.compareDocumentPosition &&
                            16 & t.compareDocumentPosition(r))
                      )
                    );
                  }
                : function(t, e) {
                    if (e) for (; (e = e.parentNode); ) if (e === t) return !0;
                    return !1;
                  }),
            (A = e
              ? function(t, e) {
                  if (t === e) return (f = !0), 0;
                  var r =
                    !t.compareDocumentPosition - !e.compareDocumentPosition;
                  return (
                    r ||
                    (1 &
                      (r =
                        (t.ownerDocument || t) === (e.ownerDocument || e)
                          ? t.compareDocumentPosition(e)
                          : 1) ||
                    (!n.sortDetached && e.compareDocumentPosition(t) === r)
                      ? t === d || (t.ownerDocument === w && b(w, t))
                        ? -1
                        : e === d || (e.ownerDocument === w && b(w, e))
                          ? 1
                          : c
                            ? O(c, t) - O(c, e)
                            : 0
                      : 4 & r
                        ? -1
                        : 1)
                  );
                }
              : function(t, e) {
                  if (t === e) return (f = !0), 0;
                  var n,
                    r = 0,
                    i = t.parentNode,
                    o = e.parentNode,
                    a = [t],
                    s = [e];
                  if (!i || !o)
                    return t === d
                      ? -1
                      : e === d
                        ? 1
                        : i
                          ? -1
                          : o
                            ? 1
                            : c
                              ? O(c, t) - O(c, e)
                              : 0;
                  if (i === o) return ct(t, e);
                  for (n = t; (n = n.parentNode); ) a.unshift(n);
                  for (n = e; (n = n.parentNode); ) s.unshift(n);
                  for (; a[r] === s[r]; ) r++;
                  return r
                    ? ct(a[r], s[r])
                    : a[r] === w
                      ? -1
                      : s[r] === w
                        ? 1
                        : 0;
                }),
            d)
          : d;
      }),
      (ot.matches = function(t, e) {
        return ot(t, null, null, e);
      }),
      (ot.matchesSelector = function(t, e) {
        if (
          ((t.ownerDocument || t) !== d && h(t),
          (e = e.replace(W, "='$1']")),
          n.matchesSelector &&
            g &&
            !k[e + " "] &&
            (!m || !m.test(e)) &&
            (!v || !v.test(e)))
        )
          try {
            var r = y.call(t, e);
            if (
              r ||
              n.disconnectedMatch ||
              (t.document && 11 !== t.document.nodeType)
            )
              return r;
          } catch (t) {}
        return ot(e, d, null, [t]).length > 0;
      }),
      (ot.contains = function(t, e) {
        return (t.ownerDocument || t) !== d && h(t), b(t, e);
      }),
      (ot.attr = function(t, e) {
        (t.ownerDocument || t) !== d && h(t);
        var i = r.attrHandle[e.toLowerCase()],
          o = i && F.call(r.attrHandle, e.toLowerCase()) ? i(t, e, !g) : void 0;
        return void 0 !== o
          ? o
          : n.attributes || !g
            ? t.getAttribute(e)
            : (o = t.getAttributeNode(e)) && o.specified
              ? o.value
              : null;
      }),
      (ot.escape = function(t) {
        return (t + "").replace(et, nt);
      }),
      (ot.error = function(t) {
        throw new Error("Syntax error, unrecognized expression: " + t);
      }),
      (ot.uniqueSort = function(t) {
        var e,
          r = [],
          i = 0,
          o = 0;
        if (
          ((f = !n.detectDuplicates),
          (c = !n.sortStable && t.slice(0)),
          t.sort(A),
          f)
        ) {
          for (; (e = t[o++]); ) e === t[o] && (i = r.push(o));
          for (; i--; ) t.splice(r[i], 1);
        }
        return (c = null), t;
      }),
      (i = ot.getText = function(t) {
        var e,
          n = "",
          r = 0,
          o = t.nodeType;
        if (o) {
          if (1 === o || 9 === o || 11 === o) {
            if ("string" == typeof t.textContent) return t.textContent;
            for (t = t.firstChild; t; t = t.nextSibling) n += i(t);
          } else if (3 === o || 4 === o) return t.nodeValue;
        } else for (; (e = t[r++]); ) n += i(e);
        return n;
      }),
      ((r = ot.selectors = {
        cacheLength: 50,
        createPseudo: st,
        match: G,
        attrHandle: {},
        find: {},
        relative: {
          ">": { dir: "parentNode", first: !0 },
          " ": { dir: "parentNode" },
          "+": { dir: "previousSibling", first: !0 },
          "~": { dir: "previousSibling" }
        },
        preFilter: {
          ATTR: function(t) {
            return (
              (t[1] = t[1].replace(K, tt)),
              (t[3] = (t[3] || t[4] || t[5] || "").replace(K, tt)),
              "~=" === t[2] && (t[3] = " " + t[3] + " "),
              t.slice(0, 4)
            );
          },
          CHILD: function(t) {
            return (
              (t[1] = t[1].toLowerCase()),
              "nth" === t[1].slice(0, 3)
                ? (t[3] || ot.error(t[0]),
                  (t[4] = +(t[4]
                    ? t[5] + (t[6] || 1)
                    : 2 * ("even" === t[3] || "odd" === t[3]))),
                  (t[5] = +(t[7] + t[8] || "odd" === t[3])))
                : t[3] && ot.error(t[0]),
              t
            );
          },
          PSEUDO: function(t) {
            var e,
              n = !t[6] && t[2];
            return G.CHILD.test(t[0])
              ? null
              : (t[3]
                  ? (t[2] = t[4] || t[5] || "")
                  : n &&
                    V.test(n) &&
                    (e = a(n, !0)) &&
                    (e = n.indexOf(")", n.length - e) - n.length) &&
                    ((t[0] = t[0].slice(0, e)), (t[2] = n.slice(0, e))),
                t.slice(0, 3));
          }
        },
        filter: {
          TAG: function(t) {
            var e = t.replace(K, tt).toLowerCase();
            return "*" === t
              ? function() {
                  return !0;
                }
              : function(t) {
                  return t.nodeName && t.nodeName.toLowerCase() === e;
                };
          },
          CLASS: function(t) {
            var e = E[t + " "];
            return (
              e ||
              ((e = new RegExp("(^|" + I + ")" + t + "(" + I + "|$)")) &&
                E(t, function(t) {
                  return e.test(
                    ("string" == typeof t.className && t.className) ||
                      (void 0 !== t.getAttribute && t.getAttribute("class")) ||
                      ""
                  );
                }))
            );
          },
          ATTR: function(t, e, n) {
            return function(r) {
              var i = ot.attr(r, t);
              return null == i
                ? "!=" === e
                : !e ||
                    ((i += ""),
                    "=" === e
                      ? i === n
                      : "!=" === e
                        ? i !== n
                        : "^=" === e
                          ? n && 0 === i.indexOf(n)
                          : "*=" === e
                            ? n && i.indexOf(n) > -1
                            : "$=" === e
                              ? n && i.slice(-n.length) === n
                              : "~=" === e
                                ? (" " + i.replace(q, " ") + " ").indexOf(n) >
                                  -1
                                : "|=" === e &&
                                  (i === n ||
                                    i.slice(0, n.length + 1) === n + "-"));
            };
          },
          CHILD: function(t, e, n, r, i) {
            var o = "nth" !== t.slice(0, 3),
              a = "last" !== t.slice(-4),
              s = "of-type" === e;
            return 1 === r && 0 === i
              ? function(t) {
                  return !!t.parentNode;
                }
              : function(e, n, l) {
                  var u,
                    c,
                    f,
                    h,
                    d,
                    p,
                    g = o !== a ? "nextSibling" : "previousSibling",
                    v = e.parentNode,
                    m = s && e.nodeName.toLowerCase(),
                    y = !l && !s,
                    b = !1;
                  if (v) {
                    if (o) {
                      for (; g; ) {
                        for (h = e; (h = h[g]); )
                          if (
                            s
                              ? h.nodeName.toLowerCase() === m
                              : 1 === h.nodeType
                          )
                            return !1;
                        p = g = "only" === t && !p && "nextSibling";
                      }
                      return !0;
                    }
                    if (((p = [a ? v.firstChild : v.lastChild]), a && y)) {
                      for (
                        b =
                          (d =
                            (u =
                              (c =
                                (f = (h = v)[x] || (h[x] = {}))[h.uniqueID] ||
                                (f[h.uniqueID] = {}))[t] || [])[0] === C &&
                            u[1]) && u[2],
                          h = d && v.childNodes[d];
                        (h = (++d && h && h[g]) || (b = d = 0) || p.pop());

                      )
                        if (1 === h.nodeType && ++b && h === e) {
                          c[t] = [C, d, b];
                          break;
                        }
                    } else if (
                      (y &&
                        (b = d =
                          (u =
                            (c =
                              (f = (h = e)[x] || (h[x] = {}))[h.uniqueID] ||
                              (f[h.uniqueID] = {}))[t] || [])[0] === C && u[1]),
                      !1 === b)
                    )
                      for (
                        ;
                        (h = (++d && h && h[g]) || (b = d = 0) || p.pop()) &&
                        ((s
                          ? h.nodeName.toLowerCase() !== m
                          : 1 !== h.nodeType) ||
                          !++b ||
                          (y &&
                            ((c =
                              (f = h[x] || (h[x] = {}))[h.uniqueID] ||
                              (f[h.uniqueID] = {}))[t] = [C, b]),
                          h !== e));

                      );
                    return (b -= i) === r || (b % r == 0 && b / r >= 0);
                  }
                };
          },
          PSEUDO: function(t, e) {
            var n,
              i =
                r.pseudos[t] ||
                r.setFilters[t.toLowerCase()] ||
                ot.error("unsupported pseudo: " + t);
            return i[x]
              ? i(e)
              : i.length > 1
                ? ((n = [t, t, "", e]),
                  r.setFilters.hasOwnProperty(t.toLowerCase())
                    ? st(function(t, n) {
                        for (var r, o = i(t, e), a = o.length; a--; )
                          t[(r = O(t, o[a]))] = !(n[r] = o[a]);
                      })
                    : function(t) {
                        return i(t, 0, n);
                      })
                : i;
          }
        },
        pseudos: {
          not: st(function(t) {
            var e = [],
              n = [],
              r = s(t.replace(_, "$1"));
            return r[x]
              ? st(function(t, e, n, i) {
                  for (var o, a = r(t, null, i, []), s = t.length; s--; )
                    (o = a[s]) && (t[s] = !(e[s] = o));
                })
              : function(t, i, o) {
                  return (e[0] = t), r(e, null, o, n), (e[0] = null), !n.pop();
                };
          }),
          has: st(function(t) {
            return function(e) {
              return ot(t, e).length > 0;
            };
          }),
          contains: st(function(t) {
            return (
              (t = t.replace(K, tt)),
              function(e) {
                return (e.textContent || e.innerText || i(e)).indexOf(t) > -1;
              }
            );
          }),
          lang: st(function(t) {
            return (
              z.test(t || "") || ot.error("unsupported lang: " + t),
              (t = t.replace(K, tt).toLowerCase()),
              function(e) {
                var n;
                do {
                  if (
                    (n = g
                      ? e.lang
                      : e.getAttribute("xml:lang") || e.getAttribute("lang"))
                  )
                    return (
                      (n = n.toLowerCase()) === t || 0 === n.indexOf(t + "-")
                    );
                } while ((e = e.parentNode) && 1 === e.nodeType);
                return !1;
              }
            );
          }),
          target: function(e) {
            var n = t.location && t.location.hash;
            return n && n.slice(1) === e.id;
          },
          root: function(t) {
            return t === p;
          },
          focus: function(t) {
            return (
              t === d.activeElement &&
              (!d.hasFocus || d.hasFocus()) &&
              !!(t.type || t.href || ~t.tabIndex)
            );
          },
          enabled: dt(!1),
          disabled: dt(!0),
          checked: function(t) {
            var e = t.nodeName.toLowerCase();
            return (
              ("input" === e && !!t.checked) || ("option" === e && !!t.selected)
            );
          },
          selected: function(t) {
            return (
              t.parentNode && t.parentNode.selectedIndex, !0 === t.selected
            );
          },
          empty: function(t) {
            for (t = t.firstChild; t; t = t.nextSibling)
              if (t.nodeType < 6) return !1;
            return !0;
          },
          parent: function(t) {
            return !r.pseudos.empty(t);
          },
          header: function(t) {
            return Y.test(t.nodeName);
          },
          input: function(t) {
            return X.test(t.nodeName);
          },
          button: function(t) {
            var e = t.nodeName.toLowerCase();
            return ("input" === e && "button" === t.type) || "button" === e;
          },
          text: function(t) {
            var e;
            return (
              "input" === t.nodeName.toLowerCase() &&
              "text" === t.type &&
              (null == (e = t.getAttribute("type")) ||
                "text" === e.toLowerCase())
            );
          },
          first: pt(function() {
            return [0];
          }),
          last: pt(function(t, e) {
            return [e - 1];
          }),
          eq: pt(function(t, e, n) {
            return [n < 0 ? n + e : n];
          }),
          even: pt(function(t, e) {
            for (var n = 0; n < e; n += 2) t.push(n);
            return t;
          }),
          odd: pt(function(t, e) {
            for (var n = 1; n < e; n += 2) t.push(n);
            return t;
          }),
          lt: pt(function(t, e, n) {
            for (var r = n < 0 ? n + e : n; --r >= 0; ) t.push(r);
            return t;
          }),
          gt: pt(function(t, e, n) {
            for (var r = n < 0 ? n + e : n; ++r < e; ) t.push(r);
            return t;
          })
        }
      }).pseudos.nth = r.pseudos.eq),
      { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }))
        r.pseudos[e] = ft(e);
      for (e in { submit: !0, reset: !0 }) r.pseudos[e] = ht(e);
      function vt() {}
      function mt(t) {
        for (var e = 0, n = t.length, r = ""; e < n; e++) r += t[e].value;
        return r;
      }
      function yt(t, e, n) {
        var r = e.dir,
          i = e.next,
          o = i || r,
          a = n && "parentNode" === o,
          s = T++;
        return e.first
          ? function(e, n, i) {
              for (; (e = e[r]); ) if (1 === e.nodeType || a) return t(e, n, i);
              return !1;
            }
          : function(e, n, l) {
              var u,
                c,
                f,
                h = [C, s];
              if (l) {
                for (; (e = e[r]); )
                  if ((1 === e.nodeType || a) && t(e, n, l)) return !0;
              } else
                for (; (e = e[r]); )
                  if (1 === e.nodeType || a)
                    if (
                      ((c =
                        (f = e[x] || (e[x] = {}))[e.uniqueID] ||
                        (f[e.uniqueID] = {})),
                      i && i === e.nodeName.toLowerCase())
                    )
                      e = e[r] || e;
                    else {
                      if ((u = c[o]) && u[0] === C && u[1] === s)
                        return (h[2] = u[2]);
                      if (((c[o] = h), (h[2] = t(e, n, l)))) return !0;
                    }
              return !1;
            };
      }
      function bt(t) {
        return t.length > 1
          ? function(e, n, r) {
              for (var i = t.length; i--; ) if (!t[i](e, n, r)) return !1;
              return !0;
            }
          : t[0];
      }
      function xt(t, e, n, r, i) {
        for (var o, a = [], s = 0, l = t.length, u = null != e; s < l; s++)
          (o = t[s]) && ((n && !n(o, r, i)) || (a.push(o), u && e.push(s)));
        return a;
      }
      function wt(t, e, n, r, i, o) {
        return (
          r && !r[x] && (r = wt(r)),
          i && !i[x] && (i = wt(i, o)),
          st(function(o, a, s, l) {
            var u,
              c,
              f,
              h = [],
              d = [],
              p = a.length,
              g =
                o ||
                (function(t, e, n) {
                  for (var r = 0, i = e.length; r < i; r++) ot(t, e[r], n);
                  return n;
                })(e || "*", s.nodeType ? [s] : s, []),
              v = !t || (!o && e) ? g : xt(g, h, t, s, l),
              m = n ? (i || (o ? t : p || r) ? [] : a) : v;
            if ((n && n(v, m, s, l), r))
              for (u = xt(m, d), r(u, [], s, l), c = u.length; c--; )
                (f = u[c]) && (m[d[c]] = !(v[d[c]] = f));
            if (o) {
              if (i || t) {
                if (i) {
                  for (u = [], c = m.length; c--; )
                    (f = m[c]) && u.push((v[c] = f));
                  i(null, (m = []), u, l);
                }
                for (c = m.length; c--; )
                  (f = m[c]) &&
                    (u = i ? O(o, f) : h[c]) > -1 &&
                    (o[u] = !(a[u] = f));
              }
            } else (m = xt(m === a ? m.splice(p, m.length) : m)), i ? i(null, a, m, l) : j.apply(a, m);
          })
        );
      }
      function Ct(t) {
        for (
          var e,
            n,
            i,
            o = t.length,
            a = r.relative[t[0].type],
            s = a || r.relative[" "],
            l = a ? 1 : 0,
            c = yt(
              function(t) {
                return t === e;
              },
              s,
              !0
            ),
            f = yt(
              function(t) {
                return O(e, t) > -1;
              },
              s,
              !0
            ),
            h = [
              function(t, n, r) {
                var i =
                  (!a && (r || n !== u)) ||
                  ((e = n).nodeType ? c(t, n, r) : f(t, n, r));
                return (e = null), i;
              }
            ];
          l < o;
          l++
        )
          if ((n = r.relative[t[l].type])) h = [yt(bt(h), n)];
          else {
            if ((n = r.filter[t[l].type].apply(null, t[l].matches))[x]) {
              for (i = ++l; i < o && !r.relative[t[i].type]; i++);
              return wt(
                l > 1 && bt(h),
                l > 1 &&
                  mt(
                    t
                      .slice(0, l - 1)
                      .concat({ value: " " === t[l - 2].type ? "*" : "" })
                  ).replace(_, "$1"),
                n,
                l < i && Ct(t.slice(l, i)),
                i < o && Ct((t = t.slice(i))),
                i < o && mt(t)
              );
            }
            h.push(n);
          }
        return bt(h);
      }
      return (
        (vt.prototype = r.filters = r.pseudos),
        (r.setFilters = new vt()),
        (a = ot.tokenize = function(t, e) {
          var n,
            i,
            o,
            a,
            s,
            l,
            u,
            c = S[t + " "];
          if (c) return e ? 0 : c.slice(0);
          for (s = t, l = [], u = r.preFilter; s; ) {
            for (a in ((n && !(i = H.exec(s))) ||
              (i && (s = s.slice(i[0].length) || s), l.push((o = []))),
            (n = !1),
            (i = U.exec(s)) &&
              ((n = i.shift()),
              o.push({ value: n, type: i[0].replace(_, " ") }),
              (s = s.slice(n.length))),
            r.filter))
              !(i = G[a].exec(s)) ||
                (u[a] && !(i = u[a](i))) ||
                ((n = i.shift()),
                o.push({ value: n, type: a, matches: i }),
                (s = s.slice(n.length)));
            if (!n) break;
          }
          return e ? s.length : s ? ot.error(t) : S(t, l).slice(0);
        }),
        (s = ot.compile = function(t, e) {
          var n,
            i = [],
            o = [],
            s = k[t + " "];
          if (!s) {
            for (e || (e = a(t)), n = e.length; n--; )
              (s = Ct(e[n]))[x] ? i.push(s) : o.push(s);
            (s = k(
              t,
              (function(t, e) {
                var n = e.length > 0,
                  i = t.length > 0,
                  o = function(o, a, s, l, c) {
                    var f,
                      p,
                      v,
                      m = 0,
                      y = "0",
                      b = o && [],
                      x = [],
                      w = u,
                      T = o || (i && r.find.TAG("*", c)),
                      E = (C += null == w ? 1 : Math.random() || 0.1),
                      S = T.length;
                    for (
                      c && (u = a === d || a || c);
                      y !== S && null != (f = T[y]);
                      y++
                    ) {
                      if (i && f) {
                        for (
                          p = 0, a || f.ownerDocument === d || (h(f), (s = !g));
                          (v = t[p++]);

                        )
                          if (v(f, a || d, s)) {
                            l.push(f);
                            break;
                          }
                        c && (C = E);
                      }
                      n && ((f = !v && f) && m--, o && b.push(f));
                    }
                    if (((m += y), n && y !== m)) {
                      for (p = 0; (v = e[p++]); ) v(b, x, a, s);
                      if (o) {
                        if (m > 0)
                          for (; y--; ) b[y] || x[y] || (x[y] = N.call(l));
                        x = xt(x);
                      }
                      j.apply(l, x),
                        c &&
                          !o &&
                          x.length > 0 &&
                          m + e.length > 1 &&
                          ot.uniqueSort(l);
                    }
                    return c && ((C = E), (u = w)), b;
                  };
                return n ? st(o) : o;
              })(o, i)
            )).selector = t;
          }
          return s;
        }),
        (l = ot.select = function(t, e, n, i) {
          var o,
            l,
            u,
            c,
            f,
            h = "function" == typeof t && t,
            d = !i && a((t = h.selector || t));
          if (((n = n || []), 1 === d.length)) {
            if (
              (l = d[0] = d[0].slice(0)).length > 2 &&
              "ID" === (u = l[0]).type &&
              9 === e.nodeType &&
              g &&
              r.relative[l[1].type]
            ) {
              if (!(e = (r.find.ID(u.matches[0].replace(K, tt), e) || [])[0]))
                return n;
              h && (e = e.parentNode), (t = t.slice(l.shift().value.length));
            }
            for (
              o = G.needsContext.test(t) ? 0 : l.length;
              o-- && ((u = l[o]), !r.relative[(c = u.type)]);

            )
              if (
                (f = r.find[c]) &&
                (i = f(
                  u.matches[0].replace(K, tt),
                  (Z.test(l[0].type) && gt(e.parentNode)) || e
                ))
              ) {
                if ((l.splice(o, 1), !(t = i.length && mt(l))))
                  return j.apply(n, i), n;
                break;
              }
          }
          return (
            (h || s(t, d))(
              i,
              e,
              !g,
              n,
              !e || (Z.test(t) && gt(e.parentNode)) || e
            ),
            n
          );
        }),
        (n.sortStable =
          x
            .split("")
            .sort(A)
            .join("") === x),
        (n.detectDuplicates = !!f),
        h(),
        (n.sortDetached = lt(function(t) {
          return 1 & t.compareDocumentPosition(d.createElement("fieldset"));
        })),
        lt(function(t) {
          return (
            (t.innerHTML = "<a href='#'></a>"),
            "#" === t.firstChild.getAttribute("href")
          );
        }) ||
          ut("type|href|height|width", function(t, e, n) {
            if (!n)
              return t.getAttribute(e, "type" === e.toLowerCase() ? 1 : 2);
          }),
        (n.attributes &&
          lt(function(t) {
            return (
              (t.innerHTML = "<input/>"),
              t.firstChild.setAttribute("value", ""),
              "" === t.firstChild.getAttribute("value")
            );
          })) ||
          ut("value", function(t, e, n) {
            if (!n && "input" === t.nodeName.toLowerCase())
              return t.defaultValue;
          }),
        lt(function(t) {
          return null == t.getAttribute("disabled");
        }) ||
          ut(L, function(t, e, n) {
            var r;
            if (!n)
              return !0 === t[e]
                ? e.toLowerCase()
                : (r = t.getAttributeNode(e)) && r.specified
                  ? r.value
                  : null;
          }),
        ot
      );
    })(t);
    (x.find = T),
      (x.expr = T.selectors),
      (x.expr[":"] = x.expr.pseudos),
      (x.uniqueSort = x.unique = T.uniqueSort),
      (x.text = T.getText),
      (x.isXMLDoc = T.isXML),
      (x.contains = T.contains),
      (x.escapeSelector = T.escape);
    var E = function(t, e, n) {
        for (var r = [], i = void 0 !== n; (t = t[e]) && 9 !== t.nodeType; )
          if (1 === t.nodeType) {
            if (i && x(t).is(n)) break;
            r.push(t);
          }
        return r;
      },
      S = function(t, e) {
        for (var n = []; t; t = t.nextSibling)
          1 === t.nodeType && t !== e && n.push(t);
        return n;
      },
      k = x.expr.match.needsContext;
    function A(t, e) {
      return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase();
    }
    var F = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    function D(t, e, n) {
      return g(e)
        ? x.grep(t, function(t, r) {
            return !!e.call(t, r, t) !== n;
          })
        : e.nodeType
          ? x.grep(t, function(t) {
              return (t === e) !== n;
            })
          : "string" != typeof e
            ? x.grep(t, function(t) {
                return l.call(e, t) > -1 !== n;
              })
            : x.filter(e, t, n);
    }
    (x.filter = function(t, e, n) {
      var r = e[0];
      return (
        n && (t = ":not(" + t + ")"),
        1 === e.length && 1 === r.nodeType
          ? x.find.matchesSelector(r, t)
            ? [r]
            : []
          : x.find.matches(
              t,
              x.grep(e, function(t) {
                return 1 === t.nodeType;
              })
            )
      );
    }),
      x.fn.extend({
        find: function(t) {
          var e,
            n,
            r = this.length,
            i = this;
          if ("string" != typeof t)
            return this.pushStack(
              x(t).filter(function() {
                for (e = 0; e < r; e++) if (x.contains(i[e], this)) return !0;
              })
            );
          for (n = this.pushStack([]), e = 0; e < r; e++) x.find(t, i[e], n);
          return r > 1 ? x.uniqueSort(n) : n;
        },
        filter: function(t) {
          return this.pushStack(D(this, t || [], !1));
        },
        not: function(t) {
          return this.pushStack(D(this, t || [], !0));
        },
        is: function(t) {
          return !!D(
            this,
            "string" == typeof t && k.test(t) ? x(t) : t || [],
            !1
          ).length;
        }
      });
    var N,
      $ = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    ((x.fn.init = function(t, e, n) {
      var i, o;
      if (!t) return this;
      if (((n = n || N), "string" == typeof t)) {
        if (
          !(i =
            "<" === t[0] && ">" === t[t.length - 1] && t.length >= 3
              ? [null, t, null]
              : $.exec(t)) ||
          (!i[1] && e)
        )
          return !e || e.jquery
            ? (e || n).find(t)
            : this.constructor(e).find(t);
        if (i[1]) {
          if (
            ((e = e instanceof x ? e[0] : e),
            x.merge(
              this,
              x.parseHTML(i[1], e && e.nodeType ? e.ownerDocument || e : r, !0)
            ),
            F.test(i[1]) && x.isPlainObject(e))
          )
            for (i in e) g(this[i]) ? this[i](e[i]) : this.attr(i, e[i]);
          return this;
        }
        return (
          (o = r.getElementById(i[2])) && ((this[0] = o), (this.length = 1)),
          this
        );
      }
      return t.nodeType
        ? ((this[0] = t), (this.length = 1), this)
        : g(t)
          ? void 0 !== n.ready
            ? n.ready(t)
            : t(x)
          : x.makeArray(t, this);
    }).prototype = x.fn),
      (N = x(r));
    var j = /^(?:parents|prev(?:Until|All))/,
      B = { children: !0, contents: !0, next: !0, prev: !0 };
    function O(t, e) {
      for (; (t = t[e]) && 1 !== t.nodeType; );
      return t;
    }
    x.fn.extend({
      has: function(t) {
        var e = x(t, this),
          n = e.length;
        return this.filter(function() {
          for (var t = 0; t < n; t++) if (x.contains(this, e[t])) return !0;
        });
      },
      closest: function(t, e) {
        var n,
          r = 0,
          i = this.length,
          o = [],
          a = "string" != typeof t && x(t);
        if (!k.test(t))
          for (; r < i; r++)
            for (n = this[r]; n && n !== e; n = n.parentNode)
              if (
                n.nodeType < 11 &&
                (a
                  ? a.index(n) > -1
                  : 1 === n.nodeType && x.find.matchesSelector(n, t))
              ) {
                o.push(n);
                break;
              }
        return this.pushStack(o.length > 1 ? x.uniqueSort(o) : o);
      },
      index: function(t) {
        return t
          ? "string" == typeof t
            ? l.call(x(t), this[0])
            : l.call(this, t.jquery ? t[0] : t)
          : this[0] && this[0].parentNode
            ? this.first().prevAll().length
            : -1;
      },
      add: function(t, e) {
        return this.pushStack(x.uniqueSort(x.merge(this.get(), x(t, e))));
      },
      addBack: function(t) {
        return this.add(
          null == t ? this.prevObject : this.prevObject.filter(t)
        );
      }
    }),
      x.each(
        {
          parent: function(t) {
            var e = t.parentNode;
            return e && 11 !== e.nodeType ? e : null;
          },
          parents: function(t) {
            return E(t, "parentNode");
          },
          parentsUntil: function(t, e, n) {
            return E(t, "parentNode", n);
          },
          next: function(t) {
            return O(t, "nextSibling");
          },
          prev: function(t) {
            return O(t, "previousSibling");
          },
          nextAll: function(t) {
            return E(t, "nextSibling");
          },
          prevAll: function(t) {
            return E(t, "previousSibling");
          },
          nextUntil: function(t, e, n) {
            return E(t, "nextSibling", n);
          },
          prevUntil: function(t, e, n) {
            return E(t, "previousSibling", n);
          },
          siblings: function(t) {
            return S((t.parentNode || {}).firstChild, t);
          },
          children: function(t) {
            return S(t.firstChild);
          },
          contents: function(t) {
            return A(t, "iframe")
              ? t.contentDocument
              : (A(t, "template") && (t = t.content || t),
                x.merge([], t.childNodes));
          }
        },
        function(t, e) {
          x.fn[t] = function(n, r) {
            var i = x.map(this, e, n);
            return (
              "Until" !== t.slice(-5) && (r = n),
              r && "string" == typeof r && (i = x.filter(r, i)),
              this.length > 1 &&
                (B[t] || x.uniqueSort(i), j.test(t) && i.reverse()),
              this.pushStack(i)
            );
          };
        }
      );
    var L = /[^\x20\t\r\n\f]+/g;
    function I(t) {
      return t;
    }
    function M(t) {
      throw t;
    }
    function R(t, e, n, r) {
      var i;
      try {
        t && g((i = t.promise))
          ? i
              .call(t)
              .done(e)
              .fail(n)
          : t && g((i = t.then))
            ? i.call(t, e, n)
            : e.apply(void 0, [t].slice(r));
      } catch (t) {
        n.apply(void 0, [t]);
      }
    }
    (x.Callbacks = function(t) {
      t =
        "string" == typeof t
          ? (function(t) {
              var e = {};
              return (
                x.each(t.match(L) || [], function(t, n) {
                  e[n] = !0;
                }),
                e
              );
            })(t)
          : x.extend({}, t);
      var e,
        n,
        r,
        i,
        o = [],
        a = [],
        s = -1,
        l = function() {
          for (i = i || t.once, r = e = !0; a.length; s = -1)
            for (n = a.shift(); ++s < o.length; )
              !1 === o[s].apply(n[0], n[1]) &&
                t.stopOnFalse &&
                ((s = o.length), (n = !1));
          t.memory || (n = !1), (e = !1), i && (o = n ? [] : "");
        },
        u = {
          add: function() {
            return (
              o &&
                (n && !e && ((s = o.length - 1), a.push(n)),
                (function e(n) {
                  x.each(n, function(n, r) {
                    g(r)
                      ? (t.unique && u.has(r)) || o.push(r)
                      : r && r.length && "string" !== b(r) && e(r);
                  });
                })(arguments),
                n && !e && l()),
              this
            );
          },
          remove: function() {
            return (
              x.each(arguments, function(t, e) {
                for (var n; (n = x.inArray(e, o, n)) > -1; )
                  o.splice(n, 1), n <= s && s--;
              }),
              this
            );
          },
          has: function(t) {
            return t ? x.inArray(t, o) > -1 : o.length > 0;
          },
          empty: function() {
            return o && (o = []), this;
          },
          disable: function() {
            return (i = a = []), (o = n = ""), this;
          },
          disabled: function() {
            return !o;
          },
          lock: function() {
            return (i = a = []), n || e || (o = n = ""), this;
          },
          locked: function() {
            return !!i;
          },
          fireWith: function(t, n) {
            return (
              i ||
                ((n = [t, (n = n || []).slice ? n.slice() : n]),
                a.push(n),
                e || l()),
              this
            );
          },
          fire: function() {
            return u.fireWith(this, arguments), this;
          },
          fired: function() {
            return !!r;
          }
        };
      return u;
    }),
      x.extend({
        Deferred: function(e) {
          var n = [
              [
                "notify",
                "progress",
                x.Callbacks("memory"),
                x.Callbacks("memory"),
                2
              ],
              [
                "resolve",
                "done",
                x.Callbacks("once memory"),
                x.Callbacks("once memory"),
                0,
                "resolved"
              ],
              [
                "reject",
                "fail",
                x.Callbacks("once memory"),
                x.Callbacks("once memory"),
                1,
                "rejected"
              ]
            ],
            r = "pending",
            i = {
              state: function() {
                return r;
              },
              always: function() {
                return o.done(arguments).fail(arguments), this;
              },
              catch: function(t) {
                return i.then(null, t);
              },
              pipe: function() {
                var t = arguments;
                return x
                  .Deferred(function(e) {
                    x.each(n, function(n, r) {
                      var i = g(t[r[4]]) && t[r[4]];
                      o[r[1]](function() {
                        var t = i && i.apply(this, arguments);
                        t && g(t.promise)
                          ? t
                              .promise()
                              .progress(e.notify)
                              .done(e.resolve)
                              .fail(e.reject)
                          : e[r[0] + "With"](this, i ? [t] : arguments);
                      });
                    }),
                      (t = null);
                  })
                  .promise();
              },
              then: function(e, r, i) {
                var o = 0;
                function a(e, n, r, i) {
                  return function() {
                    var s = this,
                      l = arguments,
                      u = function() {
                        var t, u;
                        if (!(e < o)) {
                          if ((t = r.apply(s, l)) === n.promise())
                            throw new TypeError("Thenable self-resolution");
                          (u =
                            t &&
                            ("object" == typeof t || "function" == typeof t) &&
                            t.then),
                            g(u)
                              ? i
                                ? u.call(t, a(o, n, I, i), a(o, n, M, i))
                                : (o++,
                                  u.call(
                                    t,
                                    a(o, n, I, i),
                                    a(o, n, M, i),
                                    a(o, n, I, n.notifyWith)
                                  ))
                              : (r !== I && ((s = void 0), (l = [t])),
                                (i || n.resolveWith)(s, l));
                        }
                      },
                      c = i
                        ? u
                        : function() {
                            try {
                              u();
                            } catch (t) {
                              x.Deferred.exceptionHook &&
                                x.Deferred.exceptionHook(t, c.stackTrace),
                                e + 1 >= o &&
                                  (r !== M && ((s = void 0), (l = [t])),
                                  n.rejectWith(s, l));
                            }
                          };
                    e
                      ? c()
                      : (x.Deferred.getStackHook &&
                          (c.stackTrace = x.Deferred.getStackHook()),
                        t.setTimeout(c));
                  };
                }
                return x
                  .Deferred(function(t) {
                    n[0][3].add(a(0, t, g(i) ? i : I, t.notifyWith)),
                      n[1][3].add(a(0, t, g(e) ? e : I)),
                      n[2][3].add(a(0, t, g(r) ? r : M));
                  })
                  .promise();
              },
              promise: function(t) {
                return null != t ? x.extend(t, i) : i;
              }
            },
            o = {};
          return (
            x.each(n, function(t, e) {
              var a = e[2],
                s = e[5];
              (i[e[1]] = a.add),
                s &&
                  a.add(
                    function() {
                      r = s;
                    },
                    n[3 - t][2].disable,
                    n[3 - t][3].disable,
                    n[0][2].lock,
                    n[0][3].lock
                  ),
                a.add(e[3].fire),
                (o[e[0]] = function() {
                  return (
                    o[e[0] + "With"](this === o ? void 0 : this, arguments),
                    this
                  );
                }),
                (o[e[0] + "With"] = a.fireWith);
            }),
            i.promise(o),
            e && e.call(o, o),
            o
          );
        },
        when: function(t) {
          var e = arguments.length,
            n = e,
            r = Array(n),
            i = o.call(arguments),
            a = x.Deferred(),
            s = function(t) {
              return function(n) {
                (r[t] = this),
                  (i[t] = arguments.length > 1 ? o.call(arguments) : n),
                  --e || a.resolveWith(r, i);
              };
            };
          if (
            e <= 1 &&
            (R(t, a.done(s(n)).resolve, a.reject, !e),
            "pending" === a.state() || g(i[n] && i[n].then))
          )
            return a.then();
          for (; n--; ) R(i[n], s(n), a.reject);
          return a.promise();
        }
      });
    var P = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    (x.Deferred.exceptionHook = function(e, n) {
      t.console &&
        t.console.warn &&
        e &&
        P.test(e.name) &&
        t.console.warn("jQuery.Deferred exception: " + e.message, e.stack, n);
    }),
      (x.readyException = function(e) {
        t.setTimeout(function() {
          throw e;
        });
      });
    var q = x.Deferred();
    function _() {
      r.removeEventListener("DOMContentLoaded", _),
        t.removeEventListener("load", _),
        x.ready();
    }
    (x.fn.ready = function(t) {
      return (
        q.then(t).catch(function(t) {
          x.readyException(t);
        }),
        this
      );
    }),
      x.extend({
        isReady: !1,
        readyWait: 1,
        ready: function(t) {
          (!0 === t ? --x.readyWait : x.isReady) ||
            ((x.isReady = !0),
            (!0 !== t && --x.readyWait > 0) || q.resolveWith(r, [x]));
        }
      }),
      (x.ready.then = q.then),
      "complete" === r.readyState ||
      ("loading" !== r.readyState && !r.documentElement.doScroll)
        ? t.setTimeout(x.ready)
        : (r.addEventListener("DOMContentLoaded", _),
          t.addEventListener("load", _));
    var H = function(t, e, n, r, i, o, a) {
        var s = 0,
          l = t.length,
          u = null == n;
        if ("object" === b(n))
          for (s in ((i = !0), n)) H(t, e, s, n[s], !0, o, a);
        else if (
          void 0 !== r &&
          ((i = !0),
          g(r) || (a = !0),
          u &&
            (a
              ? (e.call(t, r), (e = null))
              : ((u = e),
                (e = function(t, e, n) {
                  return u.call(x(t), n);
                }))),
          e)
        )
          for (; s < l; s++) e(t[s], n, a ? r : r.call(t[s], s, e(t[s], n)));
        return i ? t : u ? e.call(t) : l ? e(t[0], n) : o;
      },
      U = /^-ms-/,
      W = /-([a-z])/g;
    function V(t, e) {
      return e.toUpperCase();
    }
    function z(t) {
      return t.replace(U, "ms-").replace(W, V);
    }
    var G = function(t) {
      return 1 === t.nodeType || 9 === t.nodeType || !+t.nodeType;
    };
    function X() {
      this.expando = x.expando + X.uid++;
    }
    (X.uid = 1),
      (X.prototype = {
        cache: function(t) {
          var e = t[this.expando];
          return (
            e ||
              ((e = {}),
              G(t) &&
                (t.nodeType
                  ? (t[this.expando] = e)
                  : Object.defineProperty(t, this.expando, {
                      value: e,
                      configurable: !0
                    }))),
            e
          );
        },
        set: function(t, e, n) {
          var r,
            i = this.cache(t);
          if ("string" == typeof e) i[z(e)] = n;
          else for (r in e) i[z(r)] = e[r];
          return i;
        },
        get: function(t, e) {
          return void 0 === e
            ? this.cache(t)
            : t[this.expando] && t[this.expando][z(e)];
        },
        access: function(t, e, n) {
          return void 0 === e || (e && "string" == typeof e && void 0 === n)
            ? this.get(t, e)
            : (this.set(t, e, n), void 0 !== n ? n : e);
        },
        remove: function(t, e) {
          var n,
            r = t[this.expando];
          if (void 0 !== r) {
            if (void 0 !== e) {
              n = (e = Array.isArray(e)
                ? e.map(z)
                : (e = z(e)) in r
                  ? [e]
                  : e.match(L) || []).length;
              for (; n--; ) delete r[e[n]];
            }
            (void 0 === e || x.isEmptyObject(r)) &&
              (t.nodeType
                ? (t[this.expando] = void 0)
                : delete t[this.expando]);
          }
        },
        hasData: function(t) {
          var e = t[this.expando];
          return void 0 !== e && !x.isEmptyObject(e);
        }
      });
    var Y = new X(),
      Q = new X(),
      J = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
      Z = /[A-Z]/g;
    function K(t, e, n) {
      var r;
      if (void 0 === n && 1 === t.nodeType)
        if (
          ((r = "data-" + e.replace(Z, "-$&").toLowerCase()),
          "string" == typeof (n = t.getAttribute(r)))
        ) {
          try {
            n = (function(t) {
              return (
                "true" === t ||
                ("false" !== t &&
                  ("null" === t
                    ? null
                    : t === +t + ""
                      ? +t
                      : J.test(t)
                        ? JSON.parse(t)
                        : t))
              );
            })(n);
          } catch (t) {}
          Q.set(t, e, n);
        } else n = void 0;
      return n;
    }
    x.extend({
      hasData: function(t) {
        return Q.hasData(t) || Y.hasData(t);
      },
      data: function(t, e, n) {
        return Q.access(t, e, n);
      },
      removeData: function(t, e) {
        Q.remove(t, e);
      },
      _data: function(t, e, n) {
        return Y.access(t, e, n);
      },
      _removeData: function(t, e) {
        Y.remove(t, e);
      }
    }),
      x.fn.extend({
        data: function(t, e) {
          var n,
            r,
            i,
            o = this[0],
            a = o && o.attributes;
          if (void 0 === t) {
            if (
              this.length &&
              ((i = Q.get(o)), 1 === o.nodeType && !Y.get(o, "hasDataAttrs"))
            ) {
              for (n = a.length; n--; )
                a[n] &&
                  0 === (r = a[n].name).indexOf("data-") &&
                  ((r = z(r.slice(5))), K(o, r, i[r]));
              Y.set(o, "hasDataAttrs", !0);
            }
            return i;
          }
          return "object" == typeof t
            ? this.each(function() {
                Q.set(this, t);
              })
            : H(
                this,
                function(e) {
                  var n;
                  if (o && void 0 === e)
                    return void 0 !== (n = Q.get(o, t))
                      ? n
                      : void 0 !== (n = K(o, t))
                        ? n
                        : void 0;
                  this.each(function() {
                    Q.set(this, t, e);
                  });
                },
                null,
                e,
                arguments.length > 1,
                null,
                !0
              );
        },
        removeData: function(t) {
          return this.each(function() {
            Q.remove(this, t);
          });
        }
      }),
      x.extend({
        queue: function(t, e, n) {
          var r;
          if (t)
            return (
              (e = (e || "fx") + "queue"),
              (r = Y.get(t, e)),
              n &&
                (!r || Array.isArray(n)
                  ? (r = Y.access(t, e, x.makeArray(n)))
                  : r.push(n)),
              r || []
            );
        },
        dequeue: function(t, e) {
          e = e || "fx";
          var n = x.queue(t, e),
            r = n.length,
            i = n.shift(),
            o = x._queueHooks(t, e);
          "inprogress" === i && ((i = n.shift()), r--),
            i &&
              ("fx" === e && n.unshift("inprogress"),
              delete o.stop,
              i.call(
                t,
                function() {
                  x.dequeue(t, e);
                },
                o
              )),
            !r && o && o.empty.fire();
        },
        _queueHooks: function(t, e) {
          var n = e + "queueHooks";
          return (
            Y.get(t, n) ||
            Y.access(t, n, {
              empty: x.Callbacks("once memory").add(function() {
                Y.remove(t, [e + "queue", n]);
              })
            })
          );
        }
      }),
      x.fn.extend({
        queue: function(t, e) {
          var n = 2;
          return (
            "string" != typeof t && ((e = t), (t = "fx"), n--),
            arguments.length < n
              ? x.queue(this[0], t)
              : void 0 === e
                ? this
                : this.each(function() {
                    var n = x.queue(this, t, e);
                    x._queueHooks(this, t),
                      "fx" === t && "inprogress" !== n[0] && x.dequeue(this, t);
                  })
          );
        },
        dequeue: function(t) {
          return this.each(function() {
            x.dequeue(this, t);
          });
        },
        clearQueue: function(t) {
          return this.queue(t || "fx", []);
        },
        promise: function(t, e) {
          var n,
            r = 1,
            i = x.Deferred(),
            o = this,
            a = this.length,
            s = function() {
              --r || i.resolveWith(o, [o]);
            };
          for (
            "string" != typeof t && ((e = t), (t = void 0)), t = t || "fx";
            a--;

          )
            (n = Y.get(o[a], t + "queueHooks")) &&
              n.empty &&
              (r++, n.empty.add(s));
          return s(), i.promise(e);
        }
      });
    var tt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
      et = new RegExp("^(?:([+-])=|)(" + tt + ")([a-z%]*)$", "i"),
      nt = ["Top", "Right", "Bottom", "Left"],
      rt = function(t, e) {
        return (
          "none" === (t = e || t).style.display ||
          ("" === t.style.display &&
            x.contains(t.ownerDocument, t) &&
            "none" === x.css(t, "display"))
        );
      },
      it = function(t, e, n, r) {
        var i,
          o,
          a = {};
        for (o in e) (a[o] = t.style[o]), (t.style[o] = e[o]);
        for (o in ((i = n.apply(t, r || [])), e)) t.style[o] = a[o];
        return i;
      };
    function ot(t, e, n, r) {
      var i,
        o,
        a = 20,
        s = r
          ? function() {
              return r.cur();
            }
          : function() {
              return x.css(t, e, "");
            },
        l = s(),
        u = (n && n[3]) || (x.cssNumber[e] ? "" : "px"),
        c = (x.cssNumber[e] || ("px" !== u && +l)) && et.exec(x.css(t, e));
      if (c && c[3] !== u) {
        for (l /= 2, u = u || c[3], c = +l || 1; a--; )
          x.style(t, e, c + u),
            (1 - o) * (1 - (o = s() / l || 0.5)) <= 0 && (a = 0),
            (c /= o);
        (c *= 2), x.style(t, e, c + u), (n = n || []);
      }
      return (
        n &&
          ((c = +c || +l || 0),
          (i = n[1] ? c + (n[1] + 1) * n[2] : +n[2]),
          r && ((r.unit = u), (r.start = c), (r.end = i))),
        i
      );
    }
    var at = {};
    function st(t) {
      var e,
        n = t.ownerDocument,
        r = t.nodeName,
        i = at[r];
      return (
        i ||
        ((e = n.body.appendChild(n.createElement(r))),
        (i = x.css(e, "display")),
        e.parentNode.removeChild(e),
        "none" === i && (i = "block"),
        (at[r] = i),
        i)
      );
    }
    function lt(t, e) {
      for (var n, r, i = [], o = 0, a = t.length; o < a; o++)
        (r = t[o]).style &&
          ((n = r.style.display),
          e
            ? ("none" === n &&
                ((i[o] = Y.get(r, "display") || null),
                i[o] || (r.style.display = "")),
              "" === r.style.display && rt(r) && (i[o] = st(r)))
            : "none" !== n && ((i[o] = "none"), Y.set(r, "display", n)));
      for (o = 0; o < a; o++) null != i[o] && (t[o].style.display = i[o]);
      return t;
    }
    x.fn.extend({
      show: function() {
        return lt(this, !0);
      },
      hide: function() {
        return lt(this);
      },
      toggle: function(t) {
        return "boolean" == typeof t
          ? t
            ? this.show()
            : this.hide()
          : this.each(function() {
              rt(this) ? x(this).show() : x(this).hide();
            });
      }
    });
    var ut = /^(?:checkbox|radio)$/i,
      ct = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
      ft = /^$|^module$|\/(?:java|ecma)script/i,
      ht = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
      };
    function dt(t, e) {
      var n;
      return (
        (n =
          void 0 !== t.getElementsByTagName
            ? t.getElementsByTagName(e || "*")
            : void 0 !== t.querySelectorAll
              ? t.querySelectorAll(e || "*")
              : []),
        void 0 === e || (e && A(t, e)) ? x.merge([t], n) : n
      );
    }
    function pt(t, e) {
      for (var n = 0, r = t.length; n < r; n++)
        Y.set(t[n], "globalEval", !e || Y.get(e[n], "globalEval"));
    }
    (ht.optgroup = ht.option),
      (ht.tbody = ht.tfoot = ht.colgroup = ht.caption = ht.thead),
      (ht.th = ht.td);
    var gt,
      vt,
      mt = /<|&#?\w+;/;
    function yt(t, e, n, r, i) {
      for (
        var o,
          a,
          s,
          l,
          u,
          c,
          f = e.createDocumentFragment(),
          h = [],
          d = 0,
          p = t.length;
        d < p;
        d++
      )
        if ((o = t[d]) || 0 === o)
          if ("object" === b(o)) x.merge(h, o.nodeType ? [o] : o);
          else if (mt.test(o)) {
            for (
              a = a || f.appendChild(e.createElement("div")),
                s = (ct.exec(o) || ["", ""])[1].toLowerCase(),
                l = ht[s] || ht._default,
                a.innerHTML = l[1] + x.htmlPrefilter(o) + l[2],
                c = l[0];
              c--;

            )
              a = a.lastChild;
            x.merge(h, a.childNodes), ((a = f.firstChild).textContent = "");
          } else h.push(e.createTextNode(o));
      for (f.textContent = "", d = 0; (o = h[d++]); )
        if (r && x.inArray(o, r) > -1) i && i.push(o);
        else if (
          ((u = x.contains(o.ownerDocument, o)),
          (a = dt(f.appendChild(o), "script")),
          u && pt(a),
          n)
        )
          for (c = 0; (o = a[c++]); ) ft.test(o.type || "") && n.push(o);
      return f;
    }
    (gt = r.createDocumentFragment().appendChild(r.createElement("div"))),
      (vt = r.createElement("input")).setAttribute("type", "radio"),
      vt.setAttribute("checked", "checked"),
      vt.setAttribute("name", "t"),
      gt.appendChild(vt),
      (p.checkClone = gt.cloneNode(!0).cloneNode(!0).lastChild.checked),
      (gt.innerHTML = "<textarea>x</textarea>"),
      (p.noCloneChecked = !!gt.cloneNode(!0).lastChild.defaultValue);
    var bt = r.documentElement,
      xt = /^key/,
      wt = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
      Ct = /^([^.]*)(?:\.(.+)|)/;
    function Tt() {
      return !0;
    }
    function Et() {
      return !1;
    }
    function St() {
      try {
        return r.activeElement;
      } catch (t) {}
    }
    function kt(t, e, n, r, i, o) {
      var a, s;
      if ("object" == typeof e) {
        for (s in ("string" != typeof n && ((r = r || n), (n = void 0)), e))
          kt(t, s, n, r, e[s], o);
        return t;
      }
      if (
        (null == r && null == i
          ? ((i = n), (r = n = void 0))
          : null == i &&
            ("string" == typeof n
              ? ((i = r), (r = void 0))
              : ((i = r), (r = n), (n = void 0))),
        !1 === i)
      )
        i = Et;
      else if (!i) return t;
      return (
        1 === o &&
          ((a = i),
          ((i = function(t) {
            return x().off(t), a.apply(this, arguments);
          }).guid = a.guid || (a.guid = x.guid++))),
        t.each(function() {
          x.event.add(this, e, i, r, n);
        })
      );
    }
    (x.event = {
      global: {},
      add: function(t, e, n, r, i) {
        var o,
          a,
          s,
          l,
          u,
          c,
          f,
          h,
          d,
          p,
          g,
          v = Y.get(t);
        if (v)
          for (
            n.handler && ((n = (o = n).handler), (i = o.selector)),
              i && x.find.matchesSelector(bt, i),
              n.guid || (n.guid = x.guid++),
              (l = v.events) || (l = v.events = {}),
              (a = v.handle) ||
                (a = v.handle = function(e) {
                  return void 0 !== x && x.event.triggered !== e.type
                    ? x.event.dispatch.apply(t, arguments)
                    : void 0;
                }),
              u = (e = (e || "").match(L) || [""]).length;
            u--;

          )
            (d = g = (s = Ct.exec(e[u]) || [])[1]),
              (p = (s[2] || "").split(".").sort()),
              d &&
                ((f = x.event.special[d] || {}),
                (d = (i ? f.delegateType : f.bindType) || d),
                (f = x.event.special[d] || {}),
                (c = x.extend(
                  {
                    type: d,
                    origType: g,
                    data: r,
                    handler: n,
                    guid: n.guid,
                    selector: i,
                    needsContext: i && x.expr.match.needsContext.test(i),
                    namespace: p.join(".")
                  },
                  o
                )),
                (h = l[d]) ||
                  (((h = l[d] = []).delegateCount = 0),
                  (f.setup && !1 !== f.setup.call(t, r, p, a)) ||
                    (t.addEventListener && t.addEventListener(d, a))),
                f.add &&
                  (f.add.call(t, c),
                  c.handler.guid || (c.handler.guid = n.guid)),
                i ? h.splice(h.delegateCount++, 0, c) : h.push(c),
                (x.event.global[d] = !0));
      },
      remove: function(t, e, n, r, i) {
        var o,
          a,
          s,
          l,
          u,
          c,
          f,
          h,
          d,
          p,
          g,
          v = Y.hasData(t) && Y.get(t);
        if (v && (l = v.events)) {
          for (u = (e = (e || "").match(L) || [""]).length; u--; )
            if (
              ((d = g = (s = Ct.exec(e[u]) || [])[1]),
              (p = (s[2] || "").split(".").sort()),
              d)
            ) {
              for (
                f = x.event.special[d] || {},
                  h = l[(d = (r ? f.delegateType : f.bindType) || d)] || [],
                  s =
                    s[2] &&
                    new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                  a = o = h.length;
                o--;

              )
                (c = h[o]),
                  (!i && g !== c.origType) ||
                    (n && n.guid !== c.guid) ||
                    (s && !s.test(c.namespace)) ||
                    (r && r !== c.selector && ("**" !== r || !c.selector)) ||
                    (h.splice(o, 1),
                    c.selector && h.delegateCount--,
                    f.remove && f.remove.call(t, c));
              a &&
                !h.length &&
                ((f.teardown && !1 !== f.teardown.call(t, p, v.handle)) ||
                  x.removeEvent(t, d, v.handle),
                delete l[d]);
            } else for (d in l) x.event.remove(t, d + e[u], n, r, !0);
          x.isEmptyObject(l) && Y.remove(t, "handle events");
        }
      },
      dispatch: function(t) {
        var e,
          n,
          r,
          i,
          o,
          a,
          s = x.event.fix(t),
          l = new Array(arguments.length),
          u = (Y.get(this, "events") || {})[s.type] || [],
          c = x.event.special[s.type] || {};
        for (l[0] = s, e = 1; e < arguments.length; e++) l[e] = arguments[e];
        if (
          ((s.delegateTarget = this),
          !c.preDispatch || !1 !== c.preDispatch.call(this, s))
        ) {
          for (
            a = x.event.handlers.call(this, s, u), e = 0;
            (i = a[e++]) && !s.isPropagationStopped();

          )
            for (
              s.currentTarget = i.elem, n = 0;
              (o = i.handlers[n++]) && !s.isImmediatePropagationStopped();

            )
              (s.rnamespace && !s.rnamespace.test(o.namespace)) ||
                ((s.handleObj = o),
                (s.data = o.data),
                void 0 !==
                  (r = (
                    (x.event.special[o.origType] || {}).handle || o.handler
                  ).apply(i.elem, l)) &&
                  !1 === (s.result = r) &&
                  (s.preventDefault(), s.stopPropagation()));
          return c.postDispatch && c.postDispatch.call(this, s), s.result;
        }
      },
      handlers: function(t, e) {
        var n,
          r,
          i,
          o,
          a,
          s = [],
          l = e.delegateCount,
          u = t.target;
        if (l && u.nodeType && !("click" === t.type && t.button >= 1))
          for (; u !== this; u = u.parentNode || this)
            if (1 === u.nodeType && ("click" !== t.type || !0 !== u.disabled)) {
              for (o = [], a = {}, n = 0; n < l; n++)
                void 0 === a[(i = (r = e[n]).selector + " ")] &&
                  (a[i] = r.needsContext
                    ? x(i, this).index(u) > -1
                    : x.find(i, this, null, [u]).length),
                  a[i] && o.push(r);
              o.length && s.push({ elem: u, handlers: o });
            }
        return (
          (u = this),
          l < e.length && s.push({ elem: u, handlers: e.slice(l) }),
          s
        );
      },
      addProp: function(t, e) {
        Object.defineProperty(x.Event.prototype, t, {
          enumerable: !0,
          configurable: !0,
          get: g(e)
            ? function() {
                if (this.originalEvent) return e(this.originalEvent);
              }
            : function() {
                if (this.originalEvent) return this.originalEvent[t];
              },
          set: function(e) {
            Object.defineProperty(this, t, {
              enumerable: !0,
              configurable: !0,
              writable: !0,
              value: e
            });
          }
        });
      },
      fix: function(t) {
        return t[x.expando] ? t : new x.Event(t);
      },
      special: {
        load: { noBubble: !0 },
        focus: {
          trigger: function() {
            if (this !== St() && this.focus) return this.focus(), !1;
          },
          delegateType: "focusin"
        },
        blur: {
          trigger: function() {
            if (this === St() && this.blur) return this.blur(), !1;
          },
          delegateType: "focusout"
        },
        click: {
          trigger: function() {
            if ("checkbox" === this.type && this.click && A(this, "input"))
              return this.click(), !1;
          },
          _default: function(t) {
            return A(t.target, "a");
          }
        },
        beforeunload: {
          postDispatch: function(t) {
            void 0 !== t.result &&
              t.originalEvent &&
              (t.originalEvent.returnValue = t.result);
          }
        }
      }
    }),
      (x.removeEvent = function(t, e, n) {
        t.removeEventListener && t.removeEventListener(e, n);
      }),
      (x.Event = function(t, e) {
        if (!(this instanceof x.Event)) return new x.Event(t, e);
        t && t.type
          ? ((this.originalEvent = t),
            (this.type = t.type),
            (this.isDefaultPrevented =
              t.defaultPrevented ||
              (void 0 === t.defaultPrevented && !1 === t.returnValue)
                ? Tt
                : Et),
            (this.target =
              t.target && 3 === t.target.nodeType
                ? t.target.parentNode
                : t.target),
            (this.currentTarget = t.currentTarget),
            (this.relatedTarget = t.relatedTarget))
          : (this.type = t),
          e && x.extend(this, e),
          (this.timeStamp = (t && t.timeStamp) || Date.now()),
          (this[x.expando] = !0);
      }),
      (x.Event.prototype = {
        constructor: x.Event,
        isDefaultPrevented: Et,
        isPropagationStopped: Et,
        isImmediatePropagationStopped: Et,
        isSimulated: !1,
        preventDefault: function() {
          var t = this.originalEvent;
          (this.isDefaultPrevented = Tt),
            t && !this.isSimulated && t.preventDefault();
        },
        stopPropagation: function() {
          var t = this.originalEvent;
          (this.isPropagationStopped = Tt),
            t && !this.isSimulated && t.stopPropagation();
        },
        stopImmediatePropagation: function() {
          var t = this.originalEvent;
          (this.isImmediatePropagationStopped = Tt),
            t && !this.isSimulated && t.stopImmediatePropagation(),
            this.stopPropagation();
        }
      }),
      x.each(
        {
          altKey: !0,
          bubbles: !0,
          cancelable: !0,
          changedTouches: !0,
          ctrlKey: !0,
          detail: !0,
          eventPhase: !0,
          metaKey: !0,
          pageX: !0,
          pageY: !0,
          shiftKey: !0,
          view: !0,
          char: !0,
          charCode: !0,
          key: !0,
          keyCode: !0,
          button: !0,
          buttons: !0,
          clientX: !0,
          clientY: !0,
          offsetX: !0,
          offsetY: !0,
          pointerId: !0,
          pointerType: !0,
          screenX: !0,
          screenY: !0,
          targetTouches: !0,
          toElement: !0,
          touches: !0,
          which: function(t) {
            var e = t.button;
            return null == t.which && xt.test(t.type)
              ? null != t.charCode
                ? t.charCode
                : t.keyCode
              : !t.which && void 0 !== e && wt.test(t.type)
                ? 1 & e
                  ? 1
                  : 2 & e
                    ? 3
                    : 4 & e
                      ? 2
                      : 0
                : t.which;
          }
        },
        x.event.addProp
      ),
      x.each(
        {
          mouseenter: "mouseover",
          mouseleave: "mouseout",
          pointerenter: "pointerover",
          pointerleave: "pointerout"
        },
        function(t, e) {
          x.event.special[t] = {
            delegateType: e,
            bindType: e,
            handle: function(t) {
              var n,
                r = t.relatedTarget,
                i = t.handleObj;
              return (
                (r && (r === this || x.contains(this, r))) ||
                  ((t.type = i.origType),
                  (n = i.handler.apply(this, arguments)),
                  (t.type = e)),
                n
              );
            }
          };
        }
      ),
      x.fn.extend({
        on: function(t, e, n, r) {
          return kt(this, t, e, n, r);
        },
        one: function(t, e, n, r) {
          return kt(this, t, e, n, r, 1);
        },
        off: function(t, e, n) {
          var r, i;
          if (t && t.preventDefault && t.handleObj)
            return (
              (r = t.handleObj),
              x(t.delegateTarget).off(
                r.namespace ? r.origType + "." + r.namespace : r.origType,
                r.selector,
                r.handler
              ),
              this
            );
          if ("object" == typeof t) {
            for (i in t) this.off(i, e, t[i]);
            return this;
          }
          return (
            (!1 !== e && "function" != typeof e) || ((n = e), (e = void 0)),
            !1 === n && (n = Et),
            this.each(function() {
              x.event.remove(this, t, n, e);
            })
          );
        }
      });
    var At = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
      Ft = /<script|<style|<link/i,
      Dt = /checked\s*(?:[^=]|=\s*.checked.)/i,
      Nt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    function $t(t, e) {
      return (
        (A(t, "table") &&
          A(11 !== e.nodeType ? e : e.firstChild, "tr") &&
          x(t).children("tbody")[0]) ||
        t
      );
    }
    function jt(t) {
      return (t.type = (null !== t.getAttribute("type")) + "/" + t.type), t;
    }
    function Bt(t) {
      return (
        "true/" === (t.type || "").slice(0, 5)
          ? (t.type = t.type.slice(5))
          : t.removeAttribute("type"),
        t
      );
    }
    function Ot(t, e) {
      var n, r, i, o, a, s, l, u;
      if (1 === e.nodeType) {
        if (
          Y.hasData(t) &&
          ((o = Y.access(t)), (a = Y.set(e, o)), (u = o.events))
        )
          for (i in (delete a.handle, (a.events = {}), u))
            for (n = 0, r = u[i].length; n < r; n++) x.event.add(e, i, u[i][n]);
        Q.hasData(t) && ((s = Q.access(t)), (l = x.extend({}, s)), Q.set(e, l));
      }
    }
    function Lt(t, e, n, r) {
      e = a.apply([], e);
      var i,
        o,
        s,
        l,
        u,
        c,
        f = 0,
        h = t.length,
        d = h - 1,
        v = e[0],
        m = g(v);
      if (m || (h > 1 && "string" == typeof v && !p.checkClone && Dt.test(v)))
        return t.each(function(i) {
          var o = t.eq(i);
          m && (e[0] = v.call(this, i, o.html())), Lt(o, e, n, r);
        });
      if (
        h &&
        ((o = (i = yt(e, t[0].ownerDocument, !1, t, r)).firstChild),
        1 === i.childNodes.length && (i = o),
        o || r)
      ) {
        for (l = (s = x.map(dt(i, "script"), jt)).length; f < h; f++)
          (u = i),
            f !== d &&
              ((u = x.clone(u, !0, !0)), l && x.merge(s, dt(u, "script"))),
            n.call(t[f], u, f);
        if (l)
          for (
            c = s[s.length - 1].ownerDocument, x.map(s, Bt), f = 0;
            f < l;
            f++
          )
            (u = s[f]),
              ft.test(u.type || "") &&
                !Y.access(u, "globalEval") &&
                x.contains(c, u) &&
                (u.src && "module" !== (u.type || "").toLowerCase()
                  ? x._evalUrl && x._evalUrl(u.src)
                  : y(u.textContent.replace(Nt, ""), c, u));
      }
      return t;
    }
    function It(t, e, n) {
      for (var r, i = e ? x.filter(e, t) : t, o = 0; null != (r = i[o]); o++)
        n || 1 !== r.nodeType || x.cleanData(dt(r)),
          r.parentNode &&
            (n && x.contains(r.ownerDocument, r) && pt(dt(r, "script")),
            r.parentNode.removeChild(r));
      return t;
    }
    x.extend({
      htmlPrefilter: function(t) {
        return t.replace(At, "<$1></$2>");
      },
      clone: function(t, e, n) {
        var r,
          i,
          o,
          a,
          s,
          l,
          u,
          c = t.cloneNode(!0),
          f = x.contains(t.ownerDocument, t);
        if (
          !(
            p.noCloneChecked ||
            (1 !== t.nodeType && 11 !== t.nodeType) ||
            x.isXMLDoc(t)
          )
        )
          for (a = dt(c), r = 0, i = (o = dt(t)).length; r < i; r++)
            (s = o[r]),
              (l = a[r]),
              void 0,
              "input" === (u = l.nodeName.toLowerCase()) && ut.test(s.type)
                ? (l.checked = s.checked)
                : ("input" !== u && "textarea" !== u) ||
                  (l.defaultValue = s.defaultValue);
        if (e)
          if (n)
            for (
              o = o || dt(t), a = a || dt(c), r = 0, i = o.length;
              r < i;
              r++
            )
              Ot(o[r], a[r]);
          else Ot(t, c);
        return (
          (a = dt(c, "script")).length > 0 && pt(a, !f && dt(t, "script")), c
        );
      },
      cleanData: function(t) {
        for (
          var e, n, r, i = x.event.special, o = 0;
          void 0 !== (n = t[o]);
          o++
        )
          if (G(n)) {
            if ((e = n[Y.expando])) {
              if (e.events)
                for (r in e.events)
                  i[r] ? x.event.remove(n, r) : x.removeEvent(n, r, e.handle);
              n[Y.expando] = void 0;
            }
            n[Q.expando] && (n[Q.expando] = void 0);
          }
      }
    }),
      x.fn.extend({
        detach: function(t) {
          return It(this, t, !0);
        },
        remove: function(t) {
          return It(this, t);
        },
        text: function(t) {
          return H(
            this,
            function(t) {
              return void 0 === t
                ? x.text(this)
                : this.empty().each(function() {
                    (1 !== this.nodeType &&
                      11 !== this.nodeType &&
                      9 !== this.nodeType) ||
                      (this.textContent = t);
                  });
            },
            null,
            t,
            arguments.length
          );
        },
        append: function() {
          return Lt(this, arguments, function(t) {
            (1 !== this.nodeType &&
              11 !== this.nodeType &&
              9 !== this.nodeType) ||
              $t(this, t).appendChild(t);
          });
        },
        prepend: function() {
          return Lt(this, arguments, function(t) {
            if (
              1 === this.nodeType ||
              11 === this.nodeType ||
              9 === this.nodeType
            ) {
              var e = $t(this, t);
              e.insertBefore(t, e.firstChild);
            }
          });
        },
        before: function() {
          return Lt(this, arguments, function(t) {
            this.parentNode && this.parentNode.insertBefore(t, this);
          });
        },
        after: function() {
          return Lt(this, arguments, function(t) {
            this.parentNode &&
              this.parentNode.insertBefore(t, this.nextSibling);
          });
        },
        empty: function() {
          for (var t, e = 0; null != (t = this[e]); e++)
            1 === t.nodeType && (x.cleanData(dt(t, !1)), (t.textContent = ""));
          return this;
        },
        clone: function(t, e) {
          return (
            (t = null != t && t),
            (e = null == e ? t : e),
            this.map(function() {
              return x.clone(this, t, e);
            })
          );
        },
        html: function(t) {
          return H(
            this,
            function(t) {
              var e = this[0] || {},
                n = 0,
                r = this.length;
              if (void 0 === t && 1 === e.nodeType) return e.innerHTML;
              if (
                "string" == typeof t &&
                !Ft.test(t) &&
                !ht[(ct.exec(t) || ["", ""])[1].toLowerCase()]
              ) {
                t = x.htmlPrefilter(t);
                try {
                  for (; n < r; n++)
                    1 === (e = this[n] || {}).nodeType &&
                      (x.cleanData(dt(e, !1)), (e.innerHTML = t));
                  e = 0;
                } catch (t) {}
              }
              e && this.empty().append(t);
            },
            null,
            t,
            arguments.length
          );
        },
        replaceWith: function() {
          var t = [];
          return Lt(
            this,
            arguments,
            function(e) {
              var n = this.parentNode;
              x.inArray(this, t) < 0 &&
                (x.cleanData(dt(this)), n && n.replaceChild(e, this));
            },
            t
          );
        }
      }),
      x.each(
        {
          appendTo: "append",
          prependTo: "prepend",
          insertBefore: "before",
          insertAfter: "after",
          replaceAll: "replaceWith"
        },
        function(t, e) {
          x.fn[t] = function(t) {
            for (var n, r = [], i = x(t), o = i.length - 1, a = 0; a <= o; a++)
              (n = a === o ? this : this.clone(!0)),
                x(i[a])[e](n),
                s.apply(r, n.get());
            return this.pushStack(r);
          };
        }
      );
    var Mt = new RegExp("^(" + tt + ")(?!px)[a-z%]+$", "i"),
      Rt = function(e) {
        var n = e.ownerDocument.defaultView;
        return (n && n.opener) || (n = t), n.getComputedStyle(e);
      },
      Pt = new RegExp(nt.join("|"), "i");
    function qt(t, e, n) {
      var r,
        i,
        o,
        a,
        s = t.style;
      return (
        (n = n || Rt(t)) &&
          ("" !== (a = n.getPropertyValue(e) || n[e]) ||
            x.contains(t.ownerDocument, t) ||
            (a = x.style(t, e)),
          !p.pixelBoxStyles() &&
            Mt.test(a) &&
            Pt.test(e) &&
            ((r = s.width),
            (i = s.minWidth),
            (o = s.maxWidth),
            (s.minWidth = s.maxWidth = s.width = a),
            (a = n.width),
            (s.width = r),
            (s.minWidth = i),
            (s.maxWidth = o))),
        void 0 !== a ? a + "" : a
      );
    }
    function _t(t, e) {
      return {
        get: function() {
          if (!t()) return (this.get = e).apply(this, arguments);
          delete this.get;
        }
      };
    }
    !(function() {
      function e() {
        if (c) {
          (u.style.cssText =
            "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0"),
            (c.style.cssText =
              "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%"),
            bt.appendChild(u).appendChild(c);
          var e = t.getComputedStyle(c);
          (i = "1%" !== e.top),
            (l = 12 === n(e.marginLeft)),
            (c.style.right = "60%"),
            (s = 36 === n(e.right)),
            (o = 36 === n(e.width)),
            (c.style.position = "absolute"),
            (a = 36 === c.offsetWidth || "absolute"),
            bt.removeChild(u),
            (c = null);
        }
      }
      function n(t) {
        return Math.round(parseFloat(t));
      }
      var i,
        o,
        a,
        s,
        l,
        u = r.createElement("div"),
        c = r.createElement("div");
      c.style &&
        ((c.style.backgroundClip = "content-box"),
        (c.cloneNode(!0).style.backgroundClip = ""),
        (p.clearCloneStyle = "content-box" === c.style.backgroundClip),
        x.extend(p, {
          boxSizingReliable: function() {
            return e(), o;
          },
          pixelBoxStyles: function() {
            return e(), s;
          },
          pixelPosition: function() {
            return e(), i;
          },
          reliableMarginLeft: function() {
            return e(), l;
          },
          scrollboxSize: function() {
            return e(), a;
          }
        }));
    })();
    var Ht = /^(none|table(?!-c[ea]).+)/,
      Ut = /^--/,
      Wt = { position: "absolute", visibility: "hidden", display: "block" },
      Vt = { letterSpacing: "0", fontWeight: "400" },
      zt = ["Webkit", "Moz", "ms"],
      Gt = r.createElement("div").style;
    function Xt(t) {
      var e = x.cssProps[t];
      return (
        e ||
          (e = x.cssProps[t] =
            (function(t) {
              if (t in Gt) return t;
              for (
                var e = t[0].toUpperCase() + t.slice(1), n = zt.length;
                n--;

              )
                if ((t = zt[n] + e) in Gt) return t;
            })(t) || t),
        e
      );
    }
    function Yt(t, e, n) {
      var r = et.exec(e);
      return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : e;
    }
    function Qt(t, e, n, r, i, o) {
      var a = "width" === e ? 1 : 0,
        s = 0,
        l = 0;
      if (n === (r ? "border" : "content")) return 0;
      for (; a < 4; a += 2)
        "margin" === n && (l += x.css(t, n + nt[a], !0, i)),
          r
            ? ("content" === n && (l -= x.css(t, "padding" + nt[a], !0, i)),
              "margin" !== n &&
                (l -= x.css(t, "border" + nt[a] + "Width", !0, i)))
            : ((l += x.css(t, "padding" + nt[a], !0, i)),
              "padding" !== n
                ? (l += x.css(t, "border" + nt[a] + "Width", !0, i))
                : (s += x.css(t, "border" + nt[a] + "Width", !0, i)));
      return (
        !r &&
          o >= 0 &&
          (l += Math.max(
            0,
            Math.ceil(
              t["offset" + e[0].toUpperCase() + e.slice(1)] - o - l - s - 0.5
            )
          )),
        l
      );
    }
    function Jt(t, e, n) {
      var r = Rt(t),
        i = qt(t, e, r),
        o = "border-box" === x.css(t, "boxSizing", !1, r),
        a = o;
      if (Mt.test(i)) {
        if (!n) return i;
        i = "auto";
      }
      return (
        (a = a && (p.boxSizingReliable() || i === t.style[e])),
        ("auto" === i ||
          (!parseFloat(i) && "inline" === x.css(t, "display", !1, r))) &&
          ((i = t["offset" + e[0].toUpperCase() + e.slice(1)]), (a = !0)),
        (i = parseFloat(i) || 0) +
          Qt(t, e, n || (o ? "border" : "content"), a, r, i) +
          "px"
      );
    }
    function Zt(t, e, n, r, i) {
      return new Zt.prototype.init(t, e, n, r, i);
    }
    x.extend({
      cssHooks: {
        opacity: {
          get: function(t, e) {
            if (e) {
              var n = qt(t, "opacity");
              return "" === n ? "1" : n;
            }
          }
        }
      },
      cssNumber: {
        animationIterationCount: !0,
        columnCount: !0,
        fillOpacity: !0,
        flexGrow: !0,
        flexShrink: !0,
        fontWeight: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0
      },
      cssProps: {},
      style: function(t, e, n, r) {
        if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
          var i,
            o,
            a,
            s = z(e),
            l = Ut.test(e),
            u = t.style;
          if (
            (l || (e = Xt(s)),
            (a = x.cssHooks[e] || x.cssHooks[s]),
            void 0 === n)
          )
            return a && "get" in a && void 0 !== (i = a.get(t, !1, r))
              ? i
              : u[e];
          "string" === (o = typeof n) &&
            (i = et.exec(n)) &&
            i[1] &&
            ((n = ot(t, e, i)), (o = "number")),
            null != n &&
              n == n &&
              ("number" === o &&
                (n += (i && i[3]) || (x.cssNumber[s] ? "" : "px")),
              p.clearCloneStyle ||
                "" !== n ||
                0 !== e.indexOf("background") ||
                (u[e] = "inherit"),
              (a && "set" in a && void 0 === (n = a.set(t, n, r))) ||
                (l ? u.setProperty(e, n) : (u[e] = n)));
        }
      },
      css: function(t, e, n, r) {
        var i,
          o,
          a,
          s = z(e);
        return (
          Ut.test(e) || (e = Xt(s)),
          (a = x.cssHooks[e] || x.cssHooks[s]) &&
            "get" in a &&
            (i = a.get(t, !0, n)),
          void 0 === i && (i = qt(t, e, r)),
          "normal" === i && e in Vt && (i = Vt[e]),
          "" === n || n
            ? ((o = parseFloat(i)), !0 === n || isFinite(o) ? o || 0 : i)
            : i
        );
      }
    }),
      x.each(["height", "width"], function(t, e) {
        x.cssHooks[e] = {
          get: function(t, n, r) {
            if (n)
              return !Ht.test(x.css(t, "display")) ||
                (t.getClientRects().length && t.getBoundingClientRect().width)
                ? Jt(t, e, r)
                : it(t, Wt, function() {
                    return Jt(t, e, r);
                  });
          },
          set: function(t, n, r) {
            var i,
              o = Rt(t),
              a = "border-box" === x.css(t, "boxSizing", !1, o),
              s = r && Qt(t, e, r, a, o);
            return (
              a &&
                p.scrollboxSize() === o.position &&
                (s -= Math.ceil(
                  t["offset" + e[0].toUpperCase() + e.slice(1)] -
                    parseFloat(o[e]) -
                    Qt(t, e, "border", !1, o) -
                    0.5
                )),
              s &&
                (i = et.exec(n)) &&
                "px" !== (i[3] || "px") &&
                ((t.style[e] = n), (n = x.css(t, e))),
              Yt(0, n, s)
            );
          }
        };
      }),
      (x.cssHooks.marginLeft = _t(p.reliableMarginLeft, function(t, e) {
        if (e)
          return (
            (parseFloat(qt(t, "marginLeft")) ||
              t.getBoundingClientRect().left -
                it(t, { marginLeft: 0 }, function() {
                  return t.getBoundingClientRect().left;
                })) + "px"
          );
      })),
      x.each({ margin: "", padding: "", border: "Width" }, function(t, e) {
        (x.cssHooks[t + e] = {
          expand: function(n) {
            for (
              var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n];
              r < 4;
              r++
            )
              i[t + nt[r] + e] = o[r] || o[r - 2] || o[0];
            return i;
          }
        }),
          "margin" !== t && (x.cssHooks[t + e].set = Yt);
      }),
      x.fn.extend({
        css: function(t, e) {
          return H(
            this,
            function(t, e, n) {
              var r,
                i,
                o = {},
                a = 0;
              if (Array.isArray(e)) {
                for (r = Rt(t), i = e.length; a < i; a++)
                  o[e[a]] = x.css(t, e[a], !1, r);
                return o;
              }
              return void 0 !== n ? x.style(t, e, n) : x.css(t, e);
            },
            t,
            e,
            arguments.length > 1
          );
        }
      }),
      (x.Tween = Zt),
      (Zt.prototype = {
        constructor: Zt,
        init: function(t, e, n, r, i, o) {
          (this.elem = t),
            (this.prop = n),
            (this.easing = i || x.easing._default),
            (this.options = e),
            (this.start = this.now = this.cur()),
            (this.end = r),
            (this.unit = o || (x.cssNumber[n] ? "" : "px"));
        },
        cur: function() {
          var t = Zt.propHooks[this.prop];
          return t && t.get ? t.get(this) : Zt.propHooks._default.get(this);
        },
        run: function(t) {
          var e,
            n = Zt.propHooks[this.prop];
          return (
            this.options.duration
              ? (this.pos = e = x.easing[this.easing](
                  t,
                  this.options.duration * t,
                  0,
                  1,
                  this.options.duration
                ))
              : (this.pos = e = t),
            (this.now = (this.end - this.start) * e + this.start),
            this.options.step &&
              this.options.step.call(this.elem, this.now, this),
            n && n.set ? n.set(this) : Zt.propHooks._default.set(this),
            this
          );
        }
      }),
      (Zt.prototype.init.prototype = Zt.prototype),
      (Zt.propHooks = {
        _default: {
          get: function(t) {
            var e;
            return 1 !== t.elem.nodeType ||
              (null != t.elem[t.prop] && null == t.elem.style[t.prop])
              ? t.elem[t.prop]
              : (e = x.css(t.elem, t.prop, "")) && "auto" !== e
                ? e
                : 0;
          },
          set: function(t) {
            x.fx.step[t.prop]
              ? x.fx.step[t.prop](t)
              : 1 !== t.elem.nodeType ||
                (null == t.elem.style[x.cssProps[t.prop]] &&
                  !x.cssHooks[t.prop])
                ? (t.elem[t.prop] = t.now)
                : x.style(t.elem, t.prop, t.now + t.unit);
          }
        }
      }),
      (Zt.propHooks.scrollTop = Zt.propHooks.scrollLeft = {
        set: function(t) {
          t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now);
        }
      }),
      (x.easing = {
        linear: function(t) {
          return t;
        },
        swing: function(t) {
          return 0.5 - Math.cos(t * Math.PI) / 2;
        },
        _default: "swing"
      }),
      (x.fx = Zt.prototype.init),
      (x.fx.step = {});
    var Kt,
      te,
      ee = /^(?:toggle|show|hide)$/,
      ne = /queueHooks$/;
    function re() {
      te &&
        (!1 === r.hidden && t.requestAnimationFrame
          ? t.requestAnimationFrame(re)
          : t.setTimeout(re, x.fx.interval),
        x.fx.tick());
    }
    function ie() {
      return (
        t.setTimeout(function() {
          Kt = void 0;
        }),
        (Kt = Date.now())
      );
    }
    function oe(t, e) {
      var n,
        r = 0,
        i = { height: t };
      for (e = e ? 1 : 0; r < 4; r += 2 - e)
        i["margin" + (n = nt[r])] = i["padding" + n] = t;
      return e && (i.opacity = i.width = t), i;
    }
    function ae(t, e, n) {
      for (
        var r,
          i = (se.tweeners[e] || []).concat(se.tweeners["*"]),
          o = 0,
          a = i.length;
        o < a;
        o++
      )
        if ((r = i[o].call(n, e, t))) return r;
    }
    function se(t, e, n) {
      var r,
        i,
        o = 0,
        a = se.prefilters.length,
        s = x.Deferred().always(function() {
          delete l.elem;
        }),
        l = function() {
          if (i) return !1;
          for (
            var e = Kt || ie(),
              n = Math.max(0, u.startTime + u.duration - e),
              r = 1 - (n / u.duration || 0),
              o = 0,
              a = u.tweens.length;
            o < a;
            o++
          )
            u.tweens[o].run(r);
          return (
            s.notifyWith(t, [u, r, n]),
            r < 1 && a
              ? n
              : (a || s.notifyWith(t, [u, 1, 0]), s.resolveWith(t, [u]), !1)
          );
        },
        u = s.promise({
          elem: t,
          props: x.extend({}, e),
          opts: x.extend(
            !0,
            { specialEasing: {}, easing: x.easing._default },
            n
          ),
          originalProperties: e,
          originalOptions: n,
          startTime: Kt || ie(),
          duration: n.duration,
          tweens: [],
          createTween: function(e, n) {
            var r = x.Tween(
              t,
              u.opts,
              e,
              n,
              u.opts.specialEasing[e] || u.opts.easing
            );
            return u.tweens.push(r), r;
          },
          stop: function(e) {
            var n = 0,
              r = e ? u.tweens.length : 0;
            if (i) return this;
            for (i = !0; n < r; n++) u.tweens[n].run(1);
            return (
              e
                ? (s.notifyWith(t, [u, 1, 0]), s.resolveWith(t, [u, e]))
                : s.rejectWith(t, [u, e]),
              this
            );
          }
        }),
        c = u.props;
      for (
        !(function(t, e) {
          var n, r, i, o, a;
          for (n in t)
            if (
              ((i = e[(r = z(n))]),
              (o = t[n]),
              Array.isArray(o) && ((i = o[1]), (o = t[n] = o[0])),
              n !== r && ((t[r] = o), delete t[n]),
              (a = x.cssHooks[r]) && ("expand" in a))
            )
              for (n in ((o = a.expand(o)), delete t[r], o))
                (n in t) || ((t[n] = o[n]), (e[n] = i));
            else e[r] = i;
        })(c, u.opts.specialEasing);
        o < a;
        o++
      )
        if ((r = se.prefilters[o].call(u, t, c, u.opts)))
          return (
            g(r.stop) &&
              (x._queueHooks(u.elem, u.opts.queue).stop = r.stop.bind(r)),
            r
          );
      return (
        x.map(c, ae, u),
        g(u.opts.start) && u.opts.start.call(t, u),
        u
          .progress(u.opts.progress)
          .done(u.opts.done, u.opts.complete)
          .fail(u.opts.fail)
          .always(u.opts.always),
        x.fx.timer(x.extend(l, { elem: t, anim: u, queue: u.opts.queue })),
        u
      );
    }
    (x.Animation = x.extend(se, {
      tweeners: {
        "*": [
          function(t, e) {
            var n = this.createTween(t, e);
            return ot(n.elem, t, et.exec(e), n), n;
          }
        ]
      },
      tweener: function(t, e) {
        g(t) ? ((e = t), (t = ["*"])) : (t = t.match(L));
        for (var n, r = 0, i = t.length; r < i; r++)
          (n = t[r]),
            (se.tweeners[n] = se.tweeners[n] || []),
            se.tweeners[n].unshift(e);
      },
      prefilters: [
        function(t, e, n) {
          var r,
            i,
            o,
            a,
            s,
            l,
            u,
            c,
            f = "width" in e || "height" in e,
            h = this,
            d = {},
            p = t.style,
            g = t.nodeType && rt(t),
            v = Y.get(t, "fxshow");
          for (r in (n.queue ||
            (null == (a = x._queueHooks(t, "fx")).unqueued &&
              ((a.unqueued = 0),
              (s = a.empty.fire),
              (a.empty.fire = function() {
                a.unqueued || s();
              })),
            a.unqueued++,
            h.always(function() {
              h.always(function() {
                a.unqueued--, x.queue(t, "fx").length || a.empty.fire();
              });
            })),
          e))
            if (((i = e[r]), ee.test(i))) {
              if (
                (delete e[r],
                (o = o || "toggle" === i),
                i === (g ? "hide" : "show"))
              ) {
                if ("show" !== i || !v || void 0 === v[r]) continue;
                g = !0;
              }
              d[r] = (v && v[r]) || x.style(t, r);
            }
          if ((l = !x.isEmptyObject(e)) || !x.isEmptyObject(d))
            for (r in (f &&
              1 === t.nodeType &&
              ((n.overflow = [p.overflow, p.overflowX, p.overflowY]),
              null == (u = v && v.display) && (u = Y.get(t, "display")),
              "none" === (c = x.css(t, "display")) &&
                (u
                  ? (c = u)
                  : (lt([t], !0),
                    (u = t.style.display || u),
                    (c = x.css(t, "display")),
                    lt([t]))),
              ("inline" === c || ("inline-block" === c && null != u)) &&
                "none" === x.css(t, "float") &&
                (l ||
                  (h.done(function() {
                    p.display = u;
                  }),
                  null == u && ((c = p.display), (u = "none" === c ? "" : c))),
                (p.display = "inline-block"))),
            n.overflow &&
              ((p.overflow = "hidden"),
              h.always(function() {
                (p.overflow = n.overflow[0]),
                  (p.overflowX = n.overflow[1]),
                  (p.overflowY = n.overflow[2]);
              })),
            (l = !1),
            d))
              l ||
                (v
                  ? "hidden" in v && (g = v.hidden)
                  : (v = Y.access(t, "fxshow", { display: u })),
                o && (v.hidden = !g),
                g && lt([t], !0),
                h.done(function() {
                  for (r in (g || lt([t]), Y.remove(t, "fxshow"), d))
                    x.style(t, r, d[r]);
                })),
                (l = ae(g ? v[r] : 0, r, h)),
                r in v ||
                  ((v[r] = l.start), g && ((l.end = l.start), (l.start = 0)));
        }
      ],
      prefilter: function(t, e) {
        e ? se.prefilters.unshift(t) : se.prefilters.push(t);
      }
    })),
      (x.speed = function(t, e, n) {
        var r =
          t && "object" == typeof t
            ? x.extend({}, t)
            : {
                complete: n || (!n && e) || (g(t) && t),
                duration: t,
                easing: (n && e) || (e && !g(e) && e)
              };
        return (
          x.fx.off
            ? (r.duration = 0)
            : "number" != typeof r.duration &&
              (r.duration in x.fx.speeds
                ? (r.duration = x.fx.speeds[r.duration])
                : (r.duration = x.fx.speeds._default)),
          (null != r.queue && !0 !== r.queue) || (r.queue = "fx"),
          (r.old = r.complete),
          (r.complete = function() {
            g(r.old) && r.old.call(this), r.queue && x.dequeue(this, r.queue);
          }),
          r
        );
      }),
      x.fn.extend({
        fadeTo: function(t, e, n, r) {
          return this.filter(rt)
            .css("opacity", 0)
            .show()
            .end()
            .animate({ opacity: e }, t, n, r);
        },
        animate: function(t, e, n, r) {
          var i = x.isEmptyObject(t),
            o = x.speed(e, n, r),
            a = function() {
              var e = se(this, x.extend({}, t), o);
              (i || Y.get(this, "finish")) && e.stop(!0);
            };
          return (
            (a.finish = a),
            i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
          );
        },
        stop: function(t, e, n) {
          var r = function(t) {
            var e = t.stop;
            delete t.stop, e(n);
          };
          return (
            "string" != typeof t && ((n = e), (e = t), (t = void 0)),
            e && !1 !== t && this.queue(t || "fx", []),
            this.each(function() {
              var e = !0,
                i = null != t && t + "queueHooks",
                o = x.timers,
                a = Y.get(this);
              if (i) a[i] && a[i].stop && r(a[i]);
              else for (i in a) a[i] && a[i].stop && ne.test(i) && r(a[i]);
              for (i = o.length; i--; )
                o[i].elem !== this ||
                  (null != t && o[i].queue !== t) ||
                  (o[i].anim.stop(n), (e = !1), o.splice(i, 1));
              (!e && n) || x.dequeue(this, t);
            })
          );
        },
        finish: function(t) {
          return (
            !1 !== t && (t = t || "fx"),
            this.each(function() {
              var e,
                n = Y.get(this),
                r = n[t + "queue"],
                i = n[t + "queueHooks"],
                o = x.timers,
                a = r ? r.length : 0;
              for (
                n.finish = !0,
                  x.queue(this, t, []),
                  i && i.stop && i.stop.call(this, !0),
                  e = o.length;
                e--;

              )
                o[e].elem === this &&
                  o[e].queue === t &&
                  (o[e].anim.stop(!0), o.splice(e, 1));
              for (e = 0; e < a; e++)
                r[e] && r[e].finish && r[e].finish.call(this);
              delete n.finish;
            })
          );
        }
      }),
      x.each(["toggle", "show", "hide"], function(t, e) {
        var n = x.fn[e];
        x.fn[e] = function(t, r, i) {
          return null == t || "boolean" == typeof t
            ? n.apply(this, arguments)
            : this.animate(oe(e, !0), t, r, i);
        };
      }),
      x.each(
        {
          slideDown: oe("show"),
          slideUp: oe("hide"),
          slideToggle: oe("toggle"),
          fadeIn: { opacity: "show" },
          fadeOut: { opacity: "hide" },
          fadeToggle: { opacity: "toggle" }
        },
        function(t, e) {
          x.fn[t] = function(t, n, r) {
            return this.animate(e, t, n, r);
          };
        }
      ),
      (x.timers = []),
      (x.fx.tick = function() {
        var t,
          e = 0,
          n = x.timers;
        for (Kt = Date.now(); e < n.length; e++)
          (t = n[e])() || n[e] !== t || n.splice(e--, 1);
        n.length || x.fx.stop(), (Kt = void 0);
      }),
      (x.fx.timer = function(t) {
        x.timers.push(t), x.fx.start();
      }),
      (x.fx.interval = 13),
      (x.fx.start = function() {
        te || ((te = !0), re());
      }),
      (x.fx.stop = function() {
        te = null;
      }),
      (x.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
      (x.fn.delay = function(e, n) {
        return (
          (e = (x.fx && x.fx.speeds[e]) || e),
          (n = n || "fx"),
          this.queue(n, function(n, r) {
            var i = t.setTimeout(n, e);
            r.stop = function() {
              t.clearTimeout(i);
            };
          })
        );
      }),
      (function() {
        var t = r.createElement("input"),
          e = r.createElement("select").appendChild(r.createElement("option"));
        (t.type = "checkbox"),
          (p.checkOn = "" !== t.value),
          (p.optSelected = e.selected),
          ((t = r.createElement("input")).value = "t"),
          (t.type = "radio"),
          (p.radioValue = "t" === t.value);
      })();
    var le,
      ue = x.expr.attrHandle;
    x.fn.extend({
      attr: function(t, e) {
        return H(this, x.attr, t, e, arguments.length > 1);
      },
      removeAttr: function(t) {
        return this.each(function() {
          x.removeAttr(this, t);
        });
      }
    }),
      x.extend({
        attr: function(t, e, n) {
          var r,
            i,
            o = t.nodeType;
          if (3 !== o && 8 !== o && 2 !== o)
            return void 0 === t.getAttribute
              ? x.prop(t, e, n)
              : ((1 === o && x.isXMLDoc(t)) ||
                  (i =
                    x.attrHooks[e.toLowerCase()] ||
                    (x.expr.match.bool.test(e) ? le : void 0)),
                void 0 !== n
                  ? null === n
                    ? void x.removeAttr(t, e)
                    : i && "set" in i && void 0 !== (r = i.set(t, n, e))
                      ? r
                      : (t.setAttribute(e, n + ""), n)
                  : i && "get" in i && null !== (r = i.get(t, e))
                    ? r
                    : null == (r = x.find.attr(t, e))
                      ? void 0
                      : r);
        },
        attrHooks: {
          type: {
            set: function(t, e) {
              if (!p.radioValue && "radio" === e && A(t, "input")) {
                var n = t.value;
                return t.setAttribute("type", e), n && (t.value = n), e;
              }
            }
          }
        },
        removeAttr: function(t, e) {
          var n,
            r = 0,
            i = e && e.match(L);
          if (i && 1 === t.nodeType)
            for (; (n = i[r++]); ) t.removeAttribute(n);
        }
      }),
      (le = {
        set: function(t, e, n) {
          return !1 === e ? x.removeAttr(t, n) : t.setAttribute(n, n), n;
        }
      }),
      x.each(x.expr.match.bool.source.match(/\w+/g), function(t, e) {
        var n = ue[e] || x.find.attr;
        ue[e] = function(t, e, r) {
          var i,
            o,
            a = e.toLowerCase();
          return (
            r ||
              ((o = ue[a]),
              (ue[a] = i),
              (i = null != n(t, e, r) ? a : null),
              (ue[a] = o)),
            i
          );
        };
      });
    var ce = /^(?:input|select|textarea|button)$/i,
      fe = /^(?:a|area)$/i;
    function he(t) {
      return (t.match(L) || []).join(" ");
    }
    function de(t) {
      return (t.getAttribute && t.getAttribute("class")) || "";
    }
    function pe(t) {
      return Array.isArray(t) ? t : ("string" == typeof t && t.match(L)) || [];
    }
    x.fn.extend({
      prop: function(t, e) {
        return H(this, x.prop, t, e, arguments.length > 1);
      },
      removeProp: function(t) {
        return this.each(function() {
          delete this[x.propFix[t] || t];
        });
      }
    }),
      x.extend({
        prop: function(t, e, n) {
          var r,
            i,
            o = t.nodeType;
          if (3 !== o && 8 !== o && 2 !== o)
            return (
              (1 === o && x.isXMLDoc(t)) ||
                ((e = x.propFix[e] || e), (i = x.propHooks[e])),
              void 0 !== n
                ? i && "set" in i && void 0 !== (r = i.set(t, n, e))
                  ? r
                  : (t[e] = n)
                : i && "get" in i && null !== (r = i.get(t, e))
                  ? r
                  : t[e]
            );
        },
        propHooks: {
          tabIndex: {
            get: function(t) {
              var e = x.find.attr(t, "tabindex");
              return e
                ? parseInt(e, 10)
                : ce.test(t.nodeName) || (fe.test(t.nodeName) && t.href)
                  ? 0
                  : -1;
            }
          }
        },
        propFix: { for: "htmlFor", class: "className" }
      }),
      p.optSelected ||
        (x.propHooks.selected = {
          get: function(t) {
            var e = t.parentNode;
            return e && e.parentNode && e.parentNode.selectedIndex, null;
          },
          set: function(t) {
            var e = t.parentNode;
            e && (e.selectedIndex, e.parentNode && e.parentNode.selectedIndex);
          }
        }),
      x.each(
        [
          "tabIndex",
          "readOnly",
          "maxLength",
          "cellSpacing",
          "cellPadding",
          "rowSpan",
          "colSpan",
          "useMap",
          "frameBorder",
          "contentEditable"
        ],
        function() {
          x.propFix[this.toLowerCase()] = this;
        }
      ),
      x.fn.extend({
        addClass: function(t) {
          var e,
            n,
            r,
            i,
            o,
            a,
            s,
            l = 0;
          if (g(t))
            return this.each(function(e) {
              x(this).addClass(t.call(this, e, de(this)));
            });
          if ((e = pe(t)).length)
            for (; (n = this[l++]); )
              if (((i = de(n)), (r = 1 === n.nodeType && " " + he(i) + " "))) {
                for (a = 0; (o = e[a++]); )
                  r.indexOf(" " + o + " ") < 0 && (r += o + " ");
                i !== (s = he(r)) && n.setAttribute("class", s);
              }
          return this;
        },
        removeClass: function(t) {
          var e,
            n,
            r,
            i,
            o,
            a,
            s,
            l = 0;
          if (g(t))
            return this.each(function(e) {
              x(this).removeClass(t.call(this, e, de(this)));
            });
          if (!arguments.length) return this.attr("class", "");
          if ((e = pe(t)).length)
            for (; (n = this[l++]); )
              if (((i = de(n)), (r = 1 === n.nodeType && " " + he(i) + " "))) {
                for (a = 0; (o = e[a++]); )
                  for (; r.indexOf(" " + o + " ") > -1; )
                    r = r.replace(" " + o + " ", " ");
                i !== (s = he(r)) && n.setAttribute("class", s);
              }
          return this;
        },
        toggleClass: function(t, e) {
          var n = typeof t,
            r = "string" === n || Array.isArray(t);
          return "boolean" == typeof e && r
            ? e
              ? this.addClass(t)
              : this.removeClass(t)
            : g(t)
              ? this.each(function(n) {
                  x(this).toggleClass(t.call(this, n, de(this), e), e);
                })
              : this.each(function() {
                  var e, i, o, a;
                  if (r)
                    for (i = 0, o = x(this), a = pe(t); (e = a[i++]); )
                      o.hasClass(e) ? o.removeClass(e) : o.addClass(e);
                  else
                    (void 0 !== t && "boolean" !== n) ||
                      ((e = de(this)) && Y.set(this, "__className__", e),
                      this.setAttribute &&
                        this.setAttribute(
                          "class",
                          e || !1 === t
                            ? ""
                            : Y.get(this, "__className__") || ""
                        ));
                });
        },
        hasClass: function(t) {
          var e,
            n,
            r = 0;
          for (e = " " + t + " "; (n = this[r++]); )
            if (1 === n.nodeType && (" " + he(de(n)) + " ").indexOf(e) > -1)
              return !0;
          return !1;
        }
      });
    var ge = /\r/g;
    x.fn.extend({
      val: function(t) {
        var e,
          n,
          r,
          i = this[0];
        return arguments.length
          ? ((r = g(t)),
            this.each(function(n) {
              var i;
              1 === this.nodeType &&
                (null == (i = r ? t.call(this, n, x(this).val()) : t)
                  ? (i = "")
                  : "number" == typeof i
                    ? (i += "")
                    : Array.isArray(i) &&
                      (i = x.map(i, function(t) {
                        return null == t ? "" : t + "";
                      })),
                ((e =
                  x.valHooks[this.type] ||
                  x.valHooks[this.nodeName.toLowerCase()]) &&
                  "set" in e &&
                  void 0 !== e.set(this, i, "value")) ||
                  (this.value = i));
            }))
          : i
            ? (e =
                x.valHooks[i.type] || x.valHooks[i.nodeName.toLowerCase()]) &&
              "get" in e &&
              void 0 !== (n = e.get(i, "value"))
              ? n
              : "string" == typeof (n = i.value)
                ? n.replace(ge, "")
                : null == n
                  ? ""
                  : n
            : void 0;
      }
    }),
      x.extend({
        valHooks: {
          option: {
            get: function(t) {
              var e = x.find.attr(t, "value");
              return null != e ? e : he(x.text(t));
            }
          },
          select: {
            get: function(t) {
              var e,
                n,
                r,
                i = t.options,
                o = t.selectedIndex,
                a = "select-one" === t.type,
                s = a ? null : [],
                l = a ? o + 1 : i.length;
              for (r = o < 0 ? l : a ? o : 0; r < l; r++)
                if (
                  ((n = i[r]).selected || r === o) &&
                  !n.disabled &&
                  (!n.parentNode.disabled || !A(n.parentNode, "optgroup"))
                ) {
                  if (((e = x(n).val()), a)) return e;
                  s.push(e);
                }
              return s;
            },
            set: function(t, e) {
              for (
                var n, r, i = t.options, o = x.makeArray(e), a = i.length;
                a--;

              )
                ((r = i[a]).selected =
                  x.inArray(x.valHooks.option.get(r), o) > -1) && (n = !0);
              return n || (t.selectedIndex = -1), o;
            }
          }
        }
      }),
      x.each(["radio", "checkbox"], function() {
        (x.valHooks[this] = {
          set: function(t, e) {
            if (Array.isArray(e))
              return (t.checked = x.inArray(x(t).val(), e) > -1);
          }
        }),
          p.checkOn ||
            (x.valHooks[this].get = function(t) {
              return null === t.getAttribute("value") ? "on" : t.value;
            });
      }),
      (p.focusin = "onfocusin" in t);
    var ve = /^(?:focusinfocus|focusoutblur)$/,
      me = function(t) {
        t.stopPropagation();
      };
    x.extend(x.event, {
      trigger: function(e, n, i, o) {
        var a,
          s,
          l,
          u,
          c,
          h,
          d,
          p,
          m = [i || r],
          y = f.call(e, "type") ? e.type : e,
          b = f.call(e, "namespace") ? e.namespace.split(".") : [];
        if (
          ((s = p = l = i = i || r),
          3 !== i.nodeType &&
            8 !== i.nodeType &&
            !ve.test(y + x.event.triggered) &&
            (y.indexOf(".") > -1 &&
              ((y = (b = y.split(".")).shift()), b.sort()),
            (c = y.indexOf(":") < 0 && "on" + y),
            ((e = e[x.expando]
              ? e
              : new x.Event(y, "object" == typeof e && e)).isTrigger = o
              ? 2
              : 3),
            (e.namespace = b.join(".")),
            (e.rnamespace = e.namespace
              ? new RegExp("(^|\\.)" + b.join("\\.(?:.*\\.|)") + "(\\.|$)")
              : null),
            (e.result = void 0),
            e.target || (e.target = i),
            (n = null == n ? [e] : x.makeArray(n, [e])),
            (d = x.event.special[y] || {}),
            o || !d.trigger || !1 !== d.trigger.apply(i, n)))
        ) {
          if (!o && !d.noBubble && !v(i)) {
            for (
              u = d.delegateType || y, ve.test(u + y) || (s = s.parentNode);
              s;
              s = s.parentNode
            )
              m.push(s), (l = s);
            l === (i.ownerDocument || r) &&
              m.push(l.defaultView || l.parentWindow || t);
          }
          for (a = 0; (s = m[a++]) && !e.isPropagationStopped(); )
            (p = s),
              (e.type = a > 1 ? u : d.bindType || y),
              (h = (Y.get(s, "events") || {})[e.type] && Y.get(s, "handle")) &&
                h.apply(s, n),
              (h = c && s[c]) &&
                h.apply &&
                G(s) &&
                ((e.result = h.apply(s, n)),
                !1 === e.result && e.preventDefault());
          return (
            (e.type = y),
            o ||
              e.isDefaultPrevented() ||
              (d._default && !1 !== d._default.apply(m.pop(), n)) ||
              !G(i) ||
              (c &&
                g(i[y]) &&
                !v(i) &&
                ((l = i[c]) && (i[c] = null),
                (x.event.triggered = y),
                e.isPropagationStopped() && p.addEventListener(y, me),
                i[y](),
                e.isPropagationStopped() && p.removeEventListener(y, me),
                (x.event.triggered = void 0),
                l && (i[c] = l))),
            e.result
          );
        }
      },
      simulate: function(t, e, n) {
        var r = x.extend(new x.Event(), n, { type: t, isSimulated: !0 });
        x.event.trigger(r, null, e);
      }
    }),
      x.fn.extend({
        trigger: function(t, e) {
          return this.each(function() {
            x.event.trigger(t, e, this);
          });
        },
        triggerHandler: function(t, e) {
          var n = this[0];
          if (n) return x.event.trigger(t, e, n, !0);
        }
      }),
      p.focusin ||
        x.each({ focus: "focusin", blur: "focusout" }, function(t, e) {
          var n = function(t) {
            x.event.simulate(e, t.target, x.event.fix(t));
          };
          x.event.special[e] = {
            setup: function() {
              var r = this.ownerDocument || this,
                i = Y.access(r, e);
              i || r.addEventListener(t, n, !0), Y.access(r, e, (i || 0) + 1);
            },
            teardown: function() {
              var r = this.ownerDocument || this,
                i = Y.access(r, e) - 1;
              i
                ? Y.access(r, e, i)
                : (r.removeEventListener(t, n, !0), Y.remove(r, e));
            }
          };
        });
    var ye = t.location,
      be = Date.now(),
      xe = /\?/;
    x.parseXML = function(e) {
      var n;
      if (!e || "string" != typeof e) return null;
      try {
        n = new t.DOMParser().parseFromString(e, "text/xml");
      } catch (t) {
        n = void 0;
      }
      return (
        (n && !n.getElementsByTagName("parsererror").length) ||
          x.error("Invalid XML: " + e),
        n
      );
    };
    var we = /\[\]$/,
      Ce = /\r?\n/g,
      Te = /^(?:submit|button|image|reset|file)$/i,
      Ee = /^(?:input|select|textarea|keygen)/i;
    function Se(t, e, n, r) {
      var i;
      if (Array.isArray(e))
        x.each(e, function(e, i) {
          n || we.test(t)
            ? r(t, i)
            : Se(
                t + "[" + ("object" == typeof i && null != i ? e : "") + "]",
                i,
                n,
                r
              );
        });
      else if (n || "object" !== b(e)) r(t, e);
      else for (i in e) Se(t + "[" + i + "]", e[i], n, r);
    }
    (x.param = function(t, e) {
      var n,
        r = [],
        i = function(t, e) {
          var n = g(e) ? e() : e;
          r[r.length] =
            encodeURIComponent(t) +
            "=" +
            encodeURIComponent(null == n ? "" : n);
        };
      if (Array.isArray(t) || (t.jquery && !x.isPlainObject(t)))
        x.each(t, function() {
          i(this.name, this.value);
        });
      else for (n in t) Se(n, t[n], e, i);
      return r.join("&");
    }),
      x.fn.extend({
        serialize: function() {
          return x.param(this.serializeArray());
        },
        serializeArray: function() {
          return this.map(function() {
            var t = x.prop(this, "elements");
            return t ? x.makeArray(t) : this;
          })
            .filter(function() {
              var t = this.type;
              return (
                this.name &&
                !x(this).is(":disabled") &&
                Ee.test(this.nodeName) &&
                !Te.test(t) &&
                (this.checked || !ut.test(t))
              );
            })
            .map(function(t, e) {
              var n = x(this).val();
              return null == n
                ? null
                : Array.isArray(n)
                  ? x.map(n, function(t) {
                      return { name: e.name, value: t.replace(Ce, "\r\n") };
                    })
                  : { name: e.name, value: n.replace(Ce, "\r\n") };
            })
            .get();
        }
      });
    var ke = /%20/g,
      Ae = /#.*$/,
      Fe = /([?&])_=[^&]*/,
      De = /^(.*?):[ \t]*([^\r\n]*)$/gm,
      Ne = /^(?:GET|HEAD)$/,
      $e = /^\/\//,
      je = {},
      Be = {},
      Oe = "*/".concat("*"),
      Le = r.createElement("a");
    function Ie(t) {
      return function(e, n) {
        "string" != typeof e && ((n = e), (e = "*"));
        var r,
          i = 0,
          o = e.toLowerCase().match(L) || [];
        if (g(n))
          for (; (r = o[i++]); )
            "+" === r[0]
              ? ((r = r.slice(1) || "*"), (t[r] = t[r] || []).unshift(n))
              : (t[r] = t[r] || []).push(n);
      };
    }
    function Me(t, e, n, r) {
      var i = {},
        o = t === Be;
      function a(s) {
        var l;
        return (
          (i[s] = !0),
          x.each(t[s] || [], function(t, s) {
            var u = s(e, n, r);
            return "string" != typeof u || o || i[u]
              ? o
                ? !(l = u)
                : void 0
              : (e.dataTypes.unshift(u), a(u), !1);
          }),
          l
        );
      }
      return a(e.dataTypes[0]) || (!i["*"] && a("*"));
    }
    function Re(t, e) {
      var n,
        r,
        i = x.ajaxSettings.flatOptions || {};
      for (n in e) void 0 !== e[n] && ((i[n] ? t : r || (r = {}))[n] = e[n]);
      return r && x.extend(!0, t, r), t;
    }
    (Le.href = ye.href),
      x.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
          url: ye.href,
          type: "GET",
          isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(
            ye.protocol
          ),
          global: !0,
          processData: !0,
          async: !0,
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          accepts: {
            "*": Oe,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript"
          },
          contents: { xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/ },
          responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON"
          },
          converters: {
            "* text": String,
            "text html": !0,
            "text json": JSON.parse,
            "text xml": x.parseXML
          },
          flatOptions: { url: !0, context: !0 }
        },
        ajaxSetup: function(t, e) {
          return e ? Re(Re(t, x.ajaxSettings), e) : Re(x.ajaxSettings, t);
        },
        ajaxPrefilter: Ie(je),
        ajaxTransport: Ie(Be),
        ajax: function(e, n) {
          "object" == typeof e && ((n = e), (e = void 0)), (n = n || {});
          var i,
            o,
            a,
            s,
            l,
            u,
            c,
            f,
            h,
            d,
            p = x.ajaxSetup({}, n),
            g = p.context || p,
            v = p.context && (g.nodeType || g.jquery) ? x(g) : x.event,
            m = x.Deferred(),
            y = x.Callbacks("once memory"),
            b = p.statusCode || {},
            w = {},
            C = {},
            T = "canceled",
            E = {
              readyState: 0,
              getResponseHeader: function(t) {
                var e;
                if (c) {
                  if (!s)
                    for (s = {}; (e = De.exec(a)); )
                      s[e[1].toLowerCase()] = e[2];
                  e = s[t.toLowerCase()];
                }
                return null == e ? null : e;
              },
              getAllResponseHeaders: function() {
                return c ? a : null;
              },
              setRequestHeader: function(t, e) {
                return (
                  null == c &&
                    ((t = C[t.toLowerCase()] = C[t.toLowerCase()] || t),
                    (w[t] = e)),
                  this
                );
              },
              overrideMimeType: function(t) {
                return null == c && (p.mimeType = t), this;
              },
              statusCode: function(t) {
                var e;
                if (t)
                  if (c) E.always(t[E.status]);
                  else for (e in t) b[e] = [b[e], t[e]];
                return this;
              },
              abort: function(t) {
                var e = t || T;
                return i && i.abort(e), S(0, e), this;
              }
            };
          if (
            (m.promise(E),
            (p.url = ((e || p.url || ye.href) + "").replace(
              $e,
              ye.protocol + "//"
            )),
            (p.type = n.method || n.type || p.method || p.type),
            (p.dataTypes = (p.dataType || "*").toLowerCase().match(L) || [""]),
            null == p.crossDomain)
          ) {
            u = r.createElement("a");
            try {
              (u.href = p.url),
                (u.href = u.href),
                (p.crossDomain =
                  Le.protocol + "//" + Le.host != u.protocol + "//" + u.host);
            } catch (t) {
              p.crossDomain = !0;
            }
          }
          if (
            (p.data &&
              p.processData &&
              "string" != typeof p.data &&
              (p.data = x.param(p.data, p.traditional)),
            Me(je, p, n, E),
            c)
          )
            return E;
          for (h in ((f = x.event && p.global) &&
            0 == x.active++ &&
            x.event.trigger("ajaxStart"),
          (p.type = p.type.toUpperCase()),
          (p.hasContent = !Ne.test(p.type)),
          (o = p.url.replace(Ae, "")),
          p.hasContent
            ? p.data &&
              p.processData &&
              0 ===
                (p.contentType || "").indexOf(
                  "application/x-www-form-urlencoded"
                ) &&
              (p.data = p.data.replace(ke, "+"))
            : ((d = p.url.slice(o.length)),
              p.data &&
                (p.processData || "string" == typeof p.data) &&
                ((o += (xe.test(o) ? "&" : "?") + p.data), delete p.data),
              !1 === p.cache &&
                ((o = o.replace(Fe, "$1")),
                (d = (xe.test(o) ? "&" : "?") + "_=" + be++ + d)),
              (p.url = o + d)),
          p.ifModified &&
            (x.lastModified[o] &&
              E.setRequestHeader("If-Modified-Since", x.lastModified[o]),
            x.etag[o] && E.setRequestHeader("If-None-Match", x.etag[o])),
          ((p.data && p.hasContent && !1 !== p.contentType) || n.contentType) &&
            E.setRequestHeader("Content-Type", p.contentType),
          E.setRequestHeader(
            "Accept",
            p.dataTypes[0] && p.accepts[p.dataTypes[0]]
              ? p.accepts[p.dataTypes[0]] +
                ("*" !== p.dataTypes[0] ? ", " + Oe + "; q=0.01" : "")
              : p.accepts["*"]
          ),
          p.headers))
            E.setRequestHeader(h, p.headers[h]);
          if (p.beforeSend && (!1 === p.beforeSend.call(g, E, p) || c))
            return E.abort();
          if (
            ((T = "abort"),
            y.add(p.complete),
            E.done(p.success),
            E.fail(p.error),
            (i = Me(Be, p, n, E)))
          ) {
            if (((E.readyState = 1), f && v.trigger("ajaxSend", [E, p]), c))
              return E;
            p.async &&
              p.timeout > 0 &&
              (l = t.setTimeout(function() {
                E.abort("timeout");
              }, p.timeout));
            try {
              (c = !1), i.send(w, S);
            } catch (t) {
              if (c) throw t;
              S(-1, t);
            }
          } else S(-1, "No Transport");
          function S(e, n, r, s) {
            var u,
              h,
              d,
              w,
              C,
              T = n;
            c ||
              ((c = !0),
              l && t.clearTimeout(l),
              (i = void 0),
              (a = s || ""),
              (E.readyState = e > 0 ? 4 : 0),
              (u = (e >= 200 && e < 300) || 304 === e),
              r &&
                (w = (function(t, e, n) {
                  for (
                    var r, i, o, a, s = t.contents, l = t.dataTypes;
                    "*" === l[0];

                  )
                    l.shift(),
                      void 0 === r &&
                        (r = t.mimeType || e.getResponseHeader("Content-Type"));
                  if (r)
                    for (i in s)
                      if (s[i] && s[i].test(r)) {
                        l.unshift(i);
                        break;
                      }
                  if (l[0] in n) o = l[0];
                  else {
                    for (i in n) {
                      if (!l[0] || t.converters[i + " " + l[0]]) {
                        o = i;
                        break;
                      }
                      a || (a = i);
                    }
                    o = o || a;
                  }
                  if (o) return o !== l[0] && l.unshift(o), n[o];
                })(p, E, r)),
              (w = (function(t, e, n, r) {
                var i,
                  o,
                  a,
                  s,
                  l,
                  u = {},
                  c = t.dataTypes.slice();
                if (c[1])
                  for (a in t.converters) u[a.toLowerCase()] = t.converters[a];
                for (o = c.shift(); o; )
                  if (
                    (t.responseFields[o] && (n[t.responseFields[o]] = e),
                    !l &&
                      r &&
                      t.dataFilter &&
                      (e = t.dataFilter(e, t.dataType)),
                    (l = o),
                    (o = c.shift()))
                  )
                    if ("*" === o) o = l;
                    else if ("*" !== l && l !== o) {
                      if (!(a = u[l + " " + o] || u["* " + o]))
                        for (i in u)
                          if (
                            (s = i.split(" "))[1] === o &&
                            (a = u[l + " " + s[0]] || u["* " + s[0]])
                          ) {
                            !0 === a
                              ? (a = u[i])
                              : !0 !== u[i] && ((o = s[0]), c.unshift(s[1]));
                            break;
                          }
                      if (!0 !== a)
                        if (a && t.throws) e = a(e);
                        else
                          try {
                            e = a(e);
                          } catch (t) {
                            return {
                              state: "parsererror",
                              error: a
                                ? t
                                : "No conversion from " + l + " to " + o
                            };
                          }
                    }
                return { state: "success", data: e };
              })(p, w, E, u)),
              u
                ? (p.ifModified &&
                    ((C = E.getResponseHeader("Last-Modified")) &&
                      (x.lastModified[o] = C),
                    (C = E.getResponseHeader("etag")) && (x.etag[o] = C)),
                  204 === e || "HEAD" === p.type
                    ? (T = "nocontent")
                    : 304 === e
                      ? (T = "notmodified")
                      : ((T = w.state), (h = w.data), (u = !(d = w.error))))
                : ((d = T), (!e && T) || ((T = "error"), e < 0 && (e = 0))),
              (E.status = e),
              (E.statusText = (n || T) + ""),
              u ? m.resolveWith(g, [h, T, E]) : m.rejectWith(g, [E, T, d]),
              E.statusCode(b),
              (b = void 0),
              f &&
                v.trigger(u ? "ajaxSuccess" : "ajaxError", [E, p, u ? h : d]),
              y.fireWith(g, [E, T]),
              f &&
                (v.trigger("ajaxComplete", [E, p]),
                --x.active || x.event.trigger("ajaxStop")));
          }
          return E;
        },
        getJSON: function(t, e, n) {
          return x.get(t, e, n, "json");
        },
        getScript: function(t, e) {
          return x.get(t, void 0, e, "script");
        }
      }),
      x.each(["get", "post"], function(t, e) {
        x[e] = function(t, n, r, i) {
          return (
            g(n) && ((i = i || r), (r = n), (n = void 0)),
            x.ajax(
              x.extend(
                { url: t, type: e, dataType: i, data: n, success: r },
                x.isPlainObject(t) && t
              )
            )
          );
        };
      }),
      (x._evalUrl = function(t) {
        return x.ajax({
          url: t,
          type: "GET",
          dataType: "script",
          cache: !0,
          async: !1,
          global: !1,
          throws: !0
        });
      }),
      x.fn.extend({
        wrapAll: function(t) {
          var e;
          return (
            this[0] &&
              (g(t) && (t = t.call(this[0])),
              (e = x(t, this[0].ownerDocument)
                .eq(0)
                .clone(!0)),
              this[0].parentNode && e.insertBefore(this[0]),
              e
                .map(function() {
                  for (var t = this; t.firstElementChild; )
                    t = t.firstElementChild;
                  return t;
                })
                .append(this)),
            this
          );
        },
        wrapInner: function(t) {
          return g(t)
            ? this.each(function(e) {
                x(this).wrapInner(t.call(this, e));
              })
            : this.each(function() {
                var e = x(this),
                  n = e.contents();
                n.length ? n.wrapAll(t) : e.append(t);
              });
        },
        wrap: function(t) {
          var e = g(t);
          return this.each(function(n) {
            x(this).wrapAll(e ? t.call(this, n) : t);
          });
        },
        unwrap: function(t) {
          return (
            this.parent(t)
              .not("body")
              .each(function() {
                x(this).replaceWith(this.childNodes);
              }),
            this
          );
        }
      }),
      (x.expr.pseudos.hidden = function(t) {
        return !x.expr.pseudos.visible(t);
      }),
      (x.expr.pseudos.visible = function(t) {
        return !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
      }),
      (x.ajaxSettings.xhr = function() {
        try {
          return new t.XMLHttpRequest();
        } catch (t) {}
      });
    var Pe = { 0: 200, 1223: 204 },
      qe = x.ajaxSettings.xhr();
    (p.cors = !!qe && "withCredentials" in qe),
      (p.ajax = qe = !!qe),
      x.ajaxTransport(function(e) {
        var n, r;
        if (p.cors || (qe && !e.crossDomain))
          return {
            send: function(i, o) {
              var a,
                s = e.xhr();
              if (
                (s.open(e.type, e.url, e.async, e.username, e.password),
                e.xhrFields)
              )
                for (a in e.xhrFields) s[a] = e.xhrFields[a];
              for (a in (e.mimeType &&
                s.overrideMimeType &&
                s.overrideMimeType(e.mimeType),
              e.crossDomain ||
                i["X-Requested-With"] ||
                (i["X-Requested-With"] = "XMLHttpRequest"),
              i))
                s.setRequestHeader(a, i[a]);
              (n = function(t) {
                return function() {
                  n &&
                    ((n = r = s.onload = s.onerror = s.onabort = s.ontimeout = s.onreadystatechange = null),
                    "abort" === t
                      ? s.abort()
                      : "error" === t
                        ? "number" != typeof s.status
                          ? o(0, "error")
                          : o(s.status, s.statusText)
                        : o(
                            Pe[s.status] || s.status,
                            s.statusText,
                            "text" !== (s.responseType || "text") ||
                            "string" != typeof s.responseText
                              ? { binary: s.response }
                              : { text: s.responseText },
                            s.getAllResponseHeaders()
                          ));
                };
              }),
                (s.onload = n()),
                (r = s.onerror = s.ontimeout = n("error")),
                void 0 !== s.onabort
                  ? (s.onabort = r)
                  : (s.onreadystatechange = function() {
                      4 === s.readyState &&
                        t.setTimeout(function() {
                          n && r();
                        });
                    }),
                (n = n("abort"));
              try {
                s.send((e.hasContent && e.data) || null);
              } catch (t) {
                if (n) throw t;
              }
            },
            abort: function() {
              n && n();
            }
          };
      }),
      x.ajaxPrefilter(function(t) {
        t.crossDomain && (t.contents.script = !1);
      }),
      x.ajaxSetup({
        accepts: {
          script:
            "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: { script: /\b(?:java|ecma)script\b/ },
        converters: {
          "text script": function(t) {
            return x.globalEval(t), t;
          }
        }
      }),
      x.ajaxPrefilter("script", function(t) {
        void 0 === t.cache && (t.cache = !1), t.crossDomain && (t.type = "GET");
      }),
      x.ajaxTransport("script", function(t) {
        var e, n;
        if (t.crossDomain)
          return {
            send: function(i, o) {
              (e = x("<script>")
                .prop({ charset: t.scriptCharset, src: t.url })
                .on(
                  "load error",
                  (n = function(t) {
                    e.remove(),
                      (n = null),
                      t && o("error" === t.type ? 404 : 200, t.type);
                  })
                )),
                r.head.appendChild(e[0]);
            },
            abort: function() {
              n && n();
            }
          };
      });
    var _e,
      He = [],
      Ue = /(=)\?(?=&|$)|\?\?/;
    x.ajaxSetup({
      jsonp: "callback",
      jsonpCallback: function() {
        var t = He.pop() || x.expando + "_" + be++;
        return (this[t] = !0), t;
      }
    }),
      x.ajaxPrefilter("json jsonp", function(e, n, r) {
        var i,
          o,
          a,
          s =
            !1 !== e.jsonp &&
            (Ue.test(e.url)
              ? "url"
              : "string" == typeof e.data &&
                0 ===
                  (e.contentType || "").indexOf(
                    "application/x-www-form-urlencoded"
                  ) &&
                Ue.test(e.data) &&
                "data");
        if (s || "jsonp" === e.dataTypes[0])
          return (
            (i = e.jsonpCallback = g(e.jsonpCallback)
              ? e.jsonpCallback()
              : e.jsonpCallback),
            s
              ? (e[s] = e[s].replace(Ue, "$1" + i))
              : !1 !== e.jsonp &&
                (e.url += (xe.test(e.url) ? "&" : "?") + e.jsonp + "=" + i),
            (e.converters["script json"] = function() {
              return a || x.error(i + " was not called"), a[0];
            }),
            (e.dataTypes[0] = "json"),
            (o = t[i]),
            (t[i] = function() {
              a = arguments;
            }),
            r.always(function() {
              void 0 === o ? x(t).removeProp(i) : (t[i] = o),
                e[i] && ((e.jsonpCallback = n.jsonpCallback), He.push(i)),
                a && g(o) && o(a[0]),
                (a = o = void 0);
            }),
            "script"
          );
      }),
      (p.createHTMLDocument = (((_e = r.implementation.createHTMLDocument("")
        .body).innerHTML = "<form></form><form></form>"),
      2 === _e.childNodes.length)),
      (x.parseHTML = function(t, e, n) {
        return "string" != typeof t
          ? []
          : ("boolean" == typeof e && ((n = e), (e = !1)),
            e ||
              (p.createHTMLDocument
                ? (((i = (e = r.implementation.createHTMLDocument(
                    ""
                  )).createElement("base")).href = r.location.href),
                  e.head.appendChild(i))
                : (e = r)),
            (o = F.exec(t)),
            (a = !n && []),
            o
              ? [e.createElement(o[1])]
              : ((o = yt([t], e, a)),
                a && a.length && x(a).remove(),
                x.merge([], o.childNodes)));
        var i, o, a;
      }),
      (x.fn.load = function(t, e, n) {
        var r,
          i,
          o,
          a = this,
          s = t.indexOf(" ");
        return (
          s > -1 && ((r = he(t.slice(s))), (t = t.slice(0, s))),
          g(e)
            ? ((n = e), (e = void 0))
            : e && "object" == typeof e && (i = "POST"),
          a.length > 0 &&
            x
              .ajax({ url: t, type: i || "GET", dataType: "html", data: e })
              .done(function(t) {
                (o = arguments),
                  a.html(
                    r
                      ? x("<div>")
                          .append(x.parseHTML(t))
                          .find(r)
                      : t
                  );
              })
              .always(
                n &&
                  function(t, e) {
                    a.each(function() {
                      n.apply(this, o || [t.responseText, e, t]);
                    });
                  }
              ),
          this
        );
      }),
      x.each(
        [
          "ajaxStart",
          "ajaxStop",
          "ajaxComplete",
          "ajaxError",
          "ajaxSuccess",
          "ajaxSend"
        ],
        function(t, e) {
          x.fn[e] = function(t) {
            return this.on(e, t);
          };
        }
      ),
      (x.expr.pseudos.animated = function(t) {
        return x.grep(x.timers, function(e) {
          return t === e.elem;
        }).length;
      }),
      (x.offset = {
        setOffset: function(t, e, n) {
          var r,
            i,
            o,
            a,
            s,
            l,
            u = x.css(t, "position"),
            c = x(t),
            f = {};
          "static" === u && (t.style.position = "relative"),
            (s = c.offset()),
            (o = x.css(t, "top")),
            (l = x.css(t, "left")),
            ("absolute" === u || "fixed" === u) && (o + l).indexOf("auto") > -1
              ? ((a = (r = c.position()).top), (i = r.left))
              : ((a = parseFloat(o) || 0), (i = parseFloat(l) || 0)),
            g(e) && (e = e.call(t, n, x.extend({}, s))),
            null != e.top && (f.top = e.top - s.top + a),
            null != e.left && (f.left = e.left - s.left + i),
            "using" in e ? e.using.call(t, f) : c.css(f);
        }
      }),
      x.fn.extend({
        offset: function(t) {
          if (arguments.length)
            return void 0 === t
              ? this
              : this.each(function(e) {
                  x.offset.setOffset(this, t, e);
                });
          var e,
            n,
            r = this[0];
          return r
            ? r.getClientRects().length
              ? ((e = r.getBoundingClientRect()),
                (n = r.ownerDocument.defaultView),
                { top: e.top + n.pageYOffset, left: e.left + n.pageXOffset })
              : { top: 0, left: 0 }
            : void 0;
        },
        position: function() {
          if (this[0]) {
            var t,
              e,
              n,
              r = this[0],
              i = { top: 0, left: 0 };
            if ("fixed" === x.css(r, "position")) e = r.getBoundingClientRect();
            else {
              for (
                e = this.offset(),
                  n = r.ownerDocument,
                  t = r.offsetParent || n.documentElement;
                t &&
                (t === n.body || t === n.documentElement) &&
                "static" === x.css(t, "position");

              )
                t = t.parentNode;
              t &&
                t !== r &&
                1 === t.nodeType &&
                (((i = x(t).offset()).top += x.css(t, "borderTopWidth", !0)),
                (i.left += x.css(t, "borderLeftWidth", !0)));
            }
            return {
              top: e.top - i.top - x.css(r, "marginTop", !0),
              left: e.left - i.left - x.css(r, "marginLeft", !0)
            };
          }
        },
        offsetParent: function() {
          return this.map(function() {
            for (
              var t = this.offsetParent;
              t && "static" === x.css(t, "position");

            )
              t = t.offsetParent;
            return t || bt;
          });
        }
      }),
      x.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(
        t,
        e
      ) {
        var n = "pageYOffset" === e;
        x.fn[t] = function(r) {
          return H(
            this,
            function(t, r, i) {
              var o;
              if (
                (v(t) ? (o = t) : 9 === t.nodeType && (o = t.defaultView),
                void 0 === i)
              )
                return o ? o[e] : t[r];
              o
                ? o.scrollTo(n ? o.pageXOffset : i, n ? i : o.pageYOffset)
                : (t[r] = i);
            },
            t,
            r,
            arguments.length
          );
        };
      }),
      x.each(["top", "left"], function(t, e) {
        x.cssHooks[e] = _t(p.pixelPosition, function(t, n) {
          if (n)
            return (n = qt(t, e)), Mt.test(n) ? x(t).position()[e] + "px" : n;
        });
      }),
      x.each({ Height: "height", Width: "width" }, function(t, e) {
        x.each({ padding: "inner" + t, content: e, "": "outer" + t }, function(
          n,
          r
        ) {
          x.fn[r] = function(i, o) {
            var a = arguments.length && (n || "boolean" != typeof i),
              s = n || (!0 === i || !0 === o ? "margin" : "border");
            return H(
              this,
              function(e, n, i) {
                var o;
                return v(e)
                  ? 0 === r.indexOf("outer")
                    ? e["inner" + t]
                    : e.document.documentElement["client" + t]
                  : 9 === e.nodeType
                    ? ((o = e.documentElement),
                      Math.max(
                        e.body["scroll" + t],
                        o["scroll" + t],
                        e.body["offset" + t],
                        o["offset" + t],
                        o["client" + t]
                      ))
                    : void 0 === i
                      ? x.css(e, n, s)
                      : x.style(e, n, i, s);
              },
              e,
              a ? i : void 0,
              a
            );
          };
        });
      }),
      x.each(
        "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(
          " "
        ),
        function(t, e) {
          x.fn[e] = function(t, n) {
            return arguments.length > 0
              ? this.on(e, null, t, n)
              : this.trigger(e);
          };
        }
      ),
      x.fn.extend({
        hover: function(t, e) {
          return this.mouseenter(t).mouseleave(e || t);
        }
      }),
      x.fn.extend({
        bind: function(t, e, n) {
          return this.on(t, null, e, n);
        },
        unbind: function(t, e) {
          return this.off(t, null, e);
        },
        delegate: function(t, e, n, r) {
          return this.on(e, t, n, r);
        },
        undelegate: function(t, e, n) {
          return 1 === arguments.length
            ? this.off(t, "**")
            : this.off(e, t || "**", n);
        }
      }),
      (x.proxy = function(t, e) {
        var n, r, i;
        if (("string" == typeof e && ((n = t[e]), (e = t), (t = n)), g(t)))
          return (
            (r = o.call(arguments, 2)),
            ((i = function() {
              return t.apply(e || this, r.concat(o.call(arguments)));
            }).guid = t.guid = t.guid || x.guid++),
            i
          );
      }),
      (x.holdReady = function(t) {
        t ? x.readyWait++ : x.ready(!0);
      }),
      (x.isArray = Array.isArray),
      (x.parseJSON = JSON.parse),
      (x.nodeName = A),
      (x.isFunction = g),
      (x.isWindow = v),
      (x.camelCase = z),
      (x.type = b),
      (x.now = Date.now),
      (x.isNumeric = function(t) {
        var e = x.type(t);
        return ("number" === e || "string" === e) && !isNaN(t - parseFloat(t));
      }),
      "function" == typeof define &&
        define.amd &&
        define("jquery", [], function() {
          return x;
        });
    var We = t.jQuery,
      Ve = t.$;
    return (
      (x.noConflict = function(e) {
        return (
          t.$ === x && (t.$ = Ve), e && t.jQuery === x && (t.jQuery = We), x
        );
      }),
      e || (t.jQuery = t.$ = x),
      x
    );
  }),
  "undefined" == typeof jQuery)
)
  throw new Error("Bootstrap's JavaScript requires jQuery");
!(function(t) {
  "use strict";
  var e = t.fn.jquery.split(" ")[0].split(".");
  if (
    (e[0] < 2 && e[1] < 9) ||
    (1 == e[0] && 9 == e[1] && e[2] < 1) ||
    e[0] > 3
  )
    throw new Error(
      "Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4"
    );
})(jQuery),
  (function(t) {
    "use strict";
    (t.fn.emulateTransitionEnd = function(e) {
      var n = !1,
        r = this;
      t(this).one("bsTransitionEnd", function() {
        n = !0;
      });
      return (
        setTimeout(function() {
          n || t(r).trigger(t.support.transition.end);
        }, e),
        this
      );
    }),
      t(function() {
        (t.support.transition = (function() {
          var t = document.createElement("bootstrap"),
            e = {
              WebkitTransition: "webkitTransitionEnd",
              MozTransition: "transitionend",
              OTransition: "oTransitionEnd otransitionend",
              transition: "transitionend"
            };
          for (var n in e) if (void 0 !== t.style[n]) return { end: e[n] };
          return !1;
        })()),
          t.support.transition &&
            (t.event.special.bsTransitionEnd = {
              bindType: t.support.transition.end,
              delegateType: t.support.transition.end,
              handle: function(e) {
                if (t(e.target).is(this))
                  return e.handleObj.handler.apply(this, arguments);
              }
            });
      });
  })(jQuery),
  (function(t) {
    "use strict";
    var e = '[data-dismiss="alert"]',
      n = function(n) {
        t(n).on("click", e, this.close);
      };
    (n.VERSION = "3.3.7"),
      (n.TRANSITION_DURATION = 150),
      (n.prototype.close = function(e) {
        function r() {
          a.detach()
            .trigger("closed.bs.alert")
            .remove();
        }
        var i = t(this),
          o = i.attr("data-target");
        o || (o = (o = i.attr("href")) && o.replace(/.*(?=#[^\s]*$)/, ""));
        var a = t("#" === o ? [] : o);
        e && e.preventDefault(),
          a.length || (a = i.closest(".alert")),
          a.trigger((e = t.Event("close.bs.alert"))),
          e.isDefaultPrevented() ||
            (a.removeClass("in"),
            t.support.transition && a.hasClass("fade")
              ? a
                  .one("bsTransitionEnd", r)
                  .emulateTransitionEnd(n.TRANSITION_DURATION)
              : r());
      });
    var r = t.fn.alert;
    (t.fn.alert = function(e) {
      return this.each(function() {
        var r = t(this),
          i = r.data("bs.alert");
        i || r.data("bs.alert", (i = new n(this))),
          "string" == typeof e && i[e].call(r);
      });
    }),
      (t.fn.alert.Constructor = n),
      (t.fn.alert.noConflict = function() {
        return (t.fn.alert = r), this;
      }),
      t(document).on("click.bs.alert.data-api", e, n.prototype.close);
  })(jQuery),
  (function(t) {
    "use strict";
    function e(e) {
      return this.each(function() {
        var r = t(this),
          i = r.data("bs.button"),
          o = "object" == typeof e && e;
        i || r.data("bs.button", (i = new n(this, o))),
          "toggle" == e ? i.toggle() : e && i.setState(e);
      });
    }
    var n = function(e, r) {
      (this.$element = t(e)),
        (this.options = t.extend({}, n.DEFAULTS, r)),
        (this.isLoading = !1);
    };
    (n.VERSION = "3.3.7"),
      (n.DEFAULTS = { loadingText: "loading..." }),
      (n.prototype.setState = function(e) {
        var n = "disabled",
          r = this.$element,
          i = r.is("input") ? "val" : "html",
          o = r.data();
        (e += "Text"),
          null == o.resetText && r.data("resetText", r[i]()),
          setTimeout(
            t.proxy(function() {
              r[i](null == o[e] ? this.options[e] : o[e]),
                "loadingText" == e
                  ? ((this.isLoading = !0),
                    r
                      .addClass(n)
                      .attr(n, n)
                      .prop(n, !0))
                  : this.isLoading &&
                    ((this.isLoading = !1),
                    r
                      .removeClass(n)
                      .removeAttr(n)
                      .prop(n, !1));
            }, this),
            0
          );
      }),
      (n.prototype.toggle = function() {
        var t = !0,
          e = this.$element.closest('[data-toggle="buttons"]');
        if (e.length) {
          var n = this.$element.find("input");
          "radio" == n.prop("type")
            ? (n.prop("checked") && (t = !1),
              e.find(".active").removeClass("active"),
              this.$element.addClass("active"))
            : "checkbox" == n.prop("type") &&
              (n.prop("checked") !== this.$element.hasClass("active") &&
                (t = !1),
              this.$element.toggleClass("active")),
            n.prop("checked", this.$element.hasClass("active")),
            t && n.trigger("change");
        } else
          this.$element.attr("aria-pressed", !this.$element.hasClass("active")),
            this.$element.toggleClass("active");
      });
    var r = t.fn.button;
    (t.fn.button = e),
      (t.fn.button.Constructor = n),
      (t.fn.button.noConflict = function() {
        return (t.fn.button = r), this;
      }),
      t(document)
        .on("click.bs.button.data-api", '[data-toggle^="button"]', function(n) {
          var r = t(n.target).closest(".btn");
          e.call(r, "toggle"),
            t(n.target).is('input[type="radio"], input[type="checkbox"]') ||
              (n.preventDefault(),
              r.is("input,button")
                ? r.trigger("focus")
                : r
                    .find("input:visible,button:visible")
                    .first()
                    .trigger("focus"));
        })
        .on(
          "focus.bs.button.data-api blur.bs.button.data-api",
          '[data-toggle^="button"]',
          function(e) {
            t(e.target)
              .closest(".btn")
              .toggleClass("focus", /^focus(in)?$/.test(e.type));
          }
        );
  })(jQuery),
  (function(t) {
    "use strict";
    function e(e) {
      return this.each(function() {
        var r = t(this),
          i = r.data("bs.carousel"),
          o = t.extend({}, n.DEFAULTS, r.data(), "object" == typeof e && e),
          a = "string" == typeof e ? e : o.slide;
        i || r.data("bs.carousel", (i = new n(this, o))),
          "number" == typeof e
            ? i.to(e)
            : a
              ? i[a]()
              : o.interval && i.pause().cycle();
      });
    }
    var n = function(e, n) {
      (this.$element = t(e)),
        (this.$indicators = this.$element.find(".carousel-indicators")),
        (this.options = n),
        (this.paused = null),
        (this.sliding = null),
        (this.interval = null),
        (this.$active = null),
        (this.$items = null),
        this.options.keyboard &&
          this.$element.on("keydown.bs.carousel", t.proxy(this.keydown, this)),
        "hover" == this.options.pause &&
          !("ontouchstart" in document.documentElement) &&
          this.$element
            .on("mouseenter.bs.carousel", t.proxy(this.pause, this))
            .on("mouseleave.bs.carousel", t.proxy(this.cycle, this));
    };
    (n.VERSION = "3.3.7"),
      (n.TRANSITION_DURATION = 600),
      (n.DEFAULTS = { interval: 5e3, pause: "hover", wrap: !0, keyboard: !0 }),
      (n.prototype.keydown = function(t) {
        if (!/input|textarea/i.test(t.target.tagName)) {
          switch (t.which) {
            case 37:
              this.prev();
              break;
            case 39:
              this.next();
              break;
            default:
              return;
          }
          t.preventDefault();
        }
      }),
      (n.prototype.cycle = function(e) {
        return (
          e || (this.paused = !1),
          this.interval && clearInterval(this.interval),
          this.options.interval &&
            !this.paused &&
            (this.interval = setInterval(
              t.proxy(this.next, this),
              this.options.interval
            )),
          this
        );
      }),
      (n.prototype.getItemIndex = function(t) {
        return (
          (this.$items = t.parent().children(".item")),
          this.$items.index(t || this.$active)
        );
      }),
      (n.prototype.getItemForDirection = function(t, e) {
        var n = this.getItemIndex(e);
        if (
          (("prev" == t && 0 === n) ||
            ("next" == t && n == this.$items.length - 1)) &&
          !this.options.wrap
        )
          return e;
        var r = (n + ("prev" == t ? -1 : 1)) % this.$items.length;
        return this.$items.eq(r);
      }),
      (n.prototype.to = function(t) {
        var e = this,
          n = this.getItemIndex(
            (this.$active = this.$element.find(".item.active"))
          );
        if (!(t > this.$items.length - 1 || t < 0))
          return this.sliding
            ? this.$element.one("slid.bs.carousel", function() {
                e.to(t);
              })
            : n == t
              ? this.pause().cycle()
              : this.slide(t > n ? "next" : "prev", this.$items.eq(t));
      }),
      (n.prototype.pause = function(e) {
        return (
          e || (this.paused = !0),
          this.$element.find(".next, .prev").length &&
            t.support.transition &&
            (this.$element.trigger(t.support.transition.end), this.cycle(!0)),
          (this.interval = clearInterval(this.interval)),
          this
        );
      }),
      (n.prototype.next = function() {
        if (!this.sliding) return this.slide("next");
      }),
      (n.prototype.prev = function() {
        if (!this.sliding) return this.slide("prev");
      }),
      (n.prototype.slide = function(e, r) {
        var i = this.$element.find(".item.active"),
          o = r || this.getItemForDirection(e, i),
          a = this.interval,
          s = "next" == e ? "left" : "right",
          l = this;
        if (o.hasClass("active")) return (this.sliding = !1);
        var u = o[0],
          c = t.Event("slide.bs.carousel", { relatedTarget: u, direction: s });
        if ((this.$element.trigger(c), !c.isDefaultPrevented())) {
          if (
            ((this.sliding = !0), a && this.pause(), this.$indicators.length)
          ) {
            this.$indicators.find(".active").removeClass("active");
            var f = t(this.$indicators.children()[this.getItemIndex(o)]);
            f && f.addClass("active");
          }
          var h = t.Event("slid.bs.carousel", {
            relatedTarget: u,
            direction: s
          });
          return (
            t.support.transition && this.$element.hasClass("slide")
              ? (o.addClass(e),
                o[0].offsetWidth,
                i.addClass(s),
                o.addClass(s),
                i
                  .one("bsTransitionEnd", function() {
                    o.removeClass([e, s].join(" ")).addClass("active"),
                      i.removeClass(["active", s].join(" ")),
                      (l.sliding = !1),
                      setTimeout(function() {
                        l.$element.trigger(h);
                      }, 0);
                  })
                  .emulateTransitionEnd(n.TRANSITION_DURATION))
              : (i.removeClass("active"),
                o.addClass("active"),
                (this.sliding = !1),
                this.$element.trigger(h)),
            a && this.cycle(),
            this
          );
        }
      });
    var r = t.fn.carousel;
    (t.fn.carousel = e),
      (t.fn.carousel.Constructor = n),
      (t.fn.carousel.noConflict = function() {
        return (t.fn.carousel = r), this;
      });
    var i = function(n) {
      var r,
        i = t(this),
        o = t(
          i.attr("data-target") ||
            ((r = i.attr("href")) && r.replace(/.*(?=#[^\s]+$)/, ""))
        );
      if (o.hasClass("carousel")) {
        var a = t.extend({}, o.data(), i.data()),
          s = i.attr("data-slide-to");
        s && (a.interval = !1),
          e.call(o, a),
          s && o.data("bs.carousel").to(s),
          n.preventDefault();
      }
    };
    t(document)
      .on("click.bs.carousel.data-api", "[data-slide]", i)
      .on("click.bs.carousel.data-api", "[data-slide-to]", i),
      t(window).on("load", function() {
        t('[data-ride="carousel"]').each(function() {
          var n = t(this);
          e.call(n, n.data());
        });
      });
  })(jQuery),
  (function(t) {
    "use strict";
    function e(e) {
      var n,
        r =
          e.attr("data-target") ||
          ((n = e.attr("href")) && n.replace(/.*(?=#[^\s]+$)/, ""));
      return t(r);
    }
    function n(e) {
      return this.each(function() {
        var n = t(this),
          i = n.data("bs.collapse"),
          o = t.extend({}, r.DEFAULTS, n.data(), "object" == typeof e && e);
        !i && o.toggle && /show|hide/.test(e) && (o.toggle = !1),
          i || n.data("bs.collapse", (i = new r(this, o))),
          "string" == typeof e && i[e]();
      });
    }
    var r = function(e, n) {
      (this.$element = t(e)),
        (this.options = t.extend({}, r.DEFAULTS, n)),
        (this.$trigger = t(
          '[data-toggle="collapse"][href="#' +
            e.id +
            '"],[data-toggle="collapse"][data-target="#' +
            e.id +
            '"]'
        )),
        (this.transitioning = null),
        this.options.parent
          ? (this.$parent = this.getParent())
          : this.addAriaAndCollapsedClass(this.$element, this.$trigger),
        this.options.toggle && this.toggle();
    };
    (r.VERSION = "3.3.7"),
      (r.TRANSITION_DURATION = 350),
      (r.DEFAULTS = { toggle: !0 }),
      (r.prototype.dimension = function() {
        return this.$element.hasClass("width") ? "width" : "height";
      }),
      (r.prototype.show = function() {
        if (!this.transitioning && !this.$element.hasClass("in")) {
          var e,
            i =
              this.$parent &&
              this.$parent.children(".panel").children(".in, .collapsing");
          if (
            !(
              i &&
              i.length &&
              ((e = i.data("bs.collapse")), e && e.transitioning)
            )
          ) {
            var o = t.Event("show.bs.collapse");
            if ((this.$element.trigger(o), !o.isDefaultPrevented())) {
              i &&
                i.length &&
                (n.call(i, "hide"), e || i.data("bs.collapse", null));
              var a = this.dimension();
              this.$element
                .removeClass("collapse")
                .addClass("collapsing")
                [a](0)
                .attr("aria-expanded", !0),
                this.$trigger
                  .removeClass("collapsed")
                  .attr("aria-expanded", !0),
                (this.transitioning = 1);
              var s = function() {
                this.$element
                  .removeClass("collapsing")
                  .addClass("collapse in")
                  [a](""),
                  (this.transitioning = 0),
                  this.$element.trigger("shown.bs.collapse");
              };
              if (!t.support.transition) return s.call(this);
              var l = t.camelCase(["scroll", a].join("-"));
              this.$element
                .one("bsTransitionEnd", t.proxy(s, this))
                .emulateTransitionEnd(r.TRANSITION_DURATION)
                [a](this.$element[0][l]);
            }
          }
        }
      }),
      (r.prototype.hide = function() {
        if (!this.transitioning && this.$element.hasClass("in")) {
          var e = t.Event("hide.bs.collapse");
          if ((this.$element.trigger(e), !e.isDefaultPrevented())) {
            var n = this.dimension();
            this.$element[n](this.$element[n]())[0].offsetHeight,
              this.$element
                .addClass("collapsing")
                .removeClass("collapse in")
                .attr("aria-expanded", !1),
              this.$trigger.addClass("collapsed").attr("aria-expanded", !1),
              (this.transitioning = 1);
            var i = function() {
              (this.transitioning = 0),
                this.$element
                  .removeClass("collapsing")
                  .addClass("collapse")
                  .trigger("hidden.bs.collapse");
            };
            return t.support.transition
              ? void this.$element[n](0)
                  .one("bsTransitionEnd", t.proxy(i, this))
                  .emulateTransitionEnd(r.TRANSITION_DURATION)
              : i.call(this);
          }
        }
      }),
      (r.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide" : "show"]();
      }),
      (r.prototype.getParent = function() {
        return t(this.options.parent)
          .find(
            '[data-toggle="collapse"][data-parent="' +
              this.options.parent +
              '"]'
          )
          .each(
            t.proxy(function(n, r) {
              var i = t(r);
              this.addAriaAndCollapsedClass(e(i), i);
            }, this)
          )
          .end();
      }),
      (r.prototype.addAriaAndCollapsedClass = function(t, e) {
        var n = t.hasClass("in");
        t.attr("aria-expanded", n),
          e.toggleClass("collapsed", !n).attr("aria-expanded", n);
      });
    var i = t.fn.collapse;
    (t.fn.collapse = n),
      (t.fn.collapse.Constructor = r),
      (t.fn.collapse.noConflict = function() {
        return (t.fn.collapse = i), this;
      }),
      t(document).on(
        "click.bs.collapse.data-api",
        '[data-toggle="collapse"]',
        function(r) {
          var i = t(this);
          i.attr("data-target") || r.preventDefault();
          var o = e(i),
            a = o.data("bs.collapse") ? "toggle" : i.data();
          n.call(o, a);
        }
      );
  })(jQuery),
  (function(t) {
    "use strict";
    function e(e) {
      var n = e.attr("data-target");
      n ||
        (n =
          (n = e.attr("href")) &&
          /#[A-Za-z]/.test(n) &&
          n.replace(/.*(?=#[^\s]*$)/, ""));
      var r = n && t(n);
      return r && r.length ? r : e.parent();
    }
    function n(n) {
      (n && 3 === n.which) ||
        (t(r).remove(),
        t(i).each(function() {
          var r = t(this),
            i = e(r),
            o = { relatedTarget: this };
          i.hasClass("open") &&
            ((n &&
              "click" == n.type &&
              /input|textarea/i.test(n.target.tagName) &&
              t.contains(i[0], n.target)) ||
              (i.trigger((n = t.Event("hide.bs.dropdown", o))),
              n.isDefaultPrevented() ||
                (r.attr("aria-expanded", "false"),
                i
                  .removeClass("open")
                  .trigger(t.Event("hidden.bs.dropdown", o)))));
        }));
    }
    var r = ".dropdown-backdrop",
      i = '[data-toggle="dropdown"]',
      o = function(e) {
        t(e).on("click.bs.dropdown", this.toggle);
      };
    (o.VERSION = "3.3.7"),
      (o.prototype.toggle = function(r) {
        var i = t(this);
        if (!i.is(".disabled, :disabled")) {
          var o = e(i),
            a = o.hasClass("open");
          if ((n(), !a)) {
            "ontouchstart" in document.documentElement &&
              !o.closest(".navbar-nav").length &&
              t(document.createElement("div"))
                .addClass("dropdown-backdrop")
                .insertAfter(t(this))
                .on("click", n);
            var s = { relatedTarget: this };
            if (
              (o.trigger((r = t.Event("show.bs.dropdown", s))),
              r.isDefaultPrevented())
            )
              return;
            i.trigger("focus").attr("aria-expanded", "true"),
              o.toggleClass("open").trigger(t.Event("shown.bs.dropdown", s));
          }
          return !1;
        }
      }),
      (o.prototype.keydown = function(n) {
        if (
          /(38|40|27|32)/.test(n.which) &&
          !/input|textarea/i.test(n.target.tagName)
        ) {
          var r = t(this);
          if (
            (n.preventDefault(),
            n.stopPropagation(),
            !r.is(".disabled, :disabled"))
          ) {
            var o = e(r),
              a = o.hasClass("open");
            if ((!a && 27 != n.which) || (a && 27 == n.which))
              return (
                27 == n.which && o.find(i).trigger("focus"), r.trigger("click")
              );
            var s = o.find(".dropdown-menu li:not(.disabled):visible a");
            if (s.length) {
              var l = s.index(n.target);
              38 == n.which && l > 0 && l--,
                40 == n.which && l < s.length - 1 && l++,
                ~l || (l = 0),
                s.eq(l).trigger("focus");
            }
          }
        }
      });
    var a = t.fn.dropdown;
    (t.fn.dropdown = function(e) {
      return this.each(function() {
        var n = t(this),
          r = n.data("bs.dropdown");
        r || n.data("bs.dropdown", (r = new o(this))),
          "string" == typeof e && r[e].call(n);
      });
    }),
      (t.fn.dropdown.Constructor = o),
      (t.fn.dropdown.noConflict = function() {
        return (t.fn.dropdown = a), this;
      }),
      t(document)
        .on("click.bs.dropdown.data-api", n)
        .on("click.bs.dropdown.data-api", ".dropdown form", function(t) {
          t.stopPropagation();
        })
        .on("click.bs.dropdown.data-api", i, o.prototype.toggle)
        .on("keydown.bs.dropdown.data-api", i, o.prototype.keydown)
        .on(
          "keydown.bs.dropdown.data-api",
          ".dropdown-menu",
          o.prototype.keydown
        );
  })(jQuery),
  (function(t) {
    "use strict";
    function e(e, r) {
      return this.each(function() {
        var i = t(this),
          o = i.data("bs.modal"),
          a = t.extend({}, n.DEFAULTS, i.data(), "object" == typeof e && e);
        o || i.data("bs.modal", (o = new n(this, a))),
          "string" == typeof e ? o[e](r) : a.show && o.show(r);
      });
    }
    var n = function(e, n) {
      (this.options = n),
        (this.$body = t(document.body)),
        (this.$element = t(e)),
        (this.$dialog = this.$element.find(".modal-dialog")),
        (this.$backdrop = null),
        (this.isShown = null),
        (this.originalBodyPad = null),
        (this.scrollbarWidth = 0),
        (this.ignoreBackdropClick = !1),
        this.options.remote &&
          this.$element.find(".modal-content").load(
            this.options.remote,
            t.proxy(function() {
              this.$element.trigger("loaded.bs.modal");
            }, this)
          );
    };
    (n.VERSION = "3.3.7"),
      (n.TRANSITION_DURATION = 300),
      (n.BACKDROP_TRANSITION_DURATION = 150),
      (n.DEFAULTS = { backdrop: !0, keyboard: !0, show: !0 }),
      (n.prototype.toggle = function(t) {
        return this.isShown ? this.hide() : this.show(t);
      }),
      (n.prototype.show = function(e) {
        var r = this,
          i = t.Event("show.bs.modal", { relatedTarget: e });
        this.$element.trigger(i),
          this.isShown ||
            i.isDefaultPrevented() ||
            ((this.isShown = !0),
            this.checkScrollbar(),
            this.setScrollbar(),
            this.$body.addClass("modal-open"),
            this.escape(),
            this.resize(),
            this.$element.on(
              "click.dismiss.bs.modal",
              '[data-dismiss="modal"]',
              t.proxy(this.hide, this)
            ),
            this.$dialog.on("mousedown.dismiss.bs.modal", function() {
              r.$element.one("mouseup.dismiss.bs.modal", function(e) {
                t(e.target).is(r.$element) && (r.ignoreBackdropClick = !0);
              });
            }),
            this.backdrop(function() {
              var i = t.support.transition && r.$element.hasClass("fade");
              r.$element.parent().length || r.$element.appendTo(r.$body),
                r.$element.show().scrollTop(0),
                r.adjustDialog(),
                i && r.$element[0].offsetWidth,
                r.$element.addClass("in"),
                r.enforceFocus();
              var o = t.Event("shown.bs.modal", { relatedTarget: e });
              i
                ? r.$dialog
                    .one("bsTransitionEnd", function() {
                      r.$element.trigger("focus").trigger(o);
                    })
                    .emulateTransitionEnd(n.TRANSITION_DURATION)
                : r.$element.trigger("focus").trigger(o);
            }));
      }),
      (n.prototype.hide = function(e) {
        e && e.preventDefault(),
          (e = t.Event("hide.bs.modal")),
          this.$element.trigger(e),
          this.isShown &&
            !e.isDefaultPrevented() &&
            ((this.isShown = !1),
            this.escape(),
            this.resize(),
            t(document).off("focusin.bs.modal"),
            this.$element
              .removeClass("in")
              .off("click.dismiss.bs.modal")
              .off("mouseup.dismiss.bs.modal"),
            this.$dialog.off("mousedown.dismiss.bs.modal"),
            t.support.transition && this.$element.hasClass("fade")
              ? this.$element
                  .one("bsTransitionEnd", t.proxy(this.hideModal, this))
                  .emulateTransitionEnd(n.TRANSITION_DURATION)
              : this.hideModal());
      }),
      (n.prototype.enforceFocus = function() {
        t(document)
          .off("focusin.bs.modal")
          .on(
            "focusin.bs.modal",
            t.proxy(function(t) {
              document === t.target ||
                this.$element[0] === t.target ||
                this.$element.has(t.target).length ||
                this.$element.trigger("focus");
            }, this)
          );
      }),
      (n.prototype.escape = function() {
        this.isShown && this.options.keyboard
          ? this.$element.on(
              "keydown.dismiss.bs.modal",
              t.proxy(function(t) {
                27 == t.which && this.hide();
              }, this)
            )
          : this.isShown || this.$element.off("keydown.dismiss.bs.modal");
      }),
      (n.prototype.resize = function() {
        this.isShown
          ? t(window).on("resize.bs.modal", t.proxy(this.handleUpdate, this))
          : t(window).off("resize.bs.modal");
      }),
      (n.prototype.hideModal = function() {
        var t = this;
        this.$element.hide(),
          this.backdrop(function() {
            t.$body.removeClass("modal-open"),
              t.resetAdjustments(),
              t.resetScrollbar(),
              t.$element.trigger("hidden.bs.modal");
          });
      }),
      (n.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove(), (this.$backdrop = null);
      }),
      (n.prototype.backdrop = function(e) {
        var r = this,
          i = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
          var o = t.support.transition && i;
          if (
            ((this.$backdrop = t(document.createElement("div"))
              .addClass("modal-backdrop " + i)
              .appendTo(this.$body)),
            this.$element.on(
              "click.dismiss.bs.modal",
              t.proxy(function(t) {
                return this.ignoreBackdropClick
                  ? void (this.ignoreBackdropClick = !1)
                  : void (
                      t.target === t.currentTarget &&
                      ("static" == this.options.backdrop
                        ? this.$element[0].focus()
                        : this.hide())
                    );
              }, this)
            ),
            o && this.$backdrop[0].offsetWidth,
            this.$backdrop.addClass("in"),
            !e)
          )
            return;
          o
            ? this.$backdrop
                .one("bsTransitionEnd", e)
                .emulateTransitionEnd(n.BACKDROP_TRANSITION_DURATION)
            : e();
        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass("in");
          var a = function() {
            r.removeBackdrop(), e && e();
          };
          t.support.transition && this.$element.hasClass("fade")
            ? this.$backdrop
                .one("bsTransitionEnd", a)
                .emulateTransitionEnd(n.BACKDROP_TRANSITION_DURATION)
            : a();
        } else e && e();
      }),
      (n.prototype.handleUpdate = function() {
        this.adjustDialog();
      }),
      (n.prototype.adjustDialog = function() {
        var t =
          this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
          paddingLeft: !this.bodyIsOverflowing && t ? this.scrollbarWidth : "",
          paddingRight: this.bodyIsOverflowing && !t ? this.scrollbarWidth : ""
        });
      }),
      (n.prototype.resetAdjustments = function() {
        this.$element.css({ paddingLeft: "", paddingRight: "" });
      }),
      (n.prototype.checkScrollbar = function() {
        var t = window.innerWidth;
        if (!t) {
          var e = document.documentElement.getBoundingClientRect();
          t = e.right - Math.abs(e.left);
        }
        (this.bodyIsOverflowing = document.body.clientWidth < t),
          (this.scrollbarWidth = this.measureScrollbar());
      }),
      (n.prototype.setScrollbar = function() {
        var t = parseInt(this.$body.css("padding-right") || 0, 10);
        (this.originalBodyPad = document.body.style.paddingRight || ""),
          this.bodyIsOverflowing &&
            this.$body.css("padding-right", t + this.scrollbarWidth);
      }),
      (n.prototype.resetScrollbar = function() {
        this.$body.css("padding-right", this.originalBodyPad);
      }),
      (n.prototype.measureScrollbar = function() {
        var t = document.createElement("div");
        (t.className = "modal-scrollbar-measure"), this.$body.append(t);
        var e = t.offsetWidth - t.clientWidth;
        return this.$body[0].removeChild(t), e;
      });
    var r = t.fn.modal;
    (t.fn.modal = e),
      (t.fn.modal.Constructor = n),
      (t.fn.modal.noConflict = function() {
        return (t.fn.modal = r), this;
      }),
      t(document).on(
        "click.bs.modal.data-api",
        '[data-toggle="modal"]',
        function(n) {
          var r = t(this),
            i = r.attr("href"),
            o = t(
              r.attr("data-target") || (i && i.replace(/.*(?=#[^\s]+$)/, ""))
            ),
            a = o.data("bs.modal")
              ? "toggle"
              : t.extend({ remote: !/#/.test(i) && i }, o.data(), r.data());
          r.is("a") && n.preventDefault(),
            o.one("show.bs.modal", function(t) {
              t.isDefaultPrevented() ||
                o.one("hidden.bs.modal", function() {
                  r.is(":visible") && r.trigger("focus");
                });
            }),
            e.call(o, a, this);
        }
      );
  })(jQuery),
  (function(t) {
    "use strict";
    var e = function(t, e) {
      (this.type = null),
        (this.options = null),
        (this.enabled = null),
        (this.timeout = null),
        (this.hoverState = null),
        (this.$element = null),
        (this.inState = null),
        this.init("tooltip", t, e);
    };
    (e.VERSION = "3.3.7"),
      (e.TRANSITION_DURATION = 150),
      (e.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template:
          '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1,
        viewport: { selector: "body", padding: 0 }
      }),
      (e.prototype.init = function(e, n, r) {
        if (
          ((this.enabled = !0),
          (this.type = e),
          (this.$element = t(n)),
          (this.options = this.getOptions(r)),
          (this.$viewport =
            this.options.viewport &&
            t(
              t.isFunction(this.options.viewport)
                ? this.options.viewport.call(this, this.$element)
                : this.options.viewport.selector || this.options.viewport
            )),
          (this.inState = { click: !1, hover: !1, focus: !1 }),
          this.$element[0] instanceof document.constructor &&
            !this.options.selector)
        )
          throw new Error(
            "`selector` option must be specified when initializing " +
              this.type +
              " on the window.document object!"
          );
        for (var i = this.options.trigger.split(" "), o = i.length; o--; ) {
          var a = i[o];
          if ("click" == a)
            this.$element.on(
              "click." + this.type,
              this.options.selector,
              t.proxy(this.toggle, this)
            );
          else if ("manual" != a) {
            var s = "hover" == a ? "mouseenter" : "focusin",
              l = "hover" == a ? "mouseleave" : "focusout";
            this.$element.on(
              s + "." + this.type,
              this.options.selector,
              t.proxy(this.enter, this)
            ),
              this.$element.on(
                l + "." + this.type,
                this.options.selector,
                t.proxy(this.leave, this)
              );
          }
        }
        this.options.selector
          ? (this._options = t.extend({}, this.options, {
              trigger: "manual",
              selector: ""
            }))
          : this.fixTitle();
      }),
      (e.prototype.getDefaults = function() {
        return e.DEFAULTS;
      }),
      (e.prototype.getOptions = function(e) {
        return (
          (e = t.extend({}, this.getDefaults(), this.$element.data(), e))
            .delay &&
            "number" == typeof e.delay &&
            (e.delay = { show: e.delay, hide: e.delay }),
          e
        );
      }),
      (e.prototype.getDelegateOptions = function() {
        var e = {},
          n = this.getDefaults();
        return (
          this._options &&
            t.each(this._options, function(t, r) {
              n[t] != r && (e[t] = r);
            }),
          e
        );
      }),
      (e.prototype.enter = function(e) {
        var n =
          e instanceof this.constructor
            ? e
            : t(e.currentTarget).data("bs." + this.type);
        return (
          n ||
            ((n = new this.constructor(
              e.currentTarget,
              this.getDelegateOptions()
            )),
            t(e.currentTarget).data("bs." + this.type, n)),
          e instanceof t.Event &&
            (n.inState["focusin" == e.type ? "focus" : "hover"] = !0),
          n.tip().hasClass("in") || "in" == n.hoverState
            ? void (n.hoverState = "in")
            : (clearTimeout(n.timeout),
              (n.hoverState = "in"),
              n.options.delay && n.options.delay.show
                ? void (n.timeout = setTimeout(function() {
                    "in" == n.hoverState && n.show();
                  }, n.options.delay.show))
                : n.show())
        );
      }),
      (e.prototype.isInStateTrue = function() {
        for (var t in this.inState) if (this.inState[t]) return !0;
        return !1;
      }),
      (e.prototype.leave = function(e) {
        var n =
          e instanceof this.constructor
            ? e
            : t(e.currentTarget).data("bs." + this.type);
        if (
          (n ||
            ((n = new this.constructor(
              e.currentTarget,
              this.getDelegateOptions()
            )),
            t(e.currentTarget).data("bs." + this.type, n)),
          e instanceof t.Event &&
            (n.inState["focusout" == e.type ? "focus" : "hover"] = !1),
          !n.isInStateTrue())
        )
          return (
            clearTimeout(n.timeout),
            (n.hoverState = "out"),
            n.options.delay && n.options.delay.hide
              ? void (n.timeout = setTimeout(function() {
                  "out" == n.hoverState && n.hide();
                }, n.options.delay.hide))
              : n.hide()
          );
      }),
      (e.prototype.show = function() {
        var n = t.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
          this.$element.trigger(n);
          var r = t.contains(
            this.$element[0].ownerDocument.documentElement,
            this.$element[0]
          );
          if (n.isDefaultPrevented() || !r) return;
          var i = this,
            o = this.tip(),
            a = this.getUID(this.type);
          this.setContent(),
            o.attr("id", a),
            this.$element.attr("aria-describedby", a),
            this.options.animation && o.addClass("fade");
          var s =
              "function" == typeof this.options.placement
                ? this.options.placement.call(this, o[0], this.$element[0])
                : this.options.placement,
            l = /\s?auto?\s?/i,
            u = l.test(s);
          u && (s = s.replace(l, "") || "top"),
            o
              .detach()
              .css({ top: 0, left: 0, display: "block" })
              .addClass(s)
              .data("bs." + this.type, this),
            this.options.container
              ? o.appendTo(this.options.container)
              : o.insertAfter(this.$element),
            this.$element.trigger("inserted.bs." + this.type);
          var c = this.getPosition(),
            f = o[0].offsetWidth,
            h = o[0].offsetHeight;
          if (u) {
            var d = s,
              p = this.getPosition(this.$viewport);
            (s =
              "bottom" == s && c.bottom + h > p.bottom
                ? "top"
                : "top" == s && c.top - h < p.top
                  ? "bottom"
                  : "right" == s && c.right + f > p.width
                    ? "left"
                    : "left" == s && c.left - f < p.left
                      ? "right"
                      : s),
              o.removeClass(d).addClass(s);
          }
          var g = this.getCalculatedOffset(s, c, f, h);
          this.applyPlacement(g, s);
          var v = function() {
            var t = i.hoverState;
            i.$element.trigger("shown.bs." + i.type),
              (i.hoverState = null),
              "out" == t && i.leave(i);
          };
          t.support.transition && this.$tip.hasClass("fade")
            ? o
                .one("bsTransitionEnd", v)
                .emulateTransitionEnd(e.TRANSITION_DURATION)
            : v();
        }
      }),
      (e.prototype.applyPlacement = function(e, n) {
        var r = this.tip(),
          i = r[0].offsetWidth,
          o = r[0].offsetHeight,
          a = parseInt(r.css("margin-top"), 10),
          s = parseInt(r.css("margin-left"), 10);
        isNaN(a) && (a = 0),
          isNaN(s) && (s = 0),
          (e.top += a),
          (e.left += s),
          t.offset.setOffset(
            r[0],
            t.extend(
              {
                using: function(t) {
                  r.css({ top: Math.round(t.top), left: Math.round(t.left) });
                }
              },
              e
            ),
            0
          ),
          r.addClass("in");
        var l = r[0].offsetWidth,
          u = r[0].offsetHeight;
        "top" == n && u != o && (e.top = e.top + o - u);
        var c = this.getViewportAdjustedDelta(n, e, l, u);
        c.left ? (e.left += c.left) : (e.top += c.top);
        var f = /top|bottom/.test(n),
          h = f ? 2 * c.left - i + l : 2 * c.top - o + u,
          d = f ? "offsetWidth" : "offsetHeight";
        r.offset(e), this.replaceArrow(h, r[0][d], f);
      }),
      (e.prototype.replaceArrow = function(t, e, n) {
        this.arrow()
          .css(n ? "left" : "top", 50 * (1 - t / e) + "%")
          .css(n ? "top" : "left", "");
      }),
      (e.prototype.setContent = function() {
        var t = this.tip(),
          e = this.getTitle();
        t.find(".tooltip-inner")[this.options.html ? "html" : "text"](e),
          t.removeClass("fade in top bottom left right");
      }),
      (e.prototype.hide = function(n) {
        function r() {
          "in" != i.hoverState && o.detach(),
            i.$element &&
              i.$element
                .removeAttr("aria-describedby")
                .trigger("hidden.bs." + i.type),
            n && n();
        }
        var i = this,
          o = t(this.$tip),
          a = t.Event("hide.bs." + this.type);
        if ((this.$element.trigger(a), !a.isDefaultPrevented()))
          return (
            o.removeClass("in"),
            t.support.transition && o.hasClass("fade")
              ? o
                  .one("bsTransitionEnd", r)
                  .emulateTransitionEnd(e.TRANSITION_DURATION)
              : r(),
            (this.hoverState = null),
            this
          );
      }),
      (e.prototype.fixTitle = function() {
        var t = this.$element;
        (t.attr("title") || "string" != typeof t.attr("data-original-title")) &&
          t
            .attr("data-original-title", t.attr("title") || "")
            .attr("title", "");
      }),
      (e.prototype.hasContent = function() {
        return this.getTitle();
      }),
      (e.prototype.getPosition = function(e) {
        var n = (e = e || this.$element)[0],
          r = "BODY" == n.tagName,
          i = n.getBoundingClientRect();
        null == i.width &&
          (i = t.extend({}, i, {
            width: i.right - i.left,
            height: i.bottom - i.top
          }));
        var o = window.SVGElement && n instanceof window.SVGElement,
          a = r ? { top: 0, left: 0 } : o ? null : e.offset(),
          s = {
            scroll: r
              ? document.documentElement.scrollTop || document.body.scrollTop
              : e.scrollTop()
          },
          l = r
            ? { width: t(window).width(), height: t(window).height() }
            : null;
        return t.extend({}, i, s, l, a);
      }),
      (e.prototype.getCalculatedOffset = function(t, e, n, r) {
        return "bottom" == t
          ? { top: e.top + e.height, left: e.left + e.width / 2 - n / 2 }
          : "top" == t
            ? { top: e.top - r, left: e.left + e.width / 2 - n / 2 }
            : "left" == t
              ? { top: e.top + e.height / 2 - r / 2, left: e.left - n }
              : { top: e.top + e.height / 2 - r / 2, left: e.left + e.width };
      }),
      (e.prototype.getViewportAdjustedDelta = function(t, e, n, r) {
        var i = { top: 0, left: 0 };
        if (!this.$viewport) return i;
        var o = (this.options.viewport && this.options.viewport.padding) || 0,
          a = this.getPosition(this.$viewport);
        if (/right|left/.test(t)) {
          var s = e.top - o - a.scroll,
            l = e.top + o - a.scroll + r;
          s < a.top
            ? (i.top = a.top - s)
            : l > a.top + a.height && (i.top = a.top + a.height - l);
        } else {
          var u = e.left - o,
            c = e.left + o + n;
          u < a.left
            ? (i.left = a.left - u)
            : c > a.right && (i.left = a.left + a.width - c);
        }
        return i;
      }),
      (e.prototype.getTitle = function() {
        var t = this.$element,
          e = this.options;
        return (
          t.attr("data-original-title") ||
          ("function" == typeof e.title ? e.title.call(t[0]) : e.title)
        );
      }),
      (e.prototype.getUID = function(t) {
        do {
          t += ~~(1e6 * Math.random());
        } while (document.getElementById(t));
        return t;
      }),
      (e.prototype.tip = function() {
        if (
          !this.$tip &&
          ((this.$tip = t(this.options.template)), 1 != this.$tip.length)
        )
          throw new Error(
            this.type +
              " `template` option must consist of exactly 1 top-level element!"
          );
        return this.$tip;
      }),
      (e.prototype.arrow = function() {
        return (this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow"));
      }),
      (e.prototype.enable = function() {
        this.enabled = !0;
      }),
      (e.prototype.disable = function() {
        this.enabled = !1;
      }),
      (e.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled;
      }),
      (e.prototype.toggle = function(e) {
        var n = this;
        e &&
          ((n = t(e.currentTarget).data("bs." + this.type)) ||
            ((n = new this.constructor(
              e.currentTarget,
              this.getDelegateOptions()
            )),
            t(e.currentTarget).data("bs." + this.type, n))),
          e
            ? ((n.inState.click = !n.inState.click),
              n.isInStateTrue() ? n.enter(n) : n.leave(n))
            : n.tip().hasClass("in")
              ? n.leave(n)
              : n.enter(n);
      }),
      (e.prototype.destroy = function() {
        var t = this;
        clearTimeout(this.timeout),
          this.hide(function() {
            t.$element.off("." + t.type).removeData("bs." + t.type),
              t.$tip && t.$tip.detach(),
              (t.$tip = null),
              (t.$arrow = null),
              (t.$viewport = null),
              (t.$element = null);
          });
      });
    var n = t.fn.tooltip;
    (t.fn.tooltip = function(n) {
      return this.each(function() {
        var r = t(this),
          i = r.data("bs.tooltip"),
          o = "object" == typeof n && n;
        (!i && /destroy|hide/.test(n)) ||
          (i || r.data("bs.tooltip", (i = new e(this, o))),
          "string" == typeof n && i[n]());
      });
    }),
      (t.fn.tooltip.Constructor = e),
      (t.fn.tooltip.noConflict = function() {
        return (t.fn.tooltip = n), this;
      });
  })(jQuery),
  (function(t) {
    "use strict";
    var e = function(t, e) {
      this.init("popover", t, e);
    };
    if (!t.fn.tooltip) throw new Error("Popover requires tooltip.js");
    (e.VERSION = "3.3.7"),
      (e.DEFAULTS = t.extend({}, t.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template:
          '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
      })),
      (e.prototype = t.extend({}, t.fn.tooltip.Constructor.prototype)),
      (e.prototype.constructor = e),
      (e.prototype.getDefaults = function() {
        return e.DEFAULTS;
      }),
      (e.prototype.setContent = function() {
        var t = this.tip(),
          e = this.getTitle(),
          n = this.getContent();
        t.find(".popover-title")[this.options.html ? "html" : "text"](e),
          t
            .find(".popover-content")
            .children()
            .detach()
            .end()
            [
              this.options.html
                ? "string" == typeof n
                  ? "html"
                  : "append"
                : "text"
            ](n),
          t.removeClass("fade top bottom left right in"),
          t.find(".popover-title").html() || t.find(".popover-title").hide();
      }),
      (e.prototype.hasContent = function() {
        return this.getTitle() || this.getContent();
      }),
      (e.prototype.getContent = function() {
        var t = this.$element,
          e = this.options;
        return (
          t.attr("data-content") ||
          ("function" == typeof e.content ? e.content.call(t[0]) : e.content)
        );
      }),
      (e.prototype.arrow = function() {
        return (this.$arrow = this.$arrow || this.tip().find(".arrow"));
      });
    var n = t.fn.popover;
    (t.fn.popover = function(n) {
      return this.each(function() {
        var r = t(this),
          i = r.data("bs.popover"),
          o = "object" == typeof n && n;
        (!i && /destroy|hide/.test(n)) ||
          (i || r.data("bs.popover", (i = new e(this, o))),
          "string" == typeof n && i[n]());
      });
    }),
      (t.fn.popover.Constructor = e),
      (t.fn.popover.noConflict = function() {
        return (t.fn.popover = n), this;
      });
  })(jQuery),
  (function(t) {
    "use strict";
    function e(n, r) {
      (this.$body = t(document.body)),
        (this.$scrollElement = t(t(n).is(document.body) ? window : n)),
        (this.options = t.extend({}, e.DEFAULTS, r)),
        (this.selector = (this.options.target || "") + " .nav li > a"),
        (this.offsets = []),
        (this.targets = []),
        (this.activeTarget = null),
        (this.scrollHeight = 0),
        this.$scrollElement.on(
          "scroll.bs.scrollspy",
          t.proxy(this.process, this)
        ),
        this.refresh(),
        this.process();
    }
    function n(n) {
      return this.each(function() {
        var r = t(this),
          i = r.data("bs.scrollspy"),
          o = "object" == typeof n && n;
        i || r.data("bs.scrollspy", (i = new e(this, o))),
          "string" == typeof n && i[n]();
      });
    }
    (e.VERSION = "3.3.7"),
      (e.DEFAULTS = { offset: 10 }),
      (e.prototype.getScrollHeight = function() {
        return (
          this.$scrollElement[0].scrollHeight ||
          Math.max(
            this.$body[0].scrollHeight,
            document.documentElement.scrollHeight
          )
        );
      }),
      (e.prototype.refresh = function() {
        var e = this,
          n = "offset",
          r = 0;
        (this.offsets = []),
          (this.targets = []),
          (this.scrollHeight = this.getScrollHeight()),
          t.isWindow(this.$scrollElement[0]) ||
            ((n = "position"), (r = this.$scrollElement.scrollTop())),
          this.$body
            .find(this.selector)
            .map(function() {
              var e = t(this),
                i = e.data("target") || e.attr("href"),
                o = /^#./.test(i) && t(i);
              return (
                (o && o.length && o.is(":visible") && [[o[n]().top + r, i]]) ||
                null
              );
            })
            .sort(function(t, e) {
              return t[0] - e[0];
            })
            .each(function() {
              e.offsets.push(this[0]), e.targets.push(this[1]);
            });
      }),
      (e.prototype.process = function() {
        var t,
          e = this.$scrollElement.scrollTop() + this.options.offset,
          n = this.getScrollHeight(),
          r = this.options.offset + n - this.$scrollElement.height(),
          i = this.offsets,
          o = this.targets,
          a = this.activeTarget;
        if ((this.scrollHeight != n && this.refresh(), e >= r))
          return a != (t = o[o.length - 1]) && this.activate(t);
        if (a && e < i[0]) return (this.activeTarget = null), this.clear();
        for (t = i.length; t--; )
          a != o[t] &&
            e >= i[t] &&
            (void 0 === i[t + 1] || e < i[t + 1]) &&
            this.activate(o[t]);
      }),
      (e.prototype.activate = function(e) {
        (this.activeTarget = e), this.clear();
        var n =
            this.selector +
            '[data-target="' +
            e +
            '"],' +
            this.selector +
            '[href="' +
            e +
            '"]',
          r = t(n)
            .parents("li")
            .addClass("active");
        r.parent(".dropdown-menu").length &&
          (r = r.closest("li.dropdown").addClass("active")),
          r.trigger("activate.bs.scrollspy");
      }),
      (e.prototype.clear = function() {
        t(this.selector)
          .parentsUntil(this.options.target, ".active")
          .removeClass("active");
      });
    var r = t.fn.scrollspy;
    (t.fn.scrollspy = n),
      (t.fn.scrollspy.Constructor = e),
      (t.fn.scrollspy.noConflict = function() {
        return (t.fn.scrollspy = r), this;
      }),
      t(window).on("load.bs.scrollspy.data-api", function() {
        t('[data-spy="scroll"]').each(function() {
          var e = t(this);
          n.call(e, e.data());
        });
      });
  })(jQuery),
  (function(t) {
    "use strict";
    function e(e) {
      return this.each(function() {
        var r = t(this),
          i = r.data("bs.tab");
        i || r.data("bs.tab", (i = new n(this))),
          "string" == typeof e && i[e]();
      });
    }
    var n = function(e) {
      this.element = t(e);
    };
    (n.VERSION = "3.3.7"),
      (n.TRANSITION_DURATION = 150),
      (n.prototype.show = function() {
        var e = this.element,
          n = e.closest("ul:not(.dropdown-menu)"),
          r = e.data("target");
        if (
          (r || (r = (r = e.attr("href")) && r.replace(/.*(?=#[^\s]*$)/, "")),
          !e.parent("li").hasClass("active"))
        ) {
          var i = n.find(".active:last a"),
            o = t.Event("hide.bs.tab", { relatedTarget: e[0] }),
            a = t.Event("show.bs.tab", { relatedTarget: i[0] });
          if (
            (i.trigger(o),
            e.trigger(a),
            !a.isDefaultPrevented() && !o.isDefaultPrevented())
          ) {
            var s = t(r);
            this.activate(e.closest("li"), n),
              this.activate(s, s.parent(), function() {
                i.trigger({ type: "hidden.bs.tab", relatedTarget: e[0] }),
                  e.trigger({ type: "shown.bs.tab", relatedTarget: i[0] });
              });
          }
        }
      }),
      (n.prototype.activate = function(e, r, i) {
        function o() {
          a
            .removeClass("active")
            .find("> .dropdown-menu > .active")
            .removeClass("active")
            .end()
            .find('[data-toggle="tab"]')
            .attr("aria-expanded", !1),
            e
              .addClass("active")
              .find('[data-toggle="tab"]')
              .attr("aria-expanded", !0),
            s ? (e[0].offsetWidth, e.addClass("in")) : e.removeClass("fade"),
            e.parent(".dropdown-menu").length &&
              e
                .closest("li.dropdown")
                .addClass("active")
                .end()
                .find('[data-toggle="tab"]')
                .attr("aria-expanded", !0),
            i && i();
        }
        var a = r.find("> .active"),
          s =
            i &&
            t.support.transition &&
            ((a.length && a.hasClass("fade")) || !!r.find("> .fade").length);
        a.length && s
          ? a
              .one("bsTransitionEnd", o)
              .emulateTransitionEnd(n.TRANSITION_DURATION)
          : o(),
          a.removeClass("in");
      });
    var r = t.fn.tab;
    (t.fn.tab = e),
      (t.fn.tab.Constructor = n),
      (t.fn.tab.noConflict = function() {
        return (t.fn.tab = r), this;
      });
    var i = function(n) {
      n.preventDefault(), e.call(t(this), "show");
    };
    t(document)
      .on("click.bs.tab.data-api", '[data-toggle="tab"]', i)
      .on("click.bs.tab.data-api", '[data-toggle="pill"]', i);
  })(jQuery),
  (function(t) {
    "use strict";
    function e(e) {
      return this.each(function() {
        var r = t(this),
          i = r.data("bs.affix"),
          o = "object" == typeof e && e;
        i || r.data("bs.affix", (i = new n(this, o))),
          "string" == typeof e && i[e]();
      });
    }
    var n = function(e, r) {
      (this.options = t.extend({}, n.DEFAULTS, r)),
        (this.$target = t(this.options.target)
          .on("scroll.bs.affix.data-api", t.proxy(this.checkPosition, this))
          .on(
            "click.bs.affix.data-api",
            t.proxy(this.checkPositionWithEventLoop, this)
          )),
        (this.$element = t(e)),
        (this.affixed = null),
        (this.unpin = null),
        (this.pinnedOffset = null),
        this.checkPosition();
    };
    (n.VERSION = "3.3.7"),
      (n.RESET = "affix affix-top affix-bottom"),
      (n.DEFAULTS = { offset: 0, target: window }),
      (n.prototype.getState = function(t, e, n, r) {
        var i = this.$target.scrollTop(),
          o = this.$element.offset(),
          a = this.$target.height();
        if (null != n && "top" == this.affixed) return i < n && "top";
        if ("bottom" == this.affixed)
          return null != n
            ? !(i + this.unpin <= o.top) && "bottom"
            : !(i + a <= t - r) && "bottom";
        var s = null == this.affixed,
          l = s ? i : o.top;
        return null != n && i <= n
          ? "top"
          : null != r && l + (s ? a : e) >= t - r && "bottom";
      }),
      (n.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset) return this.pinnedOffset;
        this.$element.removeClass(n.RESET).addClass("affix");
        var t = this.$target.scrollTop(),
          e = this.$element.offset();
        return (this.pinnedOffset = e.top - t);
      }),
      (n.prototype.checkPositionWithEventLoop = function() {
        setTimeout(t.proxy(this.checkPosition, this), 1);
      }),
      (n.prototype.checkPosition = function() {
        if (this.$element.is(":visible")) {
          var e = this.$element.height(),
            r = this.options.offset,
            i = r.top,
            o = r.bottom,
            a = Math.max(t(document).height(), t(document.body).height());
          "object" != typeof r && (o = i = r),
            "function" == typeof i && (i = r.top(this.$element)),
            "function" == typeof o && (o = r.bottom(this.$element));
          var s = this.getState(a, e, i, o);
          if (this.affixed != s) {
            null != this.unpin && this.$element.css("top", "");
            var l = "affix" + (s ? "-" + s : ""),
              u = t.Event(l + ".bs.affix");
            if ((this.$element.trigger(u), u.isDefaultPrevented())) return;
            (this.affixed = s),
              (this.unpin = "bottom" == s ? this.getPinnedOffset() : null),
              this.$element
                .removeClass(n.RESET)
                .addClass(l)
                .trigger(l.replace("affix", "affixed") + ".bs.affix");
          }
          "bottom" == s && this.$element.offset({ top: a - e - o });
        }
      });
    var r = t.fn.affix;
    (t.fn.affix = e),
      (t.fn.affix.Constructor = n),
      (t.fn.affix.noConflict = function() {
        return (t.fn.affix = r), this;
      }),
      t(window).on("load", function() {
        t('[data-spy="affix"]').each(function() {
          var n = t(this),
            r = n.data();
          (r.offset = r.offset || {}),
            null != r.offsetBottom && (r.offset.bottom = r.offsetBottom),
            null != r.offsetTop && (r.offset.top = r.offsetTop),
            e.call(n, r);
        });
      });
  })(jQuery),
  (function(t) {
    var e = 1721425.5,
      n = (new Array("Normal year", "Leap year"),
      {
        GREGORIAN: { name: "Gregorian", short: "G", n_months: 12 },
        JULIAN: { name: "Julian", short: "Ju", n_months: 12 },
        JEWISH: { name: "Jewish", short: "Je", n_months: 13 },
        FRENCH: { name: "Revol.", short: "R", n_months: 13 }
      }),
      r = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
      i = {
        GREGORIAN: [
          "ZERO",
          "Jan",
          "Feb",
          "M\xe4rz",
          "Apr",
          "Mai",
          "Juni",
          "Juli",
          "Aug",
          "Sep",
          "Okt",
          "Nov",
          "Dez"
        ],
        JULIAN: [
          "ZERO",
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        JEWISH: [
          "ZERO",
          "Tishri",
          "Heshvan",
          "Kislev",
          "Tevet",
          "Shevat",
          "AdarI",
          "AdarII",
          "Nisan",
          "Iyyar",
          "Sivan",
          "Tammuz",
          "Av",
          "Elul"
        ],
        FRENCH: [
          "ZERO",
          "Vendemiaire",
          "Brumaire",
          "Frimaire",
          "Nivose",
          "Pluviose",
          "Ventose",
          "Germinal",
          "Floreal",
          "Prairial",
          "Messidor",
          "Thermidor",
          "Fructidor",
          "Extra"
        ]
      };
    function o(t, e) {
      return t - e * Math.floor(t / e);
    }
    function a(t) {
      return (t = parseInt(t)) % 4 == 0 && !(t % 100 == 0 && t % 400 != 0);
    }
    function s(t, n, r) {
      return (
        e -
        1 +
        365 * (t - 1) +
        Math.floor((t - 1) / 4) +
        -Math.floor((t - 1) / 100) +
        Math.floor((t - 1) / 400) +
        Math.floor((367 * n - 362) / 12 + (n <= 2 ? 0 : a(t) ? -1 : -2) + r)
      );
    }
    function l(t, n) {
      t = parseInt(t);
      var r,
        i,
        l,
        u,
        c,
        f,
        h,
        d,
        p,
        g,
        v,
        m,
        y,
        b,
        x,
        w = {};
      switch (n) {
        case "GREGORIAN":
        case "gregorian":
          (i = t),
            (u = (l = Math.floor(i - 0.5) + 0.5) - e),
            (c = Math.floor(u / 146097)),
            (f = o(u, 146097)),
            (h = Math.floor(f / 36524)),
            (d = o(f, 36524)),
            (p = Math.floor(d / 1461)),
            (g = o(d, 1461)),
            (m = 400 * c + 100 * h + 4 * p + (v = Math.floor(g / 365))),
            4 != h && 4 != v && m++,
            (y = l - s(m, 1, 1)),
            (b = l < s(m, 3, 1) ? 0 : a(m) ? 1 : 2),
            (month = Math.floor((12 * (y + b) + 373) / 367)),
            (day = l - s(m, month, 1) + 1),
            m <= 0 && m--,
            (r = new Array(m, month, day));
          break;
        case "JULIAN":
        case "julian":
          r = S.jd_to_julian(t);
          break;
        case "JEWISH":
        case "jewish":
          r = S.jd_to_hebrew(t);
          break;
        case "FRENCH":
        case "french":
          r = S.jd_to_french_revolutionary(t);
      }
      return (
        (w.year = r[0]),
        (w.month = r[1]),
        (w.day = r[2]),
        (w.weekday = ((x = t), (x = Number(x)), o(Math.floor(x + 1.5), 7))),
        w
      );
    }
    dateConverter = function(t) {
      var e = l(t.dateval1, t.calendar),
        o = l(t.dateval2, t.calendar),
        a = "";
      if (t.dateprecision1 == t.dateprecision2)
        switch (t.dateprecision1) {
          case "DAY":
            a =
              e.year == o.year && e.month == o.month && e.day == o.day
                ? "[" +
                  r[e.weekday] +
                  "] " +
                  e.day +
                  ". " +
                  i[t.calendar][e.month] +
                  " " +
                  e.year
                : "[" +
                  r[e.weekday] +
                  "] " +
                  e.day +
                  ". " +
                  i[t.calendar][e.month] +
                  " " +
                  e.year +
                  " \u2013 [" +
                  r[o.weekday] +
                  "] " +
                  o.day +
                  ". " +
                  i[t.calendar][o.month] +
                  " " +
                  o.year;
            break;
          case "MONTH":
            a =
              e.year == o.year && e.month == o.month
                ? i[t.calendar][e.month] + " " + e.year
                : i[t.calendar][e.month] +
                  " " +
                  e.year +
                  " \u2013 " +
                  i[t.calendar][o.month] +
                  " " +
                  o.year;
            break;
          case "YEAR":
            a = e.year == o.year ? e.year : e.year + "\u2013" + o.year;
        }
      else {
        switch (t.dateprecision1) {
          case "DAY":
            a =
              "[" +
              r[e.weekday] +
              "] " +
              e.day +
              ". " +
              i[t.calendar][e.month] +
              " " +
              e.year;
            break;
          case "MONTH":
            a = i[t.calendar][e.month] + " " + e.year;
            break;
          case "YEAR":
            a = e.year;
        }
        switch (((a += " \u2013 "), t.dateprecision2)) {
          case "DAY":
            a +=
              "[" +
              r[o.weekday] +
              "] " +
              o.day +
              ". " +
              i[t.calendar][o.month] +
              " " +
              o.year;
            break;
          case "MONTH":
            a += i[t.calendar][o.month] + " " + o.year;
            break;
          case "YEAR":
            a += o.year;
        }
      }
      return (a += " (" + n[t.calendar].short + ")");
    };
  })(window.angular),
  window.angular,
  (htmlConverter = function(t, e) {
    var n,
      r,
      i,
      o,
      a,
      s,
      l,
      u,
      c,
      f = "",
      h = {
        p: 0,
        h1: 0,
        h2: 0,
        h3: 0,
        h4: 0,
        h5: 0,
        h6: 0,
        ol: 0,
        ul: 0,
        li: 1,
        a: 2,
        strong: 3,
        u: 3,
        s: 3,
        em: 3,
        span: 3,
        sup: 3,
        sub: 3
      },
      d = {
        settings: {
          utf8str: "",
          textattr: {},
          css: { width: "100%", minHeight: "30px" },
          matching: {
            strong: "bold",
            u: "underline",
            s: "strikethrough",
            em: "italic",
            a: "_link",
            h1: "h1",
            h2: "h2",
            h3: "h3",
            h4: "h4",
            h5: "h5",
            h6: "h6",
            ol: "ol",
            ul: "ul",
            li: "li",
            span: "style",
            p: "p",
            sup: "sup",
            sub: "sub"
          }
        }
      },
      p = {};
    for (var g in d.settings.matching) p[d.settings.matching[g]] = g;
    var v = Object.keys(t);
    for (s in (v.sort(function(t, e) {
      return h[p[t]] - h[p[e]];
    }),
    (n = []),
    v))
      for (l in t[(s = v[s])])
        void 0 === n[(i = t[s][l].start)] && (n[i] = []),
          n[i].push({ propname: s, proptype: "start" }),
          "_link" == n[i][n[i].length - 1].propname
            ? ((n[i][n[i].length - 1].href = t[s][l].href),
              void 0 !== t[s][l].resid &&
                (n[i][n[i].length - 1].resid = t[s][l].resid))
            : "style" == n[i][n[i].length - 1].propname &&
              (n[i][n[i].length - 1].css = t[s][l].css),
          void 0 === n[(i = t[s][l].end)] && (n[i] = []),
          n[i].push({ propname: s, proptype: "end" });
    for (r = [], u = 0; u <= e.length; u++) {
      if (void 0 !== n[u]) {
        for (a = [], c = n[u].length - 1; c >= 0; c--)
          if ("end" == n[u][c].proptype && "linebreak" != n[u][c].propname) {
            for (
              ;
              void 0 !== (o = r.pop()) &&
              ((f += "</" + p[o] + ">"), o != n[u][c].propname);

            )
              a.push(o);
            for (; void 0 !== (o = a.pop()); )
              r.push(o), (f += "<" + p[o] + ">");
          }
        for (c in n[u])
          if ("start" == n[u][c].proptype)
            if ("linebreak" == n[u][c].propname) f += "<br/>";
            else if ("_link" == n[u][c].propname) {
              r.push(n[u][c].propname);
              var m = n[u][c].href;
              void 0 === m &&
                void 0 !== n[u][c].resid &&
                (m = "http://www.salsah.org/api/resources/" + n[u][c].resid),
                (f += "<" + p[n[u][c].propname] + ' href="' + m),
                void 0 !== n[u][c].resid
                  ? (f += '" class="salsah-link">')
                  : (f += '">');
            } else
              "style" == n[u][c].propname
                ? (r.push(n[u][c].propname),
                  (f +=
                    "<" +
                    p[n[u][c].propname] +
                    ' style="' +
                    n[u][c].css +
                    '">'))
                : (r.push(n[u][c].propname),
                  (f += "<" + p[n[u][c].propname] + ">"));
      }
      u < e.length && (f += e.charAt(u));
    }
    return (f = (f = f.replace(/\n/g, "<br/>")).replace(/\r/g, ""));
  });
