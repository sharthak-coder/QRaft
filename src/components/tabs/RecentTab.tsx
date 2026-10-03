import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { RecentItem } from '../../types';
import { RecentStore } from '../../services/recent';
import { Clock, Trash2, ArrowUpRight, Copy, Check } from 'lucide-react';

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
    <div className="p-4 rounded-3xl bg-white/90 backdrop-blur-md border border-surface-border shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-google-blue-royal uppercase tracking-wider">
            {item.type}
          </span>
          <span className="text-[11px] text-surface-muted">{formattedDate}</span>
        </div>

        {/* Mini Preview Canvas */}
        <div className="w-full flex items-center justify-center p-3 rounded-2xl bg-surface-soft border border-surface-border mb-3">
          <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
        </div>

        <p className="text-xs font-semibold text-surface-text line-clamp-2 mb-1" title={item.summary}>
          {item.summary}
        </p>

        <p className="text-[11px] font-mono text-surface-muted truncate">
          {item.payload}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyPayload}
            className="p-1.5 text-surface-muted hover:text-surface-text rounded-lg hover:bg-surface-soft transition-colors"
            title="Copy payload text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-google-green" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="p-1.5 text-surface-muted hover:text-google-red rounded-lg hover:bg-red-50 transition-colors"
            title="Delete from recent"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onReuse(item)}
          className="inline-flex items-center gap-1 text-xs font-bold text-google-blue-royal hover:text-google-blue-deep transition-colors"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-5 rounded-3xl border border-surface-border shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-google-blue-royal flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-surface-text">Recent QR History</h2>
            <p className="text-xs text-surface-muted">
              Last {items.length} generated items persisted in local browser storage.
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-google-red hover:bg-red-50 border border-red-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="p-12 text-center bg-white/80 rounded-3xl border border-surface-border shadow-sm flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-surface-soft flex items-center justify-center text-surface-muted mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-surface-text">No Recent QR Codes</h3>
          <p className="text-xs text-surface-muted mt-1 max-w-sm">
            Codes you generate or download in the QR Generator tab will automatically be remembered here for easy reuse.
          </p>
        </div>
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
