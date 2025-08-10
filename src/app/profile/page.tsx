import { redirect } from "next/navigation";

export default function ProfilePage() {
  // 静的プロフィールページから動的ルーティングにリダイレクト
  redirect("/");
} 