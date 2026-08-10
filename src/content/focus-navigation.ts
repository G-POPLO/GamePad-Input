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

export function focusLeft(): void {
  focusDirection('left');
}

export function focusRight(): void {
  focusDirection('right');
}

function focusDirection(direction: 'left' | 'right'): void {
  const elements = getFocusableElements();
  if (elements.length === 0) return;

  if (focusIndex < 0 || focusIndex >= elements.length) {
    focusIndex = direction === 'right' ? 0 : elements.length - 1;
    (elements[focusIndex] as HTMLElement).focus();
    (elements[focusIndex] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const current = elements[focusIndex] as HTMLElement;
  const currentRect = current.getBoundingClientRect();
  const currentCenter = {
    x: currentRect.left + currentRect.width / 2,
    y: currentRect.top + currentRect.height / 2,
  };

  let bestIndex = -1;
  let bestScore = Infinity;

  for (let i = 0; i < elements.length; i++) {
    if (i === focusIndex) continue;

    const el = elements[i] as HTMLElement;
    const rect = el.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    const deltaX = direction === 'right' ? center.x - currentCenter.x : currentCenter.x - center.x;
    if (deltaX <= 0) continue;

    const deltaY = Math.abs(center.y - currentCenter.y);
    // Prefer elements on the same row; heavy vertical penalty keeps left/right movement predictable.
    const score = deltaX + deltaY * 3;

    if (score < bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  if (bestIndex >= 0) {
    focusIndex = bestIndex;
    (elements[focusIndex] as HTMLElement).focus();
    (elements[focusIndex] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

export function clickFocused(): void {
  const elements = getFocusableElements();
  if (focusIndex >= 0 && focusIndex < elements.length) {
    (elements[focusIndex] as HTMLElement).click();
  }
}
