import { TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { SideInfoService } from './side-info.service';
import { SearchInfo } from '@awg-side-info/side-info-models';

describe('SideInfoService (DONE)', () => {
    let sideInfoService: SideInfoService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SideInfoService]
        });
        // inject service
        sideInfoService = TestBed.inject(SideInfoService);
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', () => {
        expect(sideInfoService).toBeTruthy();
    });

    describe('SearchInfoData', () => {
        describe('#getSearchInfoData', () => {
            it(`... should return default empty search info data`, done => {
                // init search info data
                const expectedSearchInfoData = new SearchInfo('---', '---');

                sideInfoService.getSearchInfoData().subscribe((searchInfo: SearchInfo) => {
                    expect(searchInfo).toEqual(expectedSearchInfoData, `should equal ${expectedSearchInfoData}`);
                    done();
                });
            });

            it(`... should return updated search info data`, done => {
                // init search info data
                let expectedSearchInfoData = new SearchInfo('---', '---');

                sideInfoService.getSearchInfoData().subscribe((searchInfo: SearchInfo) => {
                    expect(searchInfo).toEqual(expectedSearchInfoData, `should equal ${expectedSearchInfoData}`);
                    done();
                });

                // update search info data
                expectedSearchInfoData = new SearchInfo('Test', '5');
                sideInfoService.updateSearchInfoData(expectedSearchInfoData);
            });
        });

        describe('#updateSearchInfoData', () => {
            it(`... should emit updated search info data`, done => {
                // init search info data
                let expectedSearchInfoData = new SearchInfo('---', '---');

                sideInfoService.getSearchInfoData().subscribe((searchInfo: SearchInfo) => {
                    expect(searchInfo).toEqual(expectedSearchInfoData, `should equal ${expectedSearchInfoData}`);
                    done();
                });

                // update search info data
                expectedSearchInfoData = new SearchInfo('Test', '5');
                sideInfoService.updateSearchInfoData(expectedSearchInfoData);

                // update search info data
                expectedSearchInfoData = new SearchInfo('Test2', '3');
                sideInfoService.updateSearchInfoData(expectedSearchInfoData);
            });
        });

        describe('#clearSearchInfoData', () => {
            it(`... should update search info data with empty SearchInfo`, done => {
                const expectedSearchInfoData = new SearchInfo('---', '---');

                sideInfoService.getSearchInfoData().subscribe((searchInfo: SearchInfo) => {
                    expect(searchInfo).toEqual(expectedSearchInfoData, `should equal ${expectedSearchInfoData}`);
                    done();
                });

                // clear search info data
                sideInfoService.clearSearchInfoData();
            });

            it(`... should overwrite existing search info data`, done => {
                let expectedSearchInfoData = new SearchInfo('---', '---');

                sideInfoService.getSearchInfoData().subscribe((searchInfo: SearchInfo) => {
                    expect(searchInfo).toEqual(expectedSearchInfoData, `should equal ${expectedSearchInfoData}`);
                    done();
                });

                // update search info data
                expectedSearchInfoData = new SearchInfo('Test', '5');
                sideInfoService.updateSearchInfoData(expectedSearchInfoData);

                // clear search info data
                expectedSearchInfoData = new SearchInfo('---', '---');
                sideInfoService.clearSearchInfoData();
            });
        });
    });

    describe('SearchInfoTitle', () => {
        describe('#getSearchInfoTitle', () => {
            it(`... should return default empty search info title`, done => {
                // init search info title
                const expectedSearchInfoTitle = '';

                sideInfoService.getSearchInfoTitle().subscribe((title: string) => {
                    expect(title).toBe(expectedSearchInfoTitle, `should be ${expectedSearchInfoTitle}`);
                    expect(title).not.toBeTruthy('should be empty string');
                    done();
                });
            });

            it(`... should return updated search info title`, done => {
                // init search info title
                let expectedSearchInfoTitle = '';

                sideInfoService.getSearchInfoTitle().subscribe((title: string) => {
                    expect(title).toBe(expectedSearchInfoTitle, `should be ${expectedSearchInfoTitle}`);
                    done();
                });

                // update search info title
                expectedSearchInfoTitle = 'Test';
                sideInfoService.updateSearchInfoTitle(expectedSearchInfoTitle);
            });
        });

        describe('#updateSearchInfoTitle', () => {
            it(`... should emit updated search info title`, done => {
                // init search info title
                let expectedSearchInfoTitle = '';

                sideInfoService.getSearchInfoTitle().subscribe((title: string) => {
                    expect(title).toBe(expectedSearchInfoTitle, `should be ${expectedSearchInfoTitle}`);
                    done();
                });

                // update search info title
                expectedSearchInfoTitle = 'Test';
                sideInfoService.updateSearchInfoTitle(expectedSearchInfoTitle);

                // update search info title
                expectedSearchInfoTitle = 'Test2';
                sideInfoService.updateSearchInfoTitle(expectedSearchInfoTitle);
            });
        });

        describe('#clearSearchInfoTitle', () => {
            it(`... should update search info title with empty string`, done => {
                sideInfoService.getSearchInfoTitle().subscribe((title: string) => {
                    expect(title).not.toBeTruthy('should be empty string');
                    done();
                });

                sideInfoService.clearSearchInfoTitle();
            });

            it(`... should overwrite existing search info title`, done => {
                // init search info title
                let expectedSearchInfoTitle = '';

                sideInfoService.getSearchInfoTitle().subscribe((title: string) => {
                    expect(title).toBe(expectedSearchInfoTitle, `should be ${expectedSearchInfoTitle}`);
                    done();
                });

                // update search info title
                expectedSearchInfoTitle = 'Test';
                sideInfoService.updateSearchInfoTitle(expectedSearchInfoTitle);

                // clear search info title
                expectedSearchInfoTitle = '';
                sideInfoService.clearSearchInfoTitle();
            });
        });
    });
});
