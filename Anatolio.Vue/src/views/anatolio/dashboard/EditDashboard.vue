<template>
    <div>
        <ErrorDisplay :error="error" :errors="errors" class="mb-4" />

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Sidebar Section -->
            <div class="md:col-span-1">
                <Card class="mb-4">
                    <template #title>
                        {{ $t('Dashboard Info') }}
                    </template>
                    <template #content>
                        <FormField class="mb-4" :hideLabel="true" label="Dashboard Name" fieldName="name"
                            :errors="errors">
                            <template v-slot:default="prp">
                                <InputText v-model="model.name" :placeholder="prp.placeholder" :invalid="prp.invalid"
                                    class="w-full p-2 border rounded" />
                            </template>
                        </FormField>

                        <FormField class="mb-4" :hideLabel="true" label="Description" fieldName="description"
                            :errors="errors">
                            <template v-slot:default="prp">
                                <InputText v-model="model.description" :placeholder="prp.placeholder"
                                    :invalid="prp.invalid" class="w-full p-2 border rounded" />
                            </template>
                        </FormField>

                        <FormField class="mb-4" :hideLabel="true" label="Access Type" fieldName="accessType"
                            :errors="errors">
                            <template v-slot:default="prp">
                                <Enum v-model="model.accessType" type="AccessType" :invalid="prp.invalid"
                                    :placeholder="prp.placeholder" />
                            </template>
                        </FormField>

                        <FormField class="mb-4" :hideLabel="true" label="Dashboard Type" fieldName="dashboardType"
                            :errors="errors">
                            <template v-slot:default="prp">
                                <Enum v-model="model.dashboardType" type="DashboardType" :invalid="prp.invalid"
                                    :placeholder="prp.placeholder" />
                            </template>
                        </FormField>
                        <Button label="Save Dashboard" icon="pi pi-save" class="p-button-success" :loading="loading"
                            @click="saveDashboard" />
                    </template>
                </Card>
            </div>

            <!-- Main Content Section -->
            <div class="md:col-span-3">
                <Card class="mb-4">
                    <template #title>
                        {{ $t('Dashboard Filters') }}
                    </template>
                    <template #content>
                        <DeclareComponent :declares="model.declares"></DeclareComponent>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import DeclareComponent from '../queryBuilder/components/DeclareEditor.vue';

var route = useRoute();


const model = ref({
    id: 0,
    name: null,
    description: '',
    accessType: 'Public',
    dashboardType: 'PageDashboard',
    declares: []
})

onBeforeMount(() => {
    if (route.params.id) {
        axios.get("/api/dashboard/get/" + route.params.id, { loading, errors, error }).then(response => {
            const query = response;
            if (query == null) { return; }
            model.value = query;
        })
    }
})




const loading = ref(false)
const errors = ref([])
const error = ref("");

const saveDashboard = async () => {

    const response = await axios.post('/api/dashboard/save', model.value, { loading, errors, error })
    model.value.Id = response.id

}


</script>
