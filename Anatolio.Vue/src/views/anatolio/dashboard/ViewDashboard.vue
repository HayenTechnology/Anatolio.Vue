<template>
    <Toolbar>
        <!-- Sol Kısım (Widget, Save, Edit) -->
        <template #start>
            <AddWidgetToDashboard @widget-selected="handleWidgetSelected"></AddWidgetToDashboard>
            <Button icon="pi pi-save" class="mr-2" v-tooltip.top="$t('Save Dashboard')" severity="secondary" text
                @click="save" v-if="editable" />
            <Button icon="pi pi-pencil" class="mr-2" v-tooltip.top="$t('Edit Dashboard')" severity="secondary" text
                @click="editDashboard(true)" v-if="!editable" />
        </template>

        <!-- Orta Kısım (Arama) -->
        <template #center v-if="model.declares.filter(declare => declare.visible).length">
            <div class="grid grid-cols-3 gap-4">
                <div v-for="declare in model.declares">
                    <DeclareView :showName="false" :declare="declare"></DeclareView>
                </div>
            </div>
        </template>

        <!-- Sağ Kısım (Declare/Filters) -->
        <template #end>
            <Button label="Reload Dashboard" icon="pi pi-refresh" @click="reloadDashboard" />
        </template>
    </Toolbar>


    <!-- Dashboard Components Section -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div class="col-span-12">
            <div class="flex justify-center items-center mt-10 " v-if="!model.widgetPlaces.length">
                <div @click="addWidget"
                    class="border-2 border-dashed border-primary-300 rounded-lg p-10 text-center max-w-lg hover:bg-primary-100">
                    <h2 class="text-lg font-semibold text-gray-600 mb-4">{{ $t(
                        'No widget added yet') }}</h2>
                    <p class="text-gray-600 mb-4">{{ $t('Click to add new widget') }}
                    </p>
                    <i class="pi pi-chart-line text-primary-300" style="font-size: 2.5rem"></i>
                </div>
            </div>
            <!-- Dashboard content will go here -->
            <div class="grid-stack" ref="gridStackRef" :gs-editable="editable">
                <div class="grid-stack-item" v-for="(item, index) in model.widgetPlaces" :id="item.id" :gs-id="item.id"
                    :key="item.id" :gs-x="item.x" :gs-y="item.y" :gs-w="item.w" :gs-h="item.h"
                    @contextmenu="onImageRightClick($event, index)">
                    <ContextMenu ref="menu" :model="items(item, index)" />
                    <div class="grid-stack-item-content" style="overflow: hidden;" :class="{ 'editable': !editable }">
                        <Widget :widgetId="item.widgetId" class="h-full"></Widget>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';

import HelperService from '@/services/HelperService';
import axios from 'axios';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import DeclareView from '../queryBuilder/components/DeclareView.vue';
import Widget from '../widget/ViewWidget.vue';
import AddWidgetToDashboard from './components/AddWidgetToDashboard.vue';

var helper = new HelperService();
var route = useRoute();
const model = ref({
    widgetPlaces: [
    ],
    declares: []
})
const loading = ref(false)
const errors = ref([])
const error = ref("");

const menu = ref([]);
const items = (place, index) => {
    return [
        {
            label: 'Edit',
            icon: 'pi pi-copy',
            command: () => {
                window.location = '/widget/edit/' + place.widgetId
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () => {
                model.value.widgetPlaces.splice(index, 1);
                const selector = `#${place.id}`;
                grid.removeWidget(selector, false);

            }
        }
    ]


};

onBeforeMount(() => {
    if (route.params.id) {
        axios.get("/api/dashboard/get/" + route.params.id, { loading, errors, error }).then(response => {
            const query = response;
            if (query == null) { return; }

            query.widgetPlaces.forEach(addToDashboard)

            model.value = query;
        })
    }
})

const onImageRightClick = (event, index) => {
    menu.value[index].show(event);
};


const gridStackRef = ref(null);
const editable = ref(false);

let grid = null;

onMounted(() => {
    grid = GridStack.init({
        disableDrag: !editable.value,
        cellHeight: 40,
        verticalMargin: 10,
        disableResize: !editable.value, // Allow resizing
    });

    grid.on('change', function (event, changeItems) {

        changeItems.forEach(item => {
            var widget = model.value.widgetPlaces.find(w => w.id == item.id);
            if (!widget) {
                return;
            }
            widget.x = item.x;
            widget.y = item.y;
            widget.w = item.w;
            widget.h = item.h;
        });

        console.log(model.value.widgetPlaces)
    });


});



const hasPermission = (permission) => {
    // Permission check logic
    return true
}

const reloadDashboard = () => {
    // Reload dashboard logic
}

const addWidget = () => {
}

const saveDashboard = () => {
}

const editDashboard = (change) => {
    editable.value = change
    grid.opts.disableDrag = !editable.value
    grid.opts.disableResize = !editable.value
    grid.resizable('.grid-stack-item', editable.value);
    grid.movable('.grid-stack-item', editable.value);
}

const save = async () => {
    // Save logic
    editDashboard(false);
    const response = await axios.post('/api/dashboard/save', model.value, { loading, errors, error })

}

const handleWidgetSelected = (widgetId) => {
    const node = { x: 0, y: 0, w: 4, h: 6, widgetId: widgetId };
    addToDashboard(node);
    model.value.widgetPlaces.push(node);
};

const addToDashboard = (node) => {
    node.id = helper.guid();
    grid.addWidget(node);
};


</script>

<style scoped>
.editable {
    z-index: 999;
}
</style>
