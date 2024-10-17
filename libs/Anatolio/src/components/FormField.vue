<template>
    <div :class="class">
        <div class="flex flex-col" v-if="fieldType == 'field'">
            <label v-if="!hideLabel" :for="fieldName">{{ $t(finalLabel()) }} </label>
            <slot :invalid="errors[fieldName]" :placeholder="$t(finalLabel())"></slot>
            <small class="text-red-500" v-if="errors[fieldName]">
                {{
 $t(errors[fieldName][0], {
        field: $t(finalLabel())
    })
                }}
            </small>
        </div>
        <div v-else-if="fieldType == 'float'">
            <FloatLabel>
                <slot :invalid="errors[fieldName]" :placeholder="$t(finalLabel())"></slot>
                <label v-if="!hideLabel" :for="fieldName">{{ $t(finalLabel()) }} </label>
            </FloatLabel>
            <small class="text-red-500" v-if="errors[fieldName]">
                {{
 $t(errors[fieldName][0], {
        field: $t(finalLabel())
    })
                }}
            </small>
        </div>
        <div class="grid grid-cols-12 gap-2" v-else>
            <label v-if="!hideLabel" :for="fieldName"
                   class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">
                {{
        $t(finalLabel)
                }}
            </label>
            <div class="col-span-12 md:col-span-10">
                <slot :invalid="errors[fieldName]" :placeholder="$t(finalLabel())"></slot>
            </div>
            <small class="text-red-500" v-if="errors[fieldName]">
                {{
 $t(errors[fieldName][0], {
        field: $t(finalLabel())
                })
                }}
            </small>
        </div>
    </div>
</template>

<script>
    import FloatLabel from 'primevue/floatlabel';

    import HelperService from "../services/HelperService";
    export default {
        components: {
            FloatLabel
        },
        inheritAttrs: false,
        inheritProps: false,
        props: {
            label: String,
            fieldName: String,
            errors: {
                type: Object,
                default: () => ({})
            },
            class: {
                type: String,
                default: ""
            },
            fieldType: {
                type: String,
                default: "field"
            },
            hideLabel: {
                type: Boolean,
                default: false
            },
        },
        setup(props) {
            const helper = new HelperService();

            const finalLabel = () => {
                return helper.parseCamelCase(props.label ?? props.fieldName ?? "empty_text")
            };

            return { finalLabel }
        }
    };
</script>
