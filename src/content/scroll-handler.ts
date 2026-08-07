import type { UserConfig } from '../shared/types.js';

export function handleScroll(vertical: number, horizontal: number, config: UserConfig): void {
  if (vertical === 0 && horizontal === 0) return;

  if (config.scrollMode === 'page') {
    if (Math.abs(vertical) > 0.5) {
      const direction = Math.sign(vertical);
      window.scrollBy({ top: direction * window.innerHeight * 0.9, behavior: 'smooth' });
    }
    return;
  }

  window.scrollBy(horizontal * config.scrollSpeed, vertical * config.scrollSpeed);
}
