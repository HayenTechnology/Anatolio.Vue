<template>
    <div class="table-responsive p-7">
        <DataTable :value="content.dataContent.datas">
            <Column v-for="(col, colIndex) in content.dataContent.columns" :key="colIndex" :field="col.name"
                :header="$t(col.name)" />
        </DataTable>
    </div>
</template>

<script>

export default {
    props: {
        content: Object
    },
    methods: {

    }
};
</script>