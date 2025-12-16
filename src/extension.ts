import * as vscode from 'vscode';
import { ServiceContainer } from './services/serviceContainer';
import { SecretStorageService } from './services/secretStorageService';
import { ISecretStorageService } from './services/types';

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

  // Register Commands
  let helloWorld = vscode.commands.registerCommand('openai-cost-tracker.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from OpenAI Cost Tracker!');
  });

  let setApiKey = vscode.commands.registerCommand('openai-cost-tracker.setApiKey', async () => {
    const key = await vscode.window.showInputBox({
      title: 'OpenAI API Key',
      prompt: 'Enter your OpenAI API Key to track costs',
      ignoreFocusOut: true,
      password: true
    });

    if (key) {
      await secretStorageService.storeKey(key);
      vscode.window.showInformationMessage('API Key saved securely.');
    }
  });

  context.subscriptions.push(helloWorld, setApiKey);
}

/**
 * Deactivation entry point.
 * Called when the extension is deactivated.
 */
export function deactivate() {}
