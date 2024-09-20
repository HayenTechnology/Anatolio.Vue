<template>
    <div>
        <l-marker v-for="marker in markers" :key="marker.id" :lat-lng="marker.position">
            <l-icon :icon-size="[1, 1]" :icon-anchor="[12, 41]">
                <i :class="marker.icon" :style="{ 'color': marker.color, 'fontSize': '30px' }"></i>
            </l-icon>
            <l-popup>
                <table class="table table-sm">
                    <tbody>
                        <tr v-for="desc in marker.descriptions" :key="desc.name">
                            <th :style="{ color: desc.contentColorString }">{{ desc.name }} :</th>
                            <td>{{ desc.prefix }}{{ desc.value }}{{ desc.postfix }}</td>
                        </tr>
                    </tbody>
                </table>
            </l-popup>
        </l-marker>
        <l-polygon v-for="polygon in polygons" :key="polygon.id" :lat-lngs="polygon.paths"
            :color="polygon.color"></l-polygon>
        <l-polyline v-for="polyline in polylines" :key="polyline.id" :lat-lngs="polyline.path"
            :color="polyline.color"></l-polyline>
    </div>
</template>

<script setup>
import { LIcon, LMarker, LPolygon, LPolyline, LPopup } from "@vue-leaflet/vue-leaflet";
import { onMounted, ref, watch } from 'vue';
import QueryService from '../queryBuilder/QueryService';

const props = defineProps({
    content: Object,
});

const queryService = new QueryService();
const markers = ref([]);
const polygons = ref([]);
const polylines = ref([]);

const fetchData = async () => {
    if (!props.content.queryId) return;

    try {
        await queryService.get({
            id: props.content.queryId,
            declares: [],
        }, (response => {
            processData(response);
        }));

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const processData = (data) => {
    const mapContent = props.content.mapContent;
    if (!mapContent || !isMapContentValid(mapContent)) return;

    markers.value = [];
    polygons.value = [];
    polylines.value = [];

    data.forEach(d => {
        switch (mapContent.mapType) {
            case 'Marker':
                addMarker(d, mapContent);
                break;
            case 'Polygon':
                addPolygon(d, mapContent);
                break;
            case 'Polyline':
                addPolyline(d, mapContent);
                break;
        }
    });
};

const addMarker = (d, mapContent) => {
    const latc = mapContent.latitudeColumn;
    const lngc = mapContent.longitudeColumn;
    const icon = mapContent.markerIcon;
    let color;

    if (mapContent.isStaticColor) {
        color = mapContent.markerColorString;
    } else if (mapContent.isUserDefinedColor) {
        const colorCriteriaValue = d[mapContent.colorCriteriaColumn];
        const matchingRange = mapContent.colorRanges.find(range =>
            colorCriteriaValue >= range.from && colorCriteriaValue <= range.to
        );
        color = matchingRange ? matchingRange.contentColorString : mapContent.markerColorString; // Varsayılan renk
    } else {
        color = d[mapContent.colorCriteriaColumn] ?? '000000'; // Eğer hiçbir koşul sağlanmazsa varsayılan renk
    }

    if (d[latc] && d[lngc]) {
        markers.value.push({
            id: d.id,
            color: '#' + color,
            position: [d[latc], d[lngc]],
            icon: icon,
            descriptions: createDescriptions(d, mapContent)
        });
    }
};

const createDescriptions = (data, mapContent) => {
    const desc = mapContent.descriptionColumns || [];
    return desc.map(d => ({
        name: d.name,
        contentColorString: d.contentColorString,
        prefix: d.prefix || '',
        value: data[d.name],
        postfix: d.postfix || ''
    }));
};

const addPolygon = (d, mapContent) => {
    const coor = mapContent.coordinatesColumn;
    let coords = d[coor];

    if (typeof coords === "string") {
        try {
            coords = JSON.parse(coords);
        } catch (e) {
            console.error('Invalid polygon coordinates:', coords);
            return;
        }
    }

    if (Array.isArray(coords) && coords.length > 0) {
        polygons.value.push({
            id: d.id,
            paths: coords,
            color: calculateColor(d, mapContent)
        });
    }
};

const addPolyline = (d, mapContent) => {
    const coor = mapContent.coordinatesColumn;
    let path = d[coor];

    if (typeof path === "string") {
        try {
            path = JSON.parse(path);
        } catch (e) {
            console.error('Invalid polyline coordinates:', path);
            return;
        }
    }

    if (Array.isArray(path) && path.length > 0) {
        polylines.value.push({
            id: d.id,
            path: path,
            color: calculateColor(d, mapContent)
        });
    }
};

const isMapContentValid = (mapContent) => {
    switch (mapContent.mapType) {
        case 'Marker':
            return !!mapContent.latitudeColumn && !!mapContent.longitudeColumn;
        case 'Polygon':
        case 'Polyline':
            return !!mapContent.coordinatesColumn;
        default:
            return false;
    }
};

const calculateColor = (data, mapContent) => {
    const crt = mapContent.colorCriteriaColumn;
    if (mapContent.isUserDefinedColor && Array.isArray(mapContent.colorRanges)) {
        const range = mapContent.colorRanges.find(r => data[crt] >= r.from && data[crt] <= r.to);
        return range ? range.contentColorString : '#00CCBB';
    } else {
        // Burada varsayılan bir renk hesaplama mantığı ekleyebilirsiniz
        return '#00CCBB';
    }
};

onMounted(fetchData);
watch(() => props.content, fetchData, { deep: true });
</script>