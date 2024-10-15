<template>
    <div v-if="loading || !widget" class="card">
        <div class="rounded border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900">
            <div class="flex mb-4">
                <div>
                    <Skeleton width="10rem" class="mb-2"></Skeleton>
                    <Skeleton width="5rem" class="mb-2"></Skeleton>
                    <Skeleton height=".5rem"></Skeleton>
                </div>
            </div>
            <Skeleton width="100%" height="65px"></Skeleton>
        </div>
    </div>
    <div v-else class="card p-0 "
        :class="'bg-' + widget.backgroundColor + '-200 dark:bg-' + widget.backgroundColor + '-900'">
        <div v-if="widget.hasHeader" class="font-semibold text-xl px-8 pt-8"> {{ widget.name || 'No Header' }}</div>
        <div v-for="(content, index) in sortedContents" :key="index">

            <StatusContent v-if="content.contentType == 'StatusContent'" :content="content" :declares="declares"
                :refresh="refresh">
            </StatusContent>
            <ChartContent v-if="content.contentType == 'ChartContent'" :content="content" :declares="declares"
                :refresh="refresh">
            </ChartContent>
            <PieContent v-if="content.contentType == 'PieContent'" :content="content" :declares="declares"
                :refresh="refresh"></PieContent>
            <GaugeContent v-if="content.contentType == 'GaugeContent'" :content="content" :declares="declares"
                :refresh="refresh">
            </GaugeContent>
            <HeatmapContent v-if="content.contentType == 'HeatmapContent'" :content="content" :declares="declares"
                :refresh="refresh">
            </HeatmapContent>
            <TableContent v-if="content.contentType == 'TableContent'" :content="content" :declares="declares"
                :refresh="refresh">
            </TableContent>
            <InfoContent v-if="content.contentType == 'InfoContent'" :content="content" :declares="declares"
                :refresh="refresh">
            </InfoContent>
            <HtmlContent v-if="content.contentType == 'HtmlContent'" :content="content" :declares="declares"
                :refresh="refresh">
            </HtmlContent>

        </div>
        <MapContent v-if="widget.contents.some(s => s.contentType == 'MapContent')" :widget="widget"
            :declares="declares" :refresh="refresh"></MapContent>

    </div>

</template>

<script setup>
import axios from 'axios';
import { computed, onBeforeMount, ref, watch } from 'vue';

import ChartContent from './ChartWidget.vue';
import GaugeContent from './GaugeWidget.vue';
import HeatmapContent from './HeatmapWidget.vue';
import HtmlContent from './HtmlWidget.vue';
import InfoContent from './InfoWidget.vue';
import MapContent from './MapWidget.vue';
import PieContent from './PieWidget.vue';
import StatusContent from './StatusWidget.vue';
import TableContent from './TableWidget.vue';

const loading = ref(false)
const errors = ref([])
const error = ref("");

const widget = ref(null)

const props = defineProps({
    widgetId: [String, Number, Object],
    widget: Object,
    refresh: Number,
    declares: {
        type: Array,
        default: () => []
    }
})

onBeforeMount(() => {
    if (props.widget) {
        runWidget(props.widget)
        return;
    }
    axios.get("/api/widget/get/" + props.widgetId, { loading, errors, error }).then(response => {
        runWidget(response)
    })

})

watch(() => props.widget, (newWidget) => {
    if (props.widgetId) {
        return;
    }
    runWidget(newWidget)
}, { deep: true })


const runWidget = (data) => {

    widget.value = data;
}

const sortedContents = computed(() => {
    return [...widget.value.contents.filter(s => s.contentType != 'MapContent')].sort((a, b) => a.order - b.order);
});

</script>
