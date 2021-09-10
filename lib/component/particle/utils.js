/**
 * 将series配置注入修改粒子配置
 * @param {*} seriesModel
 * @param {*} particleModel
 */
import * as zrUtil from 'zrender/src/core/util';

export function mergeOptionFromSerieModel(seriesModel, particleModel) {
	var option = seriesModel.get('particle');
	particleModel.option = zrUtil.clone(particleModel.getDefaultOption());
	particleModel.mergeOption(option);
}

export function isEmpty(layout) {
	return !layout || layout.height === 0 || layout.width === 0;
}