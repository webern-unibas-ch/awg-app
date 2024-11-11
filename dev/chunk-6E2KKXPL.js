import{a as m,b as Oe}from"./chunk-MSTPLEVO.js";import{a as J}from"./chunk-PP6HJ337.js";import{C as We,D as ye,e as me,g as Y,h as ge,i as P,j as fe,k as y,l as Qe,m as d,n as _,o as W,p as Pe,q as h,r as ve,t as A,v as Ae,w as Le,x as Ye,z as be}from"./chunk-6MK2PJKK.js";import"./chunk-XPQ2CYHW.js";import"./chunk-Q5BBFFUU.js";import{A as ne,B as u,Da as o,F as s,J as n,La as S,M as le,Ma as pe,O as c,Oa as he,Pa as D,Qa as R,Sa as Ie,U as a,Ua as Ue,W as l,X as p,Xa as Ee,_ as E,_a as $e,a as je,db as Be,h as f,ib as ue,k as Ve,lb as De,m as Te,mb as He,o as v,q as Fe,ra as b,s as I,u as Ge,ua as ce,ub as de,v as Q,y as Me}from"./chunk-OIF6Z6X7.js";var Je=`<!-- resource detail header -->
<div class="resource-header">
    <div class="row">
        <div class="col-lg-8">
            <div class="resource-title">
                <h2 class="title">
                    <span [compile-html]="header?.title" [compile-html-ref]="this"></span>
                </h2>
            </div>
            <div class="resource-link">
                <small>
                    API-Request:
                    <a href="{{ resourceUrl }}">{{ resourceUrl }}</a>
                    <!-- TODO: (resource-detail-html-header): change then to stable URL for resource -->
                </small>
            </div>
        </div>
        <div class="col-lg-4">
            <table aria-label="Table with resource detail metadata" class="table table-sm resource-header-table">
                <tbody>
                    <tr>
                        <th scope="row">Salsah-ID:</th>
                        <td id="header?.objID">{{ header?.objID }}</td>
                    </tr>
                    <tr>
                        <th scope="row">Kategorie</th>
                        <td>
                            <span class="resource-type">{{ header?.type }}</span
                            >&nbsp;<span class="resource-icon"><img [src]="header?.icon" alt="icon" /></span>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Zuletzt bearbeitet:</th>
                        <td>
                            <span class="resource-lastmod">{{ header?.lastmod }}</span> (UTC)
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
`;var ze=`@charset "UTF-8";.resource-header{margin:1rem 0 0;border-bottom:1px solid #ddd}.resource-title .title{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.resource-title .title:hover{white-space:normal;width:inherit;height:auto}.resource-link{margin:2rem 0}.resource-header table.resource-header-table tr:first-of-type th,.resource-header table.resource-header-table tr:first-of-type td{border-top:none}
`;var L,z=(L=class{constructor(){this.resourceRequest=new c}navigateToResource(e){e&&(e=e.toString(),this.resourceRequest.emit(e))}},L.propDecorators={header:[{type:l}],resourceUrl:[{type:l}],resourceRequest:[{type:p}]},L);z=o([a({selector:"awg-resource-detail-header",template:Je,changeDetection:n.OnPush,styles:[ze]})],z);var Xe=`<!-- resourceDetailData content -->
@if (resourceDetailData?.content) {
    <awg-resource-detail-html-content
        [content]="resourceDetailData?.content"
        (gndRequest)="exposeGnd($event)"
        (resourceRequest)="navigateToResource($event)">
    </awg-resource-detail-html-content>
}
`;var Ke="";var O,X=(O=class{constructor(){this.gndRequest=new c,this.resourceRequest=new c}exposeGnd(e){e?.type&&this.gndRequest.emit(e)}navigateToResource(e){e&&(e=e.toString(),this.resourceRequest.emit(e))}},O.propDecorators={resourceDetailData:[{type:l}],gndRequest:[{type:p}],resourceRequest:[{type:p}]},O);X=o([a({selector:"awg-resource-detail-html",template:Xe,changeDetection:n.OnPush,styles:[Ke]})],X);var Ze=`<!--
/************************************************
*
*               CREDITS
*
* This code is inspired, adapted or taken from:
*
* ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xE4ologischen Instituts (DAI)
* https://arachne.dainst.org/entity/1121229**]
* 20.11.2017
*
*
*
************************************************/ -->
<!-- resourceDetailData content -->
<div class="awg-resource-content">
    <div class="row">
        <!-- object properties -->
        <div class="col-lg-8">
            <awg-resource-detail-html-content-props
                [props]="content?.props"
                (gndRequest)="exposeGnd($event)"
                (resourceRequest)="navigateToResource($event)">
            </awg-resource-detail-html-content-props>
        </div>

        <!-- right side nav objects -->
        <div class="col-lg-4 mt-3 mt-lg-0 mb-3">
            <div class="sidenav-right">
                <!-- image objects -->
                <awg-resource-detail-html-content-imageobjects [images]="content?.images">
                </awg-resource-detail-html-content-imageobjects>

                <!-- connected objects -->
                <awg-resource-detail-html-content-linkedobjects
                    [incomingGroups]="content?.incoming"
                    (resourceRequest)="navigateToResource($event)">
                </awg-resource-detail-html-content-linkedobjects>
            </div>
        </div>
    </div>
</div>
`;var et="";var k,K=(k=class{constructor(){this.gndRequest=new c,this.resourceRequest=new c}exposeGnd(e){e?.type&&this.gndRequest.emit(e)}navigateToResource(e){e&&(e=e.toString(),this.resourceRequest.emit(e))}},k.propDecorators={content:[{type:l}],gndRequest:[{type:p}],resourceRequest:[{type:p}]},k);K=o([a({selector:"awg-resource-detail-html-content",template:Ze,changeDetection:n.OnPush,styles:[et]})],K);var tt=`<!--
/************************************************
*
*               CREDITS
*
* This code is inspired, adapted or taken from:
*
* ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xE4ologischen Instituts (DAI)
* https://arachne.dainst.org/entity/1121229**]
* 20.11.2017
*
*
*
************************************************/ -->
<!-- resourceDetailData content: image objects -->
@if (images?.length > 0) {
    <div class="awg-image-obj mb-3">
        <!-- header -->
        <h5>
            Abbildungen (<span id="awg-image-number">{{ images?.length }}</span
            >)
        </h5>
        <!-- image slider -->
        <div class="card awg-image-slider">
            <ngx-gallery class="ngx-gallery" [options]="galleryOptions" [images]="images"></ngx-gallery>
        </div>
        <!-- end DIV image-slider -->
    </div>
}
<!-- end DIV image-obj -->
`;var rt=`.awg-image-slider{height:300px}.awg-image-slider .ngx-gallery{display:inline-block}:host::ng-deep ngx-gallery .ngx-gallery-image-wrapper{background-color:#e7e7e7}:host::ng-deep ngx-gallery .ngx-gallery-arrow{color:#676767}:host::ng-deep ngx-gallery .ngx-gallery-arrow .ngx-gallery-disabled{opacity:.3}:host::ng-deep ngx-gallery .ngx-gallery-thumbnail{opacity:.5}:host::ng-deep ngx-gallery .ngx-gallery-thumbnail:hover{opacity:1}
`;var q,Z=(q=class{constructor(){this.galleryOptions=[new Ue({width:"100%",imageSize:"contain",thumbnailSize:"contain",thumbnailMargin:5,thumbnailsMargin:0,previewCloseOnClick:!0,previewCloseOnEsc:!0,previewZoom:!0,previewRotate:!0,linkTarget:"_blank"})]}},q.propDecorators={images:[{type:l}]},q);Z=o([a({selector:"awg-resource-detail-html-content-imageobjects",template:tt,changeDetection:n.OnPush,styles:[rt]})],Z);var ot=`<!--
/************************************************
*
*               CREDITS
*
* This code is inspired, adapted or taken from:
*
* ARACHNE \u2013 Objektdatenbank des Deutschen Arch\xE4ologischen Instituts (DAI)
* https://arachne.dainst.org/entity/1121229**]
* 20.11.2017
*
*
*
************************************************/ -->
<!-- resourceDetailData content: linked objects -->
<div class="awg-linked-obj">
    <h5>
        Verkn\xFCpfte Objekte (
        @if (incomingGroups) {
            <span id="awg-incoming-size">{{ totalNumber }}</span>
        }
        )
    </h5>

    <div ngbAccordion [closeOthers]="true">
        @for (restypeGroup of incomingGroups; track restypeGroup; let i = $index) {
            <div ngbAccordionItem="awg-linked-obj-incoming-{{ i }}" class="awg-linked-obj-incoming-linkgroup">
                <div ngbAccordionHeader>
                    <button ngbAccordionButton>
                        <span class="awg-linked-obj-title-group single-line">
                            <span class="badge bg-info me-2">{{ restypeGroup?.links?.length }}</span>
                            <span class="awg-linked-obj-title">{{ restypeGroup?.restypeLabel }}</span>
                        </span>
                    </button>
                </div>
                <div ngbAccordionCollapse>
                    <div ngbAccordionBody>
                        <ng-template>
                            <ul class="awg-linked-obj-list nobullets mb-0">
                                @for (link of restypeGroup.links; track link; let isLast = $last) {
                                    <li>
                                        <a class="awg-linked-obj-link" (click)="navigateToResource(link?.id)">
                                            <img [src]="link?.restype?.icon" alt="icon" />
                                            &nbsp;[<span class="awg-linked-obj-link-id">{{ link?.id }}</span
                                            >]&nbsp;
                                            <span class="awg-linked-obj-link-value">{{ link?.value }}</span>
                                        </a>
                                        @if (!isLast) {
                                            <hr />
                                        }
                                    </li>
                                }
                            </ul>
                        </ng-template>
                    </div>
                </div>
            </div>
        }
    </div>
    <!-- end DIV linkedObj -->
</div>
`;var st=`@charset "UTF-8";ul.awg-linked-obj-list{padding-left:0}ul.awg-linked-obj-list li:hover{background-color:#e7e7e7}ul.awg-linked-obj-list li a{width:inherit;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}ul.awg-linked-obj-list li hr{margin-top:.75rem;margin-bottom:.75rem}.awg-linked-obj-link{cursor:pointer;color:#333!important}.awg-linked-obj-link:hover{border-bottom:none!important}
`;var N,ee=(N=class{constructor(){this.resourceRequest=new c}get totalNumber(){return this._getNestedArraysTotalItems(this.incomingGroups)||0}navigateToResource(e){e&&(e=e.toString(),this.resourceRequest.emit(e))}_getNestedArraysTotalItems(e){if(!e)return;let t=(r,i)=>r+i;return e.map(r=>r.links.length).reduce(t,0)}},N.propDecorators={incomingGroups:[{type:l}],resourceRequest:[{type:p}]},N);ee=o([a({selector:"awg-resource-detail-html-content-linkedobjects",template:ot,changeDetection:n.OnPush,styles:[st]})],ee);var at=`<!-- resource detail data content: props -->
<section class="awg-props">
    <h4 class="awg-props-title ms-0">Objektdaten</h4>
    @for (prop of props; track prop) {
        <ul>
            @if (prop.label === metaBreakLine) {
                <li id="breakLine">
                    <hr />
                </li>
            }
            @if (prop!.values[0]) {
                <li class="awg-prop">
                    <!-- value label -->
                    @if (prop.label) {
                        <strong class="awg-prop-label">
                            {{ prop.label }}
                        </strong>
                    }
                    <!-- value content -->
                    @for (value of prop.values; track value) {
                        <ul>
                            @if (value) {
                                <li class="awg-prop-value">
                                    <span [compile-html]="value" [compile-html-ref]="this"></span>
                                </li>
                            }
                        </ul>
                    }
                </li>
            }
        </ul>
    }
</section>
`;var it=`@charset "UTF-8";.awg-props ul{padding-left:0;margin-top:.5rem;margin-bottom:.25rem}.awg-props li{list-style:none;padding:.25rem 0}.awg-props .awg-prop .awg-prop-label{margin-top:8px;margin-bottom:-4px;display:block;font-size:21px;font-weight:400}.awg-props .awg-prop .awg-prop-value{padding:3px 0;margin-left:1rem}
`;var j,te=(j=class{constructor(){this.gndRequest=new c,this.resourceRequest=new c,this.metaBreakLine="Versionsdatum"}ngOnChanges(e){e.props&&this._checkForGND(e.props)}exposeGnd(e){e?.type&&this.gndRequest.emit(e)}navigateToResource(e){e&&(e=e.toString(),this.resourceRequest.emit(e))}ngOnDestroy(){this._removeGnd()}_checkForGND(e){let t=e.currentValue.filter(r=>r.pid==="856"&&r.values&&r.values.length>0);this._removeGnd(),t.length>0&&t.forEach(r=>{r.values.forEach(i=>{this._setGnd(i)})})}_setGnd(e){let t=new Le(Ae.SET,e);this.exposeGnd(t)}_removeGnd(){let e=new Le(Ae.REMOVE,null);this.exposeGnd(e)}},j.propDecorators={props:[{type:l}],gndRequest:[{type:p}],resourceRequest:[{type:p}]},j);te=o([a({selector:"awg-resource-detail-html-content-props",template:at,changeDetection:n.OnPush,styles:[it]})],te);var nt=`<awg-json-viewer
    jsonViewerHeader="Converted JSON response from Salsah-API"
    [jsonViewerData]="resourceJsonConvertedData">
</awg-json-viewer>
`;var lt="";var V,re=(V=class{},V.propDecorators={resourceJsonConvertedData:[{type:l}]},V);re=o([a({selector:"awg-resource-detail-json-converted",template:nt,changeDetection:n.OnPush,styles:[lt]})],re);var ct=`<awg-json-viewer jsonViewerHeader="Raw JSON response from Salsah-API" [jsonViewerData]="resourceJsonRawData">
</awg-json-viewer>
`;var pt="";var F,oe=(F=class{},F.propDecorators={resourceJsonRawData:[{type:l}]},F);oe=o([a({selector:"awg-resource-detail-json-raw",template:ct,changeDetection:n.OnPush,styles:[pt]})],oe);var _e=class{};_e=o([E({imports:[de],declarations:[z,X,K,Z,ee,te,re,oe],exports:[z,X,K,Z,ee,te,re,oe]})],_e);var ht=`@if (extendedSearchForm) {
    <form [formGroup]="extendedSearchForm" (ngSubmit)="onSearch()" class="p-3 border">
        <div class="form-floating awg-form-floating-group flex-grow-1 mt-3 mb-3">
            <select
                class="form-select"
                id="awg-extended-search-resourcetype-input"
                aria-label="Extended search restype control"
                formControlName="restypeControl"
                required>
                <option value="" disabled hidden>{{ defaultFormString }}</option>
                @for (resourcetype of restypesResponse?.resourcetypes; track resourcetype.id) {
                    <option [value]="resourcetype.id" [title]="resourcetype.label">
                        {{ resourcetype.id }} | {{ resourcetype.label }}
                    </option>
                }
            </select>
            <label for="awg-extended-search-resourcetype-input" class="text-muted">Resource type</label>
        </div>
        <ng-container formArrayName="propertiesControls">
            @for (propCtrl of propertiesControls.controls; track $index; let idx = $index) {
                <div class="row mb-4 ms-4 g-2">
                    <ng-container [formGroupName]="idx">
                        <div class="form-floating col-md-4">
                            <select
                                id="awg-extended-search-property-{{ idx }}"
                                class="form-select"
                                [formControl]="getPropertyIdControlAtIndex(idx)"
                                required>
                                <option value="" disabled hidden>{{ defaultFormString }}</option>
                                @if (selectedResourcetype) {
                                    @for (property of selectedResourcetype?.properties; track property.id) {
                                        <option [value]="property.id" [title]="property.label">
                                            {{ property.id }} | {{ property.label }}
                                        </option>
                                    }
                                }
                            </select>
                            <label class="text-muted" for="awg-extended-search-property-{{ idx }}">Property</label>
                        </div>
                        <div class="form-floating col-md-2">
                            <select
                                id="awg-extended-search-compop-{{ idx }}"
                                class="form-select"
                                [formControl]="getCompopControlAtIndex(idx)"
                                required>
                                <option value="" disabled hidden>{{ defaultFormString }}</option>
                                @if (selectedCompopSets) {
                                    @for (compop of selectedCompopSets[idx]; track compop.value) {
                                        <option
                                            [value]="compop.value"
                                            [title]="compop.title"
                                            [innerHtml]="compop.label"></option>
                                    }
                                }
                            </select>
                            <label class="text-muted" for="awg-extended-search-compop-{{ idx }}">Operator</label>
                        </div>
                        <div class="form-floating col-md-4">
                            <input
                                title="Extended Search - Search Value"
                                type="search"
                                id="awg-extended-search-value-{{ idx }}"
                                class="form-control"
                                [formControl]="getSearchvalControlAtIndex(idx)"
                                placeholder="{{ defaultFormString }}" />
                            <label class="text-muted" for="awg-extended-search-value-{{ idx }}">Search value</label>
                        </div>
                        <div class="btn-toolbar col-2" role="toolbar" aria-label="Toolbar for property inputs">
                            <div class="btn-group" role="group" aria-label="Group of handle buttons">
                                @if (propertiesControls.controls.length > 1) {
                                    <button
                                        id="awg-extended-search-remove-property-{{ idx }}"
                                        class="btn btn-outline-danger"
                                        type="button"
                                        (click)="removePropertiesControl(idx)">
                                        <fa-icon [icon]="faTrash"></fa-icon>
                                    </button>
                                }
                                <button
                                    id="awg-extended-search-add-property-{{ idx }}"
                                    class="btn btn-outline-info"
                                    type="button"
                                    (click)="addPropertiesControl()"
                                    [disabled]="isAddButtonDisabled(idx)">
                                    <fa-icon [icon]="faPlus"></fa-icon>
                                </button>
                            </div>
                        </div>
                    </ng-container>
                    @if (getSearchvalControlAtIndex(idx).invalid && !getSearchvalControlAtIndex(idx).pristine) {
                        <div class="alert alert-danger">
                            @if (getSearchvalControlAtIndex(idx).errors) {
                                <p></p>
                            }
                            {{ extendedSearchFormStrings.errorMessage }}
                        </div>
                    }
                </div>
            }
        </ng-container>
        <div class="awg-extended-search-button-panel mb-4">
            <button
                id="awg-extended-search-submit"
                class="btn btn-outline-info"
                type="submit"
                [disabled]="!extendedSearchForm.valid">
                <fa-icon [icon]="faSearch"></fa-icon>
                Submit
            </button>
            <button
                id="awg-extended-search-reset"
                class="btn btn-outline-danger"
                (click)="onReset()"
                [disabled]="!restypeControl.valid">
                <fa-icon [icon]="faRefresh"></fa-icon>
                Reset
            </button>
        </div>
    </form>
}
`;var ut="";var G=new d("EXISTS","exists","&exist;"),Kt=new d("MATCH","match","&isin;"),Zt=new d("MATCH_BOOLEAN","match boolean","&isin;&oplus;"),se=new d("EQ","equal","="),dt=new d("!EQ","not equal","&ne;"),mt=new d("LIKE","like","&sub;"),er=new d("!LIKE","not like","&nsub;"),gt=new d("GT","greater than","&gt;"),ft=new d("GT_EQ","greater equal than","&ge;"),vt=new d("LT","less than","&lt;"),bt=new d("LT_EQ","less equal than","&le;"),ke={compopList:[{id:0,compopSet:[G]},{id:1,compopSet:[G,se]},{id:2,compopSet:[G,se,mt]},{id:3,compopSet:[G,se,gt,ft,vt,bt]},{id:4,compopSet:[G,se,dt,gt,ft,vt,bt]},{id:5,compopSet:[G,se,dt,Kt,Zt,mt,er]}]},we=new Map().set("1",5).set("6-14",5).set("14",5).set("2",4).set("3",4).set("4",3).set("5",3).set("13",2).set("6-3",1).set("6-6",1).set("7",1).set("11",1).set("12",1).set("15",1);var tr=new h("1","VALTYPE_TEXT","Text","textval","guielement_id=1,2","A value which is utf-8 text"),rr=new h("2","VALTYPE_INTEGER","Integer value","ival","guielement_id=1,3,4,5;min=numeric;max=numeric","A value consisting of an integer value"),or=new h("3","VALTYPE_FLOAT","Floating point number","fval","guielement_id=1,4;min=numeric;max=numeric","A value consisting of a floating point number"),sr=new h("4","VALTYPE_DATE","Date","dateval","guielement_id=7","A Value consisting of a date"),ar=new h("5","VALTYPE_PERIOD","Period","dateval","guielement_id=1;min=date;max=date;min=date;max=date","A period consists of 2 date values interpreted as start and end of the period"),ir=new h("6","VALTYPE_RESPTR","Resource pointer","ival","guielement_id=3,6","Foreign key of a resource this value is pointing to"),nr=new h("7","VALTYPE_SELECTION","Selection","ival","guielement_id=3,12","A selection out of a set of values"),lr=new h("8","VALTYPE_TIME","Time","timeval","guielement_id=15,16","A time in the form of hh:mm:ss.sss"),cr=new h("9","VALTYPE_INTERVAL","Interval","timeval","guielement_id=0","An interval between ot two times (start-time, end-time)"),pr=new h("10","VALTYPE_GEOMETRY","Geometry","textval","guielement_id=8","Figure geometry as JSON string"),hr=new h("11","VALTYPE_COLOR","Color","textval","guielement_id=9,1","A color value in internet-notation (#rrggbb)"),ur=new h("12","VALTYPE_HLIST","Hierarchical list","ival","guielement_id=10","Hierarchical list"),dr=new h("13","VALTYPE_ICONCLASS","Iconclass","textval","guielement_id=1","Iconclass as defined by http://iconclass.org"),mr=new h("14","VALTYPE_RICHTEXT","Richtext","richtext","guielement_id=14","This denotes a rich text value which in fact is a resource_reference to a rich text resource. The rich text resource should never be visible to the user directly..."),gr=new h("15","VALTYPE_GEONAME","Geoname","geoname","guielement_id=17","Reference to geonames.org"),qe={typeList:[tr,rr,or,sr,ar,ir,nr,lr,cr,pr,hr,ur,dr,mr,gr]};var M,Ne=(M=class extends me{constructor(e){super(e),this.projectId="6",this.resTypeId="126",this.bibShortTitlePropertyId="614",this.resourcesRoute="resources/",this.searchRoute="search/",this.serviceName="BibliographyService"}getBibliographyList(){let e=this.searchRoute,t=new b().set("searchtype","extended").set("property_id",this.bibShortTitlePropertyId).set("compop","EXISTS").set("filter_by_project",this.projectId).set("filter_by_restype",this.resTypeId);return this.getApiResponse(y,e,t)}getBibliographyItemDetail(e){let t=this.resourcesRoute+e,r=new b;return this.getApiResponse(P,t,r)}},M.ctorParameters=()=>[{type:ce}],M);Ne=o([le({providedIn:"root"})],Ne);var U,w=(U=class extends me{constructor(e){super(e),this.projectId="6",this.vocabularyId="4",this.defaultLanguage="de",this.resourceSuffix="_-_local",this.routes={propertylists:"propertylists/",resources:"resources/",resourcetypes:"resourcetypes/",search:"search/"},this._conversionService=s(ve),this.serviceName="DataApiService"}getPropertyListsByResourceType(e){return e?this._getResourceDataResponseFromApi(Y,e).pipe(Q(new Y),v(r=>r)):Te(new Y)}getResourceData(e){if(!e)return;let t=this._getResourceDataResponseFromApi(P,e),r=this._getResourceDataResponseFromApi(ge,e);return Fe([t,r]).pipe(Q([new P,new ge]),v(i=>this._prepareResourceData(i,e)))}getResourceTypes(){return this._getResourceDataResponseFromApi(fe,"").pipe(Q(new fe),v(t=>t))}getSearchData(e){if(!e?.query||typeof e?.query=="object"&&!e?.query?.filterByRestype)return Te(new y);let t=new _(e.query,e.nRows||"-1",e.startAt||"0",e.viewType||m.TABLE);return this._getResourceDataResponseFromApi(y,"",t).pipe(Q(new y),v(i=>this._conversionService.convertFullTextSearchResults(i)))}_createSearchQueryParamsForApi(e){let t=new b().set("filter_by_project",this.projectId).set("lang",this.defaultLanguage).set("show_nrows",e.nRows).set("start_at",e.startAt);return typeof e.query=="string"?t=t.append("searchtype","fulltext"):typeof e.query=="object"&&(t=t.append("searchtype","extended"),t=t.append("filter_by_restype",e.query.filterByRestype),e.query.propertyId&&e.query.propertyId.length>0&&e.query.compop&&e.query.compop.length>0&&(e.query.propertyId.forEach(r=>{t=t.append("property_id",r)}),e.query.compop.forEach(r=>{t=t.append("compop",r)}),e.query.searchval&&e.query.searchval.length>0&&e.query.searchval.forEach(r=>{t=t.append("searchval",r)}))),t}_prepareResourceData(e,t){let r=this._conversionService.convertResourceData(e,t);return new Qe(e[0],r)}_getResourceDataResponseFromApi(e,t,r){let i,g;switch(e){case Y:i=this.routes.propertylists,g=new b().set("restype",t);break;case ge:i=this.routes.resources+t+this.resourceSuffix,g=new b().set("reqtype","context");break;case P:i=this.routes.resources+t+this.resourceSuffix,g=new b;break;case fe:i=this.routes.resourcetypes,g=new b().set("vocabulary",this.vocabularyId).set("lang",this.defaultLanguage);break;case y:i=this.routes.search,typeof r.query=="string"&&(i=i+r.query),g=this._createSearchQueryParamsForApi(r);break;default:break}return this.getApiResponse(e,i,g)}},U.ctorParameters=()=>[{type:ce}],U);w=o([le({providedIn:"root"})],w);var $,Se=($=class{constructor(){this.searchRequest=new c,this.faPlus=He,this.faRefresh=$e,this.faSearch=ue,this.faTrash=Be,this.extendedSearchParams=new W,this.selectedCompopSets=[[]],this.defaultFormString="---",this.extendedSearchFormStrings={label:"Search Input",placeholder:"Volltextsuche in der Webern-Datenbank \u2026",errorMessage:"Es wird ein Suchbegriff mit mindestens 3 Zeichen ben\xF6tigt!"},this._destroyed$=new f,this._dataApiService=s(w),this._formBuilder=s(pe)}get restypeControl(){return this.extendedSearchForm.get("restypeControl")}get propertiesControls(){return this.extendedSearchForm.get("propertiesControls")}ngOnInit(){this.createExtendedSearchForm(),this.getResourcetypes()}createExtendedSearchForm(){this.extendedSearchForm=this._formBuilder.group({restypeControl:["",S.required],propertiesControls:this._formBuilder.array([])}),this.addPropertiesControl()}addPropertiesControl(){let e=this._formBuilder.group({propertyIdControl:[{value:"",disabled:!0},[S.required]],compopControl:[{value:"",disabled:!0},[S.required]],searchvalControl:[{value:"",disabled:!0},[this._validateSearchval()]]});this._isResourecetypeMissing()||e.controls.propertyIdControl.enable(),this.propertiesControls.push(e)}removePropertiesControl(e){e>-1&&this.propertiesControls.removeAt(e)}getCompopControlAtIndex(e){return this.listenToUserCompopChange(e),this._getFormArrayControlAtIndex("compopControl",e)}getCompopSetByValueType(e,t){if(!qe.typeList.find(Ot=>Ot.id===e))return[];let i=e==="6"?`${e}-${t}`:e,g=we.has(i)?we.get(i):0;return ke.compopList[g].compopSet}getPropertyIdControlAtIndex(e){return this.listenToUserPropertyChange(e),this._getFormArrayControlAtIndex("propertyIdControl",e)}getPropertyListEntryById(e){return this.propertyListsResponse.properties.find(t=>t.id===e)}getPropertyLists(e){this._dataApiService.getPropertyListsByResourceType(e).pipe(u(this._destroyed$)).subscribe({next:t=>{this.propertyListsResponse=t},error:t=>{console.error(t)}})}getResourcetypes(){this._dataApiService.getResourceTypes().pipe(u(this._destroyed$)).subscribe({next:e=>{this.restypesResponse=e,this.listenToUserResourcetypeChange()},error:e=>{console.error(e)}})}getSearchvalControlAtIndex(e){return this._getFormArrayControlAtIndex("searchvalControl",e)}isAddButtonDisabled(e){return this._isPropertyIdOrCompopMissing(e)||this._isNotLastProperty(e)||!this._isCompopExists(e)&&this._isSearchvalMissingOrTooShort(e)}listenToUserResourcetypeChange(){this.restypeControl.valueChanges.pipe(u(this._destroyed$)).subscribe({next:e=>{this.selectedResourcetype=this.restypesResponse.resourcetypes.find(t=>t.id===e),this._clearPropertiesControls(),this.selectedResourcetype&&this.getPropertyLists(this.selectedResourcetype.id)}})}listenToUserPropertyChange(e){this._getFormArrayControlAtIndex("propertyIdControl",e)?.valueChanges.pipe(u(this._destroyed$)).subscribe({next:t=>{let r=this.getPropertyListEntryById(t);if(!r)return;let i=r.guielement_id,g=r.valuetype_id;this._getFormArrayControlAtIndex("compopControl",e).enable(),this._getFormArrayControlAtIndex("compopControl",e).setValue(""),this._getFormArrayControlAtIndex("searchvalControl",e).disable(),this._getFormArrayControlAtIndex("searchvalControl",e).setValue(""),this.selectedCompopSets[e]=this.getCompopSetByValueType(g,i)}})}listenToUserCompopChange(e){this._getFormArrayControlAtIndex("compopControl",e)?.valueChanges.pipe(u(this._destroyed$)).subscribe({next:t=>{t&&t!=="EXISTS"?this.getSearchvalControlAtIndex(e).enable():t&&t==="EXISTS"&&(this.getSearchvalControlAtIndex(e).disable(),this.getSearchvalControlAtIndex(e).setValue(""))}})}onReset(){alert("Gesamte Suchmaske zur\xFCcksetzen?"),this._resetForm()}onSearch(){this.extendedSearchForm.valid&&(this.extendedSearchParams={filterByRestype:this.extendedSearchForm.value.restypeControl,propertyId:[],compop:[],searchval:[]},this.extendedSearchForm.value.propertiesControls?.forEach(e=>{this.extendedSearchParams.propertyId.push(e.propertyIdControl),this.extendedSearchParams.compop.push(e.compopControl),this.extendedSearchParams.searchval.push(e.searchvalControl)}),this.searchRequest.emit(this.extendedSearchParams))}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}_clearPropertiesControls(){this.propertiesControls.clear(),this.addPropertiesControl()}_getFormArrayControlAtIndex(e,t){let r=this.propertiesControls.controls.at(t);return r?r.get(e):null}_isCompopExists(e){return this._getFormArrayControlAtIndex("compopControl",e).value==="EXISTS"}_isCompopMissing(e){return this._isFormControlValueMissing("compopControl",e)}_isFormControlValueMissing(e,t){let r=this._getFormArrayControlAtIndex(e,t)?.value;return!r||r===this.defaultFormString}_isNotLastProperty(e){return this.propertiesControls.controls.length-1>e}_isPropertyIdMissing(e){return this._isFormControlValueMissing("propertyIdControl",e)}_isPropertyIdOrCompopMissing(e){return this._isPropertyIdMissing(e)||this._isCompopMissing(e)}_isResourecetypeMissing(){let e=this.restypeControl.value;return!e||e===this.defaultFormString}_isSearchvalMissing(e){return this._isFormControlValueMissing("searchvalControl",e)}_isSearchvalMissingOrTooShort(e){return this._isSearchvalMissing(e)||this._isSearchvalTooShort(e)}_isSearchvalTooShort(e){return this.getSearchvalControlAtIndex(e).value.length<3}_resetForm(){return this.extendedSearchForm.reset()}_validateSearchval(){return e=>{let t=e.value;return e.parent.get("compopControl").value==="EXISTS"?null:!t||t.length<3?{minlength:!0}:null}}},$.propDecorators={searchRequest:[{type:p}]},$);Se=o([a({selector:"awg-extended-search-form",template:ht,styles:[ut]})],Se);var yt=`<form [formGroup]="fulltextSearchForm" class="p-3 border">
    <div class="input-group mt-3 mb-3">
        <div class="input-group-text" id="search-icon" style="max-height: 3.63rem">
            <fa-icon [icon]="faSearch"></fa-icon>
        </div>
        <div class="form-floating awg-form-floating-group flex-grow-1">
            <input
                title="{{ fulltextSearchFormStrings.label }}"
                type="search"
                id="awg-fulltext-search-searchValue"
                class="form-control"
                [ngClass]="{
                    'is-invalid': isFulltextSearchInputInvalid(),
                }"
                formControlName="searchvalControl"
                [attr.aria-label]="fulltextSearchFormStrings.label"
                aria-describedby="search-icon"
                placeholder="{{ fulltextSearchFormStrings.placeholder }}"
                required />
            <label for="awg-fulltext-search-searchValue" class="text-muted">{{
                fulltextSearchFormStrings.placeholder
            }}</label>
            @if (searchvalControl.invalid && !searchvalControl.pristine) {
                <div class="invalid-feedback">
                    @if (isFulltextSearchInputInvalid()) {
                        <p>
                            {{ fulltextSearchFormStrings.errorMessage }}
                        </p>
                    }
                </div>
            }
        </div>
    </div>
</form>
`;var _t=`.awg-form-floating-group input{border-bottom-left-radius:0;border-top-left-radius:0}
`;var B,Re=(B=class{constructor(){this.searchRequest=new c,this.faSearch=ue,this.fulltextSearchFormStrings={label:"Input f\xFCr Volltextsuche",placeholder:"Volltextsuche in der Webern-Datenbank \u2026",errorMessage:"Es wird ein Suchbegriff mit mindestens 3 Zeichen ben\xF6tigt!"},this._destroyed$=new f,this._formBuilder=s(pe)}get searchvalControl(){return this.fulltextSearchForm.get("searchvalControl")}ngOnInit(){this.createFulltextSearchForm(),this.listenToUserInputChange()}ngOnChanges(e){e.searchValue&&typeof e.searchValue.currentValue=="string"&&!e.searchValue.isFirstChange()&&this.setSearchvalFromInput()}createFulltextSearchForm(){this.fulltextSearchForm=this._formBuilder.group({searchvalControl:["",S.compose([S.required,S.minLength(3)])]})}isFulltextSearchInputInvalid(){return!!(this.searchvalControl.hasError("required")||this.searchvalControl.hasError("minlength"))}listenToUserInputChange(){this.searchvalControl.valueChanges.pipe(I(e=>e.length>=3),Ge(500),Me(),u(this._destroyed$)).subscribe({next:e=>this.onSearch(e)})}setSearchvalFromInput(){this.searchvalControl.setValue(this.searchValue)}onSearch(e){e&&this.fulltextSearchForm.valid&&this.searchRequest.emit(e)}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}},B.propDecorators={searchValue:[{type:l}],searchRequest:[{type:p}]},B);Re=o([a({selector:"awg-fulltext-search-form",template:yt,changeDetection:n.OnPush,styles:[_t]})],Re);var wt=`<!-- content: search results -->

<!-- TODO Use shared generic table component to display search results
<awg-table
  tableTitle="{{ searchResponseWithQuery?.query | json }}"
  [headerInputData]="test.head.vars"
[rowInputData]="test.body.bindings"></awg-table>
-->

@if (searchResponseWithQuery?.data) {
    <div class="awg-search-results p-3 border rounded-bottom">
        <!-- header -->
        <div class="row d-flex justify-content-between mb-4 awg-search-results-header">
            <div class="col-6 me-auto awg-search-results-header-icons">
                <div class="btn-group" role="group">
                    <!-- View Handle -->
                    <awg-view-handle-button-group
                        [viewHandles]="viewHandles"
                        [selectedViewType]="selectedViewType"
                        (viewChangeRequest)="onViewChange($event)"></awg-view-handle-button-group>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-sm btn-outline-info" disabled aria-disabled="true">
                            <span class="d-none d-lg-inline">Hits per page: </span>{{ searchParams?.nRows }}
                        </button>
                        <div
                            ngbDropdown
                            class="btn-group"
                            role="group"
                            aria-label="Button group with nested dropdown for row number">
                            <button
                                class="btn btn-sm btn-info dropdown-toggle-split"
                                ngbDropdownToggle
                                [disabled]="isNoResults()"></button>
                            <div class="dropdown-menu" ngbDropdownMenu>
                                @for (rowNumber of rowNumbers; track rowNumber) {
                                    <button class="dropdown-item" (click)="onRowNumberChange(rowNumber)">
                                        {{ rowNumber }}
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6 my-auto text-center awg-search-results-header-text">
                {{ searchResultText }}
            </div>
        </div>
        @if (searchResponseWithQuery?.data?.subjects && !isNoResults()) {
            <!-- top pagination -->
            <ngb-pagination
                class="d-flex justify-content-center"
                [(page)]="page"
                [pageSize]="pageSize"
                [collectionSize]="+searchResponseWithQuery?.data?.nhits"
                [maxSize]="4"
                [boundaryLinks]="true"
                (pageChange)="onPageChange($event)">
            </ngb-pagination>
            <!-- table with searchResults -->
            @if (!isGridView()) {
                <div class="table-responsive">
                    <table
                        aria-label="Table with search results"
                        class="table table-hover table-sm awg-search-result-table">
                        <thead>
                            <tr class="d-flex">
                                <th scope="col" class="col-6 col-sm-3 col-md-4 col-lg-3 col-xl-2">Typ</th>
                                <th scope="col" class="col-6 col-sm-9 col-md-8 col-lg-9 col-xl-10">Ressource</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- show searchResultDetail by clicking on single entry -->
                            @for (subject of searchResponseWithQuery?.data?.subjects; track $index) {
                                <tr
                                    class="d-flex"
                                    (click)="navigateToResource(subject?.obj_id)"
                                    [class.active]="isActiveResource(subject?.obj_id)">
                                    <td class="col-6 col-sm-3 col-md-4 col-lg-3 col-xl-2">
                                        <span class="badge text-bg-light">
                                            <img [attr.src]="subject?.iconsrc" alt="iconsrc" />
                                            <small>&nbsp;{{ subject?.iconlabel }}</small>
                                        </span>
                                    </td>
                                    <td class="col-6 col-sm-9 col-md-8 col-lg-9 col-xl-10">
                                        <span
                                            ><em>{{ subject?.valuelabel[0] }}:&nbsp;</em></span
                                        ><span [compile-html]="subject?.value[0]" [compile-html-ref]="this"></span>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            }
            <!-- grid with searchResults -->
            @if (isGridView()) {
                <div class="row row-cols-1 row-cols-sm-3 row-cols-xl-5 g-4 mb-4">
                    @for (subject of searchResponseWithQuery?.data?.subjects; track $index) {
                        <div class="col">
                            <div class="card h-100">
                                <div class="card-header">
                                    <img [attr.src]="subject?.iconsrc" alt="iconsrc" />
                                    &nbsp;{{ subject?.iconlabel }}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">
                                        <span [compile-html]="subject?.value[0]" [compile-html-ref]="this"></span>
                                    </h5>
                                </div>
                                <div class="card-footer text-end">
                                    <a (click)="navigateToResource(subject?.obj_id)" class="btn btn-outline-info"
                                        >Mehr ...
                                    </a>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            }
            <!-- bottom pagination -->
            <ngb-pagination
                class="d-flex justify-content-center"
                [(page)]="page"
                [pageSize]="pageSize"
                [collectionSize]="+searchResponseWithQuery?.data?.nhits"
                [maxSize]="4"
                [boundaryLinks]="true"
                (pageChange)="onPageChange($event)">
            </ngb-pagination>
        }
    </div>
}
`;var St=`.awg-search-results .awg-search-result-table tbody tr{cursor:pointer}.awg-search-results .awg-search-result-table tbody tr:hover{background-color:#e7e7e7}.awg-search-results .awg-search-result-table tbody tr.active td{background-color:#d7d7d7}
`;var H,Ce=(H=class{constructor(){this.pageChangeRequest=new c,this.rowNumberChangeRequest=new c,this.viewChangeRequest=new c,this.errorMessage=void 0,this.rowNumbers=[5,10,25,50,100,200],this.faGripHorizontal=De,this.faTable=Ee,this.selectedViewType=m.TABLE,this.viewHandles=[new Oe("Table view",m.TABLE,Ee),new Oe("Grid view",m.GRID,De)],this._destroyed$=new f,this._conversionService=s(ve),this._dataStreamerService=s(A),this._router=s(R),this._sideInfoService=s(ye)}ngOnInit(){this.getSearchResponseWithQueryData(),this.searchParams.viewType&&(this.searchParams.viewType===m.TABLE||this.searchParams.viewType===m.GRID)&&this.setViewType(this.searchParams.viewType)}setViewType(e){this.selectedViewType=e}isActiveResource(e){return this._selectedResourceId===e}isGridView(){return this.searchParams.viewType===m.GRID}isNoResults(){return+this.searchResponseWithQuery.data.nhits==0}navigateToResource(e){this._selectedResourceId=e,this._router.navigate(["/data/resource",this._selectedResourceId])}onPageChange(e){let t=+this.searchParams.nRows,r=e*t-t;this.pageChangeRequest.emit(String(r))}onRowNumberChange(e){this.rowNumberChangeRequest.emit(String(e))}onViewChange(e){e&&this.viewChangeRequest.emit(e)}setPagination(){let e=+this.searchParams.nRows,t=+this.searchParams.startAt;this.pageSize=e,this.page=Math.floor(t/e)+1}getSearchResponseWithQueryData(){this._dataStreamerService.getSearchResponseWithQuery().pipe(u(this._destroyed$)).subscribe({next:t=>{this.updateSearchParams(t),this.setPagination()},error:t=>{this.errorMessage=t,console.error("SearchResultList# searchResultData subscription error: ",this.errorMessage)}})}updateSearchParams(e){if(!e)return;this.searchResponseWithQuery=je({},e),this.searchResultText=this._conversionService.prepareFullTextSearchResultText(e,this.searchUrl);let t=new We(this.searchResponseWithQuery.query,this.searchResultText);this._sideInfoService.updateSearchInfoData(t)}ngOnDestroy(){this._sideInfoService.clearSearchInfoData(),this._destroyed$.next(!0),this._destroyed$.complete()}},H.propDecorators={searchUrl:[{type:l}],searchParams:[{type:l}],pageChangeRequest:[{type:p}],rowNumberChangeRequest:[{type:p}],viewChangeRequest:[{type:p}]},H);Ce=o([a({selector:"awg-search-result-list",template:wt,changeDetection:n.Default,styles:[St]})],Ce);var Rt=`<!-- resource detail box -->
<div class="awg-resource-view p-5 border rounded-3">
    <!-- loading spinner -->
    @if (isLoading$ | async) {
        <div>
            <awg-twelve-tone-spinner></awg-twelve-tone-spinner>
        </div>
    } @else {
        <!-- error message -->
        @if (errorMessage) {
            <div class="awg-error-message">
                <p>Die Anfrage "{{ errorMessage?.route }}" ist fehlgeschlagen.</p>
                <p>Fehlermeldung: "{{ errorMessage?.statusText || errorMessage }}".</p>
                <p>M\xF6glicherweise gab es ein Problem mit der Internetverbindung oder dem verwendeten Suchbegriff.</p>
            </div>
        }
        <!-- async data -->
        @if (resourceData) {
            <div class="awg-resource-detail-tabs">
                <!-- resourceDetailData header -->
                @if (resourceData.detail.header) {
                    <awg-resource-detail-header
                        [header]="resourceData.detail.header"
                        [resourceUrl]="httpGetUrl"
                        (resourceRequest)="navigateToResource($event)"></awg-resource-detail-header>
                }
                <!-- resourceDetailData body -->
                <nav
                    ngbNav
                    #resourceDetailNav="ngbNav"
                    class="nav-tabs"
                    [activeId]="selectedResourceDetailTabId"
                    (navChange)="onResourceDetailTabChange($event)">
                    <ng-container ngbNavItem="html">
                        <a ngbNavLink class="awg-resource-detail-long-tab">{{ resourceDetailTabTitles?.html }}</a>
                        <ng-template ngbNavContent>
                            <!-- html visualisation -->
                            <awg-resource-detail-html
                                [resourceDetailData]="resourceData.detail"
                                (gndRequest)="exposeGnd($event)"
                                (resourceRequest)="navigateToResource($event)">
                            </awg-resource-detail-html>
                        </ng-template>
                    </ng-container>
                    <ng-container ngbNavItem="converted-json">
                        <a ngbNavLink class="ms-auto">{{ resourceDetailTabTitles?.converted }}</a>
                        <ng-template ngbNavContent>
                            <!-- converted json visualisation -->
                            <awg-resource-detail-json-converted
                                [resourceJsonConvertedData]="resourceData.jsonConverted">
                            </awg-resource-detail-json-converted>
                        </ng-template>
                    </ng-container>
                    <ng-container ngbNavItem="raw-json">
                        <a ngbNavLink>{{ resourceDetailTabTitles?.raw }}</a>
                        <ng-template ngbNavContent>
                            <!-- raw json visualisation -->
                            <awg-resource-detail-json-raw [resourceJsonRawData]="resourceData.jsonRaw">
                            </awg-resource-detail-json-raw>
                        </ng-template>
                    </ng-container>
                </nav>
                <div [ngbNavOutlet]="resourceDetailNav"></div>
            </div>
        }
        <!--
  TODO: remove
  <ul class="nav nav-tabs nav-justified" role="tablist">
    <li class="active awg-resource-detail-long-tab"><a data-toggle="tab" href="#html">{{ tabTitles?.html }}</a></li>
    <li class="dropdown awg-resource-detail-short-tab">
      <a href="#" data-toggle="dropdown" class="dropdown-toggle">
        {{ '{' }} JSON {{ '}' }} <b class="caret"></b>
      </a>
      <ul class="dropdown-menu dropdown-menu-right">
        <li><a data-toggle="tab" href="#converted">{{ tabTitles?.converted }}</a></li>
        <li><a data-toggle="tab" href="#raw">{{ tabTitles?.raw }}</a></li>
      </ul>
    </li>
  </ul>
  -->
    }
</div>
`;var Ct=`@charset "UTF-8";@media screen and (min-width: 768px){.awg-resource-detail-long-tab{width:auto!important}.awg-resource-detail-short-tab>a{white-space:nowrap}}::ng-deep .tab-content .tab-pane.active{margin:2rem 0}
`;var C=class{constructor(){this.errorMessage=void 0,this.resourceDetailTabTitles={html:"Detail",raw:"JSON (raw)",converted:"JSON (converted)"},this._destroyed$=new f,this._dataApiService=s(w),this._dataStreamerService=s(A),this._gndService=s(Ye),this._loadingService=s(be),this._route=s(D),this._router=s(R)}get httpGetUrl(){return this._dataApiService.httpGetUrl}get isLoading$(){return this._loadingService.getLoadingStatus()}ngOnInit(){this.navigateToSideOutlet(),this.getResourceData()}getResourceData(){this._router.events.pipe(I(e=>e instanceof he),v(()=>this._route),ne(e=>{let r=this._route.snapshot.paramMap.get("id");for(;e.firstChild;)e=e.firstChild;return this.selectedResourceDetailTabId=e.snapshot.url[0].path,this.updateResourceId(r),this._dataApiService.getResourceData(r)}),u(this._destroyed$)).subscribe({next:e=>{this.resourceData=e},error:e=>this.errorMessage=e})}onResourceDetailTabChange(e){let t=e.nextId;this._router.navigate([t],{relativeTo:this._route})}updateResourceId(e){this.resourceId=e,this._dataStreamerService.updateResourceId(e)}navigateToResource(e){let t=e??this.oldId??this.resourceId;this.oldId=this.resourceId,this._router.navigate(["/data/resource",+t])}exposeGnd(e){e&&this._gndService.exposeGnd(e)}navigateToSideOutlet(){this._router.navigate([{outlets:{side:"resourceInfo"}}],{preserveFragment:!0,queryParamsHandling:"preserve"})}ngOnDestroy(){this._router.navigate([{outlets:{side:null}}]),this._destroyed$.next(!0),this._destroyed$.complete()}};C=o([a({selector:"awg-resource-detail",template:Rt,changeDetection:n.Default,styles:[Ct]})],C);var xt=`@if (searchRouterLinkButtons) {
    <awg-router-link-button-group
        [routerLinkButtons]="searchRouterLinkButtons"
        [queryParamsHandling]="'preserve'"
        (selectButtonRequest)="onButtonSelect($event)">
    </awg-router-link-button-group>
}

<router-outlet />
`;var Tt="";var ae=class{constructor(){this._sideInfoService=s(ye),this._route=s(D)}ngOnInit(){this.setButtons(),this.updateSearchInfoTitleFromPath()}setButtons(){this.searchRouterLinkButtons=[new J("/data","search","Suche",!1),new J("/data","timeline","Timeline",!0),new J("/data","bibliography","Bibliographie",!0)]}updateSearchInfoTitleFromPath(){let e=this._route.snapshot.url[0].path,t=this.searchRouterLinkButtons.filter(r=>r.link===e);t.length===1&&this._sideInfoService.updateSearchInfoTitle(t[0].label)}onButtonSelect(e){let t=e instanceof J;!e||!t||!e.label||(this._sideInfoService.clearSearchInfoData(),this._sideInfoService.updateSearchInfoTitle(e.label))}};ae=o([a({selector:"awg-search-overview",template:xt,styles:[Tt]})],ae);var It=`<!-- content: search panel -->
<div class="awg-search-tabs">
    <nav
        ngbNav
        #searchNav="ngbNav"
        class="nav-tabs nav-fill"
        [activeId]="selectedSearchTabId"
        (navChange)="onSearchTabChange($event)">
        <ng-container [ngbNavItem]="searchTabs?.fulltext.id">
            <a ngbNavLink id="fulltext" class="awg-fulltext-search-tab">{{ searchTabs?.fulltext.title }}</a>
            <ng-template ngbNavContent>
                <!-- full text search -->
                <awg-fulltext-search-form
                    [searchValue]="getSearchQueryType(searchParams?.query)"
                    (searchRequest)="onSearch($event)">
                </awg-fulltext-search-form>
            </ng-template>
        </ng-container>
        <ng-container [ngbNavItem]="searchTabs.extended.id">
            <a ngbNavLink class="awg-extended-search-tab">{{ searchTabs?.extended.title }}</a>
            <ng-template ngbNavContent>
                <!-- extended search -->
                <awg-extended-search-form (searchRequest)="onSearch($event)"></awg-extended-search-form>
            </ng-template>
        </ng-container>
    </nav>
    <div [ngbNavOutlet]="searchNav"></div>
</div>

<!-- loading spinner -->
@if (isLoading$ | async) {
    <div>
        <awg-twelve-tone-spinner></awg-twelve-tone-spinner>
    </div>
} @else {
    @if (errorMessage) {
        <div class="awg-error-message">
            <p>Die Anfrage "{{ errorMessage?.route }}" ist fehlgeschlagen.</p>
            <p>Fehlermeldung: "{{ errorMessage?.statusText || errorMessage }}".</p>
            <p>M\xF6glicherweise gab es ein Problem mit der Internetverbindung oder der Suchanfrage.</p>
        </div>
    }
    @if (searchResponseWithQuery?.query) {
        <awg-search-result-list
            [searchParams]="searchParams"
            [searchUrl]="httpGetUrl"
            (pageChangeRequest)="onPageChange($event)"
            (rowNumberChangeRequest)="onRowNumberChange($event)"
            (viewChangeRequest)="onViewChange($event)">
        </awg-search-result-list>
    }
}

<!-- search results -->
`;var Et="";var x=class{constructor(){this.errorMessage=void 0,this.searchTabs={fulltext:{id:"fulltext",title:"Volltext-Suche"},extended:{id:"extended",title:"Erweiterte Suche"}},this.viewChanged=!1,this._destroyed$=new f,this._dataApiService=s(w),this._dataStreamerService=s(A),this._loadingService=s(be),this._route=s(D),this._router=s(R)}get httpGetUrl(){return this._dataApiService.httpGetUrl}get isLoading$(){return this._loadingService.getLoadingStatus()}ngOnInit(){this.resetSearchParams(),this.getSearchData()}getSearchData(){this._router.events.pipe(I(e=>e instanceof he),v(()=>this._route),v(e=>{let t=e;for(;t.firstChild;)t=t.firstChild;return this._isValidTabIdInRoute(t)&&(this.selectedSearchTabId=t.snapshot.url[0].path),e}),ne(e=>{let t=e.snapshot.queryParamMap;if(t!==this.currentQueryParams){if(this.currentQueryParams=t,t.keys.length<4)this.updateSearchParamsFromRoute(t,!0);else if(this.updateSearchParamsFromRoute(t,!1),!this.viewChanged){if(this.searchParams.query&&typeof this.searchParams.query=="string")return this._dataApiService.getSearchData(this.searchParams);if(typeof this.searchParams.query=="object"&&this.searchParams.query.filterByRestype)return this._dataApiService.getSearchData(this.searchParams)}}return Ve}),u(this._destroyed$)).subscribe({next:e=>{this.searchResponseWithQuery=new Pe(e,this.searchParams.query),this._dataStreamerService.updateSearchResponseWithQuery(this.searchResponseWithQuery)},error:e=>{this.errorMessage=e,console.error("SearchPanel# getSearchData subscription error: ",this.errorMessage)}})}onPageChange(e){e!==this.searchParams.startAt&&(this.viewChanged=!1,this.searchParams=new _(this.searchParams.query,this.searchParams.nRows,e,this.searchParams.viewType),this._routeToSelf(this.searchParams))}onRowNumberChange(e){e!==this.searchParams.nRows&&(this.viewChanged=!1,this.searchParams=new _(this.searchParams.query,e,"0",this.searchParams.viewType),this._routeToSelf(this.searchParams))}onSearch(e){e!==this.searchParams.query&&(this.viewChanged=!1,this.searchParams=new _(e,this.searchParams.nRows,this.searchParams.startAt,this.searchParams.viewType),this._routeToSelf(this.searchParams))}onSearchTabChange(e){let t=e.nextId;this.resetSearchParams(t),this.resetSearchResponse(),this.errorMessage=void 0,this._routeToSelf(this.searchParams,t)}onViewChange(e){e!==this.searchParams.viewType&&(this.viewChanged=!0,this.searchParams=new _(this.searchParams.query,this.searchParams.nRows,this.searchParams.startAt,e),this._routeToSelf(this.searchParams))}resetSearchParams(e){let t;!e||e===this.searchTabs.fulltext.id?t="":e===this.searchTabs.extended.id&&(t=new W,t.filterByRestype="",t.propertyId=[],t.compop=[],t.searchval=[]),this.searchParams=new _(t,"25","0",m.TABLE)}resetSearchResponse(){this.searchResponseWithQuery=new Pe(new y,""),this._dataStreamerService.updateSearchResponseWithQuery(this.searchResponseWithQuery)}updateSearchParamsFromRoute(e,t){if(!e)return;let r;!this.selectedSearchTabId||this.selectedSearchTabId===this.searchTabs.fulltext.id||typeof this.searchParams.query=="string"?r=e.get("query")||this.searchParams.query:(this.selectedSearchTabId===this.searchTabs.extended.id||typeof this.searchParams.query=="object")&&(r=new W,r.filterByRestype=e.get("filterByRestype")||this.searchParams.query.filterByRestype,r.propertyId=e.getAll("propertyId")||this.searchParams.query.propertyId,r.compop=e.getAll("compop")||this.searchParams.query.compop,r.searchval=e.getAll("searchval")||this.searchParams.query.searchval),this.searchParams=new _(r,e.get("nrows")||this.searchParams.nRows,e.get("startAt")||this.searchParams.startAt,m[e.get("view")]||this.searchParams.viewType),t&&this._routeToSelf(this.searchParams)}getSearchQueryType(e){if(typeof e=="string")return e;if(typeof e=="object")return e}isSearchResultListShown(){return this._dataStreamerService.getSearchResponseWithQuery().pipe(u(this._destroyed$)).subscribe({next:e=>console.log(e)}),!0}ngOnDestroy(){this._destroyed$.next(!0),this._destroyed$.complete()}_routeToSelf(e,t){let r=t?[t]:[],i=this._createRouterQueryParams(e);this._router.navigate(r,{relativeTo:this._route,queryParams:i})}_createRouterQueryParams(e){let t={},r=this.getSearchQueryType(e.query);return typeof r=="string"?t.query=e.query:typeof r=="object"&&(t.filterByRestype=r.filterByRestype||"",r.propertyId&&(t.propertyId=r.propertyId||[],t.compop=r.compop||[],t.searchval=r.searchval||[])),t.nrows=e.nRows,t.startAt=e.startAt,t.view=e.viewType,t}_isValidTabIdInRoute(e){return e.snapshot.url&&e.snapshot.url.length>0&&Object.values(this.searchTabs).filter(t=>t.id===e.snapshot.url[0].path).length>0}};x=o([a({selector:"awg-search-panel",template:It,styles:[Et]})],x);var Dt=`<!-- content: search -->
<div class="awg-data-view p-5 border rounded-3">
    <!-- heading -->
    <awg-heading [title]="searchTitle" [id]="searchId"></awg-heading>

    <!-- help-block -->
    <div class="help-block text-danger para">BETA: Suche momentan noch mit eingeschr\xE4nkter Funktionalit\xE4t</div>

    <!-- data (search) routes -->
    <router-outlet />
</div>
`;var Pt="";var ie=class{constructor(){this.searchTitle="Suche",this.searchId="search",this._router=s(R)}ngOnInit(){this.navigateToSideOutlet()}navigateToSideOutlet(){this._router.navigate([{outlets:{side:"searchInfo"}}],{preserveFragment:!0,queryParamsHandling:"preserve"})}ngOnDestroy(){this._router.navigate([{outlets:{side:null}}])}};ie=o([a({selector:"awg-data",template:Dt,styles:[Pt]})],ie);var Er=[{path:"",component:ie,children:[{path:"",pathMatch:"full",redirectTo:"search"},{path:"search",component:ae,children:[{path:"",component:x,children:[{path:"",pathMatch:"full",redirectTo:"fulltext"},{path:"fulltext",data:{title:"AWG Online Edition \u2013 Fulltext Search"},component:x},{path:"extended",data:{title:"AWG Online Edition \u2013 Extended Search"},component:x},{path:"detail/:id",redirectTo:"resource/:id"}]}]}]},{path:"resource/:id",component:C,data:{title:"AWG Online Edition \u2013 Resource Detail"},children:[{path:"",pathMatch:"full",redirectTo:"html"},{path:"html",data:{title:"AWG Online Edition \u2013 Resource Detail HTML"},component:C},{path:"converted-json",data:{title:"AWG Online Edition \u2013 Resource Detail JSON Converted"},component:C},{path:"raw-json",data:{title:"AWG Online Edition \u2013 Resource Detail JSON Raw"},component:C}]}],At=[ie,ae,x,C],xe=class{};xe=o([E({imports:[Ie.forChild(Er)],exports:[Ie]})],xe);var Lt=class{};Lt=o([E({imports:[de,_e,xe],declarations:[At,Se,Re,Ce]})],Lt);export{Lt as DataViewModule};
