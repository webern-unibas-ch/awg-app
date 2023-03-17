import { ValueType, ValueTypeList } from '@awg-views/data-view/models';

/**
 * Object constant for the VALTYPE_TEXT type.
 */
const VALTYPE_TEXT = new ValueType(
    '1',
    'VALTYPE_TEXT',
    'Text',
    'textval',
    'guielement_id=1,2',
    'A value which is utf-8 text'
);

/**
 * Object constant for the INTEGER value type.
 */
const VALTYPE_INTEGER = new ValueType(
    '2',
    'VALTYPE_INTEGER',
    'Integer value',
    'ival',
    'guielement_id=1,3,4,5;min=numeric;max=numeric',
    'A value consisting of an integer value'
);

/**
 * Object constant for the FLOAT value type.
 */
const VALTYPE_FLOAT = new ValueType(
    '3',
    'VALTYPE_FLOAT',
    'Floating point number',
    'fval',
    'guielement_id=1,4;min=numeric;max=numeric',
    'A value consisting of a floating point number'
);

/**
 * Object constant for the DATE value type.
 */
const VALTYPE_DATE = new ValueType(
    '4',
    'VALTYPE_DATE',
    'Date',
    'dateval',
    'guielement_id=7',
    'A Value consisting of a date'
);

/**
 * Object constant for the PERIOD value type.
 */
const VALTYPE_PERIOD = new ValueType(
    '5',
    'VALTYPE_PERIOD',
    'Period',
    'dateval',
    'guielement_id=1;min=date;max=date;min=date;max=date',
    'A period consists of 2 date values interpreted as start and end of the period'
);

/**
 * Object constant for the RESPTR value type.
 */
const VALTYPE_RESPTR = new ValueType(
    '6',
    'VALTYPE_RESPTR',
    'Resource pointer',
    'ival',
    'guielement_id=3,6',
    'Foreign key of a resource this value is pointing to'
);

/**
 * Object constant for the SELECTION value type.
 */
const VALTYPE_SELECTION = new ValueType(
    '7',
    'VALTYPE_SELECTION',
    'Selection',
    'ival',
    'guielement_id=3,12',
    'A selection out of a set of values'
);

/**
 * Object constant for the TIME value type.
 */
const VALTYPE_TIME = new ValueType(
    '8',
    'VALTYPE_TIME',
    'Time',
    'timeval',
    'guielement_id=15,16',
    'A time in the form of hh:mm:ss.sss'
);

/**
 * Object constant for the INTERVAL value type.
 */
const VALTYPE_INTERVAL = new ValueType(
    '9',
    'VALTYPE_INTERVAL',
    'Interval',
    'timeval',
    'guielement_id=0',
    'An interval between ot two times (start-time, end-time)'
);

/**
 * Object constant for the GEOMETRY value type.
 */
const VALTYPE_GEOMETRY = new ValueType(
    '10',
    'VALTYPE_GEOMETRY',
    'Geometry',
    'textval',
    'guielement_id=8',
    'Figure geometry as JSON string'
);

/**
 * Object constant for the COLOR value type.
 */
const VALTYPE_COLOR = new ValueType(
    '11',
    'VALTYPE_COLOR',
    'Color',
    'textval',
    'guielement_id=9,1',
    'A color value in internet-notation (#rrggbb)'
);

/**
 * Object constant for the HLIST value type.
 */
const VALTYPE_HLIST = new ValueType(
    '12',
    'VALTYPE_HLIST',
    'Hierarchical list',
    'ival',
    'guielement_id=10',
    'Hierarchical list'
);

/**
 * Object constant for the ICONCLASS value type.
 */
const VALTYPE_ICONCLASS = new ValueType(
    '13',
    'VALTYPE_ICONCLASS',
    'Iconclass',
    'textval',
    'guielement_id=1',
    'Iconclass as defined by http://iconclass.org'
);

/**
 * Object constant for the RICHTEXT value type.
 */
const VALTYPE_RICHTEXT = new ValueType(
    '14',
    'VALTYPE_RICHTEXT',
    'Richtext',
    'richtext',
    'guielement_id=14',
    'This denotes a rich text value which in fact is a resource_reference to a rich text resource. The rich text resource should never be visible to the user directly...'
);

/**
 * Object constant for the GEONAME value type.
 */
const VALTYPE_GEONAME = new ValueType(
    '15',
    'VALTYPE_GEONAME',
    'Geoname',
    'geoname',
    'guielement_id=17',
    'Reference to geonames.org'
);

/**
 * Object constant for the value type list of the extended search.
 *
 * It provides a list of available value types.
 */
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
