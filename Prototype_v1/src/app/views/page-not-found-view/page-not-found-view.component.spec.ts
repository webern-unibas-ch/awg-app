/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { PageNotFoundViewComponent } from './page-not-found-view.component';

describe('PageNotFoundViewComponent', () => {
    let component: PageNotFoundViewComponent;
    let fixture: ComponentFixture<PageNotFoundViewComponent>;
    let compDe: DebugElement;
    let compEl: any;

    const title = 'Page not found';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageNotFoundViewComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageNotFoundViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it(`should have title`, () => {
            expect(component.title).toBe(title);
        });

        describe('VIEW', () => {
            it('... should contain one `h2` element', () => {
                const h2El = compEl.querySelectorAll('h2');

                expect(h2El.length).toBe(1, 'should have 1 `h2`');
            });

            it('... should not render title yet', () => {
                expect(compEl.querySelector('h2').textContent).not.toContain(title);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should render title in the `h2`-element', () => {
                expect(compEl.querySelector('h2').textContent).toContain(title);
            });
        });
    });
});
