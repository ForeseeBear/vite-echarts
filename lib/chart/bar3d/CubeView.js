import * as zrUtil from 'zrender/src/core/util';
import * as graphic from '../../util/graphic';
import { enableHoverEmphasis, OTHER_STATES, defaultStyleGetterMap } from '../../util/states';
import { Sector, updateProps, initProps, removeElementWithFadeOut } from '../../util/graphic';
import { setLabelStyle, getLabelStatesModels, setLabelValueAnimation } from '../../label/labelStyle';
import { getDefaultLabel, getDefaultInterpolatedLabel } from '../helper/labelHelper';

import {
    CubeSide,
    CubeSurface,
    Rect,
    CubePath
} from './graphic';

import {
    getBestLightColor,
    getBestBackColor,
    liftColor,
    lerpColor,
    setStyle
} from '../../util/util';
import helper from './helper';

export function cubeView(data, dataIndex, itemModel, layout, isHorizontal, animationModel, seriesModel, isUpdate, createLabel) {
    var style = data.getItemVisual(dataIndex, 'style');
    var g = new graphic.Group();
    g.isHorizontal = isHorizontal;

    // 创建顶面
    var topSurface = element['topSurface'](layout, isHorizontal);

    // 创建顶面
    var bottomSurface = element['bottomSurface'](layout, isHorizontal);

    // 正面
    var frontSide = element['frontSide'](layout, isHorizontal);

    // 右侧面
    var rightSide = element['rightSide'](layout, isHorizontal);

    // 左侧面
    var leftSide = element['leftSide'](layout, isHorizontal);

    g.add(bottomSurface);
    g.add(leftSide);
    g.add(frontSide);
    g.add(rightSide);
    g.add(topSurface);

    var labelPositionOutside = isHorizontal ? (layout.height >= 0 ? 'bottom' : 'top') : (layout.width >= 0 ? 'right' : 'left');


    if (createLabel) {
        var labelStatesModels = getLabelStatesModels(itemModel);
        setLabelStyle(frontSide, labelStatesModels, {
            labelFetcher: seriesModel,
            labelDataIndex: dataIndex,
            defaultText: getDefaultLabel(seriesModel.getData(), dataIndex),
            inheritColor: style.fill,
            defaultOpacity: style.opacity,
            defaultOutsidePosition: labelPositionOutside
        });
    }

    // 设置动画
    if (animationModel) {

        // 顶面动画
        animator(topSurface, isHorizontal, animationModel, dataIndex, isUpdate);

        // 正面
        animator(frontSide, isHorizontal, animationModel, dataIndex, isUpdate);

        // 右侧面
        animator(rightSide, isHorizontal, animationModel, dataIndex, isUpdate);

        // 左侧面
        animator(leftSide, isHorizontal, animationModel, dataIndex, isUpdate);

    }

    return g;
}

/**
 * 放大缩小时，更新立方体图形
 * @param {Group} el
 * @param {Object} layout
 * @param {Boolean} isHorizontal
 * @param {Object} animationModel
 * @param {Number} newIndex
 */
export function updateCubeView(el, layout, isHorizontal, animationModel, newIndex) {
    el.eachChild(function (childEl) {
        var shape = layoutMapping[childEl.name](layout, isHorizontal);
        // isHorizontal 非数值不能进行动画
        graphic.updateProps(childEl, {
            shape: {
                x: shape.x,
                y: shape.y,
                width: shape.width,
                height: shape.height,
                shapeLength: shape.shapeLength
            }
        }, animationModel, newIndex);
    });
}

/**
 * 创建元素
 */
var element = {
    frontSide(layout, isHorizontal) {
        var shape = layoutMapping['frontSide'](layout, isHorizontal);
        // 正面
        return new Rect({
            name: 'frontSide',
            strokeNone: false,
            shape: shape
        });
    },
    topSurface(layout, isHorizontal) {
        var shape = layoutMapping['topSurface'](layout, isHorizontal);

        return new CubeSurface({
            name: 'topSurface',
            shape: shape
        });
    },

    bottomSurface(layout, isHorizontal) {
        var shape = layoutMapping['bottomSurface'](layout, isHorizontal);

        return new CubeSurface({
            name: 'bottomSurface',
            shape: shape
        });
    },

    rightSide(layout, isHorizontal) {
        var shape = layoutMapping['rightSide'](layout, isHorizontal);

        return new CubeSide({
            name: 'rightSide',
            shape: shape
        })
    },

    leftSide(layout, isHorizontal) {
        var shape = layoutMapping['leftSide'](layout, isHorizontal);

        return new CubeSide({
            name: 'leftSide',
            fillNone: true,
            shape: shape
        })
    }
}



/**
 * 设置各个面的动画
 */
function animator(el, isHorizontal, animationModel, dataIndex, isUpdate) {
    var shape = el.shape;
    var property = isHorizontal ? 'height' : 'width';
    var animateTarget = {};

    animateTarget[property] = shape[property];
    shape[property] = 0;

    graphic[isUpdate ? 'updateProps' : 'initProps'](el, {
        shape: animateTarget
    }, animationModel, dataIndex);
}


/**
 * 获取zrender元素图形配置
 */
var layoutMapping = {
    topSurface(layout, isHorizontal) {
        layout = zrUtil.extend({}, layout);
        layout.isHorizontal = isHorizontal;

        return layout;
    },

    bottomSurface(layout, isHorizontal) {
        layout = zrUtil.extend({}, layout);
        isHorizontal ? (layout.height = 0) : (layout.width = 0);
        layout.isHorizontal = isHorizontal;

        return layout;
    },

    rightSide(layout, isHorizontal) {
        layout = zrUtil.extend({}, layout);
        layout.isHorizontal = isHorizontal;

        if (isHorizontal) {
            layout.x += layout.width;
        }

        return layout;
    },

    leftSide(layout, isHorizontal) {
        layout = zrUtil.extend({}, layout);
        layout.isHorizontal = isHorizontal;

        if (!isHorizontal) {
            layout.y += layout.height;
        }

        return layout
    },

    frontSide(layout, isHorizontal) {
        layout = zrUtil.extend({}, layout);
        layout.isHorizontal = isHorizontal;
        return layout;
    },

    text(layout, isHorizontal) {
        layout = zrUtil.extend({}, layout);
        layout.isHorizontal = isHorizontal;
        return layout;
    }
}


/**
 * 设置立方体图形样式
 * @param {Path} el
 * @param {Array} data
 * @param {Number} dataIndex
 * @param {Object} itemModel
 * @param {Object} layout
 * @param {Object} seriesModel
 * @param {Boolean} isHorizontal
 */
export function setCubeStyle(el, data, dataIndex, itemModel, layout, seriesModel, isHorizontal) {
    var style = data.getItemVisual(dataIndex, 'style') || data.getItemVisual(dataIndex, 'itemStyle')
    var color = style?.fill || style?.color;
    var opacity = itemModel.get(['itemStyle', 'opacity']);
    var emphasisModel = itemModel.getModel(['emphasis']);
    console.log(123)

    var barStyle = itemModel.getModel('itemStyle')
    var topColor = getBestLightColor(color); // 渐变色时获取最亮色
    var backColor = getBestBackColor(color); // 渐变色时获取最暗色

    var rightSide = el.childOfName('rightSide'),
        bottomSurface = el.childOfName('bottomSurface'),
        topSurface = el.childOfName('topSurface'),
        leftSide = el.childOfName('leftSide');

    var frontSide = el.childOfName('frontSide');

    // 设置顶部样式
    setStyle(topSurface, barStyle, liftColor(topColor, -0.2), opacity);

    // 设置底部样式
    setStyle(bottomSurface, barStyle, backColor, opacity);

    //设置右侧面样式
    setStyle(rightSide, barStyle, lerpColor(color, 0.2), opacity);

    // 设置左侧面样式
    setStyle(leftSide, barStyle, color, opacity);

    //设置正面样式
    setStyle(frontSide, barStyle, color, opacity);


    // if (text) {
    //     // 设置标签
    //     var labelPositionOutside = isHorizontal ?
    //         (layout.height > 0 ? 'bottom' : 'top') :
    //         (layout.width > 0 ? 'left' : 'right');

    //     // 呈现标签的元素，不显示
    //     text.useStyle(zrUtil.defaults({
    //         fill: 'rgba(0,0,0,0)',
    //         stroke: 'rgba(0,0,0,0)'
    //     }));

    //     helper.setLabel(
    //         // text.style, hoverStyle, itemModel, color, gai
    //         text, hoverStyle, itemModel, color,
    //         seriesModel, dataIndex, labelPositionOutside
    //     );
    // }

    // 设置鼠标移上样式
    helper.enableHoverEmphasis(el, emphasisModel.get('focus'), emphasisModel.get('blurScope'));
    helper.setStatesStylesFromModel(el, itemModel);

    // var model = itemModel.getModel(['emphasis', 'itemStyle']);
    // el.isGroup && el.traverse(function (child) {
    //     // updateProps()
    //     // updateElementState(child, updater, commonParam);
    //     var styleType = 'itemStyle';
    //     // var state = el.ensureState('emphasis');
    //     // state.style = model.getItemStyle();
    //     for (var i = 0; i < OTHER_STATES.length; i++) {
    //         var stateName = OTHER_STATES[i];
    //         var model = itemModel.getModel([stateName, styleType]);
    //         var state = el.ensureState(stateName); // Let it throw error if getterType is not found.

    //         state.style = model[defaultStyleGetterMap[styleType]]();
    //     }
    // });

    // var frontSide = el.childOfName('frontSide'),
    //     bottomSurface = el.childOfName('bottomSurface'),
    //     topSurface = el.childOfName('topSurface');


    // helper.setCubeHoverStyle(el, hoverStyle, topColor); // gai
}


/**
 * 获取柱子光效裁剪路径
 * @param {*} layout
 * @param {*} isHorizontal
 */
export function getCubeClipPath(layout, isHorizontal) {
    layout = zrUtil.extend({
        isHorizontal
    }, layout);

    // 设置融合裁剪路径
    var clipPath = new CubePath({
        shape: layout
    });

    return clipPath;
}
