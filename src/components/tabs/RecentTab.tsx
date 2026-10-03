import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { RecentItem } from '../../types';
import { RecentStore } from '../../services/recent';
import { Clock, Trash2, ArrowUpRight, Copy, Check } from 'lucide-react';
import { Corner } from '../../art/Corner';
import { EmptyStateScene } from '../ui/EmptyStateScene';

interface RecentTabProps {
  onLoadItem?: (item: RecentItem) => void;
}

const RecentCard: React.FC<{
  item: RecentItem;
  onDelete: (id: string) => void;
  onReuse: (item: RecentItem) => void;
}> = ({ item, onDelete, onReuse }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (canvasRef.current && item.payload) {
      QRCode.toCanvas(
        canvasRef.current,
        item.payload,
        {
          width: 140,
          margin: 2,
          color: {
            dark: item.style.fgColor,
            light: item.style.bgColor,
          },
          errorCorrectionLevel: item.style.ecl,
        },
        () => {}
      );
    }
  }, [item]);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(item.payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(item.timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className="p-4 rounded-3xl bg-paper-2/95 border border-paper-border shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group relative overflow-hidden"
      style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
    >
      <Corner position="top-right" size={20} strokeColor="#13504D" fillColor="#F79454" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-heading font-bold px-2.5 py-0.5 rounded-full bg-saffron-50 text-peacock-deep border border-saffron-300 uppercase tracking-wider">
            {item.type}
          </span>
          <span className="text-[11px] text-ink/65 font-mono">{formattedDate}</span>
        </div>

        {/* Mini Preview Canvas */}
        <div className="w-full flex items-center justify-center p-3 rounded-2xl bg-paper border border-paper-border mb-3 shadow-inner">
          <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
        </div>

        <p className="text-xs font-heading font-bold text-peacock-deep line-clamp-2 mb-1" title={item.summary}>
          {item.summary}
        </p>

        <p className="text-[11px] font-mono text-ink/65 truncate">
          {item.payload}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-paper-border flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyPayload}
            className="p-1.5 text-ink/70 hover:text-peacock-deep rounded-lg hover:bg-paper transition-colors"
            title="Copy payload text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-peacock" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="p-1.5 text-ink/70 hover:text-vermilion rounded-lg hover:bg-vermilion-50 transition-colors"
            title="Delete from recent"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onReuse(item)}
          className="inline-flex items-center gap-1 text-xs font-heading font-bold text-vermilion hover:text-vermilion-500 transition-colors cursor-pointer"
        >
          <span>Use in Studio</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const RecentTab: React.FC<RecentTabProps> = ({ onLoadItem }) => {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    setItems(RecentStore.getAll());
  }, []);

  const handleDelete = (id: string) => {
    RecentStore.remove(id);
    setItems(RecentStore.getAll());
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all recent QR code history?')) {
      RecentStore.clear();
      setItems([]);
    }
  };

  const handleReuse = (item: RecentItem) => {
    if (onLoadItem) {
      onLoadItem(item);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-paper-2/95 p-5 rounded-3xl border border-paper-border shadow-card"
        style={{ outline: '1px solid rgba(19, 80, 77, 0.1)', outlineOffset: '2px' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-peacock/10 text-peacock-deep flex items-center justify-center border border-peacock/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-heading font-bold text-peacock-deep">Recent QR History</h2>
            <p className="text-xs text-ink/70">
              {items.length === 0
                ? 'Your local session history is currently empty.'
                : `${items.length} recently generated QR codes stored in local browser memory.`}
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-heading font-bold text-vermilion hover:bg-vermilion-50 border border-vermilion/30 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyStateScene
          motif="lotus"
          title="No Recent QR Codes"
          description="A serene lotus rests on clear water. QR codes you generate or download in the studio will automatically appear here for one-tap reuse."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <RecentCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onReuse={handleReuse}
            />
          ))}
        </div>
      )}
    </div>
  );
};
