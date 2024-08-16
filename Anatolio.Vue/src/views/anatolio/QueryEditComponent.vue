<template>
    <div>
        <Button label="Run Query" icon="pi pi-play" class="p-button-success" @click="runQuery"></Button>
        <Button label="Save Query" icon="pi pi-save" v-if="queryRunnded" @click="saveQuery"></Button>

        <ProgressSpinner v-if="loading" />

        <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Sidebar Section -->
            <div class="md:col-span-1">
                <div class="bg-white shadow-md sticky top-0 p-4">
                    <div class="mb-4">
                        <h3 class="text-lg font-semibold">Query Data Source</h3>
                    </div>
                    <form @submit.prevent>
                        <div>
                            <div class="mb-4">
                                <FormField inputType="OSelect" :settings="{
                                   url: '/api/ODataSources?',
                                   key: 'Id',
                                   value: 'DbName',
                                 }"
                                           label="Data Source" fieldName="SourceId" v-model="model.SourceId" :errors="errors" />
                            </div>

                            <div v-if="model.SourceId" class="mb-4">
                                <InputText v-model="model.SearchTable" placeholder="Search in Tables" class="w-full p-2 border rounded" />
                            </div>

                            <div>
                                <Button v-if="!DataSourceTables.length" label="Data Source Tables Will Shown Here" icon="pi pi-info-circle"></Button>

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
                        </div>
                    </form>
                </div>
            </div>

            <!-- Main Content Section -->
            <div class="md:col-span-3">
                <Message v-if="queryNameInputWarning" severity="error" :text="queryNameInputWarning" class="mb-4"></Message>

                <!-- Query Infoes Card -->
                <div class="bg-white shadow-md p-4 mb-4">
                    <div class="mb-4">
                        <h3 class="text-lg font-semibold">Query Infoes</h3>
                    </div>
                    <form @submit.prevent>
                        <div>
                            <InputText v-model="model.Name" placeholder="Query Name" class="w-full p-2 border rounded" />
                            <small class="text-red-500">{{ queryNameInputWarning }}</small>
                        </div>
                    </form>
                </div>

                <!-- Query Editor -->
                <div class="bg-white shadow-md p-4 mb-4">
                    <div class="mb-4">
                        <h3 class="text-lg font-semibold">Query Editor</h3>
                    </div>
                    <div>
                        <MonacoEditor width="800"
                                      height="500"
                                      theme="vs-dark"
                                      language="javascript"
                                      :options="cmOptions"
                                      v-model="model.QueryString"></MonacoEditor>
                    </div>
                </div>

                <!-- Query Result -->
                <div class="bg-white shadow-md p-4 mb-4">
                    <div class="mb-4">
                        <h3 class="text-lg font-semibold">Query Result</h3>
                    </div>
                    <div>
                        <Button v-if="!QueryResult.length" label="There is no query result" icon="pi pi-info-circle"></Button>
                        <table v-if="QueryResult.length" class="table-auto w-full">
                            <!-- Table content -->
                        </table>
                    </div>
                </div>

                <!-- Result Column Output Types -->
                <div class="bg-white shadow-md p-4 mb-4" v-if="QueryResult.length">
                    <div class="mb-4">
                        <h3 class="text-lg font-semibold">Result Column Output Types</h3>
                    </div>
                    <div class="grid grid-cols-6 gap-4">
                        <div v-for="column in model.QueryColumns" :key="column.Name" class="col-span-6 md:col-span-2 mb-2">
                            <InputText v-model="column.Name" placeholder="Column Name" class="w-full p-2 border rounded" />
                        </div>
                        <div v-for="column in model.QueryColumns" :key="column.OutputType" class="col-span-6 md:col-span-2 mb-2">
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
                </div>
            </div>
        </div>


    </div>
</template>

<script>
    import { ref, reactive, onMounted, watch } from 'vue'
    import axios from 'axios'
    export default {

        setup() {
            const model = ref({
                Name: '',
                SourceId: null,
                SearchTable: '',
                QueryColumns: [],
                Declares: [],
                QueryString: 'SELECT * FROM users;'
            })
            const queryRunnded = ref(false)
            const queryNameInputWarning = ref('')
            const DataSourceTables = ref([])
            const QueryResult = ref([])
            const loading = ref(false)

            const dataSources = ref([]) // Bu, veri kaynağı seçenekleriyle doldurulmalıdır.
            const outputTypes = ref([]) // Bu, çıktı türü seçenekleriyle doldurulmalıdır.
            const enumTypes = ref([]) // Bu, enum seçenekleriyle doldurulmalıdır.
            const dateFormats = ref([]) // Bu, tarih formatı seçenekleriyle doldurulmalıdır.
            const cmOptions = ref({
                mode: 'sql', // Dil modu
                theme: 'material', // Tema
                lineNumbers: true, // Satır numaraları
                tabSize: 2, // Tab genişliği
            })

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
                const arrayOfCharacters = model.value.Name.split("")
                const includesSlash = arrayOfCharacters.includes("/")
                const includesBackslash = arrayOfCharacters.includes("\\")
                if (includesSlash || includesBackslash) {
                    queryNameInputWarning.value = "Sorgu adında eğik çizgi (/) veya ters eğik çizgi (\\) kullanılamaz!"
                    return
                }
                queryNameInputWarning.value = ""
                loading.value = true
                try {
                    const response = await axios.post("/QueryBuilderApi/Exec", model.value)
                    QueryResult.value = response.data.Data || []
                    setColumns(response.data.Data)
                    createTable(response.data.Data)
                    queryRunnded.value = QueryResult.value.length > 0
                } catch (error) {
                    console.error('Error running query:', error)
                } finally {
                    loading.value = false
                }
            }

            const saveQuery = async () => {
                const arrayOfCharacters = model.value.Name.split("")
                const includesSlash = arrayOfCharacters.includes("/")
                const includesBackslash = arrayOfCharacters.includes("\\")
                if (includesSlash || includesBackslash) {
                    queryNameInputWarning.value = "Sorgu adında eğik çizgi (/) veya ters eğik çizgi (\\) kullanılamaz!"
                    return
                }
                queryNameInputWarning.value = ""
                loading.value = true
                try {
                    const response = await axios.post("/QueryBuilderApi/Save", model.value)
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

            const createTable = (result) => {
                if (!result?.length) {
                    return
                }
                $("#io-table").DataTable().clear().destroy()
                $("#io-table").empty()
                $("#io-table").jsontable({
                    data: result,
                    columns: model.value.QueryColumns.map(c => ({
                        data: c.Name,
                        output: c.OutputType,
                        enum: c.Enum ? enumTypes.value[c.Enum] : {},
                        dateFormat: c.DateFormat,
                        showBrackets: c.ShowBrackets,
                        numberOfDecimalPlace: c.NumberOfDecimalPlace
                    }))
                })
            }

            const copyColumnName = (columnName) => {
                navigator.clipboard.writeText(columnName)
            }

            return {
                model,
                queryRunnded,
                queryNameInputWarning,
                DataSourceTables,
                QueryResult,
                loading,
                dataSources,
                outputTypes,
                enumTypes,
                dateFormats,
                runQuery,
                saveQuery,
                setColumns,
                createTable,
                copyColumnName
            }
        }
    }
</script>

<style scoped>
    /* Add any scoped styles here */
</style>
