
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
    LineChart,
    PieChart,
    FunnelChart,
} from '../../lib/export/charts';

import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
} from '../../lib/export/components';

import { CanvasRenderer } from '../../lib/export/renderers';

// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    BarChart,
    LineChart,
    PieChart,
    FunnelChart,
    CanvasRenderer,
]);

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
        const barOption = {
            tooltip: {
                trigger: 'item',
            },
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#2378f7' },
                            { offset: 1, color: '#83bff6' },
                        ]),
                        borderWidth: 0,
                        borderColor: 'red',
                    },
                },
                {
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'line',
                },
            ],
        };
        const pieOption = {
            title: {
                text: '某站点用户访问来源',
                subtext: '纯属虚构',
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '50%',
                    data: [
                        { value: 1048, name: '搜索引擎' },
                        { value: 735, name: '直接访问' },
                        { value: 580, name: '邮件营销' },
                        { value: 484, name: '联盟广告' },
                        { value: 300, name: '视频广告' },
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                },
            ],
        };
        barChart.setOption(barOption);
        pieChart.setOption(pieOption);
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
    width: 40%;
    height: 500px;
}
</style>
