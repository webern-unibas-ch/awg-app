import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { StatisticsComplexBreakdown } from '@awg-views/statistics-view/models';

import { StatisticsBreakdownBadgeComponent } from './statistics-breakdown-badge.component';

describe('StatisticsBreakdownBadgeComponent', () => {
    let component: StatisticsBreakdownBadgeComponent;
    let fixture: ComponentFixture<StatisticsBreakdownBadgeComponent>;
    let compDe: DebugElement;

    let expectedBreakdown: StatisticsComplexBreakdown;
    let expectedContainerClasses: string;
    let expectedhideEmptyBadges: boolean;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StatisticsBreakdownBadgeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StatisticsBreakdownBadgeComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedBreakdown = new StatisticsComplexBreakdown({ opus: 5, mnr: 10, mnrX: 3 });
        expectedContainerClasses = 'custom-container-classes';
        expectedhideEmptyBadges = true;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have default `breakdown`', () => {
            expectToBe(component.breakdown.opus, 0);
            expectToBe(component.breakdown.mnr, 0);
            expectToBe(component.breakdown.mnrX, 0);
        });

        it('... should have default `containerClasses`', () => {
            expectToEqual(component.containerClasses, 'small text-muted');
        });

        it('... should have default `hideEmptyBadges`', () => {
            expectToBe(component.hideEmptyBadges, true);
        });

        describe('VIEW', () => {
            it('... should contain one outer div container', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-breakdown-badge-container', 1, 1);
            });

            it('... should not apply custom container classes to outer div container yet', () => {
                const containerDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-statistics-breakdown-badge-container',
                    1,
                    1
                );
                const containerEl = containerDes[0].nativeElement;

                expectToContain(containerEl.className, 'awg-statistics-breakdown-badge-container');
                expect(containerEl.className).not.toContain('small');
                expect(containerEl.className).not.toContain('text-muted');
            });

            it('... should contain no badge elements yet', () => {
                getAndExpectDebugElementByCss(compDe, 'span.awg-statistics-breakdown-badge', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent component setting the input properties
            component.breakdown = expectedBreakdown;
            component.containerClasses = expectedContainerClasses;
            component.hideEmptyBadges = expectedhideEmptyBadges;

            fixture.detectChanges();
        });

        it('... should have updated breakdown input properties', () => {
            expectToEqual(component.breakdown, expectedBreakdown);
        });

        it('... should have updated containerClasses input properties', () => {
            expectToEqual(component.containerClasses, expectedContainerClasses);
        });

        it('... should have updated hideEmptyBadges input properties', () => {
            expectToBe(component.hideEmptyBadges, expectedhideEmptyBadges);
        });

        describe('VIEW', () => {
            it('... should contain one outer div container', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-breakdown-badge-container', 1, 1);
            });

            it('... should apply custom container classes to outer div container', () => {
                const containerDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-statistics-breakdown-badge-container',
                    1,
                    1
                );
                const containerEl = containerDes[0].nativeElement;

                expectToContain(containerEl.className, 'awg-statistics-breakdown-badge-container');
                expectToContain(containerEl.className, expectedContainerClasses);
            });

            it('... should contain 3 badge elements if all breakdown values are > 0 and hideEmptyBadges is false', () => {
                component.hideEmptyBadges = false;
                detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'span.awg-statistics-breakdown-badge', 3, 3);
            });

            it('... should contain 3 badge elements if all breakdown values are > 0 and hideEmptyBadges is true', () => {
                getAndExpectDebugElementByCss(compDe, 'span.awg-statistics-breakdown-badge', 3, 3);
            });

            it('... should display correct badge text for each breakdown type', () => {
                const badgeDes = getAndExpectDebugElementByCss(compDe, 'span.awg-statistics-breakdown-badge', 3, 3);
                const badgeEls = badgeDes.map(de => de.nativeElement);

                expectToContain(badgeEls[0].textContent, `Op: ${expectedBreakdown.opus}`);
                expectToContain(badgeEls[1].textContent, `M: ${expectedBreakdown.mnr}`);
                expectToContain(badgeEls[2].textContent, `M*: ${expectedBreakdown.mnrX}`);
            });

            it('... should apply the correct badge color classes for each breakdown type', () => {
                const badgeDes = getAndExpectDebugElementByCss(compDe, 'span.awg-statistics-breakdown-badge', 3, 3);
                const badgeEls = badgeDes.map(de => de.nativeElement);

                expectToContain(badgeEls[0].className, 'bg-primary');
                expectToContain(badgeEls[1].className, 'bg-secondary');
                expectToContain(badgeEls[2].className, 'bg-info');
            });

            it('... should systematically show only non-empty badges when hideEmptyBadges is true', () => {
                const scenarios: {
                    breakdown: StatisticsComplexBreakdown;
                    expectedTexts: string[];
                }[] = [
                    { breakdown: new StatisticsComplexBreakdown({ opus: 0, mnr: 0, mnrX: 0 }), expectedTexts: [] }, // All-zero case
                    {
                        breakdown: new StatisticsComplexBreakdown({ opus: 6, mnr: 0, mnrX: 0 }),
                        expectedTexts: ['Op: 6'],
                    },
                    {
                        breakdown: new StatisticsComplexBreakdown({ opus: 0, mnr: 5, mnrX: 0 }),
                        expectedTexts: ['M: 5'],
                    },
                    {
                        breakdown: new StatisticsComplexBreakdown({ opus: 0, mnr: 0, mnrX: 3 }),
                        expectedTexts: ['M*: 3'],
                    },
                    {
                        breakdown: new StatisticsComplexBreakdown({ opus: 6, mnr: 5, mnrX: 0 }),
                        expectedTexts: ['Op: 6', 'M: 5'],
                    },
                    {
                        breakdown: new StatisticsComplexBreakdown({ opus: 6, mnr: 0, mnrX: 3 }),
                        expectedTexts: ['Op: 6', 'M*: 3'],
                    },
                    {
                        breakdown: new StatisticsComplexBreakdown({ opus: 0, mnr: 5, mnrX: 3 }),
                        expectedTexts: ['M: 5', 'M*: 3'],
                    },
                ];

                scenarios.forEach(scenario => {
                    component.breakdown = scenario.breakdown;
                    component.hideEmptyBadges = expectedhideEmptyBadges;
                    detectChangesOnPush(fixture);

                    const badgeDes = getAndExpectDebugElementByCss(
                        compDe,
                        'span.awg-statistics-breakdown-badge',
                        scenario.expectedTexts.length,
                        scenario.expectedTexts.length
                    );
                    const badgeEls = badgeDes.map(de => de.nativeElement);

                    scenario.expectedTexts.forEach((expectedText, index) => {
                        expectToContain(badgeEls[index].textContent, expectedText);
                    });
                });
            });

            it('... should systematically show non-empty badges when hideEmptyBadges is false', () => {
                const scenarios: {
                    breakdown: StatisticsComplexBreakdown;
                    expectedTexts: string[];
                }[] = [
                    {
                        breakdown: new StatisticsComplexBreakdown({ opus: 0, mnr: 0, mnrX: 0 }),
                        expectedTexts: ['Op: 0', 'M: 0', 'M*: 0'],
                    }, // All-zero case
                    {
                        breakdown: new StatisticsComplexBreakdown({ opus: 6, mnr: 0, mnrX: 0 }),
                        expectedTexts: ['Op: 6', 'M: 0', 'M*: 0'],
                    },
                    {
                        breakdown: new StatisticsComplexBreakdown({ opus: 0, mnr: 5, mnrX: 0 }),
                        expectedTexts: ['Op: 0', 'M: 5', 'M*: 0'],
                    },
                    {
                        breakdown: new StatisticsComplexBreakdown({ opus: 0, mnr: 0, mnrX: 3 }),
                        expectedTexts: ['Op: 0', 'M: 0', 'M*: 3'],
                    },
                    {
                        breakdown: new StatisticsComplexBreakdown({ opus: 6, mnr: 5, mnrX: 0 }),
                        expectedTexts: ['Op: 6', 'M: 5', 'M*: 0'],
                    },
                    {
                        breakdown: new StatisticsComplexBreakdown({ opus: 6, mnr: 0, mnrX: 3 }),
                        expectedTexts: ['Op: 6', 'M: 0', 'M*: 3'],
                    },
                    {
                        breakdown: new StatisticsComplexBreakdown({ opus: 0, mnr: 5, mnrX: 3 }),
                        expectedTexts: ['Op: 0', 'M: 5', 'M*: 3'],
                    },
                ];

                scenarios.forEach(scenario => {
                    component.breakdown = scenario.breakdown;
                    component.hideEmptyBadges = false;
                    detectChangesOnPush(fixture);

                    const badgeDes = getAndExpectDebugElementByCss(
                        compDe,
                        'span.awg-statistics-breakdown-badge',
                        scenario.expectedTexts.length,
                        scenario.expectedTexts.length
                    );
                    const badgeEls = badgeDes.map(de => de.nativeElement);

                    scenario.expectedTexts.forEach((expectedText, index) => {
                        expectToContain(badgeEls[index].textContent, expectedText);
                    });
                });
            });
        });
    });
});
