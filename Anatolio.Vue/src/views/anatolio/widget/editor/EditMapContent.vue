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
                <div class="col-span-2">
                    <FormField label="Prefix">
                        <InputText v-model="col.prefix" />
                    </FormField>
                </div>

                <!-- Column Name -->
                <div class="col-span-4">
                    <FormField label="Column">
                        <Select v-model="col.name" optionValue="name" optionLabel="name"
                            :options="content.query?.queryColumns ?? []" />
                    </FormField>
                </div>

                <!-- Postfix -->
                <div class="col-span-2">
                    <FormField label="Postfix">
                        <InputText v-model="col.postfix" />
                    </FormField>
                </div>

                <!-- Content Color -->
                <div class="col-span-2">
                    <FormField label="Content Color">
                        <ColorPicker v-model="col.contentColorString" />
                    </FormField>
                </div>

                <!-- Delete Button -->
                <div class="col-span-2 text-center">
                    <button @click="deleteDescriptionColumn(index)" class="btn btn-danger">{{ $t('Delete') }}</button>
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
                <!-- Name -->
                <div class="col-span-2">
                    <FormField label="Name">
                        <InputText v-model="col.name" />
                    </FormField>
                </div>

                <!-- Start Value -->
                <div class="col-span-2">
                    <FormField label="Start Value">
                        <InputText v-model="col.from" />
                    </FormField>
                </div>

                <!-- End Value -->
                <div class="col-span-2">
                    <FormField label="End Value">
                        <InputText v-model="col.to" />
                    </FormField>
                </div>

                <!-- Content Color -->
                <div class="col-span-2">
                    <FormField label="Content Color">
                        <ColorPicker v-model="col.contentColorString" />
                    </FormField>
                </div>

                <!-- Delete Button -->
                <div class="col-span-2 text-center">
                    <button @click="deleteColorRange(index)" class="btn btn-danger">{{ $t('Delete') }}</button>
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
    props.content.mapContent.descriptionColumns.push({ prefix: '', name: '', postfix: '', contentColorString: 'ff0000' });
};

const deleteDescriptionColumn = (index) => {
    props.content.mapContent.descriptionColumns.splice(index, 1);
};

const addColorRange = () => {
    props.content.mapContent.colorRanges.push({ name: '', from: '', to: '', contentColorString: 'ff0000' });
};

const deleteColorRange = (index) => {
    props.content.mapContent.colorRanges.splice(index, 1);
};
</script>
