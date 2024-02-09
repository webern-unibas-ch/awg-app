import { TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { SearchInfo } from '@awg-side-info/side-info-models';
import { SideInfoService } from './side-info.service';

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

    it('... should create', () => {
        expect(sideInfoService).toBeTruthy();
    });

    it('... should have searchInfoDataSubject', () => {
        expect((sideInfoService as any)._searchInfoDataSubject).toBeTruthy();
    });

    it('... should have searchInfoDataStream$', () => {
        expect((sideInfoService as any)._searchInfoDataStream$).toBeTruthy();
    });

    it('... should have searchInfoTitleSubject', () => {
        expect((sideInfoService as any)._searchInfoTitleSubject).toBeTruthy();
    });

    it('... should have searchInfoTitleStream$', () => {
        expect((sideInfoService as any)._searchInfoTitleStream$).toBeTruthy();
    });

    describe('SearchInfoData', () => {
        describe('#getSearchInfoData()', () => {
            it('... should have a method `getSearchInfoData`', () => {
                expect(sideInfoService.getSearchInfoData).toBeDefined();
            });

            it('... should return default empty search info data', waitForAsync(() => {
                sideInfoService.getSearchInfoData().subscribe({
                    next: (searchInfo: SearchInfo) => {
                        expect(searchInfo).toBeTruthy();
                        expect(searchInfo)
                            .withContext(`should equal ${expectedSearchInfoData}`)
                            .toEqual(expectedSearchInfoData);
                    },
                });
            }));

            it('... should return updated search info data', waitForAsync(() => {
                sideInfoService.getSearchInfoData().subscribe({
                    next: (searchInfo: SearchInfo) => {
                        expect(searchInfo).toBeTruthy();
                        expect(searchInfo)
                            .withContext(`should equal ${expectedSearchInfoData}`)
                            .toEqual(expectedSearchInfoData);
                    },
                });

                // Update search info data
                expectedSearchInfoData = new SearchInfo('Test', '5');
                sideInfoService.updateSearchInfoData(expectedSearchInfoData);
            }));
        });

        describe('#updateSearchInfoData()', () => {
            it('... should have a method `updateSearchInfoData`', () => {
                expect(sideInfoService.updateSearchInfoData).toBeDefined();
            });

            it('... should emit updated search info data', waitForAsync(() => {
                sideInfoService.getSearchInfoData().subscribe({
                    next: (searchInfo: SearchInfo) => {
                        expect(searchInfo).toBeTruthy();
                        expect(searchInfo)
                            .withContext(`should equal ${expectedSearchInfoData}`)
                            .toEqual(expectedSearchInfoData);
                    },
                });

                // Update search info data
                expectedSearchInfoData = new SearchInfo('Test', '5');
                sideInfoService.updateSearchInfoData(expectedSearchInfoData);

                // Update search info data
                expectedSearchInfoData = new SearchInfo('Test2', '3');
                sideInfoService.updateSearchInfoData(expectedSearchInfoData);
            }));
        });

        describe('#clearSearchInfoData()', () => {
            it('... should have a method `clearSearchInfoData`', () => {
                expect(sideInfoService.clearSearchInfoData).toBeDefined();
            });

            it('... should update search info data with empty SearchInfo', waitForAsync(() => {
                sideInfoService.getSearchInfoData().subscribe({
                    next: (searchInfo: SearchInfo) => {
                        expect(searchInfo).toBeTruthy();
                        expect(searchInfo)
                            .withContext(`should equal ${expectedSearchInfoData}`)
                            .toEqual(expectedSearchInfoData);
                    },
                });

                // Clear search info data
                sideInfoService.clearSearchInfoData();
            }));

            it('... should overwrite existing search info data', waitForAsync(() => {
                sideInfoService.getSearchInfoData().subscribe({
                    next: (searchInfo: SearchInfo) => {
                        expect(searchInfo).toBeTruthy();
                        expect(searchInfo)
                            .withContext(`should equal ${expectedSearchInfoData}`)
                            .toEqual(expectedSearchInfoData);
                    },
                });

                // Update search info data
                expectedSearchInfoData = new SearchInfo('Test', '5');
                sideInfoService.updateSearchInfoData(expectedSearchInfoData);

                // Clear search info data
                expectedSearchInfoData = new SearchInfo('---', '---');
                sideInfoService.clearSearchInfoData();
            }));
        });
    });

    describe('SearchInfoTitle', () => {
        describe('#getSearchInfoTitle()', () => {
            it('... should have a method `getSearchInfoTitle`', () => {
                expect(sideInfoService.getSearchInfoTitle).toBeDefined();
            });

            it('... should return default empty search info title', waitForAsync(() => {
                sideInfoService.getSearchInfoTitle().subscribe({
                    next: (title: string) => {
                        expect(title).not.toBeTruthy();
                        expect(title).withContext(`should be ${expectedSearchInfoTitle}`).toBe(expectedSearchInfoTitle);
                    },
                });
            }));

            it('... should return updated search info title', waitForAsync(() => {
                sideInfoService.getSearchInfoTitle().subscribe({
                    next: (title: string) => {
                        expect(title).withContext(`should be ${expectedSearchInfoTitle}`).toBe(expectedSearchInfoTitle);
                    },
                });

                // Update search info title
                expectedSearchInfoTitle = 'Test';
                sideInfoService.updateSearchInfoTitle(expectedSearchInfoTitle);
            }));
        });

        describe('#updateSearchInfoTitle()', () => {
            it('... should have a method `updateSearchInfoTitle`', () => {
                expect(sideInfoService.updateSearchInfoTitle).toBeDefined();
            });

            it('... should emit updated search info title', waitForAsync(() => {
                sideInfoService.getSearchInfoTitle().subscribe({
                    next: (title: string) => {
                        expect(title).withContext(`should be ${expectedSearchInfoTitle}`).toBe(expectedSearchInfoTitle);
                    },
                });

                // Update search info title
                expectedSearchInfoTitle = 'Test';
                sideInfoService.updateSearchInfoTitle(expectedSearchInfoTitle);

                // Update search info title
                expectedSearchInfoTitle = 'Test2';
                sideInfoService.updateSearchInfoTitle(expectedSearchInfoTitle);
            }));
        });

        describe('#clearSearchInfoTitle()', () => {
            it('... should have a method `clearSearchInfoTitle`', () => {
                expect(sideInfoService.clearSearchInfoTitle).toBeDefined();
            });

            it('... should update search info title with empty string', waitForAsync(() => {
                sideInfoService.getSearchInfoTitle().subscribe({
                    next: (title: string) => {
                        expect(title).not.toBeTruthy();
                    },
                });

                sideInfoService.clearSearchInfoTitle();
            }));

            it('... should overwrite existing search info title', waitForAsync(() => {
                sideInfoService.getSearchInfoTitle().subscribe({
                    next: (title: string) => {
                        expect(title).withContext(`should be ${expectedSearchInfoTitle}`).toBe(expectedSearchInfoTitle);
                    },
                });

                // Update search info title
                expectedSearchInfoTitle = 'Test';
                sideInfoService.updateSearchInfoTitle(expectedSearchInfoTitle);

                // Clear search info title
                expectedSearchInfoTitle = '';
                sideInfoService.clearSearchInfoTitle();
            }));
        });
    });
});
