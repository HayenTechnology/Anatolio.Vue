<template>
    <div v-if="content.contentType === 'ChartContent'" class="grid grid-cols-12 gap-4">
        <!-- Chart Options Column -->
        <div class="col-span-4">
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 text-center">
                    <Button text disabled :label="$t('Chart Options')"> </Button>
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
                        <InputGroup>
                            <InputGroupAddon>
                                <Checkbox v-model="content.chartContent.showAxes" :binary="true" />
                            </InputGroupAddon>
                        </InputGroup>
                    </FormField>
                </div>

                <!-- Stacked -->
                <div class="col-span-6">
                    <FormField label="Stacked">
                        <InputGroup>
                            <InputGroupAddon>
                                <Checkbox v-model="content.chartContent.stacked" :binary="true" />
                            </InputGroupAddon>
                        </InputGroup>
                    </FormField>
                </div>

                <!-- Horizontal -->
                <div class="col-span-6">
                    <FormField label="Horizontal">
                        <InputGroup>
                            <InputGroupAddon>
                                <Checkbox v-model="content.chartContent.horizontal" :binary="true" />
                            </InputGroupAddon>
                        </InputGroup>
                    </FormField>
                </div>

                <!-- MultipleY (shown if YColumns length > 1) -->
                <div class="col-span-6" v-if="content.chartContent.yColumns.length > 1">
                    <FormField label="Multiple Y">
                        <InputGroup>
                            <InputGroupAddon>
                                <Checkbox v-model="content.chartContent.multipleY" :binary="true" />
                            </InputGroupAddon>
                        </InputGroup>
                    </FormField>
                </div>
            </div>
        </div>

        <!-- Y Axis Columns Management -->
        <div class="col-span-8">
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-12 text-center">
                    <Button @click="addYColumn" text icon="pi pi-plus" :label="$t('Add Y Axis Column')" />
                    <hr />
                </div>

                <!-- Y Columns List -->
                <div class="col-span-12" v-for="(yColumn, index) in content.chartContent.yColumns" :key="index">
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-2"></div>
                        <div class="col-span-4 ">
                            <FormField label="Y Axis Info">
                                <InputGroup>
                                    <InputGroupAddon>
                                        <ColorPicker v-model="yColumn.contentColorString" />
                                    </InputGroupAddon>
                                    <Select v-model="yColumn.name" optionValue="name" optionLabel="name"
                                        :options="content.query?.queryColumns ?? []" />
                                    <InputGroupAddon @click="togglePostfix($event, index)">
                                        {{ yColumn.postfix ?? 'pos' }}
                                    </InputGroupAddon>
                                    <Popover ref="postfix_pop">
                                        <div class="flex flex-col gap-4">
                                            <FormField label="Enter Postfix" fieldName="postfix" :errors="errors">
                                                <template #default="prp">
                                                    <InputText v-model="yColumn.postfix" :placeholder="prp.placeholder"
                                                        :invalid="prp.invalid" />
                                                </template>
                                            </FormField>
                                        </div>
                                    </Popover>
                                </InputGroup>
                            </FormField>
                        </div>


                        <!-- Chart Type -->
                        <div class="col-span-4">
                            <FormField label="Chart Type">
                                <InputGroup>
                                    <Enum v-model="yColumn.chartType" type="AnatolioChartType" :showClear=false />
                                    <InputGroupAddon @click="deleteYColumn(index)">
                                        <i class="pi pi-trash text-red-500"></i>
                                    </InputGroupAddon>
                                </InputGroup>
                            </FormField>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    content: {
        type: Object,
        required: true
    }
});

const addYColumn = () => {
    props.content.chartContent.yColumns.push({ name: '', postfix: null, contentColorString: 'ff0000', chartType: 'line' });
};

const deleteYColumn = (index) => {
    props.content.chartContent.yColumns.splice(index, 1);
};

const postfix_pop = ref([]);


const togglePostfix = (event, index) => {
    postfix_pop.value[index].toggle(event);
}
</script>
