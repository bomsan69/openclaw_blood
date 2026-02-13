'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface BloodPressureData {
  high: string;
  low: string;
  plus: string;
}

export default function WriterPage() {
  const [firstResult, setFirstResult] = useState<BloodPressureData>({
    high: '',
    low: '',
    plus: ''
  });
  
  const [secondResult, setSecondResult] = useState<BloodPressureData>({
    high: '',
    low: '',
    plus: ''
  });
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        // TODO: OCR 기능 구현 시 여기서 이미지 처리
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // TODO: 데이터 저장 로직
    console.log('First Result:', firstResult);
    console.log('Second Result:', secondResult);
    alert('저장되었습니다!');
  };

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    placeholder 
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void;
    placeholder: string;
  }) => (
    <div className="flex flex-col items-center">
      <label className="text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full max-w-[80px] h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">Blood Press Log</h1>
          <Link 
            href="/list"
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            list
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Camera Section */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <button
            onClick={handleCameraClick}
            className="w-full aspect-[16/9] bg-gray-200 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-gray-100 transition-all active:scale-[0.98]"
          >
            {capturedImage ? (
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <>
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-lg font-medium text-gray-600">사진 촬영</span>
                <span className="text-xs text-gray-400 mt-1">혈압기 화면을 찍어주세요</span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageCapture}
            className="hidden"
          />
          {capturedImage && (
            <button
              onClick={() => setCapturedImage(null)}
              className="mt-2 w-full py-2 text-sm text-red-500 hover:text-red-600"
            >
              사진 다시 찍기
            </button>
          )}
        </div>

        {/* First Result */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">First result</h2>
          <div className="flex justify-around">
            <InputField
              label="High"
              value={firstResult.high}
              onChange={(v) => setFirstResult({...firstResult, high: v})}
              placeholder="120"
            />
            <InputField
              label="Low"
              value={firstResult.low}
              onChange={(v) => setFirstResult({...firstResult, low: v})}
              placeholder="80"
            />
            <InputField
              label="Plus"
              value={firstResult.plus}
              onChange={(v) => setFirstResult({...firstResult, plus: v})}
              placeholder="72"
            />
          </div>
        </div>

        {/* Second Result */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Second result</h2>
          <div className="flex justify-around">
            <InputField
              label="High"
              value={secondResult.high}
              onChange={(v) => setSecondResult({...secondResult, high: v})}
              placeholder="120"
            />
            <InputField
              label="Low"
              value={secondResult.low}
              onChange={(v) => setSecondResult({...secondResult, low: v})}
              placeholder="80"
            />
            <InputField
              label="Plus"
              value={secondResult.plus}
              onChange={(v) => setSecondResult({...secondResult, plus: v})}
              placeholder="72"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-4 bg-gray-800 text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-gray-900 active:scale-[0.98] transition-all"
        >
          SAVE
        </button>
      </main>
    </div>
  );
}
