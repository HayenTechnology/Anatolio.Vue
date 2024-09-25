<template>
    <div v-if="content.contentType === 'InfoContent'" class="grid grid-cols-12 gap-4">
        <!-- Add Column Buttons -->
        <div class="col-span-12 text-center">
            <Button @click="addTableColumn" icon="pi pi-plus" text :label="$t('Add Visible Column')" />
            <hr />
        </div>

        <!-- Columns List -->
        <div class="col-span-12" v-for="(col, index) in content.dataContent.columns" :key="index">
            <div class="grid grid-cols-12 gap-4">
                <div class="col-span-2"></div>
                <!-- Icon (only for InfoContent) -->
                <div class="col-span-4">
                    <FormField label="Icon">
                        <template #default="prp">
                            <InputGroup>
                                <Enum v-model="col.icon" :placeholder="prp.placeholder" :invalid="prp.invalid"
                                    :showClear=false type="PrimeIcon" />
                                <Enum v-model="col.contentColorString" type="PrimeColor" :invalid="prp.invalid"
                                    :showClear=false />
                            </InputGroup>
                        </template>
                    </FormField>
                </div>
                <div class="col-span-4">

                    <FormField label="Value Column">
                        <InputGroup>
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
    props.content.dataContent.columns.push({ name: '', alignRight: false, description: '', icon: 'pi pi-plus', contentColorString: 'green' });
};

// Delete a column by index
const deleteColumn = (index) => {
    props.content.dataContent.columns.splice(index, 1);
};
</script>
