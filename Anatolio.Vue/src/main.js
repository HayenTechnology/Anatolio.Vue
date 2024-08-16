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

import OSelect from './components/OSelect.vue';
import MenuButton from './components/MenuButton.vue';
import OView from './components/OView.vue';
import ErrorDisplay from './components/ErrorDisplay.vue';
import Enum from './components/Enum.vue';
import FormField from './components/FormField.vue';
import ODataTable from './components/ODataTable.vue';

const app = createApp(App);

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

app.mount('#app');
