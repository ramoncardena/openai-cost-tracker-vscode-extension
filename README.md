# OpenAI Cost Tracker

Track your OpenAI API usage and costs directly within Visual Studio Code. This extension helps developers monitor their API consumption in real-time, preventing unexpected bills and helping manage budget effective during development.

## Features

- **Real-time Cost Tracking**: View your current month's usage cost in the Status Bar (updates hourly).
- **Click for Details**: Click the status bar item to view the exact amount and debug options.
- **Secure Key Storage**: Your API keys are stored securely using VS Code's native SecretStorage.

## Requirements

- visual Studio Code v1.85.0 or higher.
- An active OpenAI **User API Key (Legacy)** with Admin permissions (Project keys may not work for cost tracking).

## Extension Settings

This extension contributes the following settings:

- `openaiCostTracker.refreshInterval`: Frequency in minutes to refresh the cost data from OpenAI (default: 60 minutes).

## Known Issues

- The extension currently tracks the total cost for the _current calendar month_.
- "Detailed Usage" breakdown is in development.

## Release Notes

### 0.0.1

- Initial release.
- Secure API Key management.
- Status Bar integration with `$(sparkle)` icon.
- Monthly cost tracking.

---

## For Developers

### Building the Extension

```bash
npm install
npm run compile
```

### Running Tests

```bash
npm test
```

**Enjoy!**
