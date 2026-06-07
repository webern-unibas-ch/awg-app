import { IconDefinition } from '@fortawesome/angular-fontawesome';

/**
 * The StatisticsBreakDownBadge interface.
 *
 * It defines the structure for a badge representing a breakdown of complex types in statistics.
 */
export interface StatisticsBreakDownBadge {
    label: string;
    val: number;
    type: string;
}

/**
 * The StatisticsComplexType type.
 *
 * It defines the valid complex types for statistics breakdowns.
 */
export type StatisticsComplexType = keyof StatisticsComplexBreakdown;

/**
 * The StatisticsComplexCounter type.
 *
 * It defines the structure for a counter function to register complexes in statistics models.
 */
export interface StatisticsComplexCounter {
    /**
     * The counter function to register one complex in statistics.
     *
     * @param complexType The complex type.
     * @param isAvailable Flag indicating whether the complex is available.
     */
    registerComplex: (complexType: StatisticsComplexType, isAvailable: boolean) => void;
}

/**
 * The StatisticsProgressBarItem interface.
 *
 * It defines the structure for items used in progress bars within the statistics view.
 */
export interface StatisticsProgressBarItem {
    /**
     * The key corresponding to the complex type in the breakdown.
     */
    key: keyof StatisticsComplexBreakdown;

    /**
     * The base label for the progress bar item, used for display purposes.
     */
    baseLabel: string;

    /**
     * The background color class for the progress bar item.
     */
    colorClass: string;
}

/**
 * The StatisticsSummaryCardData interface.
 *
 * It represents the data structure for a statistics summary card.
 */
export interface StatisticsSummaryCardData {
    /**
     * The title of the statistics card.
     */
    title: string;

    /**
     * The value to display in the statistics card.
     */
    value: number | string;

    /**
     * The FontAwesome icon class for the card.
     */
    icon: IconDefinition;

    /**
     * The Bootstrap background color class for the card.
     */
    bgClass: string;
}

/**
 * The StatisticsComplexBreakdown class.
 *
 * It provides default zero values for complex breakdown counters.
 */
export class StatisticsComplexBreakdown {
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

    /**
     * Constructor of the StatisticsComplexBreakdown class.
     *
     * It initializes the complex breakdown with optional values, defaulting to zero.
     *
     * @param values Optional initial values for the breakdown.
     */
    constructor(values: Partial<StatisticsComplexBreakdown> = {}) {
        this.opus = values.opus ?? 0;
        this.mnr = values.mnr ?? 0;
        this.mnrX = values.mnrX ?? 0;
    }
}

/**
 * The StatisticsBreakdownBase class.
 *
 * It provides shared complex type breakdown counters for statistics models.
 */
abstract class StatisticsBreakdownBase {
    /**
     * The total number of complexes.
     */
    totalComplexes = 0;

    /**
     * The number of available complexes.
     */
    availableComplexes = 0;

    /**
     * The progress rate.
     */
    progressRate = 0;

    /**
     * The breakdown by complex category.
     */
    complexBreakdown: StatisticsComplexBreakdown;

    /**
     * The breakdown of available complexes by category.
     */
    availableComplexBreakdown: StatisticsComplexBreakdown;

    /**
     * Constructor of the StatisticsBreakdownBase class.
     *
     * It initializes the shared complex breakdown counters.
     */
    protected constructor() {
        this.complexBreakdown = new StatisticsComplexBreakdown();
        this.availableComplexBreakdown = new StatisticsComplexBreakdown();
    }

    /**
     * Registers one complex in statistics.
     *
     * @param complexType The complex type.
     * @param isAvailable Flag indicating whether the complex is available.
     */
    registerComplex(complexType: StatisticsComplexType, isAvailable: boolean): void {
        this.totalComplexes++;
        this.complexBreakdown[complexType]++;

        if (isAvailable) {
            this.availableComplexes++;
            this.availableComplexBreakdown[complexType]++;
        }
    }
}

/**
 * The StatisticsSectionBreakdown class.
 *
 * It provides default zero values for section breakdown counters.
 */
export class StatisticsSectionBreakdown extends StatisticsBreakdownBase {
    /**
     * The section identifier.
     */
    section: string;

    /**
     * Boolean flag if the section is disabled.
     */
    disabled: boolean;

    /**
     * Constructor of the StatisticsSectionBreakdown class.
     *
     * It initializes the section breakdown with the given section identifier and disabled flag.
     *
     * @param section The section identifier.
     * @param disabled Boolean flag if the section is disabled.
     */
    constructor(section: string, disabled: boolean) {
        super();
        this.section = section;
        this.disabled = disabled;
    }
}

/**
 * The StatisticsSeriesBreakdown class.
 *
 * It provides default zero values for series breakdown counters.
 */
export class StatisticsSeriesBreakdown extends StatisticsBreakdownBase {
    /**
     * The series identifier.
     */
    series: string;

    /**
     * The number of sections in the series.
     */
    sections = 0;

    /**
     * The breakdown by sections within the series.
     */
    sectionBreakdown: StatisticsSectionBreakdown[] = [];

    /**
     * Constructor of the StatisticsSeriesBreakdown class.
     *
     * It initializes the series breakdown with the given series identifier.
     *
     * @param series The series identifier.
     */
    constructor(series: string) {
        super();
        this.series = series;
    }
}

/**
 * The EditionStatistics class.
 *
 * It provides default zero values for the complete edition statistics.
 */
export class EditionStatistics extends StatisticsBreakdownBase {
    /**
     * The total number of series.
     */
    totalSeries = 0;

    /**
     * The number of active series (series with at least one active section or complex).
     */
    activeSeries = 0;

    /**
     * The total number of sections.
     */
    totalSections = 0;

    /**
     * The breakdown by series.
     */
    seriesBreakdown: StatisticsSeriesBreakdown[] = [];

    /**
     * Constructor of the EditionStatistics class.
     *
     * It initializes the edition statistics with default zero values and empty breakdowns.
     */
    constructor() {
        super();
    }
}
