import * as util from 'zrender/src/core/util';
import { extendComponentView } from '../../export/api'
import * as graphic from '../../util/graphic';

var BACKGROUND_NAME = 'background';

export default extendComponentView({
	type: 'background',

	newlineDisabled: false,

	init: function () {

	},

	render: function (backgroundModel, ecModel, api) {

		//先清除所有
		this._reset();
		
		// 遍历series, 查找bar3d和bar
		ecModel.eachSeries(function (seriesModel) {
			if (seriesModel.subType === 'bar3d' || seriesModel.subType === 'bar') {
				backgroundCreator[seriesModel.subType](this.group, seriesModel, backgroundModel, api);
			}
		}, this);
		//}
	},

	_reset: function () {
		this.group.removeAll();
	}


});


function getLayout(seriesModel, layout, itemModel) {
	layout = util.clone(layout);
	var cartesian = seriesModel.coordinateSystem;
	var baseAxis = cartesian.getBaseAxis();
	var isHorizontal = baseAxis.isHorizontal();
	var grid = cartesian.master;
	var rect = grid.getRect();

	if (isHorizontal) {
		if (layout.height > 0) {
			layout.height = rect.height - (layout.y - rect.y);
		} else {
			layout.height = -(layout.y - rect.y);
		}
	} else {
		if (layout.width >= 0) {
			layout.width = rect.width - (layout.x - rect.x);
		} else {
			layout.width = -(layout.x - rect.x);
		}
	}
	layout.length = itemModel.get('barLength');
	return layout;
}


var backgroundCreator = {
	bar: barBackground,
	bar3d: bar3dBackground
}


/**
 * 2.5D柱状图背景柱子创建
 * @param {*} seriesModel
 * @param {*} backgroundModel
 * @param {*} api
 * @param {*} startX
 */
function bar3dBackground(group, seriesModel, backgroundModel, api) {
	// 注入下背景配置
	setModelByDI(seriesModel, backgroundModel);

	if (!backgroundModel.get('show', true)) {
		return;
	}

	var barType = seriesModel.get('barType');
	var view = api.getViewOfSeriesModel(seriesModel);
	var creator = view.elCreator[barType];
	var data = seriesModel.getData();
	var cartesian = seriesModel.coordinateSystem;
	var baseAxis = cartesian.getBaseAxis();
	var isHorizontal = baseAxis.isHorizontal();
	var key = isHorizontal ? 'x' : 'y';
	var role = isHorizontal ? 'height' : 'width';
	var oldData = this._data;

	data.diff(oldData)
		.add(function (dataIndex) {
			var el = createElement(data, dataIndex, seriesModel, key, role, group, creator, isHorizontal, backgroundModel, view, barType);
			el && group.add(el);
		})
		.update(function (dataIndex) {
			var el = createElement(data, dataIndex, seriesModel, key, role, group, creator, isHorizontal, backgroundModel, view, barType, true);
			el && group.add(el);
		})
		.execute();

	this._data = data;
}

/**
 * 将series配置注入修改背景配置
 * @param {*} seriesModel
 * @param {*} backgroundModel
 */
function setModelByDI(seriesModel, backgroundModel) {
	var option = seriesModel.get('background');
	backgroundModel.option = util.clone(backgroundModel.getDefaultOption());
	backgroundModel.mergeOption(option);
}

/**
 * 2D柱状图背景柱子创建
 * @param {*} seriesModel
 * @param {*} backgroundModel
 * @param {*} api
 * @param {*} startX
 */
function barBackground(group, seriesModel, backgroundModel, api) {
	// 注入下背景配置
	setModelByDI(seriesModel, backgroundModel);

	if (!backgroundModel.get('show', true)) {
		return;
	}

	var view = api.getViewOfSeriesModel(seriesModel);
	var creator = view.elementCreator['cartesian2d'];
	var data = seriesModel.getData();
	var cartesian = seriesModel.coordinateSystem;
	var baseAxis = cartesian.getBaseAxis();
	var isHorizontal = baseAxis.isHorizontal();
	var key = isHorizontal ? 'x' : 'y';
	var role = isHorizontal ? 'height' : 'width';
	var oldData = this._data;
	let el;

	data.diff(oldData)
		.add(function (dataIndex) {
			el = createElement(data, dataIndex, seriesModel, key, role, group, creator, isHorizontal, backgroundModel, view, null, false);
			el && group.add(el);
		})
		.update(function (dataIndex) {
			el = createElement(data, dataIndex, seriesModel, key, role, group, creator, isHorizontal, backgroundModel, view, null, false);
			el && group.add(el);
		})
		.execute();

	this._data = data;
}

/**
 * 动画
 * @param {*} el
 * @param {*} seriesModel
 * @param {*} dataIndex
 * @param {*} layout
 * @param {*} barLayout
 * @param {*} barType
 * @param {*} isHorizontal
 * @param {*} isUpdate
 */
function animator(el, seriesModel, dataIndex, layout, barLayout, barType, isHorizontal, isUpdate) {
	var shape;
	if (isHorizontal) {
		shape = {
			y: barLayout.y + barLayout.height + (barType === 'cylinder' && el.name === 'frontSide' ? -barLayout.width / 8 : 0),
			height: layout.height - barLayout.height
		}
	} else {
		shape = {
			x: barLayout.x + barLayout.width + (barType === 'cylinder' && el.name === 'frontSide' ? barLayout.height / 8 : 0),
			width: layout.width - barLayout.width
		}
	}

	graphic[isUpdate ? 'updateProps' : 'initProps'](el, {
		shape: shape
	}, seriesModel, dataIndex);
}


/**
 * 创建柱子背景
 * @param {*} data
 * @param {*} dataIndex
 * @param {*} seriesModel
 * @param {*} key
 * @param {*} role
 * @param {*} group
 * @param {*} creator
 * @param {*} isHorizontal
 * @param {*} backgroundModel
 * @param {*} view
 * @param {*} barType
 * @param {*} isUpdate
 */
function createElement(data, dataIndex, seriesModel, key, role, group, creator, isHorizontal, backgroundModel, view, barType, isUpdate) {
	var barLayout = data.getItemLayout(dataIndex);
	if (!barLayout) {
		return null;
	}
	var itemModel = data.getItemModel(dataIndex);
	var layout = getLayout(seriesModel, barLayout, itemModel);
	var name = BACKGROUND_NAME + layout[key] + (layout[role] > 0 ? '+' : '-');
	var el = group.childOfName(name);

	if (!el) {
		el = creator(data, dataIndex, itemModel, layout, isHorizontal, null, seriesModel, isUpdate);
		el.name = BACKGROUND_NAME + layout[key] + (layout[role] > 0 ? '+' : '-');
	}
	var dataModel = {
		getItemVisual: function (index, name) {
			let path = Array.isArray(name) ? name.join('.') : name;
			return backgroundModel.get(path);
		}
	};
	(barType ? view.styleCreator[barType] : view.updateStyle)(el, dataModel, dataIndex, backgroundModel, layout, seriesModel, isHorizontal);

	el.childOfName && el.remove(el.childOfName('bottomSurface'));

	if (!backgroundModel.get('layer')) {
		if (el.eachChild) {
			el.eachChild(function (c) {
				animator(c, seriesModel, dataIndex, layout, barLayout, barType, isHorizontal, isUpdate);
			})
		} else {
			animator(el, seriesModel, dataIndex, layout, barLayout, barType, isHorizontal, isUpdate);
		}
	}

	if (el.isGroup) {
		el.traverse(function (child) {
			child.ignoreEvent = true; // 不触发任何事件
		})
	} else {
		el.ignoreEvent = true; // 不触发任何事件
	}
	return el;
}
