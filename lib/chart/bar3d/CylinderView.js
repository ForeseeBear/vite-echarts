import * as zrUtil from "zrender/src/core/util";
import * as graphic from "../../util/graphic";

import { CylinderSurface, Ellipse, Rect } from "./graphic";

import {
    getBestLightColor,
    getBestBackColor,
    liftColor,
    lerpColor,
    setStyle
} from "../../util/util";

import helper from "./helper";

export function cylinderView(
    data,
    dataIndex,
    itemModel,
    layout,
    isHorizontal,
    animationModel,
    isUpdate
) {
    var g = new graphic.Group();
    g.isHorizontal = isHorizontal;

    // 绘制文字图形容器
    var text = element["text"](layout, isHorizontal);

    // 绘制正面
    var frontSide = element["frontSide"](layout, isHorizontal);

    var bottomSurface = element["bottomSurface"](layout, isHorizontal);

    var topSurface = element["topSurface"](layout, isHorizontal);

    g.add(frontSide);
    g.add(bottomSurface);
    g.add(topSurface);
    g.add(text);

    // Animation
    if (animationModel) {
        // 正面动画
        animator(frontSide, animationModel, dataIndex, isHorizontal, isUpdate);

        // 文字动画
        animator(text, animationModel, dataIndex, isHorizontal, isUpdate);

        // 顶面动画
        animator(topSurface, animationModel, dataIndex, isHorizontal, isUpdate);
    }

    return g;
}

var element = {
    frontSide(layout, isHorizontal) {
        var shape = layoutMapping["frontSide"](layout, isHorizontal);
        return new CylinderSurface({
            name: "frontSide",
            shape: shape
        });
    },

    text(layout, isHorizontal) {
        var shape = layoutMapping["text"](layout, isHorizontal);
        return new Rect({
            shape: shape,
            name: "text",
            fillNone: true,
            z2: 10 // 文字层级在最上层
        });
    },

    bottomSurface(layout, isHorizontal) {
        var shape = layoutMapping["bottomSurface"](layout, isHorizontal);

        return new Ellipse({
            name: "bottomSurface",
            fillNone: true,
            shape: shape
        });
    },

    topSurface(layout, isHorizontal) {
        var shape = layoutMapping["topSurface"](layout, isHorizontal);

        return new Ellipse({
            name: "topSurface",
            shape: shape
        });
    }
};

var layoutMapping = {
    frontSide(layout, isHorizontal) {
        var shape = zrUtil.extend(
            {
                isHorizontal
            },
            layout
        );
        if (isHorizontal) {
            shape.y -= shape.width / 8;
        } else {
            shape.x += shape.height / 8;
        }

        return shape;
    },

    text(layout, isHorizontal) {
        var shape = zrUtil.extend(
            {
                isHorizontal
            },
            layout
        );

        return shape;
    },

    bottomSurface(layout, isHorizontal) {
        var shape = zrUtil.extend(
            {
                isHorizontal,
                isTop: false
            },
            layout
        );

        return shape;
    },

    topSurface(layout, isHorizontal) {
        var shape = zrUtil.extend(
            {
                isHorizontal,
                isTop: true
            },
            layout
        );

        return shape;
    }
};

/**
 * 动画设置
 */
function animator(el, animationModel, dataIndex, isHorizontal, isUpdate) {
    var shape = el.shape;
    var property = isHorizontal ? "height" : "width";
    var animateTarget = {};

    animateTarget[property] = shape[property];
    shape[property] = 0;

    graphic[isUpdate ? "updateProps" : "initProps"](
        el,
        {
            shape: animateTarget
        },
        animationModel,
        dataIndex
    );
}

/**
 * 设置圆柱体图形样式
 * @param {Path} el
 * @param {Array} data
 * @param {Number} dataIndex
 * @param {Object} itemModel
 * @param {Object} layout
 * @param {Object} seriesModel
 * @param {Boolean} isHorizontal
 */
export function setCylinderStyle(
    el,
    data,
    dataIndex,
    itemModel,
    layout,
    seriesModel,
    isHorizontal
) {
    var hoverStyle = itemModel.getModel("emphasis.itemStyle").getBarItemStyle();

    var color = data.getItemVisual(dataIndex, "color");
    var opacity = data.getItemVisual(dataIndex, "opacity");
    var itemStyleModel = itemModel.getModel("itemStyle");
    var frontSide = el.childOfName("frontSide"),
        bottomSurface = el.childOfName("bottomSurface"),
        topSurface = el.childOfName("topSurface"),
        text = el.childOfName("text");
    var topColor = getBestLightColor(color);
    var backColor = getBestBackColor(color);
    var barStyle = itemStyleModel.getBarItemStyle();

    // 设置顶部样式
    setStyle(topSurface, barStyle, liftColor(topColor, -0.2), opacity);

    // 设置底部样式
    var backStyle = zrUtil.defaults(
        {
            stroke: color ? lerpColor(color, -0.2) : "none",
            lineWidth: color ? 0.3 : 0
        },
        barStyle
    );

    setStyle(bottomSurface, backStyle, backColor, opacity);

    // 设置正面的样式
    setStyle(frontSide, barStyle, color, opacity);

    if (text) {
        // 呈现标签的元素，不显示
        text.useStyle(
            zrUtil.defaults({
                fill: "rgba(0,0,0,0)",
                stroke: "rgba(0,0,0,0)"
            })
        );

        var labelPositionOutside = isHorizontal
            ? layout.height > 0
                ? "bottom"
                : "top"
            : layout.width > 0
                ? "left"
                : "right";

        helper.setLabel(
            text.style,
            hoverStyle,
            itemModel,
            color,
            seriesModel,
            dataIndex,
            labelPositionOutside
        );
    }

    helper.setCylinderHoverStyle(el, hoverStyle, topColor);
}

/**
 * 放大缩小时，更新圆柱体图形
 * @param {Group} el
 * @param {Object} layout
 * @param {Boolean} isHorizontal
 * @param {Object} animationModel
 * @param {Number} newIndex
 */
export function updateCylinderView(
    el,
    layout,
    isHorizontal,
    animationModel,
    newIndex
) {
    el.eachChild(function (childEl) {
        var shape = layoutMapping[childEl.name](layout, isHorizontal);
        graphic.updateProps(
            childEl,
            {
                shape: {
                    x: shape.x,
                    y: shape.y,
                    width: shape.width,
                    height: shape.height
                }
            },
            animationModel,
            newIndex
        );
    });
}

/**
 * 获取柱子光效裁剪路径
 * @param {*} layout
 * @param {*} isHorizontal
 */
export function getCylinderClipPath(layout, isHorizontal) {
    var frontSide = element["frontSide"](layout, isHorizontal);
    // 设置融合裁剪路径
    var clipPath = new graphic.CompoundPath({
        shape: {
            paths: [frontSide]
        }
    });

    return clipPath;
}
