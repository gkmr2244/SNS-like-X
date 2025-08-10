"use client";

import { Timeline } from "@/components/Timeline";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <LeftSidebar />
        <Timeline />
        <RightSidebar />
      </div>
    </div>
  );
}
