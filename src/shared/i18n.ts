export function localizePage(root: ParentNode = document): void {
  for (const element of root.querySelectorAll<HTMLElement>('[data-i18n]')) {
    const key = element.dataset.i18n;
    if (!key) continue;

    const translated = chrome.i18n.getMessage(key);
    if (translated) {
      element.textContent = translated;
    }
  }

  for (const element of root.querySelectorAll<HTMLElement>('[data-i18n-title]')) {
    const key = element.dataset.i18nTitle;
    if (!key) continue;

    const translated = chrome.i18n.getMessage(key);
    if (translated) {
      element.title = translated;
    }
  }
}
