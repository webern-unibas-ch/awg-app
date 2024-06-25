import{f as E}from"./chunk-NTR3UM2I.js";import{a as v,m as C}from"./chunk-MG7CQ4OO.js";import{c as x}from"./chunk-6D2IT3Y2.js";import"./chunk-EY3PDUJA.js";import{G as c,Ma as f,Oa as d,Q as h,R as u,X as a,k as m,l as r,ob as I,t as l,z as g}from"./chunk-TSRZPXKZ.js";var _=`<!-- content: intro -->
<div>
    <!-- modal -->
    <awg-modal #modal></awg-modal>

    <!-- intro -->
    @if (editionIntroData$ | async; as editionIntroData) {
        <div class="awg-intro-view p-5 border rounded-3">
            @if (utils.isNotEmptyArray(editionIntroData.intro[0].content)) {
                @for (introParagraph of editionIntroData.intro[0].content; track introParagraph) {
                    <p class="awg-intro-paragraph" [compile-html]="introParagraph" [compile-html-ref]="this"></p>
                }
            } @else {
                <p class="awg-intro-empty">
                    <small class="text-muted"
                        >[Die Einleitung zum Editionskomplex
                        <span [innerHTML]="editionComplex.complexId.full"></span> erscheint im Zusammenhang der
                        vollsta\u0308ndigen Edition von <span [innerHTML]="editionComplex.complexId.short"></span> in
                        {{ editionRouteConstants.EDITION.short }} {{ editionComplex.series.short }}/{{
                            editionComplex.section.short
                        }}.]
                    </small>
                </p>
            }
            @if (utils.isNotEmptyArray(editionIntroData.intro[0].footnotes)) {
                <hr />
                <h5>Anmerkungen</h5>
                @for (footnote of editionIntroData.intro[0].footnotes; track footnote) {
                    <small
                        ><p class="awg-intro-footnote" [compile-html]="footnote" [compile-html-ref]="this"></p
                    ></small>
                }
            }
        </div>
    } @else {
        <!-- error message -->
        @if (errorObject) {
            <div class="errorMessage">
                <div class="col-12 text-center">
                    <div class="alert alert-danger">
                        {{ errorObject }}
                    </div>
                </div>
            </div>
        }
    }
</div>
`;var R=`p.awg-intro-paragraph{margin:0;text-indent:25px}p.awg-intro-paragraph::ng-deep .heading{display:block;margin-bottom:25px;font-size:1.5em;font-weight:700}p.awg-intro-paragraph::ng-deep .heading,p.awg-intro-paragraph::ng-deep .small,p.awg-intro-paragraph::ng-deep .no-indent{text-indent:0}p.awg-intro-paragraph::ng-deep .small:not(.spacebreak),p.awg-intro-paragraph::ng-deep .no-indent{margin-left:-25px}p.awg-intro-paragraph::ng-deep .spacebreak{display:block;margin-bottom:25px}p.awg-intro-paragraph::ng-deep .spacebreak.no-indent{margin-left:0}
`;var i,n=(i=class{constructor(t,o,e,p){this.editionDataService=t,this.editionService=o,this.router=e,this.utils=p,this.errorObject=null,this.ref=this}get editionRouteConstants(){return x}ngOnInit(){this.getEditionIntroData()}getEditionIntroData(){this.editionIntroData$=this.editionService.getEditionComplex().pipe(g(t=>(this.editionComplex=t,this.editionDataService.getEditionIntroData(this.editionComplex))),l(t=>(this.errorObject=t,m)))}navigateToIntroFragment(t){let o=this.editionRouteConstants.EDITION_INTRO.route,e={fragment:t?.fragmentId??""};this._navigateWithComplexId(t?.complexId,o,e)}navigateToReportFragment(t){let o=this.editionRouteConstants.EDITION_REPORT.route,e={fragment:t?.fragmentId??""};this._navigateWithComplexId(t?.complexId,o,e)}openModal(t){t&&this.modal.open(t)}selectSvgSheet(t){let o=this.editionRouteConstants.EDITION_SHEETS.route,e={queryParams:{id:t?.sheetId??""}};this._navigateWithComplexId(t?.complexId,o,e)}_navigateWithComplexId(t,o,e){let p=t?`/edition/complex/${t}/`:this.editionComplex.baseRoute;this.router.navigate([p,o],e)}},i.ctorParameters=()=>[{type:v},{type:C},{type:f},{type:E}],i.propDecorators={modal:[{type:h,args:["modal",{static:!0}]}]},i);n=r([u({selector:"awg-intro",template:_,changeDetection:c.OnPush,styles:[R]})],n);var y=[{path:"",component:n,data:{title:"AWG Online Edition \u2013 Intro"}}],D=[n],s=class{};s=r([a({imports:[d.forChild(y)],exports:[d]})],s);var O=class{};O=r([a({imports:[I,s],declarations:[D]})],O);export{O as EditionIntroModule};
