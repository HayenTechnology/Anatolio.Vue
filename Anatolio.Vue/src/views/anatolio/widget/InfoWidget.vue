<template>
    <div class="p-7 bg-white">
        <div class="grid grid-cols-2 gap-4">
            <div v-for="(col, colIndex) in content.dataContent.columns" :key="colIndex" class="flex items-center">
                <div class="symbol symbol-45 mr-4" :style="{ backgroundColor: col.contentColorString }">
                    <i :class="col.icon"></i>
                </div>
                <div>
                    <div class="text-lg font-bold">{{ content.dataContent.data[col.name] }} {{ col.postfix }}</div>
                    <div class="text-muted text-sm">{{ $t(col.name) }}</div>
                </div>
            </div>
        </div>
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