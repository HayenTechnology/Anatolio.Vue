<template>
    <DataTable scrollable
               scrollHeight="550px"
               :value="tableData"
               :lazy="true"
               :paginator="true"
               class="p-datatable-gridlines"
               size="small"
               :rows="pageSize"
               ref="dt"
               dataKey="Id"
               :rowHover="true"
               v-model:filters="filters"
               filterDisplay="menu"
               :loading="loading"
               :filters="filters"
               responsiveLayout="scroll"
               :totalRecords="totalCount"
               resizableColumns
               :rowGroupMode="props.settings.rowGroupMode"
               :groupRowsBy="props.settings.groupRowsBy"
               columnResizeMode="expand"
               @page="onPage($event)"
               @sort="onSort($event)"
               @filter="onFilter($event)"
               :currentPageReportTemplate="$t('{totalRecords} records found from {first} to {last}')"
               paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
               :rowsPerPageOptions="[10, 20, 50, 100]">
        <template #header>
            <div class="flex justify-content-between flex-column sm:flex-row">
                <div>
                    <span class="p-input-icon-left mb-2 mr-2">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" :placeholder="$t('Keyword Search')" @input="debouncedSearch" style="width: 100%" />
                    </span>
                    <Button type="button" icon="pi pi-filter-slash" :label="$t('Clear')" class="p-button-outlined mb-2" @click="clearFilter()" />
                </div>
                <div>
                    <slot name="header"></slot>

                    <Button v-tooltip.top="$t('Excel Export')" severity="success"
                            icon="pi pi-file-excel"
                            iconPos="left"
                            class="p-button-outlined mb-2"
                            v-on:click="getExcel()" />
                </div>

            </div>
        </template>
        <template #empty>
            {{$t('No data found')}}
        </template>
        <template #loading>
            {{$t('Loading data. Please wait')}}
        </template>

        <slot></slot>

        <template #groupheader="slotProps">
            <slot name="groupheader" :slotProps="slotProps"></slot>
        </template>

    </DataTable>

</template>

<script setup>
    import { ref, onMounted, onBeforeMount, defineProps, watch, defineEmits } from 'vue';
    import axios from 'axios';
    import odata from '../services/OdataService';
    import ExportExcel from '../services/ExportExcel';
    import HelperService from '../services/HelperService';
    import { useRoute, useRouter } from 'vue-router';
    const route = useRoute();
    const router = useRouter();
    const helper = new HelperService();

    const emits = defineEmits(['changed']);

    const props = defineProps({
        settings: {
            type: Object,
            required: true,
            default: () => ({ sortField: 'Id' })
        },
        refresh: {
            type: Number,
            default: 0
        }
    });

    var pageSizeStore=parseInt(localStorage.getItem('pageSize')??'10');


    const dt = ref();
    const pageSize = ref(pageSizeStore??10);
    const totalCount = ref(0);
    const lazyParams = ref({
        first: 0,
        rows: pageSize,
        sortField: props.settings.sortField ?? 'Id',
        sortOrder: -1
    });

    const tableData = ref(null);
    const filters = ref(null);
    const loading = ref(false);

    onBeforeMount(() => {
        initFilters();
        initParams();
    });
    onMounted(() => {
        get();
    });
    watch(() => props.settings.refresh, (newVal, oldVal) => {

        for (var prp in props.settings.filters) {
            if (props.settings.filters[prp].value !== null || props.settings.filters[prp].external) {
                lazyParams.value.filters[prp].value = props.settings.filters[prp].value;
            }
        }

        get();


    }, { deep: true });


    const initParams = () => {
        const dataString = route.query.lazyParams;
        try {
            lazyParams.value = dataString ? JSON.parse(dataString) : lazyParams.value;
            lazyParams.value.filters = lazyParams.value.filters ?? props.settings.filters;
            filters.value = dataString ? lazyParams.value.filters : filters.value;
        } catch (error) {
            console.error("JSON parsing error:", error);
        }
    };
    const initFilters = () => {
        filters.value = props.settings.filters;
    };

    const clearFilter = () => {
        filters.value['global'].value = null;
        initFilters();
        onFilter();
    };
    const get = () => {


        var urlparams = new odata().createOdataQuery(lazyParams.value);

        var seachQuery = new odata().createSearchQuery(lazyParams.value);

        emits('changed', seachQuery);

        axios.get(props.settings.odataUrl + urlparams, { loading: loading }).then((response) => {
            tableData.value = response.data.value;
            totalCount.value = response.data['@odata.count'];

            if (!props.settings.ignoreParams) {
                router.replace(`${route.path}?lazyParams=${encodeURIComponent(JSON.stringify(lazyParams.value))}`);
            }

        });
    };

    const onPage = (event) => {


        lazyParams.value = event;
        get();
    
        localStorage.setItem('pageSize',event.rows)
    
    
    };
    const onSort = (event) => {
        lazyParams.value = event;
        get();
    };
    const onFilter = () => {
        lazyParams.value.filters = filters.value;
        lazyParams.value.first = 0;
        get();
    };

    const onColReorder = () => {
        // toast.add({ severity: 'success', summary: 'Column Reordered', life: 3000 });
    };

    const debouncedSearch = helper.debounce(onFilter, 350);

    const getExcel = () => {
        const titles = [];
        dt.value.columns.forEach((title) => {
            titles.push({ data: title.props.field, title: title.props.header });
        });


        var urlparams = new odata().createOdataQuery(lazyParams.value, true);


        axios.get(props.settings.odataUrl + urlparams, { loading }).then((response) => {

            try {
                var filename = "file_" +
                    new Date().getTime() +
                    ".xlsx";
                var flattenMap = response.data.value.map((s) =>
                    new ExportExcel().flatten(s, true, titles)
                );
                // eslint-disable-next-line no-undef
                var ws = XLSX.utils.json_to_sheet(flattenMap);
                // eslint-disable-next-line no-undef
                var wb = XLSX.utils.book_new();
                // eslint-disable-next-line no-undef
                XLSX.utils.book_append_sheet(wb, ws, "Veri");
                // eslint-disable-next-line no-undef
                XLSX.writeFile(wb, filename);
            } catch (ex) {
                console.log(ex);
            }

        });

    }
</script>
