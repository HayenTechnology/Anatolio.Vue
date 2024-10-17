import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: 'src/index.js',
            name: 'Anatolio',
            formats: ['es', 'umd'],
            fileName: (format) => `anatolio.${format}.js`,
        },
        rollupOptions: {
            external: [
                'vue',
                'axios',
                'date-fns',
                'mqtt',
                'primeicons',
                'primevue',
                'vue-i18n',
                'vue-router',
                'xlsx',
            ],
            output: {
                globals: {
                    vue: 'Vue',
                    axios: 'axios',
                    'date-fns': 'dateFns',
                    mqtt: 'mqtt',
                    primeicons: 'primeicons',
                    primevue: 'primevue',
                    'vue-i18n': 'vueI18n',
                    'vue-router': 'vueRouter',
                    xlsx: 'xlsx',
                },
            },
        },
    },
});
