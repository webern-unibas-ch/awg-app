import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

import { MetaContact, MetaPage } from '@awg-core/core-models';

import { ContactInfoComponent } from './contact-info.component';

// mock address component
@Component({ selector: 'awg-address', template: '' })
class AddressStubComponent {
    @Input()
    pageMetaData: MetaPage;
    @Input()
    contactMetaData: MetaContact;
}

// mock open street map component
@Component({ selector: 'awg-open-street-map', template: '' })
class OpenStreetMapStubComponent {
    @Input()
    osmEmbedUrl: SafeResourceUrl;
    @Input()
    osmLinkUrl: SafeResourceUrl;
}

describe('ContactInfoComponent', () => {
    let component: ContactInfoComponent;
    let fixture: ComponentFixture<ContactInfoComponent>;
    let compDe: DebugElement;
    let compEl;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ContactInfoComponent, AddressStubComponent, OpenStreetMapStubComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactInfoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
