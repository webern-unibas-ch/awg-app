import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ResourceDetailImage } from '@awg-views/data-view/models';
import { ContextJson } from '@awg-shared/api-objects';

import { ResourceDetailHtmlContentImageobjectsComponent } from './imageobjects.component';

describe('ResourceDetailHtmlContentImageobjectsComponent', () => {
    let component: ResourceDetailHtmlContentImageobjectsComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlContentImageobjectsComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let expectedImages: ResourceDetailImage[];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FontAwesomeModule],
            declarations: [ResourceDetailHtmlContentImageobjectsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlContentImageobjectsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have images', () => {
            expect(component.images).toBeUndefined('should be undefined');
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            expectedImages = [];
            const context: ContextJson = {
                parent_res_id: null,
                parent_resinfo: null,
                res_id: ['2173574', '2173577'],
                resclass_name: 'image',
                preview: [
                    {
                        path: 'http://www.salsah.org/core/sendlocdata.php?res=2173574&qtype=thumbnail',
                        protocol: 'file',
                        origname: 'Programm_Prag19350109_op7-1.jpg',
                        format_name: 'JPEG',
                        nx: 0,
                        ny: 0,
                        duration: '0.000',
                        fps: '0.000'
                    },
                    {
                        path: 'http://www.salsah.org/core/sendlocdata.php?res=2173577&qtype=thumbnail',
                        protocol: 'file',
                        origname: 'Programm_Prag19350109_op7-2.jpg',
                        format_name: 'JPEG',
                        nx: 0,
                        ny: 0,
                        duration: '0.000',
                        fps: '0.000'
                    }
                ],
                locations: [
                    [
                        {
                            path: 'http://www.salsah.org/core/sendlocdata.php?res=2173574&qtype=thumbnail',
                            protocol: 'file',
                            origname: 'Programm_Prag19350109_op7-1.jpg',
                            format_name: 'JPEG',
                            nx: 0,
                            ny: 0,
                            duration: '0.000',
                            fps: '0.000'
                        },
                        {
                            path: 'http://www.salsah.org/core/sendlocdata.php?res=2173574&qtype=full&reduce=5',
                            protocol: 'file',
                            origname: 'Programm_Prag19350109_op7-1.jpg',
                            format_name: 'JPEG2000',
                            nx: 0,
                            ny: 0,
                            duration: 0,
                            fps: 0
                        },
                        {
                            path: 'http://www.salsah.org/core/sendlocdata.php?res=2173574&qtype=full&reduce=4',
                            protocol: 'file',
                            origname: 'Programm_Prag19350109_op7-1.jpg',
                            format_name: 'JPEG2000',
                            nx: 0,
                            ny: 0,
                            duration: 0,
                            fps: 0
                        },
                        {
                            path: 'http://www.salsah.org/core/sendlocdata.php?res=2173574&qtype=full&reduce=3',
                            protocol: 'file',
                            origname: 'Programm_Prag19350109_op7-1.jpg',
                            format_name: 'JPEG2000',
                            nx: 0,
                            ny: 0,
                            duration: 0,
                            fps: 0
                        },
                        {
                            path: 'http://www.salsah.org/core/sendlocdata.php?res=2173574&qtype=full&reduce=2',
                            protocol: 'file',
                            origname: 'Programm_Prag19350109_op7-1.jpg',
                            format_name: 'JPEG2000',
                            nx: 0,
                            ny: 0,
                            duration: 0,
                            fps: 0
                        },
                        {
                            path: 'http://www.salsah.org/core/sendlocdata.php?res=2173574&qtype=full&reduce=1',
                            protocol: 'file',
                            origname: 'Programm_Prag19350109_op7-1.jpg',
                            format_name: 'JPEG2000',
                            nx: 0,
                            ny: 0,
                            duration: 0,
                            fps: 0
                        },
                        {
                            path: 'http://www.salsah.org/core/sendlocdata.php?res=2173574&qtype=full&reduce=0',
                            protocol: 'file',
                            origname: 'Programm_Prag19350109_op7-1.jpg',
                            format_name: 'JPEG2000',
                            nx: 0,
                            ny: 0,
                            duration: 0,
                            fps: 0
                        }
                    ],
                    [
                        {
                            path: 'http://www.salsah.org/core/sendlocdata.php?res=2173577&qtype=thumbnail',
                            protocol: 'file',
                            origname: 'Programm_Prag19350109_op7-2.jpg',
                            format_name: 'JPEG',
                            nx: 0,
                            ny: 0,
                            duration: '0.000',
                            fps: '0.000'
                        },
                        {
                            path: 'http://www.salsah.org/core/sendlocdata.php?res=2173577&qtype=full&reduce=5',
                            protocol: 'file',
                            origname: 'Programm_Prag19350109_op7-2.jpg',
                            format_name: 'JPEG2000',
                            nx: 0,
                            ny: 0,
                            duration: 0,
                            fps: 0
                        },
                        {
                            path: 'http://www.salsah.org/core/sendlocdata.php?res=2173577&qtype=full&reduce=4',
                            protocol: 'file',
                            origname: 'Programm_Prag19350109_op7-2.jpg',
                            format_name: 'JPEG2000',
                            nx: 0,
                            ny: 0,
                            duration: 0,
                            fps: 0
                        },
                        {
                            path: 'http://www.salsah.org/core/sendlocdata.php?res=2173577&qtype=full&reduce=3',
                            protocol: 'file',
                            origname: 'Programm_Prag19350109_op7-2.jpg',
                            format_name: 'JPEG2000',
                            nx: 0,
                            ny: 0,
                            duration: 0,
                            fps: 0
                        },
                        {
                            path: 'http://www.salsah.org/core/sendlocdata.php?res=2173577&qtype=full&reduce=2',
                            protocol: 'file',
                            origname: 'Programm_Prag19350109_op7-2.jpg',
                            format_name: 'JPEG2000',
                            nx: 0,
                            ny: 0,
                            duration: 0,
                            fps: 0
                        },
                        {
                            path: 'http://www.salsah.org/core/sendlocdata.php?res=2173577&qtype=full&reduce=1',
                            protocol: 'file',
                            origname: 'Programm_Prag19350109_op7-2.jpg',
                            format_name: 'JPEG2000',
                            nx: 0,
                            ny: 0,
                            duration: 0,
                            fps: 0
                        },
                        {
                            path: 'http://www.salsah.org/core/sendlocdata.php?res=2173577&qtype=full&reduce=0',
                            protocol: 'file',
                            origname: 'Programm_Prag19350109_op7-2.jpg',
                            format_name: 'JPEG2000',
                            nx: 0,
                            ny: 0,
                            duration: 0,
                            fps: 0
                        }
                    ]
                ],
                firstprop: ['Bild 1_2', 'Bild 2_2'],
                region: [null, null],
                context: 2,
                resinfo: {
                    regions: null,
                    project_id: '6',
                    person_id: '32',
                    restype_id: '125',
                    handle_id: null,
                    restype_name: 'webern:supplement',
                    restype_label: 'Supplement',
                    restype_description: 'Supplement',
                    restype_iconsrc:
                        'http://www.salsah.org/core/location.php?table=resource_type&field=icon&keyfield=id&keyvalue=125',
                    preview: null,
                    locations: null,
                    locdata: null,
                    resclass_name: 'object',
                    resclass_has_location: false,
                    lastmod: '2017-12-05 15:16:17',
                    lastmod_utc: '2017-12-05 14:16:17',
                    value_of: 0,
                    firstproperty: '[Programm:] Sdružení pro soudobou houdbu v Praze'
                },
                canonical_res_id: '2173561'
            };
            const image = new ResourceDetailImage(context, context.res_id.length - 1);
            expectedImages.push(image);

            // simulate the parent setting the input properties
            component.images = expectedImages;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('should have images', () => {
            expect(component.images).toBeDefined();
            expect(component.images).toBe(expectedImages);
        });
    });
});
