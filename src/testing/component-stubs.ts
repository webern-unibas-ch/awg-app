import { Component, EventEmitter, Input, input, model, Output } from '@angular/core';

import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { NavbarItem } from '@awg-core/navbar/navbar.model';

import { Logo, Logos } from '@awg-shared/logos/logos.model';
import { MetaContact, MetaIdentifiers, MetaPage } from '@awg-shared/meta/meta.model';
import { LabeledRoute } from '@awg-shared/models/labeled-route.model';

import { HomeViewCard } from '@awg-views/home-view/home-view-card/home-view-card.model';

import { SafeResourceUrl } from '@angular/platform-browser';
import {
    EditionOutlineComplexItem,
    EditionOutlineSection,
    EditionOutlineSeries,
} from '@awg-app/views/edition-view/models';
import {
    StatisticsComplexBreakdown,
    StatisticsComplexBreakdownData,
    StatisticsOverallProgressData,
    StatisticsProgressBarConfig,
    StatisticsSeriesBreakdown,
    StatisticsSummaryData,
} from '@awg-views/statistics-view/models/statistics.model';

// ============================================================================
// CORE STUBS
// ============================================================================
@Component({
    selector: 'awg-footer-copyright',
    template: '',
})
export class FooterCopyrightStubComponent {
    readonly pageMetaData = input.required<MetaPage>();
}

@Component({
    selector: 'awg-footer-declaration',
    template: '',
})
export class FooterDeclarationStubComponent {
    readonly pageMetaData = input.required<MetaPage>();
}

@Component({
    selector: 'awg-footer-poweredby',
    template: '',
})
export class FooterPoweredbyStubComponent {
    readonly logosData = input.required<Logos>();
    readonly pageMetaData = input.required<MetaPage>();
}

@Component({
    selector: 'awg-navbar-dropdown-link',
    template: '',
})
export class NavbarDropdownLinkStubComponent {
    readonly label = input.required<string>();
    readonly route = input.required<string[]>();
}

@Component({
    selector: 'awg-navbar-item',
    template: '',
})
export class NavbarItemStubComponent {
    readonly item = input.required<NavbarItem>();
    readonly id = input<string>('');
    readonly isDropdown = input<boolean>(false);
}

// ============================================================================
// SHARED STUBS
// ============================================================================

@Component({
    selector: 'awg-alert-error',
    template: '',
})
export class AlertErrorStubComponent {
    readonly errorObject = input.required<any>();
}

@Component({
    selector: 'awg-alert-info',
    template: '',
})
export class AlertInfoStubComponent {
    readonly infoMessage = input.required<string>();
    isOpen = model<boolean>(true);
}

@Component({
    selector: 'awg-fullscreen-toggle',
    template: '',
})
export class FullscreenToggleStubComponent {
    readonly fsElement = input.required<HTMLElement>();
}

@Component({
    selector: 'awg-heading',
    template: '',
})
export class HeadingStubComponent {
    readonly id = input.required<string>();
    readonly title = input.required<string>();
}

@Component({
    selector: 'awg-language-switcher',
    template: '',
    standalone: false,
})
export class LanguageSwitcherStubComponent {
    @Input()
    currentLanguage: number;
    @Output()
    languageChangeRequest = new EventEmitter<number>();
}

@Component({
    selector: 'awg-logo',
    template: '',
})
export class LogoStubComponent {
    readonly logoData = input.required<Logo>();
    readonly linkClass = input<string>('awg-logo-link');
}

@Component({
    selector: 'awg-meta-identifier-badges',
    template: '',
})
export class MetaIdentifierBadgesStubComponent {
    readonly identifiers = input.required<MetaIdentifiers | null | undefined>();
}

@Component({
    selector: 'awg-scroll-to-top-button',
    template: '',
})
export class ScrollToTopButtonStubComponent {}

@Component({
    selector: 'awg-twelve-tone-spinner',
    template: '',
    standalone: false,
})
export class TwelveToneSpinnerStubComponent {}

// ============================================================================
// CONTACT VIEW STUBS
// ============================================================================
@Component({
    selector: 'awg-contact-address',
    template: '',
})
export class ContactAddressStubComponent {
    readonly pageMetaData = input.required<MetaPage>();
    readonly contactMetaData = input.required<MetaContact>();
}

@Component({
    selector: 'awg-contact-map',
    template: '',
})
export class ContactMapStubComponent {
    readonly embedUrl = input.required<SafeResourceUrl>();
    readonly linkUrl = input.required<string>();
}

// ============================================================================
// EDITION VIEW STUBS
// ============================================================================
@Component({
    selector: 'awg-edition-breadcrumb',
    template: '',
})
export class EditionBreadcrumbStubComponent {
    readonly items = input.required<LabeledRoute[]>();
}

@Component({
    selector: 'awg-edition-jumbotron',
    template: '',
})
export class EditionJumbotronStubComponent {
    readonly id = input.required<string>();
    readonly title = input.required<string>();
}

@Component({
    selector: 'awg-edition-section-detail-complex-card',
    template: '',
    standalone: false,
})
export class EditionSectionDetailComplexCardStubComponent {
    @Input()
    complexes: EditionOutlineComplexItem[];
}

@Component({
    selector: 'awg-edition-section-detail-disclaimer',
    template: '',
    standalone: false,
})
export class EditionSectionDetailDisclaimerStubComponent {}

@Component({
    selector: 'awg-edition-section-detail-intro-card',
    template: '',
    standalone: false,
})
export class EditionSectionDetailIntroCardStubComponent {
    @Input()
    selectedSeries: EditionOutlineSeries;
    @Input()
    selectedSection: EditionOutlineSection;
}

@Component({
    selector: 'awg-edition-section-detail-placeholder',
    template: '',
    standalone: false,
})
export class EditionSectionDetailPlaceholderStubComponent {
    @Input()
    selectedSeries: EditionOutlineSeries;
    @Input()
    selectedSection: EditionOutlineSection;
}

// ============================================================================
// HOME VIEW STUBS
// ============================================================================
@Component({
    selector: 'awg-home-view-card',
    template: '',
})
export class HomeViewCardStubComponent {
    readonly cardData = input.required<HomeViewCard>();
}

// ============================================================================
// STATISTICS VIEW STUBS
// ============================================================================
@Component({
    selector: 'awg-statistics-breakdown-badge',
    template: '',
})
export class StatisticsBreakdownBadgeStubComponent {
    readonly breakdown = input.required<StatisticsComplexBreakdown>();
    readonly containerClasses = input<string>('small text-muted');
    readonly showEmptyBadges = input<boolean>(false);
}

@Component({
    selector: 'awg-statistics-complex-breakdown',
    template: '',
})
export class StatisticsComplexBreakdownStubComponent {
    readonly complexBreakdownData = input.required<StatisticsComplexBreakdownData>();
}

@Component({
    selector: 'awg-statistics-overall-progress',
    template: '',
})
export class StatisticsOverallProgressStubComponent {
    readonly overallProgressData = input.required<StatisticsOverallProgressData>();
}

@Component({
    selector: 'awg-statistics-progress-bar',
    template: '',
})
export class StatisticsProgressBarStubComponent {
    readonly config = input.required<StatisticsProgressBarConfig>();
    readonly headerLabel = input<string>();
    readonly height = input<string>('15px');
    readonly showPercentageLabel = input<boolean>(true);
    readonly boldPercentageLabel = input<boolean>(false);
    readonly customType = input<string>('');
    readonly useCustomTypeOnly = input<boolean>(false);
}

@Component({
    selector: 'awg-statistics-series-breakdown',
    template: '',
})
export class StatisticsSeriesBreakdownStubComponent {
    readonly seriesBreakdownData = input.required<StatisticsSeriesBreakdown[]>();
}

@Component({
    selector: 'awg-statistics-summary',
    template: '',
})
export class StatisticsSummaryStubComponent {
    readonly summaryData = input.required<StatisticsSummaryData>();
}

@Component({
    selector: 'awg-statistics-summary-card',
    template: '',
})
export class StatisticsSummaryCardStubComponent {
    readonly title = input.required<string>();
    readonly value = input.required<number | string>();
    readonly icon = input.required<IconDefinition>();
    readonly bgClass = input.required<string>();
}
