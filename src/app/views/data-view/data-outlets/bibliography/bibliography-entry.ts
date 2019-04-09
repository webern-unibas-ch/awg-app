/* tslint:disable variable-name */

export class BibEntry {
    constructor(
        public Kurztitel: string,
        public Typ: string,
        public Author: string,
        public Titel_selbst: string,
        public Publikationsdatum: string,
        public Titel_unselbst?: string,
        public Herausgeber?: string,
        public unpubliziert?: string,
        public Verlagsort?: string,
        public Verlag?: string,
        public Seitenangabe?: string,
        public Reihentitel?: string,
        public Versionsdatum?: string,
        public Status?: string,
        public Quelle?: string,
        public Standort?: string,
        public Kommentar?: string
    ) {}
}
