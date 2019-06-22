import { Logos } from '@awg-core/core-models';

/**
 * Object constant with a set of logos.
 *
 * It provides metadata for the logos used in the app.
 *
 * Available logos: `unibas`, `snf`, `angular`, `bootstrap`.
 */
export const LOGOSDATA: Logos = {
    unibas: {
        id: 'unibaslogo',
        src: 'assets/img/logos/uni.svg',
        alt: 'Logo Uni Basel',
        href: 'https://www.unibas.ch'
    },
    snf: {
        id: 'snflogo',
        src: 'assets/img/logos/snf.png',
        alt: 'Logo SNF',
        href: 'http://www.snf.ch'
    },
    angular: {
        id: 'angularlogo',
        src: 'assets/img/logos/angular.svg',
        alt: 'Logo Angular',
        href: 'https://angular.io'
    },
    bootstrap: {
        id: 'bootstraplogo',
        src: 'assets/img/logos/ng-bootstrap.svg',
        alt: 'Logo ng-Bootstrap',
        href: 'https://ng-bootstrap.github.io/'
    }
};
