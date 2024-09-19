<template>
    <FormField class="mb-4"  label="Show Space"   >
        <template v-slot:default="prp">
            <Checkbox v-model="content.htmlContent.showSpace" :binary="true" >
            </Checkbox>
        </template>
    </FormField>
    
    <div v-if="content.contentType === 'HtmlContent'" style="height:200px">
        <vue-monaco-editor v-model:value="content.htmlContent.html" theme="vs-dark"
                           :options="MONACO_EDITOR_OPTIONS" @mount="handleMount"
                           :language="'html'" />

    </div>
</template>

<script setup>
    import { ref, shallowRef } from 'vue';
    import { VueMonacoEditor } from '@guolao/vue-monaco-editor';

    const props = defineProps({
        content: {
            type: Object,
            required: true
        }
    });

    const MONACO_EDITOR_OPTIONS = {
        automaticLayout: true,
        formatOnType: true,
        formatOnPaste: true
    }
    const editorRef = shallowRef()
    const handleMount = editor => (editorRef.value = editor)
</script>
