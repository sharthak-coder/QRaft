import React from 'react';
import { useQrStudio } from '../../hooks/useQrStudio';
import { TypeSelector } from '../forms/TypeSelector';
import { TypeForms } from '../forms/TypeForms';
import { CustomizationPanel } from '../forms/CustomizationPanel';
import { QrPreview } from '../qr/QrPreview';

export const GeneratorTab: React.FC = () => {
  const {
    activeType,
    setActiveType,
    inputs,
    setInputField,
    style,
    setStyleField,
    updateStyle,
    activePresetId,
    applyPreset,
    touched,
    payload,
    validation,
    reliability,
    verification,
    setVerification,
  } = useQrStudio();

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: QR Type Selector, Forms, and Customization Panel (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Type Selector */}
          <TypeSelector activeType={activeType} onChange={setActiveType} />

          {/* 2. Type-specific Input Form */}
          <TypeForms
            activeType={activeType}
            inputs={inputs}
            onChange={setInputField}
            errors={validation.errors}
            touched={touched}
          />

          {/* 3. Customization & Presets */}
          <CustomizationPanel
            style={style}
            onChange={setStyleField}
            activePresetId={activePresetId}
            onApplyPreset={applyPreset}
          />
        </div>

        {/* Right Column: Sticky Live QR Preview & Reliability Analysis (5 cols on desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <QrPreview
            type={activeType}
            payload={payload}
            inputs={inputs[activeType]}
            style={style}
            isValid={validation.isValid}
            errors={validation.errors}
            reliability={reliability}
            verification={verification}
            onVerificationChange={setVerification}
            onUpdateStyle={updateStyle}
          />
        </div>
      </div>
    </div>
  );
};
