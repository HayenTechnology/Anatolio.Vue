<template>
    <div :class="{'p-8':content.chartContent.showAxes}">
        <v-chart :class="{'chart':content.chartContent.showAxes,'chart-min':!content.chartContent.showAxes}" :option="option" autoresize />
    </div>
    
</template>

<script setup>
    import { use } from 'echarts/core';
    import { CanvasRenderer } from 'echarts/renderers';
    import { LineChart, BarChart } from 'echarts/charts';
    import {
        TitleComponent,
        TooltipComponent,
        LegendComponent,
        GridComponent,
        DatasetComponent,
        TransformComponent
    } from 'echarts/components';
    import VChart, { THEME_KEY } from 'vue-echarts';
    import { ref, onBeforeMount, watch, provide } from 'vue';
    import QueryService from '../queryBuilder/QueryService';
    import { useLayout } from '@/layout/composables/layout';

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

    const queryService = new QueryService();
    const data = ref([]);
    const props = defineProps({
        content: Object,
    });

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

</script>

<style scoped>
    .chart {
        min-height: 300px;
    }
    .chart-min {
        min-height: 110px;
    }
</style>
