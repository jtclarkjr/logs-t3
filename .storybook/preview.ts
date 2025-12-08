import type { Preview } from '@storybook/nextjs-vite'
import React from 'react'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#09090b' },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.backgrounds?.value === '#09090b'

      return React.createElement(
        'div',
        { className: isDark ? 'dark' : '' },
        React.createElement(
          'div',
          {
            className: 'bg-background text-foreground'
          },
          React.createElement(Story)
        )
      )
    },
  ],
};

export default preview;