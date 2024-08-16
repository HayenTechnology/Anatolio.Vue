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
                if (!isNaN(Date.parse(res.value)) && res.value.toString().match('.{4}-.{2}-.{2}T.{2}:.{2}:.{2}.*?') != null) {
                    var dateValue = new Date(res.value);
                    res.value = (dateValue.toLocaleDateString() + ' ' + dateValue.toLocaleTimeString()).slice(0, 16);
                }
                data[column.title] = res.value

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
                if (typeof obj[prop] == 'object') {
                    this.innerObj(res, obj[prop], name + prop);
                } else {
                    res.push({ name: name + prop, value: obj[prop] });
                }
            }
        } catch (ex) {
            console.log(ex);
        }
    }
}
