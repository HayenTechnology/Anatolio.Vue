<template>
    <div class="flex justify-between mb-4">
        <div>
            <span class="block text-muted-color font-medium mb-4">{{ content.statusContent.description ||
                'No Description' }}</span>
            <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
                {{ content.statusContent.prefix }} {{ data[content.statusContent.valueColumn] }} {{
                    content.statusContent.postfix }}
            </div>
        </div>
        <div class="flex items-center justify-center rounded-border"
            :class="'bg-' + content.statusContent.contentColorString + '-100 dark:bg-' + content.statusContent.contentColorString + '-400/10'"
            style="width: 2.5rem; height: 2.5rem">
            <i :class="content.statusContent.icon + ' text-' + content.statusContent.contentColorString + '-500'"
                class=" !text-xl"></i>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import QueryService from '../queryBuilder/QueryService';

const queryService = new QueryService();

const data = ref({})

const props = defineProps({
    content: Object
})


onBeforeMount(() => {

    queryService.get({
        id: props.content.queryId,
        declares: []
    }, (response) => {

        data.value = response[0] ?? {};

    })


})


console.log(props.content)

</script>
