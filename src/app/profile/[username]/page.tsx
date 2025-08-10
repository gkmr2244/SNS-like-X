import { notFound } from "next/navigation";
import Link from "next/link";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

type ProfileWithPosts = {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  posts: Array<{
    id: string;
    content: string;
    imageUrl: string | null;
    likesCount: number;
    repostsCount: number;
    repliesCount: number;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  }>;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
};

async function getProfileData(username: string): Promise<ProfileWithPosts | null> {
  try {
    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!profile) {
      return null;
    }

    return profile as ProfileWithPosts;
  } catch (error) {
    console.error("プロフィールデータの取得に失敗しました:", error);
    return null;
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const profile = await getProfileData(username);

  if (!profile) {
    notFound();
  }

  const postsCount = profile._count.posts;
  const followersCount = profile._count.followers;
  const followingCount = profile._count.following;

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
                <h1 className="text-xl font-bold text-gray-900">{profile.displayName || profile.username}</h1>
                <p className="text-sm text-gray-500">{postsCount} ツイート</p>
              </div>
            </div>
          </div>

          {/* プロフィールヘッダー */}
          <div className="relative">
            {/* カバー画像 */}
            <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
            
            {/* プロフィール画像とボタン */}
            <div className="px-4 pb-4">
              <div className="flex justify-between items-end -mt-16">
                <div className="w-32 h-32 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center text-white text-4xl font-bold">
                  {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : profile.username.charAt(0).toUpperCase()}
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-800 transition-colors">
                  フォロー
                </button>
              </div>
              
              {/* プロフィール情報 */}
              <div className="mt-4">
                <h2 className="text-2xl font-bold text-gray-900">{profile.displayName || profile.username}</h2>
                <p className="text-gray-500">@{profile.username}</p>
                {profile.bio && (
                  <p className="mt-3 text-gray-900">{profile.bio}</p>
                )}
                
                {/* プロフィール詳細 */}
                <div className="flex items-center space-x-4 mt-3 text-gray-500 text-sm">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6M5 7h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
                    </svg>
                    <span>{formatDistanceToNow(profile.createdAt, { addSuffix: true, locale: ja })}に登録</span>
                  </div>
                </div>
                
                {/* フォロー情報 */}
                <div className="flex items-center space-x-4 mt-3">
                  <a href="#" className="hover:underline">
                    <span className="font-bold text-gray-900">{followingCount}</span>
                    <span className="text-gray-500 ml-1">フォロー中</span>
                  </a>
                  <a href="#" className="hover:underline">
                    <span className="font-bold text-gray-900">{followersCount}</span>
                    <span className="text-gray-500 ml-1">フォロワー</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* タブナビゲーション */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button className="flex-1 py-4 px-4 text-center font-semibold text-gray-900 border-b-2 border-blue-500">
                ツイート
              </button>
              <button className="flex-1 py-4 px-4 text-center font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                ツイートと返信
              </button>
              <button className="flex-1 py-4 px-4 text-center font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                メディア
              </button>
              <button className="flex-1 py-4 px-4 text-center font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                いいね
              </button>
            </nav>
          </div>

          {/* ツイート一覧 */}
          <div className="divide-y divide-gray-200">
            {profile.posts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>まだ投稿がありません</p>
              </div>
            ) : (
              profile.posts.map((post) => (
                <article key={post.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : profile.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{profile.displayName || profile.username}</h3>
                        <span className="text-gray-500 text-sm">@{profile.username}</span>
                        <span className="text-gray-500 text-sm">·</span>
                        <time className="text-gray-500 text-sm">
                          {formatDistanceToNow(post.createdAt, { addSuffix: true, locale: ja })}
                        </time>
                      </div>
                      <p className="mt-1 text-gray-900">{post.content}</p>
                      <div className="flex items-center justify-between mt-3 max-w-md">
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="text-sm">{post.repliesCount}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span className="text-sm">{post.repostsCount}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-sm">{post.likesCount}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
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