import { extendSeriesModel } from "../../export/api";
import createSeriesData from "../helper/createSeriesData";

const Bar3dSeriesModel = extendSeriesModel({
	type: "series.bar3d",

	dependencies: ["grid3d"],

	brushSelector: "rect",

	getInitialData: function (option, ecModel, api) {
		return createSeriesData(null, this, {
			useEncodeDefaulter: true,
			createInvertedIndices: !!this.get("realtimeSort", true) || null,
		});
	},

	getMarkerPosition: function (value) {
		var coordSys = this.coordinateSystem;
		if (coordSys) {
			// PENDING if clamp ?
			var pt = coordSys.dataToPoint(value, true);
			var data = this.getData();
			var offset = data.getLayout("offset");
			var size = data.getLayout("size");
			var offsetIndex = coordSys.getBaseAxis().isHorizontal() ? 0 : 1;
			pt[offsetIndex] += offset + size / 2;
			return pt;
		}
		return [NaN, NaN];
	},

	defaultOption: {
		barType: "cube", // 柱状图的柱子类型 cube | cylinder

		zlevel: 0, // 一级层叠

		z: 2, // 二级层叠

		coordinateSystem: "cartesian2d",

		legendHoverLink: true,

		barMinHeight: 0,

		itemStyle: {},

		emphasis: {},
	},
});

export default Bar3dSeriesModel;
