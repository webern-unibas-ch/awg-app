import{a as d,m as n}from"./chunk-UQEBJ7ZL.js";import"./chunk-K2W35YIK.js";import"./chunk-XXXS47UC.js";import{Oa as a,R as s,X as i,l as o,ob as l}from"./chunk-EOZI3YUX.js";var c=`@if (rowTablesData$ | async; as rowTablesData) {
    <div class="row row-cols-1 row-cols-md-3 row-cols-xl-5 g-4">
        @for (rowTable of rowTablesData?.rowTables; track rowTable) {
            <div class="col">
                <div class="card h-100">
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
`;var m="";var e,t=(e=class{constructor(T,R){this.editionService=T,this.editionDataService=R}ngOnInit(){this.editionService.updateIsRowTableView(!0),this.rowTablesData$=this.editionDataService.getEditionRowTablesData()}ngOnDestroy(){this.editionService.clearIsRowTableView()}},e.ctorParameters=()=>[{type:n},{type:d}],e);t=o([s({selector:"awg-edition-row-tables",template:c,styles:[m]})],t);var _=[{path:"",component:t,data:{title:"AWG Online Edition \u2013 Row tables"}}],b=[t],r=class{};r=o([i({imports:[a.forChild(_)],exports:[a]})],r);var w=class{};w=o([i({imports:[l,r],declarations:[b]})],w);export{w as EditionRowTablesModule};
