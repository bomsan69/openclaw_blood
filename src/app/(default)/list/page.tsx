'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

interface BloodPressureRecord {
  id: number;
  high: number;
  low: number;
  plus: number;
  measured_at: string;
  created_at: string;
}

interface ApiResponse {
  records: BloodPressureRecord[];
  total: number;
  page: number;
  totalPages: number;
}

function getBpLevel(high: number, low: number): { label: string; color: string; bg: string } {
  if (high >= 180 || low >= 120) return { label: '위험', color: 'text-red-600', bg: 'bg-red-50' };
  if (high >= 140 || low >= 90) return { label: '높음', color: 'text-orange-600', bg: 'bg-orange-50' };
  if (high >= 120 || low >= 80) return { label: '주의', color: 'text-amber-600', bg: 'bg-amber-50' };
  return { label: '정상', color: 'text-emerald-600', bg: 'bg-emerald-50' };
}

export default function ListPage() {
  const router = useRouter();
  const [user, setUser] = useState<{id: number, username: string} | null>(null);
  const [records, setRecords] = useState<BloodPressureRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/');
      return;
    }
    const parsed = JSON.parse(stored);
    setUser(parsed);
    fetchRecords(parsed.id, currentPage);
  }, [router, currentPage]);

  const fetchRecords = async (userId: number, page: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        userId: String(userId),
        page: String(page),
        limit: String(itemsPerPage)
      });

      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`/api/blood?${params}`);
      const data: ApiResponse = await res.json();

      if (res.ok) {
        setRecords(data.records);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setCurrentPage(1);
    setFilterOpen(false);
    if (user) fetchRecords(user.id, 1);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
    if (user) fetchRecords(user.id, 1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatDateFull = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} (${days[date.getDay()]})`;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleDownloadExcel = async () => {
    if (!user) return;

    try {
      const params = new URLSearchParams({
        userId: String(user.id),
        page: '1',
        limit: '9999'
      });

      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`/api/blood?${params}`);
      const data: ApiResponse = await res.json();

      if (!res.ok || !data.records.length) {
        alert('다운로드할 데이터가 없습니다.');
        return;
      }

      const excelData = data.records.map((record, index) => ({
        'No': index + 1,
        '측정일': formatDateFull(record.measured_at),
        '수축기(High)': record.high,
        '이완기(Low)': record.low,
        '맥박(Plus)': record.plus
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      ws['!cols'] = [
        { wch: 5 },
        { wch: 20 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 }
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '혈압기록');

      const fileName = `혈압기록_${startDate || 'all'}_${endDate || 'all'}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (err) {
      console.error('Download failed:', err);
      alert('엑셀 다운로드 중 오류가 발생했습니다.');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">기록 목록</h1>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`p-2 rounded-full transition-colors ${
                filterOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-500 active:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            <button
              onClick={handleDownloadExcel}
              className="p-2 rounded-full text-gray-500 active:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-gray-500 active:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Collapsible Filter */}
        <div
          className={`overflow-hidden transition-all duration-200 ${
            filterOpen ? 'max-h-48' : 'max-h-0'
          }`}
        >
          <div className="max-w-md mx-auto px-4 pb-3 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none text-gray-800"
              />
              <span className="text-gray-300 text-sm">~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-400 focus:outline-none text-gray-800"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleFilter}
                className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg active:bg-blue-700 transition-colors"
              >
                적용
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg active:bg-gray-200 transition-colors"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 pt-3 pb-4">
        {/* Summary bar */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-400">
            총 <span className="font-semibold text-gray-600">{total}</span>건
          </p>
          {(startDate || endDate) && (
            <p className="text-xs text-gray-400">
              {startDate && formatDate(startDate)} ~ {endDate && formatDate(endDate)}
            </p>
          )}
        </div>

        {/* Records */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg className="w-12 h-12 mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">기록이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-2">
            {records.map((record) => {
              const level = getBpLevel(record.high, record.low);
              return (
                <div
                  key={record.id}
                  className="bg-white rounded-xl px-4 py-3 flex items-center gap-4"
                >
                  {/* Date */}
                  <div className="flex-shrink-0 text-center w-12">
                    <p className="text-lg font-bold text-gray-800 leading-none">
                      {new Date(record.measured_at).getDate()}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(record.measured_at).getFullYear()}.{new Date(record.measured_at).getMonth() + 1}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-10 bg-gray-100 flex-shrink-0" />

                  {/* BP Values */}
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold text-gray-900">{record.high}</span>
                        <span className="text-gray-300">/</span>
                        <span className="text-xl font-bold text-gray-900">{record.low}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        맥박 <span className="text-gray-600 font-medium">{record.plus}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${level.color} ${level.bg}`}>
                    {level.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 disabled:opacity-30 active:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 active:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 disabled:opacity-30 active:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
