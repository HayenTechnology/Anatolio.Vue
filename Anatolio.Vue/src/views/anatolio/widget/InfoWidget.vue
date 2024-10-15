<template>
    <div class="p-7">
        <div class="grid grid-cols-2 gap-4">
            <div v-for="(col, colIndex) in content.dataContent.columns" :key="colIndex" class="flex items-center">
                <div style="width: 2.5rem; height: 2.5rem" class="mr-4 flex items-center justify-center rounded-border "
                    :class="'bg-' + col.contentColorString + '-100 dark:bg-' + col.contentColorString + '-400/10'">
                    <i :class="col.icon + ' text-' + col.contentColorString + '-500'" class=" !text-xl"></i>
                </div>
                <div>
                    <div class="text-lg font-bold">{{ data[col.name + '_formated_'] }} {{ col.postfix }}</div>
                    <div class="text-muted text-sm">{{ $t(col.name) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import queryService from '../queryBuilder/QueryService';

const { t } = useI18n();
queryService.setI18n(t);

const data = ref({});
const props = defineProps({
    content: Object,
    refresh: Number,
    declares: {
        type: Array,
        default: () => []
    }
});


watch(() => props.content.queryId, (newResult) => {
    if (newResult) {
        const existingResult = queryService.addQuery(newResult, props.declares);
        if (existingResult) {
            data.value = existingResult[0] || {};
        }
    }
}, { immediate: true });

watch(() => props.refresh, (newResult) => {
    if (newResult) {
        queryService.reExecuteQuery(props.content.queryId);
    }
});

watch(() => queryService.queryResults.value[props.content.queryId], (newResult) => {
    if (newResult && newResult.length > 0) {
        data.value = newResult[0] || {};
    }
}, { immediate: true });

</script>
