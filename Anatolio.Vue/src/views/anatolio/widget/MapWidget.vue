<template>
    <div style="height:400px; width:100%">
        <l-map ref="map" :zoom="zoom" :center="center" @ready="onMapReady">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
            <MapItemComponent v-for="content in mapContents" :key="content.id" :content="content" :declares="declares"
                :refresh="refresh" />
        </l-map>
    </div>
</template>

<script setup>
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import * as L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { computed, onMounted, ref, watch } from 'vue';
import MapItemComponent from './MapItemComponent.vue';
const props = defineProps({
    widget: Object,
    refresh: Number,
    declares: {
        type: Array,
        default: () => []
    }
});

const map = ref(null);
const zoom = ref(13);
const center = ref([0, 0]);

const mapContents = computed(() => {
    return props.widget.contents.filter(s => s.contentType == 'MapContent');
});

const onMapReady = (mapObject) => {
    L;
    map.value = mapObject;
    fitMapToContents();
};

const fitMapToContents = () => {

};

watch(() => props.widget.contents, fitMapToContents, { deep: true });

onMounted(() => {
    if (map.value) fitMapToContents();
});
</script>

<style scoped>
.leaflet-container {
    height: 100%;
    width: 100%;
}
</style>
