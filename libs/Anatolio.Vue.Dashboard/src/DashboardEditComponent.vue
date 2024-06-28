<template>
    <div>
        <Button label="Save Dashboard" icon="pi pi-save" @click="saveDashboard"></Button>
        <Message :visible="resultMessageVisible" :severity="resultMessageSeverity" :text="resultMessageText"></Message>

        <div class="row">
            <Button v-show="false" @click="save" ref="saveButton"></Button>

            <div class="col-md-4">
                <div class="card card-custom example example-compact">
                    <div class="card-header">
                        <h3 class="card-title">Dashboard Infoes</h3>
                    </div>
                    <form class="form">
                        <div class="card-body">
                            <InputText v-model="model.Name" placeholder="Menüde görüntüleneceði ismi girin" />
                            <InputText v-model="model.Description" placeholder="Unutmamak için dashboardýn ne içereceðini açýklayýn" />
                            <SelectButton v-model="model.AcccessType" :options="accessTypeOptions" optionLabel="label" optionValue="value" placeholder="Diðer kullanýcýlara görünüp görünmeyeceðini seçin" />
                            <SelectButton v-model="model.DashboardType" :options="dashboardTypeOptions" optionLabel="label" optionValue="value" placeholder="Dashboardýn kullaným amacýný seçin" />
                        </div>
                    </form>
                </div>
            </div>

            <div class="col-md-8">
                <div class="card card-custom example example-compact">
                    <div class="card-header">
                        <h3 class="card-title">Dashboard Filters</h3>
                        <div class="card-toolbar">
                            <Button label="Add" icon="pi pi-plus" @click="addFilter"></Button>
                        </div>
                    </div>

                    <form class="form">
                        <div class="card-body">
                            <Button label="Add First Widget" icon="pi pi-plus" v-show="!model.Declares.length" @click="addFilter"></Button>

                            <Accordion v-model="activeAccordion">
                                <AccordionTab v-for="(declare, index) in model.Declares" :key="index" :header="declare.InputName">
                                    <DeclareComponent :declare="declare"></DeclareComponent>
                                    <div class="row">
                                        <div class="col-md-12 text-center">
                                            <Button label="Delete" icon="pi pi-trash" @click="deleteFilter(index)"></Button>
                                        </div>
                                    </div>
                                </AccordionTab>
                            </Accordion>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { ref, reactive, onMounted } from 'vue'
    import { Button } from 'primevue/button'
    import { InputText } from 'primevue/inputtext'
    import { SelectButton } from 'primevue/selectbutton'
    import { Message } from 'primevue/message'
    import { Accordion, AccordionTab } from 'primevue/accordion'
    import DeclareComponent from './DeclareComponent.vue'

    export default {
        components: {
            Button,
            InputText,
            SelectButton,
            Message,
            Accordion,
            AccordionTab,
            DeclareComponent
        },
        setup() {
            const model = reactive({
                Name: '',
                Description: '',
                AcccessType: '',
                DashboardType: '',
                Declares: []
            })
            const activeAccordion = ref(null)
            const accessTypeOptions = ref([])
            const dashboardTypeOptions = ref([])
            const resultMessageVisible = ref(false)
            const resultMessageSeverity = ref('')
            const resultMessageText = ref('')

            onMounted(() => {
                // Initialize model and options
                Object.assign(model, JSON.parse(document.getElementById('app').dataset.model))
                accessTypeOptions.value = getEnums('AcccessType')
                dashboardTypeOptions.value = getEnums('DashboardType')
            })

            const saveDashboard = () => {
                document.querySelector('button[ref="saveButton"]').click()
            }

            const save = () => {
                // Save logic
                blockUI()
                post('/DashboardApi/Save', model, result => {
                    model.Id = result.Id
                    resultMessageVisible.value = true
                    resultMessageSeverity.value = 'success'
                    resultMessageText.value = 'Dashboard saved successfully!'
                })
            }

            const addFilter = () => {
                model.Declares.push({
                    Multiple: false,
                    Visible: true,
                    InputName: 'Input' + model.Declares.length,
                    Type: 'Text',
                    Input: 'Text',
                    Value1: { Name: 'DeclareA' + model.Declares.length, PeriodValue: 0, PeriodType: 'Day' },
                    Value2: { Name: 'DeclareB' + model.Declares.length, PeriodValue: 0, PeriodType: 'Day' }
                })
            }

            const deleteFilter = (index) => {
                model.Declares.splice(index, 1)
            }

            const getEnums = (enumType) => {
                // Enum options fetching logic
                return []
            }

            const blockUI = () => {
                // UI blocking logic
            }

            const post = (url, data, successCallback) => {
                // HTTP POST logic
            }

            return {
                model,
                activeAccordion,
                accessTypeOptions,
                dashboardTypeOptions,
                resultMessageVisible,
                resultMessageSeverity,
                resultMessageText,
                saveDashboard,
                save,
                addFilter,
                deleteFilter,
                getEnums,
                blockUI,
                post
            }
        }
    }
</script>

<style scoped>
    /* Add any scoped styles here */
</style>
