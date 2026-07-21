import{B as q,D as f,O as W}from"./chunk-JR4IRFRD.js";import{f as T,g as N}from"./chunk-KULUVZ47.js";import{A as H,a as U,j as G,o as M,p as A,s as V}from"./chunk-RA2XRMDM.js";import{Ua as o,Wa as s,bb as m,da as O,fb as a,na as L,o as r,va as I,xa as i}from"./chunk-FMNS4ZKO.js";var X=`@if (statisticsData(); as statisticsData) {
    <div class="awg-statistics-view">
        <awg-scroll-to-top-button />

        <div class="container-fluid">
            <div class="row">
                <main class="col">
                    <!-- Statistics Header -->
                    <header
                        class="awg-statistics-view-header awg-jumbotron mb-4 p-3 pt-4 text-center shadow border rounded-3">
                        <h2>Statistics</h2>
                        <p class="lead text-muted">
                            Overview of key metrics in the online edition of the Anton Webern Gesamtausgabe
                        </p>
                    </header>

                    <awg-statistics-summary [summaryData]="summaryData()" />

                    <awg-statistics-overall-progress [overallProgressData]="overallProgressData()" />

                    <awg-statistics-complex-breakdown [complexBreakdownData]="complexBreakdownData()" />

                    <awg-statistics-series-breakdown [seriesBreakdownData]="statisticsData.seriesBreakdown" />
                </main>
            </div>
        </div>
    </div>
} @else {
    <p>No statistics data available.</p>
}
`;var z=`.awg-statistics-view{padding:2rem 0}.awg-statistics-view .awg-statistics-view-header{text-align:center;margin-bottom:3rem}.awg-statistics-view .awg-statistics-view-header h2{color:#333;font-weight:600}.awg-statistics-view .awg-statistics-view-header .lead{font-size:1.15rem}.awg-statistics-view .table th{font-weight:600;color:#495057;border-top:none}.awg-statistics-view .table td{vertical-align:middle}.awg-statistics-view .table .table-primary{background-color:#0d6efd1a}.awg-statistics-view .table .table-primary td{border-top:2px solid #dee2e6}.awg-statistics-view .table .table-light td{border-top:1px solid #f8f9fa;font-size:.9rem}.awg-statistics-view .table .badge{font-size:.75rem}.awg-statistics-view .bg-success{background-color:#28a745!important}.awg-statistics-view .bg-warning{background-color:#ffc107!important}.awg-statistics-view .bg-danger{background-color:#dc3545!important}.awg-statistics-view .bg-primary{background-color:#007bff!important}.awg-statistics-view .bg-secondary{background-color:#6c757d!important}.awg-statistics-view .bg-info{background-color:#17a2b8!important}@media(max-width:768px){.awg-statistics-view{padding:1rem 0}.awg-statistics-view .awg-statistics-view-header{margin-bottom:2rem}.awg-statistics-view .awg-statistics-view-header h2{font-size:1.75rem}.awg-statistics-view .table-responsive{font-size:.9rem}}@media(max-width:576px){.awg-statistics-view .d-flex.justify-content-between{flex-direction:column;align-items:flex-start}.awg-statistics-view .d-flex.justify-content-between .text-nowrap{margin-top:.25rem}}
`;var b=class{constructor(t={}){this.opus=t.opus??0,this.mnr=t.mnr??0,this.mnrX=t.mnrX??0}},w=class{constructor(){this.totalComplexes=0,this.activeComplexes=0,this.progressRate=0,this.complexBreakdown=new b,this.activeComplexBreakdown=new b}registerComplex(t,e){this.totalComplexes++,this.complexBreakdown[t]++,e&&(this.activeComplexes++,this.activeComplexBreakdown[t]++)}},v=class extends w{constructor(t,e){super(),this.section=t,this.disabled=e}},C=class extends w{constructor(t){super(),this.totalSections=0,this.activeSections=0,this.sectionBreakdown=[],this.series=t}},y=class extends w{constructor(){super(),this.totalSeries=0,this.activeSeries=0,this.totalSections=0,this.activeSections=0,this.seriesBreakdown=[]}};var S=class{getStatisticsFromOutline(t){let e=new y;t.forEach(n=>{e.totalSeries++;let l=new C(n.series.short);n.sections.forEach(g=>{e.totalSections++,l.totalSections++;let h=new v(g.section.short,g.disabled);g.disabled||(e.activeSections++,l.activeSections++),this._processComplexes(e,l,h,g.content.complexTypes),h.progressRate=this._calculateProgressRate(h.activeComplexes,h.totalComplexes),l.sectionBreakdown.push(h)}),(l.activeSections>0||l.activeComplexes>0)&&e.activeSeries++;let P=l.sectionBreakdown.map(g=>g.progressRate);l.progressRate=this._calculateCombinedProgressRate(P),e.seriesBreakdown.push(l)});let c=e.seriesBreakdown.map(n=>n.progressRate);return e.progressRate=this._calculateCombinedProgressRate(c),e}_calculateProgressRate(t,e){return e>0?Math.round(t/e*100):0}_calculateCombinedProgressRate(t){if(!t.length)return 0;let e=t.reduce((c,n)=>c+n,0);return Math.round(e/t.length)}_incrementComplexCounters(t,e,c){t.forEach(n=>n.registerComplex(e,c))}_isMnrX(t){let e=t?.complex?.complexId?.route;return typeof e=="string"&&e.startsWith("/mx")}_processComplexes(t,e,c,n){n&&(n.opus?.forEach(l=>{this._incrementComplexCounters([t,e,c],"opus",!l.disabled)}),n.mnr?.forEach(l=>{let P=this._isMnrX(l)?"mnrX":"mnr";this._incrementComplexCounters([t,e,c],P,!l.disabled)}))}};S=r([I({providedIn:"root"})],S);var j=`<div class="row mb-4">
    <div class="col-md-6">
        <div class="awg-statistics-distribution-card awg-statistics-card card h-100">
            <div class="card-header">
                <h4 class="card-title mb-0">Complex Types Distribution</h4>
            </div>
            <div class="card-body">
                @for (item of COMPLEX_BREAKDOWN_ITEMS; track item.key) {
                    <div class="mb-3">
                        <awg-statistics-progress-bar
                            [config]="getProgressBarConfig(item.key, 'absolute')"
                            [headerLabel]="item.baseLabel + ' Complexes'"
                            [showPercentageLabel]="false"
                            [customType]="item.colorType"
                            [useCustomTypeOnly]="true" />
                    </div>
                }
            </div>
        </div>
    </div>

    <div class="col-md-6">
        <div class="awg-statistics-activity-card awg-statistics-card card h-100">
            <div class="card-header">
                <h4 class="card-title mb-0">Active Complex Types</h4>
            </div>
            <div class="card-body">
                @for (item of COMPLEX_BREAKDOWN_ITEMS; track item.key) {
                    <div class="mb-3">
                        <awg-statistics-progress-bar
                            [config]="getProgressBarConfig(item.key, 'ratio')"
                            [headerLabel]="'Active ' + item.baseLabel + (item.key !== 'opus' ? 's' : '')"
                            [showPercentageLabel]="false" />
                    </div>
                }
            </div>
        </div>
    </div>
</div>
`;var F="";var K=`@let hLabel = headerLabel();
@let hasHeaderVal = hasHeaderValue();
@let width = progressBarWidth();

@if (hLabel) {
    <div
        class="awg-statistics-progress-header mb-1"
        [class.d-flex]="hasHeaderVal"
        [class.justify-content-between]="hasHeaderVal">
        <span>{{ hLabel }}</span>

        @if (hasHeaderVal) {
            <span>{{ progressHeaderValue() }}</span>
        }
    </div>
}

<div class="awg-statistics-progress-container d-flex align-items-center">
    <ngb-progressbar
        class="flex-grow-1"
        [class.me-2]="showPercentageLabel()"
        [type]="progressBarColorType()"
        [height]="height()"
        [value]="width"
        [ariaLabel]="hLabel || 'Progress Bar'" />
    @if (showPercentageLabel()) {
        <small
            class="text-nowrap awg-statistics-progress-label"
            [class.fw-bold]="boldPercentageLabel()"
            [class.text-muted]="width === 0"
            >{{ width }}%</small
        >
    }
</div>
`;var $=`.progress{background-color:#e9ecef;border-radius:.375rem}.progress .progress-bar{transition:width .6s ease}
`;var p=class{constructor(){this.config=a.required(),this.headerLabel=a(),this.height=a("15px"),this.showPercentageLabel=a(!0),this.boldPercentageLabel=a(!1),this.customType=a(""),this.useCustomTypeOnly=a(!1),this.progressBarColorType=m(()=>{if(this.useCustomTypeOnly())return this.customType()||"light";let t=this.progressBarWidth();return t>=80?"success":t>=50?"warning":t>0?"danger":"light"}),this.progressBarWidth=m(()=>{let t=this.config(),e=0;switch(t.mode){case"percentage":e=t.percentage??0;break;case"absolute":case"ratio":t.total!==0&&(e=Math.round(t.active/t.total*100));break}return Number.isNaN(e)?0:Math.max(0,Math.min(100,e))}),this.progressHeaderValue=m(()=>{let t=this.config();return t.mode==="percentage"?"":t.mode==="ratio"?`${t.active} / ${t.total}`:`${t.active}`}),this.hasHeaderValue=m(()=>this.progressHeaderValue()!=="")}static{this.propDecorators={config:[{type:s,args:[{isSignal:!0,alias:"config",required:!0,transform:void 0}]}],headerLabel:[{type:s,args:[{isSignal:!0,alias:"headerLabel",required:!1,transform:void 0}]}],height:[{type:s,args:[{isSignal:!0,alias:"height",required:!1,transform:void 0}]}],showPercentageLabel:[{type:s,args:[{isSignal:!0,alias:"showPercentageLabel",required:!1,transform:void 0}]}],boldPercentageLabel:[{type:s,args:[{isSignal:!0,alias:"boldPercentageLabel",required:!1,transform:void 0}]}],customType:[{type:s,args:[{isSignal:!0,alias:"customType",required:!1,transform:void 0}]}],useCustomTypeOnly:[{type:s,args:[{isSignal:!0,alias:"useCustomTypeOnly",required:!1,transform:void 0}]}]}}};p=r([o({selector:"awg-statistics-progress-bar",template:K,changeDetection:i.OnPush,imports:[q],styles:[$]})],p);var x=class{constructor(){this.complexBreakdownData=a.required(),this.COMPLEX_BREAKDOWN_ITEMS=[{key:"opus",baseLabel:"Opus",colorType:"primary"},{key:"mnr",baseLabel:"M-number",colorType:"secondary"},{key:"mnrX",baseLabel:"M*-number",colorType:"info"}]}getProgressBarConfig(t,e){let c=this.complexBreakdownData();return c?e==="ratio"?{mode:"ratio",active:c.activeComplexBreakdown[t],total:c.complexBreakdown[t]}:{mode:"absolute",active:c.complexBreakdown[t],total:c.totalComplexes}:{mode:"absolute",active:0,total:0}}static{this.propDecorators={complexBreakdownData:[{type:s,args:[{isSignal:!0,alias:"complexBreakdownData",required:!0,transform:void 0}]}]}}};x=r([o({selector:"awg-statistics-complex-breakdown",template:j,changeDetection:i.OnPush,imports:[p],styles:[F]})],x);var J=`@if (overallProgressData(); as overallProgress) {
    <div class="awg-statistics-overall-progress awg-statistics-card card mb-4">
        <div class="card-header">
            <h3 class="card-title mb-0">Overall Progress</h3>
        </div>
        <div class="card-body">
            <awg-statistics-progress-bar
                [config]="{ mode: 'percentage', percentage: overallProgress.progressRate }"
                [headerLabel]="'Edition Completion'"
                [height]="'20px'"
                [showPercentageLabel]="true"
                [boldPercentageLabel]="true" />
            <div class="text-center text-muted small mt-2">
                {{ overallProgress.activeComplexes }} of {{ overallProgress.totalComplexes }} currently enabled edition
                complexes active
            </div>
        </div>
    </div>
}
`;var Q="";var _=class{constructor(){this.overallProgressData=a.required()}static{this.propDecorators={overallProgressData:[{type:s,args:[{isSignal:!0,alias:"overallProgressData",required:!0,transform:void 0}]}]}}};_=r([o({selector:"awg-statistics-overall-progress",template:J,changeDetection:i.OnPush,imports:[p],styles:[Q]})],_);var Y=`<div class="awg-statistics-edition-breakdown awg-statistics-card card">
    <div class="card-header">
        <h3 class="card-title mb-0">Series & Sections Breakdown</h3>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table" style="width: 100%">
                <thead>
                    <tr>
                        <th scope="col" rowspan="2" class="text-center align-bottom" style="width: 15%">
                            Series / Section
                        </th>
                        <th scope="colgroup" colspan="3" class="text-center table-light border-bottom-0">Complexes</th>
                        <th scope="col" rowspan="2" class="text-center align-bottom" style="width: 50%">Progress</th>
                    </tr>
                    <tr>
                        <th scope="col" class="text-center">Total</th>
                        <th scope="col" class="text-center">Distribution</th>
                        <th scope="col" class="text-center">Active</th>
                    </tr>
                </thead>
                <tbody>
                    @for (series of seriesBreakdownData(); track series.series) {
                        <!-- Series Row -->
                        <tr class="awg-statistics-series-breakdown table-primary">
                            <td>
                                <strong [class.text-muted]="series.activeSections === 0"
                                    >Series {{ series.series }}</strong
                                >
                                <small class="text-muted ms-2"
                                    >({{ series.activeSections }} active
                                    {{ series.activeSections === 1 ? 'section' : 'sections' }})</small
                                >
                            </td>
                            <td class="text-center" [class.text-muted]="series.activeSections === 0">
                                <strong>{{ series.totalComplexes }}</strong>
                            </td>
                            <td class="text-center">
                                @if (series.totalComplexes > 0) {
                                    <awg-statistics-breakdown-badge [breakdown]="series.activeComplexBreakdown" />
                                }
                            </td>
                            <td class="text-center" [class.text-muted]="series.activeSections === 0">
                                <strong>{{ series.activeComplexes }}</strong>
                            </td>
                            <td>
                                <awg-statistics-progress-bar
                                    [config]="{
                                        mode: 'percentage',
                                        percentage: series.progressRate,
                                    }"
                                    [height]="'20px'"
                                    [boldPercentageLabel]="true" />
                            </td>
                        </tr>
                        <!-- Section Rows -->
                        @for (section of series.sectionBreakdown; track section.section) {
                            <tr class="awg-statistics-section-breakdown table-light">
                                <td class="ps-4">
                                    <span class="text-muted">\u2514 </span>
                                    <a
                                        [class.text-muted]="section.disabled"
                                        [class.pe-none]="section.disabled"
                                        [style.text-decoration]="section.disabled ? 'none' : null"
                                        [routerLink]="
                                            section.disabled
                                                ? null
                                                : [
                                                      ROUTES.edition.route,
                                                      ROUTES.series.route,
                                                      series.series.length,
                                                      ROUTES.section.route,
                                                      section.section,
                                                  ]
                                        "
                                        routerLinkActive="active">
                                        Section {{ series.series }}/{{ section.section }}
                                    </a>
                                </td>
                                <td class="text-center" [class.text-muted]="section.disabled">
                                    {{ section.totalComplexes }}
                                </td>
                                <td class="text-center">
                                    @if (section.totalComplexes > 0) {
                                        <awg-statistics-breakdown-badge [breakdown]="section.activeComplexBreakdown" />
                                    }
                                </td>
                                <td class="text-center" [class.text-muted]="section.disabled">
                                    {{ section.activeComplexes }}
                                </td>
                                <td>
                                    <awg-statistics-progress-bar
                                        [config]="{
                                            mode: 'percentage',
                                            percentage: section.totalComplexes > 0 ? section.progressRate : 0,
                                        }" />
                                </td>
                            </tr>
                        }
                    }
                </tbody>
            </table>
        </div>
    </div>
</div>
`;var Z="";var tt=`<div class="awg-statistics-breakdown-badge-container" [class]="containerClasses()">
    @for (badge of displayedBadges(); track badge.label) {
        <span
            class="awg-statistics-breakdown-badge badge me-1"
            [class.bg-primary]="badge.type === 'primary'"
            [class.bg-secondary]="badge.type === 'secondary'"
            [class.bg-info]="badge.type === 'info'">
            {{ badge.label }}: {{ badge.val }}
        </span>
    }
</div>
`;var et=`.badge{font-size:.75em}.text-muted .badge{opacity:.9}
`;var k=class{constructor(){this.breakdown=a.required(),this.containerClasses=a("small text-muted"),this.showEmptyBadges=a(!1),this.displayedBadges=m(()=>{let t=this.breakdown(),e=this.showEmptyBadges();return[{label:"Op",val:t.opus,type:"primary"},{label:"M",val:t.mnr,type:"secondary"},{label:"M*",val:t.mnrX,type:"info"}].filter(n=>e||n.val>0)})}static{this.propDecorators={breakdown:[{type:s,args:[{isSignal:!0,alias:"breakdown",required:!0,transform:void 0}]}],containerClasses:[{type:s,args:[{isSignal:!0,alias:"containerClasses",required:!1,transform:void 0}]}],showEmptyBadges:[{type:s,args:[{isSignal:!0,alias:"showEmptyBadges",required:!1,transform:void 0}]}]}}};k=r([o({selector:"awg-statistics-breakdown-badge",template:tt,changeDetection:i.OnPush,styles:[et]})],k);var B=class{constructor(){this.seriesBreakdownData=a.required(),this.ROUTES={edition:f.EDITION,series:f.SERIES,section:f.SECTION}}static{this.propDecorators={seriesBreakdownData:[{type:s,args:[{isSignal:!0,alias:"seriesBreakdownData",required:!0,transform:void 0}]}]}}};B=r([o({selector:"awg-statistics-series-breakdown",template:Y,changeDetection:i.OnPush,imports:[T,N,k,p],styles:[Z]})],B);var st=`@if (summaryCards(); as summaryCards) {
    <div class="awg-statistics-summary row mb-4">
        @for (card of summaryCards; track card.title) {
            <div class="col-md-3 mb-3">
                <awg-statistics-summary-card
                    [title]="card.title"
                    [value]="card.value"
                    [icon]="card.icon"
                    [bgClass]="card.bgClass" />
            </div>
        }
    </div>
}
`;var at="";var rt=`<div class="awg-statistics-card awg-statistics-summary-card card text-white" [class]="bgClass()">
    <div class="card-body">
        <div class="d-flex justify-content-between">
            <div class="awg-statistics-summary-card-content">
                <h4 class="mb-0">{{ value() }}</h4>
                <small>{{ title() }}</small>
            </div>
            <div class="awg-statistics-summary-card-icon align-self-center">
                <fa-icon [icon]="icon()" class="fa-2x opacity-75" aria-hidden="true" />
            </div>
        </div>
    </div>
</div>
`;var it=`.awg-statistics-summary-card .card-body h4{font-weight:600}.awg-statistics-summary-card .card-body small{font-size:.875rem}.opacity-75{opacity:.75}@media(max-width:768px){.card-body{padding:1rem}.card-body h4{font-size:1.5rem}}
`;var E=class{constructor(){this.title=a.required(),this.value=a.required(),this.icon=a.required(),this.bgClass=a.required()}static{this.propDecorators={title:[{type:s,args:[{isSignal:!0,alias:"title",required:!0,transform:void 0}]}],value:[{type:s,args:[{isSignal:!0,alias:"value",required:!0,transform:void 0}]}],icon:[{type:s,args:[{isSignal:!0,alias:"icon",required:!0,transform:void 0}]}],bgClass:[{type:s,args:[{isSignal:!0,alias:"bgClass",required:!0,transform:void 0}]}]}}};E=r([o({selector:"awg-statistics-summary-card",template:rt,changeDetection:i.OnPush,imports:[U],styles:[it]})],E);var D=class{constructor(){this.summaryData=a.required(),this.summaryCards=m(()=>{let t=this.summaryData();return[{title:"Active Series",value:t.activeSeries,icon:A,bgClass:"bg-primary"},{title:"Active Sections",value:t.activeSections,icon:G,bgClass:"bg-info"},{title:"Total Complexes",value:t.totalComplexes,icon:V,bgClass:"bg-secondary"},{title:"Active Complexes",value:t.activeComplexes,icon:M,bgClass:"bg-success"}]})}static{this.propDecorators={summaryData:[{type:s,args:[{isSignal:!0,alias:"summaryData",required:!0,transform:void 0}]}]}}};D=r([o({selector:"awg-statistics-summary",template:st,changeDetection:i.OnPush,imports:[E],styles:[at]})],D);var R=class{constructor(){this.statisticsData=L(O(S).getStatisticsFromOutline(W.getEditionOutline())),this.complexBreakdownData=m(()=>{let t=this.statisticsData();return t?{activeComplexBreakdown:t.activeComplexBreakdown,complexBreakdown:t.complexBreakdown,totalComplexes:t.totalComplexes}:null}),this.overallProgressData=m(()=>{let t=this.statisticsData();return t?{progressRate:t.progressRate,activeComplexes:t.activeComplexes,totalComplexes:t.totalComplexes}:null}),this.summaryData=m(()=>{let t=this.statisticsData();return t?{activeSeries:t.activeSeries,activeSections:t.activeSections,activeComplexes:t.activeComplexes,totalComplexes:t.totalComplexes}:null})}};R=r([o({selector:"awg-statistics-view",template:X,changeDetection:i.OnPush,imports:[x,_,B,D,H],styles:[z]})],R);var ss=[{path:"",component:R,data:{title:"AWG Online Edition \u2013 Statistics"}}];export{ss as STATISTICS_VIEW_ROUTES};
