import { defineContentScript } from 'wxt/utils/define-content-script';

import { initContentScript } from '../src/content/index.js';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  main() {
    initContentScript();
  },
});
