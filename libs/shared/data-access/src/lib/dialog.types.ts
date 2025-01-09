import { WritableSignal } from '@angular/core';

export type MskDialogDataAction = 'new' | 'edit' | 'view';

export interface MskDialogData<T> {
  action: WritableSignal<MskDialogDataAction>;
  item: WritableSignal<T>;
}
