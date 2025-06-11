import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbbrDirective } from '@awg-shared/abbr/abbr.directive';
import { CompileHtmlComponent } from '@awg-shared/compile-html';

import { SourceDescriptionContentTableComponent } from './source-description-content-table.component';

describe('SourceDescriptionContentTableComponent', () => {
    let component: SourceDescriptionContentTableComponent;
    let fixture: ComponentFixture<SourceDescriptionContentTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SourceDescriptionContentTableComponent, CompileHtmlComponent, AbbrDirective],
        }).compileComponents();

        fixture = TestBed.createComponent(SourceDescriptionContentTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
