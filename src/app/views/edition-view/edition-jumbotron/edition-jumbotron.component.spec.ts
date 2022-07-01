import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { EditionJumbotronComponent } from './edition-jumbotron.component';

describe('EditionJumbotronComponent', () => {
    let component: EditionJumbotronComponent;
    let fixture: ComponentFixture<EditionJumbotronComponent>;
    let compDe: DebugElement;

    const expectedTitle = 'Inhalt';
    const expectedId = 'awg-edition-view';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionJumbotronComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionJumbotronComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have jumbotronId', () => {
            expect(component.jumbotronId).toBeUndefined();
        });

        it('... should not have jumbotronTitle', () => {
            expect(component.jumbotronTitle).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should have one div.awg-jumbotron-image', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-jumbotron-image', 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.jumbotronId = expectedId;
            component.jumbotronTitle = expectedTitle;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have jumbotronId', () => {
            expect(component.jumbotronId).toBeDefined();
            expect(component.jumbotronId).withContext(`should be ${expectedId}`).toBe(expectedId);
        });

        it('... should have jumbotronTitle', () => {
            expect(component.jumbotronTitle).toBeDefined();
            expect(component.jumbotronTitle).withContext(`should be ${expectedTitle}`).toBe(expectedTitle);
        });

        describe('VIEW', () => {
            it('... should have an h1 in jumbotron', () => {
                const jumbotronDes = getAndExpectDebugElementByCss(compDe, 'div.awg-jumbotron-image', 1, 1);

                getAndExpectDebugElementByCss(jumbotronDes[0], 'h1', 1, 1);
            });

            it('... should pass down `jumbotronId` and `jumbotronTitle`to jumbotron h1', () => {
                const headingDes = getAndExpectDebugElementByCss(compDe, 'div.awg-jumbotron-image > h1', 1, 1);
                const headingEl = headingDes[0].nativeElement;

                expect(headingEl.id).toBeTruthy();
                expect(headingEl.id).withContext(`should be ${expectedId}`).toBe(expectedId);

                expect(headingEl.textContent).toBeTruthy();
                expect(headingEl.textContent.trim()).withContext(`should be ${expectedTitle}`).toBe(expectedTitle);
            });
        });
    });
});
