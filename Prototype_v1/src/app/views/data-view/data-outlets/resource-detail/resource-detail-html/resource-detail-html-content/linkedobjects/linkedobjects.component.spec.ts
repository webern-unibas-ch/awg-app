import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { AccordionModule } from 'ngx-bootstrap';

import { ResourceDetailHtmlContentLinkedobjectsComponent } from './linkedobjects.component';
import { ConversionService } from '@awg-core/services';

describe('ResourceDetailHtmlContentLinkedobjectsComponent', () => {
    let component: ResourceDetailHtmlContentLinkedobjectsComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlContentLinkedobjectsComponent>;
    let compDe: DebugElement;
    let compEl: any;

    // TODO: provide accurate types and service responses
    const mockConversionService = { getNestedArraysLength: () => {} };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [AccordionModule.forRoot()],
            declarations: [ResourceDetailHtmlContentLinkedobjectsComponent],
            providers: [{ provide: ConversionService, useValue: mockConversionService }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlContentLinkedobjectsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
