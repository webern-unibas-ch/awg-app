import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { expectToBe, expectToContain, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { LOGOSDATA } from '@awg-core/core-data';
import { Logos } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

import { SparqlNoResultsComponent } from './sparql-no-results.component';

describe('SparqlNoResultsComponent (DONE)', () => {
    let component: SparqlNoResultsComponent;
    let fixture: ComponentFixture<SparqlNoResultsComponent>;
    let compDe: DebugElement;

    let mockCoreService: Partial<CoreService>;

    let expectedLogos: Logos;

    beforeEach(waitForAsync(() => {
        // Stub service for test purposes
        mockCoreService = {
            getLogos: () => expectedLogos,
        };

        TestBed.configureTestingModule({
            declarations: [SparqlNoResultsComponent],
            providers: [{ provide: CoreService, useValue: mockCoreService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SparqlNoResultsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedLogos = LOGOSDATA;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
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

                const p1El = pDes[0].nativeElement;
                const p2El = pDes[1].nativeElement;

                expectToBe(p1El.textContent, 'Entschuldigung, Ihre SPARQL-Anfrage führte leider zu keinem Ergebnis.');
                expectToBe(p2El.textContent, 'Möglicherweise können Sie Ihre Anfrage anpassen.');
            });

            it('... should contain one empty link in 3rd and 4th paragraph', () => {
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 4);
                const p3aDes = getAndExpectDebugElementByCss(pDes[2], 'p > a', 1, 1);
                const p4aDes = getAndExpectDebugElementByCss(pDes[3], 'p > a', 1, 1);

                const p3aEl = p3aDes[0].nativeElement;
                const p4aEl = p4aDes[0].nativeElement;

                expectToBe(p3aEl.href, '');
                expectToBe(p4aEl.href, '');
            });

            it('... should contain one empty image in 4th paragraph link', () => {
                getAndExpectDebugElementByCss(compDe, 'div.text-center', 1, 1);
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 1);
                const p4aDes = getAndExpectDebugElementByCss(pDes[3], 'p > a', 1, 1);
                const imgDes = getAndExpectDebugElementByCss(p4aDes[0], 'a > img', 1, 1);

                const imgEl = imgDes[0].nativeElement;

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
                const p3aDes = getAndExpectDebugElementByCss(pDes[2], 'p > a', 1, 1);
                const p4aDes = getAndExpectDebugElementByCss(pDes[3], 'p > a', 1, 1);

                const p3aEl = p3aDes[0].nativeElement;
                const p4aEl = p4aDes[0].nativeElement;

                expectToBe(p3aEl.href, expectedLogos['sparql'].href);
                expectToBe(p3aEl.textContent, expectedLogos['sparql'].href);
                expectToBe(p4aEl.href, expectedLogos['sparql'].href);
            });

            it('... should contain correct image in 4th paragraph link', () => {
                getAndExpectDebugElementByCss(compDe, 'div.text-center', 1, 1);
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 1);
                const p4aDes = getAndExpectDebugElementByCss(pDes[3], 'p > a', 1, 1);
                const imgDes = getAndExpectDebugElementByCss(p4aDes[0], 'a > img', 1, 1);

                const imgEl = imgDes[0].nativeElement;

                expectToContain(imgEl.src, expectedLogos['sparql'].src);
            });
        });
    });
});
