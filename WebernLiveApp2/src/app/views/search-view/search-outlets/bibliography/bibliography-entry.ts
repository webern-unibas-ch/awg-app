export class BibEntry {

    constructor(
        public Kurztitel: string,
        public Typ: string,
        public Author: string,
        public Titel_selbst: string,
        public Publikationsdatum: number,
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


    // TODO:
    /*
     "webern:bibl_title_short": {};
     "webern:bibl_type": {},
     "dc:author": {},
     "webern:bibl_title_dependent_rt": {},
     "webern:bibl_title_independent_rt": {},
     "webern:editor": {},
     "webern:bibl_unpublished": {},
     "webern:place_publisher": {},
     "webern:bibl_publisher": {},
     "webern:ed_pubdate": {},
     "webern:bibl_title_series_rt": {},
     "webern:bibl_pages": {},
     "webern:bibl_addition_rt": {},
     "webern:bibl_abstract_rt": {},
     "webern:bibl_online_rt": {},
     "webern:date_version": {},
     "webern:bibl_status": {},
     "webern:bibl_source_rt": {},
     "webern:bibl_location_rt": {},
     "salsah:comment_rt": {}
     },
     */
}
