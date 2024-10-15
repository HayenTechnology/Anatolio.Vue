<template>
    <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout';
import queryService from '../queryBuilder/QueryService';

import { HeatmapChart } from 'echarts/charts'; // Heatmap chart modülü
import {
    GridComponent,
    TitleComponent,
    TooltipComponent,
    VisualMapComponent, // Heatmap renk skalası için VisualMap ekliyoruz
} from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { provide, ref, watch } from 'vue';
import VChart, { THEME_KEY } from 'vue-echarts';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
queryService.setI18n(t);

use([
    CanvasRenderer,  // Canvas renderer'ı burada ekliyoruz
    HeatmapChart,
    TitleComponent,
    TooltipComponent,
    VisualMapComponent,
    GridComponent,
]);
provide(THEME_KEY);

const { getPrimary, getSurface, isDarkTheme } = useLayout();


const option = ref({
    //title: {
    //    text: 'Okullar ve Aylara Göre Heatmap',
    //    left: 'center',
    //},
    tooltip: {
        position: 'top',
    },
    grid: {
        left: 100,
        height: '50%',
        top: '10%',
    },
    xAxis: {
        type: 'category',
        data: [], // X ekseni (Aylar)
        splitArea: {
            show: true,
        },
    },
    yAxis: {
        type: 'category',
        data: [], // Y ekseni (Okullar)
        splitArea: {
            show: true,
        },
    },
    visualMap: {
        min: 0,
        max: 10, // Verilerin maksimum değeri
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%',
        inRange: {
            color: ['#ffffff', '#ff9100'], // Renk skalası
        },
    },
    series: [
        {
            name: 'Heatmap',
            type: 'heatmap',
            data: [], // Heatmap verileri
            label: {
                show: true,
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        },
    ],
});

const data = ref([]);
const props = defineProps({
    content: Object,
});



function setColorOptions() {
    const chartContent = props.content.heatmapContent;

    if (!chartContent.keyColumn || !data.value || !data.value.length) {
        return;
    }

    // X eksenindeki aylar (orijinal durumda)
    const xLabels = Object.keys(data.value[0]).filter(s => s != chartContent.keyColumn && s.indexOf('_formated_') == -1);

    // Y eksenindeki okul isimleri (orijinal durumda)
    const yLabels = data.value.map(item => item[chartContent.keyColumn]);

    if (!xLabels.length || !yLabels.length) {
        return;
    }

    let heatmapData = [];
    const allData = [];

    // Eğer grafiği yatay çevireceksek X ve Y eksenlerini yer değiştiriyoruz
    if (chartContent.horizontal) {
        // Yatay durumda X ekseni okul isimleri olacak, Y ekseni ise aylar
        option.value.xAxis.data = yLabels;
        option.value.yAxis.data = xLabels;

        // Veriyi buna göre ayarlıyoruz
        data.value.forEach((item, yIndex) => {
            xLabels.forEach((month, xIndex) => {
                heatmapData.push([yIndex, xIndex, item[month]]); // X ve Y yer değiştiriyor
                allData.push(item[month]);
            });
        });
    } else {
        // Normal durumda X ekseni aylar, Y ekseni okul isimleri
        option.value.xAxis.data = xLabels;
        option.value.yAxis.data = yLabels;

        // Veriyi normal şekilde ayarlıyoruz
        data.value.forEach((item, yIndex) => {
            xLabels.forEach((month, xIndex) => {
                heatmapData.push([xIndex, yIndex, item[month]]); // X ve Y normal
                allData.push(item[month]);
            });
        });
    }

    // Verileri seriye ekliyoruz
    option.value.series[0].data = heatmapData;

    // Max değeri ayarlıyoruz
    option.value.visualMap.max = Math.max(...allData);

    // Renk skalasını güncelliyoruz
    option.value.visualMap.inRange.color = chartContent.colorRanges.map(s => '#' + s.contentColorString) || ['#ffffff', '#ff9100'];


    option.value.tooltip.formatter = '{b} : {c}' + chartContent.postfix;



}

// Temaya göre renkleri güncelleme
watch([getPrimary, getSurface, isDarkTheme, props.content], () => {
    setColorOptions();
}, { immediate: true });

watch(() => props.content.queryId, (newResult) => {
    if (newResult) {
        const existingResult = queryService.addQuery(newResult);
        if (existingResult) {
            data.value = existingResult || {};
            setColorOptions();
        }
    }
}, { immediate: true });

watch(() => queryService.queryResults.value[props.content.queryId], (newResult) => {
    if (newResult) {
        data.value = newResult || [];
        setColorOptions();
    }
}, { immediate: true });

</script>

<style scoped>
.chart {
    min-height: 400px;
}
</style>
