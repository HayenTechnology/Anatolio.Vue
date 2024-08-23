<template>
    <div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Sidebar Section -->
            <div class="md:col-span-1">

                <Card class="mb-4">
                    <template #title>
                        Query Data Source
                    </template>
                    <template #content>

                        <FormField class="mb-4" :hideLabel="true" label="Data Source" fieldName="sourceId">
                            <template v-slot:default="prp">
                                <OSelect :settings="{
                            url: '/api/ODataSources?',
                            key: 'Id',
                            value: 'DbName',
                        }" v-model="model.sourceId" v-model:selectedData="dataSource" :placeholder="prp.placeholder">
                                </OSelect>
                            </template>
                        </FormField>

                        <div v-if="model.SourceId" class="mb-4">
                            <InputText v-model="model.searchTable" placeholder="Search in Tables"
                                class="w-full p-2 border rounded" />
                        </div>
                        <div class="text-center w-full" v-if="loading">
                            <ProgressSpinner />
                        </div>
                        <div v-else>
                            <Message v-if="!DataSourceTables.length" severity="secondary" class="text-center"><i
                                    class="pi pi-info-circle"></i><br /> Data Source Tables Will Shown Here</Message>

                            <Accordion v-if="DataSourceTables.length" multiple>
                                <AccordionTab v-for="table in DataSourceTables" :key="table.TABLE_NAME"
                                    :header="`${table.TABLE_SCHEMA}.${table.TABLE_NAME}`">
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
                                </AccordionTab>
                            </Accordion>
                        </div>
                    </template>
                </Card>

            </div>

            <!-- Main Content Section -->
            <div class="md:col-span-3">

                <Toolbar class="mb-4">
                    <template #start>
                        <Button icon="pi pi-plus" @click="addDeclare" class="mr-2" severity="secondary" text />
                        <Button icon="pi pi-print" class="mr-2" severity="secondary" text />
                        <Button icon="pi pi-upload" severity="secondary" text />
                    </template>

                    <template #center>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-file" />
                            </InputIcon>
                            <InputText v-model="model.name" placeholder="Query Name"
                                class="w-full p-2 border rounded" />
                        </IconField>
                    </template>

                    <template #end>
                        <Button label="Run Query" icon="pi pi-play" class="p-button-success mr-2"
                            @click="runQuery"></Button>
                        <Button label="Save Query" icon="pi pi-save" v-if="queryRunnded" @click="saveQuery"></Button>
                    </template>
                </Toolbar>

                <Card class="mb-4">
                    <template #title>
                        Query Editor
                    </template>
                    <template #content>
                        <Tabs value="0">
                            <TabList>
                                <Tab value="0">Query</Tab>
                                <Tab value="1">Declares</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel value="0">
                                    <div class="grid grid-cols-3 gap-4">
                                        <div v-for="declare in model.declares">
                                            <DeclareView :declare="declare"></DeclareView>
                                        </div>
                                    </div>
                                    <br />
                                    <div style="height:300px">
                                        <vue-monaco-editor v-model:value="model.queryString" theme="vs-dark"
                                            :options="MONACO_EDITOR_OPTIONS" @mount="handleMount"
                                            :language="dataSource?.language ?? 'sql'" />
                                    </div>
                                </TabPanel>
                                <TabPanel value="1">
                                    <div v-for="declare in model.declares">
                                        <DeclareCreate class="mb-4" :declare="declare"></DeclareCreate>
                                    </div>
                                </TabPanel>

                            </TabPanels>
                        </Tabs>

                    </template>
                </Card>

                <Card class="mb-4">
                    <template #title>
                        Query Result
                    </template>
                    <template #content>
                        <Message v-if="!queryResult.length" severity="secondary" class="text-center"><i
                                class="pi pi-info-circle"></i> There is no query result</Message>

                        <DataTable v-else :value="queryResult" tableStyle="min-width: 50rem">
                            <div v-for="column in model.queryColumns">
                                <Column :field="column.name + '_formated_'" :header="column.name"></Column>
                            </div>
                        </DataTable>

                    </template>
                </Card>


                <Card class="mb-4" v-if="model.queryColumns.length">
                    <template #title>
                        Result Column Output Types
                    </template>
                    <template #content>
                        <div v-for="column in model.queryColumns" :key="column.name" class="grid grid-cols-6 gap-4">
                            <div class="col-span-6 md:col-span-2 mb-2">
                                {{ column.name }}
                            </div>
                            <div class="col-span-6 md:col-span-2 mb-2">
                                <Enum class="w-full" v-model="column.outputType" type="OutputType" />
                            </div>
                            <div v-if="column.outputType === 'Enum'" class="col-span-6 md:col-span-2 mb-2">
                                <Enum placeholder="Enum Type" class="w-full" v-model="column.enum" type="EnumTypes" />
                            </div>
                            <div v-if="column.outputType === 'Date'" class="col-span-6 md:col-span-2 mb-2">
                                <Enum placeholder="Date Format" class="w-full" v-model="column.dateFormat"
                                    type="DateFormat" />
                            </div>
                            <div v-if="column.outputType === 'Number'" class="col-span-6 md:col-span-2 mb-2">
                                <InputGroup>
                                    <InputGroupAddon>
                                        <Checkbox :binary="true" v-model="column.showBrackets" label="Show Brackets"
                                            v-tooltip:top="'Show Brackets'" />
                                    </InputGroupAddon>
                                    <InputNumber v-model="column.numberOfDecimalPlace" placeholder="Decimal Place" />
                                </InputGroup>
                            </div>
                        </div>

                    </template>
                </Card>

            </div>
        </div>


    </div>
</template>

<script setup>
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';
import axios from 'axios';
import { onBeforeMount, ref, shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import QueryService from './QueryService';
import DeclareCreate from './components/DeclareCreate.vue';
import DeclareView from './components/DeclareView.vue';

var route = useRoute();

const model = ref({
    id: 0,
    name: '',
    sourceId: null,
    searchTable: '',
    queryColumns: [],
    declares: [],
    queryString: 'SELECT * FROM "AnatolioQuery";'
})

onBeforeMount(() => {
    if (route.params.id) {
        axios.get("/api/oqueries(" + route.params.id + ")").then(response => {
            const query = response.data.value[0];
            console.log(query);
            model.value = query;
        })
    }
})



const queryService = new QueryService();

const queryRunnded = ref(false)
const DataSourceTables = ref([])
const queryResult = ref([])
const loading = ref(false)

const dataSource = ref({ language: "sql" }) // Bu, veri kaynağı seçenekleriyle doldurulmalıdır. 
const MONACO_EDITOR_OPTIONS = {
    automaticLayout: true,
    formatOnType: true,
    formatOnPaste: true
}
const editorRef = shallowRef()
const handleMount = editor => (editorRef.value = editor)

// your action
function formatCode() {
    editorRef.value?.getAction('editor.action.formatDocument').run()
}

const addDeclare = () => {
    model.value.declares.push({
        inputName: 'Field',
        type: 'Text',
        input: 'Text',
        multiple: false,
        visible: true,
        showOnWidgets: true,
        value1: {
            model: '',
            name: '',
            periodValue: 0,
            periodType: 'Second'
        },
        value2: {
            model: '',
            name: '',
            periodValue: 0,
            periodType: 'Second'
        },
        declareParentEntity: {
            selector: '',
            foreignKey: '',
            secondSelector: '',
            secondForeignKey: ''
        }
    });
}


watch(() => model.value.sourceId, // İzlenecek değer
    async (newSourceId) => { // Callback fonksiyon, newValue otomatik olarak buraya geçilir
        if (newSourceId) {
            loading.value = true;
            try {
                const response = await axios.get(`/api/otables(${newSourceId})`);
                DataSourceTables.value = response.data.value;
            } catch (error) {
                console.error('Error fetching tables:', error);
            } finally {
                loading.value = false;
            }
        }
    }
);


const runQuery = async () => {

    loading.value = true
    try {
        const response = await axios.post("/api/querybuilder/execute/new", model.value)
        setColumns(response.data.data.data)
        response.data.data.query.queryColumns = response.data.data.query.queryColumns.length == 0 ? model.value.queryColumns : response.data.data.query.queryColumns;
        queryResult.value = response.data.data.data.map(dt => queryService.format(response.data.data.query, dt));

        queryRunnded.value = response.data.result.resultStatus == "Undefined"
    } catch (error) {
        console.error('Error running query:', error)
    } finally {
        loading.value = false
    }
}

const saveQuery = async () => {

    loading.value = true
    try {
        const response = await axios.post("/api/querybuilder/save", model.value)
        model.value.Id = response.data.data.id
    } catch (error) {
        console.error('Error saving query:', error)
    } finally {
        loading.value = false
    }
}

const setColumns = (result) => {
    if (!result?.length) {
        return
    }
    const cols = []
    for (const c in result[0]) {
        const existCol = model.value.queryColumns.find(s => s.name === c) || { name: c, outputType: 'Text' }
        cols.push(existCol)
    }
    model.value.queryColumns = cols
}


const copyColumnName = (columnName) => {
    navigator.clipboard.writeText(columnName)
}

</script>

<style scoped>
/* Add any scoped styles here */
</style>
