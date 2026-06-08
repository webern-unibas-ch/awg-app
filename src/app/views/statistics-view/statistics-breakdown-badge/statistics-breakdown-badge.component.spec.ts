import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { StatisticsBreakDownBadge, StatisticsComplexBreakdown } from '@awg-views/statistics-view/models';

import { StatisticsBreakdownBadgeComponent } from './statistics-breakdown-badge.component';

describe('StatisticsBreakdownBadgeComponent', () => {
    let component: StatisticsBreakdownBadgeComponent;
    let fixture: ComponentFixture<StatisticsBreakdownBadgeComponent>;
    let compDe: DebugElement;

    let expectedBreakdown: StatisticsComplexBreakdown;
    let expectedContainerClasses: string;
    let expectedShowEmptyBadges: boolean;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatisticsBreakdownBadgeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StatisticsBreakdownBadgeComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedBreakdown = new StatisticsComplexBreakdown({ opus: 5, mnr: 10, mnrX: 3 });
        expectedContainerClasses = 'custom-container-classes';
        expectedShowEmptyBadges = false;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have default `breakdown`', () => {
            const currentBreakdown = component.breakdown();

            expectToBe(currentBreakdown.opus, 0);
            expectToBe(currentBreakdown.mnr, 0);
            expectToBe(currentBreakdown.mnrX, 0);
        });

        it('... should have default `containerClasses`', () => {
            expectToEqual(component.containerClasses(), 'small text-muted');
        });

        it('... should have default `showEmptyBadges`', () => {
            expectToBe(component.showEmptyBadges(), false);
        });

        it('... should have computed `visibleBadges` (empty array due to showEmptyBadges=false)', () => {
            const currentVisibleBadges: StatisticsBreakDownBadge[] = component.visibleBadges();

            expectToEqual(currentVisibleBadges, []);
            expectToBe(currentVisibleBadges.length, 0);
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

    describe('AFTER initial data binding (default)', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('... should have default `breakdown`', () => {
            const currentBreakdown = component.breakdown();

            expectToBe(currentBreakdown.opus, 0);
            expectToBe(currentBreakdown.mnr, 0);
            expectToBe(currentBreakdown.mnrX, 0);
        });

        it('... should have default `containerClasses`', () => {
            expectToEqual(component.containerClasses(), 'small text-muted');
        });

        it('... should have default `showEmptyBadges`', () => {
            expectToBe(component.showEmptyBadges(), false);
        });

        it('... should have computed `visibleBadges` (empty array due to showEmptyBadges=false)', () => {
            const currentVisibleBadges: StatisticsBreakDownBadge[] = component.visibleBadges();

            expectToEqual(currentVisibleBadges, []);
            expectToBe(currentVisibleBadges.length, 0);
        });

        describe('VIEW', () => {
            it('... should contain one outer div container', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-statistics-breakdown-badge-container', 1, 1);
            });

            it('... should apply default container classes to outer div container', () => {
                const containerDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-statistics-breakdown-badge-container',
                    1,
                    1
                );
                const containerEl = containerDes[0].nativeElement;

                expectToContain(containerEl.className, 'awg-statistics-breakdown-badge-container');
                expectToContain(containerEl.className, 'small');
                expectToContain(containerEl.className, 'text-muted');
            });

            it('... should contain no badge elements', () => {
                getAndExpectDebugElementByCss(compDe, 'span.awg-statistics-breakdown-badge', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding (update)', () => {
        beforeEach(() => {
            // Simulate the parent component updating the input signals
            fixture.componentRef.setInput('breakdown', expectedBreakdown);
            fixture.componentRef.setInput('containerClasses', expectedContainerClasses);
            fixture.componentRef.setInput('showEmptyBadges', expectedShowEmptyBadges);

            fixture.detectChanges();
        });

        it('... should have updated `breakdown` input signal', () => {
            expectToEqual(component.breakdown(), expectedBreakdown);
        });

        it('... should have updated `containerClasses` input signal', () => {
            expectToBe(component.containerClasses(), expectedContainerClasses);
        });

        it('... should have updated `showEmptyBadges` input signal', () => {
            expectToBe(component.showEmptyBadges(), expectedShowEmptyBadges);
        });

        it('... should have computed `visibleBadges` based on breakdown and showEmptyBadges', () => {
            const expectedVisibleBadges: StatisticsBreakDownBadge[] = [
                { label: 'Op', val: expectedBreakdown.opus, type: 'primary' },
                { label: 'M', val: expectedBreakdown.mnr, type: 'secondary' },
                { label: 'M*', val: expectedBreakdown.mnrX, type: 'info' },
            ];

            const currentVisibleBadges: StatisticsBreakDownBadge[] = component.visibleBadges();

            expectToEqual(currentVisibleBadges, expectedVisibleBadges);
            expectToBe(currentVisibleBadges.length, 3);
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

            describe('... should contain 3 badge elements if...', () => {
                it('... all breakdown values are > 0 and showEmptyBadges is false', () => {
                    getAndExpectDebugElementByCss(compDe, 'span.awg-statistics-breakdown-badge', 3, 3);
                });

                it('... all breakdown values are > 0 and showEmptyBadges is true', () => {
                    fixture.componentRef.setInput('showEmptyBadges', true);
                    detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'span.awg-statistics-breakdown-badge', 3, 3);
                });
            });

            it('... should show only non-empty badges when showEmptyBadges is false (default)', () => {
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
                    fixture.componentRef.setInput('breakdown', scenario.breakdown);
                    fixture.componentRef.setInput('showEmptyBadges', expectedShowEmptyBadges);
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

            it('... should show all badges (including empty ones) when showEmptyBadges is true', () => {
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
                    fixture.componentRef.setInput('breakdown', scenario.breakdown);
                    fixture.componentRef.setInput('showEmptyBadges', true);
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
        });

        describe('#visibleBadges()', () => {
            it('... should have a computed signal `visibleBadges()`', () => {
                expect(component.visibleBadges).toBeDefined();
            });

            it('... should return an empty array if breakdown is empty and showEmptyBadges is false', () => {
                fixture.componentRef.setInput(
                    'breakdown',
                    new StatisticsComplexBreakdown({ opus: 0, mnr: 0, mnrX: 0 })
                );
                fixture.componentRef.setInput('showEmptyBadges', false);

                const badges: StatisticsBreakDownBadge[] = component.visibleBadges();

                expectToEqual(badges, []);
            });

            describe('... should return all badges if', () => {
                it('... showEmptyBadges is false, but all values are > 0', () => {
                    fixture.componentRef.setInput(
                        'breakdown',
                        new StatisticsComplexBreakdown({ opus: 1, mnr: 1, mnrX: 1 })
                    );
                    fixture.componentRef.setInput('showEmptyBadges', false);

                    const badges: StatisticsBreakDownBadge[] = component.visibleBadges();

                    expectToBe(badges.length, 3);
                });

                it('... showEmptyBadges is true, even if values are 0', () => {
                    fixture.componentRef.setInput(
                        'breakdown',
                        new StatisticsComplexBreakdown({ opus: 0, mnr: 0, mnrX: 0 })
                    );
                    fixture.componentRef.setInput('showEmptyBadges', true);

                    const badges: StatisticsBreakDownBadge[] = component.visibleBadges();

                    expectToBe(badges.length, 3);
                });
            });

            it('... should map correct label to the badges', () => {
                fixture.componentRef.setInput(
                    'breakdown',
                    new StatisticsComplexBreakdown({ opus: 5, mnr: 3, mnrX: 1 })
                );

                const badges: StatisticsBreakDownBadge[] = component.visibleBadges();

                expectToBe(badges[0].label, 'Op');
                expectToBe(badges[1].label, 'M');
                expectToBe(badges[2].label, 'M*');
            });

            it('... should map correct colors to the badges', () => {
                fixture.componentRef.setInput(
                    'breakdown',
                    new StatisticsComplexBreakdown({ opus: 5, mnr: 3, mnrX: 1 })
                );

                const badges: StatisticsBreakDownBadge[] = component.visibleBadges();

                expectToBe(badges[0].type, 'primary');
                expectToBe(badges[1].type, 'secondary');
                expectToBe(badges[2].type, 'info');
            });
        });
    });
});
