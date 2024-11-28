let selectedAxes = [3, 2]; // 默认使用右摇杆进行垂直和水平滚动
const deadzoneThreshold = 0.1; // 死区阈值

// 按钮状态标志，防止连续触发
const buttonStates = {
  y: false,
  b: false,
  home: false,
  lb: false,
  rb: false,
  lt: false,
  rt: false,
  x: false
};

function handleGamepadInput() {
  const gamepads = navigator.getGamepads();
  for (const gamepad of gamepads) {
    if (!gamepad) continue;

    const [verticalAxis, horizontalAxis] = selectedAxes;
    const verticalValue = gamepad.axes[verticalAxis];
    const horizontalValue = gamepad.axes[horizontalAxis];

    // 应用死区逻辑
    const adjustedVerticalValue = Math.abs(verticalValue) > deadzoneThreshold ? verticalValue : 0;
    const adjustedHorizontalValue = Math.abs(horizontalValue) > deadzoneThreshold ? horizontalValue : 0;

    // 根据调整后的值进行滚动
    window.scrollBy(adjustedHorizontalValue * 10, adjustedVerticalValue * 10);

    // Y 按钮（通常按钮索引为 3）
    if (gamepad.buttons[3].pressed && !buttonStates.y) {
      location.reload(); // 刷新页面
      buttonStates.y = true;
    } else if (!gamepad.buttons[3].pressed && buttonStates.y) {
      buttonStates.y = false;
    }

    // B 按钮（通常按钮索引为 1）
    if (gamepad.buttons[1].pressed && !buttonStates.b) {
      chrome.runtime.sendMessage({ type: 'close_tab' });
      buttonStates.b = true;
    } else if (!gamepad.buttons[1].pressed && buttonStates.b) {
      buttonStates.b = false;
    }

    // Home 按钮（通常按钮索引为 0）
    if (gamepad.buttons[0].pressed && !buttonStates.home) {
      chrome.runtime.sendMessage({ type: 'create_tab' });
      buttonStates.home = true;
    } else if (!gamepad.buttons[0].pressed && buttonStates.home) {
      buttonStates.home = false;
    }

    // 左扳机（LB）按钮（通常按钮索引为 4）
    if (gamepad.buttons[4].pressed && !buttonStates.lb) {
      chrome.runtime.sendMessage({ type: 'switch_to_previous_tab' });
      buttonStates.lb = true;
    } else if (!gamepad.buttons[4].pressed && buttonStates.lb) {
      buttonStates.lb = false;
    }

    // 右扳机（RB）按钮（通常按钮索引为 5）
    if (gamepad.buttons[5].pressed && !buttonStates.rb) {
      chrome.runtime.sendMessage({ type: 'switch_to_next_tab' });
      buttonStates.rb = true;
    } else if (!gamepad.buttons[5].pressed && buttonStates.rb) {
      buttonStates.rb = false;
    }

    // 左触发器（LT）按钮（通常按钮索引为 6）
    if (gamepad.buttons[6].pressed && !buttonStates.lt) {
      history.back(); // 后退历史记录
      buttonStates.lt = true;
    } else if (!gamepad.buttons[6].pressed && buttonStates.lt) {
      buttonStates.lt = false;
    }

    // 右触发器（RT）按钮（通常按钮索引为 7）
    if (gamepad.buttons[7].pressed && !buttonStates.rt) {
      history.forward(); // 前进历史记录
      buttonStates.rt = true;
    } else if (!gamepad.buttons[7].pressed && buttonStates.rt) {
      buttonStates.rt = false;
    }

    // X 按钮（通常按钮索引为 2）
    if (gamepad.buttons[2].pressed && !buttonStates.x) {
      chrome.runtime.sendMessage({ type: 'duplicate_tab' });
      buttonStates.x = true;
    } else if (!gamepad.buttons[2].pressed && buttonStates.x) {
      buttonStates.x = false;
    }
  }
}

// 设置游戏手柄输入响应时间（ms）
setInterval(handleGamepadInput, 100);

// 监听来自 background script 的消息以更新选中的轴
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'update_axes') {
    selectedAxes = request.axes;
    sendResponse({ status: 'updated' });
  }
});

// 监听游戏手柄连接事件
window.addEventListener('gamepadconnected', (e) => {
  console.log(`Gamepad connected: ${e.gamepad.id}`);
});

// 监听游戏手柄断开连接事件
window.addEventListener('gamepaddisconnected', (e) => {
  console.log(`Gamepad disconnected: ${e.gamepad.id}`);
});

// 发送消息给 background script 表示内容脚本已准备好
chrome.runtime.sendMessage({ type: 'content_ready' }, (response) => {});