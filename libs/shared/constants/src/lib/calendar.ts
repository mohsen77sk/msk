export type MskAvailableCalendarTypes = 'gregory' | 'persian';

export interface MskCalendarConfig {
  id: MskAvailableCalendarTypes;
  label: string;
  intlCalendar: string;
}

export const availableCalendars: MskCalendarConfig[] = [
  {
    id: 'gregory',
    label: 'calendars.gregory',
    intlCalendar: 'gregory',
  },
  {
    id: 'persian',
    label: 'calendars.persian',
    intlCalendar: 'persian',
  },
];

// Lookup table
export const CALENDAR_BY_ID = availableCalendars.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {} as Record<MskAvailableCalendarTypes, MskCalendarConfig>,
);
