import * as zrUtil from "zrender/src/core/util";
import { extendComponentView } from '../../export/api'
import * as graphic from "../../util/graphic";
import { clamp, setImageElementStyle } from "../../util/util";
import { addLineParticle } from "./LineParticle";
import { mergeOptionFromSerieModel, isEmpty } from "./utils";

const BAR_BORDER_WIDTH_QUERY = ["itemStyle", "normal", "borderWidth"];
const DEV_DUBGGER_ANIMATE_TIME = 5000;

export default extendComponentView({
    type: "particle",

    newlineDisabled: false,

    init() {
        this.animeMap = [];
        this.timeoutId = null;
    },

    render(particleModel, ecModel, api) {
        var group = this.group;
        this._reset();
        let maxTimes = [0];
        let list = [];

        ecModel.eachSeries((seriesModel) => {
            if (seriesModel.get("particle.show")) {
                const elGroup = new graphic.Group();
                const chartView = api.getViewOfSeriesModel(seriesModel);

                elGroup.__chartView = chartView; // 粒子视图和图表视图相互绑定
                chartView.__particleView = this; // 粒子视图和图表视图相互绑定
                elGroup.name = chartView.uid + "particleViewGroup"; // 给每个图表视图的粒子元素组做好标记方便查找

                group.add(elGroup);

                if (seriesModel.isAnimationEnabled()) {
                    let time = seriesModel.getShallow("animationDuration");
                    maxTimes.push(time);
                }

                mergeOptionFromSerieModel(seriesModel, particleModel);

                if (seriesModel.get("particle.type") === "line") {
                    list = addLineParticle(elGroup, seriesModel, particleModel, this.animeMap);
                } else {
                    list = addBarParticle(elGroup, seriesModel, particleModel, this.animeMap);
                }
            }
        }, this);

        Promise.all(list).then(() => {
            let deley = Math.max(...maxTimes);

            setTimeout(() => {
                this.startAllAnimation();
                /* // 运动5秒截止
                if (!process.env.RUNSTATE) {
                    clearTimeout(this.timeoutId);
                    this.timeoutId = setTimeout(() => {
                        this.stopAllAnimation();
                    }, DEV_DUBGGER_ANIMATE_TIME);
                } */
            }, deley);
        });
    },

    _reset() {
        // 清除动画对象
        this.stopAllAnimation();
        this.group.removeAll();
        this.animeMap = [];
    },

    startAllAnimation() {
        let animeMap = this.animeMap;

        // 清除动画对象
        zrUtil.map(animeMap, (item) => {
            item.start();
        });
    },

    stopAllAnimation() {
        let animeMap = this.animeMap;
        // 清除动画对象
        zrUtil.map(animeMap, (item) => {
            item.stop();
        });
    },

    /**
     * 设置粒子视图显示区域
     * @param {*} chartView
     * @param {*} clipEl
     * @param {*} dataIndex
     */
    setGroupClip(chartView, clipEl, dataIndex) {
        // 获取图表视图所对应的粒子元素组
        var group = this.group.childOfName(chartView.uid + "particleViewGroup");
        var childView = group.childAt(dataIndex);

        if (childView) {
            childView.setClipPath(clipEl);
        }
    }
});

function addBarParticle(group, seriesModel, particleModel, animeMap) {
    var data = seriesModel.getData();
    var cartesian = seriesModel.coordinateSystem;
    var baseAxis = cartesian.getBaseAxis();
    var isHorizontal = baseAxis.isHorizontal();
    var limit = getImgLimit(seriesModel, data, isHorizontal);
    const list = [];

    data.diff(null)
        .add(function (dataIndex) {
            var itemModel = data.getItemModel(dataIndex);
            var layout = getRectItemLayout(data, dataIndex, itemModel);

            if (!isEmpty(layout)) {
                list.push(createBarParticleEffect(group, layout, particleModel, isHorizontal, limit, animeMap));
            }
        })
        .execute();

    return list;
}

/**
 * 创建动画粒子效果
 * @param {*} el
 * @param {*} layout
 * @param {*} itemStyle
 * @param {*} isHorizontal
 */
async function createBarParticleEffect(el, layout, itemStyle, isHorizontal, limit, animeMap) {
    let group = new graphic.Group();
    let animationLinear = itemStyle.get('animationLinear'); // 是否匀速
    let times = itemStyle.get("time");

    let minTime = Math.min(...times);
    let maxTime = Math.max(...times);
    let distTime = maxTime - minTime;

    // 最终速率是最大值减最小值差值随机值+最小值
    let timeRatio = 1000 / clamp(1, 100, minTime + distTime * (animationLinear ? Math.random() : 1));
    // 第一屏图片
    await createParticleAnimator(group, layout, itemStyle, isHorizontal, false, limit, timeRatio, animeMap);

    //第二屏图片
    await createParticleAnimator(group, layout, itemStyle, isHorizontal, true, limit, timeRatio, animeMap);

    // 设置剪裁路径
    var clipPath = new graphic.Rect({
        shape: layout
    });

    group.setClipPath(clipPath);

    el.add(group);
}

/**
 * 将粒子效果根据柱子长高组装成img
 * @param {*} layout
 * @param {*} itemStyle
 * @param {*} isHorizontal
 */
function createParticleImgs(layout, itemStyle, isHorizontal, limit) {
    return new Promise((resolve, reject) => {
        let group = new graphic.Group(); // 增加一层组是保证图片在当前位置上下移动
        let imageElement = new graphic.Image(
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
                getImgSetting(isHorizontal, layout)
            )
        );
        group.add(imageElement);

        setImageElementStyle({
            imageElement,
            layout,
            itemStyle,
            isHorizontal,
            limit
        }).then(() => {
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
 * 获取图片运动最大高度（或宽度）
 */
function getImgLimit(seriesModel, data, isHorizontal) {
    var cartesian = seriesModel.coordinateSystem;
    var grid = cartesian.master;
    var rect = grid.getRect();

    return isHorizontal ? rect.height : rect.width;
}

/**
 * 给粒子图片设置动画
 * @param {*} group
 * @param {*} layout
 * @param {*} itemStyle
 * @param {*} isHorizontal
 * @param {*} delay
 */
function createParticleAnimator(group, layout, itemStyle, isHorizontal, delay, limit, timeRatio, animeMap) {
    return new Promise((resolve) => {
        createParticleImgs(layout, itemStyle, isHorizontal, limit).then((element) => {
            const rect = element.getBoundingRect();
            const h = rect.height;
            const time = h * timeRatio;
            let position = [];

            if (isHorizontal) {
                position = [0, 2 * (layout.height > 0 ? h : -h)];
            } else {
                position = [2 * (layout.width > 0 ? h : -h), 0];
            }

            let animate = element.animate("position", true).when(time, position); // 方向问题

            if (delay) {
                // 动画延迟
                animate.delay(time / 2);
            }
            group.add(element);
            animeMap.push(animate);
            resolve();
        });
    });
}

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
