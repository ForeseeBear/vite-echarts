import { extendShape } from '../../util/graphic';

var Sector3DLabelLine = extendShape({

    type: 'sector3DLabelLine',

    shape: {
        points: null,

        smooth: false,

        smoothConstraint: null
    },

    buildPath: function (ctx, shape) {
        var p = shape.points;
        var fd = function (w, c) {
            return w == 1 ? (Math.floor(c) + 0.5) : Math.round(c);
        }
        ctx.moveTo(fd(1, p[0][0]), fd(1, p[0][1]));
        ctx.bezierCurveTo(p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]);
    }
});

/**
 * 3D扇形底面（顶面）
 *
 */
var Sector3DBottom = extendShape({

    type: 'sector3DBottom',

    shape: {
        z: 0,

        cx: 0,

        cy: 0,

        r0: 0,

        r: 0,

        a: 0,

        b: 0,

        a0: 0,

        b0: 0,

        h: 15,

        startAngle: 0,

        endAngle: Math.PI * 2,

        clockwise: true,

        isRose: false
    },

    // 绘制扇面
    sector: function (ctx, x, y, a, b, s, e, a1, b1) {

        var angle = s;

        // 外圈
        ctx.moveTo(x + a1 * Math.cos(s), y + b1 * Math.sin(s));
        // ctx.beginPath();
        ctx.lineTo(x + a * Math.cos(s), y + b * Math.sin(s));
        angle += 0.035;
        while (angle <= e) {
            ctx.lineTo(x + a * Math.cos(angle), y + (b * Math.sin(angle)));
            angle += 0.005;
        }
        ctx.lineTo(x + a * Math.cos(e), y + (b * Math.sin(e)));
        ctx.lineTo(x + a1 * Math.cos(e), y + (b1 * Math.sin(e)));

        // 内圈
        angle = e;
        angle -= 0.035;
        while (angle >= s) {
            ctx.lineTo(x + a1 * Math.cos(angle), y + (b1 * Math.sin(angle)));
            angle -= 0.005;
        }
        ctx.lineTo(x + a1 * Math.cos(s), y + (b1 * Math.sin(s)));

        ctx.closePath();

        // ctx.fill();
    },

    buildPath: function (ctx, shape) {

        var x = shape.cx;
        var y = shape.cy;
        var r0 = Math.max(shape.r0 || 0, 0);
        var r = Math.max(shape.r, 0);
        var s = shape.startAngle;
        var e = shape.endAngle;
        var c = shape.clockwise;

        // 椭圆横轴半径
        var a = shape.a;
        if (a == 0) return;
        var a0 = shape.a0;
        // 椭圆纵轴半径
        var b = shape.b;
        var b0 = shape.b0;

        var h = shape.h;

        // 绘制底面
        // this.sector(ctx, x, y + h, a, b, s, e, a0, b0);
        this.sector(ctx, x, y, a, b, s, e, a0, b0);
        ctx.closePath();
    }
});

/**
 * 3D扇形底面（顶面）
 *
 */
var Sector3DTop = extendShape({

    type: 'sector3DTop',

    shape: {
        z: 0,

        cx: 0,

        cy: 0,

        r0: 0,

        r: 0,

        a: 0,

        b: 0,

        a0: 0,

        b0: 0,

        h: 15,

        startAngle: 0,

        endAngle: Math.PI * 2,

        clockwise: true
    },

    // 绘制扇面
    sector: function (ctx, x, y, a, b, s, e, a1, b1) {
        var angle = s;

        // 外圈
        ctx.moveTo(x + a1 * Math.cos(s), y + b1 * Math.sin(s));
        // ctx.beginPath();
        ctx.lineTo(x + a * Math.cos(s), y + b * Math.sin(s));
        angle += 0.035;
        while (angle <= e) {
            ctx.lineTo(x + a * Math.cos(angle), y + (b * Math.sin(angle)));
            angle += 0.035;
        }
        ctx.lineTo(x + a * Math.cos(e), y + (b * Math.sin(e)));
        ctx.lineTo(x + a1 * Math.cos(e), y + (b1 * Math.sin(e)));

        // 内圈
        angle = e;
        angle -= 0.035;
        while (angle >= s) {
            ctx.lineTo(x + a1 * Math.cos(angle), y + (b1 * Math.sin(angle)));
            angle -= 0.035;
        }
        ctx.lineTo(x + a1 * Math.cos(s), y + (b1 * Math.sin(s)));

        ctx.closePath();

        // ctx.fill();
    },

    buildPath: function (ctx, shape) {

        var x = shape.cx;
        var y = shape.cy;
        var r0 = Math.max(shape.r0 || 0, 0);
        var r = Math.max(shape.r, 0);
        var s = shape.startAngle;
        var e = shape.endAngle;
        var c = shape.clockwise;

        // 椭圆横轴半径
        var a = shape.a;
        if (a == 0) return;
        var a0 = shape.a0;
        // 椭圆纵轴半径
        var b = shape.b;
        var b0 = shape.b0;

        var h = shape.h;

        // 绘制顶面
        this.sector(ctx, x, y - h, a, b, s, e, a0, b0);
        // this.sector(ctx, x, y, a, b, s, e, a0, b0);
        ctx.closePath();
    }
});

/**
 * 绘制3D扇形内侧面1
 */
var Sector3DSideInnerLeft = extendShape({
    type: 'sector3DSideInnerLeft',
    shape: {

        z: 0,

        cx: 0,

        cy: 0,

        r0: 0,

        r: 0,

        a: 0,

        b: 0,

        a0: 0,

        b0: 0,

        h: 15,

        startAngle: 0,

        endAngle: Math.PI * 2,

        clockwise: true
    },
    // 绘制单个内侧面
    layerDraw: function (ctx, x, y, a, b, h, A, a1, b1) {

        var x1 = x + a1 * Math.cos(A);
        // var y1 = y + b1 * Math.sin(A);
        var y1 = y - h + b1 * Math.sin(A);

        var x0 = x + a * Math.cos(A);
        // var y0 = y + h + (b * Math.sin(A));
        var y0 = y + (b * Math.sin(A));
        ctx.moveTo(x1, y1);
        // ctx.beginPath();
        ctx.lineTo(x1, y1 + h);
        ctx.lineTo(x0, y0);
        ctx.lineTo(x0, y0 - h);
        ctx.lineTo(x1, y1);

        ctx.closePath();
        // if(ctx._ctx){
        //     ctx._ctx.fill();
        // }else{
        //     ctx.fill();
        // }
    },
    buildPath: function (ctx, shape) {

        var x = shape.cx;
        var y = shape.cy;
        var r0 = Math.max(shape.r0 || 0, 0);
        var r = Math.max(shape.r, 0);
        var s = shape.startAngle;
        var e = shape.endAngle;
        var c = shape.clockwise;

        // 椭圆横轴半径
        var a = shape.a;
        if (a == 0) return;
        var a0 = shape.a0;
        // 椭圆纵轴半径
        var b = shape.b;
        var b0 = shape.b0;

        var h = shape.h;

        // 准备绘制侧面
        var PI = Math.PI, inc = PI / 90, inc2 = inc / 2, ceil = Math.ceil, floor = Math.floor, PI2 = 2 * PI,
            max = Math.max, min = Math.min, sin = Math.sin, cos = Math.cos, c = false;
        var abs = function (n, M) {
            return 1 + Math.sin(M ? (n + Math.PI) : n);
        }
        var fd = function (w, c) {
            return w == 1 ? (floor(c) + 0.5) : Math.round(c);
        }
        var lowTo = function (l, v) {
            return v < l ? l : v;
        }
        var toPI2 = function (a) {
            while (a < 0)
                a += PI2;
            return a;
        }

        function quadrantd(a) {
            if (a == 0) return 0;
            if (a % PI2 == 0) return 3;
            while (a < 0)
                a += PI2;
            return ceil(2 * (a % PI2) / PI) - 1;
        }
        // 排序
        function sor(t, f) {
            var L = t.length - 1, T;
            for (var i = 0;i < L;i++) {
                for (var j = L;j > i;j--) {
                    if (f ? !f(t[j], t[j - 1]) : (t[j] < t[j - 1])) {
                        T = t[j];
                        t[j] = t[j - 1];
                        t[j - 1] = T;
                    }
                }
            }
        }
        // 内侧面
        var layer = [];
        var lay = function (C, g, z, f) {
            // Q = quadrantd(g);
            // if (C &&(Q ==0 || Q ==3) || (!C && (Q ==2 || Q ==1))) {
            layer.push({
                g: g,
                z: g == z,
                x: f.x,
                y: f.y,
                a: f.a,
                b: f.b,
                a0: f.a0,
                b0: f.b0,
                // color : f.color,
                h: f.h,
                F: f
            });
            // }
        };

        // 准备绘制侧面
        var f = {
            x: x,
            y: y,
            a: a,
            b: b,
            s: s,
            e: e,
            a0: a0,
            b0: b0,
            h: h
        };
        lay(c, f.s, f.e, f);
        lay(!c, f.e, f.s, f);

        // 排序内侧面
        sor(layer, function (p, q) {
            var r = abs(p.g) - abs(q.g);
            return r == 0 ? p.z : r > 0;
        });

        // 绘制内侧面
        // for(var i=0;i<layer.length;i++){
        //     var ff = layer[i];
        //     this.layerDraw(ctx, ff.x, ff.y, ff.a + 0.5, ff.b + 0.5, ff.h, ff.g, ff.a0, ff.b0);
        // }
        var ff = layer[0];
        if (ff) {
            this.layerDraw(ctx, ff.x, ff.y, ff.a + 0.5, ff.b + 0.5, ff.h, ff.g, ff.a0, ff.b0);
        }
        ctx.closePath();
    }

});

/**
 * 绘制3D扇形内侧面2
 */
var Sector3DSideInnerRight = extendShape({
    type: 'sector3DSideInnerRight',
    shape: {

        z: 0,

        cx: 0,

        cy: 0,

        r0: 0,

        r: 0,

        a: 0,

        b: 0,

        a0: 0,

        b0: 0,

        h: 15,

        startAngle: 0,

        endAngle: Math.PI * 2,

        clockwise: true
    },
    // 绘制单个内侧面
    layerDraw: function (ctx, x, y, a, b, h, A, a1, b1) {

        var x1 = x + a1 * Math.cos(A);
        // var y1 = y + b1 * Math.sin(A);
        var y1 = y - h + b1 * Math.sin(A);

        var x0 = x + a * Math.cos(A);
        // var y0 = y + h + (b * Math.sin(A));
        var y0 = y + (b * Math.sin(A));
        ctx.moveTo(x1, y1);
        // ctx.beginPath();
        ctx.lineTo(x1, y1 + h);
        ctx.lineTo(x0, y0);
        ctx.lineTo(x0, y0 - h);
        ctx.lineTo(x1, y1);

        ctx.closePath();
        // if(ctx._ctx){
        //     ctx._ctx.fill();
        // }else{
        //     ctx.fill();
        // }
    },
    buildPath: function (ctx, shape) {

        var x = shape.cx;
        var y = shape.cy;
        var r0 = Math.max(shape.r0 || 0, 0);
        var r = Math.max(shape.r, 0);
        var s = shape.startAngle;
        var e = shape.endAngle;
        var c = shape.clockwise;

        // 椭圆横轴半径
        var a = shape.a;
        if (a == 0) return;
        var a0 = shape.a0;
        // 椭圆纵轴半径
        var b = shape.b;
        var b0 = shape.b0;

        var h = shape.h;

        // 准备绘制侧面
        var PI = Math.PI, inc = PI / 90, inc2 = inc / 2, ceil = Math.ceil, floor = Math.floor, PI2 = 2 * PI,
            max = Math.max, min = Math.min, sin = Math.sin, cos = Math.cos, c = false;
        var abs = function (n, M) {
            return 1 + Math.sin(M ? (n + Math.PI) : n);
        }
        var fd = function (w, c) {
            return w == 1 ? (floor(c) + 0.5) : Math.round(c);
        }
        var lowTo = function (l, v) {
            return v < l ? l : v;
        }
        var toPI2 = function (a) {
            while (a < 0)
                a += PI2;
            return a;
        }

        function quadrantd(a) {
            if (a == 0) return 0;
            if (a % PI2 == 0) return 3;
            while (a < 0)
                a += PI2;
            return ceil(2 * (a % PI2) / PI) - 1;
        }
        // 排序
        function sor(t, f) {
            var L = t.length - 1, T;
            for (var i = 0;i < L;i++) {
                for (var j = L;j > i;j--) {
                    if (f ? !f(t[j], t[j - 1]) : (t[j] < t[j - 1])) {
                        T = t[j];
                        t[j] = t[j - 1];
                        t[j - 1] = T;
                    }
                }
            }
        }
        // 内侧面
        var layer = [];
        var lay = function (C, g, z, f) {
            // Q = quadrantd(g);
            // if (C &&(Q ==0 || Q ==3) || (!C && (Q ==2 || Q ==1))) {
            layer.push({
                g: g,
                z: g == z,
                x: f.x,
                y: f.y,
                a: f.a,
                b: f.b,
                a0: f.a0,
                b0: f.b0,
                // color : f.color,
                h: f.h,
                F: f
            });
            // }
        };

        // 准备绘制侧面
        var f = {
            x: x,
            y: y,
            a: a,
            b: b,
            s: s,
            e: e,
            a0: a0,
            b0: b0,
            h: h
        };
        lay(c, f.s, f.e, f);
        lay(!c, f.e, f.s, f);

        // 排序内侧面
        sor(layer, function (p, q) {
            var r = abs(p.g) - abs(q.g);
            return r == 0 ? p.z : r > 0;
        });

        // 绘制内侧面
        // for(var i=0;i<layer.length;i++){
        //     var ff = layer[i];
        //     this.layerDraw(ctx, ff.x, ff.y, ff.a + 0.5, ff.b + 0.5, ff.h, ff.g, ff.a0, ff.b0);
        // }
        var ff = layer[1];
        if (ff) {
            this.layerDraw(ctx, ff.x, ff.y, ff.a + 0.5, ff.b + 0.5, ff.h, ff.g, ff.a0, ff.b0);
        }
        ctx.closePath();
    }

});

/**
 * 绘制3D扇形外侧面（外圈）
 */
var Sector3DSideOutter = extendShape({
    type: 'sector3dSideOutter',
    shape: {

        z: 0,

        cx: 0,

        cy: 0,

        r0: 0,

        r: 0,

        a: 0,

        b: 0,

        a0: 0,

        b0: 0,

        h: 15,

        startAngle: 0,

        endAngle: Math.PI * 2,

        clockwise: true
    },
    // 绘制单个外侧面
    sPaint: function (ctx, x, y, a, b, s, e, h) {

        var PI = Math.PI, inc = PI / 90;

        var Lo = function (A, h) {
            // ctx.lineTo(x + a * Math.cos(A), y + (h || 0) + (b * Math.sin(A)));
            ctx.lineTo(x + a * Math.cos(A), y - (h || 0) + (b * Math.sin(A)));
        },
            angle = s;
        ctx.moveTo(x + a * Math.cos(s), y + (b * Math.sin(s)));
        // ctx.beginPath();
        while (angle <= e) {
            Lo.call(this, angle);
            angle = angle + inc;
        }
        Lo.call(this, e);
        // ctx.lineTo(x + a * Math.cos(e), (y + h) + (b * Math.sin(e)));
        ctx.lineTo(x + a * Math.cos(e), y - (h || 0) + (b * Math.sin(e)));
        angle = e;
        while (angle >= s) {
            Lo.call(this, angle, h);
            angle = angle - inc;
        }
        Lo.call(this, s, h);
        ctx.lineTo(x + a * Math.cos(s), y + (b * Math.sin(s)));

        // ctx.closePath();
        // if(ctx._ctx){
        //     ctx._ctx.fill();
        // }else{
        //     ctx.fill();
        // }
    },
    buildPath: function (ctx, shape) {

        var x = shape.cx;
        var y = shape.cy;
        var r0 = Math.max(shape.r0 || 0, 0);
        var r = Math.max(shape.r, 0);
        var s = shape.startAngle;
        var e = shape.endAngle;
        var c = shape.clockwise;

        // 椭圆横轴半径
        var a = shape.a;
        if (a == 0) return;
        var a0 = shape.a0;
        // 椭圆纵轴半径
        var b = shape.b;
        var b0 = shape.b0;

        var h = shape.h;

        // 准备绘制侧面
        var PI = Math.PI, inc = PI / 90, inc2 = inc / 2, ceil = Math.ceil, floor = Math.floor, PI2 = 2 * PI,
            max = Math.max, min = Math.min, sin = Math.sin, cos = Math.cos, c = false;
        var abs = function (n, M) {
            return 1 + Math.sin(M ? (n + Math.PI) : n);
        }
        var fd = function (w, c) {
            return w == 1 ? (floor(c) + 0.5) : Math.round(c);
        }
        var lowTo = function (l, v) {
            return v < l ? l : v;
        }
        var toPI2 = function (a) {
            while (a < 0)
                a += PI2;
            return a;
        }

        function quadrantd(a) {
            if (a == 0) return 0;
            if (a % PI2 == 0) return 3;
            while (a < 0)
                a += PI2;
            return ceil(2 * (a % PI2) / PI) - 1;
        }
        // 排序
        function sor(t, f) {
            var L = t.length - 1, T;
            for (var i = 0;i < L;i++) {
                for (var j = L;j > i;j--) {
                    if (f ? !f(t[j], t[j - 1]) : (t[j] < t[j - 1])) {
                        T = t[j];
                        t[j] = t[j - 1];
                        t[j - 1] = T;
                    }
                }
            }
        }

        // 外侧面
        var spaint = [];
        var spaintOutter = [];
        // 柱面是否可见，返回可见部分
        var visible = function (s, e, f) {
            if (s >= e) return [];
            var q1 = quadrantd(s), q2 = quadrantd(e);
            if ((q1 == 0 || q1 == 1) && (q2 == 0 || q2 == 1) && ((e - s) < PI)) return [];
            if ((q1 == 2 || q1 == 3) && (q2 == 2 || q2 == 3) && ((e - s) >= PI)) return [{ s: PI, e: e, f: f }, { s: s, e: 0, f: f }];
            // if((q1==2||q1==3)&&(q2==2||q2==3)&&((e-s)<PI)) return {s:s,e:e,f:f};
            s = toPI2(s);
            e = toPI2(e);
            if (e <= s) { e += PI2; }
            // if(s > PI){s = PI2;}
            // else if(e>PI2){
            //     return [{s:s,e:PI,f:f},{s:PI2,e:e,f:f}]
            // }else if(e>PI){
            //     e = PI;
            // }
            // 角度跨越180和360的情况
            if (s < PI) {
                s = PI;
                // return [{s:s,e:PI2,f:f},{s:PI2,e:e,f:f}];
            } else if (e > PI2) {
                return { s: s, e: PI2, f: f }
            }
            return { s: s, e: e, f: f };
        };

        var visibleOutter = function (s, e, f) {
            if (s >= e) return [];
            if (e == s + PI2) {
                return { s: 0, e: PI, f: f }
            }
            var q1 = quadrantd(s), q2 = quadrantd(e);
            if ((q1 == 2 || q1 == 3) && (q2 == 2 || q2 == 3) && ((e - s) < PI)) return [];
            if ((q1 == 2 || q1 == 3) && (q2 == 2 || q2 == 3) && ((e - s) >= PI)) return { s: 0, e: PI, f: f };
            // if((q1==2||q1==3)&&(q2==2||q2==3)&&((e-s)<PI)) return {s:s,e:e,f:f};
            s = toPI2(s);
            e = toPI2(e);
            if (e <= s) { e += PI2; }
            if (s > PI) { s = PI2; }
            else if (e > PI2) {
                return [{ s: s, e: PI, f: f }, { s: PI2, e: e, f: f }]
            } else if (e > PI) {
                e = PI;
            }
            return { s: s, e: e, f: f };
        };

        // 准备绘制侧面
        var f = {
            x: x,
            y: y,
            a: a,
            b: b,
            s: s,
            e: e,
            a0: a0,
            b0: b0,
            h: h
        };
        spaint = spaint.concat(visible(f.s, f.e, f));
        spaintOutter = spaintOutter.concat(visibleOutter(f.s, f.e, f));

        // 排序外侧面
        sor(spaint, function (p, q) {
            return abs((p.s + p.e) / 2, 1) - abs((q.s + q.e) / 2, 1) < 0;
        });

        // 内圈外侧面
        // for(var i=0;i<spaint.length;i++){
        //     var sp = spaint[i];
        //     // if(sp.s >= Math.PI * 2 && sp.e >= Math.PI * 2) sp.e -= Math.PI;
        //     if(sp.e > 10) sp.e -= Math.PI; // 修正只有一个扇面时的误差
        //     // this.sPaint(ctx, sp.f.x, sp.f.y, sp.f.a, sp.f.b, sp.s, sp.e, sp.f.h);
        //     this.sPaint(ctx, sp.f.x, sp.f.y, sp.f.a0, sp.f.b0, sp.s, sp.e, sp.f.h);
        // }
        // 外圈外侧面
        for (var i = 0;i < spaintOutter.length;i++) {
            var sp = spaintOutter[i];
            // if(sp.s >= Math.PI * 2 && sp.e >= Math.PI * 2) sp.e -= Math.PI;
            if (sp.e > 10) sp.e -= Math.PI; // 修正只有一个扇面时的误差
            this.sPaint(ctx, sp.f.x, sp.f.y, sp.f.a, sp.f.b, sp.s, sp.e, sp.f.h);
        }

        ctx.closePath();
    }

});

/**
 * 绘制3D扇形外侧面（内圈）
 */
var Sector3DSideOutterIN = extendShape({
    type: 'Sector3DSideOutterIN',
    shape: {

        z: 0,

        cx: 0,

        cy: 0,

        r0: 0,

        r: 0,

        a: 0,

        b: 0,

        a0: 0,

        b0: 0,

        h: 15,

        startAngle: 0,

        endAngle: Math.PI * 2,

        clockwise: true
    },
    // 绘制单个外侧面
    sPaint: function (ctx, x, y, a, b, s, e, h) {

        var PI = Math.PI, inc = PI / 90;

        var Lo = function (A, h) {
            // ctx.lineTo(x + a * Math.cos(A), y + (h || 0) + (b * Math.sin(A)));
            ctx.lineTo(x + a * Math.cos(A), y - (h || 0) + (b * Math.sin(A)));
        },
            angle = s;
        ctx.moveTo(x + a * Math.cos(s), y + (b * Math.sin(s)));
        // ctx.beginPath();
        while (angle <= e) {
            Lo.call(this, angle);
            angle = angle + inc;
        }
        Lo.call(this, e);
        // ctx.lineTo(x + a * Math.cos(e), (y + h) + (b * Math.sin(e)));
        ctx.lineTo(x + a * Math.cos(e), y - (h || 0) + (b * Math.sin(e)));
        angle = e;
        while (angle >= s) {
            Lo.call(this, angle, h);
            angle = angle - inc;
        }
        Lo.call(this, s, h);
        ctx.lineTo(x + a * Math.cos(s), y + (b * Math.sin(s)));

        // ctx.closePath();
        // if(ctx._ctx){
        //     ctx._ctx.fill();
        // }else{
        //     ctx.fill();
        // }
    },
    buildPath: function (ctx, shape) {

        var x = shape.cx;
        var y = shape.cy;
        var r0 = Math.max(shape.r0 || 0, 0);
        var r = Math.max(shape.r, 0);
        var s = shape.startAngle;
        var e = shape.endAngle;
        var c = shape.clockwise;

        // 椭圆横轴半径
        var a = shape.a;
        if (a == 0) return;
        var a0 = shape.a0;
        // 椭圆纵轴半径
        var b = shape.b;
        var b0 = shape.b0;

        var h = shape.h;

        // 准备绘制侧面
        var PI = Math.PI, inc = PI / 90, inc2 = inc / 2, ceil = Math.ceil, floor = Math.floor, PI2 = 2 * PI,
            max = Math.max, min = Math.min, sin = Math.sin, cos = Math.cos, c = false;
        var abs = function (n, M) {
            return 1 + Math.sin(M ? (n + Math.PI) : n);
        }
        var fd = function (w, c) {
            return w == 1 ? (floor(c) + 0.5) : Math.round(c);
        }
        var lowTo = function (l, v) {
            return v < l ? l : v;
        }
        var toPI2 = function (a) {
            while (a < 0)
                a += PI2;
            return a;
        }

        function quadrantd(a) {
            if (a == 0) return 0;
            if (a % PI2 == 0) return 3;
            while (a < 0)
                a += PI2;
            return ceil(2 * (a % PI2) / PI) - 1;
        }
        // 排序
        function sor(t, f) {
            var L = t.length - 1, T;
            for (var i = 0;i < L;i++) {
                for (var j = L;j > i;j--) {
                    if (f ? !f(t[j], t[j - 1]) : (t[j] < t[j - 1])) {
                        T = t[j];
                        t[j] = t[j - 1];
                        t[j - 1] = T;
                    }
                }
            }
        }


        // 外侧面
        var spaint = [];
        var spaintOutter = [];
        // 柱面是否可见，返回可见部分
        var visible = function (s, e, f) {
            if (s >= e) return [];
            var q1 = quadrantd(s), q2 = quadrantd(e);
            if ((q1 == 0 || q1 == 1) && (q2 == 0 || q2 == 1) && ((e - s) < PI)) return [];
            if ((q1 == 2 || q1 == 3) && (q2 == 2 || q2 == 3) && ((e - s) >= PI)) return [{ s: PI, e: e, f: f }, { s: s, e: 0, f: f }];
            // if((q1==2||q1==3)&&(q2==2||q2==3)&&((e-s)<PI)) return {s:s,e:e,f:f};
            s = toPI2(s);
            e = toPI2(e);
            if (e <= s) { e += PI2; }
            // if(s > PI){s = PI2;}
            // else if(e>PI2){
            //     return [{s:s,e:PI,f:f},{s:PI2,e:e,f:f}]
            // }else if(e>PI){
            //     e = PI;
            // }
            // 角度跨越180和360的情况
            if (s < PI) {
                s = PI;
                // return [{s:s,e:PI2,f:f},{s:PI2,e:e,f:f}];
            } else if (e > PI2) {
                return { s: s, e: PI2, f: f }
            }
            return { s: s, e: e, f: f };
        };

        var visibleOutter = function (s, e, f) {
            if (s >= e) return [];
            if (e == s + PI2) {
                return { s: 0, e: PI, f: f }
            }
            var q1 = quadrantd(s), q2 = quadrantd(e);
            if ((q1 == 2 || q1 == 3) && (q2 == 2 || q2 == 3) && ((e - s) < PI)) return [];
            if ((q1 == 2 || q1 == 3) && (q2 == 2 || q2 == 3) && ((e - s) >= PI)) return { s: 0, e: PI, f: f };
            // if((q1==2||q1==3)&&(q2==2||q2==3)&&((e-s)<PI)) return {s:s,e:e,f:f};
            s = toPI2(s);
            e = toPI2(e);
            if (e <= s) { e += PI2; }
            if (s > PI) { s = PI2; }
            else if (e > PI2) {
                return [{ s: s, e: PI, f: f }, { s: PI2, e: e, f: f }]
            } else if (e > PI) {
                e = PI;
            }
            return { s: s, e: e, f: f };
        };

        // 准备绘制侧面
        var f = {
            x: x,
            y: y,
            a: a,
            b: b,
            s: s,
            e: e,
            a0: a0,
            b0: b0,
            h: h
        };
        spaint = spaint.concat(visible(f.s, f.e, f));
        spaintOutter = spaintOutter.concat(visibleOutter(f.s, f.e, f));

        // 排序外侧面
        sor(spaint, function (p, q) {
            return abs((p.s + p.e) / 2, 1) - abs((q.s + q.e) / 2, 1) < 0;
        });

        // 内圈外侧面
        for (var i = 0;i < spaint.length;i++) {
            var sp = spaint[i];
            // if(sp.s >= Math.PI * 2 && sp.e >= Math.PI * 2) sp.e -= Math.PI;
            if (sp.e > 10) sp.e -= Math.PI; // 修正只有一个扇面时的误差
            // this.sPaint(ctx, sp.f.x, sp.f.y, sp.f.a, sp.f.b, sp.s, sp.e, sp.f.h);
            this.sPaint(ctx, sp.f.x, sp.f.y, sp.f.a0, sp.f.b0, sp.s, sp.e, sp.f.h);
        }
        // 外圈外侧面
        // for(var i=0;i<spaintOutter.length;i++){
        //     var sp = spaintOutter[i];
        //     // if(sp.s >= Math.PI * 2 && sp.e >= Math.PI * 2) sp.e -= Math.PI;
        //     if(sp.e > 10) sp.e -= Math.PI; // 修正只有一个扇面时的误差
        //     this.sPaint(ctx, sp.f.x, sp.f.y, sp.f.a, sp.f.b, sp.s, sp.e, sp.f.h);
        // }

        ctx.closePath();
    }

});

export {
    Sector3DBottom,
    Sector3DTop,
    Sector3DSideInnerLeft,
    Sector3DSideInnerRight,
    Sector3DSideOutter,
    Sector3DSideOutterIN,
    Sector3DLabelLine
}
