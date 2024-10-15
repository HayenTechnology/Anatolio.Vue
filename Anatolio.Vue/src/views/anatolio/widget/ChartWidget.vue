<template>
    <div :class="{ 'p-8': content.chartContent.showAxes }">
        <v-chart :class="{ 'chart': content.chartContent.showAxes, 'chart-min': !content.chartContent.showAxes }"
            :option="option" autoresize />
    </div>

</template>

<script setup>
import { useLayout } from '@/layout/composables/layout';
import { BarChart, LineChart } from 'echarts/charts';
import {
    DatasetComponent,
    GridComponent,
    LegendComponent,
    TitleComponent,
    TooltipComponent,
    TransformComponent
} from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { provide, ref, watch } from 'vue';
import VChart, { THEME_KEY } from 'vue-echarts';
import { useI18n } from 'vue-i18n';
import queryService from '../queryBuilder/QueryService';

const { t } = useI18n();
queryService.setI18n(t);

const { getPrimary, getSurface, isDarkTheme } = useLayout();

use([
    CanvasRenderer,
    LineChart,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent
]);

provide(THEME_KEY);

const option = ref({
    title: {
        left: 'center',
    },
    tooltip: {
        trigger: 'axis',
    },
    legend: {
        show: true,
        left: 'center',
        top: 10,
    },
    grid: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
        containLabel: true,
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLine: { show: true },
        axisTick: { show: true },
        axisLabel: { color: '' },
        splitLine: { show: false },
    },
    yAxis: [], // yAxis dizisi boş, dinamik olarak ekleyeceğiz
    series: [], // Dinamik olarak veri eklenecek
});

const data = ref([]);
const props = defineProps({
    content: Object,
    refresh: Number,
    declares: {
        type: Array,
        default: () => []
    }
});



function setColorOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const chartContent = props.content.chartContent;

    const labels = data.value.map(s => s[chartContent.xColumn + '_formated_']);
    const datasets = chartContent.yColumns.map((yCol, index) => {
        let chartType;

        if (yCol.chartType === 'area') {
            chartType = 'line';
        } else if (yCol.chartType === 'bar') {
            chartType = 'bar';
        } else {
            chartType = 'line';
        }

        return {
            stack: chartContent.stacked ? 'total' : null,
            name: yCol.name,
            type: chartType,
            data: data.value.map(s => s[yCol.name + '_formated_']) ?? [],
            smooth: true,
            lineStyle: {
                color: '#' + yCol.contentColorString ?? documentStyle.getPropertyValue('--p-primary-500'),
            },
            areaStyle: yCol.chartType === 'area' ? {
                color: '#' + yCol.contentColorString ?? documentStyle.getPropertyValue('--p-primary-500'),
            } : null,
            yAxisIndex: chartContent.multipleY ? index : 0, // Eğer multipleY true ise her veri için ayrı yAxis
            tooltip: {
                valueFormatter: function (value) {
                    return value + ' ' + (yCol.postfix ?? ''); // 1. y ekseni için özel tooltip formatı
                }
            }
        };
    });

    // Eksen ayarları
    if (chartContent.multipleY) {
        option.value.yAxis = chartContent.yColumns.map((yCol, index) => ({
            type: 'value',
            name: yCol.name,
            axisLine: { show: true },
            axisTick: { show: true },
            axisLabel: { color: textColorSecondary },
            splitLine: { show: chartContent.showAxes },
            position: index % 2 === 0 ? 'left' : 'right', // Her ekseni sol ve sağ tarafa yerleştiriyoruz
        }));
    } else {
        option.value.yAxis = [{
            type: 'value',
            axisLine: { show: true },
            axisTick: { show: true },
            axisLabel: { color: textColorSecondary },
            splitLine: { show: chartContent.showAxes },
        }];
    }

    if (!chartContent.showAxes) {
        option.value.grid.top = -10;
        option.value.grid.bottom = -20;
        option.value.grid.left = -120;
        option.value.grid.right = -100;
    } else {
        option.value.grid.top = 10;
        option.value.grid.bottom = 10;
        option.value.grid.left = 10;
        option.value.grid.right = 10;
    }

    option.value.legend.show = chartContent.showAxes;
    option.value.xAxis.data = labels;
    option.value.xAxis.axisLabel.color = textColorSecondary;
    option.value.xAxis.show = chartContent.showAxes;

    option.value.series = datasets;

    // Grafik yatay eksene çevrilecekse
    if (chartContent.horizontal) {
        option.value.xAxis.type = 'value';
        option.value.yAxis.forEach((axis, index) => {
            option.value.yAxis[index].type = 'category';
            option.value.yAxis[index].data = labels;
        });
    } else {
        option.value.xAxis.type = 'category';
    }
}

watch([getPrimary, getSurface, isDarkTheme, props.content], () => {
    setColorOptions();
}, { immediate: true });

watch(() => props.content.queryId, (newResult) => {
    if (newResult) {
        const existingResult = queryService.addQuery(newResult, props.declares);
        if (existingResult) {
            data.value = existingResult || {};
            setColorOptions();
        }
    }
}, { immediate: true });

watch(() => props.refresh, (newResult) => {
    if (newResult) {
        queryService.reExecuteQuery(props.content.queryId);
    }
});



watch(() => queryService.queryResults.value[props.content.queryId], (newResult) => {
    if (newResult) {
        data.value = newResult || [];
        setColorOptions();
    }
}, { immediate: true });
</script>

<style scoped>
.chart {
    min-height: 300px;
}

.chart-min {
    min-height: 110px;
}
</style>
