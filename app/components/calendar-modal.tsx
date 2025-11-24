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
} from "date-fns";
import { ko } from "date-fns/locale";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
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

  useEffect(() => {
    if (open && currentMonthRef.current) {
      setTimeout(() => {
        if (!currentMonthRef.current) return;
        let scrollContainer = currentMonthRef.current.parentElement;
        while (scrollContainer) {
          const hasOverflow = scrollContainer.scrollHeight > scrollContainer.clientHeight;
          const overflowY = window.getComputedStyle(scrollContainer).overflowY;
          if (hasOverflow && (overflowY === "auto" || overflowY === "scroll")) {
            break;
          }
          scrollContainer = scrollContainer.parentElement;
        }
        if (scrollContainer && currentMonthRef.current) {
          const target = currentMonthRef.current;
          const containerRect = scrollContainer.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          const offsetTop =
            targetRect.top - containerRect.top + scrollContainer.scrollTop;
          scrollContainer.scrollTo({
            top: offsetTop - 100,
            behavior: "smooth",
          });
        }
      }, 300);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full md:max-w-6xl max-h-[90vh] overflow-y-auto pt-12">
        <DialogHeader>
          <DialogTitle>전체 일정 캘린더</DialogTitle>
          <DialogDescription className="sr-only">
            모든 일정을 확인할 수 있는 캘린더입니다.
          </DialogDescription>
        </DialogHeader>

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
          <h2 className="mb-4 text-lg font-semibold">전체 일정 목록</h2>
          <p className="mb-4 text-sm text-gray-600">모든 일정을 날짜순으로 확인합니다.</p>
          <div className="space-y-4">
            {eventsByDateForAgenda.map(([date, dateEvents], idx) => (
              <div
                key={idx}
                className="rounded-lg bg-gray-100 p-4"
                ref={idx === currentMonthFirstIndex ? currentMonthRef : null}
              >
                <h3 className="mb-2 font-semibold">
                  {format(new Date(date), "M월 d일 (E)", { locale: ko })}
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
            ))}
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

