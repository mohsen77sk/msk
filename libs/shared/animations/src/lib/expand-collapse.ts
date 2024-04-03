import { animate, state, style, transition, trigger } from '@angular/animations';
import { MskAnimationCurves, MskAnimationDurations } from './defaults';

// -----------------------------------------------------------------------------------------------------
// @ Expand / collapse
// -----------------------------------------------------------------------------------------------------
const expandCollapse = trigger('expandCollapse', [
  state(
    'void, collapsed',
    style({
      height: '0',
    })
  ),

  state('*, expanded', style('*')),

  // Prevent the transition if the state is false
  transition('void <=> false, collapsed <=> false, expanded <=> false', []),

  // Transition
  transition('void <=> *, collapsed <=> expanded', animate('{{timings}}'), {
    params: {
      timings: `${MskAnimationDurations.entering} ${MskAnimationCurves.deceleration}`,
    },
  }),
]);

export { expandCollapse };
