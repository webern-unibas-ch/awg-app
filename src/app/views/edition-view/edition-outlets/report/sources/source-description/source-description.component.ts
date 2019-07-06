import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'awg-source-description',
    templateUrl: './source-description.component.html',
    styleUrls: ['./source-description.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SourceDescriptionComponent implements OnInit {
    @Input()
    showDescriptionPanel: boolean;
    @Output()
    toggleDescriptionPanelRequest: EventEmitter<boolean> = new EventEmitter();
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();

    constructor() {}

    ngOnInit() {}

    openModal(identifier: string) {
        this.openModalRequest.emit(identifier);
    }

    togglePanel(): void {
        this.toggleDescriptionPanelRequest.emit(this.showDescriptionPanel);
    }
}
