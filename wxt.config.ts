import { defineConfig } from 'wxt';

export default defineConfig({
  imports: false,
  manifest: {
    name: '__MSG_extensionName__',
    description: '__MSG_descriptionName__',
    version: '2.0.0',
    default_locale: 'zh_CN',
    icons: {
      48: 'icon.png',
    },
    permissions: ['storage', 'activeTab', 'tabs'],
  },
});
