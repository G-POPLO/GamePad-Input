const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

let focusIndex = -1;

function getFocusableElements(): Element[] {
  return Array.from(document.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => {
    const htmlEl = el as HTMLElement;
    return htmlEl.offsetParent !== null;
  });
}

export function focusNext(): void {
  const elements = getFocusableElements();
  if (elements.length === 0) return;

  focusIndex = (focusIndex + 1) % elements.length;
  (elements[focusIndex] as HTMLElement).focus();
  (elements[focusIndex] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function focusPrevious(): void {
  const elements = getFocusableElements();
  if (elements.length === 0) return;

  focusIndex = (focusIndex - 1 + elements.length) % elements.length;
  (elements[focusIndex] as HTMLElement).focus();
  (elements[focusIndex] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function clickFocused(): void {
  const elements = getFocusableElements();
  if (focusIndex >= 0 && focusIndex < elements.length) {
    (elements[focusIndex] as HTMLElement).click();
  }
}
