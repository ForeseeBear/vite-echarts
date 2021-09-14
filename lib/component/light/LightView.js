import * as zrUtil from "zrender/src/core/util";
import * as graphic from "../../util/graphic";
import { extendComponentView } from '../../export/api'
import { getLayout, setImageElementStyle, clamp } from "../../util/util";
import { parsePercent } from "../../util/number";
import { createClipPath } from '../../chart/helper/createClipPathFromCoordSys';

const BAR_BORDER_WIDTH_QUERY = ["itemStyle", "normal", "borderWidth"];
const DEV_DUBGGER_ANIMATE_TIME = 5000;

export default extendComponentView({
    type: "light",

    init: function () {
        this.animeMap = [];
        this.timeoutId = null;
    },

    render: function (lightModel, ecModel, api) {
        const me = this;
        const group = this.group;
        const maxTimes = [0];
        let list = [];

        this._reset();

        ecModel.eachSeries((seriesModel) => {
            mergeOptionFromSerieModel(seriesModel, lightModel);

            if (seriesModel.isAnimationEnabled()) {
                let time = seriesModel.getShallow("animationDuration");
                maxTimes.push(time);
            }

            if (lightModel.get("show", true)) {
                const creator = this.lightCreator[seriesModel.subType];
                list = creator(group, seriesModel, lightModel, api, this.animeMap);
            }
        }, this);

        Promise.all(list).then(() => {
            // 柱子有动画时，光效动画延迟进行
            let deley = Math.max(...maxTimes);

            setTimeout(function () {
                me.startAnimation();

                // 运动5秒截止
                /* if (!process.env.RUNSTATE) {
                    clearTimeout(me.timeoutId);
                    me.timeoutId = setTimeout(() => {
                        me.stopAnimation();
                    }, DEV_DUBGGER_ANIMATE_TIME);
                } */
            }, deley);
        });
    },

    lightCreator: {
        bar: barLight,
        bar3d: bar3dLight
    },

    _reset: function () {
        // 清除动画对象
        this.stopAnimation();
        this.group.removeAll();
        this.animeMap = [];
    },

    startAnimation() {
        let animeMap = this.animeMap;
        // 清除动画对象
        zrUtil.map(animeMap, (item) => {
            item.start();
        });
    },

    stopAnimation() {
        let animeMap = this.animeMap;
        // 清除动画对象
        zrUtil.map(animeMap, (item) => {
            item.stop();
        });
    }
});

/**
 * 2.5D柱状图条件关系
 * @param {*} group
 * @param {*} seriesModel
 * @param {*} lightModel
 * @param {*} api
 */
function bar3dLight(group, seriesModel, lightModel, api, animeMap) {
    var data = seriesModel.getData();
    var cartesian = seriesModel.coordinateSystem;
    var baseAxis = cartesian.getBaseAxis();
    var isHorizontal = baseAxis.isHorizontal();
    var view = api.getViewOfSeriesModel(seriesModel); // 依赖2.5D视图
    var limit = getImgLimit(seriesModel, data, isHorizontal);
    const list = [];

    data.diff(null)
        .add(function (dataIndex) {
            var itemModel = data.getItemModel(dataIndex);
            var layout = zrUtil.extend({}, view.getRectItemLayout(data, dataIndex, itemModel));

            if (seriesModel.get("barType") === "cylinder") {
                // 设置融合裁剪路径
                var clipPath = view.getCylinderClipPath(layout, isHorizontal);
                // 圆柱体
                if (!isEmpty(layout)) {
                    addLight(group, layout, lightModel, itemModel, isHorizontal, clipPath, limit, animeMap);
                }
            } else {
                // 设置融合裁剪路径
                var clipPath = view.getCubeClipPath(layout, isHorizontal);

                var sideWidth = view.getSideWidth(layout, isHorizontal);

                //2.5D柱状图 宽度或高度需要增加
                isHorizontal ? (layout.width += sideWidth) : (layout.height += sideWidth) && (layout.y -= sideWidth);

                if (!isEmpty(layout)) {
                    const light = addLight(group, layout, lightModel, itemModel, isHorizontal, clipPath, limit, animeMap);
                    list.push(light);
                }
            }
        })
        .execute();

    return list;
}

/**
 * 2D柱状图
 * @param {*} group
 * @param {*} seriesModel
 * @param {*} lightModel
 */
function barLight(group, seriesModel, lightModel, api, animeMap) {
    const data = seriesModel.getData();
    const cartesian = seriesModel.coordinateSystem;
    const baseAxis = cartesian.getBaseAxis();
    const isHorizontal = baseAxis.isHorizontal();
    const limit = getImgLimit(seriesModel, data, isHorizontal);
    const list = []
    data.diff(null)
        .add(function (dataIndex) {
            var itemModel = data.getItemModel(dataIndex);
            var layout = getRectItemLayout(data, dataIndex, itemModel);
            if (!isEmpty(layout)) {
                // 设置融合裁剪路径
                var clipPath = createClipPath(seriesModel.coordinateSystem, false, seriesModel) || null
                clipPath && list.push(addLight(group, layout, lightModel, itemModel, isHorizontal, clipPath, limit, animeMap));
            }
        })
        .execute();

    return list;
}

function isEmpty(layout) {
    return !layout || layout.height === 0 || layout.width === 0;
}

/**
 * 将series配置注入修改光效配置
 * @param {*} seriesModel
 * @param {*} lightModel
 */
function mergeOptionFromSerieModel(seriesModel, lightModel) {
    var option = seriesModel.get("light");
    lightModel.option = zrUtil.clone(lightModel.getDefaultOption());
    lightModel.mergeOption(option);
}

/**
 * 获取图片运动最大高度（或宽度）
 */
function getImgLimit(seriesModel, data, isHorizontal) {
    var result = [];

    data.each(function (i) {
        var layout = data.getItemLayout(i);
        if (layout) {
            var limit = getLayout(seriesModel, layout);
            result.push(Math.abs(isHorizontal ? limit["height"] : limit["width"]));
        }
    });

    return Math.max(...result);
}

/**
 * 创建光效
 * @param { } x
 * @param {*} y
 * @param {*} w
 * @param {*} h
 */
async function addLight(el, layout, lightModel, itemModel, isHorizontal, clipPath, limit, animeMap) {
    const group = new graphic.Group();
    const light = await createLightEffect(layout, lightModel, itemModel, isHorizontal, limit, animeMap); // 创建粒子效果图

    group.add(light);
    // 设置剪裁路径
    !clipPath &&
        (clipPath = new graphic.Rect({
            shape: layout
        }));

    group.setClipPath(clipPath);
    el.add(group);
}

/**
 * 创建光效
 * @param {*} layout
 * @param {*} lightModel
 * @param {*} isHorizontal
 */
function createLightEffect(layout, lightModel, itemStyle, isHorizontal, limit, animeMap) {
    return new Promise((resolve) => {
        const group = new graphic.Group();
        const animationLinear = itemStyle.get('animationLinear'); // 是否匀速
        const imgPath = getImgPath(layout, lightModel, isHorizontal); // 光效图片路径
        const times = lightModel.get("time");
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);
        const distTime = maxTime - minTime;

        // 最终速率是最大值减最小值差值随机值+最小值
        const time = 100000 / clamp(1, 100, minTime + distTime * (animationLinear ? Math.random() : 1));
        const animeType = lightModel.get("animeType"); // 动画类型
        const offset = lightModel.get("offset"); // 图标偏移
        const pg = new graphic.Group(); // 位置组

        const imageElement = new graphic.Image(
            zrUtil.defaults(
                {
                    ignoreEvent: true,
                    silent: false,
                    z: 100,
                    style: {
                        x: 0,
                        y: 0
                    }
                },
                getImgSetting(isHorizontal, layout) // 获取图片相关的配置
            )
        );

        pg.add(imageElement);
        group.add(pg);

        setImageElementStyle({
            imageElement,
            imgPath,
            layout,
            itemStyle: lightModel,
            isHorizontal,
            limit
        }).then(() => {
            const imgHeight = imageElement.style.height;
            const imgWidth = imageElement.style.width;
            pg.position = [parsePercent(offset[0] + "%", imgWidth), parsePercent(offset[1] + "%", imgWidth)];
            var anime = animator[animeType](group, getAnimeXY(layout, limit + imgHeight, isHorizontal), time);
            animeMap.push(anime);

            resolve(group);
        });
    });
}

/**
 * 设置图片偏转
 * @param {*} isHorizontal
 * @param {*} layout
 * 情况：
 *  1、横向柱子朝上
 *  2、横向柱子朝下
 */
function getImgSetting(isHorizontal, layout) {
    var setting = {};
    var h = layout.height;
    var w = layout.width;
    // 横向
    if (isHorizontal) {
        // 柱子朝上
        if (h < 0) {
            setting.position = [layout.x, layout.y];
        } else {
            // 柱子朝下
            setting.position = [layout.x, layout.y];
            setting.rotation = -Math.PI;
            setting.scale = [-1, 1];
        }
        // 纵向
    } else {
        // 柱子朝上
        if (w > 0) {
            setting.position = [layout.x, layout.y + h];
            setting.rotation = -Math.PI / 2;
            setting.scale = [-1, 1];
            //  柱子朝下
        } else {
            setting.position = [layout.x, layout.y + h];
            setting.rotation = Math.PI / 2;
        }
    }

    return setting;
}

/**
 * 获取图片路径
 * @param {*} layout
 * @param {*} lightModel
 * @param {*} isHorizontal
 */
function getImgPath(layout, lightModel, isHorizontal) {
    var imgPath = lightModel.get("imgPath"); // 光效图片路径

    if (zrUtil.isString(imgPath)) {
        imgPath = [imgPath, imgPath];
    }

    if (isHorizontal) {
        return layout["height"] > 0 ? imgPath[1] : imgPath[0];
    } else {
        return layout["width"] > 0 ? imgPath[0] : imgPath[1];
    }
}

/**
 * 图片运动终点坐标
 * @param {*} layout
 * @param {*} isHorizontal
 */
function getAnimeXY(layout, limit, isHorizontal) {
    if (isHorizontal) {
        var h = Math.abs(layout.height);
        return [0, (layout.height / h) * limit];
    } else {
        var w = Math.abs(layout.width);
        return [(layout.width / w) * limit, 0];
    }
}

/**
 * 动画对象
 */
var animator = {
    // 从下到上  --上升
    up: function (el, position, time = 5000) {
        return el.animate("position", true).when(time, position);
    },
    // 从下到上再到下 --先上升再下降
    updown: function (el, position, time = 5000) {
        return el
            .animate("position", true)
            .when(time, position)
            .when(2 * time, [0, 0]);
    },
    // 从上到下再到上 --先下降再上升
    downup: function (el, position, time = 5000) {
        return el
            .animate("position", true)
            .when(0, position)
            .when(time, [0, 0])
            .when(2 * time, position);
    },
    // 从上到下 --下降
    down: function (el, position, time = 5000) {
        return el.animate("position", true).when(0, position).when(time, [0, 0]);
    }
};

/**
 * 获取柱状图柱子布局大小
 * @param {} data
 * @param {Number} dataIndex
 * @param {Model} itemModel
 */
function getRectItemLayout(data, dataIndex, itemModel) {
    var layout = data.getItemLayout(dataIndex);

    if (!layout) {
        return null;
    }
    var fixedLineWidth = getLineWidth(itemModel, layout);

    // fix layout with lineWidth
    var signX = layout.width > 0 ? 1 : -1;
    var signY = layout.height > 0 ? 1 : -1;

    return {
        x: layout.x + (signX * fixedLineWidth) / 2,
        y: layout.y + (signY * fixedLineWidth) / 2,
        width: layout.width - signX * fixedLineWidth,
        height: layout.height - signY * fixedLineWidth
    };
}

// In case width or height are too small.
function getLineWidth(itemModel, rawLayout) {
    var lineWidth = itemModel.get(BAR_BORDER_WIDTH_QUERY) || 0;
    return Math.min(lineWidth, Math.abs(rawLayout.width), Math.abs(rawLayout.height));
}
