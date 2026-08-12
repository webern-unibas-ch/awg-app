import{a as n}from"./chunk-M5JMVULY.js";import"./chunk-HB5Y7OLI.js";import{o as d}from"./chunk-BBVY5GBP.js";import"./chunk-6MWZT25Z.js";import{i}from"./chunk-FDGDTRAO.js";import"./chunk-4AA6WLPA.js";import"./chunk-J56ASIZO.js";import"./chunk-TG7NDEMI.js";import{Ua as s,Za as e,da as l,o}from"./chunk-ZAY6JZAK.js";var w=`@if (viewData(); as view) {
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
