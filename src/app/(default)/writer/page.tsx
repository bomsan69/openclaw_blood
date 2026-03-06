'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface BloodPressureData {
  high: string;
  low: string;
  plus: string;
}

function BpInputGroup({
  label,
  data,
  onChange,
  number,
}: {
  label: string;
  data: BloodPressureData;
  onChange: (data: BloodPressureData) => void;
  number: number;
}) {
  return (
    <div className="bg-white rounded-xl px-4 py-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
          {number}
        </span>
        <h2 className="text-sm font-semibold text-gray-700">{label}</h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="block text-[10px] text-gray-400 mb-1 text-center">SYS</label>
          <input
            type="number"
            inputMode="numeric"
            value={data.high}
            onChange={(e) => onChange({ ...data, high: e.target.value })}
            placeholder="120"
            className="w-full h-12 text-center text-xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none focus:bg-white transition-colors"
          />
        </div>
        <span className="text-gray-300 text-lg pt-4">/</span>
        <div className="flex-1">
          <label className="block text-[10px] text-gray-400 mb-1 text-center">DIA</label>
          <input
            type="number"
            inputMode="numeric"
            value={data.low}
            onChange={(e) => onChange({ ...data, low: e.target.value })}
            placeholder="80"
            className="w-full h-12 text-center text-xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none focus:bg-white transition-colors"
          />
        </div>
        <div className="w-px h-10 bg-gray-200 mx-1" />
        <div className="flex-1">
          <label className="block text-[10px] text-gray-400 mb-1 text-center">맥박</label>
          <input
            type="number"
            inputMode="numeric"
            value={data.plus}
            onChange={(e) => onChange({ ...data, plus: e.target.value })}
            placeholder="72"
            className="w-full h-12 text-center text-xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none focus:bg-white transition-colors"
          />
        </div>
      </div>
    </div>
  );
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
  const [period, setPeriod] = useState('아침');

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recognizing, setRecognizing] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const nextSlotRef = useRef<'first' | 'second'>('first');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(stored));
  }, [router]);

  const handlePhotoAreaClick = () => {
    photoInputRef.current?.click();
  };

  const handleRemovePhoto = () => {
    setCapturedImage(null);
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
    } catch {
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
          measuredAt: measuredDate,
          period
        })
      });

      if (!res.ok) throw new Error('Failed to save');

      alert('저장되었습니다!');
      router.push('/list');
    } catch {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">혈압 기록</h1>
          <span className="text-xs text-gray-400">{user.username}</span>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 pt-4 pb-6 space-y-3">
        {/* Photo Section */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div
            onClick={handlePhotoAreaClick}
            className="w-full aspect-[2/1] bg-gray-50 flex flex-col items-center justify-center relative cursor-pointer active:bg-gray-100 transition-colors"
          >
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-400">탭하여 사진 추가</span>
              </div>
            )}
          </div>

          {/* Hidden Input for Photo Selection */}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageCapture}
            className="hidden"
          />

          {/* Photo actions */}
          {capturedImage && (
            <div className="px-4 py-2 flex justify-end">
              <button
                onClick={handleRemovePhoto}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                사진 삭제
              </button>
            </div>
          )}

          {/* OCR button */}
          <div className="px-4 py-3 flex gap-2">
            <button
              onClick={handleRecognize}
              disabled={recognizing || !capturedImage}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg active:bg-blue-700 transition-colors disabled:opacity-40"
            >
              {recognizing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  인식 중
                </span>
              ) : '인식하기'}
            </button>
            {capturedImage && (
              <button
                onClick={() => setCapturedImage(null)}
                className="px-4 py-2.5 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg active:bg-gray-200 transition-colors"
              >
                다시 찍기
              </button>
            )}
          </div>
        </div>

        {/* Date and Period Picker */}
        <div className="bg-white rounded-xl px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">측정일</span>
            <input
              type="date"
              value={measuredDate}
              onChange={(e) => setMeasuredDate(e.target.value)}
              className="text-sm font-medium text-gray-800 bg-transparent border-none focus:outline-none text-right"
            />
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-sm text-gray-500">시간대</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="text-sm font-medium text-gray-800 bg-transparent border-none focus:outline-none text-right cursor-pointer"
            >
              <option value="아침">아침</option>
              <option value="오전">오전</option>
              <option value="오후">오후</option>
              <option value="저녁">저녁</option>
            </select>
          </div>
        </div>

        {/* First Measurement */}
        <BpInputGroup
          label="1차 측정"
          number={1}
          data={firstResult}
          onChange={setFirstResult}
        />

        {/* Second Measurement */}
        <BpInputGroup
          label="2차 측정"
          number={2}
          data={secondResult}
          onChange={setSecondResult}
        />

        {/* Average Preview */}
        {firstResult.high && secondResult.high && (
          <div className="bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-blue-600 font-medium">평균값</span>
            <span className="text-sm font-bold text-blue-700">
              {Math.round((Number(firstResult.high) + Number(secondResult.high)) / 2)}
              {' / '}
              {Math.round((Number(firstResult.low) + Number(secondResult.low)) / 2)}
              <span className="text-blue-400 font-normal ml-2">
                맥박 {Math.round((Number(firstResult.plus) + Number(secondResult.plus)) / 2)}
              </span>
            </span>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-4 bg-gray-900 text-white text-base font-semibold rounded-xl active:scale-[0.98] transition-all disabled:opacity-40"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              저장 중
            </span>
          ) : '저장'}
        </button>
      </div>
    </div>
  );
}
