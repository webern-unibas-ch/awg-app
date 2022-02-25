/**
 * The SearchCompop class.
 *
 * It is used in the context of the extended search
 * to store the data for a comparison operator.
 */
export class SearchCompop {
    /**
     * The value of a comparison operator.
     */
    value: string;

    /**
     * The title of a comparison operator.
     */
    title: string;

    /**
     * The label of a comparison operator.
     */
    label: string;

    /**
     * Constructor of the SearchCompop class.
     *
     * It initializes the class with given values
     * for value, title, and label.
     *
     * @param {string} value The given compop value.
     * @param {string} title The given compop title.
     * @param {string} label The given compop label.
     */
    constructor(value: string, title: string, label: string) {
        this.value = value || '';
        this.title = title || '';
        this.label = label || '';
    }
}

/**
 * The SearchCompopSet class.
 *
 * It is used in the context of the extended search
 * to store the data for a set of comparison operators.
 */
class SearchCompopSet {
    /**
     * The id of a comparison operator list.
     */
    id: number;

    /**
     * The set of comparison operators.
     */
    compopSet: SearchCompop[];
}

/**
 * The SearchCompopSetsList class.
 *
 * It is used in the context of the extended search
 * to store the data for a list of comparison operator sets.
 */
class SearchCompopSetsList {
    /**
     * The list of comparison operator sets.
     */
    compopList: SearchCompopSet[];
}

/**
 * Object constant for the EXISTS comparison operator.
 */
const EXISTS: SearchCompop = new SearchCompop('EXISTS', 'exists', '&exist;');

/**
 * Object constant for the MATCH comparison operator.
 */
const MATCH: SearchCompop = new SearchCompop('MATCH', 'match', '&isin;');

/**
 * Object constant for the MATCH_BOOLEAN comparison operator.
 */
const MATCH_BOOLEAN: SearchCompop = new SearchCompop('MATCH_BOOLEAN', 'match boolean', '&isin;&oplus;');

/**
 * Object constant for the EQ comparison operator.
 */
const EQ: SearchCompop = new SearchCompop('EQ', 'equal', '=');

/**
 * Object constant for the NOT_EQ comparison operator.
 */
const NOT_EQ: SearchCompop = new SearchCompop('!EQ', 'not equal', '&ne;');

/**
 * Object constant for the LIKE comparison operator.
 */
const LIKE: SearchCompop = new SearchCompop('LIKE', 'like', '&sub;');

/**
 * Object constant for the NOT_LIKE comparison operator.
 */
const NOT_LIKE: SearchCompop = new SearchCompop('!LIKE', 'not like', '&nsub;');

/**
 * Object constant for the GT comparison operator.
 */
const GT: SearchCompop = new SearchCompop('GT', 'greater than', '&gt;');

/**
 * Object constant for the GT_EQ comparison operator.
 */
const GT_EQ: SearchCompop = new SearchCompop('GT_EQ', 'greater equal than', '&ge;');

/**
 * Object constant for the LT comparison operator.
 */
const LT: SearchCompop = new SearchCompop('LT', 'less than', '&lt;');

/**
 * Object constant for the LT_EQ comparison operator.
 */
const LT_EQ: SearchCompop = new SearchCompop('LT_EQ', 'less equal than', '&le;');

/**
 * Object constant for the search compop sets list of the extended search.
 *
 * It provides a list of available search compop sets.
 */
export const SEARCH_COMPOP_SETS_LIST: SearchCompopSetsList = {
    compopList: [
        // Edge case for uncatched value types
        {
            id: 0,
            compopSet: [EXISTS],
        },
        // 6 RESPTR GUI id 3 --> gui pulldown,
        // 6 RESPTR GUI id 6 --> gui searchbox
        // 7 SELECTION --> gui pulldown,
        // 11 COLOR --> gui colorpicker,
        // 12 HLIST --> gui hlist,
        // 15 GEONAME --> gui geoname
        {
            id: 1,
            compopSet: [EXISTS, EQ],
        },

        // 13 ICONCLASS --> gui ??
        {
            id: 2,
            compopSet: [EXISTS, EQ, LIKE],
        },

        // 4 DATE -> gui datepicker
        // 5 PERIOD -> gui datepicker
        // Without !EQ
        {
            id: 3,
            compopSet: [EXISTS, EQ, GT, GT_EQ, LT, LT_EQ],
        },

        // 2 INTEGER -> gui text
        // 3 FLOAT -> gui text
        {
            id: 4,
            compopSet: [EXISTS, EQ, NOT_EQ, GT, GT_EQ, LT, LT_EQ],
        },

        // 1 TEXT --> gui text
        // 6 RESPTR GUI id 14 richtext --> gui text
        // 14 RICHTEXT --> gui text
        {
            id: 5,
            compopSet: [EXISTS, EQ, NOT_EQ, MATCH, MATCH_BOOLEAN, LIKE, NOT_LIKE],
        },
    ],
};
