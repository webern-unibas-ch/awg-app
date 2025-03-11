import { Textcritics } from './textcritics.model';

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
     * The flag if the folios are considered as pages (optional).
     */
    isPage?: boolean;

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
 * The SourceDescriptionWritingMaterialDimensions class.
 *
 * It is used in the context of the edition view
 * to store the data for the dimensions of the writing material of a source description
 * from a source description json file.
 */
export class SourceDescriptionWritingMaterialDimensions {
    /**
     * The orientation of the writing material (optional).
     */
    orientation?: string;

    /**
     * The height of the writing material (optional).
     */
    height?: SourceDescriptionWritingMaterialDimension;

    /**
     * The width of the writing material (optional).
     */
    width?: SourceDescriptionWritingMaterialDimension;

    /**
     * The unit of the dimensions of the writing material (optional).
     */
    unit?: string;
}

/**
 * The SourceDescriptionWritingMaterialTrademark class.
 *
 * It is used in the context of the edition view
 * to store the data for the trademark of the writing material of a source description
 * from a source description json file.
 */
export class SourceDescriptionWritingMaterialTrademark {
    /**
     * The variant of the trademark used on the writing material (optional).
     */
    variant?: string;

    /**
     * An alternative string for the trademark used on the writing material (optional).
     */
    alt?: string;

    /**
     * The location of the trademark on the writing material (optional).
     */
    locus?: SourceDescriptionWritingMaterialItemLocus[];
}

/**
 * The SourceDescriptionWritingMaterialItemLocus class.
 *
 * It is used in the context of the edition view
 * to store the data for the locus of an item of the writing material of a source description
 * from a source description json file.
 */
export class SourceDescriptionWritingMaterialItemLocus {
    /**
     * An additional info to the item locus on the writing material placed before the folios (optional).
     */
    preFolioInfo?: string;

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
     * The total number of systems available (optional).
     */
    totalSystems?: number;

    /**
     * An addendum to the total number of systems available (optional) to be displayed in parentheses.
     */
    totalSystemsAddendum?: string;

    /**
     * Additional info regarding the systems available (optional).
     */
    additionalInfo?: string;
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
     * The locus of the watermark on the writing material (optional).
     */
    locus?: SourceDescriptionWritingMaterialItemLocus[];
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
     * The type of the writing material (optional).
     */
    materialType?: string;

    /**
     * The systems of the writing material (optional).
     */
    systems?: SourceDescriptionWritingMaterialSystems;

    /**
     * The dimensions of the writing material (optional).
     */
    dimensions?: SourceDescriptionWritingMaterialDimensions;

    /**
     * The trademark of the writing material (optional).
     */
    trademark?: SourceDescriptionWritingMaterialTrademark;

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
 * The SourceDescriptionPhysDesc class.
 *
 * It is used in the context of the edition view
 * to store the data for the physical description of a source description
 * from a source description json file.
 */
export class SourceDescriptionPhysDesc {
    /**
     * The conditions of a source (optional).
     */
    conditions?: string[];

    /**
     * The string representation of writing materials used for a source (optional).
     */
    writingMaterialStrings?: string[];

    /**
     * The writing materials used for a source (optional).
     */
    writingMaterials?: SourceDescriptionWritingMaterial[];

    /**
     * The writing instruments used in a source (optional).
     */
    writingInstruments?: SourceDescriptionWritingInstruments;

    /**
     * One or multiple titles as they appear in a source (optional).
     */
    titles?: string[];

    /**
     * One or multiple dates as they appear in a source (optional).
     */
    dates?: string[];

    /**
     * One or multiple paginations as they appear in a source (optional).
     */
    paginations?: string[];

    /**
     * One or multiple measure numbers as they appear in a source (optional).
     */
    measureNumbers?: string[];

    /**
     * One or multiple instrumentations as they appear in a source (optional).
     */
    instrumentations?: string[];

    /**
     * One or multiple annotations as they appear in a source (optional).
     */
    annotations?: string[];

    /**
     * The content of a source (optional).
     */
    contents?: SourceDescriptionContent[];

    /**
     * The corrections lists of a source (optional).
     */
    corrections?: Textcritics[];
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
     * The flag if a source is missing (optional).
     */
    missing?: boolean;

    /**
     * The type description of a source.
     */
    type: string;

    /**
     * The physical location of a source.
     */
    location: string;

    /**
     * The physical description of a sourceDescription.
     */
    physDesc: SourceDescriptionPhysDesc;
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
