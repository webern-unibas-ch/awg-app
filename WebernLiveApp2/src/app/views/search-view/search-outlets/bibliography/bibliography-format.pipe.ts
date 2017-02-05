import { Pipe, PipeTransform } from '@angular/core';

import { BibEntry } from './bibliography-entry';

@Pipe({
    name: 'bibFormat'
})
export class BibliographyFormatPipe implements PipeTransform {

    private entry: BibEntry;
    public formattedOutput: string = '';

    transform(bibItem: BibEntry): any {
        if (!bibItem) {
            return null;
        }
        this.entry = bibItem;

        Object.keys(bibItem).forEach( key  => {
            let value: string = '';
            switch (key) {
            /*
                case 'Kurztitel':
                    value = this.filterBibTitleShort(bibItem[key]);
                    break;
            */
                case 'Author':
                    value = this.filterBibAuthor(bibItem[key]);
                    break;
                case 'Titel_selbst':
                    value = this.filterBibTitleIndep(bibItem[key]);
                    break;
                case 'Titel_unselbst':
                    value = this.filterBibTitleDep(bibItem[key]);
                    break;
                case 'Herausgeber':
                    value = this.filterBibEditor(bibItem[key]);
                    break;
                case 'unpubliziert':
                    value = this.filterBibUnpublished(bibItem[key]);
                    break;
                case 'Verlagsort':
                    value = this.filterBibPubPlace(bibItem[key]);
                    break;
            /* done in pubplace
                 case 'publisher':
                 value = this.filterBibPublisher(bibItem[key]);
                 break;
            */
                case 'Publikationsdatum':
                    value = this.filterBibPubDate(bibItem[key]);
                    break;
                case 'Reihentitel':
                    value = this.filterBibTitleSeries(bibItem[key]);
                    break;
                case 'Seitenangabe':
                    value = this.filterBibPages(bibItem[key]);
                    break;
            }
            this.formattedOutput += value;
        });
        // TODO#rm: console.info('PIPE#formattedOutput: ', this.formattedOutput);
        return this.formattedOutput;
    }

    // TODO#rm?: filter for short titles in bibliography
    private filterBibTitleShort(shortTitle: string) {
        let title: string = (!shortTitle) ? '' : shortTitle + ' | ';
        return title;
    }

    // filter for authors in bibliography
    filterBibAuthor(authors: string | Object) {
        if (!authors) return '';

        let formattedAuthor: string = '';
        if (typeof authors === 'object') {
            // get first author name
            formattedAuthor += this.splitName(authors[0], '');
            // get further author names
            const l: number = Object.keys(authors).length;
            for (let i = 1; i < l; i++) {
                // last name seperated by "und", others by comma
                let divider = (i === l-1) ? ' und ' : ', ';
                formattedAuthor += this.splitName(authors[i], divider);
            }
        } else if (typeof authors === 'string') {
            // get author name
            formattedAuthor += this.splitName(authors, '');
        };
        formattedAuthor += ': '; //ending author string with ":"
        return formattedAuthor;
    }

    // filter for independent titles in bibliography
    private filterBibTitleIndep(indepTitle: string) {
        let formattedTitle: string = (!indepTitle) ? '' : ((this.entry['Typ'] !== 'Zeitschriftenartikel') ? indepTitle + ', ' : indepTitle);
        return formattedTitle;
    }

    // filter for dependent titles in bibliography
    private filterBibTitleDep(depTitle: string) {
        let formattedTitle: string = (!depTitle) ? '' : '„' + depTitle + '“, in: ';
        return formattedTitle;
    }

    // filter for editors in bibliography
    private filterBibEditor(editors: string | Object) {
        if (!editors) return '';

        let formattedEditor = 'hg. von ';
        if (typeof editors === 'object') {
            // get first editor name
            formattedEditor += this.splitName(editors[0], '');
            // get further editor names
            const l: number = Object.keys(editors).length;
            for (let i = 1; i < l; i++) {
                // last name seperated by "und", others by comma
                let divider = (i === l-1) ? ' und ' : ', '
                formattedEditor += this.splitName(editors[i], divider);
            }
        } else if (typeof editors === 'string') {
            // get editor name
            formattedEditor += this.splitName(editors, '');
        }
        formattedEditor += ', '; // ending editor string with ","
        return formattedEditor;
    }


    // filter for unpublished literature in bibliography
    private filterBibUnpublished(unpub: string) {
        let type: string = (!unpub) ? '' : unpub + ' ';
        return type;
    }

    // filter for publication place in bilbiography
    private filterBibPubPlace(pubPlace: string | Object) {
        let pub = (this.entry['Herausgeber']) ? this.entry['Herausgeber'] : null;
        if (!pubPlace) {
            // no place but publisher
            if (pub) console.info('Ort fehlt: "' + pub + '" (' + this.entry['Kurztitel'] + ')');
            // no place nor publisher ("zeitschriftenartikel")
            return '';
        }

        let out: string = '';
        // pubPlace == object
        if (typeof pubPlace === 'object') {
            let locl = Object.keys(pubPlace).length;
            if (pub) {
                if (typeof pub === 'object') {
                    let publ = Object.keys(pub).length;
                    if (publ === locl) {
                        // publisher == object
                        // case: "Kassel: Bärenreiter, und Stuttgart: Metzler,"
                        for (let i = 0; i < locl; i++) {
                            if (i === locl - 1) {
                                out += 'und ';
                            }
                            out += pubPlace[i] + ': ' + pub[i] + ', ';
                        }
                    }
                } else {
                    // publisher == String
                    // case: "Kassel, New York: Bärenreiter,"
                    for (let i = 0; i < locl; i++) {
                        if (i === locl - 1) {
                            out += pubPlace[i] + ': ' + pub + ', ';
                        } else {
                            out += pubPlace[i] + ', ';
                        }
                    }
                }
            } else {
                // no publisher
                // case: "Wien, Stuttgart,"
                for (let i = 0; i < locl; i++) {
                    out += pubPlace[i] + ', ';
                }
                if (!this.entry['unpubliziert']) {
                    console.info('Verlag fehlt: "' + out + '" (' + this.entry['Kurztitel'] + ')');
                }
            }
        }
        // pubPlace == String
        else {
            if (pub) {
                out += pubPlace + ': ';
                // publisher == object
                // case: "Wien: Böhlau, Lafite, "
                if (typeof pub === 'object') {
                    let publ = Object.keys(pub).length;
                    for (let i = 0; i < publ; i++) {
                        out += pub[i] + ', ';
                    }
                } else {
                    // publisher == String
                    // case: "Wien: Böhlau,"
                    out += pub + ', ';
                }
            } else {
                // place without publisher (e.g. "Hochschulschriften")
                // case: "Wien, "
                if (!this.entry['unpubliziert']) {
                    console.info('Verlag fehlt: "' + out + '" (' + this.entry['Kurztitel'] + ')');
                }
                out += pubPlace + ', ';
            }
        }
        return out;
    }

    // filter for publisher in bibliography
    private filterBibPublisher(pub: string) {
        return '';
    }

    // filter for date in bibliography
    private filterBibPubDate(pubDate: string) {
        let date = (this.entry['Typ'] === 'Zeitschriftenartikel') ? ' (' + pubDate + ')' : ' ' + pubDate;
        return date;
    }

    // filter for series titles in bibliography
    private filterBibTitleSeries(seriesTitle: string) {
        let title: string = (!seriesTitle) ? '' : ' (' + seriesTitle + ')';
        return title;
    }

    // filter for pages in bibliography
    private filterBibPages(pageNum: string | Object) {
        if (!pageNum) return '';

        let pages: string = '';
        if (typeof pageNum === 'object') {
            let l: number = Object.keys(pageNum).length;
            for (let i = 0; i < l; i++) {
                pages += ', S. ' + pageNum[i];
            }
        } else if (typeof pageNum === 'string' && pageNum) {
            pages = ', S. ' + pageNum;
        };
        return pages;
    }

    // splits array with names and defines the order of items (according to bibliography style)
    private splitName(name, pre_delimiter){
        let tmp = [];
        if (name.match(',')) {
            tmp = name.split(', ');
            //changes positions of first and last name
            //look here: http://stackoverflow.com/a/5306832
            tmp.splice(1, 0, tmp.splice(0, 1)[0]);
            return pre_delimiter + tmp[0] + ' ' + tmp[1];
        } else {
            return pre_delimiter + name;
        }
    }

}
