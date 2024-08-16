<script>
import axios from 'axios';

export default {
    props: {
        modelValue: null,
        settings: {},
        selectedData: { SerialNumber: '' }
    },
    data() {
        return {
            currentData: {},
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
                    filter = this.settings.key + " eq " + this.modelValue + "";
                }

                this.filterChanhed = false;

                this.get(filter);
            }
        },

        get(filter, queried = false) {
            if (this.settings.filter) {
                filter = filter == '' ? this.settings.filter : filter + ' and ' + this.settings.filter;
            }

            filter = filter == '' ? '' : '&$filter= ' + filter;

            return axios.get(this.settings.url + '$select=' + this.settings.value + ',' + this.settings.key + '&$top=1' + filter).then((response) => {
                console.log(response.data);

                var result = response.data.value.find((s) => s[this.settings.key] == this.modelValue);
                if ((result == undefined || result == null) && this.modelValue && !queried) {
                    return;
                }

                this.currentData = result ?? {};

                return response.data;
            });
        }
    }
};
</script>
<template>
    <span v-if="Object.keys(currentData).indexOf(settings.value) > -1">
        {{ currentData[settings.value] }}
    </span>
</template>
