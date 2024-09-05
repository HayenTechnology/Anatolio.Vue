<template>
    <!-- Text input örneği sabit kaldı -->
    <FormField :label="declare.inputName" fieldName="value1.default" :errors="errors">
        <template v-slot:default="prp">

            <PeriodicDatePicker v-if="declare.input === 'Date'" v-model="date"
                :options="{ periodValue: declare.value1.periodValue, periodType: declare.value1.periodType }"
                :invalid="prp.invalid" :placeholder="prp.placeholder">
            </PeriodicDatePicker>
            <PeriodicDatePicker v-else-if="declare.input === 'Month'" v-model="date" view="month" dateFormat="mm/yy"
                :options="{ periodValue: declare.value1.periodValue }" :invalid="prp.invalid"
                :placeholder="prp.placeholder">
            </PeriodicDatePicker>
            <PeriodicDatePicker v-else-if="declare.input === 'Year'" v-model="date" view="year" dateFormat="yy"
                :options="{ periodValue: declare.value1.periodValue }" :invalid="prp.invalid"
                :placeholder="prp.placeholder">
            </PeriodicDatePicker>
            <PeriodicDatePicker v-else-if="declare.input === 'DateTime'" v-model="date" showTime hourFormat="24"
                :options="{ periodValue: declare.value1.periodValue, periodType: declare.value1.periodType }"
                :invalid="prp.invalid" :placeholder="prp.placeholder">
            </PeriodicDatePicker>
            <PeriodicDatePicker v-else-if="declare.input === 'DateRange'" v-model="dateRange" range :options="{
        startPeriodValue: declare.value1.periodValue,
        startPeriodType: declare.value1.periodType,
        endPeriodValue: declare.value2.periodValue,
        endPeriodType: declare.value2.periodType
    }" :invalid="prp.invalid" :placeholder="prp.placeholder">
            </PeriodicDatePicker>
            <PeriodicDatePicker v-else-if="declare.input === 'DateTimeRange'" v-model="dateRange" range showTime
                hourFormat="24" :options="{
        startPeriodValue: declare.value1.periodValue,
        startPeriodType: declare.value1.periodType,
        endPeriodValue: declare.value2.periodValue,
        endPeriodType: declare.value2.periodType
    }" :invalid="prp.invalid" :placeholder="prp.placeholder">
            </PeriodicDatePicker>
            <OSelect v-else-if="declare.input === 'EntitySelect' && declare.value1.model"
                v-model="declare.value1.default" :settings="{
        key: 'Id',
        url: '/api/' + declare.value1.model + '?$select=Name,Id&',
        value: declare.value1.filters ?? 'Name',
        onlySelect: true
    }" :invalid="prp.invalid" :placeholder="prp.placeholder"></OSelect>
            <Enum v-else-if="declare.input === 'EnumSelect'" v-model="declare.value1.default"
                :type="declare.value1.enum || 'EnumTypes'" :multiple="declare.multiple" :invalid="prp.invalid"
                :placeholder="prp.placeholder"></Enum>
            <Checkbox v-else-if="declare.input === 'Checkbox'" v-model="declare.value1.default" :binary="true"
                :invalid="prp.invalid" :placeholder="prp.placeholder">
            </Checkbox>
            <InputNumber v-else-if="declare.input === 'Number'" v-model="declare.value1.default" :invalid="prp.invalid"
                :placeholder="prp.placeholder">
            </InputNumber>
            <InputText v-else v-model="declare.value1.default" :invalid="prp.invalid" :placeholder="prp.placeholder">
            </InputText>
        </template>
    </FormField>

</template>

<script setup>
import { ref, watch } from 'vue';

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

const dateRange = ref([new Date(props.declare.value1.default), new Date(props.declare.value2.default)]);
const date = ref(new Date(props.declare.value1.default));

watch(dateRange, (newValue) => {
    console.log(newValue);
    props.declare.value1.default = newValue[0];
    props.declare.value2.default = newValue[1];
})
watch(date, (newValue) => {
    console.log(newValue);
    props.declare.value1.default = newValue;
})
const errors = ref({});
</script>
