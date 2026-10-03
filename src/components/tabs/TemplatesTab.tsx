import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Template } from '../../types';
import { TemplateStore } from '../../services/templates';
import { CommunityStore } from '../../services/community';
import { encodeTemplateToShareLink } from '../../lib/shareLink';
import { generatePayload } from '../../lib/payload';
import { useAuth } from '../../hooks/useAuth';
import { Corner } from '../../art/Corner';
import { EmptyStateScene } from '../ui/EmptyStateScene';
import {
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
    <div
      className="p-5 rounded-3xl bg-paper-2/95 border border-paper-border shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group relative overflow-hidden"
      style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
    >
      <Corner position="top-right" size={22} strokeColor="#13504D" fillColor="#F79454" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-heading font-bold px-2.5 py-0.5 rounded-full bg-saffron-50 text-peacock-deep border border-saffron-300 uppercase tracking-wider">
            {template.type}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleRenameClick}
              className="p-1.5 text-ink/70 hover:text-peacock-deep rounded-lg hover:bg-paper transition-colors"
              title="Rename template"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDuplicate(template.id)}
              className="p-1.5 text-ink/70 hover:text-peacock-deep rounded-lg hover:bg-paper transition-colors"
              title="Duplicate template"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(template.id)}
              className="p-1.5 text-ink/70 hover:text-vermilion rounded-lg hover:bg-vermilion-50 transition-colors"
              title="Delete template"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mini QR Canvas Preview */}
        <div className="w-full flex items-center justify-center p-3 rounded-2xl bg-paper border border-paper-border mb-3 shadow-inner">
          <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
        </div>

        <h3 className="text-sm font-heading font-bold text-peacock-deep truncate mb-1">
          {template.name}
        </h3>

        {template.originalAuthor && (
          <p className="text-[11px] text-ink/65 mb-2">
            Remixed from <span className="font-semibold text-peacock-deep">{template.originalAuthor}</span>
          </p>
        )}

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {template.tags.map((tag, i) => (
              <span key={i} className="text-[10px] font-medium bg-paper px-2 py-0.5 rounded-md text-ink/75 border border-paper-border">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-paper-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Share Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 p-2 rounded-xl text-xs font-semibold text-ink/75 hover:text-peacock-deep hover:bg-paper transition-colors"
            title="Copy cross-device share link"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-peacock" />
                <span className="text-[11px] text-peacock font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="text-[11px]">Share</span>
              </>
            )}
          </button>

          {/* Publish to Community */}
          <button
            type="button"
            onClick={() => onShareCommunity(template)}
            className="inline-flex items-center gap-1 p-2 rounded-xl text-xs font-semibold text-ink/75 hover:text-vermilion hover:bg-paper transition-colors"
            title="Publish template to Community feed"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="text-[11px]">Publish</span>
          </button>
        </div>

        {/* Load into Generator */}
        <button
          type="button"
          onClick={() => onLoad(template)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-vermilion hover:bg-vermilion-500 text-white font-heading font-bold text-xs shadow-sm shadow-vermilion-glow hover:shadow-saffron-glow transition-all active:scale-95 border border-white/30 cursor-pointer"
        >
          <span>Use</span>
          <ExternalLink className="w-3 h-3" />
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

  const loadTemplates = () => {
    setTemplates(TemplateStore.getAll());
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this template from your local library?')) {
      TemplateStore.delete(id);
      loadTemplates();
    }
  };

  const handleDuplicate = (id: string) => {
    TemplateStore.duplicate(id);
    loadTemplates();
  };

  const handleRename = (id: string, name: string) => {
    TemplateStore.update(id, { name });
    loadTemplates();
  };

  const handleShareToCommunity = (tmpl: Template) => {
    const title = window.prompt('Community Post Title:', tmpl.name);
    if (!title) return;
    const desc = window.prompt(
      'Description for template gallery:',
      `Madhubani ${tmpl.type.toUpperCase()} QR preset designed with QRaft.`
    );

    CommunityStore.publish(
      tmpl,
      title,
      desc || '',
      tmpl.tags || [tmpl.type],
      {
        id: user?.id || 'usr-local',
        name: user?.name || 'Guest Designer',
        avatarColor: '#13504D',
      }
    );

    alert('Published to Community Sample Feed!');
  };

  const allTags = Array.from(
    new Set(templates.flatMap((t) => t.tags || []))
  );

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
      <div
        className="bg-paper-2/95 p-5 rounded-3xl border border-paper-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
      >
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-ink/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates or tags..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-paper-border text-xs focus:outline-none focus:ring-2 focus:ring-peacock-deep bg-paper text-ink"
          />
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-colors ${
                selectedTag === null
                  ? 'bg-peacock-deep text-white shadow-sm'
                  : 'bg-paper text-ink/75 hover:text-peacock-deep border border-paper-border'
              }`}
            >
              All Tags
            </button>
            {allTags.slice(0, 6).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-colors ${
                  selectedTag === tag
                    ? 'bg-peacock-deep text-white shadow-sm'
                    : 'bg-paper text-ink/75 hover:text-peacock-deep border border-paper-border'
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
        <EmptyStateScene
          motif="fish"
          title="No Templates Found"
          description={
            search
              ? 'No templates matched your search query in your local storage.'
              : 'Your template library is empty. Generate and save custom QR codes to build your collection.'
          }
        />
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
