import type { StorybookConfig } from '@storybook/nextjs-vite'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding'
  ],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],
  async viteFinal(viteConfig) {
    if (viteConfig.resolve) {
      viteConfig.resolve.alias = {
        ...viteConfig.resolve.alias,
        '@': join(__dirname, '../src')
      }
    }
    return viteConfig
  }
}
export default config
