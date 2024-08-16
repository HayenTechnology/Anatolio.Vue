<template>
    <Button type="button" text rounded icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" :aria-controls="'overlay_menu_'+data.Id" />
    <Menu ref="menu" :id="'overlay_menu_'+data.Id" :model="buttons" :popup="true">
        <template #item="{ item, props }">
            <a v-if="item.url" :href="item.url" :target="item.target??'_self'" v-ripple class="flex align-items-center" v-bind="props.action">
                <span :class="item.icon" />
                <span class="ml-2">{{ $t(item.label) }}</span>
            </a>
            <a v-else  v-ripple class="flex align-items-center" v-bind="props.action">
                <span :class="item.icon" />
                <span class="ml-2">{{ $t(item.label) }}</span>
            </a>
        </template>
    </Menu>
</template>

<script setup>

    import { ref, onMounted, onBeforeMount, defineProps, watch, defineEmits } from 'vue';

    const props = defineProps({
        data: {
            type: Object,
            required: true,
            default: () => ({ Id: 'Id' })
        },
        buttons: {
            type: Function,

        }
    });

    const buttons = ref(props.buttons(props.data))

    const toggle = ( event) => {
        menu.value.toggle(event);
    };
    const menu = ref();

</script>