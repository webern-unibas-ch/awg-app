import{n as d}from"./chunk-GH6M3DGK.js";import{M as n,R as c}from"./chunk-SITX6GFA.js";import{i as r}from"./chunk-NIZ3VBQH.js";import"./chunk-L5V7LSRL.js";import"./chunk-SA6FX6HI.js";import"./chunk-QRCBYPVB.js";import{Ua as l,Za as t,da as a,o}from"./chunk-XZAPBF32.js";var m=`@if (rowTablesData$ | async; as rowTablesData) {
    <div class="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
        @for (rowTable of rowTablesData?.rowTables; track rowTable) {
            <div class="col">
                <div class="card h-100 shadow">
                    <div class="card-body">
                        <h5 class="card-title" [ngClass]="{ 'text-muted': rowTable.disabled }">
                            Reihentabelle {{ rowTable.short }}
                        </h5>
                    </div>
                    <div class="card-footer text-end">
                        <a
                            [routerLink]="['../complex' + rowTable.route, 'sheets']"
                            [queryParams]="{ id: rowTable.id }"
                            class="btn btn-outline-info"
                            [ngClass]="{ disabled: rowTable.disabled }"
                            >Mehr ...
                        </a>
                    </div>
                </div>
            </div>
        }
    </div>
}
`;var w="";var e=class{constructor(){this._editionDataService=a(n),this._editionStateService=a(c)}ngOnInit(){this._editionStateService.updateIsRowTableView(!0),this.rowTablesData$=this._editionDataService.getEditionRowTablesData()}ngOnDestroy(){this._editionStateService.clearIsRowTableView()}};e=o([l({selector:"awg-edition-row-tables",template:m,standalone:!1,styles:[w]})],e);var R=[{path:"",component:e,data:{title:"AWG Online Edition \u2013 Row tables"}}],b=[e],i=class{};i=o([t({imports:[r.forChild(R)],exports:[r]})],i);var p=class{};p=o([t({imports:[d,i],declarations:[b]})],p);export{p as EditionRowTablesModule};
