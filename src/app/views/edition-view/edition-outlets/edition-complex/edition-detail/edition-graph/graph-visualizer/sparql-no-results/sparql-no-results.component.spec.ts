import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { LOGOS_DATA } from '@awg-core/data/logos.data';
import { Logos } from '@awg-core/models/logos.model';
import { CoreService } from '@awg-core/services/core-service/core.service';

import { SparqlNoResultsComponent } from './sparql-no-results.component';

describe('SparqlNoResultsComponent (DONE)', () => {
    let component: SparqlNoResultsComponent;
    let fixture: ComponentFixture<SparqlNoResultsComponent>;
    let compDe: DebugElement;

    let mockCoreService: Partial<CoreService>;

    let expectedLogos: Logos;

    beforeEach(async () => {
        // Stub service for test purposes
        mockCoreService = {
            getLogos: () => expectedLogos,
        };

        await TestBed.configureTestingModule({
            declarations: [SparqlNoResultsComponent],
            providers: [{ provide: CoreService, useValue: mockCoreService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SparqlNoResultsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedLogos = LOGOS_DATA;

        // Spies
        vi.spyOn(component, 'provideMetaData');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const coreService = TestBed.inject(CoreService);
        expectToBe(mockCoreService === coreService, true);
    });

    describe('BEFORE initial data binding', () => {
        describe('#provideMetaData()', () => {
            it('... should have a method `provideMetaData`', () => {
                expect(component.provideMetaData).toBeDefined();
            });

            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });

            it('... should not have logos', () => {
                expect(component.logos).toBeUndefined();
            });
        });

        describe('VIEW', () => {
            it('... should contain one div.text-center with 4 paragraphs', () => {
                getAndExpectDebugElementByCss(compDe, 'div.text-center', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 1);
            });

            it('... should contain plain text in 1st and 2nd paragraph', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 4);

                const pEl1: HTMLParagraphElement = pDes[0].nativeElement;
                const pEl2: HTMLParagraphElement = pDes[1].nativeElement;

                expectToBe(pEl1.textContent, 'Entschuldigung, Ihre SPARQL-Anfrage führte leider zu keinem Ergebnis.');
                expectToBe(pEl2.textContent, 'Möglicherweise können Sie Ihre Anfrage anpassen.');
            });

            it('... should contain one empty link in 3rd and 4th paragraph', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 4);
                const aDes3 = getAndExpectDebugElementByCss(pDes[2], 'p > a', 1, 1);
                const aDes4 = getAndExpectDebugElementByCss(pDes[3], 'p > a', 1, 1);

                const aEl3: HTMLAnchorElement = aDes3[0].nativeElement;
                const aEl4: HTMLAnchorElement = aDes4[0].nativeElement;

                expectToBe(aEl3.href, '');
                expectToBe(aEl4.href, '');
            });

            it('... should contain one empty image in 4th paragraph link', () => {
                getAndExpectDebugElementByCss(compDe, 'div.text-center', 1, 1);
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 1);
                const aDes4 = getAndExpectDebugElementByCss(pDes[3], 'p > a', 1, 1);
                const imgDes = getAndExpectDebugElementByCss(aDes4[0], 'a > img', 1, 1);

                const imgEl: HTMLImageElement = imgDes[0].nativeElement;

                expectToBe(imgEl.src, '');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Mock the call to the meta service in #provideMetaData
            component.logos = mockCoreService.getLogos();

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#provideMetaData()', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return logos', () => {
                expectToEqual(component.logos, expectedLogos);
            });
        });

        describe('VIEW', () => {
            it('... should contain correct link in 3rd and 4th paragraph', () => {
                getAndExpectDebugElementByCss(compDe, 'div.text-center', 1, 1);
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 1);
                const aDes3 = getAndExpectDebugElementByCss(pDes[2], 'p > a', 1, 1);
                const aDes4 = getAndExpectDebugElementByCss(pDes[3], 'p > a', 1, 1);

                const aEl3: HTMLAnchorElement = aDes3[0].nativeElement;
                const aEl4: HTMLAnchorElement = aDes4[0].nativeElement;

                expectToBe(aEl3.href, expectedLogos['sparql'].href);
                expectToBe(aEl3.textContent, expectedLogos['sparql'].href);
                expectToBe(aEl4.href, expectedLogos['sparql'].href);
            });

            it('... should contain correct image in 4th paragraph link', () => {
                getAndExpectDebugElementByCss(compDe, 'div.text-center', 1, 1);
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 1);
                const aDes4 = getAndExpectDebugElementByCss(pDes[3], 'p > a', 1, 1);
                const imgDes = getAndExpectDebugElementByCss(aDes4[0], 'a > img', 1, 1);

                const imgEl: HTMLImageElement = imgDes[0].nativeElement;

                expectToContain(imgEl.src, expectedLogos['sparql'].src);
            });
        });
    });
});
