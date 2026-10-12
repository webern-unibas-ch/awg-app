import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { LOGOS_DATA } from '@awg-shared/logos/logos.data';

import { MetaIdentifiers } from '../meta.model';
import { MetaIdentifierBadgesComponent } from './meta-identifier-badges.component';
import { MetaIdentifierBadge } from './meta-identifier-badges.model';

describe('MetaIdentifierBadgesComponent (DONE)', () => {
    let component: MetaIdentifierBadgesComponent;
    let fixture: ComponentFixture<MetaIdentifierBadgesComponent>;
    let compDe: DebugElement;

    let expectedIdentifiers: MetaIdentifiers;
    let expectedActiveIdentifierBadges: MetaIdentifierBadge[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MetaIdentifierBadgesComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedIdentifiers = { gnd: '129772429', viaf: '74941235' };

        const gndLogo = LOGOS_DATA['gnd'];
        const viafLogo = LOGOS_DATA['viaf'];
        expectedActiveIdentifierBadges = [
            {
                key: 'gnd',
                fullUrl: gndLogo.href + '129772429',
                src: gndLogo.src,
                label: gndLogo.alt,
                titleText: 'GND: 129772429',
            },
            {
                key: 'viaf',
                fullUrl: viafLogo.href + '74941235',
                src: viafLogo.src,
                label: viafLogo.alt,
                titleText: 'VIAF: 74941235',
            },
        ];

        // Create component fixture
        fixture = TestBed.createComponent(MetaIdentifierBadgesComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `identifiers`', () => {
            expectToBe(isSignal(component.identifiers), true);

            expect(() => component.identifiers()).toThrow();
        });

        it('... should throw when accessing computed signal `displayedBadges` due to missing input', () => {
            expectToBe(isSignal(component.displayedBadges), true);

            expect(() => component.displayedBadges()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain no badge links yet', () => {
                getAndExpectDebugElementByCss(compDe, 'a.awg-meta-identifier-badge', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding (update)', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('identifiers', expectedIdentifiers);

            fixture.detectChanges();
        });

        it('... should have input signal `identifiers` to hold the provided identifiers', () => {
            expectToEqual(component.identifiers(), expectedIdentifiers);
        });

        it('... should have computed signal `displayedBadges` to hold the expected badges', () => {
            expectToEqual(component.displayedBadges(), expectedActiveIdentifierBadges);
        });

        describe('... should have computed signal `displayedBadges` to hold an empty array if ...', () => {
            it('... `identifiers` is an empty object', () => {
                fixture.componentRef.setInput('identifiers', {});

                expectToEqual(component.displayedBadges(), []);
            });

            it('... `identifiers` is undefined', () => {
                fixture.componentRef.setInput('identifiers', undefined);

                expectToEqual(component.displayedBadges(), []);
            });

            it('... `identifiers` is null', () => {
                fixture.componentRef.setInput('identifiers', null);

                expectToEqual(component.displayedBadges(), []);
            });

            it('... `identifiers` has no valid keys', () => {
                const identifiersWithInvalidKey: any = { invalidKey: '123' };

                fixture.componentRef.setInput('identifiers', identifiersWithInvalidKey);

                expectToEqual(component.displayedBadges(), []);
            });

            it('... `identifiers` has a key with only whitespaces', () => {
                const identifiersWithSpaces: MetaIdentifiers = {
                    gnd: '   ',
                    viaf: '',
                    orcid: '',
                };
                fixture.componentRef.setInput('identifiers', identifiersWithSpaces);

                expectToEqual(component.displayedBadges(), []);
            });
        });

        describe('VIEW', () => {
            it('... should render one badge link per present identifier', () => {
                const expectedCount = component.displayedBadges().length;

                getAndExpectDebugElementByCss(compDe, 'a.awg-meta-identifier-badge', expectedCount, expectedCount);
            });

            it('... should have correct href on each badge link', () => {
                const expectedBadges = component.displayedBadges();

                const badgeAnchorDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.awg-meta-identifier-badge',
                    expectedBadges.length,
                    expectedBadges.length
                );

                badgeAnchorDes.forEach((badgeAnchorDe, index) => {
                    const badgeAnchorEl: HTMLAnchorElement = badgeAnchorDe.nativeElement;

                    expectToBe(badgeAnchorEl.href, expectedBadges[index].fullUrl);
                });
            });

            it('... should have one image on each badge link', () => {
                const expectedBadges = component.displayedBadges();

                const badgeAnchorDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.awg-meta-identifier-badge',
                    expectedBadges.length,
                    expectedBadges.length
                );

                badgeAnchorDes.forEach(badgeAnchorDe => {
                    getAndExpectDebugElementByCss(badgeAnchorDe, 'img.awg-meta-identifier-badge-icon', 1, 1);
                });
            });

            it('... should render image with correct src, alt and title', () => {
                const expectedBadges = component.displayedBadges();

                const badgeAnchorDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.awg-meta-identifier-badge',
                    expectedBadges.length,
                    expectedBadges.length
                );

                badgeAnchorDes.forEach((badgeAnchorDe, index) => {
                    const imgDes = getAndExpectDebugElementByCss(
                        badgeAnchorDe,
                        'img.awg-meta-identifier-badge-icon',
                        1,
                        1
                    );
                    const imgEl: HTMLImageElement = imgDes[0].nativeElement;

                    expect(imgEl).toBeTruthy();
                    expectToContain(imgEl.src, expectedBadges[index].src);
                    expectToBe(imgEl.alt, expectedBadges[index].label);
                    expectToBe(imgEl.title, expectedBadges[index].titleText);
                });
            });
        });
    });
});
