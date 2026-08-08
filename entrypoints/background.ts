import { defineBackground } from 'wxt/utils/define-background';

import { initBackground } from '../src/background/index.js';

export default defineBackground({
  type: 'module',
  main() {
    initBackground();
  },
});
