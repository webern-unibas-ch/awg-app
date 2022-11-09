import { EditionComplex } from './edition-complex.model';
import { EditionRouteConstant } from './edition-constants';

/**
 * The EditionOutlineSeries interface.
 *
 * It is used in the context of the edition view
 * to structure outline information of the edition series.
 */
export interface EditionOutlineSeries {
    /**
     * The series route of an edition series.
     */
    series: EditionRouteConstant;

    /**
     * The section route of an edition series.
     */
    sections: EditionOutlineSection[];
}

/**
 * The EditionOutlineSection interface.
 *
 * It is used in the context of the edition view
 * to structure outline information of the edition sections.
 */
export interface EditionOutlineSection {
    /**
     * The section route of an edition section.
     */
    section: EditionRouteConstant;

    /**
     * The edition complexes of an edition section.
     */
    complexes: EditionOutlineComplex[];

    /**
     * Boolean flag if an edition section is disabled.
     */
    disabled: boolean;
}

/**
 * The EditionOutlineComplex interface.
 *
 * It is used in the context of the edition view
 * to structure outline information of an edition complex.
 */
export interface EditionOutlineComplex {
    /**
     * The edition complex.
     */
    complex: EditionComplex;

    /**
     * Boolean flag if an edition complex is disabled.
     */
    disabled: boolean;
}
