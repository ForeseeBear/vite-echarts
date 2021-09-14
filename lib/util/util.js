import * as zrUtil from "zrender/src/core/util";
import * as colorTool from "zrender/src/tool/color";
var parse = colorTool.parse;

// 最大角度
const MAX_ANGLE = 360;

/**
 * 坐标系转换为角度
 * @param {*} x
 * @param {*} y
 * @param {*} x2
 * @param {*} y2
 */
export function xy2Angle(x, y, x2, y2) {
    const nx2 = x2 - x;
    const ny2 = y2 - y;

    const angle = Math.round((Math.atan2(ny2, nx2) / Math.PI) * 180);

    return angle >= 0 ? angle : MAX_ANGLE + angle;
}

function rgba2hsla(color) {
    if (!color) {
        return;
    } // RGB from 0 to 255

    var rgba = parse(color);
    var R = rgba[0] / 255;
    var G = rgba[1] / 255;
    var B = rgba[2] / 255;
    var vMin = Math.min(R, G, B); // Min. value of RGB

    var vMax = Math.max(R, G, B); // Max. value of RGB

    var delta = vMax - vMin; // Delta RGB value

    var L = (vMax + vMin) / 2;
    var H;
    var S; // HSL results from 0 to 1

    if (delta === 0) {
        H = 0;
        S = 0;
    } else {
        if (L < 0.5) {
            S = delta / (vMax + vMin);
        } else {
            S = delta / (2 - vMax - vMin);
        }

        var deltaR = ((vMax - R) / 6 + delta / 2) / delta;
        var deltaG = ((vMax - G) / 6 + delta / 2) / delta;
        var deltaB = ((vMax - B) / 6 + delta / 2) / delta;

        if (R === vMax) {
            H = deltaB - deltaG;
        } else if (G === vMax) {
            H = 1 / 3 + deltaR - deltaB;
        } else if (B === vMax) {
            H = 2 / 3 + deltaG - deltaR;
        }

        if (H < 0) {
            H += 1;
        }

        if (H > 1) {
            H -= 1;
        }
    }

    var hsla = [H * 360, S, L];

    if (rgba[3] != null) {
        hsla.push(rgba[3]);
    }

    return hsla;
}

function getLight(colors) {
    var hslas = [];
    var max = 0;
    var i = 0;
    var lightColor;

    zrUtil.map(colors, function (color) {
        hslas.push(rgba2hsla(color));
    });

    zrUtil.map(hslas, function (hsla) {
        if (hsla[2] > max) {
            lightColor = colors[i];
            max = hsla[2];
        }
        i++;
    });

    return lightColor;
}

function getBack(colors) {
    var hslas = [];
    var min = 256;
    var i = 0;
    var backColor;

    zrUtil.map(colors, function (color) {
        hslas.push(rgba2hsla(color));
    });

    zrUtil.map(hslas, function (hsla) {
        if (hsla[2] < min) {
            backColor = colors[i];
            min = hsla[2];
        }
        i++;
    });

    return backColor;
}

/**
 * 渐变色获取最亮的颜色
 * @param {*} color
 */
export function getBestLightColor(color) {
    let colorStops;
    if (!color || !(colorStops = color.colorStops)) {
        return color;
    }
    const { x, y, x2, y2 } = color;
    const angle = xy2Angle(x, y, x2, y2);

    if (angle <= 180 && angle > 0) {
        return colorStops[0].color;
    }

    return colorStops[1].color;
}

/**
 * 渐变色获取最暗的颜色
 * @param {*} color
 */
export function getBestBackColor(color) {
    let colorStops;
    if (!color || !(colorStops = color.colorStops)) {
        return color;
    }

    const colors = [];

    zrUtil.map(colorStops, function (item) {
        colors.push(item.color);
    });

    return getBack(colors);
}

/**
 * 颜色高亮
 * @param {String|Object} color
 * @param {Number| -1~1} level
 */
export function liftColor(color, level) {
    if (typeof color == "string") {
        return colorTool.lift(color, level);
    } else {
        // 设置的是渐变色,不改变
        return color;
    }
}

/**
 * 颜色变暗
 * @param {String|Object} color
 * @param {Number| -1~1} level
 */
export function lerpColor(color, level) {
    if (typeof color == "string") {
        return colorTool.lerp(level, [color, "#000"]);
    } else {
        // 设置的是渐变色, 不改变
        return color;
    }
}

/**
 * 设置图形样式
 * @param {*} path
 * @param {*} barStyle
 * @param {*} fillColor
 * @param {*} strokeColor
 * @param {*} opacity
 */
export function setStyle(path, barStyle, fillColor, opacity) {
    path &&
        path.useStyle(
            zrUtil.defaults(
                {
                    fill: path.fillNone ? "none" : fillColor, // 没有填充色
                    stroke: !barStyle.lineWidth ? fillColor : barStyle.stroke || fillColor, // 没有边框色  默认都是有边框的
                    lineWidth: Math.max(0.5, barStyle.lineWidth || 0),
                    opacity: opacity,
                    lineJoin: "round"
                },
                barStyle
            )
        );
}

export function getLayout(seriesModel, layout) {
    layout = zrUtil.clone(layout);
    var cartesian = seriesModel.coordinateSystem;
    var baseAxis = cartesian.getBaseAxis();
    var isHorizontal = baseAxis.isHorizontal();
    var grid = cartesian.master;
    var rect = grid.getRect();

    if (isHorizontal) {
        if (layout.height > 0) {
            layout.height = rect.height - (layout.y - rect.y);
        } else {
            layout.height = -(layout.y - rect.y);
        }
    } else {
        if (layout.width > 0) {
            layout.width = rect.width - (layout.x - rect.x);
        } else {
            layout.width = -(layout.x - rect.x);
        }
    }
    return layout;
}

const cacheImg = {};

/**
 * 改变图片颜色
 * @param {*} url
 * @param {*} color
 */
export function changeImageColor(url, color, selfHeight) {
    let canvas;
    let key = url + color + selfHeight;
    let image;

    if ((canvas = cacheImg[key])) {
        return canvas;
    }
    canvas = document.createElement("canvas");
    image = new Image();
    image.src = url;
    image.selfHeight = selfHeight;

    image.onload = function () {
        let height = this.selfHeight;
        let h = Math.ceil((height || this.height) / this.height) * this.height; // 进行一个向上取整处理
        let w = (canvas.width = this.width);
        canvas.height = h;
        let ctx = canvas.getContext("2d");
        // 做下兼容性处理
        let colorArr = parse(color || "#fff");
        let i = 0,
            l = h / this.height;
        for (; i < l; i++) {
            ctx.drawImage(this, 0, i * this.height);
        }
        let imageData = ctx.getImageData(0, 0, w, h);
        let data = imageData.data;

        // 白色时不进行颜色替换
        if (colorArr && (colorArr[0] !== 255 || colorArr[1] !== 255 || colorArr[2] !== 255)) {
            let i = 0,
                len = data.length;
            for (; i < len; i += 4) {
                if (data[i + 3] !== 0) {
                    data[i] = colorArr[0];
                    data[i + 1] = colorArr[1];
                    data[i + 2] = colorArr[2];
                    data[i + 3] *= colorArr[3];
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
    };

    cacheImg[key] = canvas;

    return canvas;
}

/**
 * 设置图片元素样式
 * @param {*} opts
 */
export function setImageElementStyle(opts) {
    return new Promise((resolve) => {
        const { imageElement, layout, itemStyle, isHorizontal, limit = 0, imgPath = itemStyle.get("imgPath") } = opts;

        const width = isHorizontal ? layout.width : layout.height;
        const color = itemStyle.get("color");
        const key = imgPath + color + "_" + limit + "_" + width;

        if (cacheImg[key]) {
            const canvas = cacheImg[key];
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const scale = width / imgWidth;
            const height = scale * imgHeight;

            imageElement.useStyle({
                image: canvas,
                width: width,
                height: height
            });
            resolve();
        } else {
            const canvas = document.createElement("canvas");
            const image = new Image();
            image.src = imgPath;
            image.selfHeight = limit;

            image.onload = function () {
                const scale = width / this.width; // 计算缩放比例

                let selfHeight = Math.max(this.selfHeight, this.height * scale);
                let h = Math.ceil(selfHeight / (this.height * scale)) * this.height; // 进行一个向上取整处理
                let w = (canvas.width = this.width);
                canvas.height = h;

                imageElement.useStyle({
                    image: canvas,
                    width: width,
                    height: h * scale
                });

                let ctx = canvas.getContext("2d");
                // 做下兼容性处理
                let colorArr = parse(color || "#fff");
                let i = 0;
                let l = h / this.height;

                for (; i < l; i++) {
                    ctx.drawImage(this, 0, i * this.height);
                }
                let imageData = ctx.getImageData(0, 0, w, h);
                let data = imageData.data;

                // 白色时不进行颜色替换
                if (colorArr && (colorArr[0] !== 255 || colorArr[1] !== 255 || colorArr[2] !== 255)) {
                    let i = 0,
                        len = data.length;
                    for (; i < len; i += 4) {
                        if (data[i + 3] !== 0) {
                            data[i] = colorArr[0];
                            data[i + 1] = colorArr[1];
                            data[i + 2] = colorArr[2];
                            data[i + 3] *= colorArr[3];
                        }
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                cacheImg[key] = canvas;
                resolve();
            };
        }
    });
}

/**
 * 将值限制在某个值域范围
 * @param {*} min
 * @param {*} max
 * @param {*} value
 */
export function clamp(min, max, value) {
    return Math.min(Math.max(min, value || 0), max);
}

/**
 * 渐变色进行坐标系处理
 * @param {*} color
 * @param {*} coordSys
 */
export function gradient2Grid(color, data, coordSys) {
    // 如果颜色不是渐变色不用处理
    if (zrUtil.isString(color) || !color) {
        return color;
    }

    let range = axisRange(data, coordSys);
    color = zrUtil.clone(color);
    color.global = true;

    let xd = range.x[1] - range.x[0];
    let yd = range.y[1] - range.y[0];

    color.x = range.x[0] + color.x * xd;
    color.x2 = range.x[0] + color.x2 * xd;

    color.y = range.y[0] + color.y * yd;
    color.y2 = range.y[0] + color.y2 * yd;

    return color;
}

/**
 * 根据绘制图形计算最大值和最小值之后还要做坐标系范围计算
 */
export function axisRange(data, coordSys) {
    let layout;
    let xRange = [];
    let yRange = [];

    let rect = coordSys.grid._rect;

    let { x, y, width, height } = rect;

    data.mapArray(function (i) {
        layout = data.getItemLayout(i);
        if (layout) {
            if (!isNaN(layout[0])) {
                xRange.push(Math.round(layout[0]));
            }
            if (!isNaN(layout[1])) {
                yRange.push(Math.round(layout[1]));
            }
        }
    });

    let xMin = Math.min(...xRange);
    let xMax = Math.max(...xRange);
    let yMin = Math.min(...yRange);
    let yMax = Math.max(...yRange);

    xMin = Math.max(x, xMin);
    xMax = Math.min(x + width, xMax);

    yMin = Math.max(y, yMin);
    yMax = Math.min(y + height, yMax);

    // 百分比模式
    if (yMin === yMax && y === yMax) {
        yMax = y + height;
    }

    return {
        x: [xMin, xMax],
        y: [yMin, yMax]
    };
}

function createEmphasisDefaultState(el, stateName, targetStates, state) {
    var hasSelect = targetStates && indexOf(targetStates, 'select') >= 0;
    var cloned = false;

    if (el instanceof Path) {
        var store = getSavedStates(el);
        var fromFill = hasSelect ? store.selectFill || store.normalFill : store.normalFill;
        var fromStroke = hasSelect ? store.selectStroke || store.normalStroke : store.normalStroke;

        //   if (hasFillOrStroke(fromFill) || hasFillOrStroke(fromStroke)) {
        state = state || {};
        var emphasisStyle = state.style || {}; // inherit case

        if (emphasisStyle.fill === 'inherit') {
            cloned = true;
            state = extend({}, state);
            emphasisStyle = extend({}, emphasisStyle);
            emphasisStyle.fill = fromFill;
        } // Apply default color lift
        else if (!hasFillOrStroke(emphasisStyle.fill) && hasFillOrStroke(fromFill)) {
            cloned = true; // Not modify the original value.

            state = extend({}, state);
            emphasisStyle = extend({}, emphasisStyle); // Already being applied 'emphasis'. DON'T lift color multiple times.

            emphasisStyle.fill = liftColor(fromFill);
        } // Not highlight stroke if fill has been highlighted.
        else if (!hasFillOrStroke(emphasisStyle.stroke) && hasFillOrStroke(fromStroke)) {
            if (!cloned) {
                state = extend({}, state);
                emphasisStyle = extend({}, emphasisStyle);
            }

            emphasisStyle.stroke = liftColor(fromStroke);
        }

        state.style = emphasisStyle;
        //   }
    }

    if (state) {
        // TODO Share with textContent?
        if (state.z2 == null) {
            if (!cloned) {
                state = extend({}, state);
            }

            var z2EmphasisLift = el.z2EmphasisLift;
            state.z2 = el.z2 + (z2EmphasisLift != null ? z2EmphasisLift : Z2_EMPHASIS_LIFT);
        }
    }

    return state;
}

function elementStateProxy(stateName, targetStates) {
    var state = this.states[stateName];


    this.traverse(function (child) {
        if (child.style) {
            if (stateName === 'emphasis') {
                return createEmphasisDefaultState(child, stateName, targetStates, state);
            } else if (stateName === 'blur') {
                return createBlurDefaultState(child, stateName, state);
            } else if (stateName === 'select') {
                return createSelectDefaultState(child, stateName, state);
            }
        }
    })

    return state;
}

export function setDefaultStateProxy(el) {
    el.stateProxy = elementStateProxy;
    var textContent = el.getTextContent();
    var textGuide = el.getTextGuideLine();

    if (textContent) {
        textContent.stateProxy = elementStateProxy;
    }

    if (textGuide) {
        textGuide.stateProxy = elementStateProxy;
    }
}