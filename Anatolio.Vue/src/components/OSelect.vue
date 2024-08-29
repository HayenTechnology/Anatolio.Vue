<template>
    <!-- eslint-disable-next-line -->
    <Select showClear v-model="localValue" :options="selectOptions" :disabled="disabled" :class="class"
        :invalid="invalid" :placeholder="placeholder" :optionLabel="'value'" :optionValue="'key'" @change="updateValue"
        :filter="true" @filter="filterData" filterLocale="tr-TR">
        <template #option="slotProps">
            <div class="">
                <b v-if="slotProps.option.header">{{ slotProps.option.header }}</b>
                <br v-if="slotProps.option.header" />
                <div>{{ slotProps.option.value }}</div>
            </div>
        </template>
    </Select>
</template>

<script>
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';

export default {
    inheritAttrs: false,
    inheritProps: false,
    props: {
        modelValue: null,
        settings: Object,
        selectedData: {
            type: Object,
            default: () => ({}),
        },
        disabled: {
            default: false
        },
        invalid: {
            default: false
        },
        class: String,
        placeholder: String
    },
    setup(props, { emit }) {
        const localValue = ref(null);
        const filterChanged = ref(false);
        const selectOptions = ref([]);
        const foundedValue = ref([]);
        let delayTimer = null;

        const InputInit = () => {
            if (filterChanged.value || !selectOptions.value.find(s => s.key === props.modelValue)) {
                let filter = '';
                if (!filterChanged.value && props.modelValue) {
                    let val = props.modelValue;
                    if (typeof props.modelValue === 'string') {
                        val = `'${props.modelValue}'`;
                    }
                    filter = `${props.settings.key} eq ${val}`;
                }
                filterChanged.value = false;
                get(filter);
            } else {
                emit('update:selectedData', foundedValue.value.find(s => s[props.settings.key] === props.modelValue));
            }
        };

        const updateValue = (event) => {
            localValue.value = event.value;
            emit('update:modelValue', event.value);
            emit('update:selectedData', foundedValue.value.find(s => s[props.settings.key] === event.value));
        };

        const filterData = (event) => {
            let filter = `(contains(tolower(${props.settings.value}),tolower('${event.value}')) 
                    or contains(tolower(${props.settings.value}),tolower('${event.value.replaceAll('ı', 'I')}')) 
                    or contains(tolower(${props.settings.value}),tolower('${event.value.replaceAll('İ', 'i')}')) 
                    or contains(tolower(${props.settings.value}),tolower('${event.value.replaceAll('ı', 'i')}')) 
                    or contains(tolower(${props.settings.value}),tolower('${event.value.replaceAll('I', 'ı')}')) 
                    or contains(tolower(${props.settings.value}),tolower('${event.value.replaceAll('I', 'i')}'))`;

            if (props.settings.header) {
                filter += ` or contains(tolower(${props.settings.header}),tolower('${event.value}')) 
                        or contains(tolower(${props.settings.header}),tolower('${event.value.replaceAll('ı', 'I')}')) 
                        or contains(tolower(${props.settings.header}),tolower('${event.value.replaceAll('ı', 'i')}')) 
                        or contains(tolower(${props.settings.header}),tolower('${event.value.replaceAll('İ', 'i')}')) 
                        or contains(tolower(${props.settings.header}),tolower('${event.value.replaceAll('I', 'ı')}')) 
                        or contains(tolower(${props.settings.header}),tolower('${event.value.replaceAll('I', 'i')}'))`;
            }

            filter += ')';

            clearTimeout(delayTimer);
            delayTimer = setTimeout(() => {
                get(filter, true);
            }, 350);
        };

        const resolve = (path, obj = self, separator = '/') => {
            if (!path || !obj) return null;
            const properties = Array.isArray(path) ? path : path.split(separator);
            return properties.reduce((prev, curr) => prev?.[curr], obj);
        };

        const get = (filter, queried = false) => {
            if (props.settings.filter) {
                filter = filter ? `${filter} and ${props.settings.filter}` : props.settings.filter;
            }
            filter = filter ? `&$filter= ${filter}` : '';
            const url = `${props.settings.url}$top=10&$orderby=${props.settings.value} asc${filter}`;

            axios.get(url).then(response => {
                const result = response.value.find(s => s[props.settings.key] === props.modelValue);
                if ((!result && props.modelValue && !queried)) return;

                foundedValue.value = response.value;
                selectOptions.value = response.value.map(s => {
                    const value = resolve(props.settings.value, s) + ' ' +
                        (props.settings.select ? `(${resolve(props.settings.select, s) ?? ''})` : '');
                    const header = props.settings.header ? s[props.settings.header] : null;
                    return { key: s[props.settings.key], value, header };
                });

                emit('update:selectedData', result);
            });
        };

        watch(() => props.modelValue, () => {
            localValue.value = props.modelValue;
            InputInit();
        });

        watch(() => props.settings.filter, () => {
            filterChanged.value = true;
            InputInit();
        });

        onMounted(() => {
            localValue.value = props.modelValue;
            InputInit();
        });

        return {
            localValue,
            selectOptions,
            updateValue,
            filterData
        };
    }
};
</script>
