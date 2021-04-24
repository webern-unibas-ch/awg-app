import { TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { SideInfoService } from './side-info.service';
import { SearchInfo } from '@awg-side-info/side-info-models';

describe('SideInfoService (DONE)', () => {
    let sideInfoService: SideInfoService;

    let expectedSearchInfoData: SearchInfo;
    let expectedSearchInfoTitle: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SideInfoService],
        });
        // Inject service
        sideInfoService = TestBed.inject(SideInfoService);

        // Test data (default)
        expectedSearchInfoData = new SearchInfo('---', '---');
        expectedSearchInfoTitle = '';
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', () => {
        expect(sideInfoService).toBeTruthy();
    });

    it('should have searchInfoDataSubject', () => {
        expect((sideInfoService as any)._searchInfoDataSubject).toBeTruthy();
    });

    it('should have searchInfoDataStream$', () => {
        expect((sideInfoService as any)._searchInfoDataStream$).toBeTruthy();
    });

    it('should have searchInfoTitleSubject', () => {
        expect((sideInfoService as any)._searchInfoTitleSubject).toBeTruthy();
    });

    it('should have searchInfoTitleStream$', () => {
        expect((sideInfoService as any)._searchInfoTitleStream$).toBeTruthy();
    });

    describe('SearchInfoData', () => {
        describe('#getSearchInfoData', () => {
            it('... should return default empty search info data', done => {
                sideInfoService.getSearchInfoData().subscribe((searchInfo: SearchInfo) => {
                    expect(searchInfo).toEqual(expectedSearchInfoData, `should equal ${expectedSearchInfoData}`);
                    done();
                });
            });

            it('... should return updated search info data', done => {
                sideInfoService.getSearchInfoData().subscribe((searchInfo: SearchInfo) => {
                    expect(searchInfo).toEqual(expectedSearchInfoData, `should equal ${expectedSearchInfoData}`);
                    done();
                });

                // Update search info data
                expectedSearchInfoData = new SearchInfo('Test', '5');
                sideInfoService.updateSearchInfoData(expectedSearchInfoData);
            });
        });

        describe('#updateSearchInfoData', () => {
            it('... should emit updated search info data', done => {
                sideInfoService.getSearchInfoData().subscribe((searchInfo: SearchInfo) => {
                    expect(searchInfo).toEqual(expectedSearchInfoData, `should equal ${expectedSearchInfoData}`);
                    done();
                });

                // Update search info data
                expectedSearchInfoData = new SearchInfo('Test', '5');
                sideInfoService.updateSearchInfoData(expectedSearchInfoData);

                // Update search info data
                expectedSearchInfoData = new SearchInfo('Test2', '3');
                sideInfoService.updateSearchInfoData(expectedSearchInfoData);
            });
        });

        describe('#clearSearchInfoData', () => {
            it('... should update search info data with empty SearchInfo', done => {
                sideInfoService.getSearchInfoData().subscribe((searchInfo: SearchInfo) => {
                    expect(searchInfo).toEqual(expectedSearchInfoData, `should equal ${expectedSearchInfoData}`);
                    done();
                });

                // Clear search info data
                sideInfoService.clearSearchInfoData();
            });

            it('... should overwrite existing search info data', done => {
                sideInfoService.getSearchInfoData().subscribe((searchInfo: SearchInfo) => {
                    expect(searchInfo).toEqual(expectedSearchInfoData, `should equal ${expectedSearchInfoData}`);
                    done();
                });

                // Update search info data
                expectedSearchInfoData = new SearchInfo('Test', '5');
                sideInfoService.updateSearchInfoData(expectedSearchInfoData);

                // Clear search info data
                expectedSearchInfoData = new SearchInfo('---', '---');
                sideInfoService.clearSearchInfoData();
            });
        });
    });

    describe('SearchInfoTitle', () => {
        describe('#getSearchInfoTitle', () => {
            it('... should return default empty search info title', done => {
                sideInfoService.getSearchInfoTitle().subscribe((title: string) => {
                    expect(title).toBe(expectedSearchInfoTitle, `should be ${expectedSearchInfoTitle}`);
                    expect(title).not.toBeTruthy('should be empty string');
                    done();
                });
            });

            it('... should return updated search info title', done => {
                sideInfoService.getSearchInfoTitle().subscribe((title: string) => {
                    expect(title).toBe(expectedSearchInfoTitle, `should be ${expectedSearchInfoTitle}`);
                    done();
                });

                // Update search info title
                expectedSearchInfoTitle = 'Test';
                sideInfoService.updateSearchInfoTitle(expectedSearchInfoTitle);
            });
        });

        describe('#updateSearchInfoTitle', () => {
            it('... should emit updated search info title', done => {
                sideInfoService.getSearchInfoTitle().subscribe((title: string) => {
                    expect(title).toBe(expectedSearchInfoTitle, `should be ${expectedSearchInfoTitle}`);
                    done();
                });

                // Update search info title
                expectedSearchInfoTitle = 'Test';
                sideInfoService.updateSearchInfoTitle(expectedSearchInfoTitle);

                // Update search info title
                expectedSearchInfoTitle = 'Test2';
                sideInfoService.updateSearchInfoTitle(expectedSearchInfoTitle);
            });
        });

        describe('#clearSearchInfoTitle', () => {
            it('... should update search info title with empty string', done => {
                sideInfoService.getSearchInfoTitle().subscribe((title: string) => {
                    expect(title).not.toBeTruthy('should be empty string');
                    done();
                });

                sideInfoService.clearSearchInfoTitle();
            });

            it('... should overwrite existing search info title', done => {
                sideInfoService.getSearchInfoTitle().subscribe((title: string) => {
                    expect(title).toBe(expectedSearchInfoTitle, `should be ${expectedSearchInfoTitle}`);
                    done();
                });

                // Update search info title
                expectedSearchInfoTitle = 'Test';
                sideInfoService.updateSearchInfoTitle(expectedSearchInfoTitle);

                // Clear search info title
                expectedSearchInfoTitle = '';
                sideInfoService.clearSearchInfoTitle();
            });
        });
    });
});
