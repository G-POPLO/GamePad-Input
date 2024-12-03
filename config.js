// config.js - 用于config.html页面的文本更新

document.addEventListener('DOMContentLoaded', (event) => {
  // 页面加载完成后调用updateText函数
  updateText();
});

function updateText(language = null) {
  if (!language) {
    // 如果没有传入语言参数，则从本地存储中获取
    chrome.storage.local.get(['language'], (result) => {
      const lang = result.language || navigator.language || 'en';
      updateText(lang); // 使用获取到的语言进行更新
    });
    return;
  }

  // 获取所有带有data-i18n属性的元素
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (key) {
      // 使用chrome.i18n.getMessage来获取翻译后的文本
      const translatedText = chrome.i18n.getMessage(key) || key; // 如果没有找到翻译，则显示键名
      element.textContent = translatedText;
    }
  });
}