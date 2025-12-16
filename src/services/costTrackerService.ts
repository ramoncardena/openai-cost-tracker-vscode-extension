import { ICostTrackerService, ISecretStorageService } from './types';
import { ServiceContainer } from './serviceContainer';
import { ISecretStorageService as ISecretStorageServiceId } from './types';

interface CostResult {
  object: string;
  amount: {
    value: number;
    currency: string;
  };
}

interface CostBucket {
  object: string;
  start_time: number;
  end_time: number;
  results: CostResult[];
}

interface CostsResponse {
  object: string;
  data: CostBucket[];
}

/**
 * Implementation of ICostTrackerService calling OpenAI Costs API.
 */
export class CostTrackerService implements ICostTrackerService {
  private secretStorage: ISecretStorageService;

  constructor() {
    this.secretStorage = ServiceContainer.getInstance().get<ISecretStorageService>(ISecretStorageServiceId);
  }

  async init(): Promise<void> {}

  dispose(): void {}

  /**
   * Fetches the cost for a specific time range.
   * @param startTime Unix timestamp in seconds
   * @param endTime Unix timestamp in seconds
   */
  async getCost(startTime: number, endTime: number): Promise<number> {
    const apiKey = await this.secretStorage.getKey();
    if (!apiKey) {
      throw new Error('API Key not found. Please set your OpenAI API Key first.');
    }
    
    // Using fetch (available in Node 18+ / VS Code)
    const url = `https://api.openai.com/v1/organization/costs?start_time=${startTime}&end_time=${endTime}&limit=100`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
        const text = await response.text();
        if (response.status === 401) {
             throw new Error(`Invalid API Key: ${text}`);
        }
        if (response.status === 403) {
            throw new Error(`Permission denied: ${text}. \n\nHint: You are likely using a Project Key. This endpoint (organization/costs) requires a **User API Key (Legacy)** with Admin permissions to view billing data.`);
        }
        throw new Error(`Failed to fetch costs: ${response.status} ${text}`);
    }

    const data = await response.json() as CostsResponse;
    
    // usage data is split into buckets (days), and each bucket has results
    let totalCost = 0;
    if (data.data && Array.isArray(data.data)) {
      for (const bucket of data.data) {
        if (bucket.results && Array.isArray(bucket.results)) {
          for (const result of bucket.results) {
             // value can be string "0.123" or number, based on output observed (sometimes API returns strings for high precision)
             const val = Number(result.amount.value);
             if (!isNaN(val)) {
               totalCost += val;
             }
          }
        }
      }
    }

    return totalCost;
  }
}
