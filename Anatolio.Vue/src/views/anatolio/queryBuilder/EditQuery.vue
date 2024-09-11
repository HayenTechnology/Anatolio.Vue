<template>
    <div>
        <ErrorDisplay :error="error" :errors="errors" class="mb-4" />

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Sidebar Section -->
            <div class="md:col-span-1">

                <Card class="mb-4">
                    <template #title>
                        {{ $t('Query Data Source') }}
                    </template>
                    <template #content>
                        <FormField class="mb-4" :hideLabel="true" label="Data Source" fieldName="sourceId"
                            :errors="errors">
                            <template v-slot:default="prp">
                                <OSelect :settings="{
                                    url: '/api/osources?',
                                    key: 'Id',
                                    value: 'DbName',
                                }" v-model="model.sourceId" v-model:selectedData="dataSource"
                                    :placeholder="prp.placeholder" :invalid="prp.invalid">
                                </OSelect>
                            </template>
                        </FormField>
                        <DataSource :sourceId="model.sourceId"></DataSource>
                    </template>
                </Card>

            </div>

            <!-- Main Content Section -->
            <div class="md:col-span-3">
                <Card class="mb-4">
                    <template #content>
                        <FormField :hideLabel="true" label="Query Name" fieldName="name" :errors="errors">
                            <template v-slot:default="prp">
                                <InputGroup>
                                    <InputText v-model="model.name" :placeholder="prp.placeholder"
                                        :invalid="prp.invalid" class="w-full p-2 border rounded" />
                                    <Button :loading="loading" label="Run Query" icon="pi pi-play" class="p-button-info"
                                        @click="runQuery"></Button>
                                    <Button :loading="loading" label="Save Query" icon="pi pi-save" v-if="queryRunnded"
                                        @click="saveQuery"></Button>
                                </InputGroup>
                            </template>
                        </FormField>
                    </template>
                </Card>

                <Card class="mb-4">
                    <template #title>
                        {{ $t('Query Editor') }}
                    </template>
                    <template #content>
                        <Tabs value="0">
                            <TabList>
                                <Tab value="0"> {{ $t('Query') }}</Tab>
                                <Tab value="1">{{ $t('Filters') }}</Tab>
                                <Tab value="2" v-if="model.queryColumns.length">{{ $t('Result') }}</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel value="0">
                                    <div class="grid grid-cols-3 gap-4">
                                        <div v-for="declare in model.declares">
                                            <DeclareView :declare="declare"></DeclareView>
                                        </div>
                                    </div>
                                    <br />
                                    <div style="height:200px">
                                        <vue-monaco-editor v-model:value="model.queryString" theme="vs-dark"
                                            :options="MONACO_EDITOR_OPTIONS" @mount="handleMount"
                                            :language="dataSource?.Language ?? 'sql'" />
                                    </div>
                                </TabPanel>
                                <TabPanel value="1">
                                    <DeclareEditor :declares="model.declares"></DeclareEditor>

                                </TabPanel>
                                <TabPanel value="2">
                                    <div v-for="column in model.queryColumns" :key="column.name"
                                        class="grid grid-cols-6 gap-4">
                                        <div class="col-span-6 md:col-span-2 mb-2">
                                            {{ column.name }}
                                        </div>
                                        <div class="col-span-6 md:col-span-2 mb-2">
                                            <Enum class="w-full" v-model="column.outputType" type="OutputType" />
                                        </div>
                                        <div v-if="column.outputType === 'Enum'" class="col-span-6 md:col-span-2 mb-2">
                                            <Enum placeholder="Enum Type" class="w-full" v-model="column.enum"
                                                type="EnumTypes" />
                                        </div>
                                        <div v-if="column.outputType === 'Date'" class="col-span-6 md:col-span-2 mb-2">
                                            <Enum placeholder="Date Format" class="w-full" v-model="column.dateFormat"
                                                type="DateFormat" />
                                        </div>
                                        <div v-if="column.outputType === 'Number'"
                                            class="col-span-6 md:col-span-2 mb-2">
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <Checkbox :binary="true" v-model="column.showBrackets"
                                                        label="Show Brackets" v-tooltip:top="'Show Brackets'" />
                                                </InputGroupAddon>
                                                <InputNumber v-model="column.numberOfDecimalPlace"
                                                    placeholder="Decimal Place" />
                                            </InputGroup>
                                        </div>
                                    </div>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>

                    </template>
                </Card>

                <Card class="mb-4">
                    <template #title>
                        {{ $t('Query Result') }}
                    </template>
                    <template #content>
                        <Message v-if="!queryResult.length" severity="secondary" class="text-center">
                            <i class="pi pi-info-circle"></i>{{ $t('There is no query result yet') }}
                        </Message>

                        <DataTable v-else :value="queryResult" tableStyle="min-width: 50rem">
                            <div v-for="column in model.queryColumns">
                                <Column :field="column.name + '_formated_'" :header="column.name"></Column>
                            </div>
                        </DataTable>

                    </template>
                </Card>

            </div>
        </div>


    </div>
</template>

<script setup>
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';
import axios from 'axios';
import { onBeforeMount, ref, shallowRef } from 'vue';
import { useRoute } from 'vue-router';
import QueryService from './QueryService';
import DataSource from './components/DataSource.vue';
import DeclareEditor from './components/DeclareEditor.vue';
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
        axios.get("/api/querybuilder/get/" + route.params.id, { loading, errors, error }).then(response => {
            const query = response;
            if (query == null) { return; }
            model.value = query;
        })
    }
})



const queryService = new QueryService();

const queryRunnded = ref(false)
const queryResult = ref([])
const loading = ref(false)
const errors = ref([])
const error = ref("");

const dataSource = ref({})
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




const runQuery = async () => {
    queryRunnded.value = false;

    const response = await axios.post("/api/querybuilder/execute/new", model.value, { loading, errors, error })
    setColumns(response.data)
    response.query.queryColumns = response.query.queryColumns.length == 0 ? model.value.queryColumns : response.query.queryColumns;
    queryResult.value = response.data.map(dt => queryService.format(response.query, dt));

    queryRunnded.value = true;

}

const saveQuery = async () => {

    const response = await axios.post("/api/querybuilder/save", model.value, { loading, errors, error })
    model.value.Id = response.id

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

</script>
