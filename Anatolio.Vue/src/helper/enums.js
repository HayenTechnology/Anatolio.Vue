
const enums = {
    "DashboardType": [
        {
            "name": "PageDashboard",
            "value": "PageDashboard",
            "number": 0,
        },
        {
            "name": "WidgetDetailDashboard",
            "value": "WidgetDetailDashboard",
            "number": 1,
        }
    ],
    "AccessType": [
        {
            "name": "Public",
            "value": "Public",
            "number": 1,
        },
        {
            "name": "Private",
            "value": "Private",
            "number": 2,
        }
    ],
    "PeriodType": [

        {
            "name": "Second",
            "value": "Second",
            "number": 1,
        },
        {
            "name": "Minute",
            "value": "Minute",
            "number": 2,
        },
        {
            "name": "Hour",
            "value": "Hour",
            "number": 3,
        },
        {
            "name": "Day",
            "value": "Day",
            "number": 4,
        },
        {
            "name": "Week",
            "value": "Week",
            "number": 5,
        },
        {
            "name": "Month",
            "value": "Month",
            "number": 6,
        },
        {
            "name": "Year",
            "value": "Year",
            "number": 7,
        },
    ],
    "DateFormat": [
        {
            "name": "Row",
            "value": "Row",
            "number": 0,
        },
        {
            "name": "yyyymmdd",
            "value": "yyyymmdd",
            "number": 1,
        },
        {
            "name": "yyyymmmdd",
            "value": "yyyymmmdd",
            "number": 2,
        },
        {
            "name": "yyyymmddhhmm",
            "value": "yyyymmddhhmm",
            "number": 3,
        },
        {
            "name": "yyyymmmddhhmm",
            "value": "yyyymmmddhhmm",
            "number": 4,
        },
        {
            "name": "yyyymmddhhmmss",
            "value": "yyyymmddhhmmss",
            "number": 5,
        },
        {
            "name": "yyyy",
            "value": "yyyy",
            "number": 6,
        },
        {
            "name": "mmm",
            "value": "mmm",
            "number": 7,
        },
        {
            "name": "ddd",
            "value": "ddd",
            "number": 8,
        },
        {
            "name": "yyyymm",
            "value": "yyyymm",
            "number": 9,
        },
        {
            "name": "yyyymmm",
            "value": "yyyymmm",
            "number": 10,
        },
        {
            "name": "mmdd",
            "value": "mmdd",
            "number": 11,
        },
        {
            "name": "mmmdd",
            "value": "mmmdd",
            "number": 12,
        }
    ],
    "AnatolioDataType": [
        {
            "name": "Text",
            "value": "Text"
        },
        {
            "name": "Date",
            "value": "Date"
        },
        {
            "name": "Boolean",
            "value": "Boolean"
        },
        {
            "name": "Enum",
            "value": "Enum"
        },
        {
            "name": "Number",
            "value": "Number"
        }
    ],
    "OutputType": [
        {
            "name": "Text",
            "value": "Text"
        },
        {
            "name": "Date",
            "value": "Date"
        },
        {
            "name": "Boolean",
            "value": "Boolean"
        },
        {
            "name": "Enum",
            "value": "Enum"
        },
        {
            "name": "Number",
            "value": "Number"
        }
    ],
    "InputType": [
        {
            "name": "Text",
            "value": "Text"
        },
        {
            "name": "Date",
            "value": "Date"
        },
        {
            "name": "Month",
            "value": "Month"
        },
        {
            "name": "Year",
            "value": "Year"
        },
        {
            "name": "DateTime",
            "value": "DateTime"
        },
        {
            "name": "DateRange",
            "value": "DateRange"
        },
        {
            "name": "DateTimeRange",
            "value": "DateTimeRange"
        },
        {
            "name": "EntitySelect",
            "value": "EntitySelect"
        },
        {
            "name": "EnumSelect",
            "value": "EnumSelect"
        },
        {
            "name": "Checkbox",
            "value": "Checkbox"
        },
        {
            "name": "Number",
            "value": "Number"
        }
    ],

}
var enumTypes = [];
for (let prop in enums) {
    enumTypes.push({
        "name": prop,
        "value": prop
    })
}
enums["EnumTypes"] = enumTypes;

export default enums;