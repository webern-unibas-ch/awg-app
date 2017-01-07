import { Compiler, Component, Directive, NgModule, Input, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetaData } from '../../shared/metadata';

@Directive({
  selector: 'awg-sidenav-outlet'
})
export class SidenavOutlet {
    // @Input() html: string;
    // @Input() meta: MetaData;
    html = './sidenav/sidenav.component.html';

    constructor(
        private vcRef: ViewContainerRef,
        private compiler: Compiler
    ) {}

    ngOnChanges() {
        const html = this.html;
        if (!html) return;

        console.log(html);

        @Component({
            selector: 'awg-sidenav',
            templateUrl: html
        })
        class DynamicSidenavComponent  { }

        @NgModule({
            imports: [CommonModule],
            declarations: [DynamicSidenavComponent]
        })
        class DynamicSidenavModule {}

        this.compiler.compileModuleAndAllComponentsAsync(DynamicSidenavModule)
            .then(factory => {
                const compFactory = factory.componentFactories.find(x => x.componentType === DynamicSidenavComponent);
                const cmpRef = this.vcRef.createComponent(compFactory, 0);
            });
    }
}
