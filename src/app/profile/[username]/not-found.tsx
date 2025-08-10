import Link from "next/link";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex max-w-7xl mx-auto">
        {/* モバイルでは非表示、タブレット以上で表示 */}
        <div className="hidden md:block">
          <LeftSidebar />
        </div>
        <main className="flex-1 w-full md:max-w-2xl border-r border-gray-200 bg-white">
          {/* ヘッダー */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ユーザーが見つかりません</h1>
              </div>
            </div>
          </div>

          {/* エラーメッセージ */}
          <div className="p-8 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ユーザーが見つかりません</h2>
            <p className="text-gray-500 mb-6">
              お探しのユーザーは存在しないか、削除されている可能性があります。
            </p>
            <Link 
              href="/"
              className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors"
            >
              ホームに戻る
            </Link>
          </div>
        </main>
        {/* モバイル・タブレットでは非表示、デスクトップで表示 */}
        <div className="hidden lg:block">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
} 