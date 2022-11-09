import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { getAndExpectDebugElementByCss } from '@testing/expect-helper';

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

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('injected service should use provided mockValue', () => {
        const coreService = TestBed.inject(CoreService);
        expect(mockCoreService === coreService).toBe(true);
    });

    describe('BEFORE initial data binding', () => {
        describe('#provideMetaData', () => {
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
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.text-center', 1, 1);
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 1);

                const divEl = divDes[0].nativeElement;
                const p1El = pDes[0].nativeElement;
                const p2El = pDes[1].nativeElement;

                expect(divEl.id).toBeDefined();

                expect(p1El.textContent).toBeDefined();
                expect(p1El.textContent)
                    .withContext(
                        'should contain: Entschuldigung, Ihre SPARQL-Anfrage führte leider zu keinem Ergebnis.'
                    )
                    .toContain('Entschuldigung, Ihre SPARQL-Anfrage führte leider zu keinem Ergebnis.');

                expect(p2El.textContent).toBeDefined();
                expect(p2El.textContent)
                    .withContext('should contain: Möglicherweise können Sie Ihre Anfrage anpassen.')
                    .toContain('Möglicherweise können Sie Ihre Anfrage anpassen.');
            });

            it('... should contain one empty link in 3rd and 4th paragraph', () => {
                getAndExpectDebugElementByCss(compDe, 'div.text-center', 1, 1);
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 1);
                const p3aDes = getAndExpectDebugElementByCss(pDes[2], 'p > a', 1, 1);
                const p4aDes = getAndExpectDebugElementByCss(pDes[3], 'p > a', 1, 1);

                const p3aEl = p3aDes[0].nativeElement;
                const p4aEl = p4aDes[0].nativeElement;

                expect(p3aEl.href).toBeDefined();
                expect(p3aEl.href).withContext('should be empty string').not.toBeTruthy(); // JASMINE: empty string ==> not truthy

                expect(p4aEl.href).toBeDefined();
                expect(p4aEl.href).withContext('should be empty string').not.toBeTruthy();
            });

            it('... should contain one empty image in 4th paragraph link', () => {
                getAndExpectDebugElementByCss(compDe, 'div.text-center', 1, 1);
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 1);
                const p4aDes = getAndExpectDebugElementByCss(pDes[3], 'p > a', 1, 1);
                const imgDes = getAndExpectDebugElementByCss(p4aDes[0], 'a > img', 1, 1);

                const imgEl = imgDes[0].nativeElement;

                expect(imgEl.src).toBeDefined();
                expect(imgEl.src).withContext('should be empty string').not.toBeTruthy();
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

        describe('#provideMetaData', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return logos', () => {
                expect(component.logos).toBeDefined();
                expect(component.logos).withContext(`should be ${expectedLogos}`).toBe(expectedLogos);
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

                expect(p3aEl.href).toBeDefined();
                expect(p3aEl.href).withContext('should be empty string').toBeTruthy();
                expect(p3aEl.href)
                    .withContext(`should contain ${expectedLogos['sparql'].href}`)
                    .toContain(expectedLogos['sparql'].href);

                expect(p3aEl.textContent).toBeDefined();
                expect(p3aEl.textContent)
                    .withContext(`should contain: ${expectedLogos['sparql'].href}`)
                    .toContain(expectedLogos['sparql'].href);

                expect(p4aEl.href).toBeDefined();
                expect(p4aEl.href).withContext('should be empty string').toBeTruthy();
                expect(p4aEl.href)
                    .withContext(`should contain ${expectedLogos['sparql'].href}`)
                    .toContain(expectedLogos['sparql'].href);
            });

            it('... should contain correct image in 4th paragraph link', () => {
                getAndExpectDebugElementByCss(compDe, 'div.text-center', 1, 1);
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 1);
                const p4aDes = getAndExpectDebugElementByCss(pDes[3], 'p > a', 1, 1);
                const imgDes = getAndExpectDebugElementByCss(p4aDes[0], 'a > img', 1, 1);

                const imgEl = imgDes[0].nativeElement;

                expect(imgEl.src).toBeDefined();
                expect(imgEl.src)
                    .withContext(`should contain ${expectedLogos['sparql'].src}`)
                    .toContain(expectedLogos['sparql'].src);
            });
        });
    });
});
