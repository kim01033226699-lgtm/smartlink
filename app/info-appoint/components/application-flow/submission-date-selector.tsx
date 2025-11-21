'use client'

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Calendar } from "@/app/components/ui/calendar";
import { CalendarIcon, ArrowLeft, AlertCircle } from "lucide-react";
import { format, addDays } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface SubmissionDateSelectorProps {
  onDateSelected: (date: Date) => void;
  onBack: () => void;
}

export default function SubmissionDateSelector({
  onDateSelected,
  onBack
}: SubmissionDateSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // ?†ÌÉù???¥ÌõÑ 11?ºÏûê Í≥ÑÏÇ∞
  const calculateDates = (startDate: Date) => {
    const dates = [];
    for (let i = 1; i <= 11; i++) {
      dates.push(addDays(startDate, i));
    }
    return dates;
  };

  const handleConfirm = () => {
    if (selectedDate) {
      setShowResults(true);
    }
  };

  const handleFinalConfirm = () => {
    if (selectedDate) {
      onDateSelected(selectedDate);
    }
  };

  const calculatedDates = selectedDate ? calculateDates(selectedDate) : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>?±Í∏∞ Î∞úÏÜ° ?ºÏûê ?†ÌÉù</CardTitle>
          <CardDescription>
            ?±Í∏∞Î•?Î∞úÏÜ°???†ÏßúÎ•??†ÌÉù??Ï£ºÏÑ∏??
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* ?†Ïßú ?†ÌÉù */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ?úÏ∂ú ?àÏ†ï??
              </label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP", { locale: ko })
                    ) : (
                      <span>?†ÏßúÎ•??†ÌÉù?¥Ï£º?∏Ïöî</span>
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
                      setShowResults(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Î≤ÑÌäº */}
            {!showResults && (
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  ?¥Ï†Ñ?ºÎ°ú
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!selectedDate}
                >
                  ?ïÏù∏
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Í≤∞Í≥º ?úÏãú */}
      {showResults && selectedDate && (
        <Card className="border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Ï§ëÏöî ?ºÏ†ï ?àÎÇ¥
            </CardTitle>
            <CardDescription>
              ?úÏ∂ú??{format(selectedDate, "yyyy??MM??dd??, { locale: ko })}) ?¥ÌõÑ 11?ºÍ∞Ñ???ºÏ†ï?ÖÎãà??
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* ?†Ïßú Î™©Î°ù */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">
                  ?ïÏù∏?¥Ïïº ???†Ïßú??
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {calculatedDates.map((date, index) => (
                    <div
                      key={index}
                      className="bg-white p-2 rounded border border-blue-200 text-sm"
                    >
                      <span className="font-medium text-blue-600">
                        {index + 1}?ºÏ∞®:
                      </span>{" "}
                      {format(date, "MM??dd??(E)", { locale: ko })}
                    </div>
                  ))}
                </div>
              </div>
              {/* ÏµúÏ¢Ö ?ïÏù∏ Î≤ÑÌäº */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowResults(false)}
                  className="flex-1"
                >
                  ?†Ïßú ?§Ïãú ?†ÌÉù
                </Button>
                <Button
                  onClick={handleFinalConfirm}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  ?ïÏù∏ ?ÑÎ£å
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
