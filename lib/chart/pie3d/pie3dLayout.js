// TODO minAngle
import { isArray } from 'zrender/lib/core/util';
import { parsePercent, linearMap } from '../../util/number';
import labelLayout from './labelLayout';

var PI2 = Math.PI * 2;
var RADIAN = Math.PI / 180;

export default function (seriesType, ecModel, api, payload) {
    ecModel.eachSeriesByType(seriesType, function (seriesModel) {
        var center = seriesModel.get('center');
        var radius = seriesModel.get('radius');

        // 兼容echarts4
        if (seriesModel.option.label.normal) {
            seriesModel.option.label.normal.show = seriesModel.option.label.show;
        }
        if (seriesModel.option.label.formatter) {
            seriesModel.option.label.normal.formatter = seriesModel.option.label.formatter;
            seriesModel.option.label.normal.rich = seriesModel.option.label.rich;
        }
        if (seriesModel.option.labelLine.normal) {
            seriesModel.option.labelLine.normal.show = seriesModel.option.labelLine.show;
            seriesModel.option.labelLine.normal.length = seriesModel.option.labelLine.length;
        }

        if (!isArray(radius)) {
            radius = [0, radius];
        }
        if (!isArray(center)) {
            center = [center, center];
        }

        var width = api.getWidth();
        var height = api.getHeight();
        var size = Math.min(width, height);
        var cx = parsePercent(center[0], width);
        var cy = parsePercent(center[1], height);
        var r0 = parsePercent(radius[0], size / 2);
        var r = parsePercent(radius[1], size / 2);

        // z轴角度
        var z = 45 * RADIAN;
        if (seriesModel.get('zAngle')) {
            z = seriesModel.get('zAngle') * RADIAN;
        }

        var roseType = seriesModel.get('roseType');
        var sectorHeightRise = seriesModel.get('sectorHeightRise');


        // 椭圆横轴半径
        var a = r * 131 / 150;
        // 椭圆纵轴半径
        var b = a * Math.abs(Math.sin(z));
        // 内圈椭圆纵横轴半径
        var a0 = r0 * 131 / 150;
        var b0 = a0 * Math.abs(Math.sin(z));
        // 扇形柱面高度
        var sectorHeight = 15;
        if (seriesModel.get('sectorHeight')) {
            sectorHeight = parseInt(seriesModel.get('sectorHeight'));
        }
        // 扇形间隔坐标平移值
        var LL = 20.2;
        if (seriesModel.get('sectorGap') || seriesModel.get('sectorGap') == 0) {
            LL = parseInt(seriesModel.get('sectorGap'));
        }
        // 取得边框颜色
        var borderColor = seriesModel.get('borderColor');
        // 取得选中颜色
        var themeHighColor = seriesModel.get('themeHighColor');

        var data = seriesModel.getData();

        var startAngle = -seriesModel.get('startAngle') * RADIAN;
        // var startAngle = -45 * RADIAN;

        var minAngle = seriesModel.get('minAngle') * RADIAN;

        var sum = data.getSum('value');
        // Sum may be 0
        var unitRadian = Math.PI / (sum || data.count()) * 2;

        var clockwise = seriesModel.get('clockwise');

        var roseType = seriesModel.get('roseType');
        var stillShowZeroSum = seriesModel.get('stillShowZeroSum');

        // [0...max]
        var extent = data.getDataExtent('value');
        extent[0] = 0;

        // In the case some sector angle is smaller than minAngle
        var restAngle = PI2;
        var valueSumLargerThanMinAngle = 0;

        var currentAngle = startAngle;

        var dir = clockwise ? 1 : -1;
        data.each('value', function (value, idx) {
            var angle;
            if (isNaN(value)) {
                data.setItemLayout(idx, {
                    angle: NaN,
                    startAngle: NaN,
                    endAngle: NaN,
                    clockwise: clockwise,
                    cx: cx,
                    cy: cy,
                    r0: r0,
                    isRose: roseType,
                    r: roseType
                        ? NaN
                        : r
                });
                return;
            }
            // 防止为0的情况
            if (value == 0) {
                value = 0.0001;
            }

            // FIXME 兼容 2.0 但是 roseType 是 area 的时候才是这样？
            if (roseType !== 'area') {
                angle = (sum === 0 && stillShowZeroSum)
                    ? unitRadian : (value * unitRadian);
            }
            else {
                angle = PI2 / (data.count() || 1);
            }

            if (angle < minAngle) {
                angle = minAngle;
                restAngle -= minAngle;
            }
            else {
                valueSumLargerThanMinAngle += value;
            }

            var endAngle = currentAngle + dir * angle;
            // 计算扇形坐标平移
            var middleAngle = (currentAngle + endAngle) / 2;
            // var LL = 20.2;

            var inc_x = LL * Math.cos(PI2 - middleAngle);
            var inc_y = LL * Math.sin(PI2 - middleAngle);

            // 玫瑰图的情况重新计算扇形最大半径
            if (roseType) {
                var rRose = linearMap(value, extent, [r0, r]);
                // 椭圆横轴半径
                a = rRose * 131 / 150;
                // 椭圆纵轴半径
                b = a * Math.abs(Math.sin(z));
            }

            data.setItemLayout(idx, {
                a: a,
                b: b,
                a0: a0,
                b0: b0,
                h: sectorHeightRise ? (sectorHeight / 2) * (idx + 2) : sectorHeight,
                // h: sectorHeight,
                angle: angle,
                startAngle: currentAngle,
                endAngle: endAngle,
                clockwise: clockwise,
                cx: cx + inc_x,
                cy: cy - inc_y,
                r0: r0,
                isRose: roseType,
                borderColor: borderColor,
                themeHighColor: themeHighColor,
                r: roseType
                    ? linearMap(value, extent, [r0, r])
                    : r
            });

            currentAngle = endAngle;
        }, true);

        // Some sector is constrained by minAngle
        // Rest sectors needs recalculate angle
        if (restAngle < PI2) {
            // Average the angle if rest angle is not enough after all angles is
            // Constrained by minAngle
            if (restAngle <= 1e-3) {
                var angle = PI2 / data.count();
                data.each(function (idx) {
                    var layout = data.getItemLayout(idx);
                    layout.startAngle = startAngle + dir * idx * angle;
                    layout.endAngle = startAngle + dir * (idx + 1) * angle;
                });
            }
            else {
                unitRadian = restAngle / valueSumLargerThanMinAngle;
                currentAngle = startAngle;
                data.each('value', function (value, idx) {
                    var layout = data.getItemLayout(idx);
                    var angle = layout.angle === minAngle
                        ? minAngle : value * unitRadian;
                    layout.startAngle = currentAngle;
                    layout.endAngle = currentAngle + dir * angle;
                    currentAngle += dir * angle;
                });
            }
        }

        labelLayout(seriesModel, r, width, height, LL);
    });
};
