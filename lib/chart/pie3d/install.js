import { curry } from 'zrender/lib/core/util';
import dataFilter from '../../processor/dataFilter';
import dataColor from '../../visual/dataColor';
import pie3dLayout from './pie3dLayout';
import Pie3dView from './Pie3dView';
import Pie3dSeriesModel from './Pie3dSeries';
export function install(registers) {
  registers.registerChartView(Pie3dView);
  registers.registerSeriesModel(Pie3dSeriesModel);
  registers.registerVisual(dataColor('pie3d'));
  registers.registerLayout(curry(pie3dLayout, 'pie3d'));
  registers.registerProcessor(dataFilter('pie3d'));
}

