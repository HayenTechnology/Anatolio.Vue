<template>
    <Message severity="error" v-if="error || hasErrors" class="mb-4">
        <template v-if="error">
            {{ $t(error) }}
        </template>
        <template v-for="(messages, field) in errors" :key="field">
            <small v-for="(message, index) in messages" :key="index">
                <br>{{ $t(message, { field: $t(helper.parseCamelCase(field)) }) }}
            </small>
        </template>
    </Message>
</template>

<script>
import HelperService from "../services/HelperService";

export default {
    props: {
        error: String,
        errors: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        hasErrors() {
            return Object.keys(this.errors).length > 0;
        }
    },
    setup() {
        const helper = new HelperService();

        return { helper }
    }
};
</script>