import * as Components from './src/components';
import * as Services from './src/services';

const anatolio = {
    install(app) {
        // Bileþenleri global olarak kaydet
        Object.keys(Components).forEach((key) => {
            app.component(key, Components[key]);
        });

        // Servisleri ekle
        app.config.globalProperties.$services = Services;
    }
};

export { anatolio };