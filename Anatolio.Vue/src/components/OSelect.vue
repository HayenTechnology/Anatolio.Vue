<template>
    <!-- eslint-disable-next-line -->
    <Select  showClear v-model="localValue" :options="selectOptions" :disabled="disabled" :class="class" :placeholder="placeholder" :optionLabel="'value'" :optionValue="'key'" @change="updateValue" :filter="true" @filter="filterData" filterLocale="tr-TR">
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
                default: false // Varsayılan olarak 'InputText' kullan, ancak istenilen herhangi bir bileşeni destekler
            },
            class: String,
            placeholder: String
        },
        data() {
            return {
                localValue: null,
                filterChanhed: false,
                selectOptions: [],
                foundedValue: [],
                delayTimer: null
            };
        },
        created() {
            this.localValue = this.modelValue;
            this.InputInit();
        },
        watch: {
            modelValue(n, o) {
                this.localValue = n;

                this.InputInit();
            },
            'settings.filter': function (n, o) {
                this.filterChanhed = true;
                this.InputInit();
            }
        },
        methods: {
            InputInit() {
                if (this.filterChanhed == true || this.selectOptions.find((s) => s.key == this.modelValue) == null) {
                    var filter = '';
                    if (this.filterChanhed == false && this.modelValue) {
                        var val = this.modelValue;
                        if (typeof this.modelValue === 'string') {
                            val = "'" + this.modelValue + "'";
                        }


                        filter = this.settings.key + " eq " + val;
                    }

                    this.filterChanhed = false;

                    this.get(filter);
                } else {
                    this.$emit('update:selectedData', this.foundedValue.find((s) => s[this.settings.key] == this.modelValue));
                }
            },
            updateValue(event) {
                this.localValue = event.value;
                this.$emit('update:modelValue', event.value);
                this.$emit(
                    'update:selectedData',
                    this.foundedValue.find((s) => s[this.settings.key] == event.value)
                );
            },
            filterData(event) {
                var filter =
                    '(contains(tolower(' + this.settings.value + "),tolower('" + event.value + "')) "
                    + "or contains(tolower(" + this.settings.value + "),tolower('" + event.value.replaceAll('ı', 'I') + "')) "
                    + "or contains(tolower(" + this.settings.value + "),tolower('" + event.value.replaceAll('İ', 'i') + "')) "
                    + "or contains(tolower(" + this.settings.value + "),tolower('" + event.value.replaceAll('ı', 'i') + "')) "
                    + "or contains(tolower(" + this.settings.value + "),tolower('" + event.value.replaceAll('I', 'ı') + "')) "
                    + "or contains(tolower(" + this.settings.value + "),tolower('" + event.value.replaceAll('I', 'i') + "')) ";

                if (this.settings.header) {
                    filter +=
                        ' or contains(tolower(' + this.settings.header + "),tolower('" + event.value + "'))"
                        + " or contains(tolower(" + this.settings.header + "),tolower('" + event.value.replaceAll('ı', 'I') + "')) "
                        + " or contains(tolower(" + this.settings.header + "),tolower('" + event.value.replaceAll('ı', 'i') + "')) "
                        + " or contains(tolower(" + this.settings.header + "),tolower('" + event.value.replaceAll('İ', 'i') + "')) "
                        + " or contains(tolower(" + this.settings.header + "),tolower('" + event.value.replaceAll('I', 'ı') + "')) "
                        + " or contains(tolower(" + this.settings.header + "),tolower('" + event.value.replaceAll('I', 'i') + "')) )";
                } else {
                    filter += ')';
                }

                var getMethod = this.get;
                clearTimeout(this.delayTimer);
                this.delayTimer = setTimeout(function () {
                    getMethod(filter, true);
                }, 350);
            },
            resolve(path, obj = self, separator = '/') {
                if (!path) {
                    return null;
                }
                if (!obj) {
                    return null;
                }
                var properties = Array.isArray(path) ? path : path.split(separator);
                return properties.reduce((prev, curr) => prev?.[curr], obj);
            },
            get(filter, queried = false) {
                if (this.settings.filter) {
                    filter = filter == '' ? this.settings.filter : filter + ' and ' + this.settings.filter;
                }

                filter = filter == '' ? '' : '&$filter= ' + filter;

                return axios.get(this.settings.url + '$top=10&$orderby=' + this.settings.value + ' asc' + filter).then((response) => {
                    var result = response.data.value.find((s) => s[this.settings.key] == this.modelValue);
                    if ((result == undefined || result == null) && this.modelValue && !queried) {
                        return;
                    }
                    this.foundedValue = response.data.value;
                    this.selectOptions = response.data.value.map((s) => {
                        var value = this.resolve(this.settings.value, s) + ' ' + (this.settings.select ? '(' + (this.resolve(this.settings.select, s) ?? '') + ')' : '');

                        var header = this.settings.header ? s[this.settings.header] : null;

                        return { key: s[this.settings.key], value: value, header: header };
                    });

                    this.$emit('update:selectedData', result);

                    return response.data;
                });
            }
        }
    };
</script>
