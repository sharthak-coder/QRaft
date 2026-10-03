import { RecentItem, QrType, QrInputsMap, QrStyle } from '../types';
import { getPayloadSummary } from '../lib/payload';

const RECENT_KEY = 'qraft:recent:v1';
const MAX_RECENT_ITEMS = 12;

export class RecentStore {
  public static getAll(): RecentItem[] {
    try {
      const data = localStorage.getItem(RECENT_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item: any) => ({
        ...item,
        style: {
          moduleShape: 'square',
          finderShape: 'square',
          gradientType: 'none',
          artStyle: 'none',
          paintedTexture: false,
          ...(item.style || {}),
        },
      }));
    } catch {
      return [];
    }
  }

  public static saveAll(items: RecentItem[]): void {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(items.slice(0, MAX_RECENT_ITEMS)));
    } catch (err) {
      console.error('Failed to save recent items', err);
    }
  }

  public static add<T extends QrType>(
    type: T,
    inputs: QrInputsMap[T],
    style: QrStyle,
    payload: string
  ): RecentItem {
    const all = this.getAll();
    const cleanPayload = payload.trim();

    // De-duplicate by payload
    const filtered = all.filter(item => item.payload !== cleanPayload);

    const newItem: RecentItem = {
      id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      inputs: { ...inputs },
      style: { ...style },
      payload: cleanPayload,
      summary: getPayloadSummary(type, inputs),
      timestamp: Date.now(),
    };

    filtered.unshift(newItem);
    this.saveAll(filtered);
    return newItem;
  }

  public static remove(id: string): void {
    const all = this.getAll().filter(item => item.id !== id);
    this.saveAll(all);
  }

  public static clear(): void {
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch (err) {
      console.error('Failed to clear recent items', err);
    }
  }
}
