export class BibEntry {

    constructor(
        public id: string,
        public shortname: string,
        public type: string,
        public author: string,
        public title_independent: string,
        public pubdate: number,
        public title_dependent?: string,
        public editor?: string,
        public unpublished?: string,
        public pubplace?: string,
        public publisher?: string,
        public title_series?: string,
        public pages?: string
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
