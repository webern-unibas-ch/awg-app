import{m as d,p as n}from"./chunk-IQ7DNEOM.js";import{Ca as o,Ra as r,T as s,Z as i,rb as l}from"./chunk-ER7ZVCIX.js";var c=`@if (rowTablesData$ | async; as rowTablesData) {
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
`;var m="";var e,t=(e=class{constructor(T,R){this.editionStateService=T,this.editionDataService=R}ngOnInit(){this.editionStateService.updateIsRowTableView(!0),this.rowTablesData$=this.editionDataService.getEditionRowTablesData()}ngOnDestroy(){this.editionStateService.clearIsRowTableView()}},e.ctorParameters=()=>[{type:n},{type:d}],e);t=o([s({selector:"awg-edition-row-tables",template:c,styles:[m]})],t);var _=[{path:"",component:t,data:{title:"AWG Online Edition \u2013 Row tables"}}],w=[t],a=class{};a=o([i({imports:[r.forChild(_)],exports:[r]})],a);var b=class{};b=o([i({imports:[l,a],declarations:[w]})],b);export{b as EditionRowTablesModule};
