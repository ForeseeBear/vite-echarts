import { curry, bind } from 'zrender/lib/core/util';
// import { mixin } from 'zrender/lib/core/util';
import { extendSeriesModel } from '../../export/api'
import { defaultEmphasis } from '../../util/model';
import LegendVisualProvider from '../../visual/LegendVisualProvider';
import createSeriesDataSimply from '../helper/createSeriesDataSimply';
import { makeSeriesEncodeForNameBased } from '../../data/helper/sourceHelper';

var Ring3dSeries = extendSeriesModel({

	type: 'series.ring3d',

	// Overwrite
	init: function (option) {
		Ring3dSeries.superApply(this, 'init', arguments);

		// Enable legend selection for each data item
		// Use a function instead of direct access because data reference may changed
		this.legendVisualProvider = new LegendVisualProvider(bind(this.getData, this), bind(this.getRawData, this));

		// this._defaultLabelLine(option);
	},

	// Overwrite
	mergeOption: function (newOption) {
		Ring3dSeries.superCall(this, 'mergeOption', newOption);
	},

	getInitialData: function (option, ecModel) {
		return createSeriesDataSimply(this, {
			coordDimensions: ['value'],
			encodeDefaulter: curry(makeSeriesEncodeForNameBased, this)
		});
	},

	// Overwrite
	getDataParams: function (dataIndex) {
		var data = this.getData();
		var params = Ring3dSeries.superCall(this, 'getDataParams', dataIndex);
		var sum = data.getSum('value');
		// FIXME toFixed?
		//
		// Percent is 0 if sum is 0
		params.percent = !sum ? 0 : +(data.get('value', dataIndex) / sum * 100).toFixed(2);

		params.$vars.push('percent');
		return params;
	},

	_defaultLabelLine: function (option) {
		// Extend labelLine emphasis
		defaultEmphasis(option.labelLine, 'labelLine', ['show']);

		var labelLineNormalOpt = option.labelLine.normal;
		var labelLineEmphasisOpt = option.labelLine.emphasis;
		// Not show label line if `label.normal.show = false`
		labelLineNormalOpt.show = labelLineNormalOpt.show &&
			option.label.normal.show;
		labelLineEmphasisOpt.show = labelLineEmphasisOpt.show &&
			option.label.emphasis.show;
	},

	defaultOption: {
		zlevel: 0,
		z: 2,
		legendHoverLink: true,
		colorBy: 'data',
		hoverAnimation: true,
		// 默认全局居中
		center: ['50%', '50%'],
		radius: [0, '75%'],
		// 默认顺时针
		clockwise: true,
		startAngle: 90,
		// 最小角度改为0
		// minAngle: 0,
		// 选中是扇区偏移量
		// selectedOffset: 10,

		// If use strategy to avoid label overlapping
		avoidLabelOverlap: true,
		// 选择模式，默认关闭，可选single，multiple
		// selectedMode: false,
		// 南丁格尔玫瑰图模式，'radius'（半径） | 'area'（面积）
		// roseType: null,

		// If still show when all data zero.
		stillShowZeroSum: true,

		label: {
			normal: {
				// If rotate around circle
				rotate: false,
				show: true,
				// 'outer', 'inside', 'center'
				position: 'outer'
				// formatter: 标签文本格式器，同Tooltip.formatter，不支持异步回调
				// textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
				// distance: 当position为inner时有效，为label位置到圆心的距离与圆半径(环状图为内外半径和)的比例系数
			},
			emphasis: {}
		},
		itemStyle: {
			normal: {
				borderWidth: 1
			},
			emphasis: {}
		},

		// Animation type canbe expansion, scale
		animationType: 'expansion',

		animationEasing: 'cubicOut',

		ringChassisBackground: null, // 底盘背景颜色

		data: []
	}
});

// mixin(Ring3dSeries, dataSelectableMixin);

export default Ring3dSeries;
