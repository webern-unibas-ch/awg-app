import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

/**
 * The StatisticsComplexType type.
 *
 * It defines the valid complex types for statistics breakdowns.
 */
export type StatisticsComplexType = keyof StatisticsComplexBreakdown;

/**
 * The StatisticsComplexBreakdownData type.
 *
 * It defines the structure for the complex breakdown data used in the statistics view,
 * by picking the relevant properties from the StatisticsBreakdownBase class.
 */
export type StatisticsComplexBreakdownData = Pick<
    StatisticsBreakdownBase,
    'activeComplexBreakdown' | 'complexBreakdown' | 'totalComplexes'
>;

/**
 * The StatisticsProgressBarConfig type.
 *
 * It defines the valid configuration options for the StatisticsProgressBarComponent,
 * including different modes for percentage, ratio, and absolute values.
 */
export type StatisticsProgressBarConfig =
    | { mode: 'percentage'; percentage: number }
    | { mode: 'ratio'; active: number; total: number }
    | { mode: 'absolute'; active: number; total: number };

/**
 * The StatisticsOverallProgressData type.
 *
 * It defines the structure for the overall progress data used in the statistics view,
 * by picking the relevant properties from the StatisticsBreakdownBase class.
 */
export type StatisticsOverallProgressData = Pick<
    StatisticsBreakdownBase,
    'progressRate' | 'activeComplexes' | 'totalComplexes'
>;

/**
 * The StatisticsSummaryData type.
 *
 * It defines the structure for the summary data used in the statistics view,
 * by picking the relevant properties from the Statistics class.
 */
export type StatisticsSummaryData = Pick<
    Statistics,
    'activeSeries' | 'activeSections' | 'activeComplexes' | 'totalComplexes'
>;

/**
 * The StatisticsBreakDownBadge interface.
 *
 * It defines the structure for a badge representing a breakdown of complex types in statistics.
 */
export interface StatisticsBreakDownBadge {
    /**
     * The label for the breakdown badge.
     */
    label: string;

    /**
     * The value associated with the breakdown badge.
     */
    val: number;
    /**
     * The type of the breakdown badge.
     */
    type: string;
}

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
     * @param isActive Flag indicating whether the complex is active.
     */
    registerComplex: (complexType: StatisticsComplexType, isActive: boolean) => void;
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
    key: StatisticsComplexType;

    /**
     * The base label for the progress bar item, used for display purposes.
     */
    baseLabel: string;

    /**
     * The background color type for the progress bar item.
     */
    colorType: string;
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
     * The number of active complexes.
     */
    activeComplexes = 0;

    /**
     * The progress rate.
     */
    progressRate = 0;

    /**
     * The breakdown by complex category.
     */
    complexBreakdown: StatisticsComplexBreakdown;

    /**
     * The breakdown of active complexes by category.
     */
    activeComplexBreakdown: StatisticsComplexBreakdown;

    /**
     * Constructor of the StatisticsBreakdownBase class.
     *
     * It initializes the shared complex breakdown counters.
     */
    protected constructor() {
        this.complexBreakdown = new StatisticsComplexBreakdown();
        this.activeComplexBreakdown = new StatisticsComplexBreakdown();
    }

    /**
     * Registers one complex in statistics.
     *
     * @param complexType The complex type.
     * @param isActive Flag indicating whether the complex is active.
     */
    registerComplex(complexType: StatisticsComplexType, isActive: boolean): void {
        this.totalComplexes++;
        this.complexBreakdown[complexType]++;

        if (isActive) {
            this.activeComplexes++;
            this.activeComplexBreakdown[complexType]++;
        }
    }
}

/**
 * The StatisticsSectionBreakdown class.
 *
 * It includes a section identifier and disabled flag.
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
 * It includes a series identifier, the number of sections in the series, and the breakdown by sections within the series.
 */
export class StatisticsSeriesBreakdown extends StatisticsBreakdownBase {
    /**
     * The series identifier.
     */
    series: string;

    /**
     * The number of total sections in the series.
     */
    totalSections = 0;

    /**
     * The number of active sections in the series (sections with at least one active complex).
     */
    activeSections = 0;

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
 * The Statistics class.
 *
 * It provides default zero values for the complete statistics.
 */
export class Statistics extends StatisticsBreakdownBase {
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
     * The number of active sections (section with at least one active complex).
     */
    activeSections = 0;

    /**
     * The breakdown by series.
     */
    seriesBreakdown: StatisticsSeriesBreakdown[] = [];

    /**
     * Constructor of the Statistics class.
     *
     * It initializes the edition statistics with default zero values and empty breakdowns.
     */
    constructor() {
        super();
    }
}
