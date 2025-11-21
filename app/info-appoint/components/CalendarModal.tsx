'use client';

import { useState, useMemo, useEffect, useRef } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/app/info-appoint/types";

interface CalendarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: CalendarEvent[];
}

const getEventColor = (event: CalendarEvent) => {
  if (event.type === "session") return "bg-gray-500";
  if (event.type === "goodrich") return "bg-orange-500";
  if (event.title.includes("[?ÑÏ¥â]")) return "bg-blue-600";
  if (event.title.includes("[?¥Ï¥â]")) return "bg-blue-300";
  return "bg-cyan-500";
};

const getEventTextColor = (event: CalendarEvent) => {
  if (event.title.includes("[?¥Ï¥â]")) return "text-blue-900";
  return "text-white";
};

const getEventPriority = (event: CalendarEvent) => {
  if (event.type === "session") return 1;
  if (event.type === "goodrich") return 2;
  if (event.title.includes("[?ÑÏ¥â]")) return 3;
  if (event.title.includes("[?¥Ï¥â]")) return 4;
  return 5;
};

const sortEvents = (events: CalendarEvent[]) =>
  events.slice().sort((a, b) => getEventPriority(a) - getEventPriority(b));

export default function CalendarModal({
  open,
  onOpenChange,
  events,
}: CalendarModalProps) {
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
    return Array.from(map.entries()).map(([date, value]) => [
      date,
      sortEvents(value),
    ]) as [string, CalendarEvent[]][];
  }, [sortedEvents]);

  const getEventsForDate = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    const list = eventsByDate.get(key) || [];
    return sortEvents(list);
  };

  const handlePrev = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNext = () => setCurrentDate(addMonths(currentDate, 1));

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
        let parent = currentMonthRef.current?.parentElement;
        while (parent) {
          const hasOverflow = parent.scrollHeight > parent.clientHeight;
          const overflowY = window.getComputedStyle(parent).overflowY;
          if (hasOverflow && (overflowY === "auto" || overflowY === "scroll")) break;
          parent = parent.parentElement;
        }
        if (parent && currentMonthRef.current) {
          const containerRect = parent.getBoundingClientRect();
          const targetRect = currentMonthRef.current.getBoundingClientRect();
          const offsetTop =
            targetRect.top - containerRect.top + parent.scrollTop - 100;
          parent.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
      }, 300);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full md:max-w-6xl max-h-[90vh] overflow-y-auto pt-12">
        <DialogHeader>
          <DialogTitle>?ÑÏ≤¥ ?ºÏ†ï Ï∫òÎ¶∞??/DialogTitle>
          <DialogDescription>
            ÍµøÎ¶¨Ïπ??ëÌöå/?ÑÏ¥â Í¥Ä???ºÏ†ï?????àÏóê ?ïÏù∏?òÏÑ∏??
          </DialogDescription>
        </DialogHeader>

        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="icon" onClick={handlePrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {format(currentDate, "yyyy??M??, { locale: ko })}
            </h2>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["??, "??, "??, "??, "Î™?, "Í∏?, "??].map((day) => (
              <div
                key={day}
                className="text-center font-medium text-gray-600 text-sm py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const dayEvents = getEventsForDate(day);
              const inMonth = isSameMonth(day, currentDate);
              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors",
                    inMonth ? "bg-white hover:bg-gray-50" : "bg-gray-100",
                    selectedDate && isSameDay(day, selectedDate) && "ring-2 ring-blue-500"
                  )}
                  onClick={() => {
                    setSelectedDate(day);
                    setIsDetailOpen(true);
                  }}
                >
                  <div
                    className={cn(
                      "text-sm font-medium mb-1",
                      !inMonth && "text-gray-400"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event, eventIdx) => (
                      <div
                        key={eventIdx}
                        className={cn(
                          "text-xs px-1 py-0.5 rounded truncate",
                          getEventColor(event),
                          getEventTextColor(event)
                        )}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-600">
                        ??{dayEvents.length - 3}Í∞?
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:hidden">
          <h2 className="text-lg font-semibold mb-4">?ÑÏ≤¥ ?ºÏ†ï Î™©Î°ù</h2>
          <p className="text-sm text-gray-600 mb-4">
            Î™®Îì† ?ºÏ†ï???†Ïßú?úÏúºÎ°??ïÏù∏?©Îãà??
          </p>
          <div className="space-y-4">
            {eventsByDateForAgenda.map(([date, dateEvents], idx) => (
              <div
                key={date}
                className="bg-gray-100 p-4 rounded-lg"
                ref={idx === currentMonthFirstIndex ? currentMonthRef : null}
              >
                <h3 className="font-semibold mb-2">
                  {format(new Date(date), "M??d??(E)", { locale: ko })}
                </h3>
                <div className="space-y-2">
                  {dateEvents.map((event, eventIdx) => (
                    <div
                      key={eventIdx}
                      className={cn(
                        "p-3 rounded-lg",
                        getEventColor(event),
                        getEventTextColor(event)
                      )}
                    >
                      <div className="font-medium text-sm">{event.title}</div>
                      {event.description && (
                        <div className="text-xs mt-1 opacity-90">
                          {event.description}
                        </div>
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
              {selectedDate && format(selectedDate, "M??d??(EEEE)", { locale: ko })}
            </DialogTitle>
            <DialogDescription>?†ÌÉù???†Ïßú???ÅÏÑ∏ ?ºÏ†ï?ÖÎãà??</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {selectedDate &&
              getEventsForDate(selectedDate).map((event, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-3 rounded-lg",
                    getEventColor(event),
                    getEventTextColor(event)
                  )}
                >
                  <div className="font-medium">{event.title}</div>
                  {event.description && (
                    <div className="text-sm mt-1 opacity-90">{event.description}</div>
                  )}
                </div>
              ))}
            {selectedDate && getEventsForDate(selectedDate).length === 0 && (
              <div className="text-gray-500 text-sm text-center py-8">
                ?ºÏ†ï???ÜÏäµ?àÎã§.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

