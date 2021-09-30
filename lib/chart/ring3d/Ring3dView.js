import { extend, defaults, inherits, curry, bind } from 'zrender/lib/core/util';
import { lift, lerp, modifyAlpha } from 'zrender/lib/tool/color';
import { extendChartView } from '../../export/api'
import { Group, Sector, initProps } from '../../util/graphic';
import * as graph from './Ring3dGraphic';


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
 * 更新选中数据
 * @param {module:echarts/model/Series} seriesModel
 * @param {boolean} hasAnimation
 * @inner
 */
function updateDataSelected(uid, seriesModel, hasAnimation, api) {
	var data = seriesModel.getData();
	var dataIndex = this.dataIndex;
	var name = data.getName(dataIndex);
	var selectedOffset = seriesModel.get('selectedOffset');

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
	let midAngle = (layout.startAngle + layout.endAngle) / 2;

	let dx = Math.cos(midAngle);
	let dy = Math.sin(midAngle);

	let offset = isSelected ? selectedOffset : 0;
	let position = [dx * offset, dy * offset];
	// animateTo will stop revious animation like update transition
	!hasAnimation ? el.attr('position', position) : el.animate()
		.when(200, {
			position: position
		})
		.start('bounceOut');
}


/**
 * Piece of pie including Sector, Label, LabelLine
 * @constructor
 * @extends {module:zrender/graphic/Group}
 */
function PiePiece(data, idx) {

	Group.call(this);

	let sector3DBottom = new graph.Sector3DBottom({
		name: "sector3DBottom",
		z: idx,
		z2: 2 + idx,
		zlevel: 1
	});
	let sector3DTop = new graph.Sector3DTop({
		name: "sector3DTop",
		z: idx,
		z2: 2 + idx,
		zlevel: 1
	});
	let sector3DSideInnerLeft = new graph.Sector3DSideInnerLeft({
		name: "sector3DSideInnerLeft",
		z: idx,
		z2: 2 + idx,
		zlevel: 1
	});
	let sector3DSideInnerRight = new graph.Sector3DSideInnerRight({
		name: "sector3DSideInnerRight",
		z: idx,
		z2: 2 + idx,
		zlevel: 1
	});
	let sector3DSideOutter = new graph.Sector3DSideOutter({
		name: "sector3DSideOutter",
		z: idx,
		z2: 2 + idx,
		zlevel: 1
	});
	let sectorRingChassis = new graph.SectorRingChassis({
		name: 'sectorRingChassis',
		z: idx,
		z2: 2 + idx,
		zlevel: 1
	});
	//圆环底部的圆
	let sectorRingCircle = new graph.SectorRingCircle({
		name: 'sectorRingCircle',
		z: idx,
		z2: 2 + idx,
		zlevel: 1
	});
	let sectorText = new graph.SectorText({
		name: "sectorText",
		z: idx,
		z2: 10 + idx,
		zlevel: 1
	});

	this.add(sectorRingChassis);
	this.add(sectorRingCircle);
	this.add(sector3DBottom);
	this.add(sector3DSideInnerLeft);
	this.add(sector3DSideInnerRight);
	this.add(sector3DSideOutter);
	this.add(sector3DTop);
	this.add(sectorText);
	this.updateData(data, idx, true);
}

const piePieceProto = PiePiece.prototype;


piePieceProto.updateData = function (data, idx, firstCreate) {
	var seriesModel = data.hostModel;
	let sectorRingChassis = this.childOfName("sectorRingChassis");//底盘
	let sectorRingCircle = this.childOfName("sectorRingCircle");//圆环下面的圆

	let sector3DBottom = this.childOfName("sector3DBottom");//圆环底部
	let sector3DTop = this.childOfName("sector3DTop");//圆环顶部
	let sector3DSideInnerLeft = this.childOfName("sector3DSideInnerLeft");//圆环左侧面
	let sector3DSideInnerRight = this.childOfName("sector3DSideInnerRight");//圆环右侧面
	let sector3DSideOutter = this.childOfName("sector3DSideOutter");//圆环外侧面
	let sectorText = this.childOfName("sectorText");//文字标签
	let itemModel = data.getItemModel(idx);
	let layout = data.getItemLayout(idx);
	let sectorShape = extend({}, layout);
	sectorRingCircle.setShape(sectorShape);
	sectorRingChassis.setShape(sectorShape);
	sector3DBottom.setShape(sectorShape);
	sector3DTop.setShape(sectorShape);
	sector3DSideInnerLeft.setShape(sectorShape);
	sector3DSideInnerRight.setShape(sectorShape);
	sector3DSideOutter.setShape(sectorShape);
	sectorText.setShape(sectorShape);
	// Update common style
	let itemStyleModel = itemModel.getModel('itemStyle');
	let visualColor = data.getItemVisual(idx, 'style').fill;
	let _leftColor = leftColor(visualColor, -0.1);

	var emphasisModel = itemModel.getModel('emphasis');
	let emphasisStyle = emphasisModel.getItemStyle();
	emphasisStyle.color = _leftColor;
	emphasisStyle.fill = _leftColor;
	emphasisStyle.stroke = _leftColor;

	let sideColor = typeof visualColor === 'string' ? visualColor : visualColor.colorStops[0].color;

	let gradientColorSide = lerp(0.4, [sideColor, '#000']);//圆环侧面颜色(在色系颜色基础上加深)
	let ringColor = modifyAlpha(sideColor, 0.25);//圆环下面的圆的颜色 在色系颜色基础上加透明度
	let ringChassisBackground = sectorShape.ringChassisBackground;
	//底盘样式
	sectorRingChassis.useStyle(
		defaults({
			fill: ringChassisBackground,
			stroke: 'rgba(255,255,255,0)'
		},
			itemStyleModel.getModel('normal').getItemStyle()
		)
	)

	//圆环下面的圆的样式
	sectorRingCircle.useStyle(
		defaults({
			fill: ringColor,
			stroke: 'rgba(255,255,255,0)',
			z2: 0//2 + idx
		},
			itemStyleModel.getModel('normal').getItemStyle()
		)
	)

	sector3DBottom.useStyle(
		defaults({
			lineJoin: 'bevel',
			fill: visualColor,
			stroke: visualColor,
			z2: 0//2 + idx
		},
			itemStyleModel.getModel('normal').getItemStyle()
		)
	)

	sector3DTop.useStyle(
		defaults({
			lineJoin: 'bevel',
			fill: visualColor,
			stroke: visualColor,
			z2: 0//2 + idx
		},
			itemStyleModel.getModel('normal').getItemStyle()
		)
	)

	sector3DSideInnerLeft.useStyle(
		defaults({
			lineJoin: 'bevel',
			fill: gradientColorSide,
			stroke: gradientColorSide,
			z2: 0//2 + idx
		},
			itemStyleModel.getModel('normal').getItemStyle()
		)
	);

	sector3DSideInnerRight.useStyle(
		defaults({
			lineJoin: 'bevel',
			fill: gradientColorSide,
			stroke: gradientColorSide,
			z2: 0//2 + idx
		},
			itemStyleModel.getModel('normal').getItemStyle()
		)
	);

	sector3DSideOutter.useStyle(
		defaults({
			lineJoin: 'bevel',
			fill: gradientColorSide,
			stroke: gradientColorSide,
			z2: 0//2 + idx
		},
			itemStyleModel.getModel('normal').getItemStyle()
		)
	);


	sectorText.useStyle(
		defaults({
			fill: sectorShape.labelStyle.color
		},
			itemStyleModel.getModel('normal').getItemStyle()
		)
	);

	[
		sectorRingChassis,
		sectorRingCircle,
		sector3DBottom,
		sector3DTop,
		sector3DSideInnerLeft,
		sector3DSideInnerRight,
		sector3DSideOutter,
		sectorText
	].map((item) => {
		item.off('mouseover').off('mouseout').off('emphasis').off('normal');
	})

};

inherits(PiePiece, Group);


// Pie view
let Ring3d = extendChartView({

	type: 'ring3d',

	init: function () {
		let sectorGroup = new Group();
		this._sectorGroup = sectorGroup;
	},
	render: function (seriesModel, ecModel, api, payload) {
		if (payload && (payload.from === this.uid)) {
			return;
		}

		let data = seriesModel.getData();
		let oldData = this._data;
		let group = this.group;

		let hasAnimation = ecModel.get('animation');
		let isFirstRender = !oldData;
		let animationType = seriesModel.get('animationType');

		let onSectorClick = curry(
			updateDataSelected, this.uid, seriesModel, hasAnimation, api
		);

		let selectedMode = seriesModel.get('selectedMode');

		data.diff(oldData)
			.add(function (idx) {
				let piePiece = new PiePiece(data, idx);
				window.a = piePiece
				// Default expansion animation
				if (isFirstRender && animationType !== 'scale') {
					piePiece.eachChild(function (child) {
						child.stopAnimation(true);
					});
				}

				selectedMode && piePiece.on('click', onSectorClick);

				group.add(piePiece);

				data.setItemGraphicEl(idx, piePiece);
			})
			.update(function (newIdx, oldIdx) {
				console.log('ss')
				let piePiece = oldData.getItemGraphicEl(oldIdx);
				window.b = piePiece
				piePiece.updateData(data, newIdx);

				piePiece.off('click');
				selectedMode && piePiece.on('click', onSectorClick);
				group.add(piePiece);
				data.setItemGraphicEl(newIdx, piePiece);
			})
			.remove(function (idx) {
				let piePiece = oldData.getItemGraphicEl(idx);
				group.remove(piePiece);
			})
			.execute();

		// 开场动画
		if (hasAnimation && isFirstRender && data.count() > 0 && animationType !== 'scale') {
			let shape = data.getItemLayout(0);
			let r = Math.max(api.getWidth(), api.getHeight()) / 2;
			let removeClipPath = bind(group.removeClipPath, group);
			group.setClipPath(this._createClipPath(
				shape.cx, shape.cy, r, shape.startAngle, shape.clockwise, removeClipPath, seriesModel
			));
		}

		this._data = data;
	},

	dispose: function () { },
	_createClipPath: function (
		cx, cy, r, startAngle, clockwise, cb, seriesModel
	) {
		let clipPath = new Sector({
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
	// containPoint: function (point, seriesModel) {
	// 	var data = seriesModel.getData();
	// 	var itemLayout = data.getItemLayout(0);
	// 	if (itemLayout) {
	// 		var dx = point[0] - itemLayout.cx;
	// 		var dy = point[1] - itemLayout.cy;
	// 		var radius = Math.sqrt(dx * dx + dy * dy);
	// 		return radius <= itemLayout.r && radius >= itemLayout.r0;
	// 	}
	// }

});

export default Ring3d;
