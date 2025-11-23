import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, Formatters } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/app/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  formatters,
  ...props
}: CalendarProps) {
  // 요일 헤더를 일요일부터 시작하도록 커스터마이징
  const customFormatters: Partial<Formatters> = {
    formatWeekdayName: (weekday: Date, options?: any, dateLib?: any) => {
      const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
      const dayIndex = weekday.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
      return weekdays[dayIndex];
    },
    ...(formatters || {}),
  };

  // 모든 요일을 표시하는 Weekdays 컴포넌트
  const CustomWeekdays = React.useMemo(() => {
    return (props: React.HTMLAttributes<HTMLTableRowElement>) => {
      return (
        <thead aria-hidden="true">
          <tr {...props} className="flex w-full">
            {/* 일요일 표시 - 여린 레드 */}
            <th className="text-red-400 rounded-md font-normal text-[0.8rem] w-9 text-center p-0">일</th>
            {/* 월요일 표시 */}
            <th className="text-muted-foreground rounded-md font-normal text-[0.8rem] w-9 text-center p-0">월</th>
            {/* 화요일 표시 */}
            <th className="text-muted-foreground rounded-md font-normal text-[0.8rem] w-9 text-center p-0">화</th>
            {/* 수요일 표시 - 한 포인트 키우고 굵은 검정 */}
            <th className="text-black rounded-md font-bold text-[0.9rem] w-9 text-center p-0">수</th>
            {/* 목요일 표시 */}
            <th className="text-muted-foreground rounded-md font-normal text-[0.8rem] w-9 text-center p-0">목</th>
            {/* 금요일 표시 */}
            <th className="text-muted-foreground rounded-md font-normal text-[0.8rem] w-9 text-center p-0">금</th>
            {/* 토요일 표시 - 여린 파랑 */}
            <th className="text-blue-400 rounded-md font-normal text-[0.8rem] w-9 text-center p-0">토</th>
          </tr>
        </thead>
      );
    };
  }, []);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months:
          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full",
        head_cell:
          "text-muted-foreground rounded-md font-normal text-[0.8rem] w-9 text-center p-0",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          // 일요일: 여린 레드, 토요일: 여린 파랑
          "[&:nth-child(1)]:text-red-400 [&:nth-child(7)]:text-blue-400",
          // 수요일: 한 포인트 키우고 굵은 검정
          "[&:nth-child(4)]:text-black [&:nth-child(4)]:font-bold [&:nth-child(4)]:text-[0.95rem]"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }: { orientation?: "left" | "right" }) => {
          if (orientation === "left") {
            return <ChevronLeft className="h-4 w-4" />;
          }
          return <ChevronRight className="h-4 w-4" />;
        },
        Weekdays: CustomWeekdays as any,
      } as any}
      formatters={customFormatters as Formatters}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

