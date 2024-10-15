<template>
    <div class="flex justify-between mb-4 px-10 pt-10" style="min-height:100px">
        <div>
            <span class="block text-muted-color font-medium mb-4">
                {{
                    content.statusContent.description ||
                    'No Description'
                }}
            </span>
            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                {{ content.statusContent.prefix }} {{ data[content.statusContent.valueColumn + queryService.postfix] ||
                    data[content.statusContent.valueColumn] }} {{
                    content.statusContent.postfix
                }}
            </div>
        </div>
        <div class="flex items-center justify-center rounded-border"
            :class="'bg-' + content.statusContent.contentColorString + '-100 dark:bg-' + content.statusContent.contentColorString + '-400/10'"
            style="width: 2.5rem; height: 2.5rem">
            <i :class="content.statusContent.icon + ' text-' + content.statusContent.contentColorString + '-500'"
                class=" !text-xl"></i>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import queryService from '../queryBuilder/QueryService';

const { t } = useI18n();
queryService.setI18n(t);

const data = ref({})
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
            data.value = existingResult[0];
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
        data.value = newResult[0];
    }
}, { immediate: true });
</script>
