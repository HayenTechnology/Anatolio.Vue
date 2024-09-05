<template>

    <div v-show="props.sourceId" class="mb-4">
        <InputText v-model="searchTable" placeholder="Search in Tables" class="w-full p-2 border rounded" />
    </div>

    <div class="text-center w-full" v-show="loading">
        <ProgressSpinner />
    </div>

    <div v-show="!loading">
        <Message v-show="!filteredTables.length" severity="secondary" class="text-center">
            <i class="pi pi-info-circle"></i><br />{{ $t('Data source tables will shown here') }}
        </Message>

        <Accordion v-show="filteredTables.length" multiple>
            <AccordionPanel v-for="table in filteredTables" :value="table.TABLE_NAME">
                <AccordionHeader>{{ table.TABLE_SCHEMA }}.{{ table.TABLE_NAME }}</AccordionHeader>
                <AccordionContent>
                    <ul>
                        <li v-for="col in table.Columns" :key="col.COLUMN_NAME">
                            <a @click="copyColumnName(col.COLUMN_NAME)" class="text-sm w-full">
                                <i class="pi pi-chevron-right mr-2"></i> {{ col.COLUMN_NAME }}
                                <span v-tooltip:top="col.DATA_TYPE" class="text-gray-500"
                                    style="float: right; max-width: 40px; overflow: hidden; height: 20px; white-space: nowrap;">
                                    {{ col.DATA_TYPE }}
                                </span>
                            </a>
                        </li>
                    </ul>
                </AccordionContent>

            </AccordionPanel>
        </Accordion>
    </div>
</template>

<script setup>
import axios from 'axios';
import { computed, defineProps, ref, watch } from 'vue';

const props = defineProps({
    sourceId: {
        type: [String, Number]
    }
});


const searchTable = ref('');
const loading = ref(false);
const dataSourceTables = ref([]);

const loadData = async (id) => {
    if (id) {
        const response = await axios.get(`/api/otables(${id})`, { loading: loading });
        dataSourceTables.value = response.value;
    } else {
        dataSourceTables.value = []
    }
};

watch(
    () => props.sourceId,
    (newSourceId) => {
        loadData(newSourceId);
    },
    { immediate: true } // immediate: true ile component mount olduğunda da tetiklenir
);


const filteredTables = computed(() => {
    if (!searchTable.value) {
        return dataSourceTables.value;
    }
    return dataSourceTables.value.filter(table =>
        table.TABLE_NAME.toLowerCase().includes(searchTable.value.toLowerCase()) ||
        table.Columns.some(col => col.COLUMN_NAME.toLowerCase().includes(searchTable.value.toLowerCase()))
    );
});

const copyColumnName = (columnName) => {
    navigator.clipboard.writeText(columnName);
};

const errors = ref({});

</script>
