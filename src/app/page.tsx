export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Blood Press Logs</h1>
          <p className="mt-2 text-sm text-gray-500">계정 정보를 입력해주세요</p>
        </div>

        {/* Login Form */}
        <form className="space-y-6">
          {/* ID Field */}
          <div>
            <label 
              htmlFor="id" 
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              아이디
            </label>
            <input
              type="text"
              id="id"
              name="id"
              placeholder="아이디를 입력하세요"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]"
          >
            Login
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 flex justify-between text-sm">
          <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
            회원가입
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-600 hover:underline">
            비밀번호 찾기
          </a>
        </div>
      </div>
    </div>
  );
}
