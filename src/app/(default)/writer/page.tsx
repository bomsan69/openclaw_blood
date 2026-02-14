'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(stored));
  }, [router]);

  const handleSave = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 첫 번째 결과 저장
    if (firstResult.high && firstResult.low && firstResult.plus) {
      setLoading(true);
      try {
        const res = await fetch('/api/blood', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            high: Number(firstResult.high),
            low: Number(firstResult.low),
            plus: Number(firstResult.plus),
            measuredAt: measuredDate
          })
        });

        if (!res.ok) throw new Error('Failed to save');

        // 두 번째 결과 저장
        if (secondResult.high && secondResult.low && secondResult.plus) {
          const res2 = await fetch('/api/blood', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              high: Number(secondResult.high),
              low: Number(secondResult.low),
              plus: Number(secondResult.plus),
              measuredAt: measuredDate
            })
          });
          if (!res2.ok) throw new Error('Failed to save second result');
        }

        alert('저장되었습니다!');
        router.push('/list');
      } catch (err) {
        alert('저장 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('첫 번째 측정값을 모두 입력해주세요.');
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
        {/* 날짜 선택 */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">측정 날짜</label>
          <input
            type="date"
            value={measuredDate}
            onChange={(e) => setMeasuredDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
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
