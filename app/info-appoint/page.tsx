"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { format, isWednesday } from "date-fns";
import { ko } from "date-fns/locale";

import BottomNavigation from "@/app/components/BottomNavigation";
import CalendarModal from "@/app/components/calendar-modal";
import NavigationHeader from "@/app/components/NavigationHeader";
import TutorialOverlay from "@/app/components/tutorial-overlay";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Calendar } from "@/app/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import type { SheetData } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function InfoAppointPage() {
  const router = useRouter();
  const [data, setData] = useState<SheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isAllCalendarOpen, setIsAllCalendarOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const basePath = process.env.__NEXT_ROUTER_BASEPATH || "";
        const response = await fetch(`${basePath}/data.json`);
        if (!response.ok) throw new Error("데이터 로딩 실패");
        const json = (await response.json()) as SheetData;
        setData(json);
      } catch (error) {
        console.error("데이터 로딩 실패", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    if (typeof window !== "undefined") {
      const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
      if (!hasSeenTutorial) {
        setTimeout(() => setShowTutorial(true), 500);
      }
    }
  }, []);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("hasSeenTutorial", "true");
    }
  };

  const allChecked = data ? checkedItems.size === data.checklist.length : false;

  const handleCheckChange = (id: string, checked: boolean) => {
    const next = new Set(checkedItems);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setCheckedItems(next);
  };

  const handleSearch = () => {
    if (!selectedDate) return;
    setIsSearching(true);
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    setTimeout(() => {
      router.push(`/info-appoint/result?date=${dateStr}`);
    }, 800);
  };

  const disableNonWednesdays = (date: Date) => !isWednesday(date);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="text-gray-600">데이터 로딩 중..</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="mb-4 text-6xl text-red-500">⚠️</div>
          <h2 className="mb-2 text-xl font-semibold text-gray-800">데이터 로딩 실패</h2>
          <p className="mb-4 text-gray-600">데이터를 불러올 수 없습니다.</p>
          <Button onClick={() => window.location.reload()}>페이지 새로고침</Button>
        </div>
      </div>
    );
  }

  if (isSearching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="mb-2 text-xl font-semibold text-gray-900">위촉일정 조회 중</div>
          <div className="text-gray-600">잠시만 기다려 주세요..</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <NavigationHeader />

      <div className="px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">굿리치 위촉일정</h1>

          <div className="mb-8 flex justify-end gap-2">
            <Button
              variant="outline"
              className="gap-2 transition-all duration-150 active:scale-95"
              onClick={() => setIsAllCalendarOpen(true)}
              data-tutorial="calendar-button"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden md:inline">전체위촉일정보기</span>
            </Button>
            <Button
              className="gap-2 bg-goodrich-yellow-light transition-all duration-150 active:scale-95 hover:opacity-90"
              onClick={() => router.push("/info-appoint/application-flow")}
            >
              협회말소하셨나요?
            </Button>
          </div>

          <Card className="mb-6" data-tutorial="required-documents">
            <CardHeader>
              <CardTitle>위촉필요서류</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{data.requiredDocuments}</CardDescription>
            </CardContent>
          </Card>

          <Card className="mb-6" data-tutorial="checklist">
            <CardHeader>
              <CardTitle>위촉 체크리스트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.checklist.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={item.id}
                    checked={checkedItems.has(item.id)}
                    onCheckedChange={(checked) => handleCheckChange(item.id, Boolean(checked))}
                  />
                  <label
                    htmlFor={item.id}
                    className="cursor-pointer text-base leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.text}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>위촉일정을 조회</CardTitle>
              <CardDescription>
                위촉지원시스템 서류작성 완료는 매주 수요일 마감입니다. 서류작성 완료일을 선택해 주세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                      disabled={!allChecked}
                      data-tutorial="date-selector"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP", { locale: ko })
                      ) : (
                        <span>서류완료일선택</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setIsCalendarOpen(false);
                      }}
                      disabled={disableNonWednesdays}
                      initialFocus
                      locale={ko}
                      weekStartsOn={0}
                      modifiers={{
                        wednesday: (date) => isWednesday(date),
                      }}
                      modifiersClassNames={{
                        wednesday: "text-red-600 font-bold",
                      }}
                    />
                  </PopoverContent>
                </Popover>

                <Button
                  className="gap-2 bg-goodrich-yellow-light transition-all duration-150 active:scale-95 hover:opacity-90"
                  disabled={!allChecked || !selectedDate}
                  onClick={handleSearch}
                  data-tutorial="search-button"
                >
                  <Search className="h-4 w-4" />
                  조회
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CalendarModal
        open={isAllCalendarOpen}
        onOpenChange={setIsAllCalendarOpen}
        events={data.calendarEvents}
      />

      <TutorialOverlay open={showTutorial} onClose={handleCloseTutorial} />

      <BottomNavigation />
    </div>
  );
}
