import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionDetailNotificationComponent } from './edition-detail-notification.component';

describe('EditionDetailNotificationComponent', () => {
    let component: EditionDetailNotificationComponent;
    let fixture: ComponentFixture<EditionDetailNotificationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditionDetailNotificationComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionDetailNotificationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
