export class SearchCompop {
    value: string;
    title: string;
    label: string;

    constructor(value: string, title: string, label: string) {
        this.value = value || '';
        this.title = title || '';
        this.label = label || '';
    }
}

class SearchCompopList {
    id: number;
    compopSet: SearchCompop[];
}

class SearchCompopLists {
    compopList: SearchCompopList[];
}

const EXISTS: SearchCompop = new SearchCompop('EXISTS', 'exists', '&exist;');
const MATCH: SearchCompop = new SearchCompop('MATCH', 'match', '&isin;');
const MATCH_BOOLEAN: SearchCompop = new SearchCompop('MATCH_BOOLEAN', 'match boolean', '&isin;&oplus;');
const EQ: SearchCompop = new SearchCompop('EQ', 'equal', '=');
const NOT_EQ: SearchCompop = new SearchCompop('!EQ', 'not equal', '&ne;');
const LIKE: SearchCompop = new SearchCompop('LIKE', 'like', '&sub;');
const NOT_LIKE: SearchCompop = new SearchCompop('!LIKE', 'not like', '&nsub;');
const GT: SearchCompop = new SearchCompop('GT', 'greater than', '&gt;');
const GT_EQ: SearchCompop = new SearchCompop('GT_EQ', 'greater equal than', '&ge;');
const LT: SearchCompop = new SearchCompop('LT', 'less than', '&lt;');
const LT_EQ: SearchCompop = new SearchCompop('LT_EQ', 'less equal than', '&le;');

export const SEARCH_COMPOP_LISTS: SearchCompopLists = {
    compopList: [
        // 1 TEXT --> gui text
        // 6 RESPTR GUI id 14 richtext --> gui text
        // 14 RICHTEXT --> gui text
        {
            id: 0,
            compopSet: [EXISTS, EQ, NOT_EQ, MATCH, MATCH_BOOLEAN, LIKE, NOT_LIKE],
        },

        // 2 INTEGER -> gui text
        // 3 FLOAT -> gui text
        {
            id: 1,
            compopSet: [EXISTS, EQ, NOT_EQ, GT, GT_EQ, LT, LT_EQ],
        },

        // 4 DATE -> gui datepicker
        // 5 PERIOD -> gui datepicker
        // Without !EQ
        {
            id: 2,
            compopSet: [EXISTS, EQ, GT, GT_EQ, LT, LT_EQ],
        },

        // 6 RESPTR GUI id 3 --> gui pulldown,
        // 6 RESPTR GUI id 6 --> gui searchbox
        // 7 SELECTION --> gui pulldown,
        // 11 COLOR --> gui colorpicker,
        // 12 HLIST --> gui hlist,
        // 15 GEONAME --> gui geoname
        {
            id: 3,
            compopSet: [EXISTS, EQ],
        },

        // 13 ICONCLASS --> gui ??
        {
            id: 4,
            compopSet: [EXISTS, EQ, LIKE],
        },
    ],
};

class ValueType {
    id: string;
    label: string;
    typeName: string;
    typeValue: string;
    options: string;
    description: string;

    constructor(id: string, label: string, typeName: string, typeValue: string, options: string, description: string) {
        this.id = id || '';
        this.label = label || '';
        this.typeName = typeName || '';
        this.typeValue = typeValue || '';
        this.options = options || '';
        this.description = description || '';
    }
}

class ValueTypeList {
    typeList: ValueType[];
}

const VALTYPE_TEXT = new ValueType(
    '1',
    'VALTYPE_TEXT',
    'Text',
    'textval',
    'guielement_id=1,2',
    'A value which is utf-8 text'
);
const VALTYPE_INTEGER = new ValueType(
    '2',
    'VALTYPE_INTEGER',
    'Integer value',
    'ival',
    'guielement_id=1,3,4,5;min=numeric;max=numeric',
    'A value consisting of an integer value'
);
const VALTYPE_FLOAT = new ValueType(
    '3',
    'VALTYPE_FLOAT',
    'Floating point number',
    'fval',
    'guielement_id=1,4;min=numeric;max=numeric',
    'A value consisting of a floating point number'
);
const VALTYPE_DATE = new ValueType(
    '4',
    'VALTYPE_DATE',
    'Date',
    'dateval',
    'guielement_id=7',
    'A Value consisting of a date'
);
const VALTYPE_PERIOD = new ValueType(
    '5',
    'VALTYPE_PERIOD',
    'Period',
    'dateval',
    'guielement_id=1;min=date;max=date;min=date;max=date',
    'A period consists of 2 date values interpreted as start and end of the period'
);
const VALTYPE_RESPTR = new ValueType(
    '6',
    'VALTYPE_RESPTR',
    'Resource pointer',
    'ival',
    'guielement_id=3,6',
    'Foreign key of a resource this value is pointing to'
);
const VALTYPE_SELECTION = new ValueType(
    '7',
    'VALTYPE_SELECTION',
    'Selection',
    'ival',
    'guielement_id=3,12',
    'A selection out of a set of values'
);
const VALTYPE_TIME = new ValueType(
    '8',
    'VALTYPE_TIME',
    'Time',
    'timeval',
    'guielement_id=15,16',
    'A time in the form of hh:mm:ss.sss'
);
const VALTYPE_INTERVAL = new ValueType(
    '9',
    'VALTYPE_INTERVAL',
    'Interval',
    'timeval',
    'guielement_id=0',
    'An interval between ot two times (start-time, end-time)'
);
const VALTYPE_GEOMETRY = new ValueType(
    '10',
    'VALTYPE_GEOMETRY',
    'Geometry',
    'textval',
    'guielement_id=8',
    'Figure geometry as JSON string'
);
const VALTYPE_COLOR = new ValueType(
    '11',
    'VALTYPE_COLOR',
    'Color',
    'textval',
    'guielement_id=9,1',
    'A color value in internet-notation (#rrggbb)'
);
const VALTYPE_HLIST = new ValueType(
    '12',
    'VALTYPE_HLIST',
    'Hierarchical list',
    'ival',
    'guielement_id=10',
    'Hierarchical list'
);
const VALTYPE_ICONCLASS = new ValueType(
    '13',
    'VALTYPE_ICONCLASS',
    'Iconclass',
    'textval',
    'guielement_id=1',
    'Iconclass as defined by http://iconclass.org'
);
const VALTYPE_RICHTEXT = new ValueType(
    '14',
    'VALTYPE_RICHTEXT',
    'Richtext',
    'richtext',
    'guielement_id=14',
    'This denotes a rich text value which in fact is a resource_reference to a rich text resource. The rich text resource should never be visible to the user directly...'
);
const VALTYPE_GEONAME = new ValueType(
    '15',
    'VALTYPE_GEONAME',
    'Geoname',
    'geoname',
    'guielement_id=17',
    'Reference to geonames.org'
);

export const VALUETYPE_LIST: ValueTypeList = {
    typeList: [
        VALTYPE_TEXT,
        VALTYPE_INTEGER,
        VALTYPE_FLOAT,
        VALTYPE_DATE,
        VALTYPE_PERIOD,
        VALTYPE_RESPTR,
        VALTYPE_SELECTION,
        VALTYPE_TIME,
        VALTYPE_INTERVAL,
        VALTYPE_GEOMETRY,
        VALTYPE_COLOR,
        VALTYPE_HLIST,
        VALTYPE_ICONCLASS,
        VALTYPE_RICHTEXT,
        VALTYPE_GEONAME,
    ],
};
