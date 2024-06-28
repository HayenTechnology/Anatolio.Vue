<template>
    <div>
        <Button label="Reload Dashboard" icon="pi pi-search" @click="reloadDashboard"></Button>
        <div v-if="hasPermission('ManageDashboard')">
            <Button label="Add Widget" icon="pi pi-plus" v-if="page.editable" @click="addWidget"></Button>
            <Button label="Save Dashboard" icon="pi pi-save" v-if="page.editable" @click="saveDashboard"></Button>
            <Button label="Edit Dashboard" icon="pi pi-pencil" v-if="!page.editable" @click="editDashboard"></Button>
        </div>

        <div>
            <Button v-show="false" @click="save" ref="saveButton"></Button>
            <Button label="Add First Widget" icon="pi pi-plus" v-show="!model.WidgetPlaces.length && page.editable" @click="newWidget" ref="addWidgetButton"></Button>

            <div class="row" v-show="model.Declares.filter(declare => declare.Visible).length">
                <div class="col-md-12">
                    <div class="card card-custom">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-3" v-for="declare in model.Declares.filter(declare => declare.Visible)" :key="declare.InputName">
                                    <div v-show="false">
                                        <DeclareComponent :declare="declare"></DeclareComponent>
                                    </div>
                                    <DeclareInputComponent :declare="declare"></DeclareInputComponent>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                </div>
            </div>

            <div class="row">
                <div class="col-md-12">
                    <DashboardComponent :model="model" :options="{ cellHeight: 10, verticalMargin: 0 }"></DashboardComponent>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { ref, reactive, onMounted } from 'vue'
    import { Button } from 'primevue/button'
    import DeclareComponent from './DeclareComponent.vue'
    import DeclareInputComponent from './DeclareInputComponent.vue'
    import DashboardComponent from './DashboardComponent.vue'

    export default {
        components: {
            Button,
            DeclareComponent,
            DeclareInputComponent,
            DashboardComponent
        },
        setup() {
            const model = reactive({})
            const page = reactive({
                title: '',
                description: '',
                editable: false
            })

            onMounted(() => {
                Object.assign(model, JSON.parse(document.getElementById('app').dataset.model))
                page.title = model.Name
                page.description = model.Description
            })

            const hasPermission = (permission) => {
                // Permission check logic
                return true
            }

            const reloadDashboard = () => {
                // Reload dashboard logic
            }

            const addWidget = () => {
                document.querySelector('button[ref="addWidgetButton"]').click()
            }

            const saveDashboard = () => {
                document.querySelector('button[ref="saveButton"]').click()
            }

            const editDashboard = () => {
                page.editable = true
            }

            const save = () => {
                // Save logic
                page.editable = false
            }

            const newWidget = () => {
                // Add new widget logic
            }

            return {
                model,
                page,
                hasPermission,
                reloadDashboard,
                addWidget,
                saveDashboard,
                editDashboard,
                save,
                newWidget
            }
        }
    }
</script>

<style scoped>
    /* Add any scoped styles here */
</style>
