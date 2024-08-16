<template>
  <div>
    <Button label="Run Query" icon="pi pi-play" class="p-button-success" @click="runQuery"></Button>
    <Button label="Save Query" icon="pi pi-save" v-if="queryRunnded.value" @click="saveQuery"></Button>

    <ProgressSpinner v-if="loading.value" />

    <div v-else class="row">
      <div class="col-md-3">
        <div class="card card-custom sticky">
          <div class="card-header">
            <h3 class="card-title">Query Data Source</h3>
          </div>
          <form @submit.prevent>
            <div class="card-body">
              <div class="row">
                <div class="col-md-12">
                  <Dropdown v-model="model.value.SourceId" :options="dataSources" optionLabel="label" placeholder="Select a Data Source" @change="onSourceChange"></Dropdown>
                </div>

                <div class="col-md-12" v-if="model.value.SourceId">
                  <InputText v-model="model.value.SearchTable" placeholder="Search in Tables"></InputText>
                </div>

                <div class="col-md-12">
                  <Button v-if="!DataSourceTables.value.length" label="Data Source Tables Will Shown Here" icon="pi pi-info-circle"></Button>

                  <Accordion v-if="DataSourceTables.value.length" multiple>
                    <AccordionTab v-for="table in filteredTables" :key="table.TABLE_NAME" :header="`${table.TABLE_SCHEMA}.${table.TABLE_NAME}`">
                      <ul>
                        <li v-for="col in table.Columns" :key="col.COLUMN_NAME">
                          <a @click="copyColumnName(col.COLUMN_NAME)">
                            <i class="pi pi-chevron-right"></i> {{ col.COLUMN_NAME }} <span class="text-muted">{{ col.DATA_TYPE }}</span>
                          </a>
                        </li>
                      </ul>
                    </AccordionTab>
                  </Accordion>
                </div>
              </div>
            </div >
          </form >
        </div >
      </div >
      <div class="col-md-9">
        <Message v-if="queryNameInputWarning.value" severity="error" :text="queryNameInputWarning"></Message>

        <!--Query Infoes Card-- >
    <div class="card card-custom gutter-b">
        <div class="card-header">
            <h3 class="card-title">Query Infoes</h3>
        </div>
        <form @submit.prevent>
        <div class="card-body">
            <div class="row">
                <div class="col-md-12">
                    <InputText v-model="model.value.Name" placeholder="Query Name" />
                    <small class="p-error">{{ queryNameInputWarning.value }}</small>
                </div>
            </div>
        </div>
    </form>
        </div >

        < !--Query Editor-- >
        <div class="card card-custom gutter-b">
          <div class="card-header">
            <h3 class="card-title">Query Editor</h3>
          </div>
          <div class="card-body">
            <div id="jsoneditor" style="height: 400px;"></div>
          </div>
        </div>

        <!--Query Result-- >
        <div class="card card-custom gutter-b">
          <div class="card-header">
            <h3 class="card-title">Query Result</h3>
          </div>
          <div class="card-body">
            <Button v-if="!QueryResult.value.length" label="There is no query result" icon="pi pi-info-circle"></Button>
            <table v-if="QueryResult.value.length" class="table" id="io-table"></table>
          </div>
        </div>

        <!--Result Column Output Types-- >
    <div class="card card-custom gutter-b" v-if="QueryResult.value.length">
        <div class="card-header">
            <h3 class="card-title">Result Column Output Types</h3>
        </div>
        <div class="card-body">
            <div v-for="column in model.value.QueryColumns" :key="column.Name" class="row">
            <div class="col-md-4">
                <InputText v-model="column.Name" placeholder="Column Name" />
            </div>
            <div class="col-md-4">
                <Dropdown v-model="column.OutputType" :options="outputTypes" placeholder="Output Type" />
            </div>
            <div class="col-md-4" v-if="column.OutputType === 'Enum'">
                <Dropdown v-model="column.Enum" :options="enumTypes" placeholder="Enum" />
            </div>
            <div class="col-md-4" v-if="column.OutputType === 'Date'">
                <Dropdown v-model="column.DateFormat" :options="dateFormats" placeholder="Date Format" />
            </div>
            <div class="col-md-2" v-if="column.OutputType === 'Number'">
                <InputNumber v-model="column.NumberOfDecimalPlace" placeholder="Decimal Place" />
            </div>
            <div class="col-md-2" v-if="column.OutputType === 'Number'">
                <Checkbox v-model="column.ShowBrackets" label="Show Brackets" />
            </div>
        </div>
    </div>
        </div >
      </div >
    </div >
  </div >
</template >

<script>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import {
  Button,
  Dropdown,
  InputText,
  Message,
  Accordion,
  AccordionTab,
  InputNumber,
  Checkbox,
  ProgressSpinner
} from 'primevue'

export default {
  components: {
    Button,
    Dropdown,
    InputText,
    Message,
    Accordion,
    AccordionTab,
    InputNumber,
    Checkbox,
    ProgressSpinner
  },
  setup() {
    const model = reactive({
      Name: '',
      SourceId: null,
      SearchTable: '',
      QueryColumns: [],
      Declares: [],
      QueryString: ''
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

    onMounted(() => {
      Object.assign(model, JSON.parse(document.getElementById('app').dataset.model))
      // Editor'ü başlat
      const editor = ace.edit("jsoneditor")
      editor.setTheme("ace/theme/monokai")
      editor.session.setMode("ace/mode/sql")
      editor.setValue(model.QueryString || " ")
    })

    const onSourceChange = async () => {
      loading.value = true
      try {
        const response = await axios.get(`/odata/tables(${model.SourceId})`)
        DataSourceTables.value = response.data.value
      } catch (error) {
        console.error('Error fetching tables:', error)
      } finally {
        loading.value = false
      }
    }

    const runQuery = async () => {
      const arrayOfCharacters = model.Name.split("")
      const includesSlash = arrayOfCharacters.includes("/")
      const includesBackslash = arrayOfCharacters.includes("\\")
      if (includesSlash || includesBackslash) {
        queryNameInputWarning.value = "Sorgu adında eğik çizgi (/) veya ters eğik çizgi (\\) kullanılamaz!"
        return
      }
      queryNameInputWarning.value = ""
      model.QueryString = ace.edit("jsoneditor").getValue()
      loading.value = true
      try {
        const response = await axios.post("/QueryBuilderApi/Exec", model)
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
      const arrayOfCharacters = model.Name.split("")
      const includesSlash = arrayOfCharacters.includes("/")
      const includesBackslash = arrayOfCharacters.includes("\\")
      if (includesSlash || includesBackslash) {
        queryNameInputWarning.value = "Sorgu adında eğik çizgi (/) veya ters eğik çizgi (\\) kullanılamaz!"
        return
      }
      queryNameInputWarning.value = ""
      model.QueryString = ace.edit("jsoneditor").getValue()
      loading.value = true
      try {
        const response = await axios.post("/QueryBuilderApi/Save", model)
        model.Id = response.data.Id
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
        const existCol = model.QueryColumns.find(s => s.Name === c) || { Name: c, OutputType: 'Text' }
        cols.push(existCol)
      }
      model.QueryColumns = cols
    }

    const createTable = (result) => {
      if (!result?.length) {
        return
      }
      $("#io-table").DataTable().clear().destroy()
      $("#io-table").empty()
      $("#io-table").jsontable({
        data: result,
        columns: model.QueryColumns.map(c => ({
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
      onSourceChange,
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
