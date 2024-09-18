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
        <!--<div class="col-span-2">
            <FormField label="Is Multiple Value">
                <Checkbox v-model="content.pieContent.isMultipleValue" />
            </FormField>
        </div>-->
        <!-- Value Column -->
        <div class="col-span-3">
            <FormField label="Value Column">
                <InputGroup>
                    <Select v-model="content.pieContent.valueColumn" optionValue="name" optionLabel="name"
                            :options="content.query?.queryColumns ?? []" />
                    <InputGroupAddon @click="togglePostfix">
                        {{ content.pieContent.postfix ?? 'pos' }}
                    </InputGroupAddon>
                    <Popover ref="postfix_pop">
                        <div class="flex flex-col gap-4">
                            <FormField label="Enter Postfix" fieldName="postfix" :errors="errors">
                                <template #default="prp">
                                    <InputText v-model="content.pieContent.postfix"
                                               :placeholder="prp.placeholder" :invalid="prp.invalid" />
                                </template>
                            </FormField>
                        </div>
                    </Popover>
                </InputGroup>
            </FormField>
        </div>

        <!-- Value Columns -->
        <!--<div class="col-span-3">
            <FormField label="Value Columns">
                <Select v-model="content.pieContent.valueColumns" optionValue="name" optionLabel="name"
                    :options="content.query?.queryColumns ?? []" multiple />
            </FormField>
        </div>-->
        <!-- Postfix -->
        <!--<div class="col-span-3">
            <FormField label="Postfix">
                <InputText v-model="content.pieContent.postfix" />
            </FormField>
        </div>-->
        <!-- Pie Type -->
        <div class="col-span-3">
            <FormField label="Pie Type">
                <Enum v-model="content.pieContent.pieType" type="PieType" />
            </FormField>
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
    const prefix_pop = ref(null);
    const postfix_pop = ref(null);


    const togglePrefix = (event) => {
        prefix_pop.value.toggle(event);
    }
    const togglePostfix = (event) => {
        postfix_pop.value.toggle(event);
    }
</script>
