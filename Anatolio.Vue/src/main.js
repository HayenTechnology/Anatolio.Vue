import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primevue/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import '@/assets/styles.scss';
import '@/assets/tailwind.css';

import i18n from './helper/i18n';

import enums from './helper/enums';

import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor';

import Anatolio from '@sinanekiz/anatolio';

const app = createApp(App);

app.config.globalProperties.$enums = enums;


app.use(VueMonacoEditorPlugin, {
    paths: {
        // The recommended CDN config
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs'
    }
});
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(i18n);

app.component('OSelect', Anatolio.OSelect);
app.component('MenuButton', Anatolio.MenuButton);
app.component('OView', Anatolio.OView);
app.component('ErrorDisplay', Anatolio.ErrorDisplay);
app.component('FormField', Anatolio.FormField);
app.component('Enum', Anatolio.Enum);
app.component('ODataTable', Anatolio.ODataTable);
app.component('PeriodicDatePicker', Anatolio.PeriodicDatePicker);

app.mount('#app');
