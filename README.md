# GamePad Input Extension

[![Firefox Add-ons](https://img.shields.io/badge/Firefox-141e24.svg?&style=for-the-badge&logo=firefox-browser&logoColor=white)](https://addons.mozilla.org/firefox/addon/gamepad-input)
[![Node.js CI](https://github.com/G-POPLO/GamePad-Input/actions/workflows/ci.yml/badge.svg)](https://github.com/G-POPLO/GamePad-Input/actions/workflows/ci.yml)

## Language

- [English](README.md)
- [中文](README-zh.md)

## Overview

The GamePad Input Extension allows you to control web pages using a gamepad. It is designed to work with various web pages,and provides a seamless experience for navigating and interacting with web content.

## Features

- **Gamepad Control**: Use your gamepad to navigate and interact with web pages.
- **Customizable Axes**: Select which axes on the gamepad to use for navigation.
- **Customizable Button Mapping**: Remap gamepad buttons to different browser actions.

## Installation

```sh
git clone https://github.com/G-POPLO/GamePad-Input.git
```

### Load the extension in Chrome

1. Open Chrome and go to `chrome://extensions/`.
2. Enable "Developer mode" using the toggle switch in the top right corner.
3. Click on "Load unpacked" and select the `dist` directory after building.

## Usage

1. Open a web page or a new tab.
2. Connect your gamepad.
3. Use the selected axes to navigate and interact with the web page.

Default controls:

- **Y Button**: Refresh the current page.
- **B Button**: Close the current tab.
- **A Button**: Create a new tab.
- **X Button**: Duplicate the current tab.
- **Left Bumper (LB)**: Switch to the previous tab.
- **Right Bumper (RB)**: Switch to the next tab.
- **Left Trigger (LT)**: Go back in history.
- **Right Trigger (RT)**: Go forward in history.

## Development

```sh
# Install dependencies
pnpm install

# Start development server with HMR
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Run linter
pnpm lint

# Format code
pnpm format
```

## Configuration

The extension allows you to configure which axes and buttons on the gamepad are used for navigation. You can change these settings in the extension's options page.

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
