import{a as n}from"./chunk-3ZQGCQW2.js";import"./chunk-2PV6Q6CI.js";import{m as d}from"./chunk-L7PTWBEO.js";import"./chunk-CVD63IXD.js";import{i}from"./chunk-2TVRKSRM.js";import"./chunk-HZBS7IKB.js";import"./chunk-R32TOWMH.js";import"./chunk-BXYXCO2T.js";import{Ua as s,Za as e,da as l,o}from"./chunk-SBRHEGZP.js";var w=`@if (viewData(); as view) {
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
`;var m="";var t=class{constructor(){this.viewData=l(n).rowtablesViewData}};t=o([s({selector:"awg-edition-rowtables",template:w,standalone:!1,styles:[m]})],t);var u=[{path:"",component:t,data:{title:"AWG Online Edition \u2013 Row tables"}}],c=[t],r=class{};r=o([e({imports:[i.forChild(u)],exports:[i]})],r);var b=class{};b=o([e({imports:[d,r],declarations:[c]})],b);export{b as EditionRowtablesModule};
