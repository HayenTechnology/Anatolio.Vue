<template>
    <Fieldset>
        <template #legend>
            <FormField :hideLabel="true" label="Input Name" fieldName="inputName" :errors="errors">
                <template v-slot:default="prp">
                    <InputGroup>
                        <InputText v-model="declare.inputName" :invalid="prp.invalid" :placeholder="prp.placeholder">
                        </InputText>
                        <Button icon="pi pi-trash" class="p-button-danger " outlined />
                    </InputGroup>
                </template>
            </FormField>
        </template>
        <div class="flex flex-col space-y-4">
            <!-- First Row -->
            <div class="flex space-x-4">

                <FormField class="w-1/6" label="Data Type" fieldName="type" :errors="errors">
                    <template v-slot:default="prp">
                        <Enum v-model="declare.type" type="AnatolioDataType" :invalid="prp.invalid"
                            :placeholder="prp.placeholder">
                        </Enum>
                    </template>
                </FormField>
                <FormField class="w-1/4" label="Input Type" fieldName="input" :errors="errors">
                    <template v-slot:default="prp">
                        <Enum v-model="declare.input" type="InputType" :invalid="prp.invalid"
                            :placeholder="prp.placeholder">
                        </Enum>
                    </template>
                </FormField>
                <FormField class="w-1/6" label="Multiple" fieldName="multiple" :errors="errors"
                    v-if="declare.input === 'EnumSelect' || declare.input === 'EntitySelect'">
                    <template v-slot:default="prp">
                        <Checkbox v-model="declare.multiple" :binary="true" :invalid="prp.invalid"
                            :placeholder="prp.placeholder">
                        </Checkbox>
                    </template>
                </FormField>
                <FormField class="w-1/6" label="Visible" fieldName="visible" :errors="errors">
                    <template v-slot:default="prp">
                        <Checkbox v-model="declare.visible" :binary="true" :invalid="prp.invalid"
                            :placeholder="prp.placeholder"></Checkbox>
                    </template>
                </FormField>
                <FormField class="w-1/6" label="Show On Widgets" fieldName="showOnWidgets" :errors="errors">
                    <template v-slot:default="prp">
                        <Checkbox v-model="declare.showOnWidgets" :binary="true" :invalid="prp.invalid"
                            :placeholder="prp.placeholder"></Checkbox>
                    </template>
                </FormField>
            </div>


            <!-- Conditional Rows Based on Input Type -->
            <div v-if="declare.input === 'Text' || declare.input === 'Number' || declare.input === 'Checkbox'">
                <FormField class="w-1/2" label="Declare Name" fieldName="value1.name" :errors="errors">
                    <template v-slot:default="prp">
                        <InputText v-model="declare.value1.name" :invalid="prp.invalid" :placeholder="prp.placeholder">
                        </InputText>
                    </template>
                </FormField>
            </div>

            <div v-if="declare.input === 'Date' || declare.input === 'DateTime'" class="flex space-x-4">
                <FormField class="w-1/3" label="Declare Name" fieldName="value1.name" :errors="errors">
                    <template v-slot:default="prp">
                        <InputText v-model="declare.value1.name" :invalid="prp.invalid" :placeholder="prp.placeholder">
                        </InputText>
                    </template>
                </FormField>
                <FormField class="w-1/6" label="Period" fieldName="value1.periodValue" :errors="errors">
                    <template v-slot:default="prp">
                        <InputNumber v-model="declare.value1.periodValue" :invalid="prp.invalid"
                            :placeholder="prp.placeholder" fluid />
                    </template>
                </FormField>
                <FormField class="w-1/6" label="Period Type" fieldName="value1.periodType" :errors="errors">
                    <template v-slot:default="prp">
                        <Enum v-model="declare.value1.periodType" type="PeriodType" :invalid="prp.invalid"
                            :placeholder="prp.placeholder"></Enum>
                    </template>
                </FormField>
            </div>

            <!-- Similar structure for other input types (Month, Year, DateTime, etc.) -->
            <div v-if="declare.input === 'Month' || declare.input === 'Year'" class="flex space-x-4">
                <FormField class="w-1/3" label="Declare Name" fieldName="value1.name" :errors="errors">
                    <template v-slot:default="prp">
                        <InputText v-model="declare.value1.name" :invalid="prp.invalid" :placeholder="prp.placeholder">
                        </InputText>
                    </template>
                </FormField>
                <FormField class="w-1/6" label="Period" fieldName="value1.periodValue" :errors="errors">
                    <template v-slot:default="prp">
                        <InputNumber v-model="declare.value1.periodValue" :invalid="prp.invalid"
                            :placeholder="prp.placeholder"></InputNumber>
                    </template>
                </FormField>
            </div>

            <div v-if="declare.input === 'DateRange' || declare.input === 'DateTimeRange'"
                class="flex flex-col space-y-4">
                <div class="flex space-x-4">
                    <FormField class="w-1/3" label="Start Declare Name" fieldName="value1.name" :errors="errors">
                        <template v-slot:default="prp">
                            <InputText v-model="declare.value1.name" :invalid="prp.invalid"
                                :placeholder="prp.placeholder">
                            </InputText>
                        </template>
                    </FormField>
                    <FormField class="w-1/6" label="Start Period" fieldName="value1.periodValue" :errors="errors">
                        <template v-slot:default="prp">
                            <InputNumber v-model="declare.value1.periodValue" :invalid="prp.invalid"
                                :placeholder="prp.placeholder" fluid />
                        </template>
                    </FormField>
                    <FormField class="w-1/6" label="Start Period Type" fieldName="value1.periodType" :errors="errors">
                        <template v-slot:default="prp">
                            <Enum v-model="declare.value1.periodType" type="PeriodType" :invalid="prp.invalid"
                                :placeholder="prp.placeholder"></Enum>
                        </template>
                    </FormField>
                </div>
                <div class="flex space-x-4">
                    <FormField class="w-1/3" label="End Declare Name" fieldName="value2.name" :errors="errors">
                        <template v-slot:default="prp">
                            <InputText v-model="declare.value2.name" :invalid="prp.invalid"
                                :placeholder="prp.placeholder">
                            </InputText>
                        </template>
                    </FormField>
                    <FormField class="w-1/6" label="End Period" fieldName="value2.periodValue" :errors="errors">
                        <template v-slot:default="prp">
                            <InputNumber v-model="declare.value2.periodValue" :invalid="prp.invalid"
                                :placeholder="prp.placeholder" fluid />
                        </template>
                    </FormField>
                    <FormField class="w-1/6" label="End Period Type" fieldName="value2.periodType" :errors="errors">
                        <template v-slot:default="prp">
                            <Enum v-model="declare.value2.periodType" type="PeriodType" :invalid="prp.invalid"
                                :placeholder="prp.placeholder"></Enum>
                        </template>
                    </FormField>
                </div>
            </div>

            <div v-if="declare.input === 'EntitySelect'" class="flex flex-wrap space-x-4">
                <FormField class="w-1/4" label="Declare Name" fieldName="value1.name" :errors="errors">
                    <template v-slot:default="prp">
                        <InputText v-model="declare.value1.name" :invalid="prp.invalid" :placeholder="prp.placeholder">
                        </InputText>
                    </template>
                </FormField>
                <FormField class="w-1/4" label="Search Table" fieldName="value1.model" :errors="errors">
                    <template v-slot:default="prp">
                        <OSelect v-model="declare.value1.model" :invalid="prp.invalid" :placeholder="prp.placeholder"
                            :settings="{
                key: 'name',
                url: '/api?',
                value: 'url'
            }">
                        </OSelect>
                    </template>
                </FormField>
                <FormField class="w-1/4" v-if="declare.value1.model">
                    <template v-slot:default="prp">
                        <OSelect v-model="declare.value1.filters" :invalid="prp.invalid" :placeholder="prp.placeholder"
                            :settings="{ data: declare.value1.oDataSource.properties, multiple: true }"></OSelect>
                    </template>
                </FormField>
            </div>
            <div v-if="declare.input === 'EnumSelect'" class="flex space-x-4">
                <FormField class="w-1/4" label="Declare Name" fieldName="value1.name" :errors="errors">
                    <template v-slot:default="prp">
                        <InputText v-model="declare.value1.name" :invalid="prp.invalid" :placeholder="prp.placeholder">
                        </InputText>
                    </template>
                </FormField>
                <FormField class="w-1/4" label="Enum" fieldName="value1.enum" :errors="errors">
                    <template v-slot:default="prp">
                        <Enum v-model="declare.value1.enum" type="EnumTypes" :invalid="prp.invalid"
                            :placeholder="prp.placeholder">
                        </Enum>
                    </template>
                </FormField>
            </div>
        </div>
    </Fieldset>

</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    declare: {
        type: Object,
        required: true,
        default: {
            inputName: '',
            type: null,
            input: null,
            multiple: false,
            visible: true,
            showOnWidgets: true,
            value1: {
                name: '',
                periodValue: 0,
                periodType: ''
            },
            value2: {
                name: '',
                periodValue: 0,
                periodType: ''
            },
            declareParentEntity: {
                selector: '',
                foreignKey: '',
                secondSelector: '',
                secondForeignKey: ''
            }
        }
    }
});

const errors = ref({});
</script>