# OpenAI Cost Tracker - Technical Documentation

**Version:** 0.0.1  
**Date:** 2025-12-16  
**Author:** Ramon Cardena

This document serves as the internal technical reference for the **OpenAI Cost Tracker** VS Code extension. It details the architecture, design patterns, and implementation specifics of the codebase.

## 1. Architecture Overview

The extension follows a **Service-Oriented Architecture** with Dependency Injection (DI) to ensure loose coupling and testability.

### Core Patterns

- **Singleton Service Container**: Central registry for all services (`src/services/serviceContainer.ts`).
- **Dependency Injection**: Services receive their dependencies (like storage) upon instantiation rather than creating them internally.
- **Factory Pattern**: Used loosely in `extension.ts` to wire up the initial dependency graph.

## 2. Component Reference

### 2.1 Service Container (`src/services/serviceContainer.ts`)

A generic `ServiceContainer` class that holds service instances.

- **Methods**: `register<T>`, `get<T>`.
- **Logic**: Enforces singleton behavior for the container itself. Throws clear errors if a requested service hasn't been registered.

### 2.2 Secret Storage Service (`src/services/secretStorageService.ts`)

Wraps VS Code's native `context.secrets` API.

- **Security**: Uses the OS keychain (Keychain on macOS, Gnome Keyring/KWallet on Linux, Credential Manager on Windows).
- **Key Storage**: Stores the API Key under the constant `openai-cost-tracker.apiKey`.
- **Validation**: Automatically trims whitespace from input keys to prevent auth errors.

### 2.3 Cost Tracker Service (`src/services/costTrackerService.ts`)

Handles all interactions with the OpenAI API.

- **Endpoint**: `GET https://api.openai.com/v1/organization/costs`
- **Authentication**: Bearer Token (User API Key).
- **Date Handling**:
  - The API requires **Unix Timestamps (Seconds)**, not milliseconds or ISO strings.
  - Logic converts JS `Date` objects: `Math.floor(date.getTime() / 1000)`.
- **Response Parsing**:
  - The API returns a nested structure: `data[] -> buckets -> results[] -> amount`.
  - The service iterates through all buckets and results to calculate the `totalCost`.
- **Error Handling**:
  - Detects `401` (Invalid Key) vs `403` (Permission Denied).
  - Specifically prompts users to check for **Project Keys** (which create 403s on this endpoint) vs **User Keys** (required).

### 2.4 Status Bar UI (`src/ui/statusBarItem.ts`)

Manages the visual presentation in VS Code.

- **Polling**: Uses `setInterval` based on `openaiCostTracker.refreshInterval` (default 60m).
- **Event Listeners**: Watches `vscode.workspace.onDidChangeConfiguration` to reset the timer if the interval changes.
- **State**: Maintains a `displayMode` ('Today' or 'Month').
  - **Today**: Start of day (00:00 local) to Now.
  - **Month**: Start of month (1st, 00:00 local) to Now.
- **Interactivity**: Clicking opens a generic `QuickPick` menu to switch modes or force refresh.

## 3. API Integration Details

### Endpoint: `v1/organization/costs`

- **Docs**: Internal/Undocumented by some standards, requires `api.usage.read` scope.
- **Constraint**: This is an **Organization-level** endpoint. standard "Project" API keys generated in the new dashboard often lack scope.
- **Solution**: Users must generate a "User API Key (Legacy)" which inherits their full admin permissions.

## 4. Build & Packaging

- **Bundler**: Webpack (`webpack.config.js`). Handles bundling of TS files into a single `extension.js` for performance.
- **Package Manager**: `npm`.
- **VSIX Creation**: `vsce package`.
  - **Publisher**: `ramoncardena`.
  - **Excludes**: `src/` (ts files), `node_modules` (dev dependencies), and config files are excluded from the final package via `.vscodeignore`.

## 5. Future Maintenance

- **Detailed Usage**: The API response includes `project_id` and `line_item`. Future updates could group costs by Project ID to show which project is spending money.
- **Budget Alerts**: We could implement a background check in `statusBarItem.ts` that compares `totalCost` against a user-configured limit and shows a warning notification.
