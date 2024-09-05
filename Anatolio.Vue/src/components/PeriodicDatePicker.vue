<template>
    <DatePicker v-model="internalDate" :selectionMode="range ? 'range' : 'single'" :showTime="showTime" :view="view"
                :dateFormat="dateFormat" :manualInput="false" :placeholder="placeholder" :invalid="invalid"></DatePicker>
</template>

<script setup>
    import { add } from 'date-fns';
    import { defineEmits, onMounted, ref, watch } from 'vue';

    const emit = defineEmits([
        'update:modelValue'
    ])
    const props = defineProps({
        modelValue: {
            type: [Date, Array],
            default: () => ([])
        },
        options: {
            type: Object,
            default: null
        },
        range: {
            type: Boolean,
            default: false
        },
        showTime: {
            type: Boolean,
            default: false
        },
        view: {
            type: String,
            default: 'date'
        },
        dateFormat: {
            type: String,
            default: 'dd/mm/yy'
        },
        placeholder: {
            type: String,
            default: ''
        },
        invalid: {
            type: Boolean,
            default: false
        }
    });

    const periodTypeMap = {
        'Second': 'seconds',
        'Minute': 'minutes',
        'Hour': 'hours',
        'Day': 'days',
        'Week': 'weeks',
        'Month': 'months',
        'Year': 'years'
    };

    // DatePicker'e bağlanacak internal date state
    const internalDate = ref(props.modelValue);

    onMounted(() => {
        setDate();
    })

    // calculateDate fonksiyonu
    const calculateDate = (periodValue, periodType) => {
        if (periodValue !== undefined && periodType !== undefined) {
            const options = { [periodTypeMap[periodType]]: periodValue };
            return add(new Date(), options);
        }
        return null;
    };

    // setDate fonksiyonu
    const setDate = () => {
        if (props.range && props.options) {
            const startDate = calculateDate(props.options.startPeriodValue, props.options.startPeriodType);
            const endDate = calculateDate(props.options.endPeriodValue, props.options.endPeriodType);
            internalDate.value = [startDate, endDate];
        } else if (props.options) {
            const date = calculateDate(props.options.periodValue, props.options.periodType);
            internalDate.value = date;
        }
    };


    // Değerler değiştiğinde yeniden hesaplamak için watch kullanımı
    watch(
        () => props.options,
        (n, o) => {
            if (JSON.stringify(n) !== JSON.stringify(o)) {
                setDate()
            }
        },
        { deep: true }
    );

    watch(internalDate, (newDate) => {
        emit('update:modelValue', newDate);
    });

</script>
