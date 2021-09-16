import * as graphic from '../../util/graphic';
// 金字塔类型的纵向偏移角度
var angleZ = Math.PI / 10;
// 短轴半径上下比例
var bRatio = 1.2;

// 底面
export var Funnel3dButtom = graphic.extendShape({
  type: "funnel3dButtom",

  shape: {
    cx: 0,

    cy: 0,

    cx1: 0,

    cy1: 0,

    a: 0,

    b: 0,

    a1: 0,

    b1: 0,

    point: [],

    point2: [],

    index: 0,

    sort: "ascending",
  },

  buildPath: function (ctx, shape) {
    var PI = Math.PI;
    var cx, cy, cx1, cy1, a, b, a1, b1;
    var cx = shape.cx,
      cy = shape.cy,
      cx1 = shape.cx1,
      cy1 = shape.cy1,
      a = shape.a,
      b = shape.b,
      a1 = shape.a1,
      b1 = shape.b1,
      index = shape.index;

    funnelBlock(ctx, cx, cy, cx1, cy1, a, b, a1, b1, index);

    ctx.closePath();

    function funnelBlock(ctx, cx, cy, cx1, cy1, a, b, a1, b1, i) {
      // 底面
      sector(ctx, cx1, cy1, a1, b1, -PI, PI);
      ctx.closePath();
      ctx.fill();
    }

    // 扇面(顺时针)
    function sector(ctx, x, y, a, b, s, e) {
      var angle = s;
      ctx.lineTo(x + a * Math.cos(s), y + b * Math.sin(s));
      angle += 0.035;
      while (angle <= e) {
        ctx.lineTo(x + a * Math.cos(angle), y + b * Math.sin(angle));
        angle += 0.02;
        ctx.stroke();
      }
      ctx.stroke();
    }
  },
});

// 立方底面
export var Funnel3dButtomCube = graphic.extendShape({
  type: "funnel3dButtomCube",

  shape: {
    cx: 0,

    cy: 0,

    cx1: 0,

    cy1: 0,

    a: 0,

    b: 0,

    a1: 0,

    b1: 0,

    index: 0,

    sort: "ascending",
  },

  buildPath: function (ctx, shape) {
    var cx, cy, cx1, cy1, a, b, a1, b1;

    var cx = shape.cx,
      cy = shape.cy,
      cx1 = shape.cx1,
      cy1 = shape.cy1,
      a = shape.a,
      b = shape.b,
      a1 = shape.a1,
      b1 = shape.b1,
      index = shape.index;

    funnelBlock(ctx, cx, cy, cx1, cy1, a, b, a1, b1, index);

    ctx.closePath();

    function funnelBlock(ctx, cx, cy, cx1, cy1, a, b, a1, b1, i) {
      // 底面
      cube(ctx, cx1, cy1, a1, b1);
      ctx.closePath();
      ctx.fill();
    }

    // 菱形
    function cube(ctx, x, y, a, b) {
      ctx.moveTo(x + a, y);
      // ctx.lineTo(x, y - b);
      ctx.lineTo(x - b * Math.sin(angleZ), y - b * Math.cos(angleZ));
      ctx.lineTo(x - a, y);
      // ctx.lineTo(x, y + b);
      ctx.lineTo(x + b * Math.sin(angleZ), y + b * bRatio * Math.cos(angleZ));
      ctx.lineTo(x + a, y);
      ctx.stroke();
    }
  },
});

// 顶面
export var Funnel3dTop = graphic.extendShape({
  type: "funnel3dTop",

  shape: {
    cx: 0,

    cy: 0,

    cx1: 0,

    cy1: 0,

    a: 0,

    b: 0,

    a1: 0,

    b1: 0,

    point: [],

    point2: [],

    index: 0,

    sort: "ascending",
  },

  buildPath: function (ctx, shape) {
    var PI = Math.PI;
    var cx, cy, cx1, cy1, a, b, a1, b1;

    var cx = shape.cx,
      cy = shape.cy,
      cx1 = shape.cx1,
      cy1 = shape.cy1,
      a = shape.a,
      b = shape.b,
      a1 = shape.a1,
      b1 = shape.b1,
      index = shape.index;

    funnelBlock(ctx, cx, cy, cx1, cy1, a, b, a1, b1, index);

    ctx.closePath();

    function funnelBlock(ctx, cx, cy, cx1, cy1, a, b, a1, b1, i) {
      // 顶面
      sector(ctx, cx, cy, a, b, -PI, PI);
      ctx.closePath();
      ctx.fill();
    }

    // 扇面(顺时针)
    function sector(ctx, x, y, a, b, s, e) {
      var angle = s;
      ctx.lineTo(x + a * Math.cos(s), y + b * Math.sin(s));
      angle += 0.035;
      while (angle <= e) {
        ctx.lineTo(x + a * Math.cos(angle), y + b * Math.sin(angle));
        angle += 0.02;
        ctx.stroke();
      }
      ctx.stroke();
    }
  },
});

// 立方顶面
export var Funnel3dTopCube = graphic.extendShape({
  type: "funnel3dTopCube",

  shape: {
    cx: 0,

    cy: 0,

    cx1: 0,

    cy1: 0,

    a: 0,

    b: 0,

    a1: 0,

    b1: 0,

    index: 0,

    sort: "ascending",
  },

  buildPath: function (ctx, shape) {
    var cx, cy, cx1, cy1, a, b, a1, b1;

    var cx = shape.cx,
      cy = shape.cy,
      cx1 = shape.cx1,
      cy1 = shape.cy1,
      a = shape.a,
      b = shape.b,
      a1 = shape.a1,
      b1 = shape.b1,
      index = shape.index;

    funnelBlock(ctx, cx, cy, cx1, cy1, a, b, a1, b1, index);

    ctx.closePath();

    function funnelBlock(ctx, cx, cy, cx1, cy1, a, b, a1, b1, i) {
      // 底面
      cube(ctx, cx, cy, a, b);
      ctx.closePath();
      ctx.fill();
    }

    // 菱形
    function cube(ctx, x, y, a, b) {
      ctx.moveTo(x + a, y);
      // ctx.lineTo(x, y - b);
      ctx.lineTo(x - b * Math.sin(angleZ), y - b * Math.cos(angleZ));
      ctx.lineTo(x - a, y);
      // ctx.lineTo(x, y + b);
      ctx.lineTo(x + b * Math.sin(angleZ), y + b * bRatio * Math.cos(angleZ));
      ctx.lineTo(x + a, y);
      ctx.stroke();
    }
  },
});

// 侧面
export var Funnel3dSide = graphic.extendShape({
  type: "funnel3dSide",

  shape: {
    cx: 0,

    cy: 0,

    cx1: 0,

    cy1: 0,

    a: 0,

    b: 0,

    a1: 0,

    b1: 0,

    point: [],

    point2: [],

    index: 0,

    sort: "ascending",
  },

  buildPath: function (ctx, shape) {
    var PI = Math.PI;
    var cx, cy, cx1, cy1, a, b, a1, b1;
    var gap = 0;

    var cx = shape.cx,
      cy = shape.cy,
      cx1 = shape.cx1,
      cy1 = shape.cy1,
      a = shape.a,
      b = shape.b,
      a1 = shape.a1,
      b1 = shape.b1,
      point = typeof shape.point == "string" ? JSON.parse(shape.point) : [],
      point2 = typeof shape.point2 == "string" ? JSON.parse(shape.point2) : [],
      index = shape.index,
      sort = shape.sort;

    var pointLength = point.length - 1;

    funnelBlock(ctx, cx, cy, cx1, cy1, a, b, a1, b1, index, sort);

    ctx.closePath();

    // 绘制侧面
    function funnelBlock(ctx, cx, cy, cx1, cy1, a, b, a1, b1, i, sort) {
      var ctrlPiontIndex = 0;
      ctrlPiontIndex = i;
      // 右侧边线
      ctx.moveTo(cx + a * Math.cos(0), cy + b * Math.sin(0));
      var ctrlP = getCtrlPoint(point, ctrlPiontIndex, 0.2, 0.2);
      ctx.bezierCurveTo(
        ctrlP.pA.x,
        ctrlP.pA.y,
        ctrlP.pB.x,
        ctrlP.pB.y,
        point[ctrlPiontIndex + 1].x,
        point[ctrlPiontIndex + 1].y
      );
      sector(ctx, cx1, cy1, a1, b1, 0, PI);
      // 左侧边线
      ctrlPiontIndex = pointLength - 1 - i;
      var ctrlP = getCtrlPoint(point2, ctrlPiontIndex, 0.2, 0.2);
      ctx.bezierCurveTo(
        ctrlP.pA.x,
        ctrlP.pA.y,
        ctrlP.pB.x,
        ctrlP.pB.y,
        point2[ctrlPiontIndex + 1].x + (i == pointLength - 1 ? 0 : gap / 2),
        point2[ctrlPiontIndex + 1].y + (i == pointLength - 1 ? 0 : gap)
      );
      sector1(ctx, cx, cy, a, b, PI, 0);
      ctx.closePath();
      ctx.fill();
    }

    // 扇面(顺时针)
    function sector(ctx, x, y, a, b, s, e) {
      var angle = s;
      ctx.lineTo(x + a * Math.cos(s), y + b * Math.sin(s));
      angle += 0.035;
      while (angle <= e) {
        ctx.lineTo(x + a * Math.cos(angle), y + b * Math.sin(angle));
        angle += 0.02;
        ctx.stroke();
      }
      ctx.stroke();
    }
    // 逆向扇面（逆时针）
    function sector1(ctx, x, y, a, b, s, e) {
      var angle = s;
      ctx.lineTo(x + a * Math.cos(s), y + b * Math.sin(s));
      angle -= 0.035;
      while (angle >= e) {
        ctx.lineTo(x + a * Math.cos(angle), y + b * Math.sin(angle));
        angle -= 0.02;
      }
      ctx.stroke();
    }

    /**
     * 获取控制点
     **/
    function getCtrlPoint(ps, i, a, b) {
      var maxIndex = ps.length - 1;
      if (!a || !b) {
        a = 0.25;
        b = 0.25;
      }
      var pAx, pAy, pBx, pBy;
      if (i == 0) {
        pAx = ps[0].x + (ps[1].x - ps[0].x) / 4;
        pAy = ps[0].y + (ps[1].y - ps[0].y) / 4;
      } else {
        pAx = ps[i].x + (ps[i + 1].x - ps[i - 1].x) * a;
        pAy = ps[i].y + (ps[i + 1].y - ps[i - 1].y) * a;
      }
      if (i == maxIndex - 1) {
        pBx = ps[i + 1].x - (ps[i + 1].x - ps[i].x) / 4;
        pBy = ps[i + 1].y - (ps[i + 1].y - ps[i].y) / 4;
      } else {
        pBx = ps[i + 1].x - (ps[i + 2].x - ps[i].x) * b;
        pBy = ps[i + 1].y - (ps[i + 2].y - ps[i].y) * b;
      }
      return {
        pA: {
          x: pAx,
          y: pAy,
        },
        pB: {
          x: pBx,
          y: pBy,
        },
      };
    }
  },
});

// 直线侧面
export var Funnel3dSideStraight = graphic.extendShape({
  type: "funnel3dSideStraight",

  shape: {
    cx: 0,

    cy: 0,

    cx1: 0,

    cy1: 0,

    a: 0,

    b: 0,

    a1: 0,

    b1: 0,

    index: 0,

    sort: "ascending",
  },

  buildPath: function (ctx, shape) {
    var PI = Math.PI;
    var cx, cy, cx1, cy1, a, b, a1, b1;

    var cx = shape.cx,
      cy = shape.cy,
      cx1 = shape.cx1,
      cy1 = shape.cy1,
      a = shape.a,
      b = shape.b,
      a1 = shape.a1,
      b1 = shape.b1,
      index = shape.index,
      sort = shape.sort;

    funnelBlock(ctx, cx, cy, cx1, cy1, a, b, a1, b1, index, sort);

    ctx.closePath();

    function funnelBlock(ctx, cx, cy, cx1, cy1, a, b, a1, b1, i, sort) {
      // 右侧边线
      ctx.moveTo(cx + a * Math.cos(0), cy + b * Math.sin(0));
      ctx.lineTo(cx1 + a1 * Math.cos(0), cy1 + b1 * Math.sin(0));
      sector(ctx, cx1, cy1, a1, b1, 0, PI);
      ctx.lineTo(cx1 + a1 * Math.cos(PI), cy1 + b1 * Math.sin(PI));
      ctx.lineTo(cx + a * Math.cos(PI), cy + b * Math.sin(PI));
      sector1(ctx, cx, cy, a, b, PI, 0);
      ctx.lineTo(cx + a * Math.cos(0), cy + b * Math.sin(0));
      ctx.closePath();
      ctx.fill();
    }

    // 扇面(顺时针)
    function sector(ctx, x, y, a, b, s, e) {
      var angle = s;
      ctx.lineTo(x + a * Math.cos(s), y + b * Math.sin(s));
      angle += 0.035;
      while (angle <= e) {
        ctx.lineTo(x + a * Math.cos(angle), y + b * Math.sin(angle));
        angle += 0.02;
        ctx.stroke();
      }
      ctx.stroke();
    }
    // 逆向扇面（逆时针）
    function sector1(ctx, x, y, a, b, s, e) {
      var angle = s;
      ctx.lineTo(x + a * Math.cos(s), y + b * Math.sin(s));
      angle -= 0.035;
      while (angle >= e) {
        ctx.lineTo(x + a * Math.cos(angle), y + b * Math.sin(angle));
        angle -= 0.02;
      }
      ctx.stroke();
    }
  },
});

// 左侧面
export var Funnel3dSideLeft = graphic.extendShape({
  type: "funnel3dSideLeft",

  shape: {
    cx: 0,

    cy: 0,

    cx1: 0,

    cy1: 0,

    a: 0,

    b: 0,

    a1: 0,

    b1: 0,

    index: 0,

    sort: "ascending",
  },

  buildPath: function (ctx, shape) {
    var cx, cy, cx1, cy1, a, b, a1, b1;

    var cx = shape.cx,
      cy = shape.cy,
      cx1 = shape.cx1,
      cy1 = shape.cy1,
      a = shape.a,
      b = shape.b,
      a1 = shape.a1,
      b1 = shape.b1,
      index = shape.index;

    funnelBlock(ctx, cx, cy, cx1, cy1, a, b, a1, b1, index);

    ctx.closePath();

    function funnelBlock(ctx, cx, cy, cx1, cy1, a, b, a1, b1, i) {
      cube(ctx, cx, cy, cx1, cy1, a, b, a1, b1);
      ctx.closePath();
      ctx.fill();
    }

    // 菱形
    function cube(ctx, cx, cy, cx1, cy1, a, b, a1, b1) {
      ctx.moveTo(cx - a, cy);
      ctx.lineTo(cx1 - a1, cy1);
      // ctx.lineTo(cx1, cy1 + b1);
      // ctx.lineTo(cx, cy + b);
      ctx.lineTo(
        cx1 + b1 * Math.sin(angleZ),
        cy1 + b1 * bRatio * Math.cos(angleZ)
      );
      ctx.lineTo(cx + b * Math.sin(angleZ), cy + b * bRatio * Math.cos(angleZ));
      ctx.lineTo(cx - a, cy);
      ctx.stroke();
    }
  },
});

// 右侧面
export var Funnel3dSideRight = graphic.extendShape({
  type: "funnel3dSideRight",

  shape: {
    cx: 0,

    cy: 0,

    cx1: 0,

    cy1: 0,

    a: 0,

    b: 0,

    a1: 0,

    b1: 0,

    index: 0,

    sort: "ascending",
  },

  buildPath: function (ctx, shape) {
    var cx, cy, cx1, cy1, a, b, a1, b1;

    var cx = shape.cx,
      cy = shape.cy,
      cx1 = shape.cx1,
      cy1 = shape.cy1,
      a = shape.a,
      b = shape.b,
      a1 = shape.a1,
      b1 = shape.b1,
      index = shape.index;

    funnelBlock(ctx, cx, cy, cx1, cy1, a, b, a1, b1, index);

    ctx.closePath();

    function funnelBlock(ctx, cx, cy, cx1, cy1, a, b, a1, b1, i) {
      cube(ctx, cx, cy, cx1, cy1, a, b, a1, b1);
      ctx.closePath();
      ctx.fill();
    }

    // 菱形
    function cube(ctx, cx, cy, cx1, cy1, a, b, a1, b1) {
      ctx.moveTo(cx + a, cy);
      ctx.lineTo(cx1 + a1, cy1);
      // ctx.lineTo(cx1, cy1 + b1);
      // ctx.lineTo(cx, cy + b);
      ctx.lineTo(
        cx1 + b1 * Math.sin(angleZ),
        cy1 + b1 * bRatio * Math.cos(angleZ)
      );
      ctx.lineTo(cx + b * Math.sin(angleZ), cy + b * bRatio * Math.cos(angleZ));
      ctx.lineTo(cx + a, cy);
      ctx.stroke();
    }
  },
});

// export {
//   Funnel3dSide,
//   Funnel3dTop,
//   Funnel3dButtom,
//   Funnel3dButtomCube,
//   Funnel3dTopCube,
//   Funnel3dSideLeft,
//   Funnel3dSideRight,
//   Funnel3dSideStraight,
// };


// module.exports = {
//   funnel3dSide: funnel3dSide,
//   funnel3dTop: funnel3dTop,
//   funnel3dButtom: funnel3dButtom,
//   funnel3dButtomCube: funnel3dButtomCube,
//   funnel3dTopCube: funnel3dTopCube,
//   funnel3dSideLeft: funnel3dSideLeft,
//   funnel3dSideRight: funnel3dSideRight,
//   funnel3dSideStraight: funnel3dSideStraight,
// };
