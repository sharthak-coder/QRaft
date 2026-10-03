import { useState, useMemo, useCallback } from 'react';
import {
  QrType,
  QrInputsMap,
  QrStyle,
  ScanVerificationResult,
  Template,
  RecentItem,
} from '../types';
import { generatePayload } from '../lib/payload';
import { validateInputs } from '../lib/validation';
import { evaluateReliability } from '../lib/reliability';
import { getPresetById } from '../lib/presets';

const INITIAL_INPUTS: QrInputsMap = {
  url: { url: 'https://gdg.community.dev/srm-ist' },
  text: { text: 'Welcome to QRaft — Crafted for GDG SRM IST.' },
  email: {
    address: 'leads@gdgsrm.org',
    subject: 'Frontend Recruitment Inquiry',
    message: 'Hello team, I am submitting my QRaft project for review.',
  },
  phone: { number: '+919876543210' },
  wifi: {
    ssid: 'Campus-Guest-5G',
    password: 'WelcomeSRM2026',
    security: 'WPA',
    hidden: false,
  },
};

const INITIAL_STYLE: QrStyle = {
  size: 320,
  fgColor: '#1A3644',
  bgColor: '#F6F1E8',
  ecl: 'H',
  margin: 4,
  moduleShape: 'connected',
  finderShape: 'rounded',
  gradientType: 'linear',
  gradientColor: '#2D5A3E',
  artStyle: 'none',
  paintedTexture: false,
};

export function useQrStudio() {
  const [activeType, setActiveType] = useState<QrType>('url');
  const [inputs, setInputs] = useState<QrInputsMap>(INITIAL_INPUTS);
  const [style, setStyle] = useState<QrStyle>(INITIAL_STYLE);
  const [activePresetId, setActivePresetId] = useState<string | null>('indigo');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [verification, setVerification] = useState<ScanVerificationResult | null>(null);

  // Update a single input field for the active QR type
  const setInputField = useCallback(
    (field: string, value: any) => {
      setInputs((prev) => ({
        ...prev,
        [activeType]: {
          ...prev[activeType],
          [field]: value,
        },
      }));
      setTouched((prev) => ({ ...prev, [`${activeType}.${field}`]: true }));
      setVerification(null);
    },
    [activeType]
  );

  // Update a single styling attribute (resets activePresetId if modified)
  const setStyleField = useCallback(
    <K extends keyof QrStyle>(key: K, value: QrStyle[K]) => {
      setStyle((prev) => ({ ...prev, [key]: value }));
      setActivePresetId(null);
      setVerification(null);
    },
    []
  );

  // Update multiple styling attributes atomically
  const updateStyle = useCallback((updates: Partial<QrStyle>) => {
    setStyle((prev) => ({ ...prev, ...updates }));
    setActivePresetId(null);
    setVerification(null);
  }, []);

  // Apply a curated preset (resolves current and legacy preset IDs)
  const applyPreset = useCallback((presetId: string) => {
    const found = getPresetById(presetId);
    if (found) {
      setStyle({ ...found.style });
      setActivePresetId(found.id);
      setVerification(null);
    }
  }, []);

  // Load state from a saved template or recent item
  const loadState = useCallback(
    (item: Template | RecentItem) => {
      setActiveType(item.type);
      setInputs((prev) => ({
        ...prev,
        [item.type]: { ...item.inputs },
      }));
      setStyle({ ...item.style });
      setActivePresetId(null);
      setVerification(null);
    },
    []
  );

  // Mark all fields of active type as touched (e.g. before save)
  const touchAll = useCallback(() => {
    const currentFields = Object.keys(inputs[activeType]);
    const nextTouched: Record<string, boolean> = {};
    currentFields.forEach((f) => {
      nextTouched[`${activeType}.${f}`] = true;
    });
    setTouched((prev) => ({ ...prev, ...nextTouched }));
  }, [activeType, inputs]);

  // Derived: Current payload string
  const currentInputs = inputs[activeType];
  const payload = useMemo(
    () => generatePayload(activeType, currentInputs),
    [activeType, currentInputs]
  );

  // Derived: Validation state
  const validation = useMemo(
    () => validateInputs(activeType, currentInputs, style.ecl),
    [activeType, currentInputs, style.ecl]
  );

  // Derived: Scan reliability analysis
  const reliability = useMemo(
    () => evaluateReliability(style, payload),
    [style, payload]
  );

  return {
    activeType,
    setActiveType,
    inputs,
    currentInputs,
    setInputField,
    style,
    setStyleField,
    updateStyle,
    activePresetId,
    applyPreset,
    touched,
    touchAll,
    payload,
    validation,
    reliability,
    verification,
    setVerification,
    loadState,
  };
}
