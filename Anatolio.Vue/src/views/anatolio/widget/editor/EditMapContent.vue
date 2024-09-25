<template>
    <div v-if="content.contentType === 'MapContent'" class="grid grid-cols-12 gap-4">
        <!-- Map Type -->
        <div class="col-span-4">
            <FormField label="Map Type">
                <Enum v-model="content.mapContent.mapType" type="MapType" />
            </FormField>
        </div>

        <!-- Latitude Column (Only for Marker Map Type) -->
        <div class="col-span-4" v-if="content.mapContent.mapType === 'Marker'">
            <FormField label="Latitude Column">
                <Select v-model="content.mapContent.latitudeColumn" optionValue="name" optionLabel="name"
                    :options="content.query?.queryColumns ?? []" />
            </FormField>
        </div>

        <!-- Longitude Column (Only for Marker Map Type) -->
        <div class="col-span-4" v-if="content.mapContent.mapType === 'Marker'">
            <FormField label="Longitude Column">
                <Select v-model="content.mapContent.longitudeColumn" optionValue="name" optionLabel="name"
                    :options="content.query?.queryColumns ?? []" />
            </FormField>
        </div>

        <!-- Marker Icon (Only for Marker Map Type) -->
        <div class="col-span-4" v-if="content.mapContent.mapType === 'Marker'">
            <FormField label="Marker Icon">
                <Enum v-model="content.mapContent.markerIcon" type="PrimeIcon" />
            </FormField>
        </div>

        <!-- Use Static Color Checkbox -->
        <div class="col-span-2" v-if="!content.mapContent.isUserDefinedColor">
            <FormField label="Use Static Color">
                <Checkbox v-model="content.mapContent.isStaticColor" :binary="true" />
            </FormField>
        </div>

        <!-- Define Palette Checkbox -->
        <div class="col-span-2" v-if="!content.mapContent.isStaticColor">
            <FormField label="Define Palette">
                <Checkbox v-model="content.mapContent.isUserDefinedColor" :binary="true" />
            </FormField>
        </div>

        <!-- Data Color -->
        <div class="col-span-4" v-if="content.mapContent.isStaticColor">
            <FormField label="Data Color">
                <ColorPicker v-model="content.mapContent.markerColorString" />
            </FormField>
        </div>

        <!-- Coordinates Column (Not Marker) -->
        <div class="col-span-4" v-if="content.mapContent.mapType !== 'Marker'">
            <FormField label="Coordinates Column">
                <Select v-model="content.mapContent.coordinatesColumn" optionValue="name" optionLabel="name"
                    :options="content.query?.queryColumns ?? []" />
            </FormField>
        </div>

        <!-- Color Criteria Column -->
        <div class="col-span-4" v-if="!content.mapContent.isStaticColor">
            <FormField label="Color Criteria Column">
                <Select v-model="content.mapContent.colorCriteriaColumn" optionValue="name" optionLabel="name"
                    :options="content.query?.queryColumns ?? []" />
            </FormField>
        </div>

        <!-- Add Description Columns Buttons -->
        <div class="col-span-12 text-center">
            <Button @click="addTableColumn" text icon="pi pi-plus" :label="$t('Add Description Column')" />
            <hr />
        </div>

        <!-- Description Columns -->
        <div class="col-span-12" v-for="(col, index) in content.mapContent.descriptionColumns" :key="index">
            <div class="grid grid-cols-12 gap-4">
                <!-- Prefix -->
                <div class="col-span-3">
                </div>
                <div class="col-span-6">
                    <InputGroup>
                        <InputGroupAddon>
                            <ColorPicker v-model="col.contentColorString" />
                        </InputGroupAddon>
                        <InputGroupAddon @click="togglePrefix($event, index)">
                            {{ col.prefix ?? 'pre' }}
                        </InputGroupAddon>
                        <Popover ref="prefix_pop">
                            <div class="flex flex-col gap-4">
                                <FormField label="Enter Prefix" fieldName="prefix" :errors="errors">
                                    <template #default="prp">
                                        <InputText v-model="col.prefix" :placeholder="prp.placeholder"
                                            :invalid="prp.invalid" />
                                    </template>
                                </FormField>
                            </div>
                        </Popover>
                        <Select v-model="col.name" optionValue="name" optionLabel="name"
                            :options="content.query?.queryColumns ?? []" />
                        <InputGroupAddon @click="togglePostfix($event, index)">
                            {{ col.postfix ?? 'pos' }}
                        </InputGroupAddon>
                        <Popover ref="postfix_pop">
                            <div class="flex flex-col gap-4">
                                <FormField label="Enter Postfix" fieldName="postfix" :errors="errors">
                                    <template #default="prp">
                                        <InputText v-model="col.postfix" :placeholder="prp.placeholder"
                                            :invalid="prp.invalid" />
                                    </template>
                                </FormField>
                            </div>
                        </Popover>
                        <InputGroupAddon @click="deleteDescriptionColumn(index)">
                            <i class="pi pi-trash text-red-500"></i>
                        </InputGroupAddon>
                    </InputGroup>
                </div>

            </div>
        </div>

        <!-- Add Color Ranges Buttons -->
        <div class="col-span-12 text-center" v-if="content.mapContent.isUserDefinedColor">
            <Button @click="addColorRange" text :label="$t('Add Color Range')" icon="pi pi-plus" />
            <hr />
        </div>

        <!-- Color Ranges -->
        <div class="col-span-12" v-for="(col, index) in content.mapContent.colorRanges" :key="index"
            v-if="content.mapContent.isUserDefinedColor">
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-3">
                </div>
                <!-- Name -->
                <div class="col-span-2">
                    <FormField label="Name">
                        <InputGroup>
                            <InputGroupAddon>
                                <ColorPicker v-model="col.contentColorString" />
                            </InputGroupAddon>
                            <InputText v-model="col.name" />

                        </InputGroup>
                    </FormField>
                </div>

                <!-- Start Value -->
                <div class="col-span-2">
                    <FormField label="Start Value">
                        <InputGroup>
                            <InputNumber v-model="col.from" />
                        </InputGroup>
                    </FormField>
                </div>

                <!-- End Value -->
                <div class="col-span-2">
                    <FormField label="End Value">
                        <InputGroup>
                            <InputNumber v-model="col.to" :min="col.from" />
                            <InputGroupAddon @click="deleteColorRange(index)">
                                <i class="pi pi-trash text-red-500"></i>
                            </InputGroupAddon>
                        </InputGroup>
                    </FormField>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
    content: {
        type: Object,
        required: true
    }
});

const mapTypes = ref([
    { value: 'Standard', label: 'Standard' },
    { value: 'Marker', label: 'Marker' }
]);

const mapIcons = ref([
    { key: 'Icon1', value: 'icon-1', html: '<i class="icon-1"></i>' },
    { key: 'Icon2', value: 'icon-2', html: '<i class="icon-2"></i>' }
]);

const addTableColumn = () => {
    props.content.mapContent.descriptionColumns.push({ prefix: null, name: '', postfix: null, contentColorString: 'ff0000' });
};

const deleteDescriptionColumn = (index) => {
    props.content.mapContent.descriptionColumns.splice(index, 1);
};

const addColorRange = () => {
    props.content.mapContent.colorRanges.push({ name: '', from: 0, to: 10, contentColorString: 'ff0000' });
};

const deleteColorRange = (index) => {
    props.content.mapContent.colorRanges.splice(index, 1);
};

const prefix_pop = ref([]);
const postfix_pop = ref([]);


const togglePrefix = (event, index) => {
    prefix_pop.value[index].toggle(event);
}

const togglePostfix = (event, index) => {
    postfix_pop.value[index].toggle(event);
}

</script>
