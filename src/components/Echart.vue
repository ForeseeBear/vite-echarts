
<template>
    <div class="box">
        <div id="left"></div>
        <div id="right"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as echarts from '../../lib/export/core';

import {
    BarChart,
    Bar3dChart,
    LineChart,
    PieChart,
    FunnelChart,
} from '../../lib/export/charts';

import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    ToolboxComponent,
    DataZoomComponent,
    DataZoomInsideComponent,
    ParticleComponent,
} from '../../lib/export/components';

import { CanvasRenderer } from '../../lib/export/renderers';

// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    BarChart,
    Bar3dChart,
    LineChart,
    PieChart,
    FunnelChart,
    CanvasRenderer,
    LegendComponent,
    ToolboxComponent,
    DataZoomComponent,
    // DataZoomInsideComponent,
    // ParticleComponent,
]);

import { bar3dOption, barOption, pieOption } from '../option/options';

export default defineComponent({
    data() {
        return {};
    },
    mounted() {
        var barChart = echarts.init(
            document.getElementById('left'),
            'drak',
            null
        );
        var pieChart = echarts.init(
            document.getElementById('right'),
            'drak',
            null
        );

        barChart.setOption(bar3dOption);
        // barChart.setOption(barOption);
        // pieChart.setOption(pieOption);

        window.onresize = barChart.resize;
    },
});
</script>

<style scoped>
.box {
    width: 100%;
    display: flex;
    justify-content: center;
}

#left,
#right {
    width: 800px;
    height: 400px;
}
</style>
