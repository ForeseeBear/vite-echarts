import * as zrUtil from 'zrender/src/core/util';
import * as colorUtil from 'zrender/src/tool/color';

import * as graphic from '../../util/graphic';
import { makeInner } from '../../util//model';
import { setLabelStyle } from '../../label/labelStyle';
import {
    getBestLightColor,
    getBestBackColor,
    lerpColor
} from '../../util/util';

import {
    liftColor
} from '../../util/states'

var getSavedStates = makeInner();
var helper = {};

function setLabel(normalStyle, hoverStyle, itemModel, color, seriesModel, dataIndex, labelPositionOutside) {
    var labelModel = itemModel.getModel('label');
    var hoverLabelModel = itemModel.getModel('emphasis.label');
    // graphic.setLabelStyle(normalStyle, hoverStyle, labelModel, hoverLabelModel, { gai
    setLabelStyle(normalStyle, hoverStyle, labelModel, hoverLabelModel, {
        labelFetcher: seriesModel,
        labelDataIndex: dataIndex,
        defaultText: seriesModel.getRawValue(dataIndex),
        isRectText: true,
        autoColor: color
    });
    fixPosition(normalStyle);
    fixPosition(hoverStyle);
}

function fixPosition(style, labelPositionOutside) {
    if (style.textPosition === 'outside') {
        style.textPosition = labelPositionOutside;
    }
}

helper.setLabel = setLabel;

/**
 * 设置立方体鼠标移上样式
 * @date 2020-02-11
 * @param {any} el
 * @param {any} hoverStyle
 * @param {any} color
 * @returns {any}
 */
helper.setCubeHoverStyle = function (el, hoverStyle, color) {
    // graphic.setHoverStyle(el, {});

    color = hoverStyle.fill || color;
    hoverStyle.text = '';
    var rightSide = el.childOfName('rightSide'),
        bottomSurface = el.childOfName('bottomSurface'),
        topSurface = el.childOfName('topSurface'),
        leftSide = el.childOfName('leftSide');

    var topColor = getBestLightColor(color); // 渐变色时获取最亮色
    var backColor = getBestBackColor(color); // 渐变色时获取最暗色

    var frontSide = el.childOfName('frontSide');

    // 设置顶部样式
    graphic.setHoverStyle(topSurface, zrUtil.defaults({ fill: liftColor(topColor, -0.2) }, hoverStyle));

    // 设置底部样式
    graphic.setHoverStyle(bottomSurface, zrUtil.defaults({ fill: backColor }, hoverStyle));

    //设置右侧面样式
    graphic.setHoverStyle(rightSide, zrUtil.defaults({ fill: lerpColor(color, 0.2) }, hoverStyle));

    // 设置左侧面样式
    graphic.setHoverStyle(leftSide, zrUtil.defaults({ fill: color }, hoverStyle));

    //设置正面样式
    graphic.setHoverStyle(frontSide, zrUtil.defaults({ fill: color }, hoverStyle));
}

/**
 * 设置圆柱体鼠标移上样式
 * @date 2020-02-11
 * @param {any} el
 * @param {any} hoverStyle
 * @param {any} color
 * @returns {any}
 */
helper.setCylinderHoverStyle = function (el, hoverStyle, color) {
    graphic.setHoverStyle(el, {});
    color = hoverStyle.fill || color;
    hoverStyle.text = '';

    var frontSide = el.childOfName('frontSide'),
        bottomSurface = el.childOfName('bottomSurface'),
        topSurface = el.childOfName('topSurface');

    var topColor = getBestLightColor(color);
    var backColor = getBestBackColor(color);

    // 设置顶部样式
    graphic.setHoverStyle(topSurface, zrUtil.defaults({ fill: liftColor(topColor, -0.2) }, hoverStyle));

    graphic.setHoverStyle(bottomSurface, zrUtil.defaults({ fill: backColor }, h2overStyle));

    // 设置正面的样式
    graphic.setHoverStyle(frontSide, zrUtil.defaults({ fill: color }, hoverStyle));

}

/**
 * 颜色计算得出 融合颜色的另一种颜色
 */
helper.getBlendColor = function (color, seriesModel) {
    var bgColor, blendColor;
    var bgModel = seriesModel.bgModel;

    // 未设置背景色
    if (!bgModel) {
        return color;
    } else {
        bgColor = bgModel.get('itemStyle.color');

        bgColor = colorUtil.parse(bgColor);
        color = colorUtil.parse(color);

        if (color[3] === 1) {
            blendColor = color;
        } else {
            var a = (color[3] - bgColor[3]) / (1 - bgColor[3]); // 计算透明度
            blendColor = [
                (color[0] * color[3] - bgColor[0] * bgColor[3] * (1 - a)) / a,
                (color[1] * color[3] - bgColor[1] * bgColor[3] * (1 - a)) / a,
                (color[2] * color[3] - bgColor[2] * bgColor[3] * (1 - a)) / a,
                a
            ]
        }
        return colorUtil.stringify(blendColor, 'rgba');
    }
}

export default helper;


