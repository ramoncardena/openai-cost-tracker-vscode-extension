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
  private displayMode: 'Today' | 'Month' = 'Today';

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
    this.statusBarItem.command = 'openai-cost-tracker.showCost';
    
    await this.updateCost();

    // Set up polling based on configuration
    this.setupTimer();

    // Listen for configuration changes
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('openaiCostTracker.refreshInterval')) {
        this.setupTimer();
      }
    });
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
      
      const now = new Date();
      let startTime = 0;
      let endTime = 0;

      if (this.displayMode === 'Today') {
        const startObj = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endObj = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        startTime = Math.floor(startObj.getTime() / 1000);
        endTime = Math.floor(endObj.getTime() / 1000);
      } else {
        const startObj = new Date(now.getFullYear(), now.getMonth(), 1);
        const endObj = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        startTime = Math.floor(startObj.getTime() / 1000);
        endTime = Math.floor(endObj.getTime() / 1000);
      }

      const cost = await this.costTracker.getCost(startTime, endTime);
      const label = this.displayMode === 'Today' ? 'Today' : 'Month';
      this.statusBarItem.text = `$(sparkle) ${label}: $${cost.toFixed(2)}`;
      this.statusBarItem.tooltip = `Click to switch view (Current: ${this.displayMode})`;
    } catch (error) {
      this.statusBarItem.text = '$(error) Cost Info';
      this.statusBarItem.tooltip = 'Error fetching cost. Click to retry/see details.';
    }
  }

  public async showMenu(): Promise<void> {
    const pick = await vscode.window.showQuickPick(
      [
        { label: 'Switch to Today', description: 'Show cost for the current day', mode: 'Today' },
        { label: 'Switch to Month', description: 'Show cost for the current month', mode: 'Month' },
        { label: 'Refresh', description: 'Force update cost' }
      ],
      { placeHolder: 'Select Cost View Mode' }
    );

    if (pick) {
      if ((pick as any).mode) {
        this.displayMode = (pick as any).mode;
      }
      this.updateCost();
    }
  }

  public dispose() {
    this.statusBarItem.dispose();
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}
