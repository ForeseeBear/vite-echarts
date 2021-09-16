
import Funnel3dView from './Funnel3dView';
import Funnel3dSeriesModel from './Funnel3dSeries';
import funnel3dLayout from './Funnel3dLayout';
import dataFilter from '../../processor/dataFilter';
export function install(registers) {
  registers.registerChartView(Funnel3dView);
  registers.registerSeriesModel(Funnel3dSeriesModel);
  registers.registerLayout(funnel3dLayout);
  registers.registerProcessor(dataFilter('funnel3d'));
}


