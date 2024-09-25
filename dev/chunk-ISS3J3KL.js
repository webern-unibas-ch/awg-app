import{f as E}from"./chunk-EMFQDXNR.js";import"./chunk-5KTBVYV7.js";import{b as x,m as C,z as v}from"./chunk-YLN5CMJV.js";import{F as c,Ma as f,Oa as m,P as h,Q as u,W as a,k as d,ob as I,s as l,y as g,za as n}from"./chunk-VBVYB2ME.js";var _=`<!-- content: intro -->
<div>
    <!-- modal -->
    <awg-modal #modal></awg-modal>

    <!-- intro -->
    @if (editionIntroData$ | async; as editionIntroData) {
        <div class="awg-intro-view p-5 border rounded-3">
            @if (utils.isNotEmptyArray(editionIntroData.intro[0].content)) {
                @for (introParagraph of editionIntroData.intro[0].content; track introParagraph) {
                    <p class="awg-intro-para" [compile-html]="introParagraph" [compile-html-ref]="this"></p>
                }
            } @else {
                <p class="awg-intro-empty">
                    <small class="text-muted"
                        >[Die Einleitung zum Editionskomplex
                        <span [innerHTML]="editionComplex.complexId.full"></span> erscheint im Zusammenhang der
                        vollsta\u0308ndigen Edition von <span [innerHTML]="editionComplex.complexId.short"></span> in
                        {{ editionRouteConstants.EDITION.short }} {{ editionComplex.pubStatement.series.short }}/{{
                            editionComplex.pubStatement.section.short
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
            <awg-error-alert [errorObject]="errorObject"></awg-error-alert>
        } @else {
            <!-- loading spinner -->
            <awg-twelve-tone-spinner></awg-twelve-tone-spinner>
        }
    }
</div>
`;var w=`.awg-intro-para{margin:0;text-indent:25px}.awg-intro-para::ng-deep .heading{display:block;margin-bottom:25px;font-size:1.5em;font-weight:700}.awg-intro-para::ng-deep .heading,.awg-intro-para::ng-deep .small,.awg-intro-para::ng-deep .no-indent{text-indent:0}.awg-intro-para::ng-deep .small:not(.spacebreak),.awg-intro-para::ng-deep .no-indent{margin-left:-25px}.awg-intro-para::ng-deep .spacebreak{display:block;margin-bottom:25px}.awg-intro-para::ng-deep .spacebreak.no-indent{margin-left:0}
`;var i,r=(i=class{constructor(t,o,e,p){this.editionDataService=t,this.editionService=o,this.router=e,this.utils=p,this.errorObject=null,this.ref=this}get editionRouteConstants(){return x}ngOnInit(){this.getEditionIntroData()}getEditionIntroData(){this.editionIntroData$=this.editionService.getSelectedEditionComplex().pipe(g(t=>(this.editionComplex=t,this.editionDataService.getEditionIntroData(this.editionComplex))),l(t=>(this.errorObject=t,d)))}navigateToIntroFragment(t){let o=this.editionRouteConstants.EDITION_INTRO.route,e={fragment:t?.fragmentId??""};this._navigateWithComplexId(t?.complexId,o,e)}navigateToReportFragment(t){let o=this.editionRouteConstants.EDITION_REPORT.route,e={fragment:t?.fragmentId??""};this._navigateWithComplexId(t?.complexId,o,e)}openModal(t){t&&this.modal.open(t)}selectSvgSheet(t){let o=this.editionRouteConstants.EDITION_SHEETS.route,e={queryParams:{id:t?.sheetId??""}};this._navigateWithComplexId(t?.complexId,o,e)}_navigateWithComplexId(t,o,e){let p=t?`/edition/complex/${t}/`:this.editionComplex.baseRoute;this.router.navigate([p,o],e)}},i.ctorParameters=()=>[{type:C},{type:v},{type:f},{type:E}],i.propDecorators={modal:[{type:h,args:["modal",{static:!0}]}]},i);r=n([u({selector:"awg-intro",template:_,changeDetection:c.OnPush,styles:[w]})],r);var y=[{path:"",component:r,data:{title:"AWG Online Edition \u2013 Intro"}}],R=[r],s=class{};s=n([a({imports:[m.forChild(y)],exports:[m]})],s);var D=class{};D=n([a({imports:[I,s],declarations:[R]})],D);export{D as EditionIntroModule};
