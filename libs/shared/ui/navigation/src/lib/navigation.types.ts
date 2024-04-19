import { IsActiveMatchOptions, Params, QueryParamsHandling } from '@angular/router';

export interface MskNavigationItem {
  id?: string;
  icon?: string;
  title?: string;
  type: 'aside' | 'basic' | 'collapsable' | 'divider' | 'group';
  hidden?: (item: MskNavigationItem) => boolean;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  link?: string;
  fragment?: string;
  preserveFragment?: boolean;
  queryParams?: Params | null;
  queryParamsHandling?: QueryParamsHandling | null;
  externalLink?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top' | string;
  exactMatch?: boolean;
  isActiveMatchOptions?: IsActiveMatchOptions;
  function?: (item: MskNavigationItem) => void;
  classes?: {
    icon?: string;
    title?: string;
    wrapper?: string;
  };
  badge?: {
    title?: string;
    classes?: string;
  };
  children?: MskNavigationItem[];
  meta?: any;
}

export type MskVerticalNavigationAppearance = 'default' | 'rail';

export type MskVerticalNavigationMode = 'over' | 'side';

export type MskVerticalNavigationPosition = 'start' | 'end';
