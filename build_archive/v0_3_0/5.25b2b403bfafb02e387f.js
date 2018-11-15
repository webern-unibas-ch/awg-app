(window.webpackJsonp = window.webpackJsonp || []).push([
  [5],
  {
    "+OBV": function(e, t) {
      e.exports =
        "<h4>Converted JSON response from Salsah-API</h4>\n\n<pre>\n    {{ resourceJsonConvertedData | json }}\n</pre>\n";
    },
    "/bvn": function(e, t) {
      e.exports =
        "/************************************************\n*\n*               CREDITS\n*\n* This code is inspired, adapted or taken from:\n*\n* ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xe4ologischen Instituts (DAI)\n* https://arachne.dainst.org/entity/1121229**]\n* 20.11.2017\n*\n*\n*\n************************************************/\n\n/* props */\n\n.props {\n    padding-left: 20px;\n}\n\n.props li {\n    list-style: none;\n    padding: 3px 0;\n}\n\n.props ul {\n    padding-left: 0;\n    margin-top: 4px;\n    margin-bottom: 2px;\n}\n\n.props li strong {\n    margin-top: 8px;\n    margin-bottom: -4px;\n    margin-left: -20px;\n    display: block;\n}\n\n.props li > strong {\n    font-size: 19px;\n    font-weight: 400;\n    color: #333;\n}\n\n.props li li > strong {\n    font-weight: 400;\n    font-size: 17px;\n    padding: 3px 0;\n}\n";
    },
    "0Kzf": function(e, t) {
      e.exports =
        '\x3c!-- resource detail box --\x3e\n<div class="col-md-9 resource-detail-tabs" *ngIf="resourceData; else error">\n\n    <ul class="nav nav-tabs nav-justified" role="tablist">\n        <li class="active resource-detail-long-tab"><a data-toggle="tab" href="#html">{{ tabTitle?.html }}</a></li>\n        <li class="dropdown resource-detail-short-tab">\n            <a href="#" data-toggle="dropdown" class="dropdown-toggle">\n                {{ \'{\' }} JSON {{ \'}\' }} <b class="caret"></b>\n            </a>\n            <ul class="dropdown-menu dropdown-menu-right">\n                <li><a data-toggle="tab" href="#converted">{{ tabTitle?.converted }}</a></li>\n                <li><a data-toggle="tab" href="#raw">{{ tabTitle?.raw }}</a></li>\n            </ul>\n        </li>\n    </ul>\n\n    <div class="tab-content">\n        \x3c!-- resourceDetailData header --\x3e\n        <awg-resource-detail-header *ngIf="resourceData?.html?.header"\n                                         [header]="resourceData?.html?.header"\n                                         [resourceUrl]="resourceUrl"\n                                         (resourceRequest)="navigateToResource($event)">\n        </awg-resource-detail-header>\n\n        \x3c!-- html visualisation --\x3e\n        <awg-resource-detail-html id="html" class="tab-pane fade in active"\n            *ngIf="resourceData?.html"\n            [resourceDetailData]="resourceData?.html"\n            (resourceRequest)="navigateToResource($event)">\n        </awg-resource-detail-html>\n\n        \x3c!-- converted json visualisation --\x3e\n        <awg-resource-detail-json-converted id="converted" class="tab-pane fade"\n            *ngIf="resourceData?.jsonConverted"\n            [resourceJsonConvertedData]="resourceData?.jsonConverted">\n        </awg-resource-detail-json-converted>\n\n        \x3c!-- raw json visualisation --\x3e\n        <awg-resource-detail-json-raw id="raw" class="tab-pane fade"\n            *ngIf="resourceData?.jsonRaw"\n            [resourceJsonRawData]="resourceData?.jsonRaw">\n        </awg-resource-detail-json-raw>\n\n    </div>\n</div>\n<ng-template #error>\n    <div class="errorMessage" *ngIf="errorMessage">\n        <p>Die Anfrage "{{ errorMessage?.route }}" ist fehlgeschlagen.</p>\n        <p>Fehlermeldung: "{{ errorMessage?.statusText }}".</p>\n        <p>M\xf6glicherweise gab es ein Problem mit der Internetverbindung oder dem verwendeten Suchbegriff.</p>\n    </div>\n</ng-template>\n';
    },
    "0Soa": function(e, t) {
      e.exports = "";
    },
    "0lSh": function(e, t) {
      e.exports =
        "/************************************************\n*\n*               CREDITS\n*\n* This code is inspired, adapted or taken from:\n*\n* ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xe4ologischen Instituts (DAI)\n* https://arachne.dainst.org/entity/1121229**]\n* 20.11.2017\n*\n*\n*\n************************************************/\n\n.row {\n    margin-top: 10px;\n    margin-right: -15px;\n    margin-left: -15px;\n}\n\n/* for resource-header see 'resource-detail-html-header.component.css' */\n\n/* props */\n\n.props {\n    padding-left: 20px;\n}\n\n.props li {\n    list-style: none;\n    padding: 3px 0;\n}\n\n.props ul {\n    padding-left: 0;\n    margin-top: 4px;\n    margin-bottom: 2px;\n}\n\n.props li strong {\n    margin-top: 8px;\n    margin-bottom: -4px;\n    margin-left: -20px;\n    display: block;\n}\n\n.props li > strong {\n    font-size: 19px;\n    font-weight: 400;\n    color: #333;\n}\n\n.props li li > strong {\n    font-weight: 400;\n    font-size: 17px;\n    padding: 3px 0;\n}\n\n/* tabs */\n\n.resource-detail-tabs {\n    margin-top: 10px;\n}\n\n/* adjust tab size on larger screens */\n\n@media screen and (min-width: 768px) {\n    /* set auto width for long tab */\n    .resource-detail-long-tab {\n        width: auto !important;\n    }\n    /* avoid line wrap in link text */\n    .resource-detail-short-tab > a {\n        white-space: nowrap;\n    }\n}\n\n/* single-line */\n\n.single-line {\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n/* links */\n\na {\n    background-color: transparent;\n}\n\na {\n    color: #37588e;\n    text-decoration: none;\n}\n\n/* overwrite bootstrap fonts */\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n    line-height: 1.3;\n    font-weight: 400;\n}\n\nh2 {\n    font-size: 23px;\n}\n";
    },
    "200b": function(e, t) {
      e.exports =
        '\x3c!-- content: search --\x3e\n<div class="col-md-9 maincontent text-left">\n\n    \x3c!-- heading --\x3e\n    <awg-heading [title]="searchTitle" [id]="searchId"></awg-heading>\n\n    \x3c!-- help-block --\x3e\n    <div class="help-block">\n        BETA: Suche momentan noch mit eingeschr\xe4nkter Funktionalit\xe4t\n    </div>\n\n    \x3c!-- search routes --\x3e\n    <router-outlet></router-outlet>\n\n</div>\n';
    },
    "2vxS": function(e, t) {
      e.exports = "";
    },
    "3ti1": function(e, t) {
      e.exports =
        "<h4>Raw JSON response from Salsah-API</h4>\n\n<pre>\n    {{ resourceJsonRawData | json }}\n</pre>\n\n";
    },
    "479E": function(e, t) {
      e.exports = "";
    },
    "8AlX": function(e, t) {
      e.exports =
        '\x3c!--\n/************************************************\n*\n*               CREDITS\n*\n* This code is inspired, adapted or taken from:\n*\n* ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xe4ologischen Instituts (DAI)\n* https://arachne.dainst.org/entity/1121229**]\n* 20.11.2017\n*\n*\n*\n************************************************/ --\x3e\n\x3c!-- resourceDetailData content --\x3e\n<div class="resource-content">\n    <div class="row">\n\n        \x3c!-- object properties --\x3e\n        <div class="col-sm-8">\n            <awg-resource-detail-html-content-props *ngIf="content?.props"\n                                                    [props]="content?.props"\n                                                    (resourceRequest)="navigateToResource($event)">\n            </awg-resource-detail-html-content-props>\n        </div>\n\n        \x3c!-- right side nav objects --\x3e\n        <div class="col-sm-4">\n            <div class="sidenav-right">\n\n                \x3c!-- image objects --\x3e\n                <awg-resource-detail-html-content-imageobjects *ngIf="content?.images.length > 0"\n                                                               [images]="content?.images"\n                                                               (resourceRequest)="navigateToResource($event)">\n                </awg-resource-detail-html-content-imageobjects>\n\n\n                \x3c!-- connected objects --\x3e\n                <awg-resource-detail-html-content-linkedobjects *ngIf="content?.incoming"\n                                                                [incoming]="content?.incoming"\n                                                                (resourceRequest)="navigateToResource($event)">\n                </awg-resource-detail-html-content-linkedobjects>\n\n            </div>\n        </div>\n    </div>\n</div>\n';
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
        '<awg-router-link-button-group *ngIf="searchButtonArray"\n    [buttonArray]="searchButtonArray"\n    (selectButtonRequest)="onButtonSelect($event)">\n</awg-router-link-button-group>\n\n<router-outlet></router-outlet>\n';
    },
    WpHx: function(e, t) {
      e.exports =
        '\x3c!--\n/************************************************\n*\n*               CREDITS\n*\n* This code is inspired, adapted or taken from:\n*\n* ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xe4ologischen Instituts (DAI)\n* https://arachne.dainst.org/entity/1121229**]\n* 20.11.2017\n*\n*\n*\n************************************************/ --\x3e\n\x3c!-- resourceDetailData content: image objects --\x3e\n<div class="imageObj">\n\n    \x3c!-- header --\x3e\n    <h4>\n        \x3c!-- TODO: link to image overview\n            <a (click)="navigateToSearchResults()">\n            --\x3e\n        Abbildungen <small>({{ images?.length }})</small>\n        \x3c!--\n        </a>\n        --\x3e\n    </h4>\n\n    \x3c!-- image slider --\x3e\n    <div class="imageSlider">\n\n        \x3c!-- preview image box --\x3e\n        <div id="previewbox" class="panel panel-default" *ngIf="currentImageIndex >= 0">\n            \x3c!-- control arrows --\x3e\n            <a id="preview-nav-left" *ngIf="currentImageIndex > 0" (click)="setImage(currentImageIndex - 1)">\n                <span class="glyphicon glyphicon-circle-arrow-left"></span>\n            </a>\n            <a id="preview-nav-right" *ngIf="currentImageIndex < images?.length - 1" (click)="setImage(currentImageIndex + 1)">\n                <span class="glyphicon glyphicon-circle-arrow-right"></span>\n            </a>\n            \x3c!-- preview image --\x3e\n            <div id="preview-img-container">\n                <a id="preview-img" [href]="images[currentImageIndex].fullSize" target="_blank" ref="noopener noreferrer">\n                    <img [src]="images[currentImageIndex].reductSize" alt="{{ images[currentImageIndex].label }}" id="{{ images[currentImageIndex].res_id }}" height="300">\n                </a>\n            </div>\n        </div>\n\n        \x3c!-- thumbnails --\x3e\n        <div id="thumbbox" #thumbBox class="panel panel-default" *ngIf="images.length > 1">\n            \x3c!-- control arrows --\x3e\n            <a class="navigate-left" [hidden]="offset <= 0" (click)="pageThumbsLeft()">\n                <span class="glyphicon glyphicon-circle-arrow-left"></span>\n            </a>\n            <a class="navigate-right" [hidden]="offset >= max" (click)="pageThumbsRight()">\n                <span class="glyphicon glyphicon-circle-arrow-right"></span>\n            </a>\n            \x3c!-- thumb images --\x3e\n            <div id="thumb-img-container" #thumbImageContainer style="transform: translateX(0px);" [ngStyle]="{\'transform\': \'translateX(-\'+offset+\'px)\',\'-webkit-transform\': \'translateX(-\'+offset+\'px)\'}">\n                \x3c!--  --\x3e\n                <a class="thumb-img" #thumbImages *ngFor="let image of images; let i = index" [ngClass]="{ \'active\': i === currentImageIndex }" (click)="setImage(i)" >\n                    <img [src]="image.reductSize" alt="{{ image.label }}" id="{{ image.res_id }}" height="70">\n                </a>\n            </div>\n        </div>\n\n    </div>\x3c!-- end DIV imageSlider --\x3e\n</div>\x3c!-- end DIV imageObj --\x3e\n';
    },
    X16u: function(e, t) {
      e.exports =
        "/************************************************\n *\n *               CREDITS\n *\n * This code is inspired, adapted or taken from:\n *\n * ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xe4ologischen Instituts (DAI)\n * https://arachne.dainst.org/entity/1121229**]\n * 20.11.2017\n *\n *\n *\n ************************************************/\n\n/* image objects */\n\n.imageObj {\n    margin-bottom: 25px;\n}\n\n/* image preview */\n\n.imageSlider #previewbox {\n    position: relative;\n    height: 300px;\n    background-color: #ededed;\n}\n\n.imageSlider #preview-nav-left,\n.imageSlider .navigate-left {\n    left: 5px;\n}\n\n.imageSlider #preview-nav-right,\n.imageSlider .navigate-right {\n    right: 5px;\n}\n\n.imageSlider .navigate-left,\n.imageSlider .navigate-right {\n    top: 23px;\n}\n\n.imageSlider #preview-nav-left,\n.imageSlider #preview-nav-right {\n    opacity: 0;\n    top: 49%;\n    -webkit-transform: translateY(-50%);\n            transform: translateY(-50%);\n    transition: 0.5s ease-in-out;\n}\n\n.imageSlider #previewbox:hover a#preview-nav-left,\n.imageSlider #previewbox:hover a#preview-nav-right {\n    opacity: 1;\n}\n\n.imageSlider #preview-nav-left,\n.imageSlider #preview-nav-right,\n.imageSlider .navigate-left,\n.imageSlider .navigate-right {\n    position: absolute;\n    font-size: 1.5em;\n    height: 1.5em;\n    width: 1.5em;\n    z-index: 1503;\n    cursor: pointer;\n    color: #37588e;\n    background-color: #ededed;\n    padding: 3px;\n    border-radius: 1.5em;\n    text-align: center;\n}\n\n.imageSlider #preview-img-container {\n    width: 100%;\n    height: 300px;\n    white-space: nowrap;\n    text-align: center;\n    font: 0/0 a;\n}\n\n.imageSlider #preview-img::before {\n    content: ' ';\n    display: inline-block;\n    vertical-align: middle;\n    height: 100%;\n}\n\n.imageSlider #preview-img img {\n    vertical-align: middle;\n    cursor: zoom-in;\n    /* height: auto; */\n    max-width: 100%;\n}\n\n/* image thumbnails */\n\n.imageSlider #thumbbox {\n    overflow: hidden;\n    padding: 4px;\n    position: relative;\n}\n\n.imageSlider #thumb-img-container {\n    height: 70px;\n    width: auto;\n    white-space: nowrap;\n    /* transform: translateX(0px);*/\n    transition: 0.5s ease-in-out;\n    display: inline-block;\n}\n\n.imageSlider #thumb-img-container a {\n    opacity: 0.3;\n    cursor: pointer;\n}\n\n.imageSlider #thumb-img-container a.active,\n.imageSlider #thumb-img-container a:hover {\n    opacity: 1;\n    text-decoration: none;\n}\n";
    },
    X5pM: function(e, t) {
      e.exports =
        "/************************************************\n *\n *               CREDITS\n *\n * This code is inspired, adapted or taken from:\n *\n * ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xe4ologischen Instituts (DAI)\n * https://arachne.dainst.org/entity/1121229**]\n * 20.11.2017\n *\n *\n *\n************************************************/\n\n/* resource header */\n\n.resource-header {\n    border-bottom: 1px solid #ddd;\n    padding-bottom: 22px;\n}\n\n.resource-title {\n    margin-top: 5px;\n    margin-bottom: 5px;\n}\n\n.resource-title .title {\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n\n.resource-title .title:hover {\n    white-space: normal;\n    width: inherit;\n    height: auto;\n}\n\n.resource-link {\n    margin-top: 30px;\n}\n";
    },
    XKPj: function(e, t) {
      e.exports =
        '\x3c!--\n/************************************************\n*\n*               CREDITS\n*\n* This code is inspired, adapted or taken from:\n*\n* ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xe4ologischen Instituts (DAI)\n* https://arachne.dainst.org/entity/1121229**]\n* 20.11.2017\n*\n*\n*\n************************************************/ --\x3e\n\x3c!-- resourceDetailData content: linked objects --\x3e\n<div class="linkedObj">\n    <h4>\n        \x3c!-- TODO: link to linked objects overview\n        <a (click)="navigateToSearchResults()">\n        --\x3e\n        Verkn\xfcpfte Objekte <small>({{ getNestedArraysLength(incoming) }})</small>\n        \x3c!--\n        </a>\n        --\x3e\n    </h4>\n    <accordion [closeOthers]="true">\n        <accordion-group class="incomingLinks" *ngFor="let linkGroup of incoming | keyvalue">\n            <div accordion-heading>\n                {{ linkGroup?.key }}\n                <span class="badge facetBadge float-right pull-right">{{ linkGroup?.value.length }}</span>\n            </div>\n            <p class="single-line" *ngFor="let link of linkGroup.value" (click)="navigateToResource(link?.id)">\n                <img [src]="link?.restype?.icon" alt="icon" /> [{{ link?.id }}] {{ link?.value }}\n            </p>\n        </accordion-group>\n    </accordion>\n</div>\x3c!-- end DIV linkedObj --\x3e\n';
    },
    YBjm: function(e, t) {
      e.exports = "";
    },
    YEVq: function(e, t) {
      e.exports = "";
    },
    YWWT: function(e, t) {
      e.exports = "";
    },
    bFmx: function(e, t) {
      e.exports =
        '\x3c!-- content: search panel --\x3e\n\n\x3c!--\n  [ => TODO: paging]\n--\x3e\n\n<awg-search-form\n    [(searchValue)]="searchValue"\n    (submitRequest)="onSubmit($event)">\n</awg-search-form>\n\n\n<ng-container *ngIf="searchValue">\n    <awg-search-result-list *ngIf="!isLoadingData; else loading"\n                            [searchUrl]="searchUrl">\n    </awg-search-result-list>\n\n    <ng-template #loading>\n        <ng-container *ngIf="!errorMessage; else error">\n            \x3c!-- loading spinner --\x3e\n            <awg-twelve-tone-spinner></awg-twelve-tone-spinner>\n        </ng-container>\n    </ng-template>\n</ng-container>\n\n\n<ng-template #error>\n    <div class="errorMessage" *ngIf="errorMessage">\n        <p>Die Anfrage "{{ errorMessage?.route }}" ist fehlgeschlagen.</p>\n        <p>Fehlermeldung: "{{ errorMessage?.statusText || errorMessage }}".</p>\n        <p>M\xf6glicherweise gab es ein Problem mit der Internetverbindung oder dem verwendeten Suchbegriff.</p>\n    </div>\n</ng-template>\n';
    },
    blZ4: function(e, t) {
      e.exports =
        '\x3c!-- resourceDetailData content: props --\x3e\n<div class="props">\n    <ul>\n        <li>\n            <strong> Objektdaten </strong>\n            <ul *ngFor="let prop of props">\n                <li id="breakLine" *ngIf="prop?.label === metaBreakLine">\n                    <hr>\n                </li>\n                <li *ngIf="prop?.value[0]">\n                    \x3c!-- value label --\x3e\n                    <strong *ngIf="prop?.label">\n                        {{ prop?.label }}\n                    </strong>\n                    \x3c!-- value content --\x3e\n                    <ul *ngFor="let value of prop?.value">\n                        <li *ngIf="value">\n                            <span [compile-html]="value" [compile-html-ref]="this"></span>\n                        </li>\n                    </ul>\n                </li>\n            </ul>\n        </li>\n    </ul>\n</div>\n';
    },
    "cg+2": function(e, t) {
      e.exports =
        '\x3c!-- resourceDetailData content --\x3e\n<awg-resource-detail-html-content *ngIf="resourceDetailData?.content"\n    [content]="resourceDetailData?.content"\n    (resourceRequest)="navigateToResource($event)">\n</awg-resource-detail-html-content>\n\n\n\n';
    },
    d1D9: function(e, t) {
      e.exports =
        '<div class="text-center">\n    <form [formGroup]="searchForm"\n          (ngSubmit)="onSearch(searchValueControl.value)">\n        <div class="form-group">\n            <label class="control-label" for="searchInput"></label>\n            <div class="input-group">\n                    <span class="input-group-btn">\n                        <button class="btn btn-default"\n                                type="submit"\n                                [disabled]="searchForm.invalid">\n                            <span class="glyphicon glyphicon-search"></span>\n                        </button>\n                    </span>\n                <input title="search"\n                       type="search"\n                       aria-label="Search input"\n                       id="searchInput"\n                       class="form-control"\n                       placeholder="Volltextsuche in der Webern-Datenbank \u2026"\n                       [formControl]="searchValueControl">\n            </div>\n            <div *ngIf="searchValueControl.invalid || searchValueControl.hasError(\'required\')" class="alert alert-danger">\n                Es wird ein Suchbegriff mit mindestens 3 Zeichen ben\xf6tigt!\n            </div>\n        </div>\n    </form>\n</div>\n\n';
    },
    gZ3l: function(e, t) {
      e.exports =
        '\x3c!-- resourceDetailData header --\x3e\n<div class="resource-header">\n    <div class="row">\n        <div class="col-sm-8">\n            <h2 class="resource-title">\n                <div class="title">\n                    <span [compile-html]="header?.title" [compile-html-ref]="this"></span>\n                </div>\n                <div class="subtitle">\n                    <small></small>\n                </div>\n            </h2>\n            <div class="resource-link">\n                <small>\n                    API-Request: <a target="_blank" ref="noopener noreferrer" href="{{ resourceUrl }}">{{ resourceUrl }}</a>\n                    \x3c!-- TODO (resource-detail-html-header): change then to stable URL for resource --\x3e\n                </small>\n            </div>\n        </div>\n        <div class="col-sm-4">\n            <table class="table table-condensed" style="margin-bottom: 0">\n                <thead>\n                <tr>\n                    <td>\n                        <strong>ID:</strong>\n                    </td>\n                    <td id="header?.objID">\n                        {{ header?.objID }}\n                    </td>\n                </tr>\n                </thead>\n                <tbody>\n                <tr>\n                    <td>\n                        <strong>Kategorie:</strong>\n                    </td>\n                    <td>\n                        {{ header?.type }}&nbsp;<img [src]="header?.icon" alt="icon" />\n                    </td>\n                </tr>\n                <tr>\n                    <td>\n                        <strong>Zuletzt bearbeitet:</strong>\n                    </td>\n                    <td>\n                        {{header?.lastmod}} (UTC)\n                    </td>\n                </tr>\n                </tbody>\n            </table>\n        </div>\n    </div>\n</div>\n';
    },
    iNd3: function(e, t) {
      e.exports =
        '\x3c!-- content: search results --\x3e\n<div *ngIf="searchResponse">\n\n    \x3c!-- header --\x3e\n    <h4>Suchergebnisse {{ searchValue ? \'f\xfcr "\' + searchValue + \'"\' : \'\' }}</h4>\n    <p>\n        {{ searchResultText }}\n    </p>\n\n    <ng-container *ngIf="searchResponse?.subjects">\n\n        \x3c!-- TODO: ### PAGINATION ### --\x3e\n\n        \x3c!-- table with searchResults --\x3e\n        <table *ngIf="+searchResponse?.nhits > 0" id="sidenav_results" class="table table-condensed table-responsive">\n            <thead>\n            <tr>\n                <th>\n                    Kategorie\n                </th>\n                <th>\n                    Eintrag\n                </th>\n            </tr>\n            </thead>\n            <tbody>\n            \x3c!-- show searchResultDetail by clicking on single entry --\x3e\n            <tr *ngFor="let subject of searchResponse?.subjects | orderBy: {property: \'obj_id\', direction: 1}" (click)="navigateToResource(subject?.obj_id)" [class.active]="isActiveResource(subject?.obj_id)">\n                <td>\n                    <img [attr.src]=subject?.iconsrc alt="iconsrc" > {{ subject?.iconlabel }}\n                </td>\n                <td>\n                    <span [compile-html]="subject?.value[0]" [compile-html-ref]="this"></span>\n                </td>\n            </tr>\n            </tbody>\n        </table>\n\n    </ng-container>\n</div>\n';
    },
    n9b2: function(e, t) {
      e.exports =
        '<p class="help-block">\n    Datenbank-Suche nach Ereignissen mit heutigem Tagesdatum. Der erstmalige Aufruf kann einige Sekunden Ladezeit beanspruchen.\n</p>\n<button class="btn btn-default" (click)="getTodaysEvents()">\n    Webern-Chronologie vom {{date.day}}.{{date.month}}.\n</button>\n\n\x3c!--\n            <div data-ng-if="isEventLoaded">\n                <div class="timeline-control-button">\n                    <button class="btn btn-default" data-ng-click="timeline.leftAlign()">linksseitig</button>\n                    <button class="btn btn-default" data-ng-click="timeline.rightAlign()">rechtsseitig</button>\n                    <button class="btn btn-default" data-ng-click="timeline.defaultAlign()">alternierend</button>\n                </div>\n\n                <timeline>\n                    <timeline-header>\n                        <h3 data-ng-if="date.searchStart && date.searchEnd">\n                            Suchzeitraum: {{date.searchStart}}\u2013{{date.searchEnd}}\n                        </h3>\n                        <p>\n                            In {{eventData.overallQueries}} Suchanfragen {{eventData.nhits}} Ereignisse zwischen {{date.findStart}} und {{date.findEnd}} gefunden\n                        </p>\n                    </timeline-header>\n                    <timeline-body>\n                        <timeline-event ng-repeat="event in eventData.events | orderBy:\'-jdate.dateval1\'" side="{{side}}">\n                            <timeline-badge class="{{event.badgeClass}}">\n                                <img title="{{event.objLabel}}: {{event.value.label}}" data-ng-src="{{event.objSrc}}" alt="icon" />\n                            </timeline-badge>\n                            <timeline-panel class="{{event.badgeClass}}">\n                                <timeline-panel-heading>\n                                    <p ng-if="event.date">\n                                        <small class="text-muted"><i class="glyphicon glyphicon-time"></i> <em>{{event.date.label}}</em>: {{event.date.dateString}}</small>\n                                    </p>\n                                </timeline-panel-heading>\n                                <timeline-panel-body>\n                                    <p data-ng-if="event.value">\n                                        [{{event.objID}}] {{event.value.valueString}} <small><a data-ng-click="showObject(event.objID)">[mehr\u2026]</a></small>\n                                    </p>\n                                </timeline-panel-body>\n                                \x3c!-- <timeline-panel-footer>\n\n                                </timeline-panel-footer> --\x3e\n\x3c!--\n                    </timeline-panel>\n                </timeline-event>\n            </timeline-body>\n        </timeline>\n    </div>\n--\x3e\n';
    },
    taLz: function(e, t, n) {
      "use strict";
      n.r(t);
      var r,
        o = n("CcnG"),
        i = n("PCNd"),
        a = n("t/Na"),
        c = n("F/XL"),
        s = n("XlPw"),
        l = n("xMyE"),
        p = n("9Z1F"),
        u = n("dJ3e"),
        d = n("W28f"),
        f = ((r =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function(e, t) {
              e.__proto__ = t;
            }) ||
          function(e, t) {
            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
          }),
        function(e, t) {
          function n() {
            this.constructor = e;
          }
          r(e, t),
            (e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n()));
        }),
        h = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
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
          f(t, e),
            (t.prototype.getBibliographyList = function() {
              var e = this.searchRoute,
                t = new a.f()
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
            (t = h([Object(o.A)({ providedIn: "root" })], t));
        })(u.a),
        function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        }),
        m = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        b = ((function() {})(),
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
              [Object(o.A)({ providedIn: "root" }), m("design:paramtypes", [])],
              e
            ))
          );
        })()),
        v = (function() {
          var e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
            };
          return function(t, n) {
            function r() {
              this.constructor = t;
            }
            e(t, n),
              (t.prototype =
                null === n
                  ? Object.create(n)
                  : ((r.prototype = n.prototype), new r()));
          };
        })(),
        y = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        x = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        R = (function(e) {
          function t(t) {
            var n = e.call(this, t) || this;
            return (
              (n.projectId = "6"),
              (n.resourceAppendix = "_-_local"),
              (n.resourcesRoute = "/resources/"),
              (n.searchRoute = "/search/"),
              (n.serviceName = "DataApiService"),
              n
            );
          }
          return (
            v(t, e),
            (t.prototype.getFulltextSearchData = function(e) {
              console.log("service # getFulltextSearchData for: ", e);
              var t = this.searchRoute + e,
                n = new a.f()
                  .set("searchtype", "fulltext")
                  .set("filter_by_project", this.projectId);
              return this.getApiResponse(d.e, t, n);
            }),
            (t.prototype.getResourceDetailData = function(e) {
              var t = this.resourcesRoute + e + this.resourceAppendix,
                n = new a.f();
              return this.getApiResponse(d.d, t, n);
            }),
            (t.ngInjectableDef = void 0),
            (t = y(
              [
                Object(o.A)({ providedIn: "root" }),
                x("design:paramtypes", [a.b])
              ],
              t
            ))
          );
        })(u.a),
        j = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        w = function(e, t) {
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
              var n = this;
              Date.now();
              if ("GET" !== e.method) return t.handle(e);
              var r = this.cache.get(e);
              return r
                ? Object(c.a)(r.clone())
                : t.handle(e).pipe(
                    Object(l.a)(function(t) {
                      if (t instanceof a.g) {
                        Date.now();
                        n.cache.put(e, t.clone());
                      }
                    }),
                    Object(p.a)(function(e) {
                      return (
                        e instanceof a.d &&
                          console.log(
                            "CachingInterceptor: Processing http error",
                            e
                          ),
                        Object(s.a)(e)
                      );
                    })
                  );
            }),
            (e = j(
              [
                Object(o.A)({ providedIn: "root" }),
                w("design:paramtypes", [b])
              ],
              e
            ))
          );
        })(),
        I = [{ provide: a.a, useClass: O, multi: !0 }],
        S = n("X1jW"),
        D = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
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
            this.resourceRequest = new o.v();
          }
          return (
            (e.prototype.ngOnInit = function() {}),
            (e.prototype.navigateToResource = function(e) {
              e && e.toString(), this.resourceRequest.emit(e);
            }),
            D(
              [Object(o.D)(), k("design:type", S.e)],
              e.prototype,
              "header",
              void 0
            ),
            D(
              [Object(o.D)(), k("design:type", String)],
              e.prototype,
              "resourceUrl",
              void 0
            ),
            D(
              [Object(o.P)(), k("design:type", o.v)],
              e.prototype,
              "resourceRequest",
              void 0
            ),
            (e = D(
              [
                Object(o.n)({
                  selector: "awg-resource-detail-header",
                  template: n("gZ3l"),
                  styles: [n("X5pM")]
                }),
                k("design:paramtypes", [])
              ],
              e
            ))
          );
        })(),
        A = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        P = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        C = (function() {
          function e() {
            this.resourceRequest = new o.v();
          }
          return (
            (e.prototype.ngOnInit = function() {}),
            (e.prototype.navigateToResource = function(e) {
              e && e.toString(), this.resourceRequest.emit(e);
            }),
            A(
              [Object(o.D)(), P("design:type", S.b)],
              e.prototype,
              "resourceDetailData",
              void 0
            ),
            A(
              [Object(o.P)(), P("design:type", o.v)],
              e.prototype,
              "resourceRequest",
              void 0
            ),
            (e = A(
              [
                Object(o.n)({
                  selector: "awg-resource-detail-html",
                  template: n("cg+2"),
                  styles: [n("Byhm")]
                }),
                P("design:paramtypes", [])
              ],
              e
            ))
          );
        })(),
        E = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        q = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        V = (function() {
          function e() {
            this.resourceRequest = new o.v();
          }
          return (
            (e.prototype.ngOnInit = function() {}),
            (e.prototype.navigateToResource = function(e) {
              e && e.toString(), this.resourceRequest.emit(e);
            }),
            (e.prototype.navigateToSearchResults = function() {
              console.log("ResourceDetailHtmlContent# got navigation request");
            }),
            E(
              [Object(o.D)(), q("design:type", S.c)],
              e.prototype,
              "content",
              void 0
            ),
            E(
              [Object(o.P)(), q("design:type", o.v)],
              e.prototype,
              "resourceRequest",
              void 0
            ),
            (e = E(
              [
                Object(o.n)({
                  selector: "awg-resource-detail-html-content",
                  template: n("8AlX"),
                  styles: [n("YBjm")]
                }),
                q("design:paramtypes", [])
              ],
              e
            ))
          );
        })(),
        _ = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        B = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        L = (function() {
          function e() {
            (this.resourceRequest = new o.v()),
              (this.currentImageIndex = 0),
              (this.offset = 0),
              (this.max = 50);
          }
          return (
            (e.prototype.ngOnInit = function() {}),
            (e.prototype.navigateToResource = function(e) {
              e && e.toString(), this.resourceRequest.emit(e);
            }),
            (e.prototype.pageThumbsLeft = function() {
              var e = this.thumbBox.nativeElement.getBoundingClientRect(),
                t = this.offset - e.width;
              this.offset = t > 0 ? t : 0;
            }),
            (e.prototype.pageThumbsRight = function() {
              var e = this.thumbBox.nativeElement.getBoundingClientRect(),
                t = this.offset + e.width;
              (this.max =
                this.thumbContainer.nativeElement.getBoundingClientRect()
                  .width - e.width),
                t < this.max ? (this.offset = t) : (this.offset = this.max);
            }),
            (e.prototype.setImage = function(e) {
              this.currentImageIndex = e;
              var t = this.thumbBox.nativeElement.getBoundingClientRect(),
                n = this.thumbImages
                  .toArray()
                  [e].nativeElement.getBoundingClientRect(),
                r = n.left - t.left;
              r < 0
                ? (this.offset += r)
                : r + n.width > t.width &&
                  (this.offset += r + n.width - t.width);
            }),
            _(
              [Object(o.lb)("thumbBox"), B("design:type", o.t)],
              e.prototype,
              "thumbBox",
              void 0
            ),
            _(
              [Object(o.lb)("thumbImageContainer"), B("design:type", o.t)],
              e.prototype,
              "thumbContainer",
              void 0
            ),
            _(
              [Object(o.mb)("thumbImages"), B("design:type", o.U)],
              e.prototype,
              "thumbImages",
              void 0
            ),
            _(
              [Object(o.D)(), B("design:type", Array)],
              e.prototype,
              "images",
              void 0
            ),
            _(
              [Object(o.P)(), B("design:type", o.v)],
              e.prototype,
              "resourceRequest",
              void 0
            ),
            (e = _(
              [
                Object(o.n)({
                  selector: "awg-resource-detail-html-content-imageobjects",
                  template: n("WpHx"),
                  styles: [n("X16u")]
                }),
                B("design:paramtypes", [])
              ],
              e
            ))
          );
        })(),
        M = n("hwb8"),
        F = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        N = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        z = (function() {
          function e(e) {
            (this.conversionService = e), (this.resourceRequest = new o.v());
          }
          return (
            (e.prototype.ngOnInit = function() {}),
            (e.prototype.getNestedArraysLength = function(e) {
              return this.conversionService.getNestedArraysLength(e);
            }),
            (e.prototype.navigateToResource = function(e) {
              e && e.toString(), this.resourceRequest.emit(e);
            }),
            F(
              [Object(o.D)(), N("design:type", S.d)],
              e.prototype,
              "incoming",
              void 0
            ),
            F(
              [Object(o.P)(), N("design:type", o.v)],
              e.prototype,
              "resourceRequest",
              void 0
            ),
            (e = F(
              [
                Object(o.n)({
                  selector: "awg-resource-detail-html-content-linkedobjects",
                  template: n("XKPj"),
                  styles: [n("x5zg")]
                }),
                N("design:paramtypes", [M.a])
              ],
              e
            ))
          );
        })(),
        U = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        J = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        X = (function() {
          function e() {
            (this.resourceRequest = new o.v()),
              (this.metaBreakLine = "Versionsdatum");
          }
          return (
            (e.prototype.ngOnInit = function() {}),
            (e.prototype.navigateToResource = function(e) {
              e && e.toString(), this.resourceRequest.emit(e);
            }),
            U(
              [Object(o.D)(), J("design:type", Array)],
              e.prototype,
              "props",
              void 0
            ),
            U(
              [Object(o.P)(), J("design:type", o.v)],
              e.prototype,
              "resourceRequest",
              void 0
            ),
            (e = U(
              [
                Object(o.n)({
                  selector: "awg-resource-detail-html-content-props",
                  template: n("blZ4"),
                  styles: [n("/bvn")]
                }),
                J("design:paramtypes", [])
              ],
              e
            ))
          );
        })(),
        W = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        G = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        H = (function() {
          function e() {}
          return (
            (e.prototype.ngOnInit = function() {}),
            W(
              [Object(o.D)(), G("design:type", S.b)],
              e.prototype,
              "resourceJsonConvertedData",
              void 0
            ),
            (e = W(
              [
                Object(o.n)({
                  selector: "awg-resource-detail-json-converted",
                  template: n("+OBV"),
                  styles: [n("yPhZ")]
                }),
                G("design:paramtypes", [])
              ],
              e
            ))
          );
        })(),
        Y = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
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
              [Object(o.D)(), Z("design:type", d.d)],
              e.prototype,
              "resourceJsonRawData",
              void 0
            ),
            (e = Y(
              [
                Object(o.n)({
                  selector: "awg-resource-detail-json-raw",
                  template: n("3ti1"),
                  styles: [n("2vxS")]
                }),
                Z("design:paramtypes", [])
              ],
              e
            ))
          );
        })(),
        K = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        Q = (function() {
          function e() {}
          return (e = K(
            [
              Object(o.I)({
                imports: [i.a],
                declarations: [T, C, V, L, z, X, H, $],
                exports: [T, C, V, L, z, X, H, $]
              })
            ],
            e
          ));
        })(),
        ee = n("ZYCi"),
        te = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        ne = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        re = (function() {
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
            (e = te(
              [
                Object(o.n)({
                  selector: "awg-data",
                  template: n("200b"),
                  styles: [n("YWWT")]
                }),
                ne("design:paramtypes", [ee.b])
              ],
              e
            ))
          );
        })(),
        oe = n("15JJ"),
        ie = n("67Y/"),
        ae = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        ce = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        se = (function() {
          function e(e, t, n, r, o) {
            (this.route = e),
              (this.router = t),
              (this.conversionService = n),
              (this.searchService = r),
              (this.streamerService = o),
              (this.errorMessage = void 0),
              (this.tabTitle = {
                html: "Detail",
                raw: "JSON (raw)",
                converted: "JSON (converted)"
              });
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
                  Object(oe.a)(function(t) {
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
                  function(n) {
                    (e.resourceData = n), t.scrollToTop();
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
            (e = t = ae(
              [
                Object(o.n)({
                  selector: "awg-resource-detail",
                  template: n("0Kzf"),
                  styles: [n("0lSh")]
                }),
                ce("design:paramtypes", [ee.a, ee.b, u.b, R, u.d])
              ],
              e
            ))
          );
        })(),
        le = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        pe = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        ue = (function() {
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
            (e = le(
              [
                Object(o.n)({
                  selector: "awg-search-overview",
                  template: n("JA5L"),
                  styles: [n("0Soa")]
                }),
                pe("design:paramtypes", [u.e])
              ],
              e
            ))
          );
        })(),
        de = n("Ip0R"),
        fe = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        he = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        ge = (function() {
          function e(e, t, n, r, o, i) {
            (this.route = e),
              (this.router = t),
              (this.location = n),
              (this.conversionService = r),
              (this.dataApiService = o),
              (this.streamerService = i),
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
                  Object(oe.a)(function(t) {
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
              var n = new S.h(e, t);
              this.streamerService.updateSearchResponseStream(n);
            }),
            (e.prototype.ngOnDestroy = function() {
              this.dataApiServiceSubscription &&
                this.dataApiServiceSubscription.unsubscribe();
            }),
            (e = fe(
              [
                Object(o.n)({
                  selector: "awg-search-panel",
                  template: n("bFmx"),
                  styles: [n("INsQ")]
                }),
                he("design:paramtypes", [ee.a, ee.b, de.f, u.b, R, u.d])
              ],
              e
            ))
          );
        })(),
        me = (function() {
          return function(e) {
            (this.day = e.getDate()), (this.month = e.getMonth() + 1);
          };
        })(),
        be = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        ve = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        ye = (function() {
          function e() {
            (this.side = ""),
              (this.now = new Date()),
              (this.date = new me(this.now));
          }
          return (
            (e.prototype.ngOnInit = function() {
              this.getTodaysEvents();
            }),
            (e.prototype.getTodaysEvents = function() {
              console.log("Timeline: called func getTodaysEvents");
            }),
            (e = be(
              [
                Object(o.n)({
                  selector: "awg-timeline",
                  template: n("n9b2"),
                  styles: [n("479E")]
                }),
                ve("design:paramtypes", [])
              ],
              e
            ))
          );
        })(),
        xe = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        Re = [
          {
            path: "",
            component: re,
            children: [
              {
                path: "search",
                component: ue,
                children: [
                  { path: "fulltext", component: ge },
                  { path: "timeline", component: ye },
                  { path: "detail/:id", redirectTo: "resource/:id" },
                  { path: "", pathMatch: "full", redirectTo: "fulltext" }
                ]
              }
            ]
          },
          { path: "resource/:id", component: se }
        ],
        je = (function() {
          function e() {}
          return (e = xe(
            [Object(o.I)({ imports: [ee.c.forChild(Re)], exports: [ee.c] })],
            e
          ));
        })(),
        we = [re, ue, ge, se, ye],
        Oe = n("gIcY"),
        Ie = n("VnD/"),
        Se = n("Gi3i"),
        De = n("ad02"),
        ke = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        Te = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        Ae = (function() {
          function e(e) {
            (this.fb = e),
              (this.submitRequest = new o.v()),
              (this.searchValueControl = new Oe.b());
          }
          return (
            (e.prototype.ngOnInit = function() {
              this.buildForm(this.searchValue);
            }),
            (e.prototype.buildForm = function(e) {
              var t = this;
              (this.searchForm = this.fb.group({
                searchValueControl: [
                  e || "",
                  Oe.h.compose([Oe.h.required, Oe.h.minLength(3)])
                ]
              })),
                console.log("searchform", this.searchForm),
                console.log("searchValueControl", this.searchValueControl),
                this.searchValueControl.valueChanges
                  .pipe(
                    Object(Ie.a)(function(e) {
                      return e.length >= 3;
                    }),
                    Object(Se.a)(500),
                    Object(De.a)()
                  )
                  .subscribe(function(e) {
                    t.onSearch(e);
                  });
            }),
            (e.prototype.onSearch = function(e) {
              this.submitRequest.emit(e);
            }),
            ke(
              [Object(o.D)(), Te("design:type", String)],
              e.prototype,
              "searchValue",
              void 0
            ),
            ke(
              [Object(o.P)(), Te("design:type", o.v)],
              e.prototype,
              "submitRequest",
              void 0
            ),
            (e = ke(
              [
                Object(o.n)({
                  selector: "awg-search-form",
                  template: n("d1D9"),
                  styles: [n("9jsp")]
                }),
                Te("design:paramtypes", [Oe.a])
              ],
              e
            ))
          );
        })(),
        Pe = n("xzCF"),
        Ce = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        Ee = function(e, t) {
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.metadata
          )
            return Reflect.metadata(e, t);
        },
        qe = (function() {
          function e(e, t, n, r) {
            (this.router = e),
              (this.conversionService = t),
              (this.sideInfoService = n),
              (this.streamerService = r),
              (this.errorMessage = void 0);
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
                    e.searchResponse = t;
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
                  this.filteredOut,
                  this.searchUrl
                ));
            }),
            (e.prototype.updateSearchInfoService = function() {
              var e = new Pe.c(this.searchValue, this.searchResultText);
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
            Ce(
              [Object(o.D)(), Ee("design:type", String)],
              e.prototype,
              "searchUrl",
              void 0
            ),
            (e = Ce(
              [
                Object(o.n)({
                  selector: "awg-search-result-list",
                  template: n("iNd3"),
                  styles: [n("YEVq")]
                }),
                Ee("design:paramtypes", [ee.b, u.b, u.e, u.d])
              ],
              e
            ))
          );
        })();
      n.d(t, "DataModule", function() {
        return _e;
      });
      var Ve = function(e, t, n, r) {
          var o,
            i = arguments.length,
            a =
              i < 3
                ? t
                : null === r
                  ? (r = Object.getOwnPropertyDescriptor(t, n))
                  : r;
          if (
            "object" == typeof Reflect &&
            "function" == typeof Reflect.decorate
          )
            a = Reflect.decorate(e, t, n, r);
          else
            for (var c = e.length - 1; c >= 0; c--)
              (o = e[c]) &&
                (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
          return i > 3 && a && Object.defineProperty(t, n, a), a;
        },
        _e = (function() {
          function e() {}
          return (e = Ve(
            [
              Object(o.I)({
                imports: [i.a, Q, je],
                declarations: [we, Ae, qe],
                providers: [I]
              })
            ],
            e
          ));
        })();
    },
    x5zg: function(e, t) {
      e.exports =
        "/************************************************\n *\n *               CREDITS\n *\n * This code is inspired, adapted or taken from:\n *\n * ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xe4ologischen Instituts (DAI)\n * https://arachne.dainst.org/entity/1121229**]\n * 20.11.2017\n *\n *\n *\n ************************************************/\n\n/* image objects */\n\n.linkedObj {\n    margin-bottom: 25px;\n}\n";
    },
    yPhZ: function(e, t) {
      e.exports = "";
    }
  }
]);
