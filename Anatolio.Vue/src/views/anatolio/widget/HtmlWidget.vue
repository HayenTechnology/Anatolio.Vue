<template>
    <div class="p-10">
        <!-- Dinamik bileşeni render et veya hata mesajını göster -->
        <component v-if="!hasError && dynamicComponent" :is="dynamicComponent" :data="data" />
        <div v-else>
            <p style="color: red;">Hatalı HTML kodu veya bileşen oluşturulamadı.</p>
            <pre>{{ errorMessage }}</pre>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, watch, markRaw } from 'vue';
import QueryService from '../queryBuilder/QueryService';
import { compile } from '@vue/compiler-dom'; // Vue'nun derleyicisini ekleyin

const queryService = new QueryService();
const data = ref([]);
const hasError = ref(false); // Hata durumunu kontrol etmek için değişken
const errorMessage = ref(''); // Hata mesajını saklamak için değişken
const props = defineProps({
    content: Object,
});

const dynamicComponent = ref(null);

// İlk sorguyu yapma
onBeforeMount(() => {
    getQuery();
    loadComponent(); // Bileşeni yüklemeyi buraya taşıdık
});

const getQuery = () => {
    if (!props.content.queryId) {
        return;
    }

    queryService.get(
        {
            id: props.content.queryId,
            declares: [],
        },
        (response) => {
            data.value = response ?? [];
        }
    );
};

watch(() => props.content.queryId, () => {
    getQuery();
});

watch(() => props.content, () => {
    loadComponent();
}, { deep: true });

// Dinamik bileşeni güvenli bir şekilde yükleme
const loadComponent = () => {
    try {
        hasError.value = false; // Hata durumunu sıfırla
        errorMessage.value = ''; // Hata mesajını sıfırla

        // Kullanıcı tarafından sağlanan HTML'yi derleyerek bir bileşen oluştur
        const template = props.content.htmlContent.html ?? '<div>Your code will be shown here</div>';

        // Bileşeni derle ve dinamik olarak oluştur
        const compiledTemplate = compile(template);

        // Vue bileşeni olarak tanımla
        dynamicComponent.value = markRaw({
            template: template,
            props: ['data'],
            methods: {
                alertMessage() {
                    alert('Button clicked!');
                },
            },
        });
    } catch (error) {
        // Hata oluştuğunda kullanıcıya bilgi ver
        console.error('Bileşen oluşturulurken hata oluştu:', error);
        hasError.value = true;
        errorMessage.value = error.message; // Hata mesajını kaydet
    }
};
</script>
