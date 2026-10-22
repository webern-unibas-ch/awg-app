import { createEnvironmentInjector, EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, it, vi } from 'vitest';

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { EditionGraphComponent } from './edition-graph.component';
import { EDITION_GRAPH_ROUTES } from './edition-graph.routes';
import { RdfStoreService } from './graph-visualizer/rdf-store/rdf-store.service';

describe('EDITION_GRAPH_ROUTES (DONE)', () => {
    let rdfStoreService: RdfStoreService;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        rdfStoreService = TestBed.inject(RdfStoreService);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should have one route for the EditionGraphComponent', () => {
        expectToBe(EDITION_GRAPH_ROUTES.length, 1);
        expectToBe(EDITION_GRAPH_ROUTES[0].path, '');
        expectToBe(EDITION_GRAPH_ROUTES[0].component, EditionGraphComponent);
        expectToEqual(EDITION_GRAPH_ROUTES[0].data, { title: 'AWG Online Edition – Graph' });
    });

    it('... should preload the rdfstore script when the route injector is created', () => {
        const preloadSpy = vi.spyOn(rdfStoreService, 'preload').mockResolvedValue(undefined);

        const routeInjector = createEnvironmentInjector(
            EDITION_GRAPH_ROUTES[0].providers ?? [],
            TestBed.inject(EnvironmentInjector)
        );

        expectSpyCall(preloadSpy, 1);

        routeInjector.destroy();
    });
});
