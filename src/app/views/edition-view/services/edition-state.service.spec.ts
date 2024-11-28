import { TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { EditionComplex, EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionOutlineService } from '@awg-views/edition-view/services';

import { EditionStateService } from './edition-state.service';

describe('EditionStateService (DONE)', () => {
    let editionStateService: EditionStateService;

    let expectedEditionComplex: EditionComplex;
    let expectedEditionOutline: EditionOutlineSeries[];
    let expectedEditionSeries: EditionOutlineSeries;
    let expectedEditionSection: EditionOutlineSection;
    let expectedIsIntroView: boolean;
    let expectedIsPrefaceView: boolean;
    let expectedIsRowTableView: boolean;

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionStateService],
        });
        // Inject service
        editionStateService = TestBed.inject(EditionStateService);

        // Test data (default)
        expectedEditionComplex = EditionComplexesService.getEditionComplexById('OP12');
        expectedEditionOutline = EditionOutlineService.getEditionOutline();
        expectedEditionSeries = expectedEditionOutline[0];
        expectedEditionSection = expectedEditionOutline[0].sections[0];
        expectedIsIntroView = true;
        expectedIsPrefaceView = true;
        expectedIsRowTableView = true;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(editionStateService).toBeTruthy();
    });

    it('... should have bufferSize = 1', () => {
        expectToBe((editionStateService as any)._bufferSize, 1);
    });

    it('... should have _isIntroViewSubject', () => {
        expect((editionStateService as any)._isIntroViewSubject).toBeTruthy();
    });

    it('... should have _isIntroViewStream$', () => {
        expect((editionStateService as any)._isIntroViewStream$).toBeTruthy();
    });

    it('... should have _isPrefaceViewSubject', () => {
        expect((editionStateService as any)._isPrefaceViewSubject).toBeTruthy();
    });

    it('... should have _isPrefaceViewStream$', () => {
        expect((editionStateService as any)._isPrefaceViewStream$).toBeTruthy();
    });

    it('... should have _isRowTableViewSubject', () => {
        expect((editionStateService as any)._isRowTableViewSubject).toBeTruthy();
    });

    it('... should have _isRowTableViewStream$', () => {
        expect((editionStateService as any)._isRowTableViewStream$).toBeTruthy();
    });

    it('... should have _selectedEditionComplexSubject', () => {
        expect((editionStateService as any)._selectedEditionComplexSubject).toBeTruthy();
    });

    it('... should have _selectedEditionComplexStream$', () => {
        expect((editionStateService as any)._selectedEditionComplexStream$).toBeTruthy();
    });

    it('... should have _selectedEditionSeriesSubject', () => {
        expect((editionStateService as any)._selectedEditionSeriesSubject).toBeTruthy();
    });

    it('... should have _selectedEditionSeriesStream$', () => {
        expect((editionStateService as any)._selectedEditionSeriesStream$).toBeTruthy();
    });

    it('... should have _selectedEditionSectionSubject', () => {
        expect((editionStateService as any)._selectedEditionSectionSubject).toBeTruthy();
    });

    describe('EditionComplex', () => {
        describe('#getSelectedEditionComplex()', () => {
            it('... should have a method `getSelectedEditionComplex`', () => {
                expect(editionStateService.getSelectedEditionComplex).toBeDefined();
            });

            it('... should return given editionComplex', waitForAsync(() => {
                editionStateService.getSelectedEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expectToEqual(editionComplex, expectedEditionComplex);
                    },
                });

                // Set editionComplex (with default value)
                editionStateService.updateSelectedEditionComplex(expectedEditionComplex);
            }));

            it('... should return updated editionComplex', waitForAsync(() => {
                editionStateService.getSelectedEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expectToEqual(editionComplex, expectedEditionComplex);
                    },
                });

                // Set editionComplex (with default value)
                editionStateService.updateSelectedEditionComplex(expectedEditionComplex);

                // Update editionComplex
                expectedEditionComplex = EditionComplexesService.getEditionComplexById('OP25');
                editionStateService.updateSelectedEditionComplex(expectedEditionComplex);
            }));
        });

        describe('#updateSelectedEditionComplex()', () => {
            it('... should have a method `updateSelectedEditionComplex`', () => {
                expect(editionStateService.updateSelectedEditionComplex).toBeDefined();
            });

            it('... should emit updated editionComplex', waitForAsync(() => {
                editionStateService.getSelectedEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expectToEqual(editionComplex, expectedEditionComplex);
                    },
                });

                // Set editionComplex
                editionStateService.updateSelectedEditionComplex(expectedEditionComplex);

                // Update editionComplex
                expectedEditionComplex = EditionComplexesService.getEditionComplexById('OP25');
                editionStateService.updateSelectedEditionComplex(expectedEditionComplex);
            }));
        });

        describe('#clearSelectedEditionComplex()', () => {
            it('... should have a method `clearSelectedEditionComplex`', () => {
                expect(editionStateService.clearSelectedEditionComplex).toBeDefined();
            });

            it('... should update edition complex with null value', waitForAsync(() => {
                editionStateService.getSelectedEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expectToEqual(editionComplex, expectedEditionComplex);
                    },
                });

                // Clear editionComplex
                expectedEditionComplex = null;
                editionStateService.clearSelectedEditionComplex();
            }));

            it('... should overwrite existing values', waitForAsync(() => {
                editionStateService.getSelectedEditionComplex().subscribe({
                    next: (editionComplex: EditionComplex) => {
                        expectToEqual(editionComplex, expectedEditionComplex);
                    },
                });

                // Update editionComplex
                editionStateService.updateSelectedEditionComplex(expectedEditionComplex);

                // Clear editionComplex
                expectedEditionComplex = null;
                editionStateService.clearSelectedEditionComplex();
            }));
        });
    });

    describe('EditionSeries', () => {
        describe('#getSelectedEditionSeries()', () => {
            it('... should have a method `getSelectedEditionSeries`', () => {
                expect(editionStateService.getSelectedEditionSeries).toBeDefined();
            });

            it('... should return selected editionSeries', waitForAsync(() => {
                editionStateService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expectToEqual(editionSeries, expectedEditionSeries);
                    },
                });

                // Set editionSeries (with default value)
                editionStateService.updateSelectedEditionSeries(expectedEditionSeries);
            }));

            it('... should return updated editionSeries', waitForAsync(() => {
                editionStateService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expectToEqual(editionSeries, expectedEditionSeries);
                    },
                });

                // Set editionSeries (with default value)
                editionStateService.updateSelectedEditionSeries(expectedEditionSeries);

                // Update editionSeries
                expectedEditionSeries = expectedEditionOutline[1];
                editionStateService.updateSelectedEditionSeries(expectedEditionSeries);
            }));
        });

        describe('#updateSelectedEditionSeries()', () => {
            it('... should have a method `updateSelectedEditionSeries`', () => {
                expect(editionStateService.updateSelectedEditionSeries).toBeDefined();
            });

            it('... should emit updated editionSeries', waitForAsync(() => {
                editionStateService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expectToEqual(editionSeries, expectedEditionSeries);
                    },
                });

                // Set editionSeries (with default value)
                editionStateService.updateSelectedEditionSeries(expectedEditionSeries);

                // Update editionSeries
                expectedEditionSeries = expectedEditionOutline[1];
                editionStateService.updateSelectedEditionSeries(expectedEditionSeries);
            }));
        });

        describe('#clearSelectedEditionSeries()', () => {
            it('... should have a method `clearSelectedEditionSeries`', () => {
                expect(editionStateService.clearSelectedEditionSeries).toBeDefined();
            });

            it('... should update editionSeries with null value', waitForAsync(() => {
                editionStateService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expectToEqual(editionSeries, expectedEditionSeries);
                    },
                });

                // Clear editionSeries
                expectedEditionSeries = null;
                editionStateService.clearSelectedEditionSeries();
            }));

            it('... should overwrite existing values', waitForAsync(() => {
                editionStateService.getSelectedEditionSeries().subscribe({
                    next: (editionSeries: EditionOutlineSeries) => {
                        expectToEqual(editionSeries, expectedEditionSeries);
                    },
                });

                // Update editionSeries
                editionStateService.updateSelectedEditionSeries(expectedEditionSeries);

                // Clear editionSeries
                expectedEditionSeries = null;
                editionStateService.clearSelectedEditionSeries();
            }));
        });
    });

    describe('EditionSection', () => {
        describe('#getSelectedEditionSection()', () => {
            it('... should have a method  `getSelectedEditionSection`', () => {
                expect(editionStateService.getSelectedEditionSection).toBeDefined();
            });

            it('... should return selected editionSection', waitForAsync(() => {
                editionStateService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expectToEqual(editionSection, expectedEditionSection);
                    },
                });

                // Set editionSection (with default value)
                editionStateService.updateSelectedEditionSection(expectedEditionSection);
            }));

            it('... should return updated editionSection', waitForAsync(() => {
                editionStateService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expectToEqual(editionSection, expectedEditionSection);
                    },
                });

                // Set editionSection (with default value)
                editionStateService.updateSelectedEditionSection(expectedEditionSection);

                // Update editionSection
                expectedEditionSection = expectedEditionOutline[0].sections[4];
                editionStateService.updateSelectedEditionSection(expectedEditionSection);
            }));
        });

        describe('#updateSelectedEditionSection()', () => {
            it('... should have a method  `updateSelectedEditionSection`', () => {
                expect(editionStateService.updateSelectedEditionSection).toBeDefined();
            });

            it('... should emit updated editionSection', waitForAsync(() => {
                editionStateService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expectToEqual(editionSection, expectedEditionSection);
                    },
                });

                // Set editionSection (with default value)
                editionStateService.updateSelectedEditionSection(expectedEditionSection);

                // Update editionSection
                expectedEditionSection = expectedEditionOutline[0].sections[4];
                editionStateService.updateSelectedEditionSection(expectedEditionSection);
            }));
        });

        describe('#clearSelectedEditionSection()', () => {
            it('... should have a method `clearSelectedEditionSection`', () => {
                expect(editionStateService.clearSelectedEditionSection).toBeDefined();
            });

            it('... should update editionSection with null value', waitForAsync(() => {
                editionStateService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expectToEqual(editionSection, expectedEditionSection);
                    },
                });

                // Clear editionSection
                expectedEditionSection = null;
                editionStateService.clearSelectedEditionSection();
            }));

            it('... should overwrite existing values', waitForAsync(() => {
                editionStateService.getSelectedEditionSection().subscribe({
                    next: (editionSection: EditionOutlineSection) => {
                        expectToEqual(editionSection, expectedEditionSection);
                    },
                });

                // Update editionSection
                editionStateService.updateSelectedEditionSection(expectedEditionSection);

                // Clear editionSection
                expectedEditionSection = null;
                editionStateService.clearSelectedEditionSection();
            }));
        });
    });

    describe('IntroView', () => {
        describe('#getIsIntroView()', () => {
            it('... should have a method `getIsIntroView`', () => {
                expect(editionStateService.getIsIntroView).toBeDefined();
            });

            it('... should return isIntroView', waitForAsync(() => {
                editionStateService.getIsIntroView().subscribe({
                    next: (isIntroView: boolean) => {
                        expectToBe(isIntroView, expectedIsIntroView);
                    },
                });

                // Set isIntroView (with default value)
                editionStateService.updateIsIntroView(expectedIsIntroView);
            }));

            it('... should return updated isIntroView', waitForAsync(() => {
                editionStateService.getIsIntroView().subscribe({
                    next: (isIntroView: boolean) => {
                        expectToBe(isIntroView, expectedIsIntroView);
                    },
                });

                // Set isIntroView (with default value)
                editionStateService.updateIsIntroView(expectedIsIntroView);

                // Update isIntroView
                expectedIsIntroView = false;
                editionStateService.updateIsIntroView(expectedIsIntroView);
            }));
        });

        describe('#updateIsIntroView()', () => {
            it('... should have a method `updateIsIntroView`', () => {
                expect(editionStateService.updateIsIntroView).toBeDefined();
            });

            it('... should emit updated isIntroView', waitForAsync(() => {
                editionStateService.getIsIntroView().subscribe({
                    next: (isIntroView: boolean) => {
                        expectToBe(isIntroView, expectedIsIntroView);
                    },
                });

                // Set isIntroView (with default value)
                editionStateService.updateIsIntroView(expectedIsIntroView);

                // Update isIntroView
                expectedIsIntroView = false;
                editionStateService.updateIsIntroView(expectedIsIntroView);
            }));
        });

        describe('#clearIsIntroView()', () => {
            it('... should have a method `clearIsIntroView`', () => {
                expect(editionStateService.clearIsIntroView).toBeDefined();
            });

            it('... should update isIntroView with null value', waitForAsync(() => {
                editionStateService.getIsIntroView().subscribe({
                    next: (isIntroView: boolean) => {
                        expectToBe(isIntroView, expectedIsIntroView);
                    },
                });

                // Clear isIntroView
                expectedIsIntroView = null;
                editionStateService.clearIsIntroView();
            }));

            it('... should overwrite existing values', waitForAsync(() => {
                editionStateService.getIsIntroView().subscribe({
                    next: (isIntroView: boolean) => {
                        expectToBe(isIntroView, expectedIsIntroView);
                    },
                });

                // Update isIntroView
                editionStateService.updateIsIntroView(expectedIsIntroView);

                // Clear isIntroView
                expectedIsIntroView = null;
                editionStateService.clearIsIntroView();
            }));
        });
    });

    describe('PrefaceView', () => {
        describe('#getIsPrefaceView()', () => {
            it('... should have a method `getIsPrefaceView`', () => {
                expect(editionStateService.getIsPrefaceView).toBeDefined();
            });

            it('... should return isPrefaceView', waitForAsync(() => {
                editionStateService.getIsPrefaceView().subscribe({
                    next: (isPrefaceView: boolean) => {
                        expectToBe(isPrefaceView, expectedIsPrefaceView);
                    },
                });

                // Set isPrefaceView (with default value)
                editionStateService.updateIsPrefaceView(expectedIsPrefaceView);
            }));

            it('... should return updated isPrefaceView', waitForAsync(() => {
                editionStateService.getIsPrefaceView().subscribe({
                    next: (isPrefaceView: boolean) => {
                        expectToBe(isPrefaceView, expectedIsPrefaceView);
                    },
                });

                // Set isPrefaceView (with default value)
                editionStateService.updateIsPrefaceView(expectedIsPrefaceView);

                // Update isPrefaceView
                expectedIsPrefaceView = false;
                editionStateService.updateIsPrefaceView(expectedIsPrefaceView);
            }));
        });

        describe('#updateIsPrefaceView()', () => {
            it('... should have a method `updateIsPrefaceView`', () => {
                expect(editionStateService.updateIsPrefaceView).toBeDefined();
            });

            it('... should emit updated isPrefaceView', waitForAsync(() => {
                editionStateService.getIsPrefaceView().subscribe({
                    next: (isPrefaceView: boolean) => {
                        expectToBe(isPrefaceView, expectedIsPrefaceView);
                    },
                });

                // Set isPrefaceView (with default value)
                editionStateService.updateIsPrefaceView(expectedIsPrefaceView);

                // Update isPrefaceView
                expectedIsPrefaceView = false;
                editionStateService.updateIsPrefaceView(expectedIsPrefaceView);
            }));
        });

        describe('#clearIsPrefaceView()', () => {
            it('... should have a method `clearIsPrefaceView`', () => {
                expect(editionStateService.clearIsPrefaceView).toBeDefined();
            });

            it('... should update isPrefaceView with null value', waitForAsync(() => {
                editionStateService.getIsPrefaceView().subscribe({
                    next: (isPrefaceView: boolean) => {
                        expectToBe(isPrefaceView, expectedIsPrefaceView);
                    },
                });

                // Clear isPrefaceView
                expectedIsPrefaceView = null;
                editionStateService.clearIsPrefaceView();
            }));

            it('... should overwrite existing values', waitForAsync(() => {
                editionStateService.getIsPrefaceView().subscribe({
                    next: (isPrefaceView: boolean) => {
                        expectToBe(isPrefaceView, expectedIsPrefaceView);
                    },
                });

                // Update isPrefaceView
                editionStateService.updateIsPrefaceView(expectedIsPrefaceView);

                // Clear isPrefaceView
                expectedIsPrefaceView = null;
                editionStateService.clearIsPrefaceView();
            }));
        });
    });

    describe('RowTableView', () => {
        describe('#getIsRowTableView()', () => {
            it('... should have a method `getIsRowTableView`', () => {
                expect(editionStateService.getIsRowTableView).toBeDefined();
            });

            it('... should return isRowTableView', waitForAsync(() => {
                editionStateService.getIsRowTableView().subscribe({
                    next: (isRowTableView: boolean) => {
                        expectToBe(isRowTableView, expectedIsRowTableView);
                    },
                });

                // Set isRowTableView (with default value)
                editionStateService.updateIsRowTableView(expectedIsRowTableView);
            }));

            it('... should return updated isRowTableView', waitForAsync(() => {
                editionStateService.getIsRowTableView().subscribe({
                    next: (isRowTableView: boolean) => {
                        expectToBe(isRowTableView, expectedIsRowTableView);
                    },
                });

                // Set isRowTableView (with default value)
                editionStateService.updateIsRowTableView(expectedIsRowTableView);

                // Update isRowTableView
                expectedIsRowTableView = false;
                editionStateService.updateIsRowTableView(expectedIsRowTableView);
            }));
        });

        describe('#updateIsRowTableView()', () => {
            it('... should have a method `updateIsRowTableView`', () => {
                expect(editionStateService.updateIsRowTableView).toBeDefined();
            });

            it('... should emit updated isRowTableView', waitForAsync(() => {
                editionStateService.getIsRowTableView().subscribe({
                    next: (isRowTableView: boolean) => {
                        expectToBe(isRowTableView, expectedIsRowTableView);
                    },
                });

                // Set isRowTableView (with default value)
                editionStateService.updateIsRowTableView(expectedIsRowTableView);

                // Update isRowTableView
                expectedIsRowTableView = false;
                editionStateService.updateIsRowTableView(expectedIsRowTableView);
            }));
        });

        describe('#clearIsRowTableView()', () => {
            it('... should have a method `clearIsRowTableView`', () => {
                expect(editionStateService.clearIsRowTableView).toBeDefined();
            });

            it('... should update isRowTableView with null value', waitForAsync(() => {
                editionStateService.getIsRowTableView().subscribe({
                    next: (isRowTableView: boolean) => {
                        expectToBe(isRowTableView, expectedIsRowTableView);
                    },
                });

                // Clear isRowTableView
                expectedIsRowTableView = null;
                editionStateService.clearIsRowTableView();
            }));

            it('... should overwrite existing values', waitForAsync(() => {
                editionStateService.getIsRowTableView().subscribe({
                    next: (isRowTableView: boolean) => {
                        expectToBe(isRowTableView, expectedIsRowTableView);
                    },
                });

                // Update isRowTableView
                editionStateService.updateIsRowTableView(expectedIsRowTableView);

                // Clear isRowTableView
                expectedIsRowTableView = null;
                editionStateService.clearIsRowTableView();
            }));
        });
    });
});
