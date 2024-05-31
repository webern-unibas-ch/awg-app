import{f as I}from"./chunk-3ZJIQCL7.js";import{a as x,m as C}from"./chunk-W3RTTZLA.js";import{c as v}from"./chunk-GUPLAGXT.js";import"./chunk-7EOCLLXY.js";import{G as c,Ma as f,Oa as p,Q as h,R as u,X as a,k as m,l as i,ob as E,t as l,z as g}from"./chunk-L2YCISRN.js";var R=`<!-- content: intro -->
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
                        vollsta\u0308ndigen Edition von {{ editionComplex.complexId.short }} in
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
`;var _=`p.awg-intro-paragraph{margin:0;text-indent:25px}p.awg-intro-paragraph::ng-deep .heading{display:block;margin-bottom:25px;font-size:1.5em;font-weight:700}p.awg-intro-paragraph::ng-deep .heading,p.awg-intro-paragraph::ng-deep .small,p.awg-intro-paragraph::ng-deep .no-indent{text-indent:0}p.awg-intro-paragraph::ng-deep .small:not(.spacebreak),p.awg-intro-paragraph::ng-deep .no-indent{margin-left:-25px}p.awg-intro-paragraph::ng-deep .spacebreak{display:block;margin-bottom:25px}p.awg-intro-paragraph::ng-deep .spacebreak.no-indent{margin-left:0}
`;var e,n=(e=class{constructor(t,o,r,d){this.editionDataService=t,this.editionService=o,this.router=r,this.utils=d,this.errorObject=null,this.ref=this}get editionRouteConstants(){return v}ngOnInit(){this.getEditionIntroData()}getEditionIntroData(){this.editionIntroData$=this.editionService.getEditionComplex().pipe(g(t=>(this.editionComplex=t,this.editionDataService.getEditionIntroData(this.editionComplex))),l(t=>(this.errorObject=t,m)))}navigateToIntroFragment(t){this._navigateToFragment(this.editionRouteConstants.EDITION_INTRO.route,t)}navigateToReportFragment(t){this._navigateToFragment(this.editionRouteConstants.EDITION_REPORT.route,t)}openModal(t){t&&this.modal.open(t)}selectSvgSheet(t,o){let r=t?`/edition/complex/${t}/`:this.editionComplex.baseRoute,w={queryParams:{id:o??""},queryParamsHandling:""};this.router.navigate([r,this.editionRouteConstants.EDITION_SHEETS.route],w)}_navigateToFragment(t,o){o||(o="");let r={fragment:o};this.router.navigate([this.editionComplex.baseRoute,t],r)}},e.ctorParameters=()=>[{type:x},{type:C},{type:f},{type:I}],e.propDecorators={modal:[{type:h,args:["modal",{static:!0}]}]},e);n=i([u({selector:"awg-intro",template:R,changeDetection:c.OnPush,styles:[_]})],n);var N=[{path:"",component:n,data:{title:"AWG Online Edition \u2013 Intro"}}],D=[n],s=class{};s=i([a({imports:[p.forChild(N)],exports:[p]})],s);var O=class{};O=i([a({imports:[E,s],declarations:[D]})],O);export{O as EditionIntroModule};
