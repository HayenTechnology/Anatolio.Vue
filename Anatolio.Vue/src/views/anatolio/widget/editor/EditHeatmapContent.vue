<template>
    <div v-if="content.contentType === 'HeatmapContent'" class="grid grid-cols-12 gap-4">
        <!-- Key Column -->
        <div class="col-span-4">
            <FormField label="Key Column">
                <InputGroup>
                    <InputGroupAddon v-tooltip.top="$t('horizontal')">
                        <Checkbox v-model="content.heatmapContent.horizontal" :binary="true" />
                    </InputGroupAddon>
                    <Select v-model="content.heatmapContent.keyColumn" optionValue="name" optionLabel="name"
                        :options="content.query.queryColumns" />
                    <InputGroupAddon @click="togglePostfix">
                        {{ content.heatmapContent.postfix ?? 'pos' }}
                    </InputGroupAddon>
                    <Popover ref="postfix_pop">
                        <div class="flex flex-col gap-4">
                            <FormField label="Enter Postfix" fieldName="postfix" :errors="errors">
                                <template #default="prp">
                                    <InputText v-model="content.heatmapContent.postfix" :placeholder="prp.placeholder"
                                        :invalid="prp.invalid" />
                                </template>
                            </FormField>
                        </div>
                    </Popover>
                </InputGroup>
            </FormField>
        </div>
        <!-- Add Color Range Buttons -->
        <div class="col-span-12 text-center">
            <Button @click="addColorRange" text icon="pi pi-plus" :label="$t('Add Color Range')"> </Button>
            <hr />
        </div>

        <!-- Color Ranges -->
        <div class="col-span-12">
            <div class="grid grid-cols-12 gap-4">

                <div class="col-span-2 " v-for="(col, index) in content.heatmapContent.colorRanges" :key="index">
                    <FormField label="Range Info">
                        <InputGroup>
                            <InputGroupAddon>
                                <ColorPicker v-model="col.contentColorString" />
                            </InputGroupAddon>
                            <InputGroupAddon @click="deleteColorRange(index)">
                                <i class="pi pi-trash text-red-500"></i>
                            </InputGroupAddon>
                        </InputGroup>
                    </FormField>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    content: {
        type: Object,
        required: true
    }
});


const addColorRange = () => {
    props.content.heatmapContent.colorRanges.push({ name: '', from: 0, to: 100, contentColorString: 'FF0000' });
};

// Delete a color range by index
const deleteColorRange = (index) => {
    props.content.heatmapContent.colorRanges.splice(index, 1);
};



const prefix_pop = ref(null);
const postfix_pop = ref(null);


const togglePrefix = (event) => {
    prefix_pop.value.toggle(event);
}
const togglePostfix = (event) => {
    postfix_pop.value.toggle(event);
}
</script>
