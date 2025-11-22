"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ResultPage from "@/app/info-appoint/components/ResultPage";

function ResultPageWrapper() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date") || "YYYY-MM-DD";

  return <ResultPage selectedDate={dateParam} />;
}

export default function InfoAppointResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center"><div className="text-gray-600">로딩 중...</div></div>}>
      <ResultPageWrapper />
    </Suspense>
  );
}

