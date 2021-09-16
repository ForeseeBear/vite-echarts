import * as zrUtil from "zrender/src/core/util";
import * as graphic from "../../util/graphic";
import { setLabelStyle, getLabelStatesModels } from '../../label/labelStyle';
import { getDefaultLabel } from '../helper/labelHelper';
import { CylinderSurface, Ellipse } from "./Bar3dGraphic";
import { setStatesStylesFromModel, enableHoverEmphasis } from '../../util/states3d';

import {
    getBestLightColor,
    getBestBackColor,
    liftColor,
    lerpColor,
    setStyle
} from "../../util/util";

export function cylinderView(
    data,
    dataIndex,
    itemModel,
    layout,
    isHorizontal,
    animationModel,
    seriesModel,
    isUpdate
) {
    var style = data.getItemVisual(dataIndex, 'style');
    var g = new graphic.Group();
    g.isHorizontal = isHorizontal;

    // 绘制正面
    var frontSide = element["frontSide"](layout, isHorizontal);

    var bottomSurface = element["bottomSurface"](layout, isHorizontal);

    var topSurface = element["topSurface"](layout, isHorizontal);

    g.add(frontSide);
    g.add(bottomSurface);
    g.add(topSurface);

    var labelPositionOutside = isHorizontal ? (layout.height >= 0 ? 'bottom' : 'top') : (layout.width >= 0 ? 'right' : 'left');
    var labelStatesModels = getLabelStatesModels(itemModel);
    setLabelStyle(frontSide, labelStatesModels, {
        labelFetcher: seriesModel,
        labelDataIndex: dataIndex,
        defaultText: getDefaultLabel(seriesModel.getData(), dataIndex),
        inheritColor: style.fill,
        defaultOpacity: style.opacity,
        defaultOutsidePosition: labelPositionOutside
    });

    // Animation
    if (animationModel) {
        // 正面动画
        animator(frontSide, animationModel, dataIndex, isHorizontal, isUpdate);

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
    var style = data.getItemVisual(dataIndex, 'style')
    var color = style?.fill || style.color;
    var emphasisModel = itemModel.getModel(['emphasis']);
    var opacity = itemModel.get(['itemStyle', 'opacity'])//seriesModel.get(['itemStyle', 'opacity'])
    var frontSide = el.childOfName("frontSide"),
        topSurface = el.childOfName("topSurface"),
        bottomSurface = el.childOfName("bottomSurface");
    var topColor = getBestLightColor(color);
    var backColor = getBestBackColor(color);
    var barStyle = itemModel.getModel('itemStyle')


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

    // 设置鼠标移上样式
    enableHoverEmphasis(el, emphasisModel.get('focus'), emphasisModel.get('blurScope'));
    setStatesStylesFromModel(el, itemModel);
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
