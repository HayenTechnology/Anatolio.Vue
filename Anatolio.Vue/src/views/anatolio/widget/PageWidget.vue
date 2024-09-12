<template>
    <div class="summernote-content p-10 text-dark-75">
        <div v-html="content.pageContent.html"></div>
    </div>
</template>

<script>
export default {
    props: {
        content: Object
    }
};
</script>