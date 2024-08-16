<script setup>
    import { onBeforeMount, getCurrentInstance } from 'vue';
    import AxiosSettings from './services/AxiosSettings';

    var axios = new AxiosSettings();

    onBeforeMount(() => {
        axios.init({
            server: 'https://localhost:7197/'
        });
    });


</script>

<template>
    <router-view />
</template>

<style scoped></style>
