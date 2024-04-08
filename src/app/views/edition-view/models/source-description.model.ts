/**
 * The SourceDescriptionSystemRow class.
 *
 * It is used in the context of the edition view
 * to store the data for a system row of a source description
 * from a source description json file.
 */
export class SourceDescriptionSystemRow {
    /**
     * The type of the row (optional).
     */
    rowType?: string;

    /**
     * The base of the row (optional).
     */
    rowBase?: string;

    /**
     * The number of the row (optional).
     */
    rowNumber?: string;
}

/**
 * The SourceDescriptionSystem class.
 *
 * It is used in the context of the edition view
 * to store the data for a system of a source description
 * from a source description json file.
 */
export class SourceDescriptionSystem {
    /**
     * The system label (optional).
     */
    system?: string;

    /**
     * The system description (optional).
     */
    systemDescription?: string;

    /**
     * The measure label (optional).
     */
    measure?: string;

    /**
     * The link to a certain measure range of an svg sheet (optional).
     */
    linkTo?: string;

    /**
     * The system rows (optional).
     */
    row?: SourceDescriptionSystemRow;
}

/**
 * The SourceDescriptionFolio class.
 *
 * It is used in the context of the edition view
 * to store the data for a folio of a source description
 * from a source description json file.
 */
export class SourceDescriptionFolio {
    /**
     * The folio label (optional).
     */
    folio?: string;

    /**
     * The folio link (optional).
     */
    folioLinkTo?: string;

    /**
     * The folio description (optional).
     */
    folioDescription?: string;

    /**
     * The systemGroups of a folio (optional).
     */
    systemGroups?: SourceDescriptionSystem[][];
}

/**
 * The SourceDescriptionContent class.
 *
 * It is used in the context of the edition view
 * to store the data for the content of a source description
 * from a source description json file.
 */
export class SourceDescriptionContent {
    /**
     * The content item (optional).
     */
    item?: string;

    /**
     * The content item link (optional).
     */
    itemLinkTo?: { complexId?: string; sheetId?: string };

    /**
     * The content item description (optional).
     */
    itemDescription?: string;

    /**
     * The folios of the content item (optional).
     */
    folios?: SourceDescriptionFolio[];
}

/**
 * The SourceDescriptionWritingMaterialDimension class.
 *
 * It is used in the context of the edition view
 * to store the data for the dimensions of the writing material of a source description
 * from a source description json file.
 */
export class SourceDescriptionWritingMaterialDimension {
    /**
     * The uncertainty of the dimension of the writing material (optional).
     */
    uncertainty?: string;

    /**
     * The value of the dimension of the writing material (optional).
     */
    value?: string;
}

/**
 * The SourceDescriptionWritingMaterialFormat class.
 *
 * It is used in the context of the edition view
 * to store the data for the format of the writing material of a source description
 * from a source description json file.
 */
export class SourceDescriptionWritingMaterialFormat {
    /**
     * The orientation of the writing material (optional).
     */
    orientation?: string;

    /**
     * The height dimensions of the writing material (optional).
     */
    height?: SourceDescriptionWritingMaterialDimension;

    /**
     * The width dimensions of the writing material (optional).
     */
    width?: SourceDescriptionWritingMaterialDimension;
}

/**
 * The SourceDescriptionWritingMaterialFirmSign class.
 *
 * It is used in the context of the edition view
 * to store the data for the firm sign of the writing material of a source description
 * from a source description json file.
 */
export class SourceDescriptionWritingMaterialFirmSign {
    /**
     * The variant of the firm sign used on the writing material (optional).
     */
    variant?: string;

    /**
     * An alternative string for the firm sign used on the writing material (optional).
     */
    alt?: string;

    /**
     * The location of the firm sign on the writing material (optional).
     */
    location?: SourceDescriptionWritingMaterialItemLocation[];
}

/**
 * The SourceDescriptionWritingMaterialItemLocation class.
 *
 * It is used in the context of the edition view
 * to store the data for the location of an item oof the writing material of a source description
 * from a source description json file.
 */
export class SourceDescriptionWritingMaterialItemLocation {
    /**
     * An additional info to the item location on the writing material (optional).
     */
    info?: string;

    /**
     * The folios on which the item is placed on the writing material (optional).
     */
    folios?: string[];

    /**
     * The position of the item on the writing material (optional).
     */
    position?: string;
}

/**
 * The SourceDescriptionWritingMaterialSystems class.
 *
 * It is used in the context of the edition view
 * to store the data for the systems of the writing material of a source description
 * from a source description json file.
 */
export class SourceDescriptionWritingMaterialSystems {
    /**
     * The number of systems available (optional).
     */
    number?: number;

    /**
     * Another info to the number of systems available (optional).
     */
    info?: string;

    /**
     * An addendum to the systems available (optional).
     */
    addendum?: string;
}

/**
 * The SourceDescriptionWritingMaterialWatermark class.
 *
 * It is used in the context of the edition view
 * to store the data for the watermark of the writing material of a source description
 * from a source description json file.
 */
export class SourceDescriptionWritingMaterialWatermark {
    /**
     * The variant of the watermark (optional).
     */
    variant?: string;

    /**
     * An alternative string for the watermark used on the writing material (optional).
     */
    alt?: string;

    /**
     * The location of the watermark on the writing material (optional).
     */
    location?: SourceDescriptionWritingMaterialItemLocation[];
}

/**
 * The SourceDescriptionWritingMaterial class.
 *
 * It is used in the context of the edition view
 * to store the data for the writing material of a source description
 * from a source description json file.
 */
export class SourceDescriptionWritingMaterial {
    /**
     * The paper type of the writing material (optional).
     */
    paperType?: string;

    /**
     * The systems of the writing material (optional).
     */
    systems?: SourceDescriptionWritingMaterialSystems;

    /**
     * The format of the writing material (optional).
     */
    format?: SourceDescriptionWritingMaterialFormat;

    /**
     * The firm sign of the writing material (optional).
     */
    firmSign?: SourceDescriptionWritingMaterialFirmSign;

    /**
     * The watermark of the writing material (optional).
     */
    watermark?: SourceDescriptionWritingMaterialWatermark;

    /**
     * The folio addendum of the writing material (optional).
     */
    folioAddendum?: string;
}

/**
 * The SourceDescriptionWritingInstruments class.
 *
 * It is used in the context of the edition view
 * to store the data for the writing instruments of a source description
 * from a source description json file.
 */
export class SourceDescriptionWritingInstruments {
    /**
     * The main writing instrument used in a source (optional).
     */
    main?: string;

    /**
     * The secondary writing instruments used in a source (optional).
     */
    secondary?: string[];
}

/**
 * The SourceDescriptionDesc class.
 *
 * It is used in the context of the edition view
 * to store the data for the description of a source description
 * from a source description json file.
 */
export class SourceDescriptionDesc {
    /**
     * The description of a source (optional).
     */
    desc?: string[];

    /**
     * The string representation of a writing material used for a source (optional).
     */
    writingMaterialString?: string;

    /**
     * The writing material used for a source (optional).
     */
    writingMaterial?: SourceDescriptionWritingMaterial[];

    /**
     * The writing instruments used in a source (optional).
     */
    writingInstruments?: SourceDescriptionWritingInstruments;

    /**
     * A title as it appears in a source (optional).
     */
    title?: string;

    /**
     * A date as it appears in a source (optional).
     */
    date?: string;

    /**
     * The pagination as it appears in a source (optional).
     */
    pagination?: string;

    /**
     * Measure numbers as they appear in a source (optional).
     */
    measureNumbers?: string;

    /**
     * The instrumentation as it appears in a source (optional).
     */
    instrumentation?: string;

    /**
     * Annotations as they appear in a source (optional).
     */
    annotations?: string;

    /**
     * The content of a source (optional).
     */
    content?: SourceDescriptionContent[];
}

/**
 * The SourceDescription class.
 *
 * It is used in the context of the edition view
 * to store the data for a single source description
 * from a source description json file.
 */
export class SourceDescription {
    /**
     * The id of a sourceDescription.
     */
    id: string;

    /**
     * The siglum of a sourceDescription.
     */
    siglum: string;

    /**
     * The addendum to a siglum of a sourceDescription (optional).
     */
    siglumAddendum?: string;

    /**
     * The type description of a source.
     */
    type: string;

    /**
     * The physical location of a source.
     */
    location: string;

    /**
     * The description of a sourceDescription.
     */
    description: SourceDescriptionDesc;
}

/**
 * The SourceDescriptionList class.
 *
 * It is used in the context of the edition view
 * to store the data for a source description list
 * from a source description json file.
 */
export class SourceDescriptionList {
    /**
     * The array of sources from a source description list.
     */
    sources: SourceDescription[];
}
