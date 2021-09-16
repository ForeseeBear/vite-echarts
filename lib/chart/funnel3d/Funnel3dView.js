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

import * as zrUtil from "zrender/src/core/util";
import * as colorTool from "zrender/src/tool/color";
import * as graphic from "../../util/graphic";
import { extendChartView } from '../../export/api'
import { setStatesStylesFromModel, enableHoverEmphasis } from '../../util/states3d';
import { setLabelLineStyle, getLabelLineStatesModels } from '../../label/labelGuideHelper';
import { setLabelStyle, getLabelStatesModels } from '../../label/labelStyle';



import {
    Funnel3dSide,
    Funnel3dTop,
    Funnel3dButtom,
    Funnel3dButtomCube,
    Funnel3dTopCube,
    Funnel3dSideLeft,
    Funnel3dSideRight,
    Funnel3dSideStraight,
} from "./Funnel3dGraphic";

// 计算线性渐变
function gradSectorColor(color, level, points) {
    // 只支持字符串颜色值计算
    if (typeof color != "string") {
        return color;
    }

    return new graphic.LinearGradient(
        points[0],
        points[1],
        points[2],
        points[3],
        [
            {
                offset: 0,
                color: colorTool.lerp(level, [color, "#000"]),
            },
            {
                offset: 0.5,
                color: color,
            },
            {
                offset: 1,
                color: getEndColor(color, 1),
            },
        ]
    );
}

// 右侧面阴影渐变
function gradRightSideColor(color, level, points) {
    // 只支持字符串颜色值计算
    if (typeof color != "string") {
        return color;
    }

    return new graphic.LinearGradient(
        points[0],
        points[1],
        points[2],
        points[3],
        [
            {
                offset: 0,
                color: colorTool.lerp(level, [color, "#000"]),
            },
            {
                offset: 0.5,
                color: colorTool.lerp(level * 0.7, [color, "#000"]),
            },
            {
                offset: 0.7,
                color: colorTool.lerp(level * 0.3, [color, "#000"]),
            },
            {
                offset: 1,
                color: getEndColor(color, 1),
            },
        ]
    );
}

const extendHex = (shortHex) =>
    "#" +
    shortHex
        .slice(shortHex.startsWith("#") ? 1 : 0)
        .split("")
        .map((x) => x + x)
        .join("");

// 根据开始颜色计算结束颜色
function getEndColor(hex, opacity) {
    //如果是“red”格式的颜色值，则不转换。
    if (!/#?\d+/g.test(hex)) return hex;
    // 扩展3位颜色代码
    if (hex.length < 6) {
        hex = extendHex(hex);
    }
    var h = hex.charAt(0) == "#" ? hex.substring(1) : hex,
        r = parseInt(h.substring(0, 2), 16),
        g = parseInt(h.substring(2, 4), 16),
        b = parseInt(h.substring(4, 6), 16),
        a = opacity;
    if (hex.indexOf("rgb") > -1) {
        var startIndex = hex.indexOf("(");
        var endIndex = hex.indexOf(")");
        var rgbA = hex.substring(startIndex + 1, endIndex).split(",");
        r = parseInt(rgbA[0]);
        g = parseInt(rgbA[1]);
        b = parseInt(rgbA[2]);
    }
    // r -= 20;
    // g -= 20;
    // b -= 20;
    if (r < 0) r = 0;
    if (g < 0) g = 0;
    if (b < 0) b = 0;
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

/**
 * Piece of pie including Sector, Label, LabelLine
 * @constructor
 * @extends {module:zrender/graphic/Group}
 */
function Funnel3dPiece(data, idx) {
    graphic.Group.call(this);
    var polygon = graphic.Polygon.call(this) || this;

    var seriesModel = data.hostModel;
    var blockType = seriesModel.option.blockType;
    var sort = seriesModel.option.sort;

    // 顶面
    var funnel3dTop;
    if (blockType === "cube" || blockType === "cubeStraight") {
        funnel3dTop = new Funnel3dTopCube({
            name: "funnel3dTopCube",
            z: idx,
            z2: 2 + idx,
            zlevel: 1,
        });
    } else {
        funnel3dTop = new Funnel3dTop({
            name: "funnel3dTop",
            z: idx,
            z2: 2 + idx,
            zlevel: 1,
        });
    }
    // 底面
    var funnel3dButtom;
    if (blockType === "cube" || blockType === "cubeStraight") {
        funnel3dButtom = new Funnel3dButtomCube({
            name: "funnel3dButtomCube",
            z: idx,
            z2: 2 + idx,
            zlevel: 1,
        });
    } else {
        funnel3dButtom = new Funnel3dButtom({
            name: "funnel3dButtom",
            z: idx,
            z2: 2 + idx,
            zlevel: 1,
        });
    }
    // 侧面
    var funnel3dSide, funnel3dSideLeft, funnel3dSideRight;
    if (blockType === "cube" || blockType === "cubeStraight") {
        funnel3dSideLeft = new Funnel3dSideLeft({
            name: "funnel3dSideLeft",
            z: idx,
            z2: 2 + idx,
            zlevel: 1,
        });
        funnel3dSideRight = new Funnel3dSideRight({
            name: "funnel3dSideRight",
            z: idx,
            z2: 2 + idx,
            zlevel: 1,
        });
    } else if (blockType === "coneStraight") {
        funnel3dSide = new Funnel3dSideStraight({
            name: "funnel3dSideStraight",
            z: idx,
            z2: 2 + idx,
            zlevel: 1,
        });
    } else {
        funnel3dSide = new Funnel3dSide({
            name: "funnel3dSide",
            z: idx,
            z2: 2 + idx,
            zlevel: 1,
        });
    }
    var labelLine = new graphic.Polyline();
    var text = new graphic.Text();
    // 倒序的情况更换上下底面的绘制顺序
    if (sort === "descending") {
        this.add(funnel3dButtom);
        this.add(funnel3dTop);
    } else {
        this.add(funnel3dTop);
        this.add(funnel3dButtom);
    }
    // 根据样式添加相应侧面
    if (blockType === "cube" || blockType === "cubeStraight") {
        this.add(funnel3dSideRight);
        this.add(funnel3dSideLeft);
    } else {
        this.add(funnel3dSide);
    }

    this.add(labelLine);
    this.add(text)

    polygon.setTextContent(text);
    polygon.setTextGuideLine(labelLine);

    this.updateData(data, idx, true, blockType);
}


var opacityAccessPath = ["itemStyle", "opacity"];
Funnel3dPiece.prototype.updateData = function (data, idx, firstCreate, blockType) {
    var seriesModel = data.hostModel;
    var itemModel = data.getItemModel(idx);
    var emphasisModel = itemModel.getModel('emphasis');
    var options = seriesModel.option;

    // 漏斗样式
    var blockType = options.blockType;

    var startColor = seriesModel.get("color");
    var sort = options.sort;
    var dataLength = options.data.length;

    var funnel3dTop, funnel3dButtom;
    var funnel3dSide = this.childOfName("funnel3dSide");
    var funnel3dSideLeft, funnel3dSideRight;
    if (blockType === "cube" || blockType === "cubeStraight") {
        funnel3dTop = this.childOfName("funnel3dTopCube");
        funnel3dButtom = this.childOfName("funnel3dButtomCube");
        funnel3dSideLeft = this.childOfName("funnel3dSideLeft");
        funnel3dSideRight = this.childOfName("funnel3dSideRight");
    } else if (blockType === "coneStraight") {
        funnel3dTop = this.childOfName("funnel3dTop");
        funnel3dButtom = this.childOfName("funnel3dButtom");
        funnel3dSide = this.childOfName("funnel3dSideStraight");
    } else {
        funnel3dTop = this.childOfName("funnel3dTop");
        funnel3dButtom = this.childOfName("funnel3dButtom");
    }

    var itemModel = data.getItemModel(idx);
    var layout = data.getItemLayout(idx);
    var opacity = data.getItemModel(idx).get(opacityAccessPath);
    opacity = opacity == null ? 1 : opacity;
    // 看不见的顶面透明度设为0.1
    if (sort === "descending") {
        opacity = idx === 0 ? 1 : 0.1;
    } else {
        opacity = idx === dataLength - 1 ? 1 : 0.1;
    }
    // 立方体的情况
    var bottomOpacity = 0.2;
    if (
        blockType === "cube" ||
        (blockType === "cone" && sort !== "descending" && idx === dataLength - 1)
    ) {
        bottomOpacity = 1;
    }
    // 立方并且倒序的情况
    if (sort !== "descending" && idx === dataLength - 1) {
        opacity = 0.1;
    }

    // Reset style
    funnel3dTop.useStyle({});
    funnel3dButtom.useStyle({});
    if (funnel3dSideLeft && funnel3dSideRight) {
        funnel3dSideLeft.useStyle({});
        funnel3dSideRight.useStyle({});
    } else {
        funnel3dSide.useStyle({});
    }
    var shape = {
        cx: layout.cx,
        cy: layout.cy,
        cx1: layout.cx1,
        cy1: layout.cy1,
        a: layout.a,
        b: layout.b,
        a1: layout.a1,
        b1: layout.b1,
        point: JSON.stringify(layout.point),
        point2: JSON.stringify(layout.point2),
        index: layout.index,
        sort: layout.sort,
    };

    if (firstCreate) {
        funnel3dTop.setShape(shape);
        funnel3dTop.setStyle({ opacity: 0 });
        graphic.initProps(
            funnel3dTop,
            {
                style: {
                    opacity: opacity,
                },
            },
            seriesModel,
            idx
        );
        funnel3dButtom.setShape(shape);
        funnel3dButtom.setStyle({ opacity: 0 });
        graphic.initProps(
            funnel3dButtom,
            {
                style: {
                    opacity: bottomOpacity,
                },
            },
            seriesModel,
            idx
        );
        if (funnel3dSideLeft && funnel3dSideRight) {
            funnel3dSideLeft.setShape(shape);
            funnel3dSideLeft.setStyle({ opacity: 0 });
            graphic.initProps(
                funnel3dSideLeft,
                {
                    style: {
                        opacity: 0.7,
                    },
                },
                seriesModel,
                idx
            );
            funnel3dSideRight.setShape(shape);
            funnel3dSideRight.setStyle({ opacity: 0 });
            graphic.initProps(
                funnel3dSideRight,
                {
                    style: {
                        opacity: 0.7,
                    },
                },
                seriesModel,
                idx
            );
        } else {
            funnel3dSide.setShape(shape);
            funnel3dSide.setStyle({ opacity: 0 });
            graphic.initProps(
                funnel3dSide,
                {
                    style: {
                        opacity: 0.7,
                    },
                },
                seriesModel,
                idx
            );
        }
    } else {
        funnel3dTop.setStyle({ opacity: opacity });
        funnel3dButtom.setStyle({ opacity: bottomOpacity });
        if (funnel3dSideLeft && funnel3dSideRight) {
            funnel3dSideLeft.setStyle({ opacity: 0.5 });
            funnel3dSideRight.setStyle({ opacity: 0.5 });
        } else {
            funnel3dSide.setStyle({ opacity: 0.5 });
        }
    }

    // Update common style
    var itemStyleModel = itemModel.getModel("itemStyle");
    // var visualColor = data.getItemVisual(idx, 'color');
    var colorIndex = idx % startColor.length;
    var topSideColor, bottomSideColor, sideColor;
    // 右侧面颜色（较深）
    var sideColorRight;
    if (startColor[colorIndex]) {
        var indexColor = startColor[colorIndex];
        topSideColor = gradSectorColor(indexColor, 0.5, [0, 0, 0, 1]);
        bottomSideColor = gradSectorColor(indexColor, 0.7, [0, 0, 0, 1]);
        if (blockType === "cube" || blockType === "cubeStraight") {
            sideColor = gradSectorColor(indexColor, 0.1, [0, 0, 0, 1]);
            sideColorRight = gradRightSideColor(indexColor, 0.7, [0, 0, 0, 1]);
        } else {
            sideColor = gradSectorColor(indexColor, 0.7, [0, 0, 1, 0]);
        }
    }
    // 选中颜色

    funnel3dTop.setStyle(
        zrUtil.defaults(
            {
                lineJoin: "round",
                fill: topSideColor,
                stroke: topSideColor,
            },
            itemStyleModel.getItemStyle(["opacity"])
        )
    );

    // 设置选中边线颜色


    funnel3dButtom.setStyle(
        zrUtil.defaults(
            {
                lineJoin: "round",
                fill: bottomSideColor,
                stroke: bottomSideColor,
            },
            itemStyleModel.getItemStyle(["opacity"])
        )
    );

    // 设置选中边线颜色


    if (funnel3dSideLeft && funnel3dSideRight) {
        funnel3dSideLeft.setStyle(
            zrUtil.defaults(
                {
                    lineJoin: "round",
                    fill: sideColor,
                    stroke: sideColor,
                },
                itemStyleModel.getItemStyle(["opacity"])
            )
        );

        // 设置选中边线颜色

        funnel3dSideRight.setStyle(
            zrUtil.defaults(
                {
                    lineJoin: "round",
                    fill: sideColorRight,
                    stroke: sideColorRight,
                },
                itemStyleModel.getItemStyle(["opacity"])
            )
        );

        // 设置选中边线颜色

    } else {
        funnel3dSide.setStyle(
            zrUtil.defaults(
                {
                    lineJoin: "round",
                    fill: sideColor,
                    stroke: sideColor,
                },
                itemStyleModel.getItemStyle(["opacity"])
            )
        );

        // 设置选中边线颜色

    }

    setStatesStylesFromModel(this, itemModel);
    this._updateLabel(data, idx);
    enableHoverEmphasis(this, emphasisModel.get('focus'), emphasisModel.get('blurScope'));
};

Funnel3dPiece.prototype._updateLabel = function (data, idx) {
    var polygon = this;
    var labelLine = this.getTextGuideLine();
    var labelText = polygon.getTextContent();
    var seriesModel = data.hostModel;
    var itemModel = data.getItemModel(idx);
    var layout = data.getItemLayout(idx);
    var labelLayout = layout.label;
    var style = data.getItemVisual(idx, 'style');
    var visualColor = style.fill;
    // 标签
    setLabelStyle( // position will not be used in setLabelStyle
        labelText, getLabelStatesModels(itemModel), {
        labelFetcher: data.hostModel,
        labelDataIndex: idx,
        defaultOpacity: style.opacity,
        defaultText: data.getName(idx)
    }, {
        normal: {
            align: labelLayout.textAlign,
            verticalAlign: labelLayout.verticalAlign
        }
    });
    polygon.setTextConfig({
        local: true,
        inside: !!labelLayout.inside,
        insideStroke: visualColor,
        // insideFill: 'auto',
        outsideFill: visualColor
    });
    var linePoints = labelLayout.linePoints;
    labelLine.setShape({
        points: linePoints
    });
    polygon.textGuideLineConfig = {
        anchor: linePoints ? new graphic.Point(linePoints[0][0], linePoints[0][1]) : null
    }; // Make sure update style on labelText after setLabelStyle.
    // Because setLabelStyle will replace a new style on it.

    graphic.updateProps(labelText, {
        style: {
            x: labelLayout.x,
            y: labelLayout.y
        }
    }, seriesModel, idx);
    labelText.attr({
        rotation: labelLayout.rotation,
        originX: labelLayout.x,
        originY: labelLayout.y,
        z2: 10
    });
    setLabelLineStyle(polygon, getLabelLineStatesModels(itemModel), {
        // Default use item visual color
        stroke: visualColor
    });
};


zrUtil.inherits(Funnel3dPiece, graphic.Group);

var Funnel3dView = extendChartView({
    type: "funnel3d",

    render: function (seriesModel, ecModel, api) {
        var data = seriesModel.getData();
        var oldData = this._data;

        var group = this.group;

        data
            .diff(oldData)
            .add(function (idx) {
                var funnelPiece = new Funnel3dPiece(data, idx);

                data.setItemGraphicEl(idx, funnelPiece);

                group.add(funnelPiece);
            })
            .update(function (newIdx, oldIdx) {
                var piePiece = oldData.getItemGraphicEl(oldIdx);

                piePiece.updateData(data, newIdx);

                group.add(piePiece);
                data.setItemGraphicEl(newIdx, piePiece);
            })
            .remove(function (idx) {
                var piePiece = oldData.getItemGraphicEl(idx);
                group.remove(piePiece);
            })
            .execute();

        this._data = data;
    },

    remove: function () {
        this.group.removeAll();
        this._data = null;
    },

    dispose: function () { },
});

export default Funnel3dView;
