<template>

    <span v-if="viewOnly">
        <Tag v-if="!soft" style="padding-right: 10px" :severity="$enums[type].find(s=>s.value==modelValue)?.severity??'contrast'">
            <i v-if="$enums[type].find(s=>s.value==modelValue)?.icon" :class="$enums[type].find(s=>s.value==modelValue)?.icon" style="padding-right:10px"></i>&nbsp;
            {{ $t(modelValue??"") }}
        </Tag>
        <span  v-else style="padding-right: 10px" class="text-xs text-400"  >
            <i v-if="$enums[type].find(s=>s.value==modelValue)?.icon" :class="$enums[type].find(s=>s.value==modelValue)?.icon" style="padding-right:10px"></i>&nbsp;
            {{ $t(modelValue??"") }}
        </span>
    </span>

    <Dropdown v-else :model-value="modelValue" :disabled="disabled" @update:model-value="$emit('update:modelValue', $event)" :class="class" :placeholder="placeholder" @change="$emit('change')" :options="$enums[type]" :showClear="showClear" optionLabel="name" optionValue="value">
        <template #value="slotProps">
            <div v-if="slotProps.value" class="flex align-items-center">
                <div>{{ $t(slotProps.value) }}</div>
            </div>
            <span v-else>
                {{ slotProps.placeholder }}
            </span>
        </template>
        <template #option="slotProps">
            <div class="flex align-items-center">

                <Tag style="padding-right: 10px" v-if="slotProps.option.severity" :severity="slotProps.option.severity??'contrast'">
                    <i v-if="slotProps.option.icon" :class="slotProps.option.icon" style="padding-right:10px"></i>&nbsp; {{ $t(slotProps.option.name) }}
                </Tag>
                <div v-else>
                    <i v-if="slotProps.option.icon" :class="slotProps.option.icon"></i>&nbsp;
                    {{ $t(slotProps.option.name) }}
                </div>
            </div>
        </template>
    </Dropdown>
</template>

<script>
    export default {
        inheritAttrs: false,
        inheritProps: false,
        props: {
            modelValue: [String, Number, Object], // Dropdown için modelValue genellikle bir nesne ya da bir string/number olabilir.
            type: {
                type: String,
                required: true
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
                default:true
            }
        }
    };
</script>