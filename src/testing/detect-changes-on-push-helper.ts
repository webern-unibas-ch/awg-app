import { ComponentFixture } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';

/**
 * Test helper method: detectChangesOnPush.
 *
 * It provides a workaround to use fixture.detectChanges with ChangeDetection.onPush strategy
 * Cf. https://github.com/angular/angular/issues/12313#issuecomment-528536934
 *
 * Has to be used with await keyword inside async function:
 *
 * @example  it('... should do something', async () => {
 *              component.inputVariable = changedValue
 *              await detectChangesOnPush(fixture);
 *           });
 */
export async function detectChangesOnPush<T>(cf: ComponentFixture<T>) {
    const cd = cf.debugElement.injector.get<ChangeDetectorRef>(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ChangeDetectorRef as any
    );
    cd.detectChanges();
    await cf.whenStable();
}
