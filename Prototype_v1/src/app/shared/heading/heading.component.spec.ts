/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HeadingComponent } from './heading.component';
import { NgxJsonViewerComponent } from 'ngx-json-viewer';

describe('HeadingComponent (DONE)', () => {
    let component: HeadingComponent;
    let fixture: ComponentFixture<HeadingComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let expectedTitle: string;
    let expectedId: string;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HeadingComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HeadingComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedTitle = 'Test Title';
        expectedId = '23';
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `title` and `id`', () => {
            expect(component.title).toBeUndefined();
            expect(component.id).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one div.para with an h2', () => {
                const divDes = compDe.queryAll(By.css('div.para'));
                const headerDes = compDe.queryAll(By.css('div.para > h2'));

                expect(divDes).toBeTruthy();
                expect(divDes.length).toBe(1, 'should have one div.para');

                expect(headerDes).toBeTruthy();
                expect(headerDes.length).toBe(1, 'should have one h2');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // simulate the parent setting the input properties
            component.title = expectedTitle;
            component.id = expectedId;

            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should pass down `title` and `id` to component', () => {
                const divDe = compDe.query(By.css('div.para'));
                const headerDe = compDe.query(By.css('div.para > h2'));

                const divEl = divDe.nativeElement;
                const headerEl = headerDe.nativeElement;

                expect(divEl.id).toBeTruthy();
                expect(divEl.id).toContain(expectedId, `should be ${expectedId}`);

                expect(headerEl).toBeTruthy();
                expect(headerEl.textContent).toContain(expectedTitle, `should be ${expectedTitle}`);
            });
        });
    });
});
