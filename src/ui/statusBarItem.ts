import * as vscode from 'vscode';
import { ICostTrackerService } from '../services/types';
import { ServiceContainer } from '../services/serviceContainer';
import { ICostTrackerService as ICostTrackerServiceId } from '../services/types';

/**
 * Manages the Status Bar Item for displaying OpenAI costs.
 */
export class CostStatusBarItem {
  private statusBarItem: vscode.StatusBarItem;
  private costTracker: ICostTrackerService;
  private refreshInterval: NodeJS.Timeout | undefined;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBarItem.command = 'openai-cost-tracker.showCost';
    this.costTracker = ServiceContainer.getInstance().get<ICostTrackerService>(ICostTrackerServiceId);
  }

  /**
   * Initializes the status bar item and starts the refresh timer.
   */
  public async init(): Promise<void> {
    this.statusBarItem.show();
    this.statusBarItem.text = '$(sync~spin) Loading Cost...';
    
    await this.updateCost();

    // Set up polling based on configuration
    this.setupTimer();

    // Listen for configuration changes
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('openaiCostTracker.refreshInterval')) {
        this.setupTimer();
      }
    });

    // Listen for API key changes (if we had that event exposed nicely, strictly speaking we should subscribe to secretStorageService.onDidChangeApiKey)
    // For now, simple polling covers most cases.
  }

  private setupTimer() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    const config = vscode.workspace.getConfiguration('openaiCostTracker');
    const minutes = config.get<number>('refreshInterval', 60);
    const ms = Math.max(5, minutes) * 60 * 1000;

    this.refreshInterval = setInterval(() => {
      this.updateCost();
    }, ms);
  }

  public async updateCost(): Promise<void> {
    try {
      this.statusBarItem.text = '$(sync~spin) Checking...';
      const cost = await this.costTracker.getCurrentMonthCost();
      this.statusBarItem.text = `$(sparkle) $${cost.toFixed(2)}`;
      this.statusBarItem.tooltip = `Current Month Cost (OpenAI)`;
    } catch (error) {
      this.statusBarItem.text = '$(error) Cost Info';
      this.statusBarItem.tooltip = 'Error fetching cost. Click to retry/see details.';
    }
  }

  public dispose() {
    this.statusBarItem.dispose();
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}
