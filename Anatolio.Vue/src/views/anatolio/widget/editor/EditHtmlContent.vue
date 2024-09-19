<template>
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
