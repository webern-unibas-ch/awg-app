import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ViewHandle, ViewHandleTypes } from './view-handle.model';

/**
 * The ViewHandleButtonGroup component.
 *
 * It contains the view handle button group that is
 * provided via the {@link SharedModule}.
 */
@Component({
    selector: 'awg-view-handle-button-group',
    templateUrl: './view-handle-button-group.component.html',
    styleUrls: ['./view-handle-button-group.component.scss'],
    standalone: false,
})
export class ViewHandleButtonGroupComponent implements OnInit, OnChanges, OnDestroy {
    /**
     * Input variable: viewHandles.
     *
     * It keeps the list of view handles.
     */
    @Input()
    viewHandles: ViewHandle[];

    /**
     * Input variable: selectedViewType.
     *
     * It keeps the selected view type.
     */
    @Input()
    selectedViewType: ViewHandleTypes;

    /**
     * Output variable: viewChangeRequest.
     *
     * It keeps an event emitter to inform about the switched view type.
     */
    @Output()
    viewChangeRequest: EventEmitter<ViewHandleTypes> = new EventEmitter();

    /**
     * Public variable: viewHandleControlForm.
     *
     * It keeps the reactive form group for the view handle.
     */
    viewHandleControlForm: UntypedFormGroup;

    /**
     * Private readonly variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private readonly _destroyed$: Subject<boolean> = new Subject<boolean>();

    /**
     * Private readonly injection variable: _formBuilder.
     *
     * It keeps the instance of the injected Angular FormBuilder.
     */
    private readonly _formBuilder = inject(UntypedFormBuilder);

    /**
     * Getter for the view handle control value.
     */
    get viewHandleControl(): UntypedFormControl {
        return this.viewHandleControlForm.get('viewHandleControl') as UntypedFormControl;
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {
        this._createFormGroup(this.selectedViewType);
    }

    /**
     * Angular life cycle hook: ngOnChanges.
     *
     * It checks for changes of the given input.
     *
     * @param {SimpleChanges} changes The changes of the input.
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes['selectedViewType'] && !changes['selectedViewType'].isFirstChange()) {
            this._createFormGroup(this.selectedViewType);
        }
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     */
    ngOnDestroy() {
        // Emit truthy value to end all subscriptions
        this._destroyed$.next(true);

        // Now let's also complete the subject itself
        this._destroyed$.complete();
    }

    /**
     * Private method: createFormGroup.
     *
     * It creates the view handle control form group
     * using the reactive FormBuilder with a formGroup
     * and a view handle control.
     *
     * @param {ViewHandleTypes} view The given view type.
     *
     * @returns {void} Creates the view handle control form.
     */
    private _createFormGroup(view: ViewHandleTypes): void {
        this.viewHandleControlForm = this._formBuilder.group({
            viewHandleControl: view,
        });

        this._listenToUserInputChange();
    }

    /**
     * Private method: listenToUserInputChange.
     *
     * It listens to the user's input changes
     * in the view control and triggers the
     * onViewChange method with the new view type.
     *
     * @returns {void} Listens to changing view type.
     */
    private _listenToUserInputChange(): void {
        this.viewHandleControl.valueChanges.pipe(takeUntil(this._destroyed$)).subscribe({
            next: (view: ViewHandleTypes) => {
                this._onViewChange(view);
            },
        });
    }

    /**
     * Private method: onViewChange.
     *
     * It switches the view handle type according to the given view type and
     * emits a request to the outer components.
     *
     * @param {ViewHandleTypes} view The given view type.
     *
     * @returns {void} Emits the view to the view change request.
     */
    private _onViewChange(view: ViewHandleTypes): void {
        if (!view) {
            return;
        }
        this.viewChangeRequest.emit(view);
    }
}
