<template>
    <div class="table-responsive p-7">
        <DataTable :value="data" :paginator="true" :rows="5" :totalRecords="data.length">
            <Column v-for="(col, colIndex) in content.dataContent.columns" :key="colIndex" :field="col.name+'_formated_'"
                    :header="$t(col.name)" />
        </DataTable>
    </div>
</template>

<script setup>

    import { ref, onBeforeMount, watch } from 'vue';
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
                data.value = response ?? [];
            }
        );
    };
    watch(() => props.content.queryId, () => {
        getQuery();
    });



</script>
