<template>
    <!-- Text input örneği sabit kaldı -->
    <div v-if="declare.input === 'Text'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <InputText v-model="declare.value1.default" :invalid="prp.invalid" :placeholder="prp.placeholder">
                </InputText>
            </template>
        </FormField>
    </div>

    <!-- Date input -->
    <div v-if="declare.input === 'Date'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <PeriodicDatePicker v-model="declare.value1.default"
                    :options="{ periodValue: declare.value1.periodValue, periodType: declare.value1.periodType }"
                    :invalid="prp.invalid" :placeholder="prp.placeholder">
                </PeriodicDatePicker>
            </template>
        </FormField>
    </div>

    <!-- Month input -->
    <div v-if="declare.input === 'Month'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <PeriodicDatePicker v-model="declare.value1.default" view="month" dateFormat="mm/yy"
                    :options="{ periodValue: declare.value1.periodValue }" :invalid="prp.invalid"
                    :placeholder="prp.placeholder">
                </PeriodicDatePicker>
            </template>
        </FormField>
    </div>

    <!-- Year input -->
    <div v-if="declare.input === 'Year'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <PeriodicDatePicker v-model="declare.value1.default" view="year" dateFormat="yy"
                    :options="{ periodValue: declare.value1.periodValue }" :invalid="prp.invalid"
                    :placeholder="prp.placeholder">
                </PeriodicDatePicker>
            </template>
        </FormField>
    </div>

    <!-- DateTime input -->
    <div v-if="declare.input === 'DateTime'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <PeriodicDatePicker v-model="declare.value1.default" showTime hourFormat="24"
                    :options="{ periodValue: declare.value1.periodValue, periodType: declare.value1.periodType }"
                    :invalid="prp.invalid" :placeholder="prp.placeholder">
                </PeriodicDatePicker>
            </template>
        </FormField>
    </div>

    <!-- DateRange input -->
    <div v-if="declare.input === 'DateRange'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <PeriodicDatePicker v-model="dateRange" range :options="{
        startPeriodValue: declare.value1.periodValue,
        startPeriodType: declare.value1.periodType,
        endPeriodValue: declare.value2.periodValue,
        endPeriodType: declare.value2.periodType
    }" :invalid="prp.invalid" :placeholder="prp.placeholder">
                </PeriodicDatePicker>
            </template>
        </FormField>
    </div>

    <!-- DateTimeRange input -->
    <div v-if="declare.input === 'DateTimeRange'">
        <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
            <template v-slot:default="prp">
                <PeriodicDatePicker v-model="dateRange" range showTime hourFormat="24" :options="{
        startPeriodValue: declare.value1.periodValue,
        startPeriodType: declare.value1.periodType,
        endPeriodValue: declare.value2.periodValue,
        endPeriodType: declare.value2.periodType
    }" :invalid="prp.invalid" :placeholder="prp.placeholder">
                </PeriodicDatePicker>
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
        default: () => ({
            inputName: 'Field',
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
            }
        })
    }
});

const dateRange = ref([null, null]);
const errors = ref({});
</script>
