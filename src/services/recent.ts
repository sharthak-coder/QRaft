import { RecentItem, QrType, QrInputsMap, QrStyle } from '../types';
import { getPayloadSummary } from '../lib/payload';
import { migrateQrStyle } from '../lib/paletteMigration';

export const RECENT_KEY_V1 = 'qraft:recent:v1';
export const RECENT_KEY_V2 = 'qraft:recent:v2';
const MAX_RECENT_ITEMS = 12;

export class RecentStore {
  /**
   * Retrieves all recent items, automatically migrating legacy v1 stores into v2 format
   */
  public static getAll(): RecentItem[] {
    try {
      // 1. Try reading v2 store
      const v2Data = localStorage.getItem(RECENT_KEY_V2);
      if (v2Data) {
        const parsed = JSON.parse(v2Data);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any) => ({
            ...item,
            style: migrateQrStyle(item.style),
          }));
        }
      }

      // 2. Check for legacy v1 store and migrate
      const v1Data = localStorage.getItem(RECENT_KEY_V1);
      if (v1Data) {
        const parsedV1 = JSON.parse(v1Data);
        if (Array.isArray(parsedV1)) {
          const migrated: RecentItem[] = parsedV1.map((item: any) => ({
            ...item,
            style: migrateQrStyle(item.style),
          }));
          this.saveAll(migrated);
          return migrated;
        }
      }

      return [];
    } catch {
      return [];
    }
  }

  public static saveAll(items: RecentItem[]): void {
    try {
      localStorage.setItem(RECENT_KEY_V2, JSON.stringify(items.slice(0, MAX_RECENT_ITEMS)));
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
      style: migrateQrStyle(style),
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
      localStorage.removeItem(RECENT_KEY_V2);
      localStorage.removeItem(RECENT_KEY_V1);
    } catch (err) {
      console.error('Failed to clear recent items', err);
    }
  }
}
