(function() {
    const scrollSpeed = 10; // 滚动速度
    const deadZone = 0.1; // 死区阈值
    let selectedStick = 'left'; // 默认选择左摇杆

    // 获取用户选择的摇杆
    document.getElementById('stickSelection').addEventListener('change', (event) => {
        selectedStick = event.target.value;
    });

    function handleGamepad() {
        if ('getGamepads' in navigator) {
            const gamepads = navigator.getGamepads();
            for (let i = 0; i < gamepads.length; i++) {
                const gamepad = gamepads[i];
                if (gamepad) {
                    let yAxis;
                    if (selectedStick === 'left') {
                        // 左摇杆的垂直轴通常是第1个轴
                        yAxis = gamepad.axes[1];
                    } else if (selectedStick === 'right') {
                        // 右摇杆的垂直轴通常是第3个轴
                        yAxis = gamepad.axes[3];
                    }
                    if (yAxis !== undefined && Math.abs(yAxis) > deadZone) {
                        window.scrollBy(0, yAxis * scrollSpeed);
                    }
                }
            }
        }
    }

    // 每隔16毫秒检查一次手柄状态（大约每秒60次）
    setInterval(handleGamepad, 16);
})();