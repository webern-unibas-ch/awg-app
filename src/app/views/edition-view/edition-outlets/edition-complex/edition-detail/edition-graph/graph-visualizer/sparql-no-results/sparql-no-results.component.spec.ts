import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { LogoStubComponent } from '@testing/component-stubs';
import {
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { LogoComponent } from '@awg-shared/logos/logo.component';
import { LOGOS_DATA } from '@awg-shared/logos/logos.data';
import { Logos } from '@awg-shared/logos/logos.model';

import { SparqlNoResultsComponent } from './sparql-no-results.component';

describe('SparqlNoResultsComponent (DONE)', () => {
    let component: SparqlNoResultsComponent;
    let fixture: ComponentFixture<SparqlNoResultsComponent>;
    let compDe: DebugElement;

    let expectedLogosData: Logos;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SparqlNoResultsComponent],
        })
            .overrideComponent(SparqlNoResultsComponent, {
                remove: { imports: [LogoComponent] },
                add: { imports: [LogoStubComponent] },
            })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedLogosData = LOGOS_DATA;

        // Create component fixture
        fixture = TestBed.createComponent(SparqlNoResultsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `logosData`', () => {
            expectToEqual(component.logosData, expectedLogosData);
        });

        describe('VIEW', () => {
            const getParagraphDes = () => getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 4);

            it('... should contain one div.text-center with 4 paragraphs', () => {
                getAndExpectDebugElementByCss(compDe, 'div.text-center', 1, 1);
                getParagraphDes();
            });

            it('... should contain plain text in 1st and 2nd paragraph', () => {
                const pDes = getParagraphDes();

                const pEl1: HTMLParagraphElement = pDes[0].nativeElement;
                const pEl2: HTMLParagraphElement = pDes[1].nativeElement;

                expectToBe(pEl1.textContent, 'Entschuldigung, Ihre SPARQL-Anfrage führte leider zu keinem Ergebnis.');
                expectToBe(pEl2.textContent, 'Möglicherweise können Sie Ihre Anfrage anpassen.');
            });

            it('... should contain one empty link in 3rd paragraph', () => {
                const aDes3 = getAndExpectDebugElementByCss(getParagraphDes()[2], 'p > a', 1, 1);
                const aEl3: HTMLAnchorElement = aDes3[0].nativeElement;

                expectToBe(aEl3.href, '');
            });

            it('... should contain one logo component (stubbed) in 4th paragraph', () => {
                getAndExpectDebugElementByDirective(getParagraphDes()[3], LogoStubComponent, 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            const getParagraphDes = () => getAndExpectDebugElementByCss(compDe, 'div.text-center > p', 4, 4);

            it('... should contain correct link in 3rd paragraph', () => {
                const aDes3 = getAndExpectDebugElementByCss(getParagraphDes()[2], 'p > a', 1, 1);
                const aEl3: HTMLAnchorElement = aDes3[0].nativeElement;

                expectToBe(aEl3.href, expectedLogosData['sparql'].href);
                expectToBe(aEl3.textContent, expectedLogosData['sparql'].href);
            });

            it('... should pass down logo data to logo link component in 4th paragraph', () => {
                const logoDes = getAndExpectDebugElementByDirective(getParagraphDes()[3], LogoStubComponent, 1, 1);
                const logoCmps = logoDes.map(de => de.injector.get(LogoStubComponent) as LogoStubComponent);

                expectToBe(logoCmps.length, 1);
                expectToEqual(logoCmps[0].logoData(), expectedLogosData['sparql']);
            });
        });
    });
});
