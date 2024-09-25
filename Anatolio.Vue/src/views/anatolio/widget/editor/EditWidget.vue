<template>
    <div>
        <!-- Result Message -->
        <ErrorDisplay :errors="errors" :error="error" />

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
                                <Button label="Save" icon="pi pi-save" @click="saveWidget"></Button>
                            </div>
                        </div>
                    </template>
                </Panel>
            </div>

            <!-- Widget Editor -->
            <div class="md:col-span-3">
                <Panel class="pb-4">
                    <div class="widget-buttons text-center">
                        <Button v-for="contentType in contentTypes" :key="contentType"
                            @click="addContent(contentType.type)" :icon="contentType.icon" :label="$t(contentType.type)"
                            iconPos="top" class="mr-1 p-button-primary" />
                    </div>
                    <div v-if="!model.contents.length" class="text-center mt-10">
                        <p>{{ $t('There is no widget content. Please select.') }}</p>
                    </div>
                </Panel>
                <div class="grid grid-cols-12">
                    <div class=" md:col-span-3"></div>
                    <div class="col-span-12 md:col-span-6">
                        <Widget :widget="model" class="mt-4"></Widget>
                    </div>
                </div>
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
                            <EditPieContent v-if="content.contentType == 'PieContent'" :content="content"
                                :errors="errors">
                            </EditPieContent>
                            <EditGaugeContent v-if="content.contentType == 'GaugeContent'" :content="content"
                                :errors="errors">
                            </EditGaugeContent>
                            <EditHeatmapContent v-if="content.contentType == 'HeatmapContent'" :content="content"
                                :errors="errors">
                            </EditHeatmapContent>
                            <EditMapContent v-if="content.contentType == 'MapContent'" :content="content"
                                :errors="errors">
                            </EditMapContent>
                            <EditTableContent v-if="content.contentType == 'TableContent'" :content="content"
                                :errors="errors">
                            </EditTableContent>
                            <EditInfoContent v-if="content.contentType == 'InfoContent'" :content="content"
                                :errors="errors">
                            </EditInfoContent>
                            <EditHtmlContent v-if="content.contentType == 'HtmlContent'" :content="content"
                                :errors="errors">
                            </EditHtmlContent>
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
import EditGaugeContent from './EditGaugeContent.vue';
import EditHeatmapContent from './EditHeatmapContent.vue';
import EditHtmlContent from './EditHtmlContent.vue';
import EditInfoContent from './EditInfoContent.vue';
import EditMapContent from './EditMapContent.vue';
import EditPieContent from './EditPieContent.vue';
import EditStatusContent from './EditStatusContent.vue';
import EditTableContent from './EditTableContent.vue';

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
    backgroundColor: 'white',
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
    { type: 'HeatmapContent', icon: 'pi pi-chart-scatter' },
    { type: 'MapContent', icon: 'pi pi-map' },
    { type: 'TableContent', icon: 'pi pi-table' },
    { type: 'InfoContent', icon: 'pi pi-info-circle' },
    { type: 'HtmlContent', icon: 'pi pi-code' },
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
        pieContent: { pieType: 'pie' },
        gaugeContent: { colorRanges: [{ contentColorString: 'ffffff', to: 50 }, { contentColorString: 'ff9100', to: 100 }] },
        mapContent: { mapType: 'Marker', descriptionColumns: [], colorRanges: [], markerIcon: 'pi pi-plus', markerColorString: 'ff0000' },
        dataContent: { columns: [] },
        heatmapContent: { colorRanges: [{ contentColorString: 'ffffff' }, { contentColorString: 'ff9100' }] },
        htmlContent: {}
    });
};

const deleteContent = (index) => {
    const itemToDelete = sortedContents.value[index];

    // Orijinal modelde o öğenin indeksini bul
    const originalIndex = model.value.contents.findIndex(item => item === itemToDelete);

    if (originalIndex !== -1) {
        // Orijinal modelden doğru öğeyi siliyoruz
        model.value.contents.splice(originalIndex, 1);
    }
};

const sortedContents = computed(() => {
    return [...model.value.contents].sort((a, b) => a.order - b.order);
});


const saveWidget = async () => {
    try {
        if (!model.value.contents.length) {
            error.value = "There is no widget content. Please add.";
            return;
        }
        error.value = null;
        var result = await axios.post('/api/widget/save', model.value);
        model.value.id = result.id;
        // Success handling
    } catch (error) {
        // Error handling
    }
};

</script>
