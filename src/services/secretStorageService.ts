import * as vscode from 'vscode';
import { ISecretStorageService } from './types';

/**
 * Implementation of ISecretStorageService using VS Code's native SecretStorage API.
 * This ensures keys are stored encrypted on the user's machine.
 */
export class SecretStorageService implements ISecretStorageService {
  private static readonly KEY_NAME = 'openai_api_key';
  private _onDidChangeApiKey: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  public readonly onDidChangeApiKey: vscode.Event<void> = this._onDidChangeApiKey.event;

  constructor(private context: vscode.ExtensionContext) {
    // Listen for changes to the secret storage to fire our event
    this.context.secrets.onDidChange((e) => {
      if (e.key === SecretStorageService.KEY_NAME) {
        this._onDidChangeApiKey.fire();
      }
    });
  }

  /**
   * Initialize the service.
   */
  async init(): Promise<void> {}

  /**
   * Securely stores the API key.
   */
  async storeKey(key: string): Promise<void> {
    await this.context.secrets.store(SecretStorageService.KEY_NAME, key.trim());
  }

  /**
   * Retrieves the stored API key.
   */
  async getKey(): Promise<string | undefined> {
    return await this.context.secrets.get(SecretStorageService.KEY_NAME);
  }

  /**
   * Deletes the stored API key.
   */
  async deleteKey(): Promise<void> {
    await this.context.secrets.delete(SecretStorageService.KEY_NAME);
  }

  /**
   * Dispose resources.
   */
  dispose(): void {
    this._onDidChangeApiKey.dispose();
  }
}
