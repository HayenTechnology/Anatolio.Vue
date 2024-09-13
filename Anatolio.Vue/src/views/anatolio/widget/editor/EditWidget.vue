<template>
    <div>
        <!-- Result Message -->
        <ErrorDisplay :errors="errors" />

        <!-- Save and Run Buttons -->


        <!-- Edit / Create Widget -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Widget General Info -->
            <div class="md:col-span-1">
                <Panel sticky="true" :sticky-options="{ marginTop: '140px', stickyFor: 1023, stickyClass: 'sticky' }">
                    <template #header>
                        <div class="font-bold">{{ $t('Widget Info') }}</div>
                    </template>
                    <FormField class="mb-4" label="Widget Name" :field-name="'name'" :errors="errors">
                        <template v-slot:default="props">
                            <InputGroup>
                                <InputGroupAddon>
                                    <Checkbox v-model="model.hasHeader" :invalid="props.invalid" :binary="true"
                                        v-tooltip.top="$t('Show on Header')" />
                                </InputGroupAddon>


                                <InputText v-model="model.name" :placeholder="props.placeholder"
                                    :invalid="props.invalid" />
                            </InputGroup>

                        </template>
                    </FormField>

                    <FormField class="mb-4" label="Description" :field-name="'description'" :errors="errors">
                        <template v-slot:default="props">
                            <InputText v-model="model.description" :placeholder="props.placeholder"
                                :invalid="props.invalid" />
                        </template>
                    </FormField>

                    <FormField class="mb-4" label="Auto Reload" :field-name="'autoReload'" :errors="errors">
                        <template v-slot:default="props">
                            <Checkbox v-model="model.autoReload" :invalid="props.invalid" />
                        </template>
                    </FormField>

                    <FormField v-if="model.autoReload" class="mb-4" label="Reload Minute" :field-name="'reloadMinute'"
                        :errors="errors">
                        <template v-slot:default="props">
                            <InputText v-model="model.autoReloadMinute" :placeholder="props.placeholder"
                                :invalid="props.invalid" />
                        </template>
                    </FormField>

                    <FormField class="mb-4" label="Access Type" :field-name="'accessType'" :errors="errors">
                        <template v-slot:default="props">
                            <Enum v-model="model.accessType" type="AccessType" :invalid="props.invalid"
                                :placeholder="props.placeholder" />
                        </template>
                    </FormField>

                    <FormField class="mb-4" label="Background Color" :field-name="'backgroundColor'" :errors="errors">
                        <template v-slot:default="props">
                            <Enum v-model="model.backgroundColor" type="PrimeColor" :invalid="props.invalid"
                                :placeholder="props.placeholder" />
                        </template>
                    </FormField>
                    <template #footer>
                        <div class="flex flex-wrap items-center justify-between gap-4">
                            <div class="flex items-center gap-2">
                                <Button label="Save" icon="pi pi-save" @click="saveWidget"></button>
                                <Button label="Reload" icon="pi pi-refresh"
                                    @click="loadWidget(model, null, false)"></button>
                            </div>
                        </div>
                    </template>
                </Panel>
            </div>

            <!-- Widget Editor -->
            <div class="md:col-span-3">
                <Widget :widget="model"></Widget>
                <Panel>
                    <div class="widget-buttons text-center">
                        <Button v-for="contentType in contentTypes" :key="contentType"
                            @click="addContent(contentType.type)" :icon="contentType.icon" :label="$t(contentType.type)"
                            iconPos="top" class="mr-1 p-button-primary" />
                    </div>
                    <div v-if="!model.contents.length" class="text-center mt-10">
                        <p>{{ $t('There is no widget content. Please select.') }}</p>
                    </div>
                </Panel>
                <Panel toggleable class="mt-4" v-for="(content, index) in sortedContents" :key="content.id">
                    <template #header>

                        <h1 class="font-bold">
                            <input type="number" v-model="content.order"
                                style="width: 45px; border: 0; text-align: center;" />
                            <input type="text" v-model="content.name" style="width: 200px; border: 0;" />
                        </h1>
                    </template>
                    <template #icons>
                        <Button icon="pi pi-trash" class="p-button-danger" rounded text @click="deleteContent(index)" />
                    </template>
                    <!-- Widget Contents -->
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12">
                            <FormField class="mb-4" label="Data Query" fieldName="queryId" :errors="errors">
                                <template #default="prp">
                                    <InputGroup>
                                        <OSelect v-model="content.queryId" :placeholder="prp.placeholder" :settings="{
                                            key: 'id',
                                            url: '/api/OQueries?',
                                            value: 'name'
                                        }" :invalid="prp.invalid" v-model:selectedData="content.query" />

                                        <Button icon="pi pi-pen-to-square" label="Edit" class="p-button-info"
                                            v-if="content.queryId" @click="router.push('/query/' + content.queryId)" />

                                        <Button v-else icon="pi pi-plus" label="Create" class="p-button-help"
                                            @click="router.push('/query')" />
                                    </InputGroup>
                                </template>
                            </FormField>
                        </div>
                        <div v-if="content.queryId" class="col-span-12 mt-4">
                            <EditStatusContent v-if="content.contentType == 'StatusContent'" :content="content"
                                :errors="errors">
                            </EditStatusContent>

                            <EditChartContent v-if="content.contentType == 'ChartContent'" :content="content"
                                :errors="errors">
                            </EditChartContent>

                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { computed, onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HelperService from '../../../../services/HelperService';
import Widget from '../ViewWidget.vue';
import EditChartContent from './EditChartContent.vue';
import EditStatusContent from './EditStatusContent.vue';


const helper = new HelperService();

var route = useRoute();
var router = useRouter();

const model = ref({
    name: '',
    description: '',
    hasHeader: false,
    autoReload: false,
    autoReloadMinute: 0,
    accessType: 'Public',
    backgroundColor: 'primary',
    PreviewImagePath: '',
    contents: [],
});

const loading = ref(false)
const errors = ref([])
const error = ref("");

onBeforeMount(() => {
    if (route.params.id) {
        axios.get("/api/widget/get/" + route.params.id, { loading, errors, error }).then(response => {
            const query = response;
            if (query == null) { return; }
            model.value = query;
        })
    }
})



const contentTypes = [
    { type: 'StatusContent', icon: 'pi pi-info-circle' },
    { type: 'ChartContent', icon: 'pi pi-chart-line' },
    { type: 'PieContent', icon: 'pi pi-chart-pie' },
    { type: 'GaugeContent', icon: 'pi pi-gauge' },
    { type: 'MapContent', icon: 'pi pi-map' },
    { type: 'TableContent', icon: 'pi pi-table' },
];

const addContent = (contentType) => {
    model.value.contents.push({
        id: helper.guid(),
        order: model.value.contents.length + 1,
        name: contentType,
        fields: [], // content-specific fields
        contentType: contentType,
        chartContent: { yColumns: [] },
        statusContent: { contentColorString: "blue", icon: 'pi pi-pencil' },
        pieContent: {},
        gaugeContent: {},
        mapContent: { mapType: 'Marker', descriptionColumns: [], colorRanges: [] },
        dataContent: { columns: [] },
        heatmapContent: { colorRanges: [] },
        htmlContent: { html: '' },
        pageContent: { pageUrl: '' },
    });
};

const deleteContent = (index) => {
    model.value.contents.splice(index, 1);
};

const sortedContents = computed(() => {
    return [...model.value.contents].sort((a, b) => a.order - b.order);
});


const saveWidget = async () => {
    try {
        await axios.post('/api/widget/save', model.value);
        // Success handling
    } catch (error) {
        // Error handling
    }
};

const loadWidget = async () => {
    // Loading widget logic
};


</script>
