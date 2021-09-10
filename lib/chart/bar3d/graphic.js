import * as graphic from '../../util/graphic';

/**
 * 立方体侧边绘制路径
 */
export var CubeSide = graphic.extendShape({
    type: 'CubeSide',
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        shapeLength: 0,
        isHorizontal: true
    },
    buildPath: function (ctx, shape) {

        var x = shape.x;
        var y = shape.y;

        var h = shape.height;
        var w = shape.width;
        var l = shape.shapeLength;

        var isH = shape.isHorizontal;

        var angle = Math.PI / 4;
        var r = isH ? w : h;
        var r1 = l || r;

        var cosY = r1 * Math.cos(angle) / 2;
        var sinX = r1 * Math.sin(angle) / 2;

        if (isH) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + sinX, y - cosY);
            ctx.lineTo(x + sinX, y - cosY + h);
            ctx.lineTo(x, y + h);
        } else {
            ctx.moveTo(x, y);
            ctx.lineTo(x + sinX, y - cosY);
            ctx.lineTo(x + w + sinX, y - cosY);
            ctx.lineTo(x + w, y);
        }
        ctx.closePath();
    }
})

/**
 * 立方体顶面绘制路径
 */
export var CubeSurface = graphic.extendShape({
    type: 'CubeSurface',
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        shapeLength: 0,
        isHorizontal: true
    },
    buildPath: function (ctx, shape) {

        var x = shape.x;
        var y = shape.y;

        var h = shape.height;
        var w = shape.width;
        var l = shape.shapeLength;

        var isH = shape.isHorizontal;

        var angle = Math.PI / 4;
        var r = isH ? w : h;
        var r1 = l || r;

        var cosY = r1 * Math.cos(angle) / 2;
        var sinX = r1 * Math.sin(angle) / 2;

        if (isH) {
            y += h;
            ctx.moveTo(x, y);
            ctx.lineTo(x + w, y);
            ctx.lineTo(x + w + sinX, y - cosY);
            ctx.lineTo(x + sinX, y - cosY);
        } else {
            x += w;
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + h);
            ctx.lineTo(x + sinX, y + h - cosY);
            ctx.lineTo(x + sinX, y - cosY);
        }
        ctx.closePath();
    }
})

/**
 * 立方体正面绘制路径
 */
export var Rect = graphic.extendShape({
    type: 'CubeRect',
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        isHorizontal: true
    },
    buildPath: function (ctx, shape) {

        var x = shape.x;
        var y = shape.y;

        var h = shape.height;
        var w = shape.width;

        ctx.moveTo(x, y + h);
        ctx.lineTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w, y + h);

        ctx.closePath();
    }
});


export var CylinderSurface = graphic.extendShape({
    type: 'CylinderSurface',
    shape: {
        r: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        isHorizontal: true
    },
    buildPath: function (ctx, shape) {
        var k = 0.5522848;
        var x = shape.x;
        var y = shape.y;
        var width = shape.width;
        var height = shape.height;
        var isHorizontal = shape.isHorizontal;

        var ellipse = isHorizontal ? {
            cx: x + width / 2,
            cy: y + height,
            rx: width / 2, // 减1，因为看椭圆看起来比正方体大
            ry: width / 8
        } : {
                cx: x + width,
                cy: y + height / 2,
                rx: height / 8,
                ry: height / 2
            };

        var x = ellipse.cx;
        var y = ellipse.cy;
        var a = ellipse.rx;
        var b = ellipse.ry;
        var ox = a * k; // 水平控制点偏移量
        var oy = b * k; // 垂直控制点偏移量

        if (isHorizontal) {
            ctx.moveTo(x - a, y);
            ctx.bezierCurveTo(x - a, y + oy, x - ox, y + b, x, y + b);
            ctx.bezierCurveTo(x + ox, y + b, x + a, y + oy, x + a, y);
            ctx.lineTo(x + a, y);
            y -= height;
            ctx.lineTo(x + a, y);
            ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b); a;
            ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
        } else {
            ctx.moveTo(x, y - b);
            ctx.bezierCurveTo(x - ox, y - b, x - a, y - oy, x - a, y);
            ctx.bezierCurveTo(x - a, y + oy, x - ox, y + b, x, y + b);
            ctx.lineTo(x, y + b);

            x -= width;
            ctx.lineTo(x, y + b);
            ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
            ctx.bezierCurveTo(x - ox, y - oy, x - ox, y - b, x, y - b);
        }

        ctx.closePath();
    }
});


export var Ellipse = graphic.extendShape({
    type: 'ellipse',
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        isHorizontal: true,// 是否竖向
        isTop: true // 是否顶部
    },

    buildPath: function (ctx, shape) {
        const { isTop, isHorizontal, width, height } = shape;
        var k = 0.5522848;
        var x, y, a, b;

        if (isHorizontal) {
            let h = height;
            if (!isTop) {
                if (h < 0) {
                    h = 0;
                }
            } else {
                if (h > 0) {
                    h = 0;
                }
            }
            x = shape.x + width / 2;
            y = shape.y - width / 8 + h;
            a = width / 2;
            b = width / 8;
        } else {
            let w = width;
            if (!isTop) {
                if (w > 0) {
                    w = 0;
                }
            } else {
                if (w < 0) {
                    w = 0;
                }
            }
            x = shape.x + height / 8 + w;//计算得出x坐标
            y = shape.y + height / 2;// 计算得出y坐标

            a = height / 8;// 计算得出x轴方向半径
            b = height / 2;// 计算得出y轴方向半径
        }

        var ox = a * k; // 水平控制点偏移量
        var oy = b * k; // 垂直控制点偏移量

        // 从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
        ctx.moveTo(x - a, y);
        ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
        ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
        ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
        ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
        ctx.closePath();
    }
});


/**
 * 专门用做立方体光效裁剪
 */
export var CubePath = graphic.extendShape({
    type: 'cubePath',
    shape: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        shapeLength: 0,
        isHorizontal: true
    },

    buildPath: function (ctx, shape) {
        var x = shape.x;
        var y = shape.y;

        var h = shape.height;
        var w = shape.width;
        var l = shape.shapeLength;

        var isH = shape.isHorizontal;

        var angle = Math.PI / 4;
        var r = isH ? w : h;
        var r1 = l || r;

        var cosY = r1 * Math.cos(angle) / 2;
        var sinX = r1 * Math.sin(angle) / 2;

        if (isH) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + w, y);
            ctx.lineTo(x + w + sinX, y - cosY);
            ctx.lineTo(x + w + sinX, y - cosY + h);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x, y + h);

        } else {
            ctx.moveTo(x, y);
            ctx.lineTo(x + sinX, y - cosY);
            ctx.lineTo(x + w + sinX, y - cosY);
            ctx.lineTo(x + w, y);
            ctx.lineTo(x + w, y + h);
            ctx.lineTo(x, y + h);
        }
        ctx.closePath();
    }
})

