<template>
    <div>


        <ProgressSpinner v-if="loading" />

        <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Sidebar Section -->
            <div class="md:col-span-1">

                <Card class="mb-4">
                    <template #title>
                        Query Data Source
                    </template>
                    <template #content>
                        <div class="mb-4">
                            <FormField inputType="OSelect" :settings="{
                               url: '/api/ODataSources?',
                               key: 'Id',
                               value: 'DbName',
                             }"
                                       :hideLabel="true" label="Data Source" fieldName="SourceId" v-model="model.SourceId"  v-model:selectedData="dataSource" />
                        </div>

                        <div v-if="model.SourceId" class="mb-4">
                            <InputText v-model="model.SearchTable" placeholder="Search in Tables" class="w-full p-2 border rounded" />
                        </div>

                        <div>
                            <Message v-if="!DataSourceTables.length" severity="secondary" class="text-center"><i class="pi pi-info-circle"></i><br /> Data Source Tables Will Shown Here</Message>

                            <Accordion v-if="DataSourceTables.length" multiple>
                                <AccordionTab v-for="table in DataSourceTables" :key="table.TABLE_NAME" :header="`${table.TABLE_SCHEMA}.${table.TABLE_NAME}`">
                                    <ul>
                                        <li v-for="col in table.Columns" :key="col.COLUMN_NAME">
                                            <a @click="copyColumnName(col.COLUMN_NAME)" class="text-sm w-full">
                                                <i class="pi pi-chevron-right mr-2"></i> {{ col.COLUMN_NAME }}
                                                <span v-tooltip:top="col.DATA_TYPE" class="text-gray-500" style="float: right; max-width: 40px; overflow: hidden; height: 20px; white-space: nowrap;">{{ col.DATA_TYPE }}</span>
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
                        <Button icon="pi pi-plus" class="mr-2" severity="secondary" text />
                        <Button icon="pi pi-print" class="mr-2" severity="secondary" text />
                        <Button icon="pi pi-upload" severity="secondary" text />
                    </template>

                    <template #center>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-file" />
                            </InputIcon>
                            <InputText v-model="model.Name" placeholder="Query Name" class="w-full p-2 border rounded" />
                        </IconField>
                    </template>

                    <template #end>
                        <Button label="Run Query" icon="pi pi-play" class="p-button-success" @click="runQuery"></Button>
                        <Button label="Save Query" icon="pi pi-save" v-if="queryRunnded" @click="saveQuery"></Button>
                    </template>
                </Toolbar>

                <Card class="mb-4">
                    <template #title>
                        Query Editor
                    </template>
                    <template #content>
                        <div style="height:300px">
                            <vue-monaco-editor v-model:value="model.QueryString"
                                               theme="vs-dark"
                                               :options="MONACO_EDITOR_OPTIONS"
                                               @mount="handleMount"
                                               :language="dataSource?.Language??'sql'"
                                               />
                        </div>
                    </template>
                </Card>

                <Card class="mb-4">
                    <template #title>
                        Query Result
                    </template>
                    <template #content>
                        <Message v-if="!queryResult.length" severity="secondary" class="text-center"><i class="pi pi-info-circle"></i> There is no query result</Message>

                        <DataTable v-else :value="queryResult" tableStyle="min-width: 50rem">
                            <div v-for="column in model.QueryColumns">
                                <Column :field="column.Name" :header="column.Name"></Column>
                            </div>
                        </DataTable>

                    </template>
                </Card>


                <Card class="mb-4" v-if="model.QueryColumns.length">
                    <template #title>
                        Result Column Output Types
                    </template>
                    <template #content>
                        <div v-for="column in model.QueryColumns" :key="column.Name">
                            <div  class="col-span-6 md:col-span-2 mb-2">
                                <InputText v-model="column.Name" placeholder="Column Name" class="w-full p-2 border rounded" />
                            </div>
                            <div  class="col-span-6 md:col-span-2 mb-2">
                                <Select v-model="column.OutputType" :options="outputTypes" placeholder="Output Type" class="w-full p-2 border rounded" />
                            </div>
                            <div v-if="column.OutputType === 'Enum'" class="col-span-6 md:col-span-2 mb-2">
                                <Select v-model="column.Enum" :options="enumTypes" placeholder="Enum" class="w-full p-2 border rounded" />
                            </div>
                            <div v-if="column.OutputType === 'Date'" class="col-span-6 md:col-span-2 mb-2">
                                <Select v-model="column.DateFormat" :options="dateFormats" placeholder="Date Format" class="w-full p-2 border rounded" />
                            </div>
                            <div v-if="column.OutputType === 'Number'" class="col-span-6 md:col-span-1 mb-2">
                                <InputNumber v-model="column.NumberOfDecimalPlace" placeholder="Decimal Place" class="w-full p-2 border rounded" />
                            </div>
                            <div v-if="column.OutputType === 'Number'" class="col-span-6 md:col-span-1 mb-2">
                                <Checkbox v-model="column.ShowBrackets" label="Show Brackets" class="w-full p-2 border rounded" />
                            </div>
                        </div>
                        
                    </template>
                </Card>

            </div>
        </div>


    </div>
</template>

<script setup>
    import { ref, reactive, onMounted, watch, shallowRef } from 'vue'
    import axios from 'axios'
    import { VueMonacoEditor } from '@guolao/vue-monaco-editor'

    const model = ref({
        Name: '',
        SourceId: null,
        SearchTable: '',
        QueryColumns: [],
        Declares: [],
        QueryString: 'SELECT * FROM users;'
    })
    const queryRunnded = ref(false)
    const DataSourceTables = ref([])
    const queryResult = ref([])
    const loading = ref(false)

    const dataSource = ref({ Language:"sql"}) // Bu, veri kaynağı seçenekleriyle doldurulmalıdır.
    const outputTypes = ref([]) // Bu, çıktı türü seçenekleriyle doldurulmalıdır.
    const enumTypes = ref([]) // Bu, enum seçenekleriyle doldurulmalıdır.
    const dateFormats = ref([]) // Bu, tarih formatı seçenekleriyle doldurulmalıdır.
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


    watch(() => model.value.SourceId, // İzlenecek değer
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
            const response = await axios.post("/api/querybuilder/execute", model.value)
            queryResult.value = response.data.data.data || []
            setColumns(response.data.data.data)
            queryRunnded.value = response.data.result.resultStatus == 0
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
            model.value.Id = response.data.Id
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
            const existCol = model.value.QueryColumns.find(s => s.Name === c) || { Name: c, OutputType: 'Text' }
            cols.push(existCol)
        }
        model.value.QueryColumns = cols
    }


    const copyColumnName = (columnName) => {
        navigator.clipboard.writeText(columnName)
    }

</script>

<style scoped>
    /* Add any scoped styles here */
</style>
