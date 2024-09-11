<template>
    <div v-for="(declare, index) in declares">
        <Fieldset>
            <template #legend>
                <FormField :hideLabel="true" label="Input Name" fieldName="inputName" :errors="errors">
                    <template v-slot:default="prp">
                        <InputGroup>
                            <InputText v-model="declare.inputName" :invalid="prp.invalid"
                                :placeholder="prp.placeholder">
                            </InputText>
                            <Button icon="pi pi-trash" class="p-button-danger " @click="remove(index)"
                                outlined></Button>
                        </InputGroup>
                    </template>
                </FormField>
            </template>
            <div class="flex flex-col space-y-4">
                <!-- First Row -->
                <div class="flex space-x-4">

                    <FormField class="w-2/12" label="Data Type" fieldName="type" :errors="errors">
                        <template v-slot:default="prp">
                            <Enum v-model="declare.type" type="AnatolioDataType" :invalid="prp.invalid"
                                :placeholder="prp.placeholder">
                            </Enum>
                        </template>
                    </FormField>
                    <FormField class="w-3/12" label="Input Type" fieldName="input" :errors="errors">
                        <template v-slot:default="prp">
                            <Enum v-model="declare.input" type="InputType" :invalid="prp.invalid"
                                :placeholder="prp.placeholder">
                            </Enum>
                        </template>
                    </FormField>
                    <FormField class="w-2/12" label="Multiple" fieldName="multiple" :errors="errors"
                        v-if="declare.input === 'EnumSelect' || declare.input === 'EntitySelect'">
                        <template v-slot:default="prp">
                            <Checkbox v-model="declare.multiple" :binary="true" :invalid="prp.invalid"
                                :placeholder="prp.placeholder">
                            </Checkbox>
                        </template>
                    </FormField>
                    <FormField class="w-2/12" label="Visible" fieldName="visible" :errors="errors">
                        <template v-slot:default="prp">
                            <Checkbox v-model="declare.visible" :binary="true" :invalid="prp.invalid"
                                :placeholder="prp.placeholder"></Checkbox>
                        </template>
                    </FormField>
                    <FormField class="w-2/12" label="Show On Widgets" fieldName="showOnWidgets" :errors="errors">
                        <template v-slot:default="prp">
                            <Checkbox v-model="declare.showOnWidgets" :binary="true" :invalid="prp.invalid"
                                :placeholder="prp.placeholder"></Checkbox>
                        </template>
                    </FormField>
                </div>


                <!-- Conditional Rows Based on Input Type -->
                <div v-if="declare.input === 'Text' || declare.input === 'Number' || declare.input === 'Checkbox'">
                    <FormField class="w-6/12" label="Declare Name" fieldName="value1.name" :errors="errors">
                        <template v-slot:default="prp">
                            <InputText v-model="declare.value1.name" :invalid="prp.invalid"
                                :placeholder="prp.placeholder">
                            </InputText>
                        </template>
                    </FormField>
                </div>

                <div v-if="declare.input === 'Date' || declare.input === 'DateTime'" class="flex space-x-4">
                    <FormField class="w-1/3" label="Declare Name" fieldName="value1.name" :errors="errors">
                        <template v-slot:default="prp">
                            <InputText v-model="declare.value1.name" :invalid="prp.invalid"
                                :placeholder="prp.placeholder">
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
                            <InputText v-model="declare.value1.name" :invalid="prp.invalid"
                                :placeholder="prp.placeholder">
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
                        <FormField class="w-1/6" label="Start Period Type" fieldName="value1.periodType"
                            :errors="errors">
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
                            <InputText v-model="declare.value1.name" :invalid="prp.invalid"
                                :placeholder="prp.placeholder">
                            </InputText>
                        </template>
                    </FormField>
                    <FormField class="w-1/4" label="Search Table" fieldName="value1.model" :errors="errors">
                        <template v-slot:default="prp">
                            <OSelect v-model="declare.value1.model" :invalid="prp.invalid"
                                :placeholder="prp.placeholder" :settings="{
                                    key: 'Url',
                                    url: '/api/ODataEntities?',
                                    value: 'Url'
                                }" v-model:selectedData="declare.value1.oDataSource">
                            </OSelect>
                        </template>
                    </FormField>
                    <FormField class="w-1/4" v-if="declare.value1.model" label="Filter Columns">
                        <template v-slot:default="prp">
                            <MultiSelect v-model="declare.value1.filters" :invalid="prp.invalid"
                                :options="declare.value1.oDataSource?.Properties ?? []" :placeholder="prp.placeholder"
                                :multiple="true"></MultiSelect>
                        </template>
                    </FormField>
                </div>
                <div v-if="declare.input === 'EnumSelect'" class="flex space-x-4">
                    <FormField class="w-1/4" label="Declare Name" fieldName="value1.name" :errors="errors">
                        <template v-slot:default="prp">
                            <InputText v-model="declare.value1.name" :invalid="prp.invalid"
                                :placeholder="prp.placeholder">
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
    </div>


    <div class="flex mt-4 justify-center items-center">
        <div @click="addDeclare"
            class="border-2 border-dashed border-primary-300 rounded-lg p-10 text-center max-w-lg  hover:bg-primary-100">
            <h2 v-if="!props.declares.length" class="text-lg font-semibold text-gray-600 mb-4">{{ $t(
                'No filters added yet') }}</h2>
            <p class="text-gray-600 mb-4">{{ $t('Click to add new filter') }}
            </p>
            <i class="pi pi-search-plus text-primary-300" style="font-size: 2.5rem"></i>
        </div>
    </div>

</template>

<script setup>
import { useConfirm } from "primevue/useconfirm";
import { ref } from 'vue';

const confirm = useConfirm();


const props = defineProps({
    declares: {
        type: Array,
        required: true,
        default: []
    }
});

const addDeclare = () => {
    props.declares.push({
        inputName: 'Field',
        type: 'Text',
        input: 'Text',
        multiple: false,
        visible: true,
        showOnWidgets: true,
        value1: {
            model: '',
            name: '',
            periodValue: -2,
            periodType: 'Day',
            oDataSource: {}
        },
        value2: {
            model: '',
            name: '',
            periodValue: 2,
            periodType: 'Day'
        },
        declareParentEntity: {
            selector: '',
            foreignKey: '',
            secondSelector: '',
            secondForeignKey: ''
        }
    });
}

const remove = (index) => {
    props.declares.splice(index, 1)

}

const confirm2 = (event, index) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Do you want to delete this record?',
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: () => {
            props.declares.splice(index, 1)
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
};
const errors = ref({});
</script>