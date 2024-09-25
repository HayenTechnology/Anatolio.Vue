<template>
    <div v-if="content.contentType === 'StatusContent'" class="grid grid-cols-12 gap-4">


        <!-- Description -->
        <div class="col-span-4">
            <FormField label="Description" fieldName="statusDescription" :errors="errors">
                <template #default="prp">
                    <InputText v-model="content.statusContent.description" :placeholder="prp.placeholder"
                               :invalid="prp.invalid" />
                </template>
            </FormField>
        </div>

        <!-- Value Column -->
        <div class="col-span-4">
            <FormField label="Value Column" fieldName="valueColumn" :errors="errors">
                <template #default="prp">
                    <InputGroup>
                        <InputGroupAddon @click="togglePrefix">
                            {{ content.statusContent.prefix ?? 'pre' }}
                        </InputGroupAddon>
                        <Popover ref="prefix_pop">
                            <div class="flex flex-col gap-4">
                                <FormField label="Enter Prefix" fieldName="prefix" :errors="errors">
                                    <template #default="prp">
                                        <InputText v-model="content.statusContent.prefix" :placeholder="prp.placeholder"
                                                   :invalid="prp.invalid" />
                                    </template>
                                </FormField>
                            </div>
                        </Popover>
                        <Select v-model="content.statusContent.valueColumn" optionValue="name" optionLabel="name"
                                :options="content.query?.queryColumns ?? []" :placeholder="prp.placeholder"
                                :invalid="prp.invalid" />
                        <InputGroupAddon @click="togglePostfix">
                            {{ content.statusContent.postfix ?? 'pos' }}
                        </InputGroupAddon>
                        <Popover ref="postfix_pop">
                            <div class="flex flex-col gap-4">
                                <FormField label="Enter Postfix" fieldName="postfix" :errors="errors">
                                    <template #default="prp">
                                        <InputText v-model="content.statusContent.postfix"
                                                   :placeholder="prp.placeholder" :invalid="prp.invalid" />
                                    </template>
                                </FormField>
                            </div>
                        </Popover>
                    </InputGroup>
                </template>
            </FormField>
        </div>

        <!-- Icon -->
        <div class="col-span-4">
            <FormField label="Icon" fieldName="icon" :errors="errors">
                <template #default="prp">
                    <InputGroup>
                        <Enum v-model="content.statusContent.icon" :placeholder="prp.placeholder" :invalid="prp.invalid"
                              :showClear=false type="PrimeIcon" />
                        <Enum v-model="content.statusContent.contentColorString" type="PrimeColor" :invalid="prp.invalid"
                              :showClear=false />
                    </InputGroup>

                </template>
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
    },
    errors: {
        type: Object,
        default: () => ({})
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
