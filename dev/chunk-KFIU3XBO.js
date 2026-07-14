import{n as d}from"./chunk-RO6CATOM.js";import{M as n,R as c}from"./chunk-AE3GZLXJ.js";import{i as r}from"./chunk-H5BVFVMC.js";import"./chunk-7XMPO7U6.js";import"./chunk-Q3P4UROH.js";import"./chunk-XZOSTTUP.js";import{Ua as l,Za as t,da as a,o}from"./chunk-R2QEVINF.js";var m=`@if (rowTablesData$ | async; as rowTablesData) {
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
