/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { IntroComponent } from './intro.component';
import { ModalComponent } from '@awg-shared/modal/modal.component';
import { ModalModule } from 'ngx-bootstrap';

describe('IntroComponent', () => {
    let component: IntroComponent;
    let fixture: ComponentFixture<IntroComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ModalModule.forRoot(), RouterTestingModule],
            declarations: [IntroComponent, ModalComponent, RouterLinkStubDirective]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IntroComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
