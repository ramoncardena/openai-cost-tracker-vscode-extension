import * as vscode from 'vscode';
import { ServiceContainer } from './services/serviceContainer';
import { SecretStorageService } from './services/secretStorageService';
import { ISecretStorageService, ICostTrackerService } from './services/types';
import { CostTrackerService } from './services/costTrackerService';
import { CostStatusBarItem } from './ui/statusBarItem';

/**
 * Activation entry point for the extension.
 * This is called when the extension is activated by VS Code.
 * @param context The extension context provided by VS Code.
 */
export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "openai-cost-tracker" is now active!');

  // Initialize Services
  const serviceContainer = ServiceContainer.getInstance();
  const secretStorageService = new SecretStorageService(context);
  serviceContainer.register(ISecretStorageService, secretStorageService);

  const costTrackerService = new CostTrackerService(); // Constructor gets dependencies from container
  serviceContainer.register(ICostTrackerService, costTrackerService);

  // Initialize UI
  const statusBarItem = new CostStatusBarItem();
  await statusBarItem.init();

  // Register Commands
  let helloWorld = vscode.commands.registerCommand('openai-cost-tracker.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from OpenAI Cost Tracker!');
  });

  let setApiKey = vscode.commands.registerCommand('openai-cost-tracker.setApiKey', async () => {
    const key = await vscode.window.showInputBox({
      title: 'Set OpenAI API Key',
      prompt: 'Enter your OpenAI API Key (User API Key required)',
      password: true,
      ignoreFocusOut: true
    });

    if (key) {
      await secretStorageService.storeKey(key);
      vscode.window.showInformationMessage('API Key updated successfully.');
      statusBarItem.updateCost(); // Refresh cost
    }
  });

  let showCost = vscode.commands.registerCommand('openai-cost-tracker.showCost', async () => {
    // Determine if trigger came from status bar or palette
    // For now, let's just open the menu which includes refresh
    await statusBarItem.showMenu();
  });

  context.subscriptions.push(helloWorld, setApiKey, showCost, statusBarItem);
}

/**
 * Deactivation entry point.
 * Called when the extension is deactivated.
 */
export function deactivate() {}
