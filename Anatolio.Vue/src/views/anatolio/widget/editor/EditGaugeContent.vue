<template>
    <div v-if="content.contentType === 'GaugeContent'" class="grid grid-cols-12 gap-4">
        <!-- Key Column -->
        <div class="md:col-span-4 col-span-12">
            <div class="col-span-12 text-center">
                <Button @click="addColorRange" disabled text :label="$t('Value Info')" />
                <hr />
            </div>
            <!-- Color Ranges -->
            <div class="col-span-12">
                <div class="grid grid-cols-12 gap-4">

                    <div class="col-span-12">

                        <FormField label="Value Column">
                            <InputGroup>
                                <Select v-model="content.gaugeContent.valueColumn" optionValue="name" optionLabel="name"
                                    :options="content.query?.queryColumns ?? []" />
                                <InputGroupAddon @click="togglePostfix">
                                    {{ content.gaugeContent.postfix ?? 'pos' }}
                                </InputGroupAddon>
                                <Popover ref="postfix_pop">
                                    <div class="flex flex-col gap-4">
                                        <FormField label="Enter Postfix" fieldName="postfix" :errors="errors">
                                            <template #default="prp">
                                                <InputText v-model="content.gaugeContent.postfix"
                                                    :placeholder="prp.placeholder" :invalid="prp.invalid" />
                                            </template>
                                        </FormField>
                                    </div>
                                </Popover>
                            </InputGroup>
                        </FormField>
                    </div>

                </div>
            </div>
        </div>

        <!-- Postfix -->
        <div class="md:col-span-8 col-span-12 grid grid-cols-12">
            <!-- Add Color Range Buttons -->
            <div class="col-span-12 text-center">
                <Button @click="addColorRange" icon="pi pi-plus" text :label="$t('Add Color Range')" />
                <hr />
            </div>
            <!-- Color Ranges -->
            <div class="col-span-12" v-for="(col, index) in content.gaugeContent.colorRanges" :key="index">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-3"></div>

                    <div class="md:col-span-6 col-span-12">
                        <FormField label="Range Info">
                            <InputGroup>
                                <InputGroupAddon>
                                    <ColorPicker v-model="col.contentColorString" />
                                </InputGroupAddon>
                                <InputText v-model="col.to" />
                                <InputGroupAddon @click="deleteColorRange(index)">
                                    <i class="pi pi-trash text-red-500"></i>
                                </InputGroupAddon>
                            </InputGroup>
                        </FormField>
                    </div>

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

// Add a new color range
const addColorRange = () => {
    props.content.gaugeContent.colorRanges.push({ name: '', from: 0, to: 100, contentColorString: 'FF0000' });
};

// Delete a color range by index
const deleteColorRange = (index) => {
    props.content.gaugeContent.colorRanges.splice(index, 1);
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
