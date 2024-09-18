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

import Enum from './components/Enum.vue';
import ErrorDisplay from './components/ErrorDisplay.vue';
import FormField from './components/FormField.vue';
import MenuButton from './components/MenuButton.vue';
import ODataTable from './components/ODataTable.vue';
import OSelect from './components/OSelect.vue';
import OView from './components/OView.vue';
import PeriodicDatePicker from './components/PeriodicDatePicker.vue';
import enums from './helper/enums';

import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor';



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

app.component('OSelect', OSelect);
app.component('MenuButton', MenuButton);
app.component('OView', OView);
app.component('ErrorDisplay', ErrorDisplay);
app.component('FormField', FormField);
app.component('Enum', Enum);
app.component('ODataTable', ODataTable);
app.component('PeriodicDatePicker', PeriodicDatePicker);

app.mount('#app');
