/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextcriticsComponent } from './textcritics.component';
import { EditionTkaTableComponent } from '@awg-views/edition-view/edition-outlets/edition-tka-table/edition-tka-table.component';
import { SharedModule } from '@awg-shared/shared.module';
import { RouterLinkStubDirective } from '@testing/router-stubs';

describe('TextcriticsComponent', () => {
    let component: TextcriticsComponent;
    let fixture: ComponentFixture<TextcriticsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule],
            declarations: [TextcriticsComponent, EditionTkaTableComponent, RouterLinkStubDirective]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextcriticsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
