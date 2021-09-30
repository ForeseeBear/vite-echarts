import { curry } from 'zrender/lib/core/util';
import dataFilter from '../../processor/dataFilter';
import dataColor from '../../visual/dataColor';
import ring3dLayout from './ring3dLayout';
import Ring3dView from './Ring3dView';
import Ring3dSeriesModel from './Ring3dSeries';

export function install(registers) {
    registers.registerChartView(Ring3dView);
    registers.registerSeriesModel(Ring3dSeriesModel);
    registers.registerVisual(dataColor('ring3d'));
    registers.registerLayout(curry(ring3dLayout, 'ring3d'));
    registers.registerProcessor(dataFilter('ring3d'));
}