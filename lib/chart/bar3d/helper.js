import * as zrUtil from 'zrender/src/core/util';
import * as colorUtil from 'zrender/src/tool/color';
import Path from 'zrender/lib/graphic/Path';

import * as graphic from '../../util/graphic';
import { queryDataIndex, makeInner } from '../../util//model';
import { setLabelStyle, getLabelStatesModels, setLabelValueAnimation } from '../../label/labelStyle';
import {
    getBestLightColor,
    getBestBackColor,
    lerpColor
} from '../../util/util';

import {
    OTHER_STATES,
    defaultStyleGetterMap,
    setAsHighDownDispatcher,
    enableHoverFocus,
    // createEmphasisDefaultState,
    createBlurDefaultState,
    createSelectDefaultState,
    Z2_EMPHASIS_LIFT,
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



helper.setStatesStylesFromModel = function (el, itemModel, styleType, // default itemStyle
    getter) {
    styleType = styleType || 'itemStyle';
    if (el.isGroup) {
        // child.name !== 'bottomSurface' || child.name !== 'topSurface'
        el.traverse(function (child) {
            for (var i = 0; i < OTHER_STATES.length; i++) {
                var stateName = OTHER_STATES[i];
                var model = itemModel.getModel([stateName, styleType]);
                var state = child.ensureState(stateName); // Let it throw error if getterType is not found.
                state.style = getter ? getter(model) : model[defaultStyleGetterMap[styleType]]();
            }
        })
    } else {
        for (var i = 0; i < OTHER_STATES.length; i++) {
            var stateName = OTHER_STATES[i];
            var model = itemModel.getModel([stateName, styleType]);
            var state = el.ensureState(stateName); // Let it throw error if getterType is not found.
            state.style = getter ? getter(model) : model[defaultStyleGetterMap[styleType]]();
        }
    }
}

helper.enableHoverEmphasis = function (el, focus, blurScope) {
    setAsHighDownDispatcher(el, true);
    traverseUpdateState(el, setDefaultStateProxy);
    enableHoverFocus(el, focus, blurScope);
}

function traverseUpdateState(el, updater, commonParam) {
    updateElementState(el, updater, commonParam);
    el.isGroup && el.traverse(function (child) {
        updateElementState(child, updater, commonParam);
    });
}

function updateElementState(el, updater, commonParam) {
    updater(el, commonParam);
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

function elementStateProxy(stateName, targetStates) {
    var state;
    switch (this.name) {
        case 'topSurface':
            var style = this.states[stateName].style || { fill: '#fff' }
            var topColor = getBestLightColor(style.fill); // 渐变色时获取最亮色
            state = {
                style: {
                    ...style,
                    fill: liftColor(topColor, -0.2)
                }
            }
            break
        case 'bottomSurface':
            var style = this.states[stateName].style || { fill: '#fff' }
            var bottomColor = getBestBackColor(style.fill); // 渐变色时获取最暗色
            state = {
                style: {
                    ...style,
                    fill: bottomColor
                }
            }
            break
        default:
            state = this.states[stateName]
            break
    }

    if (this.style) {
        if (stateName === 'emphasis') {
            return createEmphasisDefaultState(this, stateName, targetStates, state);
        } else if (stateName === 'blur') {
            return createBlurDefaultState(this, stateName, state);
        } else if (stateName === 'select') {
            return createSelectDefaultState(this, stateName, state);
        }
    }

    return state;
}

function createEmphasisDefaultState(el, stateName, targetStates, state) {
    var hasSelect = targetStates && zrUtil.indexOf(targetStates, 'select') >= 0;
    var cloned = false;

    if (el instanceof Path) {
        var store = getSavedStates(el);
        var fromFill = hasSelect ? store.selectFill || store.normalFill : store.normalFill || el.style.fill;
        var fromStroke = hasSelect ? store.selectStroke || store.normalStroke : store.normalStroke || el.style.stroke;

        if (hasFillOrStroke(fromFill) || hasFillOrStroke(fromStroke)) {
            state = state || {};
            var emphasisStyle = state.style || {}; // inherit case

            if (emphasisStyle.fill === 'inherit') {
                cloned = true;
                state = zrUtil.extend({}, state);
                emphasisStyle = zrUtil.extend({}, emphasisStyle);
                emphasisStyle.fill = fromFill;
            } // Apply default color lift
            else if (!hasFillOrStroke(emphasisStyle.fill) && hasFillOrStroke(fromFill)) {
                cloned = true; // Not modify the original value.

                state = zrUtil.extend({}, state);
                emphasisStyle = zrUtil.extend({}, emphasisStyle); // Already being applied 'emphasis'. DON'T lift color multiple times.

                emphasisStyle.fill = liftColor(fromFill);
            } // Not highlight stroke if fill has been highlighted.
            else if (!hasFillOrStroke(emphasisStyle.stroke) && hasFillOrStroke(fromStroke)) {
                if (!cloned) {
                    state = zrUtil.extend({}, state);
                    emphasisStyle = zrUtil.extend({}, emphasisStyle);
                }

                emphasisStyle.stroke = liftColor(fromStroke);
            }

            state.style = emphasisStyle;
        }
    }

    if (state) {
        // TODO Share with textContent?
        if (state.z2 == null) {
            if (!cloned) {
                state = zrUtil.extend({}, state);
            }

            var z2EmphasisLift = el.z2EmphasisLift;
            state.z2 = el.z2 + (z2EmphasisLift != null ? z2EmphasisLift : Z2_EMPHASIS_LIFT);
        }
    }

    return state;
}
function hasFillOrStroke(fillOrStroke) {
    return fillOrStroke != null && fillOrStroke !== 'none';
} // Most lifted color are duplicated.


export default helper;


