export type MskDialogDataAction = 'new' | 'edit' | 'view';

export interface MskDialogData<T> {
  action: MskDialogDataAction;
  item: T;
}
