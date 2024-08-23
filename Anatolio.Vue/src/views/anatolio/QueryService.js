import axios from 'axios';
import { format } from 'date-fns';
import { useI18n } from 'vue-i18n';
import enums from '../../helper/enums';

export default class QueryService {
    constructor() {
        const { t } = useI18n();
        this.t = t;
        this.results = {}
        this.queries = {}
        this.postfix = '_formated_'
    }

    format(query, data) {
        try {
            query.queryColumns.forEach(col => {
                try {
                    const formatType = col.outputType.toLowerCase()

                    data[col.name + this.postfix] = this.formatData(formatType, {
                        enum: col.enum,
                        dateFormat: col.dateFormat,
                        showBrackets: col.showBrackets,
                        numberOfDecimalPlace: col.numberOfDecimalPlace
                    }, data[col.name]) || data[col.name]
                } catch (ex) {
                    console.log(ex)
                }
            })
            return data
        } catch {
            return data
        }
    }

    formatData(formatType, options, value) {
        try {
            if (formatType === 'text') {
                return value
            }

            if (formatType === 'enum') {
                return enums[options.enum].find(s => s.number == value || s.value == value)?.name || value
            }

            if (formatType === 'date') {
                return format(new Date(value), this.t(options.dateFormat))
            }

            if (formatType === 'number') {
                let number = parseFloat(value).toFixed(options.numberOfDecimalPlace || 2)
                if (options.showBrackets) {
                    number = `(${number})`
                }
                return number
            }
        } catch {

        }
        return value
    }

    async get(options, func) {
        if (!options || !options.id || !func) {
            console.error('Please select or create a query')
            return
        }

        const readyData = this.results[options.id]

        if (readyData && !options.update) {
            func(readyData)
            return
        }

        this.post(options, func, 0)
    }

    async post(options, func, retryCount = 0) {
        try {
            const response = await axios.post('/api/querybuilder/execute/exist', {
                Id: options.id,
                Declares: options.declares
            })

            const result = response.data

            if ((!result || !result.data || !result.data.length) && !result.query) {
                if (retryCount > 3) {
                    func([], 'Sorgu Sonucu Getirilemedi, Sorguyu Kontrol Edin')
                    return
                }

                setTimeout(() => {
                    this.post(options, func, retryCount + 1)
                }, 200)
                return
            }

            result.Data = result.Data.map(d => this.format(result.Query, d))

            this.results[options.id] = result.data
            this.queries[options.id] = result.query
            func(result.Data)
        } catch (e) {
            if (retryCount > 3) {
                console.error(result.query?.name + ' Sorgusunda Hata Var Kontrol Edin')
                func([], result.query?.name + ' Sorgusunda Hata Var Kontrol Edin')
                return
            }

            setTimeout(() => {
                this.post(options, func, retryCount + 1)
            }, 200)
        }
    }
}
