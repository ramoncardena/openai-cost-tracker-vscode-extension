import * as vscode from 'vscode';
import { ServiceContainer } from './services/serviceContainer';
import { ICostTrackerServiceId, ISecretStorageServiceId } from './services/types';
import { SecretStorageService } from './services/secretStorageService';
import { CostTrackerService } from './services/costTrackerService';
import { CostStatusBarItem } from './ui/statusBarItem';
import { CostPanel } from './panels/CostPanel';

/**
 * Activation entry point for the extension.
 * This is called when the extension is activated by VS Code.
 * @param context The extension context provided by VS Code.
 */
export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "openai-cost-tracker" is now active!');

  // Initialize Services
  const services = ServiceContainer.getInstance();
  const secretStorageService = new SecretStorageService(context);
  services.register(ISecretStorageServiceId, secretStorageService);

  const costTrackerService = new CostTrackerService(secretStorageService);
  services.register(ICostTrackerServiceId, costTrackerService);

  // Initialize UI
  const statusBarItem = new CostStatusBarItem();
  await statusBarItem.init();

  // Register Commands
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

  let showDetailedStats = vscode.commands.registerCommand('openai-cost-tracker.showDetailedStats', async () => {
    try {
        // Show panel immediately with loading state
        CostPanel.createOrShow(context.extensionUri);

        const now = new Date();
        // Get start of month to now
        const startObj = new Date(now.getFullYear(), now.getMonth(), 1);
        const endObj = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        
        const startTime = Math.floor(startObj.getTime() / 1000);
        const endTime = Math.floor(endObj.getTime() / 1000);

        const dailyCosts = await costTrackerService.getDailyCosts(startTime, endTime);
        
        // Update panel with fetched data
        if (CostPanel.currentPanel) {
            CostPanel.currentPanel.update(dailyCosts);
        }
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to load stats: ${error.message}`);
    }
  });

  context.subscriptions.push(setApiKey, showCost, showDetailedStats, statusBarItem);
}

/**
 * Deactivation entry point.
 * Called when the extension is deactivated.
 */
export function deactivate() {}
