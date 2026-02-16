'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BloodPressureData {
  high: string;
  low: string;
  plus: string;
}

export default function WriterPage() {
  const router = useRouter();
  const [user, setUser] = useState<{id: number, username: string} | null>(null);
  const [loading, setLoading] = useState(false);
  
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
  
  const [measuredDate, setMeasuredDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recognizing, setRecognizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nextSlotRef = useRef<'first' | 'second'>('first');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(stored));
  }, [router]);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRecognize = async () => {
    if (!capturedImage) {
      alert('먼저 사진을 촬영해주세요.');
      return;
    }

    setRecognizing(true);
    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: capturedImage })
      });

      if (!res.ok) throw new Error('OCR failed');

      const data = await res.json();
      const recognized: BloodPressureData = {
        high: data.high,
        low: data.low,
        plus: data.plus
      };

      const isFirstEmpty = !firstResult.high && !firstResult.low && !firstResult.plus;
      const isSecondEmpty = !secondResult.high && !secondResult.low && !secondResult.plus;

      if (isFirstEmpty) {
        setFirstResult(recognized);
        nextSlotRef.current = 'second';
      } else if (isSecondEmpty) {
        setSecondResult(recognized);
        nextSlotRef.current = 'first';
      } else {
        // 둘 다 값이 있으면 순서대로 반복 대체
        if (nextSlotRef.current === 'first') {
          setFirstResult(recognized);
          nextSlotRef.current = 'second';
        } else {
          setSecondResult(recognized);
          nextSlotRef.current = 'first';
        }
      }

      setCapturedImage(null);
      alert('인식 완료! 값이 자동으로 입력되었습니다.');
    } catch (err) {
      alert('OCR 인식 중 오류가 발생했습니다.');
    } finally {
      setRecognizing(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!firstResult.high || !firstResult.low || !firstResult.plus) {
      alert('첫 번째 측정값을 모두 입력해주세요.');
      return;
    }

    const hasSecond = secondResult.high && secondResult.low && secondResult.plus;

    const high = hasSecond
      ? Math.round((Number(firstResult.high) + Number(secondResult.high)) / 2)
      : Number(firstResult.high);
    const low = hasSecond
      ? Math.round((Number(firstResult.low) + Number(secondResult.low)) / 2)
      : Number(firstResult.low);
    const plus = hasSecond
      ? Math.round((Number(firstResult.plus) + Number(secondResult.plus)) / 2)
      : Number(firstResult.plus);

    setLoading(true);
    try {
      const res = await fetch('/api/blood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          high,
          low,
          plus,
          measuredAt: measuredDate
        })
      });

      if (!res.ok) throw new Error('Failed to save');

      alert('저장되었습니다!');
      router.push('/list');
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
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

  if (!user) return null;

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
        {/* 사진 촬영 영역 */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div 
            onClick={handleCameraClick}
            className="w-full aspect-[16/9] bg-gray-200 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-400 hover:bg-gray-100 transition-all active:scale-[0.98]"
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
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageCapture}
            className="hidden"
          />
          
          {/* 인식 버튼 */}
          <button
            onClick={handleRecognize}
            disabled={recognizing || !capturedImage}
            className="w-full mt-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {recognizing ? '인식 중...' : '인식'}
          </button>
          
          {capturedImage && (
            <button
              onClick={() => setCapturedImage(null)}
              className="w-full mt-2 py-2 text-sm text-red-500 hover:text-red-600"
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
          disabled={loading}
          className="w-full py-4 bg-gray-800 text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '저장 중...' : 'SAVE'}
        </button>
      </main>
    </div>
  );
}
