/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotFoundViewComponent } from './page-not-found-view.component';

describe('PageNotFoundViewComponent', () => {
    let component: PageNotFoundViewComponent;
    let fixture: ComponentFixture<PageNotFoundViewComponent>;
    const title = 'Page not found';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageNotFoundViewComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageNotFoundViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`should have a title 'Page not found'`, () => {
        expect(component.title).toEqual(title);
    });

    it('should render title in a h2-tag', () => {
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h2').textContent).toContain(title);
    });
});
