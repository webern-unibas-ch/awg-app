import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { Logo, Logos } from '@awg-core/core-models';
import { LOGOSDATA } from '@awg-core/mock-data';
import { CoreService } from '@awg-core/services';

import { ForceGraphNoResultComponent } from './force-graph-no-result.component';

describe('ForceGraphNoResultComponent', () => {
    let component: ForceGraphNoResultComponent;
    let fixture: ComponentFixture<ForceGraphNoResultComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let mockCoreService: Partial<CoreService>;

    let expectedLogos: Logos;
    let expectedHeight: number;

    beforeEach(async(() => {
        // stub service for test purposes
        mockCoreService = {
            getLogos: () => expectedLogos
        };

        TestBed.configureTestingModule({
            declarations: [ForceGraphNoResultComponent],
            providers: [{ provide: CoreService, useValue: mockCoreService }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ForceGraphNoResultComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedLogos = LOGOSDATA;
        expectedHeight = 500;

        // spies on component functions
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
        it('... should not have height', () => {
            expect(component.height).toBeUndefined('should be undefined');
        });

        describe('#provideMetaData', () => {
            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });

            it('... should not have logos', () => {
                expect(component.logos).toBeUndefined('should be undefined');
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
                expect(p1El.textContent).toContain(
                    'Entschuldigung, Ihre SPARQL-Anfrage führte leider zu keinem Ergebnis.',
                    `should contain: Entschuldigung, Ihre SPARQL-Anfrage führte leider zu keinem Ergebnis.`
                );

                expect(p2El.textContent).toBeDefined();
                expect(p2El.textContent).toContain(
                    'Möglicherweise können Sie Ihre Anfrage anpassen.',
                    `should contain: Möglicherweise können Sie Ihre Anfrage anpassen.`
                );
            });

            it('... should contain one empty link in 3rd and 4th paragraph', () => {
                getAndExpectDebugElementByCss(compDe, 'div.text-center', 1, 1);
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 1);
                const p3aDes = getAndExpectDebugElementByCss(pDes[2], 'p > a', 1, 1);
                const p4aDes = getAndExpectDebugElementByCss(pDes[3], 'p > a', 1, 1);

                const p3aEl = p3aDes[0].nativeElement;
                const p4aEl = p4aDes[0].nativeElement;

                expect(p3aEl.href).toBeDefined();
                expect(p3aEl.href).not.toBeTruthy('should be empty'); // JASMINE: empty string ==> not truthy

                expect(p4aEl.href).toBeDefined();
                expect(p4aEl.href).not.toBeTruthy('should be empty string');
            });

            it('... should contain one empty image in 3rd paragraph link', () => {
                getAndExpectDebugElementByCss(compDe, 'div.text-center', 1, 1);
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 1);
                const p3aDes = getAndExpectDebugElementByCss(pDes[2], 'p > a', 1, 1);
                const imgDes = getAndExpectDebugElementByCss(p3aDes[0], 'a > img', 1, 1);

                const imgEl = imgDes[0].nativeElement;

                expect(imgEl.src).toBeDefined();
                expect(imgEl.src).not.toBeTruthy('should be empty');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // simulate the parent setting the input properties
            component.height = expectedHeight;

            // mock the call to the meta service in #provideMetaData
            component.logos = mockCoreService.getLogos();

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have height', () => {
            expect(component.height).toBeDefined();
            expect(component.height).toBe(expectedHeight);
        });

        describe('#provideMetaData', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return logos', () => {
                expect(component.logos).toBeDefined();
                expect(component.logos).toBe(expectedLogos);
            });
        });

        describe('VIEW', () => {
            it('... should set correct height to div.text-center', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.text-center', 1, 1);

                expect(divDes[0].styles.height).toBe(expectedHeight + 'px', `should be ${expectedHeight + 'px'}`);
            });

            it('... should contain correct link in 3rd and 4th paragraph', () => {
                getAndExpectDebugElementByCss(compDe, 'div.text-center', 1, 1);
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 1);
                const p3aDes = getAndExpectDebugElementByCss(pDes[2], 'p > a', 1, 1);
                const p4aDes = getAndExpectDebugElementByCss(pDes[3], 'p > a', 1, 1);

                const p3aEl = p3aDes[0].nativeElement;
                const p4aEl = p4aDes[0].nativeElement;

                expect(p3aEl.href).toBeDefined();
                expect(p3aEl.href).toBeTruthy('should not be empty');
                expect(p3aEl.href).toContain(expectedLogos.sparql.href, `should contain ${expectedLogos.sparql.href}`);

                expect(p4aEl.href).toBeDefined();
                expect(p4aEl.href).toBeTruthy('should not be empty');
                expect(p4aEl.href).toContain(expectedLogos.sparql.href, `should contain ${expectedLogos.sparql.href}`);

                expect(p4aEl.textContent).toBeDefined();
                expect(p4aEl.textContent).toContain(
                    expectedLogos.sparql.href,
                    `should contain: ${expectedLogos.sparql.href}`
                );
            });

            it('... should contain correct image in 3rd paragraph link', () => {
                getAndExpectDebugElementByCss(compDe, 'div.text-center', 1, 1);
                const pDes = getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 1);
                const p3aDes = getAndExpectDebugElementByCss(pDes[2], 'p > a', 1, 1);
                const imgDes = getAndExpectDebugElementByCss(p3aDes[0], 'a > img', 1, 1);

                const imgEl = imgDes[0].nativeElement;

                expect(imgEl.src).toBeDefined();
                expect(imgEl.src).toContain(expectedLogos.sparql.src, `should contain ${expectedLogos.sparql.src}`);
            });
        });
    });
});
