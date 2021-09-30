/*
  文件说明：
     2.5d环形图文件的绘制
*/

import { modifyAlpha } from 'zrender/lib/tool/color'

const PI2 = Math.PI * 2;
const RADIAN = Math.PI / 180;
let centerXY; // 中心圆的圆心坐标
let radiusXY = []; // 各圆的半径
let angleXY = [0]; // 各圆的偏移角度

export default function (seriesType, ecModel, api, payload) {
    ecModel.eachSeriesByType(seriesType, function (seriesModel, index) {
        //第一个圆对应的边的长度
        let b;
        //上一个圆的半径
        let a;
        let series = ecModel.get("series");
        let seriesLen = series.length; //数据长度
        let currentData = seriesModel.get("data")[0]; //当前数据
        let name = currentData.name;
        let value = currentData.value;
        let max = ecModel.get("max");
        const dimension = ecModel.get("dimension");
        const labelStyle = ecModel.get("label");
        const diff = ecModel.get("diff");
        if (!max) {
            max = 0;
            for (let i = 0;i < seriesLen;i++) {
                max += series[i].data[0].value;
            }
        } else {
            max = parseInt(max);
        }
        let percent = parseFloat((value / max).toFixed(2)); //百分比
        // 防止百分比超过100
        if (percent > 1) {
            percent = 1;
        }
        let per = parseFloat((percent * 100).toFixed(2)) + "%"; //当前数据所占百分比
        let maxRadius = ecModel.get("maxRadius"); //最大半径
        let minRadius = ecModel.get("minRadius"); //最小半径
        let radius = maxRadius - index * ((maxRadius - minRadius) / seriesLen);
        // 根据当前组件宽度自适应圆环大小
        const COM_WIDTH = api.getWidth();
        radius = radius * (COM_WIDTH / 572);
        let r0 = radius * 0.14;
        let r = radius * 0.7;
        let sectorGap = parseInt(ecModel.get("sectorGap")); // 环形图之间的间距
        let angle = parseInt(ecModel.get("angle")); // 显示顺序
        let ringChassisBackground = seriesModel.get("ringChassisBackground") || "rgba(255,255,255,0.09)"; // 底盘颜色
        // 处理透明度
        let ringChassisOpacity = ecModel.get("ringChassisOpacity").toFixed(2); // 底盘透明度
        ringChassisBackground = modifyAlpha(ringChassisBackground, ringChassisOpacity);
        radiusXY[index] = radius;
        let cx, cy;
        //计算圆环的圆心坐标
        if (index == 0) {
            cx = api.getWidth() / 2;
            cy = api.getHeight() / 2;
            centerXY = [cx, cy];
        } else if (index == 1) {
            let _radius = radiusXY[0] + sectorGap + radius * 0.5; //求第一个圆盘到第二个圆盘之间的距离
            let _angle = angle + 270;
            let radian = _angle * RADIAN; //角度转成弧度
            cx = centerXY[0] + _radius * Math.cos(radian);
            cy = centerXY[1] + _radius * Math.sin(radian);
            angleXY[index] = radian;
        } else {
            let lastIndex = index - 1;
            let aR = radiusXY[0]; //第一个圆的半径
            let aC = centerXY; //第一个圆的圆心坐标
            let bR = radiusXY[lastIndex];
            let a = bR + sectorGap + radius * 0.5;
            let b = aR + sectorGap + radius * 0.5; //上一个圆对应的边的长度
            let c = aR + sectorGap + bR; //当前的圆对应的边的长度
            let angle0 = angleXY[lastIndex]; //上一个圆的圆心坐标再第一个圆和第二个圆圆心之间距离为半径的圆上的角度
            let angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c)); //a边对应的夹角
            let ac = angle <= 0 ? angle0 - angleA : angleA + angle0;
            // 0的情况取顺时针
            if (ecModel.get("angle") === "0") {
                ac = angle0 + angleA;
            }
            // y轴距离参数
            let yDiff = 1;
            // 缩短第三四五个圆环的纵向距离
            if (index > 2) {
                yDiff *= 0.7;
            }
            cx = aC[0] + b * Math.cos(ac); //当前圆的圆心横坐标
            cy = aC[1] + b * Math.sin(ac) * yDiff; //当前圆的圆心纵坐标
            angleXY[index] = ac;
        }
        // z轴角度
        let z = 45 * RADIAN;
        // 椭圆横轴半径
        a = (r * 131) / 150;
        // 椭圆纵轴半径
        // b = a;
        b = a * Math.abs(Math.sin(z));
        // 内圈椭圆纵横轴半径
        let a0 = (r0 * 131) / 150;
        // let b0 = a0;
        let b0 = a0 * Math.abs(Math.sin(z));
        // 扇形柱面高度
        let sectorHeight = 5; //饼块厚度
        let data = seriesModel.getData();
        let startAngle = -parseInt(Math.random() * 360) * RADIAN;
        let minAngle = seriesModel.get("minAngle") * RADIAN;

        let clockwise = seriesModel.get("clockwise");

        let dir = clockwise ? 1 : -1;
        //圆环
        // angle = PI2 * (1 - percent);
        angle = PI2 * percent;
        // 防止为0的情况
        if (value == 0) {
            value = 0.0001;
        }

        if (angle < minAngle) {
            angle = minAngle;
        }
        let endAngle = startAngle + dir * angle;
        data.setItemLayout(0, {
            a: a,
            b: b,
            a0: a0,
            b0: b0,
            h: sectorHeight,
            angle: angle,
            startAngle: startAngle,
            endAngle: endAngle,
            clockwise: clockwise,
            cx: cx, // cx + inc_x,
            cy: cy, // cy - inc_y,
            r0: r0, //圆环内半径
            isRose: false,
            borderColor: "rgba(255,255,255,0)",
            r: r, //圆环外半径
            radius: radius, //外圆盘半径
            percent: per, //标签值
            name: name, // 维度值
            labelStyle: labelStyle,
            dimension: dimension, // 维度标签
            ringChassisBackground: ringChassisBackground,
            diff: diff
        });
    });
};
