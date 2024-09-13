<template>
    <div>
        <!-- Modal açma butonu -->
        <Button icon="pi pi-plus" class="mr-2" v-tooltip.top="$t('Add New Widget')" severity="secondary" text
            @click="displayModal = true" />
        <!-- Modal -->
        <Dialog header="Widget Seçimi" v-model:visible="displayModal" modal style="width: 50vw">
            <div class="p-fluid">
                <!-- OSelect Input -->
                <FormField class="mb-4" :hideLabel="true" label="Select Widget" fieldName="selectedWidget">
                    <template v-slot:default="prp">
                        <OSelect :settings="{
                            url: '/api/OWidgets?$select=Id,Name&',
                            key: 'Id',
                            value: 'Name',
                        }" v-model="selectedWidget" :placeholder="prp.placeholder" :invalid="prp.invalid">
                        </OSelect>
                    </template>
                </FormField>
                <!-- Placeholder & Önizleme -->
                <div v-if="selectedWidget">
                    <Widget :widgetId="selectedWidget"></Widget>
                </div>
                <div v-else class="text-center mt-10">
                    <div class="text-xl">Widget Önizleme</div>

                    <div class="preview-box">
                        <p>Önizlemeniz burada gözükecektir</p>
                    </div>
                </div>
            </div>

            <!-- Modal kapatma ve seçim yapma butonları -->
            <template #footer>
                <Button label="Seç" icon="pi pi-check" class="p-button-text" @click="emitSelectedWidget" />
                <Button label="Kapat" icon="pi pi-times" class="p-button-text" @click="displayModal = false" />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Widget from '../../widget/ViewWidget.vue';

const emit = defineEmits(['widget-selected']);

// Modal görünürlüğü için state
const displayModal = ref(false);

// Seçilen widget
const selectedWidget = ref(null);



// Seçilen widget'ı parent'a göndermek için event emit fonksiyonu
const emitSelectedWidget = () => {
    if (selectedWidget.value) {
        // Seçilen widget id'sini event ile parent'a gönder
        emit('widget-selected', selectedWidget.value);
        // Modalı kapat
        displayModal.value = false;
    }
};
</script>

<style scoped>
.preview-box {
    border: 1px solid #ccc;
    padding: 50px;
    margin-top: 20px;
    background-color: #f9f9f9;
}
</style>