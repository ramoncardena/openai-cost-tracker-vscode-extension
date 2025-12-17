import * as vscode from 'vscode';
import { DailyCost } from '../services/types';

export class CostPanel {
  public static currentPanel: CostPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, _extensionUri: vscode.Uri) {
    this._panel = panel;

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public static createOrShow(extensionUri: vscode.Uri, data?: DailyCost[]) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (CostPanel.currentPanel) {
      CostPanel.currentPanel._panel.reveal(column);
      if (data) {
        CostPanel.currentPanel.update(data);
      }
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      'costPanel',
      'OpenAI Cost Stats',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
      }
    );

    CostPanel.currentPanel = new CostPanel(panel, extensionUri);
    CostPanel.currentPanel.update(data);
  }

  public update(data?: DailyCost[]) {
    this._panel.webview.html = this._getHtmlForWebview(data);
  }

  public dispose() {
    CostPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _getHtmlForWebview(data?: DailyCost[]): string {
    if (!data) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OpenAI Costs</title>
            <style>
                body { display: flex; justify-content: center; align-items: center; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: var(--vscode-editor-foreground); }
                .loader { border: 4px solid var(--vscode-editor-background); border-top: 4px solid var(--vscode-progressBar-background); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                p { margin-top: 20px; margin-left: 15px; }
            </style>
        </head>
        <body>
            <div class="loader"></div>
            <p>Loading Cost Data...</p>
        </body>
        </html>`;
    }

    // Extract labels and values for Chart.js
    const labels = data.map(d => d.date);
    const values = data.map(d => d.amount.toFixed(4));
    const total = data.reduce((acc, cur) => acc + cur.amount, 0).toFixed(2);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenAI Costs</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { padding: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { text-align: center; color: var(--vscode-editor-foreground); }
        .summary { text-align: center; font-size: 1.2em; margin-bottom: 20px; color: var(--vscode-descriptionForeground); }
        canvas { background-color: var(--vscode-editor-background); border-radius: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Monthly Usage Breakdown</h1>
        <div class="summary">Total: <strong>$${total}</strong></div>
        <canvas id="costChart"></canvas>
    </div>
    <script>
        const ctx = document.getElementById('costChart');
        const chartData = {
            labels: ${JSON.stringify(labels)},
            datasets: [{
                label: 'Cost (USD)',
                data: ${JSON.stringify(values)},
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) { return '$' + value; },
                            color: '#888'
                        },
                        grid: { color: '#333' }
                    },
                    x: {
                        ticks: { color: '#888' },
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#ccc' } }
                }
            }
        });
    </script>
</body>
</html>`;
  }
}
