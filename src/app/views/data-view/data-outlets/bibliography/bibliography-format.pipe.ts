import { Pipe, PipeTransform } from '@angular/core';

import { BibEntry } from './bibliography-entry.model';

/**
 * The bibliography format pipe.
 *
 * It converts a {@link BibEntry} input into a formatted `BibEntry`.
 *
 * __Usage :__
 *   `{{ bibEntry | bibFormat }}`
 */
@Pipe({
    name: 'bibFormat',
})
export class BibliographyFormatPipe implements PipeTransform {
    /**
     * Private variable: _bibEntry.
     *
     * It keeps the input BibEntry.
     */
    private _bibEntry: BibEntry;

    /**
     * Private variable: _formattedBibEntry.
     *
     * It keeps the formatted BibEntry.
     */
    private _formattedBibEntry: BibEntry;

    /**
     * Private array: _formatKeyArr.
     *
     * It keeps an array of the BibEntry keys to be formatted.
     */
    private _formatKeyArr: Array<string> = [
        'Author',
        'Titel_unselbst',
        'Titel_selbst',
        'Herausgeber',
        'unpubliziert',
        'Verlagsort',
        'Publikationsdatum',
        'Reihentitel',
        'Seitenangabe',
    ];

    /**
     * Private map: _formatFunctions.
     *
     * It stores a map of format functions for each field key of a BibEntry.
     * The keys of the map correspond to the field keys, and the values are functions
     * that transform the field value in a particular way.
     */
    private _formatFunctions: Map<string, (value: any) => string> = new Map([
        ['Kurztitel', this._formatBibTitleShort],
        ['Author', this._formatBibAuthor],
        ['Titel_selbst', this._formatBibTitleIndep],
        ['Titel_unselbst', this._formatBibTitleDep],
        ['Herausgeber', this._formatBibEditor],
        ['unpubliziert', this._formatBibUnpublished],
        ['Verlagsort', this._formatBibPubPlace],
        ['Publikationsdatum', this._formatBibPubDate],
        ['Reihentitel', this._formatBibTitleSeries],
        ['Seitenangabe', this._formatBibPages],
    ]);

    /**
     * Transform method of the BibliographyFormatPipe.
     *
     * @param {BibEntry} bibItem The input BibEntry to be piped.
     *
     * @returns {*} The formatted BibEntry.
     */
    transform(bibItem: BibEntry): any {
        if (!bibItem) {
            return null;
        }
        this._bibEntry = bibItem;
        this._formattedBibEntry = this._getFormatKeys('edit', this._bibEntry);
        this._getFormattedValues(this._formattedBibEntry);

        return this._getFormatKeys('output', this._formattedBibEntry);
    }

    /**
     * Private function: _getFormatKeys.
     *
     * It gets the keys to be formatted from {@link _formatKeyArr}.
     *
     * @param {string} opt Options to be set: `output` or `edit`
     * @param {BibEntry} entry The input BibEntry.
     *
     * @returns {*}
     */
    private _getFormatKeys(opt: string, entry: BibEntry): any {
        let output: string | object = {};
        for (const key of this._formatKeyArr) {
            if (entry[key]) {
                if (opt === 'edit') {
                    output[key] = entry[key];
                } else if (opt === 'output') {
                    output = key === this._formatKeyArr[0] ? entry[key] : output + entry[key];
                }
            }
        }
        return output;
    }

    /**
     * Private function: _getFormattedValues.
     *
     * It separates the BibEntries object key-value pairs
     * by their keys and requests them to be converted.
     *
     * @param {BibEntry} entry The input BibEntry.
     *
     * @returns {BibEntry}
     */
    private _getFormattedValues(entry: BibEntry): BibEntry {
        Object.keys(entry).forEach(key => {
            entry[key] = this._getFormattedValueByKey(entry, key);
        });
        return entry;
    }

    /**
     * Private function: _getFormattedValueByKey.
     *
     * It requests the designated format functions for the values of the BibEntry.
     *
     * @param {BibEntry} entry The input BibEntry.
     * @param {string} key The key of a BibEntry key-value pair.
     *
     * @returns {string} The formatted value for the given key.
     */
    private _getFormattedValueByKey(entry: BibEntry, key: string): string {
        const formatFunction = this._formatFunctions.get(key) || ((value: any) => value);
        return formatFunction(entry[key]);
    }

    /**
     * Private function: _formatBibTitleShort.
     *
     * It formats the short title of the BibEntry.
     *
     * @param {string} shortTitle The short title of the BibEntry.
     *
     * @returns {string} The formatted short title.
     */
    private _formatBibTitleShort(shortTitle: string): string {
        return shortTitle ? `${shortTitle} | ` : '';
    }

    /**
     * Private function: _formatBibAuthor.
     *
     * It formats the author(s) of the BibEntry.
     *
     * @param {string} authors The author(s) of the BibEntry.
     *
     * @returns {string} The formatted author(s).
     */
    private _formatBibAuthor(authors: string | object): string {
        if (!authors) {
            return '';
        }

        let formattedAuthor = '';
        if (typeof authors === 'object') {
            // Get first author name
            formattedAuthor += this._splitName(authors[0], '');
            // Get further author names
            const l: number = Object.keys(authors).length;
            for (let i = 1; i < l; i++) {
                // Last name seperated by "und", others by comma
                const divider = i === l - 1 ? ' und ' : ', ';
                formattedAuthor += this._splitName(authors[i], divider);
            }
        } else if (typeof authors === 'string') {
            // Get author name
            formattedAuthor += this._splitName(authors, '');
        }
        formattedAuthor += ': '; // Ending author string with ":"
        return formattedAuthor;
    }

    /**
     * Private function: _formatBibTitleIndep.
     *
     * It formats the independent title(s) of the BibEntry.
     *
     * @param {string} indepTitle The independent title(s) of the BibEntry.
     *
     * @returns {string} The formatted independent title(s).
     */
    private _formatBibTitleIndep(indepTitle: string): string {
        if (!indepTitle) {
            return '';
        }
        if (this._bibEntry['Typ'] === 'Zeitschriftenartikel') {
            return indepTitle;
        }
        return indepTitle + ', ';
    }

    /**
     * Private function: _formatBibTitleDep.
     *
     * It formats the dependent title(s) of the BibEntry.
     *
     * @param {string} depTitle The dependent title(s) of the BibEntry.
     *
     * @returns {string} The formatted dependent title(s).
     */
    private _formatBibTitleDep(depTitle: string): string {
        return depTitle ? `„${depTitle}“, in: ` : '';
    }

    /**
     * Private function: _formatBibEditor.
     *
     * It formats the editor(s) of the BibEntry.
     *
     * @param {string} editors The editor(s) of the BibEntry.
     *
     * @returns {string} The formatted editor(s).
     */
    private _formatBibEditor(editors: string | object): string {
        if (!editors) {
            return '';
        }

        let formattedEditor = 'hg. von ';
        if (typeof editors === 'object') {
            // Get first editor name
            formattedEditor += this._splitName(editors[0], '');
            // Get further editor names
            const l: number = Object.keys(editors).length;
            for (let i = 1; i < l; i++) {
                // Last name separated by "und", others by comma
                const divider = i === l - 1 ? ' und ' : ', ';
                formattedEditor += this._splitName(editors[i], divider);
            }
        } else if (typeof editors === 'string') {
            // Get editor name
            formattedEditor += this._splitName(editors, '');
        }
        formattedEditor += ', '; // Ending editor string with ","
        return formattedEditor;
    }

    /**
     * Private function: _formatBibUnpublished.
     *
     * It formats the unpublished literature type (if any) of the BibEntry.
     *
     * @param {string} unpub The unpublished literature type of the BibEntry.
     *
     * @returns {string} The formatted unpublished literature type.
     */
    private _formatBibUnpublished(unpub: string): string {
        return unpub ? unpub + ' ' : '';
    }

    /**
     * Private function: _formatBibPubPlace.
     *
     * It formats the publication place and publisher of the BibEntry.
     *
     * @param {string} pubPlace The publication place of the BibEntry.
     *
     * @returns {string} The formatted publication place and publisher.
     */
    private _formatBibPubPlace(pubPlace: string | object): string {
        const pub = this._bibEntry['Verlag'] ? this._bibEntry['Verlag'] : null;
        if (!pubPlace) {
            // No place but publisher
            if (pub) {
                console.warn('Ort fehlt: "' + pub + '" (' + this._bibEntry['Kurztitel'] + ')');
            }
            // No place nor publisher ("zeitschriftenartikel")
            return '';
        }

        let out = '';
        // PubPlace == object
        if (typeof pubPlace === 'object') {
            const locl = Object.keys(pubPlace).length;
            if (pub) {
                if (typeof pub === 'object') {
                    const publ = Object.keys(pub).length;
                    if (publ === locl) {
                        // Publisher == object
                        // Case: "Kassel: Bärenreiter, und Stuttgart: Metzler,"
                        for (let i = 0; i < locl; i++) {
                            if (i === locl - 1) {
                                out += 'und ';
                            }
                            out += pubPlace[i] + ': ' + pub[i] + ', ';
                        }
                    }
                } else {
                    // Publisher == String
                    // Case: "Kassel, New York: Bärenreiter,"
                    for (let i = 0; i < locl; i++) {
                        if (i === locl - 1) {
                            out += pubPlace[i] + ': ' + pub + ', ';
                        } else {
                            out += pubPlace[i] + ', ';
                        }
                    }
                }
            } else {
                // No publisher
                // Case: "Wien, Stuttgart,"
                for (let i = 0; i < locl; i++) {
                    out += pubPlace[i] + ', ';
                }
                if (!this._bibEntry['unpubliziert']) {
                    console.warn('Verlag fehlt: "' + out + '" (' + this._bibEntry['Kurztitel'] + ')');
                }
            }
        } else {
            if (pub) {
                out += pubPlace + ': ';
                // Publisher == object
                // Case: "Wien: Böhlau, Lafite, "
                if (typeof pub === 'object') {
                    const publ = Object.keys(pub).length;
                    for (let i = 0; i < publ; i++) {
                        out += pub[i] + ', ';
                    }
                } else {
                    // Publisher == String
                    // Case: "Wien: Böhlau,"
                    out += pub + ', ';
                }
            } else {
                // Place without publisher (e.g. "Hochschulschriften")
                // Case: "Wien, "
                if (!this._bibEntry['unpubliziert']) {
                    console.warn('Verlag fehlt: "' + out + '" (' + this._bibEntry['Kurztitel'] + ')');
                }
                out += pubPlace + ', ';
            }
        }
        return out;
    }

    /**
     * Private function: _formatBibPublisher.
     *
     * It formats the publisher of the BibEntry.
     *
     * @param {string} pub The publisher of the BibEntry.
     *
     * @returns {string} The formatted publisher.
     *
     * DONE IN {@link _formatBibPubPlace}.
     */
    private _formatBibPublisher(pub: string): string {
        return '';
    }

    /**
     * Private function: _formatBibPubDate.
     *
     * It formats the publication date of the BibEntry.
     *
     * @param {string} pubDate The publication date of the BibEntry.
     *
     * @returns {string} The formatted publication date.
     */
    private _formatBibPubDate(pubDate: string) {
        const isJournalArticle = this._bibEntry['Typ'] === 'Zeitschriftenartikel';
        return isJournalArticle ? ` (${pubDate})` : ` ${pubDate}`;
    }

    /**
     * Private function: _formatBibTitleSeries.
     *
     * It formats the series title of the BibEntry.
     *
     * @param {string} seriesTitle The series title of the BibEntry.
     *
     * @returns {string} The formatted series title.
     */
    private _formatBibTitleSeries(seriesTitle: string): string {
        return seriesTitle ? ` (${seriesTitle})` : '';
    }

    /**
     * Private function: _formatBibPages.
     *
     * It formats the page numbers of the BibEntry.
     *
     * @param {string} pageNum The page numbers of the BibEntry.
     *
     * @returns {string} The formatted page numbers.
     */
    private _formatBibPages(pageNum: string | object): string {
        if (!pageNum) {
            return '';
        }

        let pages = '';
        if (typeof pageNum === 'object') {
            const l: number = Object.keys(pageNum).length;
            for (let i = 0; i < l; i++) {
                const prefix: string = i === 0 ? ', S. ' : ', ';
                pages += prefix + pageNum[i];
            }
        } else if (typeof pageNum === 'string' && pageNum) {
            pages = ', S. ' + pageNum;
        }
        return pages;
    }

    /**
     * Private function: _splitName.
     *
     * It splits a comma-separated name and defines the order
     * of items (according to bibliography style).
     *
     * @param {string} name A name to be converted.
     * @param {string} preDelimiter The delimiter to appear before a name, e.g. a comma.
     *
     * @returns {string} The splitted name(s).
     */
    private _splitName(name: string, preDelimiter: string): string {
        let tmp = [];
        if (name.match(',')) {
            tmp = name.split(', ');
            // Changes positions of first and last name
            // Look here: http://stackoverflow.com/a/5306832
            tmp.splice(1, 0, tmp.splice(0, 1)[0]);
            return preDelimiter + tmp[0] + ' ' + tmp[1];
        } else {
            return preDelimiter + name;
        }
    }
}
