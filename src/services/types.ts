import * as vscode from 'vscode';

/**
 * Base interface for all services in the application.
 */
export interface IService {
  /**
   * Initialize the service. Called after registration.
   */
  init(): Promise<void>;

  /**
   * Dispose resources/listeners.
   */
  dispose(): void;
}

/**
 * Service Identifier for the SecretStorageService.
 */
export const ISecretStorageService = 'ISecretStorageService';

/**
 * Interface for securely storing and retrieving sensitive information like API Keys.
 */
export interface ISecretStorageService extends IService {
  /**
   * Securely stores the API key.
   * @param key The OpenAI API Key to store.
   */
  storeKey(key: string): Promise<void>;

  /**
   * Retrieves the stored API key.
   * @returns The API key if found, otherwise undefined.
   */
  getKey(): Promise<string | undefined>;

  /**
   * Deletes the stored API key.
   */
  deleteKey(): Promise<void>;

  /**
   * Event fired when the API key is updated or deleted.
   */
  onDidChangeApiKey: vscode.Event<void>;
}
