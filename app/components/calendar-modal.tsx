'use client';

import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
} from "date-fns";
import { ko } from "date-fns/locale";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import type { CalendarEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CalendarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: CalendarEvent[];
}

const getEventColor = (event: CalendarEvent): string => {
  if (event.type === "session") return "bg-gray-500";
  if (event.type === "goodrich") return "bg-orange-500";
  if (event.title.includes("[위촉]")) return "bg-blue-600";
  if (event.title.includes("[해촉]")) return "bg-blue-300";
  return "bg-cyan-500";
};

const getEventTextColor = (event: CalendarEvent): string => {
  if (event.title.includes("[해촉]")) return "text-blue-900";
  return "text-white";
};

const getEventPriority = (event: CalendarEvent): number => {
  if (event.type === "session") return 1;
  if (event.type === "goodrich") return 2;
  if (event.title.includes("[위촉]")) return 3;
  if (event.title.includes("[해촉]")) return 4;
  return 5;
};

const sortEventsByPriority = (events: CalendarEvent[]) => {
  return events.slice().sort((a, b) => getEventPriority(a) - getEventPriority(b));
};

export default function CalendarModal({ open, onOpenChange, events }: CalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const currentMonthRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const key = event.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(event);
    });
    return map;
  }, [events]);

  const sortedEvents = useMemo(
    () =>
      events
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [events]
  );

  const eventsByDateForAgenda = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    sortedEvents.forEach((event) => {
      const key = event.date;
      // Skip events with invalid dates
      if (!key || key.trim() === '') {
        console.warn('이벤트에 날짜가 없습니다:', event);
        return;
      }

      // Validate date format
      const testDate = new Date(key);
      if (isNaN(testDate.getTime())) {
        console.warn('유효하지 않은 날짜 형식:', key, event);
        return;
      }

      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(event);
    });
    return Array.from(map.entries()).map(
      ([date, dateEvents]) => [date, sortEventsByPriority(dateEvents)] as [
        string,
        CalendarEvent[]
      ]
    );
  }, [sortedEvents]);

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const items = eventsByDate.get(dateStr) || [];
    return sortEventsByPriority(items);
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const currentMonthFirstIndex = useMemo(() => {
    const today = new Date();
    const index = eventsByDateForAgenda.findIndex(([date]) => {
      const eventDate = new Date(date);
      return (
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear()
      );
    });
    return index >= 0 ? index : 0;
  }, [eventsByDateForAgenda]);

  // 오늘 날짜의 인덱스 찾기
  const todayIndex = useMemo(() => {
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    return eventsByDateForAgenda.findIndex(([date]) => date === todayStr);
  }, [eventsByDateForAgenda]);

  // 오늘 날짜로 스크롤하는 함수
  const scrollToToday = () => {
    // 오늘 날짜가 있으면 오늘 날짜로, 없으면 가장 가까운 날짜로 스크롤
    const targetRef = todayRef.current || currentMonthRef.current;
    if (!targetRef) return;

    let scrollContainer = targetRef.parentElement;
    while (scrollContainer) {
      const hasOverflow = scrollContainer.scrollHeight > scrollContainer.clientHeight;
      const overflowY = window.getComputedStyle(scrollContainer).overflowY;
      if (hasOverflow && (overflowY === "auto" || overflowY === "scroll")) {
        break;
      }
      scrollContainer = scrollContainer.parentElement;
    }
    if (scrollContainer && targetRef) {
      const target = targetRef;
      const containerRect = scrollContainer.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const offsetTop =
        targetRect.top - containerRect.top + scrollContainer.scrollTop;
      scrollContainer.scrollTo({
        top: offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  // 모달이 열릴 때 모바일에서 오늘 날짜로 자동 스크롤
  useEffect(() => {
    if (!open) return;

    // 모바일에서만 자동 스크롤 실행
    const isMobile = window.innerWidth < 768; // md breakpoint
    if (!isMobile) return;

    // 1초 후 오늘 날짜로 스크롤
    const timeoutId = setTimeout(() => {
      scrollToToday();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [open, todayIndex, currentMonthFirstIndex]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full md:max-w-6xl max-h-[90vh] p-0 [&>button]:hidden flex flex-col bg-white">
        {/* sticky 헤더 영역 - 스크롤 시에도 상단에 고정 */}
        <div className="sticky top-0 z-50 bg-white border-b px-6 py-4 flex items-center justify-between flex-shrink-0">
          <DialogHeader className="flex-1 m-0">
            <DialogTitle>전체 일정 캘린더</DialogTitle>
            <DialogDescription className="sr-only">
              모든 일정을 확인할 수 있는 캘린더입니다.
            </DialogDescription>
          </DialogHeader>
          {/* 플로팅 닫기 버튼 */}
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-background border shadow-lg p-2 flex items-center justify-center w-8 h-8 flex-shrink-0"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div className="overflow-y-auto flex-1 px-6 pb-6 bg-white">

        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {format(currentDate, "yyyy년 M월", { locale: ko })}
            </h2>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div key={day} className="py-2 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-[100px] cursor-pointer rounded-lg border p-2 transition-colors",
                    isCurrentMonth ? "bg-white hover:bg-gray-50" : "bg-gray-100",
                    selectedDate && isSameDay(day, selectedDate) && "ring-2 ring-blue-500"
                  )}
                  onClick={() => {
                    setSelectedDate(day);
                    setIsDetailOpen(true);
                  }}
                >
                  <div
                    className={cn(
                      "mb-1 text-sm font-medium",
                      !isCurrentMonth && "text-gray-400"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "truncate rounded px-1 py-0.5 text-xs",
                          getEventColor(event),
                          getEventTextColor(event)
                        )}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-600">외 {dayEvents.length - 3}개</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">전체 일정 목록</h2>
            <Button
              onClick={scrollToToday}
              variant="outline"
              size="sm"
              className="text-sm"
            >
              오늘
            </Button>
          </div>
          <p className="mb-4 text-sm text-gray-600">모든 일정을 날짜순으로 확인합니다.</p>
          <div className="space-y-4">
            {eventsByDateForAgenda.map(([date, dateEvents], idx) => {
              const eventDate = new Date(date);
              const isTodayDate = isToday(eventDate);

              // Safely format date with fallback
              let formattedDate = date;
              try {
                if (!isNaN(eventDate.getTime())) {
                  formattedDate = format(eventDate, "M월 d일 (E)", { locale: ko });
                }
              } catch (error) {
                console.error('날짜 포맷팅 오류:', date, error);
              }

              return (
              <div
                key={idx}
                className="rounded-lg bg-gray-100 p-4"
                ref={idx === currentMonthFirstIndex ? currentMonthRef : (isTodayDate ? todayRef : null)}
              >
                <h3 className="mb-2 font-semibold">
                  {formattedDate}
                </h3>
                <div className="space-y-2">
                  {dateEvents.map((event, eventIdx) => (
                    <div
                      key={eventIdx}
                      className={cn(
                        "rounded-lg p-3",
                        getEventColor(event),
                        getEventTextColor(event)
                      )}
                    >
                      <div className="text-sm font-medium">{event.title}</div>
                      {event.description && (
                        <div className="mt-1 text-xs opacity-90">{event.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              );
            })}
          </div>
        </div>
        </div>
      </DialogContent>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && format(selectedDate, "M월 d일 (EEEE)", { locale: ko })}
            </DialogTitle>
            <DialogDescription>선택한 날짜의 상세 일정입니다.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] space-y-2 overflow-y-auto">
            {selectedDate &&
              getEventsForDate(selectedDate).map((event, idx) => (
                <div
                  key={idx}
                  className={cn("rounded-lg p-3", getEventColor(event), getEventTextColor(event))}
                >
                  <div className="font-medium">{event.title}</div>
                  {event.description && (
                    <div className="mt-1 text-sm opacity-90">{event.description}</div>
                  )}
                </div>
              ))}
            {selectedDate && getEventsForDate(selectedDate).length === 0 && (
              <div className="py-8 text-center text-sm text-gray-500">일정이 없습니다.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

