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
            <Skeleton width="100%" height="75px"></Skeleton>
        </div>
    </div>
    <div v-else class="card"
        :class="'bg-' + widget.backgroundColor + '-200 dark:bg-' + widget.backgroundColor + '-900'">
        <div v-if="widget.hasHeader" class="font-semibold text-xl mb-4"> {{ widget.name || 'No Header' }}</div>
        <div v-for="(content, index) in widget.contents" :key="index">

            <ChartContent v-if="content.contentType == 'ChartContent'" :content="content"></ChartContent>
            <HtmlContent v-if="content.contentType == 'HtmlContent'" :content="content"></HtmlContent>
            <InfoContent v-if="content.contentType == 'InfoContent'" :content="content"></InfoContent>
            <PageContent v-if="content.contentType == 'PageContent'" :content="content"></PageContent>
            <TableContent v-if="content.contentType == 'TableContent'" :content="content"></TableContent>
            <StatusContent v-if="content.contentType == 'StatusContent'" :content="content"></StatusContent>
        </div>
    </div>

</template>

<script setup>
import ChartContent from './ChartWidget.vue';
import HtmlContent from './HtmlWidget.vue';
import InfoContent from './InfoWidget.vue';
import PageContent from './PageWidget.vue';
import StatusContent from './StatusWidget.vue';
import TableContent from './TableWidget.vue';

import axios from 'axios';
import { onBeforeMount, ref, watch } from 'vue';


const loading = ref(false)
const errors = ref([])
const error = ref("");

const widget = ref(null)

const props = defineProps({
    widgetId: [String, Number, Object],
    widget: Object
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

</script>
