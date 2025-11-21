"use client";

import ResultPage from "@/app/components/result-page";

interface ResultRouteProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function InfoAppointResultPage({ searchParams }: ResultRouteProps) {
  const params = await searchParams;
  const dateParam = typeof params.date === "string" ? params.date : "";

  return <ResultPage selectedDate={dateParam} />;
}

