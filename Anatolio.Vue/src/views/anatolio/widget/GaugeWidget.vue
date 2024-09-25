<template>
    <v-chart class="chart pt-5" :option="option" autoresize />
</template>

<script setup>
import { GaugeChart } from 'echarts/charts'; // Pie yerine Gauge kullanıyoruz
import {
    TitleComponent,
    TooltipComponent,
} from 'echarts/components'; // Legend kaldırıldı, Gauge'de kullanılmıyor
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { onBeforeMount, provide, ref, watch } from 'vue';
import VChart, { THEME_KEY } from 'vue-echarts';
import QueryService from '../queryBuilder/QueryService';

import { useLayout } from '@/layout/composables/layout';

const { getPrimary, getSurface, isDarkTheme } = useLayout();

use([
    CanvasRenderer,
    GaugeChart, // Gauge chart modülü
    TitleComponent,
    TooltipComponent,
]);

provide(THEME_KEY);

const option = ref({
    title: {
        //text: 'Gauge Chart',
        left: 'center',
    },
    tooltip: {
        formatter: '{a} <br/>{b} : {c}%',
    },
    series: [
        {
            name: 'Metric',
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            radius: '100%',
            pointer: {
                show: true,
                length: '60%',
                width: 5,
            },
            detail: {
                //fontSize: 22,
                formatter: '{value}%',
                //offsetCenter: [0, '25%'],
            },
            axisLine: {
                lineStyle: {
                    //width: 20,
                    color: [
                        [0.2, '#FF6F61'], // Renkler ve oranlar
                        [0.4, '#FFCC00'],
                        [0.6, '#66BB6A'],
                        [0.8, '#29B6F6'],
                        [1, '#AB47BC'],
                    ],
                },
            },
            data: [{ value: 0, name: '' }], // Başlangıç değeri
        },
    ],
});

const queryService = new QueryService();
const data = ref([]);
const props = defineProps({
    content: Object,
});

// İlk sorguyu yapma
onBeforeMount(() => {
    getQuery();
});

const getQuery = () => {
    if (!props.content.queryId) {
        return;
    }

    queryService.get(
        {
            id: props.content.queryId,
            declares: [],
        },
        (response) => {
            data.value = response ?? [];
            setColorOptions();
        }
    );
};

watch(() => props.content.queryId, () => {
    getQuery();
});

function setColorOptions() {
    const chartContent = props.content.gaugeContent;
    const firstData = data.value[0];

    if (!chartContent.valueColumn || !firstData) {
        return;
    }

    // İğne değerini ayarla
    const value = firstData[chartContent.valueColumn + '_formated_'] || 0;

    // ECharts serisinin güncellenmesi
    option.value.series[0].data[0].value = value;
    option.value.series[0].data[0].name = chartContent.valueColumn;
    option.value.tooltip.formatter = '{a} <br/>{b} : {c}' + (chartContent.postfix ?? '');
    option.value.series[0].detail.formatter = '{value}' + (chartContent.postfix ?? '');

    if (chartContent.colorRanges.length) {
        option.value.series[0].axisLine.lineStyle.color = chartContent.colorRanges.map(clr => { return [clr.to / 100, '#' + clr.contentColorString] });
    }
}

watch([getPrimary, getSurface, isDarkTheme, props.content], () => {
    setColorOptions();
}, { immediate: true });

</script>

<style scoped>
.chart {
    min-height: 300px;
}
</style>
