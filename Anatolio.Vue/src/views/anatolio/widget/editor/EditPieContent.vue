<template>
    <div v-if="content.contentType === 'PieContent'" class="grid grid-cols-12 gap-4">
        <!-- Key Column -->
        <div class="col-span-3">
            <FormField label="Key Column">
                <Select v-model="content.pieContent.keyColumn" optionValue="name" optionLabel="name"
                    :options="content.query?.queryColumns ?? []" />
            </FormField>
        </div>

        <!-- Is Multiple Value -->
        <div class="col-span-2">
            <FormField label="Is Multiple Value">
                <Checkbox v-model="content.pieContent.isMultipleValue" />
            </FormField>
        </div>

        <!-- Value Column -->
        <div class="col-span-3">
            <FormField label="Value Column">
                <Select v-model="content.pieContent.valueColumn" optionValue="name" optionLabel="name"
                    :options="content.query?.queryColumns ?? []" />
            </FormField>
        </div>

        <!-- Value Columns -->
        <div class="col-span-3">
            <FormField label="Value Columns">
                <Select v-model="content.pieContent.valueColumns" optionValue="name" optionLabel="name"
                    :options="content.query?.queryColumns ?? []" multiple />
            </FormField>
        </div>

        <!-- Postfix -->
        <div class="col-span-3">
            <FormField label="Postfix">
                <InputText v-model="content.pieContent.postfix" />
            </FormField>
        </div>

        <!-- Pie Type -->
        <div class="col-span-3">
            <FormField label="Pie Type">
                <Enum v-model="content.pieContent.pieType" type="PieType" />
            </FormField>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    content: {
        type: Object,
        required: true
    }
});

</script>