import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Template } from '../../types';
import { TemplateStore } from '../../services/templates';
import { CommunityStore } from '../../services/community';
import { encodeTemplateToShareLink } from '../../lib/shareLink';
import { generatePayload } from '../../lib/payload';
import { useAuth } from '../../hooks/useAuth';
import {
  Bookmark,
  Search,
  Copy,
  Trash2,
  Edit2,
  Share2,
  ExternalLink,
  Check,
  Send,
} from 'lucide-react';

interface TemplatesTabProps {
  onLoadTemplate?: (template: Template) => void;
}

const TemplateCard: React.FC<{
  template: Template;
  onLoad: (t: Template) => void;
  onRename: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onShareCommunity: (t: Template) => void;
}> = ({ template, onLoad, onRename, onDuplicate, onDelete, onShareCommunity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const payload = generatePayload(template.type, template.inputs);
      QRCode.toCanvas(
        canvasRef.current,
        payload || 'https://qraft.design',
        {
          width: 140,
          margin: 2,
          color: {
            dark: template.style.fgColor,
            light: template.style.bgColor,
          },
          errorCorrectionLevel: template.style.ecl,
        },
        () => {}
      );
    }
  }, [template]);

  const handleCopyLink = () => {
    const link = encodeTemplateToShareLink(template);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleRenameClick = () => {
    const newName = window.prompt('Rename template:', template.name);
    if (newName && newName.trim()) {
      onRename(template.id, newName.trim());
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-white/95 backdrop-blur-md border border-surface-border shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-google-blue-royal uppercase tracking-wider">
            {template.type}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleRenameClick}
              className="p-1.5 text-surface-muted hover:text-surface-text rounded-lg hover:bg-surface-soft transition-colors"
              title="Rename template"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDuplicate(template.id)}
              className="p-1.5 text-surface-muted hover:text-surface-text rounded-lg hover:bg-surface-soft transition-colors"
              title="Duplicate template"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(template.id)}
              className="p-1.5 text-surface-muted hover:text-google-red rounded-lg hover:bg-red-50 transition-colors"
              title="Delete template"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mini QR Canvas Preview */}
        <div className="w-full flex items-center justify-center p-3 rounded-2xl bg-surface-soft border border-surface-border mb-3">
          <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
        </div>

        <h3 className="text-sm font-bold text-surface-text truncate mb-1">
          {template.name}
        </h3>

        {template.originalAuthor && (
          <p className="text-[11px] text-surface-muted mb-2">
            Remixed from <span className="font-semibold text-google-blue-royal">{template.originalAuthor}</span>
          </p>
        )}

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {template.tags.map((tag, i) => (
              <span key={i} className="text-[10px] font-medium bg-surface-soft px-2 py-0.5 rounded-md text-surface-muted">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Share Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 p-2 rounded-xl text-xs font-semibold text-surface-muted hover:text-google-blue-royal hover:bg-blue-50 transition-colors"
            title="Copy cross-device share link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-google-green" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share Link'}</span>
          </button>

          {/* Publish to Community */}
          <button
            type="button"
            onClick={() => onShareCommunity(template)}
            className="inline-flex items-center gap-1 p-2 rounded-xl text-xs font-semibold text-surface-muted hover:text-google-green hover:bg-emerald-50 transition-colors"
            title="Publish to Community Feed"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Publish</span>
          </button>
        </div>

        {/* Load Into Studio */}
        <button
          type="button"
          onClick={() => onLoad(template)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-google-blue-royal to-google-blue text-white text-xs font-bold shadow-sm shadow-royal-glow hover:shadow transition-all active:scale-95"
        >
          <span>Load</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const TemplatesTab: React.FC<TemplatesTabProps> = ({ onLoadTemplate }) => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Load templates
  const reloadTemplates = () => {
    setTemplates(TemplateStore.getAll());
  };

  useEffect(() => {
    reloadTemplates();
  }, []);

  const handleRename = (id: string, name: string) => {
    TemplateStore.update(id, { name });
    reloadTemplates();
  };

  const handleDuplicate = (id: string) => {
    TemplateStore.duplicate(id);
    reloadTemplates();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this template?')) {
      TemplateStore.delete(id);
      reloadTemplates();
    }
  };

  const handleShareToCommunity = (tmpl: Template) => {
    const title = window.prompt('Community Post Title:', tmpl.name);
    if (!title) return;
    const desc = window.prompt(
      'Short description for the community:',
      `Custom ${tmpl.type.toUpperCase()} QR preset designed with QRaft.`
    );

    CommunityStore.publish(
      tmpl,
      title,
      desc || '',
      tmpl.tags || [tmpl.type],
      {
        id: user?.id || 'usr-local',
        name: user?.name || 'Local Designer',
        avatarColor: '#1A56DB',
      }
    );

    alert('Published to Community Feed!');
  };

  // Collect unique tags
  const allTags = Array.from(
    new Set(templates.flatMap((t) => t.tags || []))
  );

  // Filter templates
  const filtered = templates.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase()) ||
      (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())));

    const matchTag = selectedTag ? t.tags && t.tags.includes(selectedTag) : true;

    return matchSearch && matchTag;
  });

  return (
    <div className="w-full space-y-6">
      {/* Search, Filter & Controls Bar */}
      <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-surface-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-surface-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates or tags..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-surface-border text-xs focus:outline-none focus:ring-2 focus:ring-google-blue bg-surface-soft"
          />
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTag === null
                  ? 'bg-google-blue-royal text-white'
                  : 'bg-surface-soft text-surface-muted hover:text-surface-text'
              }`}
            >
              All Tags
            </button>
            {allTags.slice(0, 6).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedTag === tag
                    ? 'bg-google-blue-royal text-white'
                    : 'bg-surface-soft text-surface-muted hover:text-surface-text'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Templates */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white/80 rounded-3xl border border-surface-border shadow-sm flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-surface-soft flex items-center justify-center text-surface-muted mb-3">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-surface-text">No Templates Found</h3>
          <p className="text-xs text-surface-muted mt-1 max-w-sm">
            {search ? 'No templates matched your search query.' : 'Create and save QR code styles in the Generator tab to build your library.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tmpl) => (
            <TemplateCard
              key={tmpl.id}
              template={tmpl}
              onLoad={(t) => onLoadTemplate && onLoadTemplate(t)}
              onRename={handleRename}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onShareCommunity={handleShareToCommunity}
            />
          ))}
        </div>
      )}
    </div>
  );
};
