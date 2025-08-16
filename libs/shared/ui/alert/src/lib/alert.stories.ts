import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MskAlertComponent } from './alert.component';

const meta: Meta<MskAlertComponent> = {
  title: 'Shared UI/Alert',
  component: MskAlertComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <msk-alert
        [type]="type"
        [appearance]="appearance"
        [dismissible]="dismissible"
        [showIcon]="showIcon"
      >
        <span mskAlertTitle>عنوان</span>
        این یک پیام نمونه است.
      </msk-alert>
    `,
  }),
};

export default meta;

type Story = StoryObj<MskAlertComponent>;

export const Basic: Story = {
  args: {
    type: 'basic',
    appearance: 'soft',
    dismissible: true,
    showIcon: false,
  } as any,
};