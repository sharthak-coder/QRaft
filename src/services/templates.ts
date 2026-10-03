import { Template } from '../types';
import { SEED_TEMPLATES } from './seed';

const TEMPLATES_KEY = 'qraft:templates:v1';

export class TemplateStore {
  public static getAll(): Template[] {
    try {
      const data = localStorage.getItem(TEMPLATES_KEY);
      if (!data) {
        // Pre-seed default templates
        this.saveAll(SEED_TEMPLATES);
        return SEED_TEMPLATES;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return SEED_TEMPLATES;
      return parsed;
    } catch {
      return SEED_TEMPLATES;
    }
  }

  public static saveAll(templates: Template[]): void {
    try {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
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
