<template>
    <div class="p-8">
        <v-chart class="chart" :option="option" autoresize />

    </div>
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout';
import { PieChart } from 'echarts/charts';
import {
    LegendComponent,
    TitleComponent,
    TooltipComponent,
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
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);

provide(THEME_KEY);

const option = ref({
    //title: {
    //    text: 'Pie Chart',
    //    left: 'center',
    //},
    tooltip: {
        trigger: 'item',
    },
    legend: {
        orient: 'vertical',
        left: 'left',
    },
    series: [
        {
            name: 'Data',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [], // Data'yı dinamik olarak güncelleyeceğiz
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        },
    ],
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
    const chartContent = props.content.pieContent;

    if (!chartContent.keyColumn || !chartContent.valueColumn) {
        return;
    }

    const labels = data.value.map(s => s[chartContent.keyColumn + '_formated_']);
    const values = data.value.map(s => s[chartContent.valueColumn]);


    if (!labels.length || !values.length) {
        return;
    }

    const colors = generateRandomColors(labels.length);

    option.value.series[0].radius = chartContent.pieType == 'pie' ? '55%' : ['40%', '55%'];
    option.value.series[0].tooltip = {
        valueFormatter: function (value) {
            return value + ' ' + (chartContent.postfix ?? ''); // 1. y ekseni için özel tooltip formatı
        }
    }

    option.value.series[0].data = labels.map((label, index) => ({
        value: values[index],
        name: label,
        itemStyle: { color: colors[index] },
    }));

    option.value.legend.data = labels;
}

// Temaya göre renkleri güncelleme
watch([getPrimary, getSurface, isDarkTheme, props.content], () => {
    setColorOptions();
}, { immediate: true });

// Rastgele renkler oluşturma fonksiyonu
function generateRandomColors(length) {
    const colors = [];
    for (let i = 0; i < length; i++) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        colors.push(`rgba(${r}, ${g}, ${b}, 0.5)`);
    }
    return colors;
}

// İlk sorguyu yapma

watch(() => props.content.queryId, (newResult) => {
    if (newResult) {
        const existingResult = queryService.addQuery(newResult, props.declares);
        if (existingResult) {
            data.value = existingResult || [];
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
    min-height: 200px;
}
</style>
