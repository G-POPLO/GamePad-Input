document.getElementById('language-selection').addEventListener('change', (event) => {
  const language = event.target.value;
  chrome.storage.local.set({ language: language }, () => {
    // 更新页面上的文本
    updateText(language);
  });
});

function updateText(language) {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (key) {
      element.textContent = chrome.i18n.getMessage(key);
    }
  });
}

// 初始化时加载存储中的语言偏好
chrome.storage.local.get(['language'], (result) => {
  const language = result.language || navigator.language || 'en';
  updateText(language);
});

// 其他原有的功能代码...

document.getElementById('settings-button').addEventListener('click', () => {
  chrome.tabs.create({ url: 'config.html' });
});

document.getElementById('save-settings').addEventListener('click', () => {
  const stickSelection = document.getElementById('stick-selection').value;
  let verticalAxis, horizontalAxis;

  if (stickSelection === 'left') {
    verticalAxis = 1; // Left Stick Vertical
    horizontalAxis = 0; // Left Stick Horizontal
  } else if (stickSelection === 'right') {
    verticalAxis = 3; // Right Stick Vertical
    horizontalAxis = 2; // Right Stick Horizontal
  }

  chrome.storage.local.set({ selectedAxes: [verticalAxis, horizontalAxis] }, () => {
    if (chrome.runtime.lastError) {
      console.error('Failed to save settings:', chrome.runtime.lastError);
      document.getElementById('status-message').textContent = chrome.i18n.getMessage('Failedtosavesettings') || 'Failed to save settings';
    } else {
      // 更新所有标签页的轴设置
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { type: 'update_axes', axes: [verticalAxis, horizontalAxis] });
        });
      });

      // 显示成功信息
      document.getElementById('status-message').textContent = chrome.i18n.getMessage('Settingssaved') || 'Settings saved';
    }
  });

  // 发送消息到后台脚本以更新选中的轴
  chrome.runtime.sendMessage({ type: 'update_axes', axes: [verticalAxis, horizontalAxis] });
});