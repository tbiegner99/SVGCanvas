import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {Canvas}  from '../src/components/Canvas';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Examples/Canvas',
  component: Canvas,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof Canvas>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Canvas> = (args:any) => <Canvas  />;

export const Primary = Template.bind({});
