import { format } from 'date-fns';
import * as XLSX from 'xlsx';

export default class ExportExcel {
    flatten(obj, translate, columns) {
        var data = {};
        var result = [];
        this.innerObj(result, obj, '');

        columns.forEach((column) => {
            try {
                var res = result.find((s) => s.name == column.data);
                if (!res) {
                    data[column.title] = null;
                }
                if (column.option?.enumType) {
                    res.value = translate(res.value);
                }
                else if (!isNaN(Date.parse(res.value)) && (res.value.toString().match('.{4}-.{2}-.{2}T.{2}:.{2}:.{2}.*?') != null || res.value.toString().match('.{4}-.{2}-.{2} .{2}:.{2}:.{2}.*?') != null)) {
                    var dateValue = new Date(res.value);
                    res.value = format(dateValue, 'dd/MM/yyyy HH:mm');
                }
                data[column.title] = res.value;
            } catch (e) {
                console.log(e);
            }
        });
        return data ?? obj;
    }

    innerObj(res, obj, name) {
        try {
            name = name ? name + '.' : name;
            for (var prop in obj) {
                if (typeof obj[prop] === 'object') {
                    this.innerObj(res, obj[prop], name + prop);
                } else {
                    res.push({ name: name + prop, value: obj[prop] });
                }
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    exportToExcel(data, columns,translate, fileName = 'export.xlsx') {
        if (!data || !data.length) return;

        const translatedData = data.map(item => this.flatten(item, (val) => translate(val), columns));
        const headers = columns.map(col => translate(col.title));

        const ws = XLSX.utils.json_to_sheet(translatedData, { header: headers });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, fileName);
    }
}
