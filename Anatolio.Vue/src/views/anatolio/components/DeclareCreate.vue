<template>
    <div class="flex flex-col space-y-4">
        <!-- First Row -->
        <div class="flex space-x-4">
            <div class="w-1/4">
                <FormField inputType="InputText" label="Input Name" fieldName="InputName" v-model="ioDeclare.InputName"
                    :errors="errors" />
            </div>
            <div class="w-1/6">
                <FormField inputType="Enum" label="Data Type" fieldName="Type" v-model="ioDeclare.Type" :errors="errors"
                    type="AnatolioDataType" />
            </div>
            <div class="w-1/4" v-if="ioDeclare.Type">
                <FormField inputType="Enum" label="Input Type" fieldName="Input" v-model="ioDeclare.Input"
                    :errors="errors" type="InputType" />
            </div>
            <div class="w-1/6" v-if="ioDeclare.Input === 'EnumSelect' || ioDeclare.Input === 'EntitySelect'">
                <FormField inputType="Checkbox" label="Multiple" fieldName="Multiple" v-model="ioDeclare.Multiple"
                    :binary="true" :errors="errors" />
            </div>
        </div>

        <!-- Second Row -->
        <div class="flex space-x-4">
            <div class="w-1/6">
                <FormField inputType="Checkbox" label="Visible" fieldName="Visible" v-model="ioDeclare.Visible"
                    :binary="true" :errors="errors" />
            </div>
            <div class="w-1/6">
                <FormField inputType="Checkbox" label="Show On Widgets" fieldName="ShowOnWidgets"
                    v-model="ioDeclare.ShowOnWidgets" :binary="true" :errors="errors" />
            </div>
        </div>

        <!-- Conditional Rows Based on Input Type -->
        <div v-if="ioDeclare.Input === 'Text'">
            <div class="w-1/2">
                <FormField inputType="InputText" label="Declare Name" fieldName="Value1.Name"
                    v-model="ioDeclare.Value1.Name" :errors="errors" />
            </div>
        </div>

        <div v-if="ioDeclare.Input === 'Date'" class="flex space-x-4">
            <div class="w-1/3">
                <FormField inputType="InputText" label="Declare Name" fieldName="Value1.Name"
                    v-model="ioDeclare.Value1.Name" :errors="errors" />
            </div>
            <div class="w-1/6">
                <FormField inputType="InputText" label="Period" fieldName="Value1.PeriodValue"
                    v-model="ioDeclare.Value1.PeriodValue" :errors="errors" />
            </div>
            <div class="w-1/6">
                <FormField inputType="Enum" label="Period Type" fieldName="Value1.PeriodType"
                    v-model="ioDeclare.Value1.PeriodType" :errors="errors" type="PeriodType" />
            </div>
        </div>

        <!-- Similar structure for other input types (Month, Year, DateTime, etc.) -->
        <div v-if="ioDeclare.Input === 'Month'" class="flex space-x-4">
            <div class="w-1/3">
                <FormField inputType="InputText" label="Declare Name" fieldName="Value1.Name"
                    v-model="ioDeclare.Value1.Name" :errors="errors" />
            </div>
            <div class="w-1/6">
                <FormField inputType="InputText" label="Period" fieldName="Value1.PeriodValue"
                    v-model="ioDeclare.Value1.PeriodValue" :errors="errors" />
            </div>
        </div>

        <div v-if="ioDeclare.Input === 'Year'" class="flex space-x-4">
            <div class="w-1/3">
                <FormField inputType="InputText" label="Declare Name" fieldName="Value1.Name"
                    v-model="ioDeclare.Value1.Name" :errors="errors" />
            </div>
            <div class="w-1/6">
                <FormField inputType="InputText" label="Period" fieldName="Value1.PeriodValue"
                    v-model="ioDeclare.Value1.PeriodValue" :errors="errors" />
            </div>
        </div>

        <div v-if="ioDeclare.Input === 'DateTime'" class="flex space-x-4">
            <div class="w-1/3">
                <FormField inputType="InputText" label="Declare Name" fieldName="Value1.Name"
                    v-model="ioDeclare.Value1.Name" :errors="errors" />
            </div>
            <div class="w-1/6">
                <FormField inputType="InputText" label="Period" fieldName="Value1.PeriodValue"
                    v-model="ioDeclare.Value1.PeriodValue" :errors="errors" />
            </div>
            <div class="w-1/6">
                <FormField inputType="Enum" label="Period Type" fieldName="Value1.PeriodType"
                    v-model="ioDeclare.Value1.PeriodType" :errors="errors" type="PeriodType" />
            </div>
        </div>

        <div v-if="ioDeclare.Input === 'DateRange'" class="flex flex-col space-y-4">
            <div class="flex space-x-4">
                <div class="w-1/3">
                    <FormField inputType="InputText" label="Start Declare Name" fieldName="Value1.Name"
                        v-model="ioDeclare.Value1.Name" :errors="errors" />
                </div>
                <div class="w-1/6">
                    <FormField inputType="InputText" label="Start Period" fieldName="Value1.PeriodValue"
                        v-model="ioDeclare.Value1.PeriodValue" :errors="errors" />
                </div>
                <div class="w-1/6">
                    <FormField inputType="Enum" label="Start Period Type" fieldName="Value1.PeriodType"
                        v-model="ioDeclare.Value1.PeriodType" :errors="errors" type="PeriodType" />
                </div>
            </div>
            <div class="flex space-x-4">
                <div class="w-1/3">
                    <FormField inputType="InputText" label="End Declare Name" fieldName="Value2.Name"
                        v-model="ioDeclare.Value2.Name" :errors="errors" />
                </div>
                <div class="w-1/6">
                    <FormField inputType="InputText" label="End Period" fieldName="Value2.PeriodValue"
                        v-model="ioDeclare.Value2.PeriodValue" :errors="errors" />
                </div>
                <div class="w-1/6">
                    <FormField inputType="Enum" label="End Period Type" fieldName="Value2.PeriodType"
                        v-model="ioDeclare.Value2.PeriodType" :errors="errors" type="PeriodType" />
                </div>
            </div>
        </div>

        <div v-if="ioDeclare.Input === 'EntitySelect'" class="flex flex-wrap space-x-4">
            <div class="w-1/4">
                <FormField inputType="InputText" label="Declare Name" fieldName="Value1.Name"
                    v-model="ioDeclare.Value1.Name" :errors="errors" />
            </div>
            <div class="w-1/4">
                <FormField inputType="OSelect" label="Search Table" fieldName="Value1.Model"
                    v-model="ioDeclare.Value1.Model" :errors="errors"
                    :settings="{ key: 'TypeName', url: '/odata/odatasources', values: ['TypeName'], selects: ['Url', 'Properties'] }" />
            </div>
            <div class="w-1/4" v-if="ioDeclare.Value1.Model">
                <FormField inputType="OSelect" label="Filter Columns" fieldName="Value1.Filters"
                    v-model="ioDeclare.Value1.Filters" :errors="errors"
                    :settings="{ data: ioDeclare.Value1.ODataSource.Properties, multiple: true }" />
            </div>
            <div class="w-1/4">
                <FormField inputType="InputText" label="Parent Entity Property Name"
                    fieldName="DeclareParentEntity.Selector" v-model="ioDeclare.DeclareParentEntity.Selector"
                    :errors="errors" />
            </div>
            <div class="w-1/4">
                <FormField inputType="InputText" label="Parent Entity Foreign Key"
                    fieldName="DeclareParentEntity.ForeignKey" v-model="ioDeclare.DeclareParentEntity.ForeignKey"
                    :errors="errors" />
            </div>
            <div class="w-1/4">
                <FormField inputType="InputText" label="Parent Entity Property Name"
                    fieldName="DeclareParentEntity.SecondSelector"
                    v-model="ioDeclare.DeclareParentEntity.SecondSelector" :errors="errors" />
            </div>
            <div class="w-1/4">
                <FormField inputType="InputText" label="Parent Entity Foreign Key"
                    fieldName="DeclareParentEntity.SecondForeignKey"
                    v-model="ioDeclare.DeclareParentEntity.SecondForeignKey" :errors="errors" />
            </div>
        </div>

        <div v-if="ioDeclare.Input === 'EnumSelect'" class="flex space-x-4">
            <div class="w-1/3">
                <FormField inputType="InputText" label="Declare Name" fieldName="Value1.Name"
                    v-model="ioDeclare.Value1.Name" :errors="errors" />
            </div>
            <div class="w-1/4">
                <FormField inputType="Enum" label="Enum" fieldName="Value1.Enum" v-model="ioDeclare.Value1.Enum"
                    :errors="errors" type="EnumTypes" />
            </div>
        </div>

        <div v-if="ioDeclare.Input === 'Checkbox'" class="w-1/2">
            <FormField inputType="InputText" label="Declare Name" fieldName="Value1.Name"
                v-model="ioDeclare.Value1.Name" :errors="errors" />
        </div>

        <div v-if="ioDeclare.Input === 'Number'" class="w-1/2">
            <FormField inputType="InputText" label="Declare Name" fieldName="Value1.Name"
                v-model="ioDeclare.Value1.Name" :errors="errors" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    ioDeclare: {
        type: Object,
        required: true,
        default: {
            InputName: '',
            Type: null,
            Input: null,
            Multiple: false,
            Visible: true,
            ShowOnWidgets: true,
            Value1: {
                Name: '',
                PeriodValue: '',
                PeriodType: ''
            },
            Value2: {
                Name: '',
                PeriodValue: '',
                PeriodType: ''
            },
            DeclareParentEntity: {
                Selector: '',
                ForeignKey: '',
                SecondSelector: '',
                SecondForeignKey: ''
            }
        }
    }
});

const errors = ref({});
</script>