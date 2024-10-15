<template>
    <div class="table-responsive p-7">
        <DataTable :value="data" :paginator="true" :rows="5" :totalRecords="data.length">
            <Column v-for="(col, colIndex) in content.dataContent.columns" :key="colIndex"
                :field="col.name + '_formated_'" :style="{ textAlign: col.alignRight ? 'right' : 'left' }"
                :header="$t(col.name)" />
        </DataTable>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import queryService from '../queryBuilder/QueryService';

const { t } = useI18n();
queryService.setI18n(t);

const data = ref([]);
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
            data.value = existingResult || [];
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
    }
}, { immediate: true });
</script>
