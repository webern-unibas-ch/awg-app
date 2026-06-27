import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { LOGOS_DATA } from '@awg-core/data/logos.data';
import { MetaIdentifierBadge, MetaIdentifiers } from '@awg-core/models/meta.model';
import { CoreService } from '@awg-core/services/core-service/core.service';

import { MetaIdentifierBadgesComponent } from './meta-identifier-badges.component';

describe('MetaIdentifierBadgesComponent (DONE)', () => {
    let component: MetaIdentifierBadgesComponent;
    let fixture: ComponentFixture<MetaIdentifierBadgesComponent>;
    let compDe: DebugElement;

    let mockCoreService: Partial<CoreService>;

    let expectedIdentifiers: MetaIdentifiers;
    let expectedActiveIdentifierBadges: MetaIdentifierBadge[];

    beforeEach(async () => {
        mockCoreService = {
            getLogos: () => LOGOS_DATA,
        };
        await TestBed.configureTestingModule({
            imports: [MetaIdentifierBadgesComponent],
            providers: [
                {
                    provide: CoreService,
                    useValue: mockCoreService,
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MetaIdentifierBadgesComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedIdentifiers = { gnd: '129772429', viaf: '74941235' };

        const logosData = TestBed.inject(CoreService).getLogos();
        expectedActiveIdentifierBadges = [
            {
                key: 'gnd',
                fullUrl: logosData['gnd'].href + '129772429',
                src: logosData['gnd'].src,
                label: logosData['gnd'].alt,
                titleText: 'GND: 129772429',
            },
            {
                key: 'viaf',
                fullUrl: logosData['viaf'].href + '74941235',
                src: logosData['viaf'].src,
                label: logosData['viaf'].alt,
                titleText: 'VIAF: 74941235',
            },
        ];
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const coreService = TestBed.inject(CoreService);
        expectToBe(mockCoreService === coreService, true);
    });

    describe('BEFORE initial data binding', () => {
        it('... should have default `identifiers` (undefined)', () => {
            expect(component.identifiers()).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain no badge links yet', () => {
                getAndExpectDebugElementByCss(compDe, 'a.awg-meta-identifier-badge', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding (default values)', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('... should have default `identifiers` (undefined)', () => {
            expect(component.identifiers()).toBeUndefined();
        });

        it('... should have computed `displayedBadges` (empty array due to identifiers=undefined)', () => {
            const displayedBadges: MetaIdentifierBadge[] = component.displayedBadges();

            expectToBe(displayedBadges.length, 0);
            expectToEqual(displayedBadges, []);
        });

        describe('VIEW', () => {
            it('... should contain no badge links yet', () => {
                getAndExpectDebugElementByCss(compDe, 'a.awg-meta-identifier-badge', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding (update)', () => {
        beforeEach(() => {
            // Simulate the parent updating the input
            fixture.componentRef.setInput('identifiers', expectedIdentifiers);

            fixture.detectChanges();
        });

        it('... should have correct `identifiers`', () => {
            expectToEqual(component.identifiers(), expectedIdentifiers);
        });

        it('... should have computed `displayedBadges`', () => {
            const displayedBadges: MetaIdentifierBadge[] = component.displayedBadges();

            expectToBe(displayedBadges.length, 2);
            expectToEqual(displayedBadges, expectedActiveIdentifierBadges);
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

        describe('#displayedBadges', () => {
            it('... should have a computed signal `displayedBadges`', () => {
                expect(component.displayedBadges).toBeDefined();
            });

            it('... should return correct badges for given identifiers', () => {
                const displayedBadges: MetaIdentifierBadge[] = component.displayedBadges();

                expectToBe(displayedBadges.length, 2);
                expectToEqual(displayedBadges, expectedActiveIdentifierBadges);

                expectToBe(displayedBadges[0].key, expectedActiveIdentifierBadges[0].key);
                expectToBe(displayedBadges[1].key, expectedActiveIdentifierBadges[1].key);

                expectToBe(displayedBadges[0].fullUrl, expectedActiveIdentifierBadges[0].fullUrl);
                expectToBe(displayedBadges[1].fullUrl, expectedActiveIdentifierBadges[1].fullUrl);

                expectToBe(displayedBadges[0].src, expectedActiveIdentifierBadges[0].src);
                expectToBe(displayedBadges[1].src, expectedActiveIdentifierBadges[1].src);

                expectToBe(displayedBadges[0].label, expectedActiveIdentifierBadges[0].label);
                expectToBe(displayedBadges[1].label, expectedActiveIdentifierBadges[1].label);

                expectToBe(displayedBadges[0].titleText, expectedActiveIdentifierBadges[0].titleText);
                expectToBe(displayedBadges[1].titleText, expectedActiveIdentifierBadges[1].titleText);
            });

            describe('... should return empty array if ...', () => {
                it('... identifiers is an empty object {}, null or undefined', () => {
                    fixture.componentRef.setInput('identifiers', {} as MetaIdentifiers);

                    expectToEqual(component.displayedBadges(), []);

                    fixture.componentRef.setInput('identifiers', null as unknown as MetaIdentifiers);
                    expectToEqual(component.displayedBadges(), []);

                    fixture.componentRef.setInput('identifiers', undefined as unknown as MetaIdentifiers);
                    expectToEqual(component.displayedBadges(), []);
                });

                it('... identifiers has no valid keys', () => {
                    fixture.componentRef.setInput('identifiers', { invalidKey: '123' } as unknown as MetaIdentifiers);

                    const displayedBadges: MetaIdentifierBadge[] = component.displayedBadges();

                    expectToBe(displayedBadges.length, 0);
                    expectToEqual(displayedBadges, []);
                });
            });
        });
    });
});
