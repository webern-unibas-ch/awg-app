/**
 * The EditionConstants class.
 *
 * It is used in the context of the edition view
 * to store string constants of the editions.
 */
export class EditionConstants {
    /**
     * The route to the edition path of the app.
     */
    static readonly editionRoute = '/edition';

    /**
     * The route to the composition path of an edition.
     */
    static readonly compositionRoute = '/composition';

    /**
     * The path to the edition section of series I.
     */
    static readonly series1 = {
        path: '/series1',
        short: 'Serie I',
        full: 'Serie I (Werke mit Opuszahlen)'
    };

    /**
     * The path to the edition section of series II.
     */
    static readonly series2 = {
        path: '/series2',
        short: 'Serie II',
        full: 'Serie II (Nachgelassene Kompositionen und Fragmente)'
    };

    /**
     * The path to the edition section of series III.
     */
    static readonly series3 = {
        path: '/series3',
        short: 'Serie III',
        full: 'Serie III (Bearbeitungen von Werken anderer Komponisten)'
    };

    /**
     * The path to the edition section of section 1.
     */
    static readonly section1 = {
        path: '/section1',
        short: 'Abteilung 1',
        full: 'Abteilung 1 (Orchestermusik)'
    };

    /**
     * The path to the edition section of section 1.
     */
    static readonly section2 = {
        path: '/section2',
        short: 'Abteilung 2',
        full: 'Abteilung 2 (Kammer- und Klaviermusik)'
    };

    /**
     * The path to the edition section of section 3.
     */
    static readonly section3 = {
        path: '/section3',
        short: 'Abteilung 3',
        full: 'Abteilung 3 (Chormusik)'
    };

    /**
     * The path to the edition section of section 1.
     */
    static readonly section4 = {
        path: '/section4',
        short: 'Abteilung 4',
        full: 'Abteilung 4 (Vokalmusik mit Ensemblebegleitung)'
    };

    /**
     * The path to the edition section of section 1.
     */
    static readonly section5 = {
        path: '/section5',
        short: 'Abteilung 5',
        full: 'Abteilung 5 (Klavierlieder)'
    };

    /**
     * The path to the edition section of a text edition.
     */
    static readonly textEdition = {
        path: '/texts',
        short: 'Textedition',
        full: 'Textedition'
    };

    /**
     * The path to the edition section of a sketch edition.
     */
    static readonly sketchEdition = {
        path: '/sketches',
        short: 'Skizzenedition',
        full: 'Skizzenedition'
    };

    /**
     * The path to the intro section of an edition.
     */
    static readonly editionIntro = {
        path: 'intro',
        short: 'Einleitung',
        full: 'Einleitung'
    };

    /**
     * The path to the detail section of an edition.
     */
    static readonly editionDetail = {
        path: 'detail',
        short: 'Edierter Notentext',
        full: 'Edierter Notentext'
    };

    /**
     * The path to the report section of an edition.
     */
    static readonly editionReport = {
        path: 'report',
        short: 'Kritischer Bericht',
        full: 'Kritischer Bericht'
    };

    /**
     * The path to the assets image of a firm sign: JE No. 9, 28 Lines.
     */
    static readonly firmJENo9Lin28 = 'assets/img/edition/sI/a5/op12/firm_je_no9_lin28.png';
}
