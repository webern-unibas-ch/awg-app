import { UpperCasePipe } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { LOGOS_DATA } from '@awg-core/core-data';
import { MetaIdentifiers } from '@awg-core/core-models';

import { MetaIdentifierBadgesComponent } from './meta-identifier-badges.component';

describe('MetaIdentifierBadgesComponent (DONE)', () => {
    let component: MetaIdentifierBadgesComponent;
    let fixture: ComponentFixture<MetaIdentifierBadgesComponent>;
    let compDe: DebugElement;

    let expectedIdentifiers: MetaIdentifiers;
    let expectedIdentifierConfigs: { key: keyof MetaIdentifiers; baseUrl: string; src: string; label: string }[];

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [MetaIdentifierBadgesComponent],
            imports: [UpperCasePipe],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MetaIdentifierBadgesComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedIdentifiers = { gnd: '129772429', viaf: '74941235' };
        expectedIdentifierConfigs = (['gnd', 'viaf', 'orcid'] as (keyof MetaIdentifiers)[]).map(key => ({
            key,
            baseUrl: LOGOS_DATA[key].href,
            src: LOGOS_DATA[key].src,
            label: LOGOS_DATA[key].alt,
        }));
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `identifiers`', () => {
            expect(component.identifiers).toBeUndefined();
        });

        it('... should have `identifierConfigs`', () => {
            expect(component.identifierConfigs).toEqual(expectedIdentifierConfigs);
        });

        describe('VIEW', () => {
            it('... should contain no badge links yet', () => {
                getAndExpectDebugElementByCss(compDe, 'a.awg-meta-identifier-badge', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        describe('... if identifiers is undefined', () => {
            beforeEach(() => {
                component.identifiers = undefined;
                fixture.detectChanges();
            });

            it('... should contain no badge links', () => {
                getAndExpectDebugElementByCss(compDe, 'a.awg-meta-identifier-badge', 0, 0);
            });
        });

        describe('... if identifiers has no entries', () => {
            beforeEach(() => {
                component.identifiers = {};
                fixture.detectChanges();
            });

            it('... should contain no badge links', () => {
                getAndExpectDebugElementByCss(compDe, 'a.awg-meta-identifier-badge', 0, 0);
            });
        });

        describe('... if identifiers is given', () => {
            beforeEach(() => {
                component.identifiers = expectedIdentifiers;
                fixture.detectChanges();
            });

            it('... should render one badge link per present identifier', () => {
                const presentCount = expectedIdentifierConfigs.filter(c => expectedIdentifiers[c.key]).length;
                getAndExpectDebugElementByCss(compDe, 'a.awg-meta-identifier-badge', presentCount, presentCount);
            });

            it('... should render badge links with correct href and icon', () => {
                const expectedLinks = expectedIdentifierConfigs
                    .filter(c => expectedIdentifiers[c.key])
                    .map(c => ({
                        href: c.baseUrl + (expectedIdentifiers[c.key] as string),
                        src: c.src,
                        label: c.label,
                    }));

                const badgeDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.awg-meta-identifier-badge',
                    expectedLinks.length,
                    expectedLinks.length
                );
                const badgeEls: HTMLAnchorElement[] = badgeDes.map(de => de.nativeElement);

                badgeEls.forEach((el, i) => {
                    expectToBe(el.href, expectedLinks[i].href);

                    const img = el.querySelector('img.awg-meta-identifier-badge-icon') as HTMLImageElement;
                    expect(img).toBeTruthy();
                    expect(img.src).toContain(expectedLinks[i].src);
                    expectToBe(img.alt, expectedLinks[i].label);
                });
            });

            it('... should render each badge link with correct title attribute', () => {
                const expectedLinks = expectedIdentifierConfigs.filter(c => expectedIdentifiers[c.key]);

                const badgeDes = getAndExpectDebugElementByCss(
                    compDe,
                    'a.awg-meta-identifier-badge',
                    expectedLinks.length,
                    expectedLinks.length
                );
                const badgeEls: HTMLAnchorElement[] = badgeDes.map(de => de.nativeElement);

                badgeEls.forEach((el, i) => {
                    const img = el.querySelector('img.awg-meta-identifier-badge-icon') as HTMLImageElement;
                    expect(img).toBeTruthy();
                    const expectedTitle = `${expectedLinks[i].key.toUpperCase()}: ${expectedIdentifiers[expectedLinks[i].key]}`;
                    expectToBe(img.title, expectedTitle);
                });
            });
        });
    });
});
