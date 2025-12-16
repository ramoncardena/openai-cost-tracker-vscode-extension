# OpenAI Cost Tracker

Track your OpenAI API usage and costs directly within Visual Studio Code. This extension helps developers monitor their API consumption in real-time, preventing unexpected bills and helping manage budget effective during development.

## Features

- **Real-time Cost Tracking**: View your current OpenAI API usage cost in the Status Bar.
- **Detailed Usage View**: Analyze usage by model, date, or endpoint (Coming Soon).
- **Budget Alerts**: Set thresholds to get notified when you're approaching your budget limit (Coming Soon).
- **Secure Key Storage**: Your API keys are stored securely using VS Code's native SecretStorage.

## Requirements

- visual Studio Code v1.85.0 or higher.
- An active OpenAI **User API Key (Legacy)** with Admin permissions (Project keys may not work for cost tracking).

## Extension Settings

This extension contributes the following settings:

- `openaiCostTracker.apiKey`: Set your OpenAI API Key (Recommend using the command `OpenAI Cost Tracker: Set API Key` for security).
- `openaiCostTracker.refreshInterval`: Frequency to fetch usage data (default: 5 minutes).

## Known Issues

- Initial release is in development. Basic tracking only.

## Release Notes

### 0.0.1

- Initial scaffolding and project setup.

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
