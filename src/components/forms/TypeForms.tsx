import React, { useState } from 'react';
import { QrType, QrInputsMap, WifiSecurity } from '../../types';
import { Eye, EyeOff, Info, AlertCircle } from 'lucide-react';
import { DoubleLineBorder } from '../../art/DoubleLineBorder';

interface TypeFormsProps {
  activeType: QrType;
  inputs: QrInputsMap;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export const TypeForms: React.FC<TypeFormsProps> = ({
  activeType,
  inputs,
  onChange,
  errors,
  touched,
}) => {
  const [showWifiPassword, setShowWifiPassword] = useState(false);

  const getFieldError = (field: string) => {
    return touched[`${activeType}.${field}`] ? errors[field] : undefined;
  };

  return (
    <DoubleLineBorder
      variant="kachni"
      className="w-full shadow-folk-card p-5 bg-rice"
      strokeColor="#1A3644"
      bandColor="#D99B26"
    >
      {/* 1. URL Form */}
      {activeType === 'url' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="qr-url-input" className="block text-xs font-heading font-bold text-indigo-ink mb-1.5">
              Website URL <span className="text-sindoor">*</span>
            </label>
            <input
              id="qr-url-input"
              type="url"
              value={inputs.url.url}
              onChange={(e) => onChange('url', e.target.value)}
              placeholder="https://gdg.community.dev/srm-ist"
              className={`w-full px-4 py-3 rounded-2xl border text-base transition-all focus:outline-none focus:ring-2 ${
                getFieldError('url')
                  ? 'border-sindoor focus:ring-sindoor/20 bg-sindoor/10'
                  : 'bg-rice border-rice-border focus:ring-haldi focus:border-indigo-ink text-indigo-ink'
              }`}
            />
            {getFieldError('url') && (
              <p role="alert" aria-live="polite" className="mt-1.5 flex items-center gap-1.5 text-xs text-sindoor font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{getFieldError('url')}</span>
              </p>
            )}
            <p className="mt-2 text-[11px] text-indigo-ink/70 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-ink flex-shrink-0" />
              <span>Standard web address with http:// or https://</span>
            </p>
          </div>
        </div>
      )}

      {/* 2. Text Form */}
      {activeType === 'text' && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="qr-text-input" className="block text-xs font-heading font-bold text-indigo-ink">
                Plain Text Message <span className="text-sindoor">*</span>
              </label>
              <span className="text-[11px] font-mono text-indigo-ink/60">
                {inputs.text.text.length} chars
              </span>
            </div>
            <textarea
              id="qr-text-input"
              rows={4}
              value={inputs.text.text}
              onChange={(e) => onChange('text', e.target.value)}
              placeholder="Enter plain text, notes, Wi-Fi voucher codes, or instructions..."
              className={`w-full px-4 py-3 rounded-2xl border text-base transition-all resize-y focus:outline-none focus:ring-2 ${
                getFieldError('text')
                  ? 'border-sindoor focus:ring-sindoor/20 bg-sindoor/10'
                  : 'bg-rice border-rice-border focus:ring-haldi focus:border-indigo-ink text-indigo-ink'
              }`}
            />
            {getFieldError('text') && (
              <p role="alert" aria-live="polite" className="mt-1.5 flex items-center gap-1.5 text-xs text-sindoor font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{getFieldError('text')}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* 3. Email Form */}
      {activeType === 'email' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="qr-email-address" className="block text-xs font-heading font-bold text-indigo-ink mb-1.5">
              Recipient Email Address <span className="text-sindoor">*</span>
            </label>
            <input
              id="qr-email-address"
              type="email"
              value={inputs.email.address}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="leads@gdgsrm.org"
              className={`w-full px-4 py-3 rounded-2xl border text-base transition-all focus:outline-none focus:ring-2 ${
                getFieldError('address')
                  ? 'border-sindoor focus:ring-sindoor/20 bg-sindoor/10'
                  : 'bg-rice border-rice-border focus:ring-haldi focus:border-indigo-ink text-indigo-ink'
              }`}
            />
            {getFieldError('address') && (
              <p role="alert" aria-live="polite" className="mt-1.5 flex items-center gap-1.5 text-xs text-sindoor font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{getFieldError('address')}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="qr-email-subject" className="block text-xs font-heading font-bold text-indigo-ink mb-1.5">
              Subject Line (Optional)
            </label>
            <input
              id="qr-email-subject"
              type="text"
              value={inputs.email.subject}
              onChange={(e) => onChange('subject', e.target.value)}
              placeholder="Inquiry regarding design collaboration"
              className="w-full px-4 py-2.5 rounded-2xl border bg-rice border-rice-border text-base text-indigo-ink focus:outline-none focus:ring-2 focus:ring-haldi"
            />
          </div>

          <div>
            <label htmlFor="qr-email-message" className="block text-xs font-heading font-bold text-indigo-ink mb-1.5">
              Prefilled Message Body (Optional)
            </label>
            <textarea
              id="qr-email-message"
              rows={3}
              value={inputs.email.message}
              onChange={(e) => onChange('message', e.target.value)}
              placeholder="Hello team, I would like to learn more about..."
              className="w-full px-4 py-2.5 rounded-2xl border bg-rice border-rice-border text-base text-indigo-ink resize-y focus:outline-none focus:ring-2 focus:ring-haldi"
            />
          </div>
        </div>
      )}

      {/* 4. Phone Form */}
      {activeType === 'phone' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="qr-phone-number" className="block text-xs font-heading font-bold text-indigo-ink mb-1.5">
              Telephone Number <span className="text-sindoor">*</span>
            </label>
            <input
              id="qr-phone-number"
              type="tel"
              value={inputs.phone.number}
              onChange={(e) => onChange('number', e.target.value)}
              placeholder="+919876543210"
              className={`w-full px-4 py-3 rounded-2xl border text-base transition-all focus:outline-none focus:ring-2 ${
                getFieldError('number')
                  ? 'border-sindoor focus:ring-sindoor/20 bg-sindoor/10'
                  : 'bg-rice border-rice-border focus:ring-haldi focus:border-indigo-ink text-indigo-ink'
              }`}
            />
            {getFieldError('number') && (
              <p role="alert" aria-live="polite" className="mt-1.5 flex items-center gap-1.5 text-xs text-sindoor font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{getFieldError('number')}</span>
              </p>
            )}
            <p className="mt-2 text-[11px] text-indigo-ink/70 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-ink flex-shrink-0" />
              <span>International format with country code (e.g. +91...)</span>
            </p>
          </div>
        </div>
      )}

      {/* 5. Wi-Fi Form */}
      {activeType === 'wifi' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="qr-wifi-ssid" className="block text-xs font-heading font-bold text-indigo-ink mb-1.5">
              Network Name (SSID) <span className="text-sindoor">*</span>
            </label>
            <input
              id="qr-wifi-ssid"
              type="text"
              value={inputs.wifi.ssid}
              onChange={(e) => onChange('ssid', e.target.value)}
              placeholder="SRM-Innovation-5G"
              className={`w-full px-4 py-3 rounded-2xl border text-base transition-all focus:outline-none focus:ring-2 ${
                getFieldError('ssid')
                  ? 'border-sindoor focus:ring-sindoor/20 bg-sindoor/10'
                  : 'bg-rice border-rice-border focus:ring-haldi focus:border-indigo-ink text-indigo-ink'
              }`}
            />
            {getFieldError('ssid') && (
              <p role="alert" aria-live="polite" className="mt-1.5 flex items-center gap-1.5 text-xs text-sindoor font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{getFieldError('ssid')}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="qr-wifi-security" className="block text-xs font-heading font-bold text-indigo-ink mb-1.5">
                Security Encryption
              </label>
              <select
                id="qr-wifi-security"
                value={inputs.wifi.security}
                onChange={(e) => onChange('security', e.target.value as WifiSecurity)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-rice-border text-base bg-rice text-indigo-ink focus:outline-none focus:ring-2 focus:ring-haldi"
              >
                <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                <option value="WEP">WEP (Legacy)</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>

            {inputs.wifi.security !== 'nopass' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="qr-wifi-password" className="block text-xs font-heading font-bold text-indigo-ink">
                    Password <span className="text-sindoor">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowWifiPassword(!showWifiPassword)}
                    className="text-[11px] text-indigo-ink/70 hover:text-indigo-ink flex items-center gap-1"
                  >
                    {showWifiPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showWifiPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <input
                  id="qr-wifi-password"
                  type={showWifiPassword ? 'text' : 'password'}
                  value={inputs.wifi.password}
                  onChange={(e) => onChange('password', e.target.value)}
                  placeholder="Network password"
                  className={`w-full px-4 py-2.5 rounded-2xl border text-base transition-all focus:outline-none focus:ring-2 ${
                    getFieldError('password')
                      ? 'border-sindoor focus:ring-sindoor/20 bg-sindoor/10'
                      : 'bg-rice border-rice-border focus:ring-haldi focus:border-indigo-ink text-indigo-ink'
                  }`}
                />
                {getFieldError('password') && (
                  <p role="alert" aria-live="polite" className="mt-1 flex items-center gap-1 text-xs text-sindoor font-medium">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{getFieldError('password')}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.wifi.hidden}
                onChange={(e) => onChange('hidden', e.target.checked)}
                className="rounded border-rice-border text-sindoor focus:ring-haldi"
              />
              <span className="text-xs text-indigo-ink/80 font-medium">
                Hidden SSID (Network does not broadcast its name)
              </span>
            </label>
          </div>
        </div>
      )}
    </DoubleLineBorder>
  );
};
