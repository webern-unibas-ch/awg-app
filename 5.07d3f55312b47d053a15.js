(window.webpackJsonp = window.webpackJsonp || []).push([
  [5],
  {
    "+OBV": function(e, t) {
      e.exports =
        '<awg-json-viewer\r\n    [jsonViewerHeader]="\'Converted JSON response from Salsah-API\'"\r\n    [jsonViewerData]="resourceJsonConvertedData">\r\n</awg-json-viewer>\r\n';
    },
    "/bvn": function(e, t) {
      e.exports =
        "/************************************************\r\n*\r\n*               CREDITS\r\n*\r\n* This code is inspired, adapted or taken from:\r\n*\r\n* ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xe4ologischen Instituts (DAI)\r\n* https://arachne.dainst.org/entity/1121229**]\r\n* 20.11.2017\r\n*\r\n*\r\n*\r\n************************************************/\r\n\r\n/* props */\r\n\r\n.props ul {\r\n    padding-left: 0;\r\n    margin-top: 0.5rem;\r\n    margin-bottom: 0.25rem;\r\n}\r\n\r\n.props li {\r\n    list-style: none;\r\n    padding: 0.25rem 0;\r\n}\r\n\r\n.props .prop .prop-label {\r\n    margin-top: 8px;\r\n    margin-bottom: -4px;\r\n    display: block;\r\n    font-size: 21px;\r\n    font-weight: 400;\r\n}\r\n\r\n.props .prop .prop-value {\r\n    padding: 3px 0;\r\n    margin-left: 1rem;\r\n}\r\n";
    },
    "0Kzf": function(e, t) {
      e.exports =
        '\x3c!-- resource detail box --\x3e\r\n<div class="awg-resource-detail-tabs" *ngIf="resourceData; else error">\r\n\r\n    <ngb-tabset>\r\n        \x3c!-- html --\x3e\r\n        <ngb-tab id="html" class="awg-resource-detail-long-tab">\r\n            <ng-template ngbTabTitle>\r\n                {{ tabTitle?.html }}\r\n            </ng-template>\r\n            <ng-template ngbTabContent>\r\n                \x3c!-- resourceDetailData header --\x3e\r\n                <awg-resource-detail-header *ngIf="resourceData?.html?.header"\r\n                                            [header]="resourceData?.html?.header"\r\n                                            [resourceUrl]="resourceUrl"\r\n                                            (resourceRequest)="navigateToResource($event)">\r\n                </awg-resource-detail-header>\r\n\r\n                \x3c!-- html visualisation --\x3e\r\n                <awg-resource-detail-html *ngIf="resourceData?.html"\r\n                                          [resourceDetailData]="resourceData?.html"\r\n                                          (resourceRequest)="navigateToResource($event)">\r\n                </awg-resource-detail-html>\r\n            </ng-template>\r\n        </ngb-tab>\r\n\r\n        \x3c!-- JSON converted --\x3e\r\n        <ngb-tab id="converted" title="{{ tabTitle?.converted }}" class="awg-resource-detail-short-tab">\r\n            <ng-template ngbTabContent>\r\n                \x3c!-- resourceDetailData header --\x3e\r\n                <awg-resource-detail-header *ngIf="resourceData?.html?.header"\r\n                                            [header]="resourceData?.html?.header"\r\n                                            [resourceUrl]="resourceUrl"\r\n                                            (resourceRequest)="navigateToResource($event)">\r\n                </awg-resource-detail-header>\r\n\r\n                \x3c!-- converted json visualisation --\x3e\r\n                <awg-resource-detail-json-converted *ngIf="resourceData?.jsonConverted"\r\n                                                    [resourceJsonConvertedData]="resourceData?.jsonConverted">\r\n                </awg-resource-detail-json-converted>\r\n            </ng-template>\r\n        </ngb-tab>\r\n\r\n        \x3c!-- JSON raw --\x3e\r\n        <ngb-tab id="raw" title="{{ tabTitle?.raw }}" class="awg-resource-detail-short-tab">\r\n            <ng-template ngbTabContent>\r\n                \x3c!-- resourceDetailData header --\x3e\r\n                <awg-resource-detail-header *ngIf="resourceData?.html?.header"\r\n                                            [header]="resourceData?.html?.header"\r\n                                            [resourceUrl]="resourceUrl"\r\n                                            (resourceRequest)="navigateToResource($event)">\r\n                </awg-resource-detail-header>\r\n\r\n                \x3c!-- raw json visualisation --\x3e\r\n                <awg-resource-detail-json-raw *ngIf="resourceData?.jsonRaw"\r\n                                              [resourceJsonRawData]="resourceData?.jsonRaw">\r\n                </awg-resource-detail-json-raw>\r\n            </ng-template>\r\n        </ngb-tab>\r\n\r\n    </ngb-tabset>\r\n\r\n    \x3c!--\r\n    TODO: remove\r\n    <ul class="nav nav-tabs nav-justified" role="tablist">\r\n        <li class="active awg-resource-detail-long-tab"><a data-toggle="tab" href="#html">{{ tabTitle?.html }}</a></li>\r\n        <li class="dropdown awg-resource-detail-short-tab">\r\n            <a href="#" data-toggle="dropdown" class="dropdown-toggle">\r\n                {{ \'{\' }} JSON {{ \'}\' }} <b class="caret"></b>\r\n            </a>\r\n            <ul class="dropdown-menu dropdown-menu-right">\r\n                <li><a data-toggle="tab" href="#converted">{{ tabTitle?.converted }}</a></li>\r\n                <li><a data-toggle="tab" href="#raw">{{ tabTitle?.raw }}</a></li>\r\n            </ul>\r\n        </li>\r\n    </ul>\r\n\r\n    --\x3e\r\n\r\n</div>\r\n\r\n<ng-template #error>\r\n    <div class="errorMessage" *ngIf="errorMessage">\r\n        <p>Die Anfrage "{{ errorMessage?.route }}" ist fehlgeschlagen.</p>\r\n        <p>Fehlermeldung: "{{ errorMessage?.statusText }}".</p>\r\n        <p>M\xf6glicherweise gab es ein Problem mit der Internetverbindung oder dem verwendeten Suchbegriff.</p>\r\n    </div>\r\n</ng-template>\r\n';
    },
    "0Soa": function(e, t) {
      e.exports = "";
    },
    "0lSh": function(e, t) {
      e.exports =
        "/************************************************\r\n*\r\n*               CREDITS\r\n*\r\n* This code is inspired, adapted or taken from:\r\n*\r\n* ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xe4ologischen Instituts (DAI)\r\n* https://arachne.dainst.org/entity/1121229**]\r\n* 20.11.2017\r\n*\r\n*\r\n*\r\n************************************************/\r\n\r\n/* for resource-header see 'resource-detail-html-header.component.css' */\r\n\r\n/* for resource-html-props see 'props.component.css' */\r\n\r\n/* tabs */\r\n\r\n/* adjust tab size on larger screens */\r\n\r\n@media screen and (min-width: 768px) {\r\n    /* set auto width for long tab */\r\n    .awg-resource-detail-long-tab {\r\n        width: auto !important;\r\n    }\r\n    /* avoid line wrap in link text */\r\n    .awg-resource-detail-short-tab > a {\r\n        white-space: nowrap;\r\n    }\r\n}\r\n";
    },
    "200b": function(e, t) {
      e.exports =
        '\x3c!-- content: search --\x3e\r\n\r\n\x3c!-- heading --\x3e\r\n<awg-heading [title]="searchTitle" [id]="searchId"></awg-heading>\r\n\r\n\x3c!-- help-block --\x3e\r\n<div class="help-block">\r\n    BETA: Suche momentan noch mit eingeschr\xe4nkter Funktionalit\xe4t\r\n</div>\r\n\r\n\x3c!-- search routes --\x3e\r\n<router-outlet></router-outlet>\r\n\r\n';
    },
    "2vxS": function(e, t) {
      e.exports = "";
    },
    "3ti1": function(e, t) {
      e.exports =
        '<awg-json-viewer\r\n    [jsonViewerHeader]="\'Raw JSON response from Salsah-API\'"\r\n    [jsonViewerData]="resourceJsonRawData">\r\n</awg-json-viewer>\r\n\r\n';
    },
    "479E": function(e, t) {
      e.exports = "";
    },
    "8AlX": function(e, t) {
      e.exports =
        '\x3c!--\r\n/************************************************\r\n*\r\n*               CREDITS\r\n*\r\n* This code is inspired, adapted or taken from:\r\n*\r\n* ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xe4ologischen Instituts (DAI)\r\n* https://arachne.dainst.org/entity/1121229**]\r\n* 20.11.2017\r\n*\r\n*\r\n*\r\n************************************************/ --\x3e\r\n\x3c!-- resourceDetailData content --\x3e\r\n<div class="resource-content">\r\n    <div class="row">\r\n\r\n        \x3c!-- object properties --\x3e\r\n        <div class="col-lg-8">\r\n            <awg-resource-detail-html-content-props *ngIf="content?.props"\r\n                                                    [props]="content?.props"\r\n                                                    (resourceRequest)="navigateToResource($event)">\r\n            </awg-resource-detail-html-content-props>\r\n        </div>\r\n\r\n        \x3c!-- right side nav objects --\x3e\r\n        <div class="col-lg-4 mt-3 mt-lg-0 mb-3">\r\n            <div class="sidenav-right">\r\n\r\n                \x3c!-- image objects --\x3e\r\n                <awg-resource-detail-html-content-imageobjects *ngIf="content?.images.length > 0"\r\n                                                               [images]="content?.images"\r\n                                                               (resourceRequest)="navigateToResource($event)">\r\n                </awg-resource-detail-html-content-imageobjects>\r\n\r\n\r\n                \x3c!-- connected objects --\x3e\r\n                <awg-resource-detail-html-content-linkedobjects *ngIf="content?.incoming"\r\n                                                                [incoming]="content?.incoming"\r\n                                                                (resourceRequest)="navigateToResource($event)">\r\n                </awg-resource-detail-html-content-linkedobjects>\r\n\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n';
    },
    "9jsp": function(e, t) {
      e.exports = "";
    },
    Byhm: function(e, t) {
      e.exports = "";
    },
    INsQ: function(e, t) {
      e.exports = "";
    },
    JA5L: function(e, t) {
      e.exports =
        '<awg-router-link-button-group *ngIf="searchButtonArray"\r\n    [buttonArray]="searchButtonArray"\r\n    (selectButtonRequest)="onButtonSelect($event)">\r\n</awg-router-link-button-group>\r\n\r\n<router-outlet></router-outlet>\r\n';
    },
    WpHx: function(e, t) {
      e.exports =
        '\x3c!--\r\n/************************************************\r\n*\r\n*               CREDITS\r\n*\r\n* This code is inspired, adapted or taken from:\r\n*\r\n* ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xe4ologischen Instituts (DAI)\r\n* https://arachne.dainst.org/entity/1121229**]\r\n* 20.11.2017\r\n*\r\n*\r\n*\r\n************************************************/ --\x3e\r\n\x3c!-- resourceDetailData content: image objects --\x3e\r\n<div class="awg-image-obj mb-3">\r\n\r\n    \x3c!-- header --\x3e\r\n    <h5>\r\n        \x3c!-- TODO: link to image overview\r\n            <a (click)="navigateToSearchResults()">\r\n            --\x3e\r\n        Abbildungen <span>({{ images?.length }})</span>\r\n        \x3c!--\r\n        </a>\r\n        --\x3e\r\n    </h5>\r\n\r\n    \x3c!-- image slider --\x3e\r\n    <div class="awg-image-slider">\r\n\r\n        \x3c!-- preview image box --\x3e\r\n        <div id="awg-previewbox" class="card" *ngIf="currentImageIndex >= 0">\r\n            \x3c!-- control arrows --\x3e\r\n            <a class="awg-image-slider-nav-left" *ngIf="currentImageIndex > 0" (click)="setImage(currentImageIndex - 1)">\r\n                <fa-icon [icon]="faChevronCircleLeft"></fa-icon>\r\n            </a>\r\n            <a class="awg-image-slider-nav-right" *ngIf="currentImageIndex < images?.length - 1" (click)="setImage(currentImageIndex + 1)">\r\n                <fa-icon [icon]="faChevronCircleRight"></fa-icon>\r\n            </a>\r\n            \x3c!-- preview image --\x3e\r\n            <div id="awg-preview-img-container">\r\n                <a id="awg-preview-img" [href]="images[currentImageIndex].fullSize" target="_blank" ref="noopener noreferrer">\r\n                    <img [src]="images[currentImageIndex].reductSize" alt="{{ images[currentImageIndex].label }}" id="{{ images[currentImageIndex].res_id }}" height="300">\r\n                </a>\r\n            </div>\r\n        </div>\r\n\r\n        \x3c!-- thumbnails --\x3e\r\n        <div id="awg-thumbbox" #thumbBox *ngIf="images.length > 1">\r\n            \x3c!-- control arrows --\x3e\r\n            <a class="awg-image-slider-nav-left" [hidden]="offset <= 0" (click)="pageThumbsLeft()">\r\n                <fa-icon [icon]="faChevronCircleLeft"></fa-icon>\r\n            </a>\r\n            <a class="awg-image-slider-nav-right" [hidden]="offset >= max" (click)="pageThumbsRight()">\r\n                <fa-icon [icon]="faChevronCircleRight"></fa-icon>\r\n            </a>\r\n            \x3c!-- thumb images --\x3e\r\n            <div id="awg-thumb-img-container" #thumbImageContainer style="transform: translateX(0px);" [ngStyle]="{\'transform\': \'translateX(-\'+offset+\'px)\',\'-webkit-transform\': \'translateX(-\'+offset+\'px)\'}">\r\n                \x3c!--  --\x3e\r\n                <a class="awg-thumb-img" #thumbImages *ngFor="let image of images; let i = index" [ngClass]="{ \'active\': i === currentImageIndex }" (click)="setImage(i)" >\r\n                    <img [src]="image.reductSize" alt="{{ image.label }}" id="{{ image.res_id }}" height="70">\r\n                </a>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\x3c!-- end DIV image-slider --\x3e\r\n</div>\x3c!-- end DIV image-obj --\x3e\r\n';
    },
    X16u: function(e, t) {
      e.exports =
        "/************************************************\r\n *\r\n *               CREDITS\r\n *\r\n * This code is inspired, adapted or taken from:\r\n *\r\n * ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xe4ologischen Instituts (DAI)\r\n * https://arachne.dainst.org/entity/1121229**]\r\n * 20.11.2017\r\n *\r\n *\r\n *\r\n ************************************************/\r\n\r\n/* image preview */\r\n\r\n.awg-image-slider #awg-previewbox {\r\n    position: relative;\r\n    height: 300px;\r\n    background-color: #e7e7e7;\r\n}\r\n\r\n.awg-image-slider .awg-image-slider-nav-left {\r\n    left: 5px;\r\n}\r\n\r\n.awg-image-slider .awg-image-slider-nav-right {\r\n    right: 5px;\r\n}\r\n\r\n.awg-image-slider #awg-thumbbox .awg-image-slider-nav-left,\r\n.awg-image-slider #awg-thumbbox .awg-image-slider-nav-right {\r\n    top: 23px;\r\n}\r\n\r\n.awg-image-slider #awg-previewbox .awg-image-slider-nav-left,\r\n.awg-image-slider #awg-previewbox .awg-image-slider-nav-right {\r\n    opacity: 0;\r\n    top: 49%;\r\n    -webkit-transform: translateY(-50%);\r\n            transform: translateY(-50%);\r\n    transition: 0.5s ease-in-out;\r\n}\r\n\r\n.awg-image-slider #awg-previewbox:hover .awg-image-slider-nav-left,\r\n.awg-image-slider #awg-previewbox:hover .awg-image-slider-nav-right {\r\n    opacity: 1;\r\n}\r\n\r\n.awg-image-slider .awg-image-slider-nav-left,\r\n.awg-image-slider .awg-image-slider-nav-right {\r\n    position: absolute;\r\n    font-size: 1.5em;\r\n    height: 1.5em;\r\n    width: 1.5em;\r\n    z-index: 1503;\r\n    cursor: pointer;\r\n    color: #37588e;\r\n    background-color: #ededed;\r\n    padding: 3px;\r\n    border-radius: 1.5em;\r\n    text-align: center;\r\n}\r\n\r\n.awg-image-slider #awg-preview-img-container {\r\n    width: 100%;\r\n    height: 300px;\r\n    white-space: nowrap;\r\n    text-align: center;\r\n    font: 0/0 a;\r\n}\r\n\r\n.awg-image-slider #awg-preview-img::before {\r\n    content: ' ';\r\n    display: inline-block;\r\n    vertical-align: middle;\r\n    height: 100%;\r\n}\r\n\r\n.awg-image-slider #awg-preview-img img {\r\n    vertical-align: middle;\r\n    cursor: zoom-in;\r\n    /* height: auto; */\r\n    max-width: 100%;\r\n}\r\n\r\n/* image thumbnails */\r\n\r\n.awg-image-slider #awg-thumbbox {\r\n    overflow: hidden;\r\n    padding: 4px;\r\n    position: relative;\r\n\r\n    /* card-like style */\r\n    background-color: #fff;\r\n    background-clip: border-box;\r\n    border: 1px solid rgba(0, 0, 0, 0.125);\r\n    border-radius: 0.25rem;\r\n}\r\n\r\n.awg-image-slider #awg-thumb-img-container {\r\n    height: 70px;\r\n    width: auto;\r\n    white-space: nowrap;\r\n    /* transform: translateX(0px);*/\r\n    transition: 0.5s ease-in-out;\r\n    display: inline-block;\r\n}\r\n\r\n.awg-image-slider #awg-thumb-img-container a {\r\n    opacity: 0.3;\r\n    cursor: pointer;\r\n}\r\n\r\n.awg-image-slider #awg-thumb-img-container a.active,\r\n.awg-image-slider #awg-thumb-img-container a:hover {\r\n    opacity: 1;\r\n    text-decoration: none;\r\n}\r\n";
    },
    X5pM: function(e, t) {
      e.exports =
        "/************************************************\r\n *\r\n *               CREDITS\r\n *\r\n * This code is inspired, adapted or taken from:\r\n *\r\n * ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xe4ologischen Instituts (DAI)\r\n * https://arachne.dainst.org/entity/1121229**]\r\n * 20.11.2017\r\n *\r\n *\r\n *\r\n************************************************/\r\n\r\n/* resource header */\r\n\r\n.resource-header {\r\n    margin: 1rem 0;\r\n    border-bottom: 1px solid #ddd;\r\n}\r\n\r\n/* resource header title */\r\n\r\n.resource-title .title {\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n}\r\n\r\n.resource-title .title:hover {\r\n    white-space: normal;\r\n    width: inherit;\r\n    height: auto;\r\n}\r\n\r\n/* resource header link */\r\n\r\n.resource-link {\r\n    margin: 2rem 0;\r\n}\r\n\r\n/* resource header table */\r\n\r\n/* remove top border from table */\r\n\r\n.resource-header table.resource-header-table tr:first-of-type th,\r\n.resource-header table.resource-header-table tr:first-of-type td {\r\n    border-top: none;\r\n}\r\n";
    },
    XKPj: function(e, t) {
      e.exports =
        '\x3c!--\r\n/************************************************\r\n*\r\n*               CREDITS\r\n*\r\n* This code is inspired, adapted or taken from:\r\n*\r\n* ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xe4ologischen Instituts (DAI)\r\n* https://arachne.dainst.org/entity/1121229**]\r\n* 20.11.2017\r\n*\r\n*\r\n*\r\n************************************************/ --\x3e\r\n\x3c!-- resourceDetailData content: linked objects --\x3e\r\n<div class="awg-linked-obj">\r\n    <h5>\r\n        \x3c!-- TODO: link to linked objects overview\r\n        <a (click)="navigateToSearchResults()">\r\n        --\x3e\r\n        Verkn\xfcpfte Objekte <span>({{ getNestedArraysLength(incoming) }})</span>\r\n        \x3c!--\r\n        </a>\r\n        --\x3e\r\n    </h5>\r\n\r\n    <ngb-accordion [closeOthers]="true">\r\n        <ngb-panel id="incoming-linkgroup-{{i}}" class="awg-linked-obj-incoming-linkgroup" *ngFor="let linkGroup of incoming | keyvalue; let i = index">\r\n            <ng-template ngbPanelTitle>\r\n                <span class="awg-linked-obj-title-group">\r\n                    <span class="badge badge-info mr-2">{{ linkGroup?.value.length }}</span>\r\n                    <span class="awg-linked-obj-title single-line">{{ linkGroup?.key }}</span>\r\n                </span>\r\n            </ng-template>\r\n            <ng-template ngbPanelContent>\r\n                <table class="table table-sm table-hover borderless awg-linked-obj-table mb-0">\r\n                    <tbody>\r\n                    <tr *ngFor="let link of linkGroup.value">\r\n                        <td>\r\n                            <a class="awg-linked-obj-link" (click)="navigateToResource(link?.id)">\r\n                                <img [src]="link?.restype.icon" alt="icon">\r\n                                <span>&nbsp;[{{ link?.id }}] {{ link?.value }}</span>\r\n                            </a>\r\n                        </td>\r\n                    </tr>\r\n                    </tbody>\r\n                </table>\r\n            </ng-template>\r\n        </ngb-panel>\r\n    </ngb-accordion>\r\n\r\n</div>\x3c!-- end DIV linkedObj --\x3e\r\n';
    },
    YBjm: function(e, t) {
      e.exports = "";
    },
    YEVq: function(e, t) {
      e.exports =
        ".awg-search-results .awg-search-result-table tbody tr {\r\n    cursor: pointer;\r\n}\r\n.awg-search-results .awg-search-result-table tbody tr:hover {\r\n    background-color: #e7e7e7;\r\n}\r\n.awg-search-results .awg-search-result-table tbody tr.active td {\r\n    background-color: #d7d7d7;\r\n}\r\n";
    },
    YWWT: function(e, t) {
      e.exports = "";
    },
    bFmx: function(e, t) {
      e.exports =
        '\x3c!-- content: search panel --\x3e\r\n\r\n\x3c!--\r\n  [ => TODO: paging]\r\n--\x3e\r\n\r\n<awg-search-form\r\n    [(searchValue)]="searchValue"\r\n    (submitRequest)="onSubmit($event)">\r\n</awg-search-form>\r\n\r\n\r\n<ng-container *ngIf="searchValue">\r\n    <awg-search-result-list *ngIf="!isLoadingData; else loading"\r\n                            [searchUrl]="searchUrl">\r\n    </awg-search-result-list>\r\n\r\n    <ng-template #loading>\r\n        <ng-container *ngIf="!errorMessage; else error">\r\n            \x3c!-- loading spinner --\x3e\r\n            <awg-twelve-tone-spinner></awg-twelve-tone-spinner>\r\n        </ng-container>\r\n    </ng-template>\r\n</ng-container>\r\n\r\n\r\n<ng-template #error>\r\n    <div class="errorMessage" *ngIf="errorMessage">\r\n        <p>Die Anfrage "{{ errorMessage?.route }}" ist fehlgeschlagen.</p>\r\n        <p>Fehlermeldung: "{{ errorMessage?.statusText || errorMessage }}".</p>\r\n        <p>M\xf6glicherweise gab es ein Problem mit der Internetverbindung oder dem verwendeten Suchbegriff.</p>\r\n    </div>\r\n</ng-template>\r\n';
    },
    blZ4: function(e, t) {
      e.exports =
        '\x3c!-- resourceDetailData content: props --\x3e\r\n<section class="props">\r\n    <h4 class="props-title ml-0">Objektdaten</h4>\r\n    <ul *ngFor="let prop of props">\r\n        <li id="breakLine" *ngIf="prop?.label === metaBreakLine">\r\n            <hr>\r\n        </li>\r\n        <li class="prop" *ngIf="prop?.value[0]">\r\n            \x3c!-- value label --\x3e\r\n            <strong class="prop-label" *ngIf="prop?.label">\r\n                {{ prop?.label }}\r\n            </strong>\r\n            \x3c!-- value content --\x3e\r\n            <ul *ngFor="let value of prop?.value">\r\n                <li class="prop-value" *ngIf="value">\r\n                    <span [compile-html]="value" [compile-html-ref]="this"></span>\r\n                </li>\r\n            </ul>\r\n        </li>\r\n    </ul>\r\n</section>\r\n';
    },
    "cg+2": function(e, t) {
      e.exports =
        '\x3c!-- resourceDetailData content --\x3e\r\n<awg-resource-detail-html-content *ngIf="resourceDetailData?.content"\r\n    [content]="resourceDetailData?.content"\r\n    (resourceRequest)="navigateToResource($event)">\r\n</awg-resource-detail-html-content>\r\n\r\n\r\n\r\n';
    },
    d1D9: function(e, t) {
      e.exports =
        '<form [formGroup]="searchForm">\r\n    <div class="form-row mb-4">\r\n        <div class="col-12">\r\n            <label class="sr-only" for="awg-search-input">{{ searchFormStrings.label }}</label>\r\n            <div class="input-group">\r\n                <div class="input-group-prepend">\r\n                    <div class="input-group-text" id="search-icon">\r\n                        <fa-icon [icon]="faSearch"></fa-icon>\r\n                    </div>\r\n                </div>\r\n                <input title="search"\r\n                       type="search"\r\n                       class="form-control"\r\n                       id="awg-search-input"\r\n                       aria-label="Search input" aria-describedby="search-icon"\r\n                       placeholder="{{ searchFormStrings.placeholder }}"\r\n                       formControlName="searchValueControl"\r\n                       required>\r\n            </div>\r\n            <div *ngIf="searchForm.invalid || searchForm.hasError(\'required\')" class="alert alert-danger">\r\n                {{ searchFormStrings.errorMessage }}\r\n            </div>\r\n        </div>\r\n    </div>\r\n</form>\r\n\r\n';
    },
    gZ3l: function(e, t) {
      e.exports =
        '\x3c!-- resourceDetailData header --\x3e\r\n<div class="resource-header">\r\n    <div class="row">\r\n        <div class="col-lg-8">\r\n            <h2 class="resource-title">\r\n                <div class="title">\r\n                    <span [compile-html]="header?.title" [compile-html-ref]="this"></span>\r\n                </div>\r\n                <div class="subtitle">\r\n                    <small></small>\r\n                </div>\r\n            </h2>\r\n            <div class="resource-link">\r\n                <small>\r\n                    API-Request: <a target="_blank" ref="noopener noreferrer" href="{{ resourceUrl }}">{{ resourceUrl }}</a>\r\n                    \x3c!-- TODO (resource-detail-html-header): change then to stable URL for resource --\x3e\r\n                </small>\r\n            </div>\r\n        </div>\r\n        <div class="col-lg-4">\r\n            <table class="table table-sm resource-header-table">\r\n                <tbody>\r\n                <tr>\r\n                    <th>ID:</th>\r\n                    <td id="header?.objID">{{ header?.objID }}</td>\r\n                </tr>\r\n                <tr>\r\n                    <th>Kategorie</th>\r\n                    <td>{{ header?.type }}&nbsp;<img [src]="header?.icon" alt="icon" /></td>\r\n                </tr>\r\n                <tr>\r\n                    <th>Zuletzt bearbeitet:</th>\r\n                    <td>{{ header?.lastmod }} (UTC)</td>\r\n                </tr>\r\n                </tbody>\r\n            </table>\r\n        </div>\r\n    </div>\r\n</div>\r\n';
    },
    iNd3: function(e, t) {
      e.exports =
        '\x3c!-- content: search results --\x3e\r\n<div class="awg-search-results" *ngIf="searchResponse">\r\n\r\n    \x3c!-- header --\x3e\r\n    <div class="row awg-search-results-header mb-4">\r\n        <div class="col-4 col-md-3 col-lg-2 awg-search-results-header-icons mr-auto">\r\n            <div class="btn-group btn-group-toggle" ngbRadioGroup name="radioSearchResultView" [(ngModel)]="searchResultView">\r\n                <label ngbButtonLabel class="btn-outline-info" ngbTooltip="Table view">\r\n                    <input ngbButton type="radio" value="table">\r\n                    <fa-icon [icon]="faTable"></fa-icon>\r\n                </label>\r\n                <label ngbButtonLabel class="btn-outline-info" ngbTooltip="Grid view">\r\n                    <input ngbButton type="radio" value="grid">\r\n                    <fa-icon [icon]="faGripHorizontal"></fa-icon>\r\n                </label>\r\n            </div>\r\n        </div>\r\n        <div class="col-8 col-md-9 col-lg-10 awg-search-results-header-text my-auto">\r\n            {{ searchResultText }}\r\n        </div>\r\n    </div>\r\n\r\n\r\n    <ng-container *ngIf="searchResponse?.subjects && +searchResponse?.nhits > 0">\r\n\r\n        \x3c!-- TODO: ### PAGINATION ### --\x3e\r\n\r\n        \x3c!-- table with searchResults --\x3e\r\n        <table *ngIf="searchResultView === \'table\'" class="table table-sm table-responsive awg-search-result-table">\r\n            <thead>\r\n            <tr>\r\n                <th>Typ</th>\r\n                <th>Ressource</th>\r\n            </tr>\r\n            </thead>\r\n            <tbody>\r\n            \x3c!-- show searchResultDetail by clicking on single entry --\x3e\r\n            <tr *ngFor="let subject of searchResponse?.subjects | orderBy: {property: \'obj_id\', direction: 1}" (click)="navigateToResource(subject?.obj_id)" [class.active]="isActiveResource(subject?.obj_id)">\r\n                <td>\r\n                        <span class="badge">\r\n                            <img [attr.src]=subject?.iconsrc alt="iconsrc">\r\n                            <small>&nbsp;{{ subject?.iconlabel }}</small>\r\n                        </span>\r\n                </td>\r\n                <td>\r\n                    <span [compile-html]="subject?.value[0]" [compile-html-ref]="this"></span>\r\n                </td>\r\n            </tr>\r\n            </tbody>\r\n        </table>\r\n\r\n        \x3c!-- grid with searchResults --\x3e\r\n        <div class="card-columns" *ngIf="searchResultView === \'grid\'">\r\n            <div class="card" *ngFor="let subject of searchResponse?.subjects | orderBy: {property: \'obj_id\', direction: 1}">\r\n                <div class="card-header">\r\n                    <img [attr.src]=subject?.iconsrc alt="iconsrc">\r\n                    &nbsp;{{ subject?.iconlabel }}\r\n                </div>\r\n                <div class="card-body">\r\n                    <h5 class="card-title">\r\n                        <span [compile-html]="subject?.value[0]" [compile-html-ref]="this"></span>\r\n                    </h5>\r\n                    <button type="button" class="btn btn-outline-info" (click)="navigateToResource(subject?.obj_id)">\r\n                        Mehr ...\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n    </ng-container>\r\n</div>\r\n';
    },
    n9b2: function(e, t) {
      e.exports =
        '<p class="help-block">\r\n    Datenbank-Suche nach Ereignissen mit heutigem Tagesdatum. Der erstmalige Aufruf kann einige Sekunden Ladezeit beanspruchen.\r\n</p>\r\n<button class="btn btn-default" (click)="getTodaysEvents()">\r\n    Webern-Chronologie vom {{date.day}}.{{date.month}}.\r\n</button>\r\n\r\n\x3c!--\r\n            <div data-ng-if="isEventLoaded">\r\n                <div class="timeline-control-button">\r\n                    <button class="btn btn-default" data-ng-click="timeline.leftAlign()">linksseitig</button>\r\n                    <button class="btn btn-default" data-ng-click="timeline.rightAlign()">rechtsseitig</button>\r\n                    <button class="btn btn-default" data-ng-click="timeline.defaultAlign()">alternierend</button>\r\n                </div>\r\n\r\n                <timeline>\r\n                    <timeline-header>\r\n                        <h3 data-ng-if="date.searchStart && date.searchEnd">\r\n                            Suchzeitraum: {{date.searchStart}}\u2013{{date.searchEnd}}\r\n                        </h3>\r\n                        <p>\r\n                            In {{eventData.overallQueries}} Suchanfragen {{eventData.nhits}} Ereignisse zwischen {{date.findStart}} und {{date.findEnd}} gefunden\r\n                        </p>\r\n                    </timeline-header>\r\n                    <timeline-body>\r\n                        <timeline-event ng-repeat="event in eventData.events | orderBy:\'-jdate.dateval1\'" side="{{side}}">\r\n                            <timeline-badge class="{{event.badgeClass}}">\r\n                                <img title="{{event.objLabel}}: {{event.value.label}}" data-ng-src="{{event.objSrc}}" alt="icon" />\r\n                            </timeline-badge>\r\n                            <timeline-panel class="{{event.badgeClass}}">\r\n                                <timeline-panel-heading>\r\n                                    <p ng-if="event.date">\r\n                                        <small class="text-muted"><i class="glyphicon glyphicon-time"></i> <em>{{event.date.label}}</em>: {{event.date.dateString}}</small>\r\n                                    </p>\r\n                                </timeline-panel-heading>\r\n                                <timeline-panel-body>\r\n                                    <p data-ng-if="event.value">\r\n                                        [{{event.objID}}] {{event.value.valueString}} <small><a data-ng-click="showObject(event.objID)">[mehr\u2026]</a></small>\r\n                                    </p>\r\n                                </timeline-panel-body>\r\n                                \x3c!-- <timeline-panel-footer>\r\n\r\n                                </timeline-panel-footer> --\x3e\r\n\x3c!--\r\n                    </timeline-panel>\r\n                </timeline-event>\r\n            </timeline-body>\r\n        </timeline>\r\n    </div>\r\n--\x3e\r\n';
    },
    taLz: function(e, t, r) {
      "use strict";
      r.r(t);
      var n,
        o = r("CcnG"),
        a = r("PCNd"),
        i = r("t/Na"),
        s = r("F/XL"),
        c = r("XlPw"),
        l = r("xMyE"),
        u = r("9Z1F"),
        p = r("dJ3e"),
        d = r("W28f"),
        h = ((n = function(e, t) {
          return (n =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            })(e, t);
        }),
        function(e, t) {
          function r() {
            this.constructor = e;
          }
          n(e, t),
            (e.prototype =
              null === t
                ? Object.create(t)
                : ((r.prototype = t.prototype), new r()));
        }),
        f = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        g = ((function(e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (
              (t.projectId = "6"),
              (t.resTypeId = "126"),
              (t.bibShortTitlePropertyId = "614"),
              (t.resourcesRoute = "/resources/"),
              (t.searchRoute = "/search/"),
              t
            );
          }
          h(t, e),
            (t.prototype.getBibliographyList = function() {
              var e = this.searchRoute,
                t = new i.f()
                  .set("searchtype", "extended")
                  .set("property_id", this.bibShortTitlePropertyId)
                  .set("compop", "EXISTS")
                  .set("filter_by_project", this.projectId)
                  .set("filter_by_restype", this.resTypeId);
              return this.getApiResponse(d.e, e, t);
            }),
            (t.prototype.getBibliographyItemDetail = function(e) {
              var t = this.resourcesRoute + e;
              return this.getApiResponse(d.d, t);
            }),
            (t.ngInjectableDef = void 0),
            (t = f([Object(o.C)({ providedIn: "root" })], t));
        })(p.a),
        function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        }),
        b = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        m = ((function() {})(),
        (function() {
          function e() {
            this.cachedResponses = new Map();
          }
          return (
            (e.prototype.get = function(e) {
              return this.cachedResponses
                ? this.cachedResponses[e.urlWithParams]
                : null;
            }),
            (e.prototype.put = function(e, t) {
              this.cachedResponses[e.urlWithParams] = t.clone();
            }),
            (e = g(
              [Object(o.C)({ providedIn: "root" }), b("design:paramtypes", [])],
              e
            ))
          );
        })()),
        v = (function() {
          var e = function(t, r) {
            return (e =
              Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array &&
                function(e, t) {
                  e.__proto__ = t;
                }) ||
              function(e, t) {
                for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
              })(t, r);
          };
          return function(t, r) {
            function n() {
              this.constructor = t;
            }
            e(t, r),
              (t.prototype =
                null === r
                  ? Object.create(r)
                  : ((n.prototype = r.prototype), new n()));
          };
        })(),
        y = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        w = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        R = (function(e) {
          function t(t) {
            var r = e.call(this, t) || this;
            return (
              (r.projectId = "6"),
              (r.resourceAppendix = "_-_local"),
              (r.resourcesRoute = "/resources/"),
              (r.searchRoute = "/search/"),
              (r.serviceName = "DataApiService"),
              r
            );
          }
          return (
            v(t, e),
            (t.prototype.getFulltextSearchData = function(e) {
              console.log("service # getFulltextSearchData for: ", e);
              var t = this.searchRoute + e,
                r = new i.f()
                  .set("searchtype", "fulltext")
                  .set("filter_by_project", this.projectId);
              return this.getApiResponse(d.e, t, r);
            }),
            (t.prototype.getResourceDetailData = function(e) {
              var t = this.resourcesRoute + e + this.resourceAppendix,
                r = new i.f();
              return this.getApiResponse(d.d, t, r);
            }),
            (t.ngInjectableDef = void 0),
            (t = y(
              [
                Object(o.C)({ providedIn: "root" }),
                w("design:paramtypes", [i.b])
              ],
              t
            ))
          );
        })(p.a),
        x = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        j = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        O = (function() {
          function e(e) {
            this.cache = e;
          }
          return (
            (e.prototype.intercept = function(e, t) {
              var r = this;
              Date.now();
              if ("GET" !== e.method) return t.handle(e);
              var n = this.cache.get(e);
              return n
                ? Object(s.a)(n.clone())
                : t.handle(e).pipe(
                    Object(l.a)(function(t) {
                      if (t instanceof i.g) {
                        Date.now();
                        r.cache.put(e, t.clone());
                      }
                    }),
                    Object(u.a)(function(e) {
                      return (
                        e instanceof i.d &&
                          console.log(
                            "CachingInterceptor: Processing http error",
                            e
                          ),
                        Object(c.a)(e)
                      );
                    })
                  );
            }),
            (e = x(
              [
                Object(o.C)({ providedIn: "root" }),
                j("design:paramtypes", [m])
              ],
              e
            ))
          );
        })(),
        I = [{ provide: i.a, useClass: O, multi: !0 }],
        S = r("X1jW"),
        D = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        k = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        T = (function() {
          function e() {
            this.resourceRequest = new o.w();
          }
          return (
            (e.prototype.ngOnInit = function() {}),
            (e.prototype.navigateToResource = function(e) {
              e && e.toString(), this.resourceRequest.emit(e);
            }),
            D(
              [Object(o.F)(), k("design:type", S.e)],
              e.prototype,
              "header",
              void 0
            ),
            D(
              [Object(o.F)(), k("design:type", String)],
              e.prototype,
              "resourceUrl",
              void 0
            ),
            D(
              [Object(o.R)(), k("design:type", o.w)],
              e.prototype,
              "resourceRequest",
              void 0
            ),
            (e = D(
              [
                Object(o.n)({
                  selector: "awg-resource-detail-header",
                  template: r("gZ3l"),
                  styles: [r("X5pM")]
                }),
                k("design:paramtypes", [])
              ],
              e
            ))
          );
        })(),
        C = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        A = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        P = (function() {
          function e() {
            this.resourceRequest = new o.w();
          }
          return (
            (e.prototype.ngOnInit = function() {}),
            (e.prototype.navigateToResource = function(e) {
              e && e.toString(), this.resourceRequest.emit(e);
            }),
            C(
              [Object(o.F)(), A("design:type", S.b)],
              e.prototype,
              "resourceDetailData",
              void 0
            ),
            C(
              [Object(o.R)(), A("design:type", o.w)],
              e.prototype,
              "resourceRequest",
              void 0
            ),
            (e = C(
              [
                Object(o.n)({
                  selector: "awg-resource-detail-html",
                  template: r("cg+2"),
                  styles: [r("Byhm")]
                }),
                A("design:paramtypes", [])
              ],
              e
            ))
          );
        })(),
        V = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        F = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        E = (function() {
          function e() {
            this.resourceRequest = new o.w();
          }
          return (
            (e.prototype.ngOnInit = function() {}),
            (e.prototype.navigateToResource = function(e) {
              e && e.toString(), this.resourceRequest.emit(e);
            }),
            (e.prototype.navigateToSearchResults = function() {
              console.log("ResourceDetailHtmlContent# got navigation request");
            }),
            V(
              [Object(o.F)(), F("design:type", S.c)],
              e.prototype,
              "content",
              void 0
            ),
            V(
              [Object(o.R)(), F("design:type", o.w)],
              e.prototype,
              "resourceRequest",
              void 0
            ),
            (e = V(
              [
                Object(o.n)({
                  selector: "awg-resource-detail-html-content",
                  template: r("8AlX"),
                  styles: [r("YBjm")]
                }),
                F("design:paramtypes", [])
              ],
              e
            ))
          );
        })(),
        q = r("wHSu"),
        B = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        _ = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        L = (function() {
          function e() {
            (this.resourceRequest = new o.w()),
              (this.currentImageIndex = 0),
              (this.offset = 0),
              (this.max = 50),
              (this.faChevronCircleLeft = q.c),
              (this.faChevronCircleRight = q.d);
          }
          return (
            (e.prototype.ngOnInit = function() {}),
            (e.prototype.navigateToResource = function(e) {
              e && e.toString(), this.resourceRequest.emit(e);
            }),
            (e.prototype.pageThumbsLeft = function() {
              var e = this.thumbBox.nativeElement.getBoundingClientRect(),
                t = this.offset - e.width;
              console.log("tmpOffSet", t), (this.offset = t > 0 ? t : 0);
            }),
            (e.prototype.pageThumbsRight = function() {
              var e = this.thumbBox.nativeElement.getBoundingClientRect(),
                t = this.thumbContainer.nativeElement.getBoundingClientRect(),
                r = this.offset + e.width;
              (this.max = t.width - e.width),
                console.log("thumbBox", e.width),
                console.log("container", t.width),
                console.log("max", this.max),
                console.log("tmpOffSet", r),
                r < this.max ? (this.offset = r) : (this.offset = this.max);
            }),
            (e.prototype.setImage = function(e) {
              this.currentImageIndex = e;
              var t = this.thumbBox.nativeElement.getBoundingClientRect(),
                r = this.thumbImages
                  .toArray()
                  [e].nativeElement.getBoundingClientRect(),
                n = r.left - t.left;
              n < 0
                ? (this.offset += n)
                : n + r.width > t.width &&
                  (this.offset += n + r.width - t.width);
            }),
            B(
              [Object(o.mb)("thumbBox"), _("design:type", o.u)],
              e.prototype,
              "thumbBox",
              void 0
            ),
            B(
              [Object(o.mb)("thumbImageContainer"), _("design:type", o.u)],
              e.prototype,
              "thumbContainer",
              void 0
            ),
            B(
              [Object(o.nb)("thumbImages"), _("design:type", o.W)],
              e.prototype,
              "thumbImages",
              void 0
            ),
            B(
              [Object(o.F)(), _("design:type", Array)],
              e.prototype,
              "images",
              void 0
            ),
            B(
              [Object(o.R)(), _("design:type", o.w)],
              e.prototype,
              "resourceRequest",
              void 0
            ),
            (e = B(
              [
                Object(o.n)({
                  selector: "awg-resource-detail-html-content-imageobjects",
                  template: r("WpHx"),
                  styles: [r("X16u")]
                }),
                _("design:paramtypes", [])
              ],
              e
            ))
          );
        })(),
        M = r("hwb8"),
        N = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        U = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        J = (function() {
          function e(e) {
            (this.conversionService = e), (this.resourceRequest = new o.w());
          }
          return (
            (e.prototype.ngOnInit = function() {}),
            (e.prototype.getNestedArraysLength = function(e) {
              return this.conversionService.getNestedArraysLength(e);
            }),
            (e.prototype.navigateToResource = function(e) {
              e && e.toString(), this.resourceRequest.emit(e);
            }),
            N(
              [Object(o.F)(), U("design:type", S.d)],
              e.prototype,
              "incoming",
              void 0
            ),
            N(
              [Object(o.R)(), U("design:type", o.w)],
              e.prototype,
              "resourceRequest",
              void 0
            ),
            (e = N(
              [
                Object(o.n)({
                  selector: "awg-resource-detail-html-content-linkedobjects",
                  template: r("XKPj"),
                  styles: [r("x5zg")]
                }),
                U("design:paramtypes", [M.a])
              ],
              e
            ))
          );
        })(),
        z = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        G = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        H = (function() {
          function e() {
            (this.resourceRequest = new o.w()),
              (this.metaBreakLine = "Versionsdatum");
          }
          return (
            (e.prototype.ngOnInit = function() {}),
            (e.prototype.navigateToResource = function(e) {
              e && e.toString(), this.resourceRequest.emit(e);
            }),
            z(
              [Object(o.F)(), G("design:type", Array)],
              e.prototype,
              "props",
              void 0
            ),
            z(
              [Object(o.R)(), G("design:type", o.w)],
              e.prototype,
              "resourceRequest",
              void 0
            ),
            (e = z(
              [
                Object(o.n)({
                  selector: "awg-resource-detail-html-content-props",
                  template: r("blZ4"),
                  styles: [r("/bvn")]
                }),
                G("design:paramtypes", [])
              ],
              e
            ))
          );
        })(),
        X = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        W = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        K = (function() {
          function e() {}
          return (
            (e.prototype.ngOnInit = function() {}),
            X(
              [Object(o.F)(), W("design:type", S.b)],
              e.prototype,
              "resourceJsonConvertedData",
              void 0
            ),
            (e = X(
              [
                Object(o.n)({
                  selector: "awg-resource-detail-json-converted",
                  template: r("+OBV"),
                  styles: [r("yPhZ")]
                }),
                W("design:paramtypes", [])
              ],
              e
            ))
          );
        })(),
        Y = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        Z = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        $ = (function() {
          function e() {}
          return (
            (e.prototype.ngOnInit = function() {}),
            Y(
              [Object(o.F)(), Z("design:type", d.d)],
              e.prototype,
              "resourceJsonRawData",
              void 0
            ),
            (e = Y(
              [
                Object(o.n)({
                  selector: "awg-resource-detail-json-raw",
                  template: r("3ti1"),
                  styles: [r("2vxS")]
                }),
                Z("design:paramtypes", [])
              ],
              e
            ))
          );
        })(),
        Q = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        ee = (function() {
          function e() {}
          return (e = Q(
            [
              Object(o.K)({
                imports: [a.a],
                declarations: [T, P, E, L, J, H, K, $],
                exports: [T, P, E, L, J, H, K, $]
              })
            ],
            e
          ));
        })(),
        te = r("ZYCi"),
        re = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        ne = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        oe = (function() {
          function e(e) {
            (this.router = e),
              (this.searchTitle = "Suche"),
              (this.searchId = "search");
          }
          return (
            (e.prototype.ngOnInit = function() {
              this.routeToSidenav();
            }),
            (e.prototype.routeToSidenav = function() {
              this.router.navigate([{ outlets: { side: "searchInfo" } }], {
                preserveFragment: !0
              });
            }),
            (e = re(
              [
                Object(o.n)({
                  selector: "awg-data",
                  template: r("200b"),
                  styles: [r("YWWT")]
                }),
                ne("design:paramtypes", [te.c])
              ],
              e
            ))
          );
        })(),
        ae = r("15JJ"),
        ie = r("67Y/"),
        se = r("4GxJ"),
        ce = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        le = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        ue = (function() {
          function e(e, t, r, n, o, a) {
            (this.route = e),
              (this.router = t),
              (this.conversionService = r),
              (this.searchService = n),
              (this.streamerService = o),
              (this.errorMessage = void 0),
              (this.tabTitle = {
                html: "Detail",
                raw: "JSON (raw)",
                converted: "JSON (converted)"
              }),
              (a.justify = "justified");
          }
          var t;
          return (
            (t = e),
            (e.scrollToTop = function() {
              window.scrollTo(0, 0);
            }),
            (e.prototype.ngOnInit = function() {
              this.getResourceData(), this.activateSidenav();
            }),
            (e.prototype.getResourceData = function() {
              var e = this;
              this.route.paramMap
                .pipe(
                  Object(ae.a)(function(t) {
                    return (
                      (e.resourceId = t.get("id")),
                      e.searchService.getResourceDetailData(t.get("id")).pipe(
                        Object(ie.a)(function(t) {
                          return (
                            e.updateResourceParams(), e.prepareResourceDetail(t)
                          );
                        })
                      )
                    );
                  })
                )
                .subscribe(
                  function(r) {
                    (e.resourceData = r), t.scrollToTop();
                  },
                  function(t) {
                    e.errorMessage = t;
                  }
                );
            }),
            (e.prototype.updateResourceParams = function() {
              this.updateResourceId(), this.updateCurrentUrl();
            }),
            (e.prototype.updateResourceId = function() {
              this.streamerService.updateCurrentResourceIdStream(
                this.resourceId
              );
            }),
            (e.prototype.updateCurrentUrl = function() {
              this.resourceUrl = this.searchService.httpGetUrl;
            }),
            (e.prototype.prepareResourceDetail = function(e) {
              if (0 !== Object.keys(e).length || e.constructor !== Object) {
                var t = this.conversionService.prepareResourceDetail(
                  e,
                  this.resourceId
                );
                return (this.resourceData = new S.a(e, t));
              }
            }),
            (e.prototype.navigateToResource = function(e) {
              var t = e || (this.oldId ? this.oldId : this.resourceId);
              (this.oldId = this.resourceId),
                (this.resourceId = t),
                this.router.navigate(["/data/resource", +this.resourceId]);
            }),
            (e.prototype.activateSidenav = function() {
              this.router.navigate([{ outlets: { side: "resourceInfo" } }]);
            }),
            (e = t = ce(
              [
                Object(o.n)({
                  selector: "awg-resource-detail",
                  template: r("0Kzf"),
                  providers: [se.h],
                  styles: [r("0lSh")]
                }),
                le("design:paramtypes", [te.a, te.c, p.b, R, p.d, se.h])
              ],
              e
            ))
          );
        })(),
        pe = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        de = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        he = (function() {
          function e(e) {
            (this.sideInfoService = e),
              (this.searchButtonArray = [
                {
                  root: "/data/search",
                  link: "fulltext",
                  label: "Volltext-Suche",
                  disabled: !1
                },
                {
                  root: "/data/search",
                  link: "timeline",
                  label: "Timeline",
                  disabled: !0
                },
                {
                  root: "/data/search",
                  link: "bibliography",
                  label: "Bibliographie",
                  disabled: !0
                }
              ]);
          }
          return (
            (e.prototype.ngOnInit = function() {}),
            (e.prototype.onButtonSelect = function(e) {
              this.updateSearchInfoTitle(e);
            }),
            (e.prototype.updateSearchInfoTitle = function(e) {
              this.sideInfoService.updateSearchInfoTitle(e);
            }),
            (e = pe(
              [
                Object(o.n)({
                  selector: "awg-search-overview",
                  template: r("JA5L"),
                  styles: [r("0Soa")]
                }),
                de("design:paramtypes", [p.e])
              ],
              e
            ))
          );
        })(),
        fe = r("Ip0R"),
        ge = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        be = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        me = (function() {
          function e(e, t, r, n, o, a) {
            (this.route = e),
              (this.router = t),
              (this.location = r),
              (this.conversionService = n),
              (this.dataApiService = o),
              (this.streamerService = a),
              (this.searchValue = ""),
              (this.searchUrl = ""),
              (this.isLoadingData = !1);
          }
          return (
            (e.prototype.ngOnInit = function() {
              this.dataApiServiceSubscription = this.subscribeToDataApiService();
            }),
            (e.prototype.subscribeToDataApiService = function() {
              var e = this;
              return this.route.paramMap
                .pipe(
                  Object(ae.a)(function(t) {
                    return (
                      t.get("query") && (e.searchValue = t.get("query")),
                      e.onLoadingStart(),
                      e.dataApiService
                        .getFulltextSearchData(e.searchValue)
                        .pipe(
                          Object(ie.a)(function(t) {
                            return (
                              e.updateCurrentUrl(), e.prepareSearchResults(t)
                            );
                          })
                        )
                    );
                  })
                )
                .subscribe(
                  function(t) {
                    e.updateStreamerService(t, e.searchValue), e.onLoadingEnd();
                  },
                  function(t) {
                    e.errorMessage = t;
                  }
                );
            }),
            (e.prototype.changeLoadingStatus = function(e) {
              this.isLoadingData = e;
            }),
            (e.prototype.onLoadingStart = function() {
              this.changeLoadingStatus(!0);
            }),
            (e.prototype.onLoadingEnd = function() {
              this.changeLoadingStatus(!1);
            }),
            (e.prototype.onSubmit = function(e) {
              e !== this.searchValue &&
                this.router.navigate(["data/search/fulltext", { query: e }]);
            }),
            (e.prototype.prepareSearchResults = function(e) {
              return this.conversionService.convertFullTextSearchResults(e);
            }),
            (e.prototype.updateCurrentUrl = function() {
              this.searchUrl = this.dataApiService.httpGetUrl;
            }),
            (e.prototype.updateStreamerService = function(e, t) {
              var r = new S.h(e, t);
              this.streamerService.updateSearchResponseStream(r);
            }),
            (e.prototype.ngOnDestroy = function() {
              this.dataApiServiceSubscription &&
                this.dataApiServiceSubscription.unsubscribe();
            }),
            (e = ge(
              [
                Object(o.n)({
                  selector: "awg-search-panel",
                  template: r("bFmx"),
                  styles: [r("INsQ")]
                }),
                be("design:paramtypes", [te.a, te.c, fe.g, p.b, R, p.d])
              ],
              e
            ))
          );
        })(),
        ve = (function() {
          return function(e) {
            (this.day = e.getDate()), (this.month = e.getMonth() + 1);
          };
        })(),
        ye = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        we = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        Re = (function() {
          function e() {
            (this.side = ""),
              (this.now = new Date()),
              (this.date = new ve(this.now));
          }
          return (
            (e.prototype.ngOnInit = function() {
              this.getTodaysEvents();
            }),
            (e.prototype.getTodaysEvents = function() {
              console.log("Timeline: called func getTodaysEvents");
            }),
            (e = ye(
              [
                Object(o.n)({
                  selector: "awg-timeline",
                  template: r("n9b2"),
                  styles: [r("479E")]
                }),
                we("design:paramtypes", [])
              ],
              e
            ))
          );
        })(),
        xe = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        je = [
          {
            path: "",
            component: oe,
            children: [
              {
                path: "search",
                component: he,
                children: [
                  { path: "fulltext", component: me },
                  { path: "timeline", component: Re },
                  { path: "detail/:id", redirectTo: "resource/:id" },
                  { path: "", pathMatch: "full", redirectTo: "fulltext" }
                ]
              }
            ]
          },
          { path: "resource/:id", component: ue }
        ],
        Oe = (function() {
          function e() {}
          return (e = xe(
            [Object(o.K)({ imports: [te.d.forChild(je)], exports: [te.d] })],
            e
          ));
        })(),
        Ie = [oe, he, me, ue, Re],
        Se = r("gIcY"),
        De = r("VnD/"),
        ke = r("mrSG"),
        Te = r("FFOo"),
        Ce = r("T1DM");
      var Ae = (function() {
          function e(e, t) {
            (this.dueTime = e), (this.scheduler = t);
          }
          return (
            (e.prototype.call = function(e, t) {
              return t.subscribe(new Pe(e, this.dueTime, this.scheduler));
            }),
            e
          );
        })(),
        Pe = (function(e) {
          function t(t, r, n) {
            var o = e.call(this, t) || this;
            return (
              (o.dueTime = r),
              (o.scheduler = n),
              (o.debouncedSubscription = null),
              (o.lastValue = null),
              (o.hasValue = !1),
              o
            );
          }
          return (
            ke.c(t, e),
            (t.prototype._next = function(e) {
              this.clearDebounce(),
                (this.lastValue = e),
                (this.hasValue = !0),
                this.add(
                  (this.debouncedSubscription = this.scheduler.schedule(
                    Ve,
                    this.dueTime,
                    this
                  ))
                );
            }),
            (t.prototype._complete = function() {
              this.debouncedNext(), this.destination.complete();
            }),
            (t.prototype.debouncedNext = function() {
              if ((this.clearDebounce(), this.hasValue)) {
                var e = this.lastValue;
                (this.lastValue = null),
                  (this.hasValue = !1),
                  this.destination.next(e);
              }
            }),
            (t.prototype.clearDebounce = function() {
              var e = this.debouncedSubscription;
              null !== e &&
                (this.remove(e),
                e.unsubscribe(),
                (this.debouncedSubscription = null));
            }),
            t
          );
        })(Te.a);
      function Ve(e) {
        e.debouncedNext();
      }
      var Fe = r("Ehmk"),
        Ee = r("eihs");
      var qe = (function() {
          function e(e, t) {
            (this.compare = e), (this.keySelector = t);
          }
          return (
            (e.prototype.call = function(e, t) {
              return t.subscribe(new Be(e, this.compare, this.keySelector));
            }),
            e
          );
        })(),
        Be = (function(e) {
          function t(t, r, n) {
            var o = e.call(this, t) || this;
            return (
              (o.keySelector = n),
              (o.hasKey = !1),
              "function" == typeof r && (o.compare = r),
              o
            );
          }
          return (
            ke.c(t, e),
            (t.prototype.compare = function(e, t) {
              return e === t;
            }),
            (t.prototype._next = function(e) {
              var t = e;
              if (
                this.keySelector &&
                (t = Object(Fe.a)(this.keySelector)(e)) === Ee.a
              )
                return this.destination.error(Ee.a.e);
              var r = !1;
              if (this.hasKey) {
                if ((r = Object(Fe.a)(this.compare)(this.key, t)) === Ee.a)
                  return this.destination.error(Ee.a.e);
              } else this.hasKey = !0;
              !1 === Boolean(r) && ((this.key = t), this.destination.next(e));
            }),
            t
          );
        })(Te.a),
        _e = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        Le = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        Me = (function() {
          function e(e) {
            (this.fb = e),
              (this.submitRequest = new o.w()),
              (this.faSearch = q.l),
              (this.searchFormStrings = {
                label: "Search Input",
                placeholder: "Volltextsuche in der Webern-Datenbank \u2026",
                errorMessage:
                  "Es wird ein Suchbegriff mit mindestens 3 Zeichen ben\xf6tigt!"
              });
          }
          return (
            (e.prototype.ngOnInit = function() {
              this.buildForm(this.searchValue);
            }),
            (e.prototype.buildForm = function(e) {
              (this.searchForm = this.fb.group({
                searchValueControl: [
                  e || "",
                  Se.f.compose([Se.f.required, Se.f.minLength(3)])
                ]
              })),
                this.onChanges();
            }),
            (e.prototype.onChanges = function() {
              var e,
                t,
                r,
                n,
                o = this;
              this.searchForm
                .get("searchValueControl")
                .valueChanges.pipe(
                  Object(De.a)(function(e) {
                    return e.length >= 3;
                  }),
                  ((r = 500),
                  void 0 === n && (n = Ce.a),
                  function(e) {
                    return e.lift(new Ae(r, n));
                  }),
                  function(r) {
                    return r.lift(new qe(e, t));
                  }
                )
                .subscribe(function(e) {
                  o.onSearch(e);
                });
            }),
            (e.prototype.onSearch = function(e) {
              this.submitRequest.emit(e);
            }),
            _e(
              [Object(o.F)(), Le("design:type", String)],
              e.prototype,
              "searchValue",
              void 0
            ),
            _e(
              [Object(o.R)(), Le("design:type", o.w)],
              e.prototype,
              "submitRequest",
              void 0
            ),
            (e = _e(
              [
                Object(o.n)({
                  selector: "awg-search-form",
                  template: r("d1D9"),
                  styles: [r("9jsp")]
                }),
                Le("design:paramtypes", [Se.a])
              ],
              e
            ))
          );
        })(),
        Ne = r("xzCF"),
        Ue = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        Je = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        ze = (function() {
          function e(e, t, r, n) {
            (this.router = e),
              (this.conversionService = t),
              (this.sideInfoService = r),
              (this.streamerService = n),
              (this.errorMessage = void 0),
              (this.searchResultView = "table"),
              (this.faGripHorizontal = q.i),
              (this.faTable = q.m);
          }
          return (
            (e.prototype.ngOnInit = function() {
              this.streamerServiceSubscription = this.subscribeToStreamerService();
            }),
            (e.prototype.subscribeToStreamerService = function() {
              var e = this;
              return this.streamerService
                .getCurrentSearchResults()
                .pipe(
                  Object(ie.a)(function(t) {
                    return e.updateSearchParams(t), t.data;
                  })
                )
                .subscribe(
                  function(t) {
                    (e.searchResponse = t), console.log(e.searchResponse);
                  },
                  function(t) {
                    (e.errorMessage = t),
                      console.log(
                        "SearchResultList# searchResultData subscription error: ",
                        e.errorMessage
                      );
                  }
                );
            }),
            (e.prototype.updateSearchParams = function(e) {
              this.updateCurrentValues(e), this.updateSearchInfoService();
            }),
            (e.prototype.updateCurrentValues = function(e) {
              (this.searchValue = e.query),
                (this.searchResultText = this.conversionService.prepareFullTextSearchResultText(
                  e.data,
                  this.searchValue,
                  this.searchUrl
                ));
            }),
            (e.prototype.updateSearchInfoService = function() {
              var e = new Ne.c(this.searchValue, this.searchResultText);
              this.sideInfoService.updateSearchInfoData(e);
            }),
            (e.prototype.isActiveResource = function(e) {
              return this.currentId === e;
            }),
            (e.prototype.navigateToResource = function(e) {
              (this.currentId = e),
                this.router.navigate(["/data/resource", this.currentId]);
            }),
            (e.prototype.ngOnDestroy = function() {
              this.streamerServiceSubscription &&
                this.streamerServiceSubscription.unsubscribe();
            }),
            Ue(
              [Object(o.F)(), Je("design:type", String)],
              e.prototype,
              "searchUrl",
              void 0
            ),
            (e = Ue(
              [
                Object(o.n)({
                  selector: "awg-search-result-list",
                  template: r("iNd3"),
                  styles: [r("YEVq")]
                }),
                Je("design:paramtypes", [te.c, p.b, p.e, p.d])
              ],
              e
            ))
          );
        })();
      r.d(t, "DataModule", function() {
        return He;
      });
      var Ge = function(e, t, r, n) {
          var o,
            a = arguments.length,
            i =
              a < 3
                ? t
                : null === n
                  ? (n = Object.getOwnPropertyDescriptor(t, r))
                  : n;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            i = Reflect.decorate(e, t, r, n);
          else
            for (var s = e.length - 1; s >= 0; s--)
              (o = e[s]) &&
                (i = (a < 3 ? o(i) : a > 3 ? o(t, r, i) : o(t, r)) || i);
          return a > 3 && i && Object.defineProperty(t, r, i), i;
        },
        He = (function() {
          function e() {}
          return (e = Ge(
            [
              Object(o.K)({
                imports: [a.a, ee, Oe],
                declarations: [Ie, Me, ze],
                providers: [I]
              })
            ],
            e
          ));
        })();
    },
    x5zg: function(e, t) {
      e.exports =
        "/************************************************\r\n *\r\n *               CREDITS\r\n *\r\n * This code is inspired, adapted or taken from:\r\n *\r\n * ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xe4ologischen Instituts (DAI)\r\n * https://arachne.dainst.org/entity/1121229**]\r\n * 20.11.2017\r\n *\r\n *\r\n *\r\n ************************************************/\r\n\r\n/* image objects */\r\n\r\n.awg-linked-obj-link {\r\n    cursor: pointer;\r\n}\r\n\r\n.awg-linked-obj-link {\r\n    color: #333 !important;\r\n}\r\n\r\n.awg-linked-obj-link:hover {\r\n    border-bottom: none !important;\r\n}\r\n\r\n.awg-linked-obj-table td {\r\n    max-width: 0;\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n}\r\n";
    },
    yPhZ: function(e, t) {
      e.exports = "";
    }
  }
]);
