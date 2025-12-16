import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "openai-cost-tracker" is now active!');

  let disposable = vscode.commands.registerCommand('openai-cost-tracker.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from OpenAI Cost Tracker!');
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
