import { defineConfig } from 'wxt';

export default defineConfig({
  imports: false,
  manifestVersion: 3,
  vite: () => ({
    build: {
      // Disable module preloads for content scripts to avoid Chrome MV3
      // "cross-world extension resource mismatch" warnings caused by
      // preloading isolated-world chunks from the page world.
      modulePreload: false,
    },
  }),
  manifest: ({ browser }) => ({
    name: '__MSG_extensionName__',
    description: '__MSG_descriptionName__',
    version: '2.0.0',
    default_locale: 'zh_CN',
    icons: {
      512: 'icon.png',
    },
    permissions: ['storage', 'activeTab', 'tabs'],
    ...(browser === 'firefox' && {
      browser_specific_settings: {
        gecko: {
          id: 'PoploC@addons.com',
          data_collection_permissions: {
            required: ['none'],
          },
        },
      },
    }),
  }),
});
