<template>

    <span v-if="viewOnly">
        <Tag v-if="!soft" style="padding-right: 10px" :severity="getEnum()?.severity ?? 'contrast'">
            <i v-if="getEnum()?.icon" :class="getEnum()?.icon" style="padding-right:10px"></i>&nbsp;
            {{ $t(modelValue ?? "") }}
        </Tag>
        <span v-else style="padding-right: 10px" class="text-xs text-400">
            <i v-if="getEnum()?.color" :class="getColor(getEnum()?.color)" class="pi pi-circle-fill"></i>

            <i v-if="getEnum()?.icon" :class="getEnum()?.icon" style="padding-right:10px"></i>&nbsp;
            {{ $t(modelValue ?? "") }}
        </span>
    </span>

    <Select v-else :model-value="modelValue" :disabled="disabled"
        @update:model-value="$emit('update:modelValue', $event)" :class="class" :placeholder="placeholder"
        @change="$emit('change')" :options="$enums[type]" :showClear="showClear" optionLabel="name" :filter="true"
        :optionValue="number ? 'number' : 'value'">
        <template #value="slotProps">
            <div v-if="slotProps.value" class="flex align-items-center">
                <i v-if="getEnum(slotProps.value)?.color" :class="getColor(getEnum(slotProps.value)?.color)"
                    class="pi pi-circle-fill mt-1"></i>
                <i v-if="getEnum(slotProps.value)?.icon" :class="getEnum(slotProps.value)?.icon" class="mt-1"></i>

                <div> &nbsp;&nbsp;
                    {{ $t(getEnum(slotProps.value)?.name ?? slotProps.value) }}
                </div>
            </div>
            <span v-else>
                {{ slotProps.placeholder }}
            </span>
        </template>
        <template #option="slotProps">
            <div class="flex align-items-center">

                <Tag style="padding-right: 10px" v-if="slotProps.option.severity"
                    :severity="slotProps.option.severity ?? 'contrast'">
                    <i v-if="slotProps.option.icon" :class="slotProps.option.icon" style="padding-right:10px"></i>&nbsp;
                    {{ $t(slotProps.option.name) }}
                </Tag>
                <div v-else>
                    <i v-if="slotProps.option.color" :class="getColor(slotProps.option.color)"
                        class="pi pi-circle-fill"></i>
                    <i v-if="slotProps.option.icon" :class="slotProps.option.icon"></i>&nbsp;
                    <span> {{ $t(slotProps.option.name) }}</span>
                </div>
            </div>
        </template>
    </Select>
</template>

<script setup>
import enums from '@/helper/enums';
const props = defineProps({
    modelValue: [String, Number, Object], // Dropdown i�in modelValue genellikle bir nesne ya da bir string/number olabilir.
    type: {
        type: String,
        required: true
    },
    number: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: ""
    },
    disabled: {
        default: false
    },
    viewOnly: {
        type: Boolean,
        default: false
    },
    soft: {
        type: Boolean,
        default: false
    },
    class: {
        type: String,
        default: ""
    },
    showClear: {
        type: Boolean,
        default: true
    }
})
const getColor = (color) => {

    var value = {}
    if (!color) {
        return value;
    }
    value['text-' + color] = true;
    return value;
}

const getEnum = (val) => {

    var value = val ?? props.modelValue

    return enums[props.type].find(s => s.value == value || s.number == value)
}

</script>
