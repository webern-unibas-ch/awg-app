/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BibliographyServiceService } from './bibliography.service';

describe('BibliographyServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BibliographyServiceService]
    });
  });

  it('should ...', inject([BibliographyServiceService], (service: BibliographyServiceService) => {
    expect(service).toBeTruthy();
  }));
});
