import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AuthService from './AuthService';
export default class AxiosSettings {
    init(settings) {
        const auth = new AuthService();
        const router = new useRouter();

        this.setServer(settings.server);
        this.setGlobalErrorAndNotificaiton(auth, router);
        this.setAuthentication(auth);
    }
    setServer(server) {
        axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        axios.defaults.baseURL = server;
    }
    setGlobalErrorAndNotificaiton(auth, router) {
        const toast = useToast();
        const { t } = useI18n();

        // Axios response interceptor'ını ayarla
        axios.interceptors.response.use(
            (response) => this.handleSuccessResponse(response, toast, t),
            (error) => this.handleErrorResponse(error, toast, t, auth, router)
        );
    }
    handleSuccessResponse(response, toast, t) {
        var res = response.data;
        const onlyData = !res.responseType || res.responseType == "Data";

        if (!onlyData && !response.config.hideToast) {
            const message = JSON.stringify(res?.errors) ?? 'Completed successfully';
            toast.add({ severity: res.responseType.toLowerCase(), summary: t(res.message), detail: t(message), life: 5000 });
        }
        if (response.config.loading) {
            response.config.loading.value = false;
        }
        return res.data ?? res;
    }
    handleErrorResponse(error, toast, t, auth, router) {
        let errorMessage = this.getErrorMessage(error);

        // HTTP status kodlarına göre özel işlemler
        switch (error.response?.status) {
            case 400:
                errorMessage = errorMessage ?? 'Check validation errors';
                break;
            case 403:
                errorMessage = errorMessage ?? 'Session ended, please log in again';
                auth.logout(router);
                break;
            default:
                errorMessage = errorMessage ?? error.message ?? 'An unexpected error occurred';
                break;
        }

        // Hata için toast bildirimi göster
        if (error.config.method != 'get' && !error.config.hideErrorToast) {
            toast.add({ severity: 'error', summary: t('Error'), detail: t(errorMessage), life: 5000 });
        }

        // Yapılandırılmış hata mesajlarını ayarla
        if (error.config.error) {
            error.config.error.value = errorMessage;
        }
        if (error.config.errors) {
            error.config.errors.value = error.response?.data?.errors ?? {};
        }
        if (error.config.loading) {
            error.config.loading.value = false;
        }
        return Promise.reject(error);
    }
    getErrorMessage(error) {
        // Hata mesajını çözümle
        return error.response?.data?.message;
    }
    setAuthentication(auth) {
        axios.interceptors.request.use(
            (config) => {
                if (config.loading) {
                    config.loading.value = true;
                }
                if (config.errors) {
                    config.errors.value = {};
                }
                if (config.error) {
                    config.error.value = '';
                }

                const token = auth.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }
}
