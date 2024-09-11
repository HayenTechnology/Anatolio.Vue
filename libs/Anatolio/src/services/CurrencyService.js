import axios from 'axios';

export default class CurrencyService {

    constructor() {
        this.currencies = {};
        this.cacheKey = 'currencies';
        this.cacheExpiryKey = 'currenciesExpiry';
        this.cacheDuration = 24 * 60 * 60 * 1000; // 1 gün (milisaniye cinsinden)
        this.loadCurrencies();
    }

    async loadCurrencies() {
        const cachedCurrencies = localStorage.getItem(this.cacheKey);
        const cachedExpiry = localStorage.getItem(this.cacheExpiryKey);

        if (cachedCurrencies && cachedExpiry && Date.now() < cachedExpiry) {
            this.currencies = JSON.parse(cachedCurrencies);
        } else {
            try {
                this.currencies = await axios.get("/api/Helper/GetCurrencies");
                localStorage.setItem(this.cacheKey, JSON.stringify(this.currencies));
                localStorage.setItem(this.cacheExpiryKey, Date.now() + this.cacheDuration);
            } catch (error) {
                console.error("Failed to load currencies:", error);
                if (cachedCurrencies) {
                    this.currencies = JSON.parse(cachedCurrencies); // Hata durumunda eski cache'i kullan
                }
            }
        }
    }

    exchange(amount, source, dest = "TRY") {
        const src = this.currencies[source] ?? 1;
        const dst = this.currencies[dest] ?? 1;

        if (src === 1 && !this.currencies[source]) {
            console.warn(`Source currency "${source}" not found. Using default rate of 1.`);
        }

        if (dst === 1 && !this.currencies[dest]) {
            console.warn(`Destination currency "${dest}" not found. Using default rate of 1.`);
        }

        return parseFloat(((amount * src) / dst).toFixed(2));
    }
}
