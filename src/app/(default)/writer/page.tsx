export default function WriterPage() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">혈압 기록 작성</h2>
      <p className="text-gray-600 mb-6">새로운 혈압 기록을 입력하세요.</p>
      
      <form className="space-y-6 max-w-md">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            날짜
          </label>
          <input
            type="date"
            id="date"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="systolic" className="block text-sm font-medium text-gray-700 mb-1">
              수축기 (mmHg)
            </label>
            <input
              type="number"
              id="systolic"
              placeholder="120"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          
          <div>
            <label htmlFor="diastolic" className="block text-sm font-medium text-gray-700 mb-1">
              이완기 (mmHg)
            </label>
            <input
              type="number"
              id="diastolic"
              placeholder="80"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="pulse" className="block text-sm font-medium text-gray-700 mb-1">
            맥박 (bpm)
          </label>
          <input
            type="number"
            id="pulse"
            placeholder="72"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
            메모
          </label>
          <textarea
            id="note"
            rows={3}
            placeholder="특이사항이 있으면 입력하세요"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          저장하기
        </button>
      </form>
    </div>
  );
}
