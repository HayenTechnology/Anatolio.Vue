<template>
    <div :id="content.Id" class="d-flex justify-content-center text-dark-75"
        :style="{ height: (content.height || 200) + 'px' }">
        <!-- Chart Component -->
    </div>
</template>

<script>
export default {
    props: {
        content: Object
    },
};
</script>