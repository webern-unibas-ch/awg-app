import{D as a,Na as r,Pb as d,S as l,Tb as n,X as t,j as o,qc as c}from"./chunk-2UI2LAMO.js";var m=`@if (rowTablesData$ | async; as rowTablesData) {
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
`;var w="";var e=class{constructor(){this._editionDataService=a(d),this._editionStateService=a(n)}ngOnInit(){this._editionStateService.updateIsRowTableView(!0),this.rowTablesData$=this._editionDataService.getEditionRowTablesData()}ngOnDestroy(){this._editionStateService.clearIsRowTableView()}};e=o([l({selector:"awg-edition-row-tables",template:m,standalone:!1,styles:[w]})],e);var R=[{path:"",component:e,data:{title:"AWG Online Edition \u2013 Row tables"}}],b=[e],i=class{};i=o([t({imports:[r.forChild(R)],exports:[r]})],i);var p=class{};p=o([t({imports:[c,i],declarations:[b]})],p);export{p as EditionRowTablesModule};
