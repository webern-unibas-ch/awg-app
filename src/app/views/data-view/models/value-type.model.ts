/**
 * The ValueType class.
 *
 * It is used in the context of the extended search
 * to store the data for a value type.
 */
export class ValueType {
    /**
     * The id of a value type.
     */
    id: string;

    /**
     * The label of a value type.
     */
    label: string;

    /**
     * The typeName of a value type.
     */
    typeName: string;

    /**
     * The typeValue of a value type.
     */
    typeValue: string;

    /**
     * The options of a value type.
     */
    options: string;

    /**
     * The description of a value type.
     */
    description: string;

    /**
     * Constructor of the ValueType class.
     *
     * It initializes the class with given values
     * for id, label, typeName, typeValue, options, and description.
     *
     * @param {string} id The given type id.
     * @param {string} label The given type label.
     * @param {string} typeName The given type name.
     * @param {string} typeValue The given type value.
     * @param {string} options The given type options.
     * @param {string} description The given type description.
     */
    constructor(id: string, label: string, typeName: string, typeValue: string, options: string, description: string) {
        this.id = id || '';
        this.label = label || '';
        this.typeName = typeName || '';
        this.typeValue = typeValue || '';
        this.options = options || '';
        this.description = description || '';
    }
}

/**
 * The ValueTypeList class.
 *
 * It is used in the context of the extended search
 * to store the data for a list of value types.
 */
export class ValueTypeList {
    /**
     * The list of value types.
     */
    typeList: ValueType[];
}
