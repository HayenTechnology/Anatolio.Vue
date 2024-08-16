export default class OdataService {
    createSearchQuery(filter, getAll = false) {
        var searchQuery = {
            $count: true,
            $skip: filter.first || 0,
            $top: filter.rows || 10
        };
        if (!filter.sortField) {
            filter.sortField = 'Id';
            filter.sortOrder = -1;
        }
        if (getAll) {
            searchQuery = {
                $count: true
            };
        }

        if (filter.sortField) {
            searchQuery.$orderBy = filter.sortField.replaceAll('.', '/') + ' ' + (filter.sortOrder == -1 ? 'desc' : 'asc');
        }

        var queryFilters = [];
        var querySelect = '';
        var queryExpand = '';
        for (var element in filter.filters) {
            if (Object.prototype.hasOwnProperty.call(filter.filters[element], 'constraints') == true) {
                var localFilter = [];
                for (var i = 0; i < filter.filters[element].constraints.length; i++) {
                    if (filter.filters[element].constraints[i].value === null || filter.filters[element].constraints[i].value === '' || filter.filters[element].constraints[i].value === undefined) {
                        continue;
                    }
                    localFilter.push(this.setFilter(element, filter.filters[element].constraints[i]));
                }
                if (localFilter.length) queryFilters.push('( ' + localFilter.join(' ' + (filter.filters[element].operator ?? 'and') + ' ') + ' )');
            }

            if (filter.filters[element].value === null || filter.filters[element].value === '' || filter.filters[element].value === undefined || filter.filters[element].ignore) {
                continue;
            }

            if (element == 'global') {
                var globalFilters = [];
                filter.filters[element].fields.forEach((f) => {
                    if (Object.prototype.hasOwnProperty.call(filter.filters[f], 'constraints') == true) {
                        for (var i = 0; i < filter.filters[f].constraints.length; i++) {
                            if (filter.filters[f].constraints[i].value == null) {
                                globalFilters.push(this.setFilter(f, filter.filters[f].constraints[i], filter.filters[element].value));
                            }
                        }
                    } else {
                        if (filter.filters[f].value == null) {
                            globalFilters.push(this.setFilter(f, filter.filters[f], filter.filters[element].value));
                        }
                    }
                });
                queryFilters.push('( ' + globalFilters.join(' or ') + ' )');
                continue;
            }

            if (filter.filters[element].or) {
                var first = this.setFilter(element, filter.filters[element]);
                var second = this.setFilter(filter.filters[element].or, filter.filters[filter.filters[element].or]);
                queryFilters.push('( ' + first + ' or ' + second + ' )');
                continue;
            }

            //if (queryFilters.length != 0)
            //    queryFilters.push(filter.filters[element].joinRule ?? "and")

            queryFilters.push(this.setFilter(element, filter.filters[element]));
        }
        if (queryFilters.filter((s) => s != '').length > 0) {
            searchQuery.$filter = queryFilters.filter((s) => s != '').join(' and ');
        }
        if (filter.select) {
            querySelect += '' + filter.select;
            searchQuery.$select = querySelect;
        }
        if (filter.expand) {
            queryExpand += '' + filter.expand;
            searchQuery.$expand = queryExpand;
        }
        return searchQuery;
    }
    createOdataQuery(filter, getAll = false) {
        var searchQuery = this.createSearchQuery(filter, getAll);
        var urlparams = new URLSearchParams(searchQuery).toString();
        return urlparams;
    }
    formatDate(value) {
        return value.toISOString();
    }
    setFilter(element, filter, value = null) {
        var val = filter.value ?? value;
        switch (Object.prototype.toString.call(val)) {
            case '[object String]':
                val = "'" + val + "'";
                break;
            case '[object Date]':
                val = this.formatDate(val);
                break;
        }

        element = element.replaceAll('.', '/');
        switch (filter.matchMode) {
            case undefined:
            case 'contains':
                return (
                    '(contains(tolower(' +
                    element +
                    '),tolower(' +
                    val +
                    '))' +
                    ' or contains(tolower(' +
                    element +
                    '),tolower(' +
                    val.replaceAll('I', 'i') +
                    ')) ' +
                    ' or contains(tolower(' +
                    element +
                    '),tolower(' +
                    val.replaceAll('I', 'ı') +
                    ')) ' +
                    ' or contains(tolower(' +
                    element +
                    '),tolower(' +
                    val.replaceAll('İ', 'i') +
                    ')) ' +
                    ' or contains(tolower(' +
                    element +
                    '),tolower(' +
                    val.replaceAll('ı', 'i') +
                    ')) ' +
                    ' or contains(tolower(' +
                    element +
                    '),tolower(' +
                    val.replaceAll('ı', 'I') +
                    ')) )'
                );
            case 'notContains':
                return 'contains(' + element + ',' + val + ') eq false';
            case 'startsWith':
                return 'startswith(' + element + ',' + val + ')';
            case 'endsWith':
                return 'endswith(' + element + ',' + val + ')';
            case 'equals':
            case 'dateIs':
                return element + ' eq ' + val;
            case 'notEquals':
            case 'dateIsNot':
                return element + ' ne ' + val;
            case 'gte':
                return element + ' ge ' + val;
            case 'dateAfter':
                return element + ' gt ' + val;
            case 'lte':
                return element + ' le ' + val;
            case 'dateBefore':
                return element + ' lt ' + val;
            case 'in':
                return element + ' in ' + '(' + val + ')';

            default:
                return element + ' ' + filter.matchMode + ' ' + val;
        }
    }
}
