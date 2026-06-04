import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { D3Service } from './d3.service';

describe('D3Service', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('... should create', () => {
        const service: D3Service = TestBed.inject(D3Service);
        expect(service).toBeTruthy();
    });
});
