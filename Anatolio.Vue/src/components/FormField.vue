<template>



    <div class="field" v-if="fieldType=='field'">
        <b v-if="!hideLabel">{{ $t(finalLabel) }}</b>

        <div class="p-inputgroup w-full">
            <component :is="inputType" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)"
                       :placeholder="$t(description??finalLabel)"
                       :class="{'p-invalid': errors[fieldName], 'w-full': true}" @update:selectedData="$emit('update:selectedData', $event)" @change="$emit('change')"
                       v-bind="$props" />
            <slot></slot>
        </div>

        <small class="p-error" v-if="errors[fieldName]">{{ $t(errors[fieldName][0], { field: $t(finalLabel) }) }}</small>
    </div>
    <div class="field" v-else-if="fieldType=='float'">
        <div class="p-float-label">
            <component :is="inputType" :id="fieldName" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)"
                       :placeholder="$t(description??finalLabel)"
                       :class="{'p-invalid': errors[fieldName], 'w-full': true}" @update:selectedData="$emit('update:selectedData', $event)"  @change="$emit('change')"
                       v-bind="$props" />
            <slot></slot>
            <label :for="fieldName">{{ $t(finalLabel) }}</label>
        </div>
        <small class="p-error" v-if="errors[fieldName]">{{ $t(errors[fieldName][0], { field: $t(finalLabel) }) }}</small>
    </div>
    <div class="field grid" v-else>
        <b v-if="!hideLabel" :for="fieldName" class="col-12 mb-2 md:col-4 md:mb-0">{{ $t(finalLabel) }}</b>
        <div :class="{'col-12 md:col-8':!hideLabel,'col-12':hideLabel}">
            <div class="p-inputgroup w-full">
                <component :is="inputType" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)"
                           :placeholder="$t(description??finalLabel)"
                           :class="{'p-invalid': errors[fieldName], 'w-full': true}" @update:selectedData="$emit('update:selectedData', $event)"  @change="$emit('change')"
                           v-bind="$props" />
                <slot></slot>
            </div>
            <small class="p-error" v-if="errors[fieldName]">{{ $t(errors[fieldName][0], { field: $t(finalLabel) }) }}</small>
        </div>
    </div>


</template>

<script>
    import HelperService from "../services/HelperService";
    import { watch, ref } from "vue";
    export default {
        inheritAttrs: false,
        inheritProps: false,
        props: {
            label: String,
            fieldName: String,
            inputType: {
                type: String,
                default: 'InputText' // Varsayýlan olarak 'InputText' kullan, ancak istenilen herhangi bir bileþeni destekler
            },
            modelValue: [String, Number, Object, Boolean], // v-model için model deðeri
            errors: {
                type: Object,
                default: () => ({})
            },
            fieldType: {
                type: String,
                default: "field"
            },
            hideLabel: {
                type: Boolean,
                default: false
            },
            settings: {
                type: Object,
                default: () => ({})
            },
            disabled: { 
                default: false // Varsayýlan olarak 'InputText' kullan, ancak istenilen herhangi bir bileþeni destekler
            },
            mode: {
                type: String,
                default: "decimal"
            },
            currency: {
                type: String,
                default: "TRY"
            },
            locale: {
                type: String,
                default: "tr-TR"
            },
            type: {
                type: String,
                default: "text"
            },
            description: {
                type: String,
            },
            options: {
                type: Array,
                default: () => []
            },
            optionLabel: {
                type: String,
            },
            optionValue: {
                type: String,
            },
            viewOnly: {
                type: Boolean,
            },
            addOnBlur: {
                type: Boolean,
            },
            separator: {
                type: String,
                default: ","
            },
            //prefix: {
            //    type: String,
            //    default: null
            //},
            maxFractionDigits: {
                type: Number,
                default: 2
            },
            suffix: {
                type: String,
                default:null
            },
            binary: {
                type: Boolean,
                default: false
            }
        },
        setup(props) {
            const helper = new HelperService();
            const finalLabel = helper.parseCamelCase(props.label ?? props.fieldName ?? "empty_text");

            return { finalLabel }
        }
    };
</script>
