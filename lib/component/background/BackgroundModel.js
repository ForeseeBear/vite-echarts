import { extendComponentModel } from '../../export/api'


export default extendComponentModel({
	type: 'background',
	dependencies: ['series'],

	init: function (option, ecModel) {
		this.mergeDefaultAndTheme(option, ecModel);
	},


	optionUpdated: function () {

	},


	defaultOption: {
		show: true, // 是否显示

		seriesIndex: 'all', // 对应图表位置

		layer: false, // 背景是否允许叠加

		itemStyle: {
			color: 'rgba(0, 255, 0, 0.2)'
		},

		cursor: 'default',

		zlevel: 0,

		z: 10
	}
})
