/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import * as layout from "../../util/layout";
import { parsePercent, linearMap } from "../../util/number";

function getViewRect(seriesModel, api) {
    return layout.getLayoutRect(seriesModel.getBoxLayoutParams(), {
        width: api.getWidth(),
        height: api.getHeight(),
    });
}

function getSortedIndices(data, sort) {
    var valueDim = data.mapDimension("value");
    var valueArr = data.mapArray(valueDim, function (val) {
        return val;
    });
    var indices = [];
    var isAscending = sort === "ascending";
    for (var i = 0, len = data.count(); i < len; i++) {
        indices[i] = i;
    }

    // Add custom sortable function & none sortable opetion by "options.sort"
    if (typeof sort === "function") {
        indices.sort(sort);
    } else if (sort !== "none") {
        // indices.sort(function (a, b) {
        //     return isAscending ? valueArr[a] - valueArr[b] : valueArr[b] - valueArr[a];
        // });
        // 漏斗图默认数据项倒序排序，升序的情况，不能改变数据值相等的原来的数据项顺序
        if (isAscending) {
            indices = indices.reverse();
        }
    }
    return indices;
}

function labelLayout(data, blockType) {
    data.each(function (idx) {
        var itemModel = data.getItemModel(idx);
        var labelModel = itemModel.getModel("label");
        var labelPosition = labelModel.get("position");

        var labelLineModel = itemModel.getModel("labelLine");

        var layout = data.getItemLayout(idx);
        var points = layout.points;

        var isLabelInside =
            labelPosition === "inner" ||
            labelPosition === "inside" ||
            labelPosition === "center";

        var textAlign;
        var textX;
        var textY;
        var linePoints;

        if (isLabelInside) {
            textX = (points[0][0] + points[1][0] + points[2][0] + points[3][0]) / 4;
            textY = (points[0][1] + points[1][1] + points[2][1] + points[3][1]) / 4;
            textAlign = "center";
            linePoints = [
                [textX, textY],
                [textX, textY],
            ];
        } else {
            var x1;
            var y1;
            var x2;
            var labelLineLen = labelLineModel.get("length");
            if (labelPosition === "left") {
                // Left side
                blockType === "cube"
                    ? (x1 = points[0][0])
                    : (x1 = (points[3][0] + points[0][0]) / 2);
                y1 = (points[3][1] + points[0][1]) / 2;
                x2 = x1 - labelLineLen;
                textX = x2 - 5;
                textAlign = "right";
            } else {
                // Right side
                blockType === "cube"
                    ? (x1 = points[1][0])
                    : (x1 = (points[1][0] + points[2][0]) / 2);
                y1 = (points[1][1] + points[2][1]) / 2;
                x2 = x1 + labelLineLen;
                textX = x2 + 5;
                textAlign = "left";
            }
            var y2 = y1;

            linePoints = [
                [x1, y1],
                [x2, y2],
            ];
            textY = y2;
        }

        layout.label = {
            linePoints: linePoints,
            x: textX,
            y: textY,
            verticalAlign: "middle",
            textAlign: textAlign,
            inside: isLabelInside,
        };
    });
}

// 数据计算高度的方式生成绘制节点
function computeWithHeight(seriesModel, api) {
    var data = seriesModel.getData();
    var valueDim = data.mapDimension("value");
    var sort = seriesModel.get("sort");
    var viewRect = getViewRect(seriesModel, api);
    var indices = getSortedIndices(data, sort);
    // 取得样式种类：圆锥，立方，金字塔
    var seriesModel = data.hostModel;
    var blockType = seriesModel.option.blockType;
    var computeRule = seriesModel.option.computeRule;

    // 纵向显示尺寸范围
    var sizeExtentVertical = [0, viewRect.height];

    var dataExtent = data.getDataExtent(valueDim);
    var min = seriesModel.get("min");
    var max = seriesModel.get("max");
    if (min == null) {
        min = Math.min(dataExtent[0], 0);
    }
    if (max == null) {
        max = dataExtent[1];
    }

    var funnelAlign = seriesModel.get("funnelAlign");
    var gap = seriesModel.get("gap");
    // 等高的情况
    // var itemHeight = (viewRect.height - gap * (data.count() - 1)) / data.count();

    var y = viewRect.y;

    // 取得每一数据纵向高度（数据计算高度）
    var getDataHeight = function (idx, dataAll) {
        var val = data.get(valueDim, idx) || 0;
        var itemHeight = (val / dataAll) * viewRect.height;
        return itemHeight;
    };

    // 保存宽高比以计算每一数据a的大小
    var widthHeightRatio = viewRect.width / 2 / viewRect.height;
    // 计算原始数据总和
    var dataAll = 0;
    for (var i = 0; i < indices.length; i++) {
        var val = data.get(valueDim, i) || 0;
        dataAll += val;
    }
    // 保存每一数据对应高度
    var dataHeights = [];
    for (var i = 0; i < indices.length; i++) {
        var idx = indices[i];
        var h = getDataHeight(idx, dataAll);
        // dataHeights.push(h);
        dataHeights[idx] = h;
    }

    var getLinePoints = function (idx, offY, a) {
        var itemWidth = a * 2;
        // 计算长短轴半径
        var x0;
        switch (funnelAlign) {
            case "left":
                x0 = viewRect.x;
                break;
            case "center":
                x0 = viewRect.x + (viewRect.width - itemWidth) / 2;
                break;
            case "right":
                x0 = viewRect.x + viewRect.width - itemWidth;
                break;
        }
        return [
            [x0, offY],
            [x0 + itemWidth, offY],
        ];
    };

    if (sort === "ascending") {
        gap = -gap;
        y += viewRect.height;
        indices = indices.reverse();
    }

    // 中心点横坐标
    var cx = viewRect.x + viewRect.width / 2;
    var cx1 = cx;
    // 中心点纵坐标
    var cy = y;
    var cy1 = cy;
    // 长轴半径
    var a = 0,
        a1 = 0;
    // 长短轴比例
    var ratio = 10;

    // 根据索引获得当前数据宽度
    var getAwithIndex = function (idx) {
        // 最后一个数据
        if (!dataHeights[idx]) {
            return 0;
        }
        var heightMinus = 0;
        for (var i = 0; i < idx; i++) {
            heightMinus += dataHeights[i];
        }
        return (viewRect.height - heightMinus) * widthHeightRatio;
    };

    for (var i = 0; i < indices.length; i++) {
        var idx = indices[i];
        var nextIdx = indices[i + 1];

        a = getAwithIndex(idx);

        // 每一数据的起始节点
        var start = getLinePoints(idx, y, a);

        a1 = getAwithIndex(nextIdx);
        // 立方的情况上下等宽
        // blockType = 'cube';
        if (blockType === "cube") {
            a1 = a;
            ratio = 3;
        }

        // 每一数据的结束节点
        var end = getLinePoints(
            nextIdx,
            y + (sort === "ascending" ? -dataHeights[idx] : dataHeights[idx]),
            a1
        );

        // 短轴半径
        var b = a / ratio;
        var b1 = a1 / ratio;

        cy = y;
        // cy1 = cy;

        y += sort === "ascending" ? -dataHeights[idx] : dataHeights[idx];

        cy1 = y;

        data.setItemLayout(idx, {
            cx: cx,
            cy: cy,
            cx1: cx1,
            cy1: cy1,
            a: a,
            b: b,
            a1: a1,
            b1: b1,
            // point: point,
            // point2: point2,
            points: start.concat(end.slice().reverse()),
            index: idx,
            sort: sort,
        });
    }

    labelLayout(data);
}

const Funnel3dLayout = function (ecModel, api, payload) {
    ecModel.eachSeriesByType("funnel3d", function (seriesModel) {
        var data = seriesModel.getData();
        var valueDim = data.mapDimension("value");
        var sort = seriesModel.get("sort");
        var viewRect = getViewRect(seriesModel, api);
        // 宽度减半，同时横向调整位置, 系列中添加isModelView属性，这里面只做渲染
        let isModelView = seriesModel.get('isModelView') || false;
        if (!isModelView) {
            viewRect.width *= 0.5;
            viewRect.x += viewRect.width / 2;
        }
        var indices = getSortedIndices(data, sort);
        // 取得样式种类：圆锥，立方，金字塔
        var seriesModel = data.hostModel;
        var blockType = seriesModel.option.blockType;
        var computeRule = seriesModel.option.computeRule;
        if (
            (blockType === "cubeStraight" || blockType === "coneStraight") &&
            computeRule == "dataHeight"
        ) {
            computeWithHeight(seriesModel, api);
            return;
        }
        // 总记录数
        var indexLength = indices.length;

        var sizeExtent = [
            parsePercent(seriesModel.get("minSize"), viewRect.width),
            parsePercent(seriesModel.get("maxSize"), viewRect.width),
        ];
        // 纵向显示尺寸范围
        // var sizeExtentVertical = [0, viewRect.height];

        var dataExtent = data.getDataExtent(valueDim);
        var min = seriesModel.get("min");
        var max = seriesModel.get("max");
        if (min == null) {
            min = Math.min(dataExtent[0], 0);
        }
        if (max == null) {
            max = dataExtent[1];
        }

        // 等高的情况重新计算data值，生成0到100等间隔的模拟数据
        var equalData = [];
        if (computeRule === "equalHeight") {
            var stepData = 100 / indexLength;
            for (var i = 0; i < indexLength; i++) {
                equalData.push(100 - i * stepData);
            }
            min = 0;
            max = 100;
        }
        // 曲线圆锥的情况生成等高模拟数据
        if (computeRule === "equalHeight" && blockType === "cone") {
            var indexData = 10;
            equalData = [];
            for (var i = 0; i < indexLength; i++) {
                if (i === 0) {
                    equalData.push(indexData);
                } else {
                    equalData.push(equalData[i - 1] + (i + 1) * 5);
                }
            }
            equalData.reverse();
            min = 0;
            max = equalData[0];
        }

        var funnelAlign = seriesModel.get("funnelAlign");
        var gap = seriesModel.get("gap");
        var itemHeight =
            (viewRect.height - gap * (data.count() - 1)) / data.count();

        var y = viewRect.y;

        // 取得每一数据横向宽度半径
        var getDatawidth = function (idx) {
            var val = data.get(valueDim, idx) || 0;
            // 等高的情况获取模拟数据
            if (computeRule === "equalHeight") {
                val = equalData[idx] || 0;
            }
            if (computeRule === "equalHeight" && blockType === "cone") {
                val = equalData[idx] || 5;
            }
            var itemWidth = linearMap(val, [min, max], sizeExtent, true);
            return itemWidth / 2;
        };

        var getLinePoints = function (idx, offY) {
            var val = data.get(valueDim, idx) || 0;
            // 等高的情况获取模拟数据
            if (computeRule === "equalHeight") {
                val = equalData[idx] || 0;
            }
            if (computeRule === "equalHeight" && blockType === "cone") {
                val = equalData[idx] || 5;
            }
            var itemWidth = linearMap(val, [min, max], sizeExtent, true);
            // 计算长短轴半径
            // a = itemWidth / 2;
            var x0;
            switch (funnelAlign) {
                case "left":
                    x0 = viewRect.x;
                    break;
                case "center":
                    x0 = viewRect.x + (viewRect.width - itemWidth) / 2;
                    break;
                case "right":
                    x0 = viewRect.x + viewRect.width - itemWidth;
                    break;
            }
            return [
                [x0, offY],
                [x0 + itemWidth, offY],
            ];
        };

        if (sort === "ascending") {
            // From bottom to top
            itemHeight = -itemHeight;
            gap = -gap;
            y += viewRect.height;
            indices = indices.reverse();
        }

        // 中心点横坐标
        var cx = viewRect.x + viewRect.width / 2;
        var cx1 = cx;
        // 中心点纵坐标
        var cy = y;
        var cy1 = cy;
        // 长轴半径
        var a = 0,
            a1 = 0;
        // 长短轴比例
        var ratio = 8;
        // 右侧顶点
        var point = [];
        // 左侧顶点
        var point2 = [];
        // 总记录数
        // var indexLength = indices.length;

        for (var i = 0; i < indices.length; i++) {
            var idx = indices[i];
            var nextIdx = indices[i + 1];

            var itemModel = data.getItemModel(idx);
            var height = itemModel.get("itemStyle.height");
            if (height == null) {
                height = itemHeight;
            } else {
                height = parsePercent(height, viewRect.height);
                if (sort === "ascending") {
                    height = -height;
                }
            }

            a = getDatawidth(idx);
            // 每一数据的起始节点
            var start = getLinePoints(idx, y);
            point2.push({
                x: start[0][0],
                y: start[0][1],
            });
            point.push({
                x: start[1][0],
                y: start[1][1],
            });

            a1 = getDatawidth(nextIdx);
            // 立方的情况上下等宽
            // blockType = 'cube';
            if (blockType === "cube") {
                a1 = a;
                ratio = 3;
            }

            // 每一数据的结束节点
            var end = getLinePoints(nextIdx, y + height);
            // 最后一数据宽度为0
            if (idx === indices.length - 1) {
                point2.push({
                    x: end[0][0],
                    y: end[0][1],
                });
                point.push({
                    x: end[1][0],
                    y: end[1][1],
                });
            }

            // 短轴半径
            var b = a / ratio;
            var b1 = a1 / ratio;

            cy = y;
            // cy1 = cy;

            y += height + gap;

            cy1 = y;

            data.setItemLayout(idx, {
                cx: cx,
                cy: cy,
                cx1: cx1,
                cy1: cy1,
                a: a,
                b: b,
                a1: a1,
                b1: b1,
                // point: point,
                // point2: point2,
                points: start.concat(end.slice().reverse()),
                index: idx,
                sort: sort,
            });
        }
        // 绘制曲线的顺序
        point2.reverse();
        // 重新赋值两侧节点坐标
        for (var i = 0; i < indices.length; i++) {
            var layout = data.getItemLayout(i);
            layout.point = point;
            layout.point2 = point2;
        }

        labelLayout(data, blockType);
    });
}
export default Funnel3dLayout
