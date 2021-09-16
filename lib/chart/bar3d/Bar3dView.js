import * as zrUtil from 'zrender/lib/core/util';
import * as graphic from '../../util/graphic';
import Model from '../../model/Model';
import { extendChartView } from '../../export/api'

var BAR_BORDER_WIDTH_QUERY = ['itemStyle', 'normal', 'borderWidth'];

import {
	cubeView,
	updateCubeView,
	setCubeStyle,
	getCubeClipPath
} from './CubeView'

import {
	cylinderView,
	updateCylinderView,
	setCylinderStyle,
	getCylinderClipPath
} from './CylinderView'

import * as barItemStyle from './barItemStyle'
zrUtil.extend(Model.prototype, barItemStyle);

const Bar3dView = extendChartView({

	type: 'bar3d',

	render: function (seriesModel, ecModel, api) {
		this._createEl(seriesModel, ecModel, api);
	},

	_createEl: function (seriesModel, ecModel, api) {
		var group = this.group;
		var data = seriesModel.getData();
		var oldData = this._data;
		var cartesian = seriesModel.coordinateSystem;
		var baseAxis = cartesian.getBaseAxis();
		var isHorizontal = baseAxis.isHorizontal();
		var animationModel = seriesModel.isAnimationEnabled() ? seriesModel : null;
		var barType = seriesModel.get('barType');
		var me = this;

		data.diff(oldData)
			.add(function (dataIndex) {
				if (!data.hasValue(dataIndex)) {
					return;
				}
				var itemModel = data.getItemModel(dataIndex);
				var layout = getRectItemLayout(data, dataIndex, itemModel);
				var el = me.elCreator[barType](data, dataIndex, itemModel, layout, isHorizontal, animationModel, seriesModel, true, true);

				me.styleCreator[barType](el, data, dataIndex, itemModel, layout, seriesModel, isHorizontal);

				data.setItemGraphicEl(dataIndex, el);
				group.add(el);
			})
			.update(function (newIndex, oldIndex) {
				var el = oldData.getItemGraphicEl(oldIndex);

				if (!data.hasValue(newIndex)) {
					group.remove(el);
					return;
				}

				var itemModel = data.getItemModel(newIndex);
				var layout = getRectItemLayout(data, newIndex, itemModel);

				if (el) {
					me.updateCreator[barType](el, layout, isHorizontal, animationModel, newIndex);
				} else {
					el = me.elCreator[barType](data, newIndex, itemModel, layout, isHorizontal, animationModel, seriesModel, true, true);
				}
				data.setItemGraphicEl(newIndex, el);
				group.add(el);

				me.styleCreator[barType](el, data, newIndex, itemModel, layout, seriesModel, isHorizontal);
			})
			.remove(function (dataIndex) {
				var el = oldData.getItemGraphicEl(dataIndex);
				el && removeElement(dataIndex, animationModel, el);
			})
			.execute();

		this._data = data;
	},

	updateCreator: {
		cube: updateCubeView,
		cylinder: updateCylinderView
	},

	elCreator: {
		cube: cubeView,
		cylinder: cylinderView
	},

	styleCreator: {
		cube: setCubeStyle,
		cylinder: setCylinderStyle
	},

	remove: function (ecModel, api) {
		var group = this.group;
		var data = this._data;
		if (ecModel.get('animation')) {
			if (data) {
				data.eachItemGraphicEl(function (el) {
					removeElement(el.dataIndex, ecModel, el);
				});
			}
		} else {
			group.removeAll();
		}
		this._data = null;
	},

	/**
	 * 获取侧面的宽度
	 * @param {*} layout
	 * @param {*} isHorizontal
	 */
	getSideWidth: function (layout, isHorizontal) {
		var angle = Math.PI / 4;
		// 根据是横轴显示还是竖轴显示来计算x,y取整， 影响绘制图形（不取整）
		var width = layout.width,
			height = layout.height,
			length = layout.shapeLength ? layout.shapeLength : (isHorizontal ? width : height);

		var r = length;

		return isHorizontal ? r * Math.sin(angle) / 2 : r * Math.cos(angle) / 2;
	},

	getRectItemLayout: getRectItemLayout,

	getCubeClipPath: getCubeClipPath,

	getCylinderClipPath: getCylinderClipPath,

	dispose: function () { }
});


/**
 * 删除图形
 * @param {Number} dataIndex
 * @param {Object} animationModel
 * @param {Group} el
 */
function removeElement(dataIndex, animationModel, el) {

	// 运动的时候不显示文字
	el.eachChild(function (childEl) {
		childEl.style.text = '';
	});

	if (animationModel) {
		el.eachChild(function (ch) {
			graphic.updateProps(ch, {
				shape: el.isHorizontal ? {
					height: 0
				} : {
					width: 0
				}
			}, animationModel, dataIndex, function () {
				el.parent && el.parent.remove(el);
			});
		});
	} else {
		graphic.updateProps(el, {
			shape: {}
		}, animationModel, dataIndex, function () {
			el.parent && el.parent.remove(el);
		});
	}
}

/**
 * 获取柱状图柱子布局大小
 * @param {} data
 * @param {Number} dataIndex
 * @param {Model} itemModel
 */
function getRectItemLayout(data, dataIndex, itemModel) {
	var layout = data.getItemLayout(dataIndex);
	var fixedLineWidth = getLineWidth(itemModel, layout);

	// fix layout with lineWidth
	var signX = layout.width > 0 ? 1 : -1;
	var signY = layout.height > 0 ? 1 : -1;

	return {
		x: layout.x + signX * fixedLineWidth / 2,
		y: layout.y + signY * fixedLineWidth / 2,
		width: layout.width - signX * fixedLineWidth,
		height: layout.height - signY * fixedLineWidth,
		shapeLength: itemModel.get('barLength')
	};
}

// In case width or height are too small.
function getLineWidth(itemModel, rawLayout) {
	var lineWidth = itemModel.get(BAR_BORDER_WIDTH_QUERY) || 0;
	return Math.min(lineWidth, Math.abs(rawLayout.width), Math.abs(rawLayout.height));
}

export default Bar3dView;
