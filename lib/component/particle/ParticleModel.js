import * as echarts from '../../echarts';


export default echarts.extendComponentModel({
	type: 'particle',
	dependencies: ['series'],

	init: function (option, ecModel) {
		this.mergeDefaultAndTheme(option, ecModel);
	},

	optionUpdated: function () {},

	defaultOption: {
		show: true, // 是否显示

		type: 'bar', // 粒子类型 bar/line

		minR: 1,
		maxR: 5,
		count: 40,
		showDist: 40, //显示距离

		imgPath: '', // 图片路径

		time: [0, 10],

		color: '#fff',

		zlevel: 0,

		z: 10
	}
})
