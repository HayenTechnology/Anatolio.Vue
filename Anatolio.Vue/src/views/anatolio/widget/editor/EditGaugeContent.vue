<template>
    <div v-if="content.contentType === 'GaugeContent'" class="grid grid-cols-12 gap-4">
        <!-- Key Column -->
        <div class="col-span-4">
            <FormField label="Value Column">
                <Select v-model="content.gaugeContent.valueColumn" optionValue="name" optionLabel="name"
                        :options="content.query?.queryColumns ?? []" />
            </FormField>
        </div>

        <!-- Postfix -->
        <div class="col-span-4">
            <FormField label="Postfix">
                <InputText v-model="content.gaugeContent.postfix" />
            </FormField>
        </div>
         
        <!-- Add Color Range Buttons -->
        <div class="col-span-12 text-center">
            <Button @click="addColorRange" icon="pi pi-plus" text :label="$t('Add Color Range')"/>
            <hr />
            <Button v-if="!content.gaugeContent.colorRanges.length" @click="addColorRange" class=" ">
                {{ $t('Add First Color') }}
            </Button>
        </div>

        <!-- Color Ranges -->
        <div class="col-span-12" v-for="(col, index) in content.gaugeContent.colorRanges" :key="index">
            <div class="grid grid-cols-12 gap-4">
                <!-- Name -->
                <!--<div class="col-span-2">
        <FormField label="Name">
            <InputText v-model="col.name" />
        </FormField>
    </div>-->
                <div class="col-span-4 ">
                    <FormField label="Range Info">
                        <InputGroup>
                            <InputGroupAddon>
                                <ColorPicker v-model="col.contentColorString" />
                            </InputGroupAddon>
                            <InputText v-model="col.to" />
                            <InputGroupAddon>
                                <Button @click="deleteColorRange(index)" class="p-button-danger" text
                                        icon="pi pi-trash" />
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

    // Add a new color range
    const addColorRange = () => {
        props.content.gaugeContent.colorRanges.push({ name: '', from: 0, to: 100, contentColorString: 'FF0000' });
    };

    // Delete a color range by index
    const deleteColorRange = (index) => {
        props.content.gaugeContent.colorRanges.splice(index, 1);
    };
</script>
