let selectedAxes = [3, 2]; // 默认使用右摇杆控制
const cooldownTime = 300; // 冷却时间（毫秒）
let closeTabCooldown = 0;
let switchPreviousTabCooldown = 0;
let switchNextTabCooldown = 0;

// 从本地存储中加载选中的轴
chrome.storage.local.get(['selectedAxes'], (result) => {
  if (!chrome.runtime.lastError && result.selectedAxes) {
    selectedAxes = result.selectedAxes;
  }
  // 向所有标签页发送更新后的轴
  chrome.tabs.query({}, (tabs) => {
    if (!chrome.runtime.lastError) {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { type: 'update_axes', axes: selectedAxes });
      });
    }
  });
});

// 监听消息以更新选中的轴
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const now = Date.now();

  if (request.type === 'update_axes') {
    selectedAxes = request.axes;
    chrome.storage.local.set({ selectedAxes: selectedAxes }, () => {
      if (!chrome.runtime.lastError) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (!chrome.runtime.lastError) {
            tabs.forEach(tab => {
              chrome.tabs.sendMessage(tab.id, { type: 'update_axes', axes: selectedAxes });
            });
          }
        });
      }
    });
    sendResponse({ status: 'success' });
  } else if (request.type === 'close_tab') {
    if (now - closeTabCooldown > cooldownTime) {
      chrome.tabs.remove(sender.tab.id);
      closeTabCooldown = now;
    }
  } else if (request.type === 'create_tab') {
    chrome.tabs.create({});
  } else if (request.type === 'switch_to_previous_tab') {
    if (now - switchPreviousTabCooldown > cooldownTime) {
      switchToPreviousTab(sender.tab.id);
      switchPreviousTabCooldown = now;
    }
  } else if (request.type === 'switch_to_next_tab') {
    if (now - switchNextTabCooldown > cooldownTime) {
      switchToNextTab(sender.tab.id);
      switchNextTabCooldown = now;
    }
  } else if (request.type === 'duplicate_tab') {
    chrome.tabs.duplicate(sender.tab.id);
  }
});

// 标签页更新时重新发送选中的轴
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.startsWith('http')) {
    chrome.tabs.sendMessage(tabId, { type: 'update_axes', axes: selectedAxes });
  }
});

function switchToPreviousTab(currentTabId) {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTabId);
    if (currentIndex >= 0) {
      chrome.tabs.update(tabs[(currentIndex - 1 + tabs.length) % tabs.length].id, { active: true });
    }
  });
}

function switchToNextTab(currentTabId) {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTabId);
    if (currentIndex >= 0) {
      chrome.tabs.update(tabs[(currentIndex + 1) % tabs.length].id, { active: true });
    }
  });
}