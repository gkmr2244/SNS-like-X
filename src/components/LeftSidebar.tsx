"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface NavigationItem {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    id: "home",
    href: "/",
    label: "ホーム",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      </svg>
    )
  },
  {
    id: "messages",
    href: "#",
    label: "メッセージ",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    )
  },
  {
    id: "profile",
    href: "/profile",
    label: "プロフィール",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    id: "settings",
    href: "#",
    label: "設定",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

export function LeftSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const renderNavigationItem = (item: NavigationItem, isMobile: boolean = false) => {
    const baseClasses = cn(
      "flex items-center space-x-0 md:space-x-3 p-2 md:p-3 rounded-lg hover:bg-gray-100 transition-colors",
      isMobile ? "justify-start" : "justify-center md:justify-start"
    );

    if (item.external) {
      return (
        <a key={item.id} href={item.href} className={baseClasses}>
          {item.icon}
          <span className="hidden md:inline font-medium">{item.label}</span>
        </a>
      );
    }

    return (
      <Link key={item.id} href={item.href} className={baseClasses} onClick={isMobile ? closeMobileMenu : undefined}>
        {item.icon}
        <span className="hidden md:inline font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-16 md:w-64 h-screen sticky top-0 p-2 md:p-4 border-r border-gray-200 bg-white">
      <div className="space-y-4 md:space-y-6">
        {/* ハンバーガーメニューボタン（モバイルのみ） */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="w-8 h-8 p-0"
            aria-label="メニューを開く"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>

        {/* ユーザープロフィール */}
        <div className="flex items-center space-x-3">
          <Avatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            alt="ユーザー"
            fallback="ユーザー"
            size="md"
            className="flex-shrink-0"
          />
          <div className="hidden md:block">
            <p className="font-semibold text-gray-900">ユーザー</p>
            <p className="text-sm text-gray-500">@user</p>
          </div>
        </div>

        {/* モバイル用トグルメニュー */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-2 right-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
            <nav className="space-y-2">
              {navigationItems.map(item => renderNavigationItem(item, true))}
            </nav>
          </div>
        )}

        {/* デスクトップ用ナビゲーションメニュー */}
        <nav className="space-y-1 md:space-y-2">
          {navigationItems.map(item => renderNavigationItem(item))}
        </nav>

        {/* 投稿ボタン */}
        <Button className="w-full" size="md">
          <span className="hidden md:inline">投稿する</span>
          <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Button>
      </div>
    </aside>
  );
} 