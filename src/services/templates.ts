import { Template } from '../types';
import { SEED_TEMPLATES } from './seed';
import { migrateQrStyle } from '../lib/paletteMigration';

export const TEMPLATES_KEY_V1 = 'qraft:templates:v1';
export const TEMPLATES_KEY_V2 = 'qraft:templates:v2';

export class TemplateStore {
  /**
   * Retrieves all templates, automatically migrating legacy v1 stores into v2 format
   */
  public static getAll(): Template[] {
    try {
      // 1. Try reading v2 store
      const v2Data = localStorage.getItem(TEMPLATES_KEY_V2);
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
      const v1Data = localStorage.getItem(TEMPLATES_KEY_V1);
      if (v1Data) {
        const parsedV1 = JSON.parse(v1Data);
        if (Array.isArray(parsedV1)) {
          const migrated: Template[] = parsedV1.map((item: any) => ({
            ...item,
            style: migrateQrStyle(item.style),
            updatedAt: Date.now(),
          }));
          this.saveAll(migrated);
          return migrated;
        }
      }

      // 3. Pre-seed default folk templates if store is empty
      this.saveAll(SEED_TEMPLATES);
      return SEED_TEMPLATES;
    } catch {
      return SEED_TEMPLATES;
    }
  }

  public static saveAll(templates: Template[]): void {
    try {
      localStorage.setItem(TEMPLATES_KEY_V2, JSON.stringify(templates));
    } catch (err) {
      console.error('Failed to save templates', err);
    }
  }

  public static getUserTemplates(userId?: string): Template[] {
    const all = this.getAll();
    if (!userId) return all;
    return all.filter(t => t.authorId === userId || !t.authorId);
  }

  public static getById(id: string): Template | null {
    const all = this.getAll();
    return all.find(t => t.id === id) || null;
  }

  public static create(
    data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>,
    authorId?: string,
    authorName?: string
  ): Template {
    const all = this.getAll();
    const newTemplate: Template = {
      ...data,
      style: migrateQrStyle(data.style),
      id: `tmpl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      authorId,
      authorName,
    };
    all.unshift(newTemplate);
    this.saveAll(all);
    return newTemplate;
  }

  public static update(id: string, updates: Partial<Template>): Template | null {
    const all = this.getAll();
    const index = all.findIndex(t => t.id === id);
    if (index < 0) return null;

    const updated: Template = {
      ...all[index],
      ...updates,
      style: updates.style ? migrateQrStyle(updates.style) : all[index].style,
      updatedAt: Date.now(),
    };
    all[index] = updated;
    this.saveAll(all);
    return updated;
  }

  public static delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter(t => t.id !== id);
    if (filtered.length === all.length) return false;
    this.saveAll(filtered);
    return true;
  }

  public static duplicate(id: string): Template | null {
    const original = this.getById(id);
    if (!original) return null;

    const copy: Template = {
      ...original,
      id: `tmpl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: `${original.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const all = this.getAll();
    all.unshift(copy);
    this.saveAll(all);
    return copy;
  }

  public static resetDemo(): void {
    this.saveAll(SEED_TEMPLATES);
  }
}
