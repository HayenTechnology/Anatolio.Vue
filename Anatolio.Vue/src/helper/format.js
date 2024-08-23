
import { createI18n } from 'vue-i18n';
import tr from './tr.js';
import en from './en.js';

const messages = {
    en: en,
    tr: tr
};
const storageLang = localStorage.getItem('lang');

const userLanguage = storageLang ?? navigator.language.split('-')[0];

localStorage.setItem('lang', userLanguage);


const i18n = createI18n({
    legacy: false, // Legacy modunu devre dışı bırak
    locale: messages[userLanguage] ? userLanguage : 'en', // Kullanıcı dilini kontrol et, yoksa varsayılanı kullan
    fallbackLocale: 'en', // Çeviri bulunamadığında kullanılacak yedek dil
    silentTranslationWarn: true, // Uyarı mesajlarını kapat
    missingWarn: false, // Eksik çeviriler için uyarı mesajlarını kapat
    fallbackWarn: false, // Yedek dil kullanıldığında uyarı mesajlarını kapat
    messages
});

export default i18n;
