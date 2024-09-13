<template>
    <div style="height: 200px;">
        <Chart :type="props.content.pieContent.pieType" :data="pieData" :options="pieOptions">
        </Chart>
    </div>
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onBeforeMount, ref, watch } from 'vue';
import QueryService from '../queryBuilder/QueryService';

const { getPrimary, getSurface, isDarkTheme } = useLayout();
const pieData = ref(null);

const pieOptions = ref(null);


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


    var chartContent = props.content.pieContent;
    var labels = data.value.map(s => s[chartContent.keyColumn + '_formated_']);

    var datasets = [{
        data: data.value.map(s => s[chartContent.valueColumn + '_formated_']) ?? [],
        backgroundColor: generateRandomColors(labels.length),
    }]



    pieData.value = {
        labels: labels,
        datasets: datasets
    };

    pieOptions.value = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
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
