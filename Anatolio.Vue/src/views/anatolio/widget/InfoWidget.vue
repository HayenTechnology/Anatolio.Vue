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

import { onBeforeMount, ref, watch } from 'vue';
import QueryService from '../queryBuilder/QueryService';


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
            data.value = response[0] ?? {};
        }
    );
};
watch(() => props.content.queryId, () => {
    getQuery();
});



</script>
