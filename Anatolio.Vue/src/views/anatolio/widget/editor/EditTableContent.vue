<template>
    <div v-if="content.contentType === 'TableContent'" class="grid grid-cols-12 gap-4">
        <!-- Add Column Buttons -->
        <div class="col-span-12 text-center">
            <Button @click="addTableColumn" icon="pi pi-plus" text :label="$t('Add Visible Column')" />
            <hr />
        </div>

        <!-- Columns List -->
        <div class="col-span-12" v-for="(col, index) in content.dataContent.columns" :key="index">
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-3"></div>
                <div class="col-span-6">

                    <FormField label="Value Column">
                        <InputGroup>
                            <InputGroupAddon v-tooltip.top="$t('Align Right')">
                                <Checkbox v-model="col.alignRight" :binary="true" />
                            </InputGroupAddon>
                            <Select v-model="col.name" optionValue="name" optionLabel="name"
                                :options="content.query?.queryColumns ?? []" />

                            <InputGroupAddon @click="togglePostfix($event, index)">
                                {{ col.postfix ?? 'pos' }}
                            </InputGroupAddon>
                            <Popover ref="postfix_pop">
                                <div class="flex flex-col gap-4">
                                    <FormField label="Enter Postfix" fieldName="postfix" :errors="errors">
                                        <template #default="prp">
                                            <InputText v-model="col.postfix" :placeholder="prp.placeholder"
                                                :invalid="prp.invalid" />
                                        </template>
                                    </FormField>
                                </div>
                            </Popover>
                            <InputGroupAddon @click="deleteColumn(index)">
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
const postfix_pop = ref(null);


const togglePostfix = (event, index) => {
    postfix_pop.value[index].toggle(event);
}

// Add a new column
const addTableColumn = () => {
    props.content.dataContent.columns.push({ name: '', alignRight: false, description: '', icon: '', contentColorString: '' });
};

// Delete a column by index
const deleteColumn = (index) => {
    props.content.dataContent.columns.splice(index, 1);
};
</script>
