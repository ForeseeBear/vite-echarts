

import * as zrUtil from 'zrender/lib/core/util';
import { layout } from '../../layout/barGrid';
import dataSample from '../../processor/dataSample';
import Bar3dSeries from './Bar3dSeries';
import Bar3dView from './Bar3dView';
export function install(registers) {
  registers.registerChartView(Bar3dView);
  registers.registerSeriesModel(Bar3dSeries);
  registers.registerVisual({
    seriesType: 'bar3d',
    reset: function (seriesModel) {
      seriesModel.getData().setVisual('legendSymbol', 'roundRect');
    }
  });
  registers.registerLayout(registers.PRIORITY.VISUAL.LAYOUT, zrUtil.curry(layout, 'bar3d')); // Use higher 
  registers.registerProcessor(registers.PRIORITY.PROCESSOR.STATISTIC, dataSample('bar3d'));
}