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
    if (!chrome.runtime.lastError) {
      document.getElementById('status-message').textContent = 'Settings saved!';
    } else {
      document.getElementById('status-message').textContent = 'Failed to save settings.';
    }
  });

  chrome.runtime.sendMessage({ type: 'update_axes', axes: [verticalAxis, horizontalAxis] });
});

// Load saved settings on popup open
chrome.storage.local.get(['selectedAxes'], (result) => {
  if (result.selectedAxes) {
    const [verticalAxis, horizontalAxis] = result.selectedAxes;
    if (verticalAxis === 1 && horizontalAxis === 0) {
      document.getElementById('stick-selection').value = 'left';
    } else if (verticalAxis === 3 && horizontalAxis === 2) {
      document.getElementById('stick-selection').value = 'right';
    }
  }
});