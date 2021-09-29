import { defaults, isObject, inherits, curry, extend } from 'zrender/lib/core/util';
import { lift, lerp } from 'zrender/lib/tool/color';
import { extendChartView } from '../../export/api';
import {
	LinearGradient, Group, Polyline, Text, initProps, updateProps, Sector
} from '../../util/graphic';
import { setLabelStyle, getLabelStatesModels } from '../../label/labelStyle';
import { setStatesStylesFromModel, enableHoverEmphasis } from '../../util/states3d';
import * as graphic from './Pie3dGraphic';
import labelLayout from './labelLayout';


/**
 * 颜色高亮
 * @param {String|Object} color
 * @param {Number| -1~1} level
 */
function leftColor(color, level) {
	if (typeof color == 'string') {
		return lift(color, level)
	} else {
		// 设置的是渐变色,不改变
		return color;
	}
}

/**
 * 颜色变暗
 * @param {String|Object} color
 * @param {Number| -1~1} level
 */
function lerpColor(color, level) {
	if (typeof color == 'string') {
		return lerp(level, [color, '#000'])
	} else {
		// 设置的是渐变色, 不改变
		return color;
	}
}

/**
 * 计算渐变色
 * @param {String} color
 */
function gradColor(color, isHorizontal) {
	// 只支持字符串颜色值计算
	if (typeof color != 'string') {
		return color;
	}

	return new LinearGradient(
		0, 0, isHorizontal ? 1 : 0, isHorizontal ? 0 : 1,
		[{
			offset: 0,
			color: color
		},
		{
			offset: 0.43,
			color: lerp(0.6, [color, '#000'])
		},
		{
			offset: 0.57,
			color: lerp(0.6, [color, '#000'])
		},
		{
			offset: 1,
			color: color
		}
		]
	);
}

/**
 * 获取轻微的颜色渐变
 * @param {String} color
 * @param {Number| 0~1} level
 * @param {Boolean} isHorizontal
 */
function gradSlapColor(color, level, isHorizontal) {
	// 只支持字符串颜色值计算
	if (typeof color != 'string') {
		return color;
	}

	return new LinearGradient(
		// 0, 0, isHorizontal ? 0 : 1, isHorizontal ? 1 : 0,
		0, 0, 0, 1,
		[{
			offset: 0,
			color: lerp(level, [color, '#000'])
		},
		{
			offset: 1,
			color: color
		}
		]
	);
}

/**
 * 按扇形角度渐变
 */
function gradSectorColor(color, level, points) {
	// 只支持字符串颜色值计算
	if (typeof color != 'string') {
		return color;
	}

	return new LinearGradient(
		points[0], points[1], points[2], points[3],
		[{
			offset: 0,
			color: lerp(level, [color, '#000'])
		},
		{
			offset: 1,
			color: color
		}
		]
	);
}

/**
 * 根据角度计算渐变色的起点和终点
 * @param {*} radians
 */
function angleToPoints(radians) {
	var offset = Math.PI / 2;
	return [
		(0.5 * Math.cos(radians + offset)) + 0.5,
		(0.5 * Math.sin(radians + offset)) + 0.5,
		(0.5 * Math.cos(radians + Math.PI + offset)) + 0.5,
		(0.5 * Math.sin(radians + Math.PI + offset)) + 0.5,
	]
}

/**
 * @param {module:echarts/model/Series} seriesModel
 * @param {boolean} hasAnimation
 * @inner
 */
function updateDataSelected(uid, seriesModel, hasAnimation, api) {
	var data = seriesModel.getData();
	var dataIndex = this.dataIndex;
	var name = data.getName(dataIndex);
	var selectedOffset = seriesModel.get('selectedOffset');
	// var selectedOffset = 20;

	api.dispatchAction({
		type: 'pieToggleSelect',
		from: uid,
		name: name,
		seriesId: seriesModel.id
	});

	data.each(function (idx) {
		toggleItemSelected(
			data.getItemGraphicEl(idx),
			data.getItemLayout(idx),
			seriesModel.isSelected(data.getName(idx)),
			selectedOffset,
			hasAnimation
		);
	});
}

/**
 * @param {module:zrender/graphic/Sector} el
 * @param {Object} layout
 * @param {boolean} isSelected
 * @param {number} selectedOffset
 * @param {boolean} hasAnimation
 * @inner
 */
function toggleItemSelected(el, layout, isSelected, selectedOffset, hasAnimation) {
	if (!el) return
	var midAngle = (layout.startAngle + layout.endAngle) / 2;

	var dx = Math.cos(midAngle);
	var dy = Math.sin(midAngle);

	var offset = isSelected ? selectedOffset : 0;
	var position = [dx * offset, dy * offset];

	hasAnimation
		// animateTo will stop revious animation like update transition
		?
		el.animate()
			.when(200, {
				position: position
			})
			.start('bounceOut') :
		el.attr('position', position);
}

// var piePieceIndex = 0;

/**
 * Piece of pie including Sector, Label, LabelLine
 * @constructor
 * @extends {module:zrender/graphic/Group}
 */
function PiePiece(data, idx) {
	Group.call(this);

	var sector3DBottom = new graphic.Sector3DBottom({
		name: "sector3DBottom",
		ignore: false,
		invisible: false,
		z: idx,
		z2: idx,
		zlevel: 1
	});
	var sector3DTop = new graphic.Sector3DTop({
		name: "sector3DTop",
		ignore: false,
		invisible: false,
		z: idx,
		z2: 100 + idx,
		zlevel: 1
	});
	var sector3DSideInnerLeft = new graphic.Sector3DSideInnerLeft({
		name: "sector3DSideInnerLeft",
		ignore: false,
		invisible: false,
		z: idx,
		z2: 2 + idx,
		zlevel: 1
	});
	var sector3DSideInnerRight = new graphic.Sector3DSideInnerRight({
		name: "sector3DSideInnerRight",
		ignore: false,
		invisible: false,
		z: idx,
		z2: 2 + idx,
		zlevel: 1
	});
	var sector3DSideOutter = new graphic.Sector3DSideOutter({
		name: "sector3DSideOutter",
		ignore: false,
		invisible: false,
		z: idx,
		z2: 10 + idx,
		zlevel: 1
	});
	var sector3DSideOutterIN = new graphic.Sector3DSideOutterIN({
		name: "sector3DSideOutterIN",
		ignore: false,
		invisible: false,
		z: idx,
		z2: 2 + idx,
		zlevel: 1
	});
	var polyline = new Polyline({
		name: "sector3DLine",
	}); // new Sector3DLabelLine();
	var text = new Text({
		name: "sector3DText",
	});

	this.add(sector3DBottom);
	this.add(sector3DSideInnerLeft);
	this.add(sector3DSideInnerRight);
	this.add(sector3DSideOutterIN);
	this.add(sector3DSideOutter);
	this.add(sector3DTop);
	this.add(polyline);
	this.add(text);

	this.updateData(data, idx, true);

	// Hover to change label and labelLine
	function onEmphasis() {
		polyline.ignore = polyline.hoverIgnore;
		text.ignore = text.hoverIgnore;
	}

	function onNormal() {
		polyline.ignore = polyline.normalIgnore;
		text.ignore = text.normalIgnore;
	}
	this.on('emphasis', onEmphasis)
		.on('normal', onNormal)
		.on('mouseover', onEmphasis)
		.on('mouseout', onNormal);
}

function deepClone(obj) {
	let objClone = Array.isArray(obj) ? [] : {};
	if (obj && typeof obj === "object") {
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				//判断ojb子元素是否为对象，如果是，递归复制
				if (obj[key] && typeof obj[key] === "object") {
					objClone[key] = deepClone(obj[key]);
				} else {
					//如果不是，简单复制
					objClone[key] = obj[key];
				}
			}
		}
	}
	return objClone;
}

PiePiece.prototype.updateData = function (data, idx, firstCreate) {
	var sector = this.childOfName(0);
	var sector3DBottom = this.childOfName("sector3DBottom");
	var sector3DTop = this.childOfName("sector3DTop");
	var sector3DSideInnerLeft = this.childOfName("sector3DSideInnerLeft");
	var sector3DSideInnerRight = this.childOfName("sector3DSideInnerRight");
	var sector3DSideOutter = this.childOfName("sector3DSideOutter");
	var sector3DSideOutterIN = this.childOfName("sector3DSideOutterIN");

	var seriesModel = data.hostModel;
	var itemModel = data.getItemModel(idx);
	var layout = data.getItemLayout(idx);
	var sectorShape = extend({}, layout);
	sectorShape.label = null;

	if (firstCreate) {
		sector3DBottom.setShape(sectorShape);
		sector3DTop.setShape(sectorShape);
		sector3DSideInnerLeft.setShape(sectorShape);
		sector3DSideInnerRight.setShape(sectorShape);
		sector3DSideOutter.setShape(sectorShape);
		sector3DSideOutterIN.setShape(sectorShape);

		var animationType = seriesModel.getShallow('animationType');
		if (animationType === 'scale') {
			sector.shape.r = layout.r0;
			initProps(sector3DBottom, {
				shape: {
					r: layout.r
				}
			}, seriesModel, idx);
		}
		// Expansion
		else {
			sector3DBottom.shape.endAngle = layout.startAngle;
			sector3DTop.shape.endAngle = layout.startAngle;

			sector3DSideInnerLeft.shape.endAngle = layout.startAngle;
			sector3DSideInnerRight.shape.endAngle = layout.startAngle;
			sector3DSideOutter.shape.endAngle = layout.startAngle;
			sector3DSideOutterIN.shape.endAngle = layout.startAngle;

			updateProps(sector3DBottom, {
				shape: {
					endAngle: layout.endAngle
				}
			}, seriesModel, idx);
			updateProps(sector3DTop, {
				shape: {
					endAngle: layout.endAngle
				}
			}, seriesModel, idx);

			updateProps(sector3DSideInnerLeft, {
				shape: {
					endAngle: layout.endAngle
				}
			}, seriesModel, idx);
			updateProps(sector3DSideInnerRight, {
				shape: {
					endAngle: layout.endAngle
				}
			}, seriesModel, idx);
			updateProps(sector3DSideOutter, {
				shape: {
					endAngle: layout.endAngle
				}
			}, seriesModel, idx);
			updateProps(sector3DSideOutterIN, {
				shape: {
					endAngle: layout.endAngle
				}
			}, seriesModel, idx);
		}

	} else {
		updateProps(sector3DBottom, {
			shape: sectorShape
		}, seriesModel, idx);
		updateProps(sector3DTop, {
			shape: sectorShape
		}, seriesModel, idx);
		updateProps(sector3DSideInnerLeft, {
			shape: sectorShape
		}, seriesModel, idx);
		updateProps(sector3DSideInnerRight, {
			shape: sectorShape
		}, seriesModel, idx);
		updateProps(sector3DSideOutter, {
			shape: sectorShape
		}, seriesModel, idx);
		updateProps(sector3DSideOutterIN, {
			shape: sectorShape
		}, seriesModel, idx);
	}

	// Update common style
	var itemStyleModel = itemModel.getModel('itemStyle');
	var style = data.getItemVisual(idx, 'style')
	var visualColor = style.fill;
	var borderColor = sectorShape.borderColor;
	var themeHighColor = sectorShape.themeHighColor;

	var emphasisModel = itemModel.getModel('emphasis');
	var emphasisStyle = emphasisModel.getItemStyle();// itemStyleModel.getModel('emphasis').getItemStyle();
	var emphasisStyleValue = themeHighColor ? themeHighColor : leftColor(visualColor, -0.1);
	emphasisStyle.color = emphasisStyleValue;
	emphasisStyle.fill = emphasisStyleValue;

	var gradPoints = angleToPoints(sectorShape.startAngle);
	var gradientColorTop = gradSectorColor(visualColor, 0.3, gradPoints);
	var gradientColorSide;
	if (typeof visualColor != 'string') {
		gradientColorSide = deepClone(visualColor);
		var startColor = gradientColorSide && gradientColorSide.colorStops && gradientColorSide.colorStops[0] && gradientColorSide.colorStops[0].color;
		if (startColor) {
			gradientColorSide.colorStops[0].color = lerp(0.4, [startColor, '#000']);
		}
	} else {
		gradientColorSide = gradSectorColor(visualColor, 0.6, gradPoints);
	}

	sector3DBottom.useStyle(
		defaults({
			lineJoin: 'bevel',
			fill: visualColor,
			// stroke:"white"
			stroke: visualColor,
			z2: idx
		},
			itemStyleModel.getModel('normal').getItemStyle()
		)
	);
	sector3DTop.useStyle(
		defaults({
			lineJoin: 'bevel',
			// fill: visualColor,
			// fill: gradSlapColor(visualColor, 0.3, false),
			fill: gradientColorTop,
			// fill: gradColor(visualColor, true),
			// fill: gradRadialColor(0.5, 0.5, 1, visualColor, 0.5),
			// fill: gradRadialColor(sectorShape.cx, sectorShape.cy, sectorShape.r, visualColor, 0.5),
			// stroke: gradSlapColor(visualColor, 0.3, false),
			stroke: borderColor ? borderColor : gradientColorTop,
			// stroke: gradColor(visualColor, true),
			// stroke: gradRadialColor(0.5, 0.5, 1, visualColor, 0.5),
			// stroke: gradRadialColor(sectorShape.cx, sectorShape.cy, sectorShape.r, visualColor, 0.5),
			// stroke: visualColor,
			z2: 2 + idx
		},
			itemStyleModel.getModel('normal').getItemStyle()
		)
	);
	// sector3DBottom.hoverStyle = itemStyleModel.getModel('emphasis').getItemStyle();
	sector3DBottom.hoverStyle = emphasisStyle;
	// sector3DTop.hoverStyle = itemStyleModel.getModel('emphasis').getItemStyle();
	sector3DTop.hoverStyle = emphasisStyle;
	// sector3DSideInner.useStyle(
	//     zrUtil.defaults(
	//         {
	//             lineJoin: 'bevel',
	//             fill: visualColor,
	//             stroke:"white"
	//         },
	//         itemStyleModel.getModel('normal').getItemStyle()
	//     )
	// );
	sector3DSideInnerLeft.useStyle(
		defaults({
			lineJoin: 'bevel',
			// fill: visualColor,
			fill: gradientColorSide,
			// fill: gradSlapColor(visualColor, 0.6, false),
			// stroke:"white",
			// stroke: visualColor,
			stroke: borderColor ? borderColor : gradientColorSide,
			// stroke: gradSlapColor(visualColor, 0.6, false),
			z2: 2 + idx
		},
			itemStyleModel.getModel('normal').getItemStyle()
		)
	);
	sector3DSideInnerRight.useStyle(
		defaults({
			lineJoin: 'bevel',
			// fill: visualColor,
			// fill: gradientColorSide,
			fill: gradientColorSide,
			// fill: gradSlapColor(visualColor, 0.6, false),
			// stroke:"white"
			// stroke: visualColor,
			stroke: borderColor ? borderColor : gradientColorSide,
			// stroke: gradSlapColor(visualColor, 0.6, false),
			z2: 2 + idx
		},
			itemStyleModel.getModel('normal').getItemStyle()
		)
	);
	// sector3DSideInner.hoverStyle = itemStyleModel.getModel('emphasis').getItemStyle();
	// sector3DSideInnerLeft.hoverStyle = itemStyleModel.getModel('emphasis').getItemStyle();
	// sector3DSideInnerRight.hoverStyle = itemStyleModel.getModel('emphasis').getItemStyle();
	sector3DSideInnerLeft.hoverStyle = emphasisStyle;
	sector3DSideInnerRight.hoverStyle = emphasisStyle;
	sector3DSideOutter.useStyle(
		defaults({
			lineJoin: 'bevel',
			// fill: visualColor,
			// fill: gradSlapColor(visualColor, 0.6, false),
			fill: gradientColorSide,
			// stroke:"white"
			// stroke: visualColor,
			// stroke: gradSlapColor(visualColor, 0.6, false),
			stroke: borderColor ? borderColor : gradientColorSide,
			z2: 2 + idx
		},
			itemStyleModel.getModel('normal').getItemStyle()
		)
	);
	sector3DSideOutterIN.useStyle(
		defaults({
			lineJoin: 'bevel',
			// fill: visualColor,
			// fill: gradSlapColor(visualColor, 0.6, false),
			fill: gradientColorSide,
			// stroke:"white"
			// stroke: visualColor,
			// stroke: gradSlapColor(visualColor, 0.6, false),
			stroke: borderColor ? borderColor : gradientColorSide,
			z2: 2 + idx
		},
			itemStyleModel.getModel('normal').getItemStyle()
		)
	);
	// sector3DSideOutter.hoverStyle = itemStyleModel.getModel('emphasis').getItemStyle();
	sector3DSideOutter.hoverStyle = emphasisStyle;
	sector3DSideOutterIN.hoverStyle = emphasisStyle;

	var cursorStyle = itemModel.getShallow('cursor');
	cursorStyle && sector3DBottom.attr('cursor', cursorStyle);

	// Toggle selected
	toggleItemSelected(
		this,
		data.getItemLayout(idx),
		itemModel.get('selected'),
		seriesModel.get('selectedOffset'),
		seriesModel.get('animation')
	);

	function onEmphasis() {
		// Sector may has animation of updating data. Force to move to the last frame
		// Or it may stopped on the wrong shape
		sector3DTop.stopAnimation(true);
		sector3DTop.animateTo({
			shape: {
				r: layout.r + 10
			}
		}, 300, 'elasticOut');
	}

	function onNormal() {
		sector3DTop.stopAnimation(true);
		sector3DTop.animateTo({
			shape: {
				r: layout.r
			}
		}, 300, 'elasticOut');
	}
	sector3DTop.off('mouseover').off('mouseout').off('emphasis').off('normal');
	if (itemModel.get('hoverAnimation') && seriesModel.isAnimationEnabled()) {
		sector3DTop
			.on('mouseover', onEmphasis)
			.on('mouseout', onNormal)
			.on('emphasis', onEmphasis)
			.on('normal', onNormal);
	}

	this._updateLabel(seriesModel, data, idx, themeHighColor);
	enableHoverEmphasis(this, emphasisModel.get('focus'), emphasisModel.get('blurScope'));
	setStatesStylesFromModel(this, itemModel);
};

PiePiece.prototype._updateLabel = function (seriesModel, data, idx, themeHighColor) {

	var labelLine = this.childOfName("sector3DLine");
	var labelText = this.childOfName("sector3DText");

	var seriesModel = data.hostModel;
	var itemModel = data.getItemModel(idx);
	// 防止预览时标签及标签线默认被隐藏
	if (itemModel.option && itemModel.option.label) {
		itemModel.option.label = {};
	}
	if (itemModel.option && itemModel.option.labelLine) {
		itemModel.option.labelLine = {};
	}
	var layout = data.getItemLayout(idx);
	var labelLayout = layout.label;
	var visualColor = data.getItemVisual(idx, 'color');

	updateProps(labelLine, {
		shape: {
			smooth: 'spline',
			points: labelLayout.linePoints || [
				[labelLayout.x, labelLayout.y],
				[labelLayout.x, labelLayout.y],
				[labelLayout.x, labelLayout.y]
			]
		}
	}, seriesModel, idx);

	updateProps(labelText, {
		style: {
			x: labelLayout.x - (labelLayout.textAlign === 'right' ? labelLayout.width / 2 + 3 : 0),
			y: labelLayout.y - labelLayout.height
		}
	}, seriesModel, idx);
	labelText.attr({
		rotation: labelLayout.rotation,
		origin: [labelLayout.x, labelLayout.y],
		z2: 10
	});

	var labelModel = itemModel.getModel('label');
	var labelHoverModel = itemModel.getModel('emphasis.label');
	var labelLineModel = itemModel.getModel('labelLine');
	var labelLineHoverModel = itemModel.getModel('emphasis.labelLine');
	var visualColor = data.getItemVisual(idx, 'color');

	if (isObject(visualColor)) {
		visualColor = visualColor.colorStops ? (visualColor.colorStops[0].color || '#000') : '#000'; // 如果是渐变色默认取第一个颜色做标签颜色
	}

	// 指定标签文字选中色

	setLabelStyle(
		labelText,
		getLabelStatesModels(itemModel),
		{
			labelFetcher: data.hostModel,
			labelDataIndex: idx,
			defaultText: seriesModel.getFormattedLabel(idx, 'normal') || data.getName(idx),
			autoColor: visualColor,
			useInsideStyle: !!labelLayout.inside,
		},
		{
			textAlign: labelLayout.textAlign,
			textVerticalAlign: labelLayout.verticalAlign,
			opacity: data.getItemVisual(idx, 'opacity'),
			normal: {
				fill: visualColor,
			}
		}
	);

	labelText.ignore = labelText.normalIgnore = !labelModel.get('show');

	labelText.hoverIgnore = false;

	labelLine.ignore = labelLine.normalIgnore = !labelLineModel.get('show');
	labelLine.hoverIgnore = !labelLineModel.get('show')

	// Default use item visual color
	labelLine.setStyle({
		...labelLineModel.getModel('lineStyle').getLineStyle(),
		stroke: visualColor,
		opacity: data.getItemVisual(idx, 'opacity')
	});

	var smooth = labelLineModel.get('smooth');
	if (smooth && smooth === true) {
		smooth = 0.4;
	}
	labelLine.setShape({
		smooth: smooth
	});

};


inherits(PiePiece, Group);


// Pie view
var Pie3dView = extendChartView({

	type: 'pie3d',

	init: function () {
		var sectorGroup = new Group();
		this._sectorGroup = sectorGroup;
	},

	render: function (seriesModel, ecModel, api, payload) {
		if (payload && (payload.from === this.uid)) {
			return;
		}

		var data = seriesModel.getData();
		var oldData = this._data;
		var group = this.group;

		var hasAnimation = ecModel.get('animation');
		var isFirstRender = !oldData;
		var animationType = seriesModel.get('animationType');

		var onSectorClick = curry(
			updateDataSelected, this.uid, seriesModel, hasAnimation, api
		);

		var selectedMode = seriesModel.get('selectedMode');

		data.diff(oldData)
			.add(function (idx) {
				var piePiece = new PiePiece(data, idx);
				// Default expansion animation
				if (isFirstRender && animationType !== 'scale') {
					piePiece.eachChild(function (child) {
						child.stopAnimation(true);
					});
				}

				selectedMode && piePiece.on('click', onSectorClick);

				data.setItemGraphicEl(idx, piePiece);

				group.add(piePiece);
			})
			.update(function (newIdx, oldIdx) {
				var piePiece = oldData.getItemGraphicEl(oldIdx);

				piePiece.updateData(data, newIdx);

				piePiece.off('click');
				selectedMode && piePiece.on('click', onSectorClick);
				group.add(piePiece);
				data.setItemGraphicEl(newIdx, piePiece);
			})
			.remove(function (idx) {
				var piePiece = oldData.getItemGraphicEl(idx);
				group.remove(piePiece);
			})
			.execute();
		labelLayout(seriesModel); // Always use initial animation.
		this._data = data;
	},

	dispose: function () { },

	_createClipPath: function (
		cx, cy, r, startAngle, clockwise, cb, seriesModel
	) {
		var clipPath = new Sector({
			shape: {
				cx: cx,
				cy: cy,
				r0: 0,
				r: r,
				startAngle: startAngle,
				endAngle: startAngle,
				clockwise: clockwise
			}
		});

		initProps(clipPath, {
			shape: {
				endAngle: startAngle + (clockwise ? 1 : -1) * Math.PI * 2
			}
		}, seriesModel, cb);

		return clipPath;
	},

	/**
	 * @implement
	 */
	containPoint: function (point, seriesModel) {
		var data = seriesModel.getData();
		var itemLayout = data.getItemLayout(0);
		if (itemLayout) {
			var dx = point[0] - itemLayout.cx;
			var dy = point[1] - itemLayout.cy;
			var radius = Math.sqrt(dx * dx + dy * dy);
			return radius <= itemLayout.r && radius >= itemLayout.r0;
		}
	}

});

export default Pie3dView;
