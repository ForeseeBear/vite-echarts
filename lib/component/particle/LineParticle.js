/**
 * 线类型图形的粒子效果
 */
import * as zrUtil from "zrender/lib/core/util";
import * as graphic from "../../util/graphic";
import { clamp } from "../../util/util";

export async function addLineParticle(group, seriesModel, particleModel, animeMap) {
    var cartesian = seriesModel.coordinateSystem;
    var limit = cartesian.grid.getRect();
    var data = seriesModel.getData();
    var points = data.mapArray(data.getItemLayout);

    await createLineParticleEffect(group, points, particleModel, limit, animeMap);
}

/**
 * 创建动画粒子效果
 * @param {*} el
 * @param {*} layout
 * @param {*} itemStyle
 * @param {*} isHorizontal
 */
async function createLineParticleEffect(el, points, itemStyle, limit, animeMap) {
    let group = new graphic.Group();
    let time = itemStyle.get("time");

    // 最终速率是最大值减最小值差值随机值+最小值
    let timeRatio = 100 / clamp(1, 10, time);

    // 第一屏图片
    createParticleAnimator(group, points, itemStyle, false, timeRatio, animeMap);

    //第二屏图片
    createParticleAnimator(group, points, itemStyle, true, timeRatio, animeMap);

    // 设置剪裁路径
    group.setClipPath(getClipPath(points, itemStyle, limit));

    el.add(group);
}

function getClipPath(points, itemStyle, limit) {
    const maxY = limit.y + limit.height;
    const newPonits = [...points];
    let showDist = itemStyle.get("showDist");

    for (let i = points.length; i--;) {
        newPonits.push([points[i][0], Math.min(points[i][1] + showDist, maxY)]);
    }

    return new graphic.Polygon({
        shape: {
            points: newPonits
        }
    });
}

/**
 * 将粒子效果根据柱子长高组装成img
 * @param {*} layout
 * @param {*} itemStyle
 * @param {*} isHorizontal
 */
function createParticleImgs(points, itemStyle) {
    const sizeInfo = getSizeAndMinMax(points);
    let group = new graphic.Group();
    let showDist = itemStyle.get("showDist");

    // 如果图片的高度小于柱子的高度使用多个图片
    let element = new graphic.Image(
        zrUtil.defaults({
            ignoreEvent: true,
            silent: false,
            style: {
                image: createParticleCanvas(itemStyle, sizeInfo),
                x: 0,
                y: 0,
                width: sizeInfo.width,
                height: sizeInfo.height
            },
            position: [sizeInfo.minX, sizeInfo.maxY + showDist]
        })
    );

    group.add(element);

    return {
        img: group,
        sizeInfo
    };
}

function createParticleCanvas(itemStyle, sizeInfo) {
    const color = itemStyle.get("color");
    const minR = itemStyle.get("minR"); // 粒子最小半径
    const maxR = itemStyle.get("maxR"); // 粒子最大半径
    let count = itemStyle.get("count"); // 粒子数

    const canvas = document.createElement("canvas");
    const width = (canvas.width = sizeInfo.width);
    const height = (canvas.height = sizeInfo.height);
    const ctx = canvas.getContext("2d");
    const existPoint = []; // x:10,y:10

    while (count > 0 && existPoint.length + 10 < width * height) {
        let w = Math.floor(Math.random() * width);
        let h = Math.floor(Math.random() * height);
        let whstr = `x:${w},y:${h}`;
        let r = minR + (maxR - minR) * Math.random();

        if (!existPoint.includes(whstr)) {
            existPoint.push(whstr);
            ctx.moveTo(w, h);
            ctx.beginPath();
            ctx.arc(w, h, r, 0, 2 * Math.PI, false);
            ctx.fillStyle = color;
            ctx.closePath();
            ctx.fill();
            count--;
        }
    }

    return canvas;
}

function getSizeAndMinMax(points) {
    // 获取x/y轴最大和最小值
    const x = [];
    const y = [];

    points.forEach((item) => {
        x.push(item[0]);
        y.push(item[1]);
    });

    const minX = Math.min(...x);
    const maxX = Math.max(...x);

    const minY = Math.min(...y);
    const maxY = Math.max(...y);

    return {
        minX,
        maxX,
        minY,
        maxY,
        height: maxY - minY,
        width: maxX - minX
    };
}

/**
 * 给粒子图片设置动画
 * @param {*} group
 * @param {*} layout
 * @param {*} itemStyle
 * @param {*} isHorizontal
 * @param {*} delay
 */
function createParticleAnimator(group, points, itemStyle, delay, timeRatio, animeMap) {
    let obj = createParticleImgs(points, itemStyle); // 创建粒子效果图
    let sizeInfo = obj.sizeInfo;
    let showDist = itemStyle.get("showDist");

    let h = sizeInfo.maxY + showDist - sizeInfo.minY;

    let img = obj.img;
    let time = h * timeRatio;
    let position = [0, -2 * h];

    let animate = img.animate("position", true).when(time, position); // 方向问题

    if (delay) {
        // 动画延迟
        animate.delay(time / 2);
    }

    group.add(img);
    animeMap.push(animate);
}
