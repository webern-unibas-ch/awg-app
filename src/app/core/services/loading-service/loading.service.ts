import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    /**
     * Public behaviour subject to handle loading status.
     */
    public isLoading$ = new BehaviorSubject(false);

    constructor() {}
}
