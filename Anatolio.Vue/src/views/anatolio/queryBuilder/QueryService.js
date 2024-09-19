import axios from 'axios';
import { format } from 'date-fns';
import { useI18n } from 'vue-i18n';
import enums from '../../../helper/enums';

export default class QueryService {
    constructor() {
        const { t } = useI18n();
        this.t = t;
        this.results = {};
        this.queries = {};
        this.inFlightQueries = {}; // O anda çalışan sorguları takip eden yapı
        this.postfix = '_formated_';
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

    async get(options, func) {
        if (!options || !options.id || !func) {
            console.error('Please select or create a query');
            return;
        }

        const readyData = this.results[options.id];

        if (readyData && !options.update) {
            func(readyData);
            return;
        }

        // Eğer aynı ID'li sorgu zaten çalışıyorsa, o sorgunun tamamlanmasını bekle.
        if (this.inFlightQueries[options.id]) {
            this.inFlightQueries[options.id].then(func).catch((error) => {
                console.error('Error waiting for in-flight query:', error);
                func([], 'Sorgusunda Hata Var Kontrol Edin');
            });
            return;
        }

        // Sorgu yoksa yeni bir sorgu başlat ve sonucu bekleyenlerle paylaş
        this.inFlightQueries[options.id] = this.post(options).then((data) => {
            delete this.inFlightQueries[options.id]; // Sorgu tamamlandığında in-flight'den kaldır
            func(data);
            return data;
        }).catch((error) => {
            delete this.inFlightQueries[options.id]; // Hata durumunda da in-flight'den kaldır
            console.error('Error during query:', error);
            func([], 'Sorgusunda Hata Var Kontrol Edin');
        });
    }

    async post(options) {
        try {
            const response = await axios.post('/api/querybuilder/execute/exist', {
                Id: options.id,
                Declares: options.declares
            }, { hideToast :true});

            const result = response;

            if ((!result || !result.data || !result.data.length) && !result.query) {
                throw new Error('Sorgu Sonucu Getirilemedi, Sorguyu Kontrol Edin');
            }

            result.data = result.data.map((d) => this.format(result.query, d));

            this.results[options.id] = result.data;
            this.queries[options.id] = result.query;
            return result.data;
        } catch (e) {
            throw new Error('Sorgusunda Hata Var Kontrol Edin');
        }
    }
}
