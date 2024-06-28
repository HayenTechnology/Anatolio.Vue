<template>
    <div>
        <Button label="Create New Dashboard" icon="pi pi-plus" @click="addDashboard"></Button>
        <div class="row">
            <div v-if="!datas.length" class="col-md-12">
                <Button label="Create New Personal Dashboard" icon="pi pi-plus" @click="addFirstDashboard"></Button>
            </div>
            <div v-for="data in datas" :key="data.Id" class="col-sm-6 col-md-4">
                <div :class="['card card-custom bgi-no-repeat bgi-size-cover gutter-b', `bg-${data.color}`]"
                     :style="{backgroundImage: `url(${themeRoot}/dist/assets/media/svg/patterns/taieri.svg)`}">
                    <div class="card-body d-flex card-with-contextmenu" @contextmenu.prevent="showContextMenu($event, data)">
                        <div class="d-flex align-items-center justify-content-between flex-grow-1">
                            <span class="symbol symbol-50 symbol-light-primary mr-2">
                                <span class="symbol-label" v-if="data.IsHomePage">
                                    <i class="pi pi-home"></i>
                                </span>
                            </span>
                            <div class="d-flex flex-column text-right">
                                <a :href="`/Dashboard/View?id=${data.Id}`" class="text-white font-weight-bolder font-size-h3">{{ data.Name }}</a>
                                <p class="text-white opacity-75 font-weight-bold mt-3">{{ data.Description || 'No Description' }}</p>
                            </div>
                        </div>
                        <div v-if="contextMenuVisible" class="dropdown-menu dropdown-menu-sm context-menu">
                            <a :href="`/Dashboard/View?id=${data.Id}`" class="dropdown-item"><i class="pi pi-refresh"></i> View</a>
                            <a :href="`/Dashboard/Edit?id=${data.Id}`" class="dropdown-item"><i class="pi pi-pencil"></i> Edit</a>
                            <a @click="setHomePage(data.Id)" v-if="!data.IsHomePage" class="dropdown-item"><i class="pi pi-home"></i> Set as Home Page</a>
                            <a @click="deleteDashboard(data.Id)" class="dropdown-item text-danger"><i class="pi pi-trash"></i> Delete</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { ref, reactive, onMounted } from 'vue'
    import { Button } from 'primevue/button'

    export default {
        components: {
            Button
        },
        setup() {
            const datas = reactive([])
            const contextMenuVisible = ref(false)
            const themeRoot = ref('/your-theme-root')

            onMounted(() => {
                Object.assign(datas, JSON.parse(document.getElementById('app').dataset.model))
                datas.forEach(s => s.color = ["success", "primary", "danger", "success", "warning", "dark", "primary", "info"][getRandomInt(0, 7)])
            })

            const addDashboard = () => {
                window.location.href = "/Dashboard/Edit"
            }

            const addFirstDashboard = () => {
                // Your add first dashboard logic
            }

            const showContextMenu = (event, data) => {
                contextMenuVisible.value = true
                // Positioning logic here
            }

            const setHomePage = (id) => {
                // Set as home page logic
            }

            const deleteDashboard = (id) => {
                // Delete dashboard logic
            }

            const getRandomInt = (min, max) => {
                min = Math.ceil(min)
                max = Math.floor(max)
                return Math.floor(Math.random() * (max - min + 1)) + min
            }

            return {
                datas,
                contextMenuVisible,
                themeRoot,
                addDashboard,
                addFirstDashboard,
                showContextMenu,
                setHomePage,
                deleteDashboard,
                getRandomInt
            }
        }
    }
</script>

<style scoped>
    .context-menu {
        display: none;
        position: absolute;
        z-index: 1000;
    }

        .context-menu.show {
            display: block;
        }
</style>
