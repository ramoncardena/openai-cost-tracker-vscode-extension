# OpenAI Cost Tracker

![Icon](images/icon.png)

[![Version](https://img.shields.io/github/v/release/ramoncardena/openai-cost-tracker-vscode-extension?label=version&style=flat-square)](https://github.com/ramoncardena/openai-cost-tracker-vscode-extension/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![VS Code API](https://img.shields.io/badge/VS%20Code%20API-v1.85%2B-blue.svg?style=flat-square)](https://code.visualstudio.com/)

Track your OpenAI API usage and costs directly within Visual Studio Code. This extension helps developers monitor their API consumption in real-time, preventing unexpected bills and helping manage budgets effectively.

## ✨ Features

- **📊 Real-time Cost Tracking**: Discrete status bar item showing cost for **Today** or the **Current Month**.
- **📈 Detailed Statistics Panel**: Visualize your daily spending with interactive bar charts giving you deep insights into your usage patterns.
- **🔒 Secure**: API keys are securely stored using VS Code's native SecretStorage API.
- **⚡ Instant Access**: Extension activates automatically on startup.
- **⚙️ Configurable**: Customize refresh intervals and views to suit your workflow.

## 🚀 Getting Started

1.  **Install** the extension.
2.  Use the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run:
    `OpenAI Cost Tracker: Set API Key`
3.  Enter your **OpenAI User API Key** (Legacy).
    > **Note**: Requires a User Key with appropriate permissions to read billing usage (Project keys limit access).
4.  The Status Bar on the bottom right will immediately update with your usage: `✨ Today: $0.12`.

## 🕹️ Usage

### Status Bar

- **Click** the status bar item to open the Quick Menu.
- **Switch View**: Toggle between "Today's Cost" and "Month's Cost".
- **View Detailed Stats**: Opens the full-screen chart visualization.
- **Refresh**: Force an immediate update from the API.

### Detailed Stats

Select **"View Detailed Stats"** to open a Webview panel. This panel loads instantly and fetches your daily breakdown for the current month, rendering it as a beautiful chart.

## ⚙️ Settings

This extension contributes the following settings:

- `openaiCostTracker.refreshInterval`: Frequency in minutes to auto-refresh cost data (default: `60`).

## 📋 Requirements

- VS Code v1.85.0 or higher.
- OpenAI API Key (User Key recommended for Organization Usage access).

## 📝 Release Notes

### 0.0.2

- **New**: Detailed Usage Stats with Charts!
- **New**: Neon-style Extension Icon.
- **Improved**: Instant loading UX.
- **Improved**: Auto-activation on startup.

### 0.0.1

- Initial release with secure key storage and basic status bar tracking.

---

**Enjoying the extension?** [Give it a ⭐ on GitHub!](https://github.com/ramoncardena/openai-cost-tracker-vscode-extension)
