<template>
    <div v-if="content.contentType === 'ChartContent'" class="grid grid-cols-12 gap-4">
        <!-- Chart Options Column -->
        <div class="col-span-4">
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 text-center">
                    <button class="btn btn-sm btn-light-dark" disabled>{{ $t('Chart Options') }}</button>
                    <hr />
                </div>

                <!-- X Axis Column -->
                <div class="col-span-12">
                    <FormField label="X Axis Column">
                        <Select v-model="content.chartContent.xColumn" optionValue="name" optionLabel="name"
                            :options="content.query?.queryColumns ?? []" />
                    </FormField>
                </div>

                <!-- Show Axes -->
                <div class="col-span-6">
                    <FormField label="Show Axes">
                        <Checkbox v-model="content.chartContent.showAxes" :binary="true" />
                    </FormField>
                </div>

                <!-- Stacked -->
                <div class="col-span-6">
                    <FormField label="Stacked">
                        <Checkbox v-model="content.chartContent.stacked" :binary="true" />
                    </FormField>
                </div>

                <!-- Horizontal -->
                <div class="col-span-6">
                    <FormField label="Horizontal">
                        <Checkbox v-model="content.chartContent.horizontal" :binary="true" />
                    </FormField>
                </div>

                <!-- MultipleY (shown if YColumns length > 1) -->
                <div class="col-span-6" v-if="content.chartContent.yColumns.length > 1">
                    <FormField label="Multiple Y">
                        <Checkbox v-model="content.chartContent.multipleY" :binary="true" />
                    </FormField>
                </div>
            </div>
        </div>

        <!-- Y Axis Columns Management -->
        <div class="col-span-8">
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 text-center">
                    <button @click="addYColumn" class="btn btn-primary">{{ $t('Add Y Axis Column') }}</button>
                    <hr />
                    <button v-if="!content.chartContent.yColumns.length" @click="addYColumn" class="btn btn-primary">
                        {{ $t('Add First Y Axis Column') }}
                    </button>
                </div>

                <!-- Y Columns List -->
                <div class="col-span-12" v-for="(yColumn, index) in content.chartContent.yColumns" :key="index">
                    <div class="grid grid-cols-12 gap-4">
                        <!-- Y Axis Column -->
                        <div class="col-span-3">
                            <FormField label="Y Axis Column">
                                <Select v-model="yColumn.name" optionValue="name" optionLabel="name"
                                    :options="content.query?.queryColumns ?? []" />
                            </FormField>
                        </div>

                        <!-- Postfix -->
                        <div class="col-span-2">
                            <FormField label="Postfix">
                                <InputText v-model="yColumn.postfix" />
                            </FormField>
                        </div>

                        <!-- Content Color -->
                        <div class="col-span-3">
                            <FormField label="Content Color">
                                <InputGroup>
                                    <InputGroupAddon>
                                        <ColorPicker v-model="yColumn.contentColorString" />
                                    </InputGroupAddon>
                                </InputGroup>
                            </FormField>
                        </div>

                        <!-- Chart Type -->
                        <div class="col-span-2">
                            <FormField label="Chart Type">
                                <Enum v-model="yColumn.chartType" type="AnatolioChartType" :showClear=false />
                            </FormField>
                        </div>

                        <!-- Delete Button -->
                        <div class="col-span-2 text-center">
                            <Button @click="deleteYColumn(index)" class="p-button-danger mt-5" text
                                icon="pi pi-trash" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    content: {
        type: Object,
        required: true
    }
});

const addYColumn = () => {
    props.content.chartContent.yColumns.push({ name: '', postfix: '', contentColorString: '', chartType: 'line' });
};

const deleteYColumn = (index) => {
    props.content.chartContent.yColumns.splice(index, 1);
};
</script>