import { Logos } from '@awg-core/core-models';

/**
 * Object constant with a set of logos.
 *
 * It provides metadata for the logos used in the app.
 *
 * Available logos: `unibas`, `snf`, `angular`, `bootstrap`.
 */
export const LOGOSDATA: Logos = {
    angular: {
        id: 'angularlogo',
        src: 'assets/img/logos/angular.svg',
        alt: 'Logo Angular',
        href: 'https://angular.io',
    },
    bootstrap: {
        id: 'bootstraplogo',
        src: 'assets/img/logos/ng-bootstrap.svg',
        alt: 'Logo ng-Bootstrap',
        href: 'https://ng-bootstrap.github.io/',
    },
    github: {
        id: 'githublogo',
        src: 'assets/img/logos/github.svg',
        alt: 'Logo GitHub',
        href: 'https://github.com/webern-unibas-ch/awg-app',
    },
    sagw: {
        id: 'sagwlogo',
        src: 'assets/img/logos/sagw.jpg',
        alt: 'Logo SAGW',
        href: 'https://sagw.ch/sagw/',
    },
    snf: {
        id: 'snflogo',
        src: 'assets/img/logos/snf.png',
        alt: 'Logo SNF',
        href: 'https://www.snf.ch',
    },
    sparql: {
        id: 'sparqllogo',
        src: 'assets/img/logos/sparql.svg',
        alt: 'Logo SPARQL',
        href: 'https://www.w3.org/TR/sparql11-query/',
    },
    unibas: {
        id: 'unibaslogo',
        src: 'assets/img/logos/uni.svg',
        alt: 'Logo Uni Basel',
        href: 'https://www.unibas.ch',
    },
};
