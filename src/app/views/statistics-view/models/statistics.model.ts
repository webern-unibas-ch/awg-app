/**
 * The EditionStatisticsSectionBreakdown interface.
 *
 * It is used to structure the breakdown statistics of a section within a series.
 */
export interface EditionStatisticsSectionBreakdown {
    /**
     * The section identifier.
     */
    section: string;

    /**
     * Boolean flag if the section is disabled.
     */
    disabled: boolean;

    /**
     * The total number of complexes in the section.
     */
    complexes: number;

    /**
     * The number of available complexes in the section.
     */
    available: number;

    /**
     * The availability rate for the section.
     */
    availabilityRate: number;

    /**
     * The breakdown by complex type in the section.
     */
    complexTypeBreakdown: EditionStatisticsComplexTypeBreakdown;

    /**
     * The breakdown of available complex types in the section.
     */
    availableComplexTypeBreakdown: EditionStatisticsComplexTypeBreakdown;
}

/**
 * The EditionStatisticsSeriesBreakdown interface.
 *
 * It is used to structure the breakdown statistics of an edition series.
 */
export interface EditionStatisticsSeriesBreakdown {
    /**
     * The series identifier.
     */
    series: string;

    /**
     * The number of sections in the series.
     */
    sections: number;

    /**
     * The total number of complexes in the series.
     */
    complexes: number;

    /**
     * The number of available complexes in the series.
     */
    available: number;

    /**
     * The availability rate for the series.
     */
    availabilityRate: number;

    /**
     * The breakdown by sections within the series.
     */
    sectionBreakdown: EditionStatisticsSectionBreakdown[];

    /**
     * The breakdown by complex type in the series.
     */
    complexTypeBreakdown: EditionStatisticsComplexTypeBreakdown;

    /**
     * The breakdown of available complex types in the series.
     */
    availableComplexTypeBreakdown: EditionStatisticsComplexTypeBreakdown;
}

/**
 * The EditionStatisticsComplexTypeBreakdown interface.
 *
 * It is used to structure the breakdown statistics by complex type.
 */
export interface EditionStatisticsComplexTypeBreakdown {
    /**
     * The number of opus complexes.
     */
    opus: number;

    /**
     * The number of mnr complexes (starting with 'm').
     */
    mnr: number;

    /**
     * The number of mnr_x complexes (starting with 'mx').
     */
    mnrX: number;
}

/**
 * The EditionStatistics interface.
 *
 * It is used to structure the complete statistics of the edition.
 */
export interface EditionStatistics {
    /**
     * The total number of series.
     */
    totalSeries: number;

    /**
     * The number of active series (series with at least one active section or complex).
     */
    activeSeries: number;

    /**
     * The total number of sections.
     */
    totalSections: number;

    /**
     * The total number of complexes.
     */
    totalComplexes: number;

    /**
     * The number of available complexes.
     */
    availableComplexes: number;

    /**
     * The overall availability rate.
     */
    availabilityRate: number;

    /**
     * The breakdown by series.
     */
    seriesBreakdown: EditionStatisticsSeriesBreakdown[];

    /**
     * The breakdown by complex type.
     */
    complexTypeBreakdown: EditionStatisticsComplexTypeBreakdown;

    /**
     * The breakdown of available complex types.
     */
    availableComplexTypeBreakdown: EditionStatisticsComplexTypeBreakdown;
}
