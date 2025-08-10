"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface TrendingTopic {
  id: string;
  topic: string;
  postCount: number;
  category: string;
}

interface SuggestedUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  isFollowing: boolean;
}

const mockTrendingTopics: TrendingTopic[] = [
  { id: "1", topic: "#プログラミング", postCount: 1234, category: "テクノロジー" },
  { id: "2", topic: "#NextJS", postCount: 567, category: "開発" },
  { id: "3", topic: "#AI", postCount: 890, category: "テクノロジー" },
  { id: "4", topic: "#TypeScript", postCount: 456, category: "開発" },
  { id: "5", topic: "#React", postCount: 789, category: "開発" }
];

const mockSuggestedUsers: SuggestedUser[] = [
  {
    id: "1",
    username: "dev_user1",
    displayName: "開発者1",
    avatarUrl: null,
    bio: "フルスタック開発者",
    isFollowing: false
  },
  {
    id: "2",
    username: "ai_expert",
    displayName: "AI専門家",
    avatarUrl: null,
    bio: "機械学習エンジニア",
    isFollowing: true
  },
  {
    id: "3",
    username: "web_designer",
    displayName: "Webデザイナー",
    avatarUrl: null,
    bio: "UI/UXデザイナー",
    isFollowing: false
  }
];

export function RightSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState(mockSuggestedUsers);

  const handleFollowToggle = (userId: string) => {
    setSuggestedUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 検索機能を実装
    console.log('検索クエリ:', searchQuery);
  };

  return (
    <aside className="w-80 h-screen sticky top-0 p-4 border-l border-gray-200 bg-white overflow-y-auto">
      <div className="space-y-6">
        {/* 検索バー */}
        <div>
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </form>
        </div>

        {/* トレンドトピック */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">トレンド</h3>
          <div className="space-y-3">
            {mockTrendingTopics.map((topic) => (
              <div key={topic.id} className="group cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {topic.topic}
                    </p>
                    <p className="text-xs text-gray-500">{topic.category}</p>
                    <p className="text-xs text-gray-500">{topic.postCount.toLocaleString()}件の投稿</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* おすすめユーザー */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">おすすめユーザー</h3>
          <div className="space-y-3">
            {suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <Avatar
                  src={user.avatarUrl}
                  alt={user.displayName}
                  fallback={user.displayName}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                  {user.bio && (
                    <p className="text-xs text-gray-600 truncate">{user.bio}</p>
                  )}
                </div>
                <Button
                  variant={user.isFollowing ? "outline" : "primary"}
                  size="sm"
                  onClick={() => handleFollowToggle(user.id)}
                  className="flex-shrink-0"
                >
                  {user.isFollowing ? "フォロー中" : "フォロー"}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* フッターリンク */}
        <div className="text-xs text-gray-500 space-y-2">
          <div className="flex flex-wrap gap-2">
            <a href="#" className="hover:text-gray-700 transition-colors">利用規約</a>
            <span>·</span>
            <a href="#" className="hover:text-gray-700 transition-colors">プライバシーポリシー</a>
            <span>·</span>
            <a href="#" className="hover:text-gray-700 transition-colors">Cookie</a>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="#" className="hover:text-gray-700 transition-colors">広告</a>
            <span>·</span>
            <a href="#" className="hover:text-gray-700 transition-colors">ビジネス</a>
            <span>·</span>
            <a href="#" className="hover:text-gray-700 transition-colors">開発者</a>
          </div>
          <p>© 2024 SNS with AI Driven</p>
        </div>
      </div>
    </aside>
  );
} 