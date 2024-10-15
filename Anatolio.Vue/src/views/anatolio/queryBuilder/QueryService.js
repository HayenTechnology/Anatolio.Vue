import axios from 'axios';
import { format } from 'date-fns';
import { ref } from 'vue';
import enums from '../../../helper/enums';

class QueryService {
    constructor() {
        if (QueryService.instance) {
            return QueryService.instance;
        }
        QueryService.instance = this;

        this.pendingQueries = new Set();
        this.queryResults = ref({});
        this.executedQueries = new Set();
        this.postfix = '_formated_';
        this.intervalId = null;
        this.queryDeclares = ref(new Map());

        // Kuyruğu dinleyen yapıyı başlat
        this.startPeriodicExecution();

        // queryDeclares'i izle
        //watch(() => this.queryDeclares.value, this.handleQueryDeclaresChange.bind(this), { deep: true });
    }

    setI18n(t) {
        this.t = t;
    }

    addQuery(queryId, declares) {
        if (this.executedQueries.has(queryId)) {
            return this.queryResults.value[queryId];
        }
        this.queryDeclares.value.set(queryId, declares);
        this.pendingQueries.add(queryId);
        return null;
    }

    handleQueryDeclaresChange() {
        for (const [queryId, declares] of this.queryDeclares.value) {
            this.reExecuteQuery(queryId, declares);
        }
    }

    reExecuteQuery(queryId) {
        this.executedQueries.delete(queryId);
        this.pendingQueries.add(queryId);
        this.executePendingQueries();
    }

    async executePendingQueries() {
        const uniqueQueries = Array.from(this.pendingQueries);
        this.pendingQueries.clear();

        for (const queryId of uniqueQueries) {
            if (!this.executedQueries.has(queryId)) {
                try {
                    const declares = this.queryDeclares.value.get(queryId) || [];
                    const result = await this.post({ id: queryId, declares: declares });
                    this.queryResults.value[queryId] = result;
                    this.executedQueries.add(queryId);
                } catch (error) {
                    console.error(`${queryId} sorgusu yürütülürken hata oluştu:`, error);
                    this.queryResults.value[queryId] = [];
                }
            }
        }
    }

    async post(options) {
        try {
            const response = await axios.post('/api/querybuilder/execute/exist', {
                Id: options.id,
                Declares: options.declares
            }, { hideToast: true });

            if (!response.data || !response.data.length) {
                throw new Error('Sorgu Sonucu Getirilemedi, Sorguyu Kontrol Edin');
            }

            return response.data.map(d => this.format(response.query, d));
        } catch (e) {
            throw new Error('Sorgusunda Hata Var Kontrol Edin');
        }
    }

    format(query, data) {
        try {
            query.queryColumns.forEach((col) => {
                try {
                    const formatType = col.outputType.toLowerCase();
                    data[col.name + this.postfix] =
                        this.formatData(
                            formatType,
                            {
                                enum: col.enum,
                                dateFormat: col.dateFormat,
                                showBrackets: col.showBrackets,
                                numberOfDecimalPlace: col.numberOfDecimalPlace
                            },
                            data[col.name]
                        ) || data[col.name];
                } catch (ex) {
                    console.log(ex);
                }
            });
            return data;
        } catch {
            return data;
        }
    }

    formatData(formatType, options, value) {
        try {
            if (formatType === 'text') {
                return value;
            }

            if (formatType === 'enum') {
                return enums[options.enum].find((s) => s.number == value || s.value == value)?.name || value;
            }

            if (formatType === 'date') {
                return format(new Date(value), this.t(options.dateFormat));
            }

            if (formatType === 'number') {
                let number = parseFloat(value).toFixed(options.numberOfDecimalPlace || 2);
                if (options.showBrackets) {
                    number = `(${number})`;
                }
                return number;
            }
        } catch { }
        return value;
    }

    startPeriodicExecution(interval = 1000) {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.intervalId = setInterval(() => {
            this.executePendingQueries();
        }, interval);
    }

    stopPeriodicExecution() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Singleton instance'ı oluştur ve export et
export default new QueryService();
