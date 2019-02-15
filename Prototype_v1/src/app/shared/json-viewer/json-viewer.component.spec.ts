import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { JsonViewerComponent } from './json-viewer.component';

describe('JsonViewerComponent', () => {
    let component: JsonViewerComponent;
    let fixture: ComponentFixture<JsonViewerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NgbTabsetModule, NgxJsonViewerModule],
            declarations: [JsonViewerComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JsonViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
