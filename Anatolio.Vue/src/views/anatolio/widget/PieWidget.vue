<template>
    <div class="p-8">
        <v-chart class="chart" :option="option" autoresize />

    </div>
</template>

<script setup>
    import { use } from 'echarts/core';
    import { CanvasRenderer } from 'echarts/renderers';
    import { PieChart } from 'echarts/charts';
    import {
        TitleComponent,
        TooltipComponent,
        LegendComponent,
    } from 'echarts/components';
    import VChart, { THEME_KEY } from 'vue-echarts';
    import { ref, onBeforeMount, watch, provide } from 'vue';
    import QueryService from '../queryBuilder/QueryService';
    import { useLayout } from '@/layout/composables/layout';

    const { getPrimary, getSurface, isDarkTheme } = useLayout();

    use([
        CanvasRenderer,
        PieChart,
        TitleComponent,
        TooltipComponent,
        LegendComponent,
    ]);

    provide(THEME_KEY   );

    const option = ref({
        //title: {
        //    text: 'Pie Chart',
        //    left: 'center',
        //},
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
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
        option.value.tooltip.formatter = '{a} <br/>{b} : {c}' + chartContent.postfix +' ({d}%)';

        option.value.series[0].radius = chartContent.pieType == 'pie' ? '55%' : ['40%', '55%'];

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

</script>

<style scoped>
    .chart {
        min-height: 200px;
    }
</style>
