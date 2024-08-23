<template>

    <div v-if="declare.input === 'Text'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <InputText v-model="declare.value1.default" :invalid="prp.invalid" :placeholder="prp.placeholder">
                </InputText>
            </template>
        </FormField>
    </div>

    <div v-if="declare.input === 'Date'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <DatePicker v-model="declare.value1.default"
                    :options="{ periodValue: declare.value1.periodValue, periodType: declare.value1.periodType }"
                    :invalid="prp.invalid" :placeholder="prp.placeholder"></DatePicker>
            </template>
        </FormField>
    </div>

    <div v-if="declare.input === 'Month'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <DatePicker v-model="declare.value1.default" view="month" dateFormat="mm/yy"
                    :options="{ periodValue: declare.value1.periodValue }" :invalid="prp.invalid"
                    :placeholder="prp.placeholder"></DatePicker>
            </template>
        </FormField>
    </div>

    <div v-if="declare.input === 'Year'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <DatePicker v-model="declare.value1.default" view="year" dateFormat="yy"
                    :options="{ periodValue: declare.value1.periodValue }" :invalid="prp.invalid"
                    :placeholder="prp.placeholder"></DatePicker>
            </template>
        </FormField>
    </div>

    <div v-if="declare.input === 'DateTime'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <DatePicker v-model="declare.value1.default" showTime hourFormat="24"
                    :options="{ periodValue: declare.value1.periodValue, periodType: declare.value1.periodType }"
                    :invalid="prp.invalid" :placeholder="prp.placeholder"></DatePicker>
            </template>
        </FormField>
    </div>

    <div v-if="declare.input === 'DateRange'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <DatePicker v-model="declare.default" selectionMode="range" :manualInput="false"
                    :options="{ startPeriodValue: declare.value1.periodValue, startPeriodType: declare.value1.periodType, endPeriodValue: declare.value2.periodValue, endPeriodType: declare.value2.periodType }"
                    :invalid="prp.invalid" :placeholder="prp.placeholder"></DatePicker>
            </template>
        </FormField>
    </div>

    <div v-if="declare.input === 'DateTimeRange'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <DatePicker v-model="declare.default" showTime hourFormat="24" selectionMode="range"
                    :manualInput="false"
                    :options="{ startPeriodValue: declare.value1.periodValue, startPeriodType: declare.value1.periodType, endPeriodValue: declare.value2.periodValue, endPeriodType: declare.value2.periodType }"
                    :invalid="prp.invalid" :placeholder="prp.placeholder"></DatePicker>
            </template>
        </FormField>
    </div>

    <div v-if="declare.input === 'EntitySelect'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <OSelect v-model="declare.value1.default" :settings="{
        key: 'Id',
        url: '/api/' + declare.value1.model + '?',
        value: 'Name'
    }" :invalid="prp.invalid" :placeholder="prp.placeholder"></OSelect>
            </template>
        </FormField>
    </div>

    <div v-if="declare.input === 'EnumSelect'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <Enum v-model="declare.value1.default" :type="declare.value1.enum || 'EnumTypes'"
                    :multiple="declare.multiple" :invalid="prp.invalid" :placeholder="prp.placeholder"></Enum>
            </template>
        </FormField>
    </div>

    <div v-if="declare.input === 'Checkbox'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <Checkbox v-model="declare.value1.default" :binary="true" :invalid="prp.invalid"
                    :placeholder="prp.placeholder">
                </Checkbox>
            </template>
        </FormField>
    </div>

    <div v-if="declare.input === 'Number'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <InputText v-model="declare.value1.default" :invalid="prp.invalid" :placeholder="prp.placeholder">
                </InputText>
            </template>
        </FormField>
    </div>

</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    declare: {
        type: Object,
        required: true,
        default: {
            inputName: 'Field',
            type: null,
            input: null,
            multiple: false,
            visible: true,
            showOnWidgets: true,
            value1: {
                name: '',
                periodValue: '',
                periodType: ''
            },
            value2: {
                name: '',
                periodValue: '',
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