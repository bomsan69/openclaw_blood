export default function ListPage() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">혈압 기록 목록</h2>
      <p className="text-gray-600">여기에 혈압 기록 목록이 표시됩니다.</p>
      
      <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">날짜</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">수축기</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">이완기</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">맥박</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            <tr>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">2024-01-15</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">120</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">80</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">72</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
