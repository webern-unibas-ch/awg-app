import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { ResourceInfoComponent } from './resource-info.component';
import { CompileHtmlComponent } from '@awg-shared/compile-html';

describe('ResourceInfoComponent', () => {
    let component: ResourceInfoComponent;
    let fixture: ComponentFixture<ResourceInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, RouterTestingModule],
            declarations: [ResourceInfoComponent, CompileHtmlComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
