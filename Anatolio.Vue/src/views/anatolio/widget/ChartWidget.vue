<template>
    <div :class="{ 'px-10': props.content.chartContent.showAxes, }">
        <Chart type="line" :data="lineData" :options="lineOptions">
        </Chart>
    </div>
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onBeforeMount, ref, watch } from 'vue';
import QueryService from '../queryBuilder/QueryService';

const { getPrimary, getSurface, isDarkTheme } = useLayout();
const lineData = ref(null);

const lineOptions = ref(null);

const queryService = new QueryService();

const data = ref([])

const props = defineProps({
    content: Object
})


onBeforeMount(() => {

    queryService.get({
        id: props.content.queryId,
        declares: []
    }, (response) => {
        data.value = response ?? [];
        setColorOptions();
    })


})

function setColorOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');


    var chartContent = props.content.chartContent;


    var labels = data.value.map(s => s[chartContent.xColumn + '_formated_']);

    var datasets = chartContent.yColumns.map(yCol => {
        var fill = yCol.chartType == 'area'
        var chartType = fill ? 'line' : yCol.chartType;
        return {
            type: chartType,
            label: yCol.name,
            data: data.value.map(s => s[yCol.name + '_formated_']) ?? [65, 59, 80, 81, 56, 55, 40],
            fill: fill,
            backgroundColor: '#' + yCol.contentColorString ?? documentStyle.getPropertyValue('--p-primary-500'),
            borderColor: '#' + yCol.contentColorString ?? documentStyle.getPropertyValue('--p-primary-500'),
            tension: 0.4,
            yAxisID: 'y',
            pointRadius: chartContent.showAxes ? 3 : 0
        }
    });


    lineData.value = {
        labels: labels ?? ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: datasets
    };

    lineOptions.value = {
        indexAxis: chartContent.horizontal ? 'y' : 'x',
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        plugins: {
            legend: {
                display: chartContent.showAxes // Legend'i gizliyoruz
            },
            tooltip: {
                enabled: chartContent.showAxes // Tooltip'i devre dışı bırakıyoruz
            }
        },
        scales: {
            x: {
                display: chartContent.showAxes,
                stacked: chartContent.stacked,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                display: chartContent.showAxes,
                stacked: chartContent.stacked,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                },
                beginAtZero: true,
            }
        }
    };



}

watch(
    [getPrimary, getSurface, isDarkTheme, props.content],
    () => {
        setColorOptions();
    },
    { immediate: true }
);

</script>
