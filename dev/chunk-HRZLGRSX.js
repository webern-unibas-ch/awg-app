import{a as c}from"./chunk-QYMCKAPA.js";import"./chunk-3GWTUQ35.js";import{m as n}from"./chunk-SF2RIEEF.js";import{U as w}from"./chunk-ZRLKKSTB.js";import{i as a}from"./chunk-3BZQ7CXH.js";import"./chunk-LV4P6VJV.js";import"./chunk-I22XAGWJ.js";import"./chunk-UJPKQH37.js";import{Ua as d,Za as r,da as e,ia as l,o}from"./chunk-2UFBJ743.js";var m=`@if (viewData(); as view) {
    @if (view.error; as errorObject) {
        <awg-alert-error [errorObject]="errorObject" />
    } @else if (view.isLoading) {
        <awg-twelve-tone-spinner />
    } @else {
        <div class="awg-rowtables-view row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
            @let rowtables = view.data.rowtablesData.rowtables;

            @for (rowtable of rowtables; track rowtable.route) {
                <div class="col">
                    <div class="card h-100 shadow">
                        <div class="card-body">
                            <h5 class="card-title" [class.text-muted]="rowtable.disabled">
                                Reihentabelle {{ rowtable.short }}
                            </h5>
                        </div>
                        <div class="card-footer text-end">
                            <a
                                [routerLink]="['../complex' + rowtable.route, 'sheets']"
                                [queryParams]="{ id: rowtable.id }"
                                class="btn btn-outline-info"
                                [class.disabled]="rowtable.disabled"
                                >Mehr ...
                            </a>
                        </div>
                    </div>
                </div>
            }
        </div>
    }
}
`;var b="";var t=class{constructor(){this._editionStateService=e(w),this.viewData=e(c).rowtablesViewData,this._editionStateService.updateIsRowtablesView(!0),e(l).onDestroy(()=>{this._editionStateService.updateIsRowtablesView(!1)})}static{this.ctorParameters=()=>[]}};t=o([d({selector:"awg-edition-rowtables",template:m,standalone:!1,styles:[b]})],t);var v=[{path:"",component:t,data:{title:"AWG Online Edition \u2013 Row tables"}}],p=[t],i=class{};i=o([r({imports:[a.forChild(v)],exports:[a]})],i);var f=class{};f=o([r({imports:[n,i],declarations:[p]})],f);export{f as EditionRowtablesModule};
