'use client'

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Calendar } from "@/app/components/ui/calendar";
import { CheckCircle2, AlertCircle, CalendarIcon, Info } from "lucide-react";
import { format, addDays } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  text: string;
  yesNext?: string;
  noNext?: string;
  yesResult?: string[];
  noResult?: string[];
}

interface QuestionFlowProps {
  onComplete: (results: string[]) => void;
}

const questions: Record<string, Question> = {
  q1: {
    id: "q1",
    text: "전 소속회사에서 해촉증명서를 받으셨나요?",
    yesResult: ["dismissal_certificate"],
    noNext: "q2",
  },
  q2: {
    id: "q2",
    text: "직접 말소를 위해 전 소속회사에 내용증명을 발송하셨나요?",
    yesResult: ["certified_mail"],
    noNext: "q3",
  },
  q3: {
    id: "q3",
    text: "전속 설계사로 일하셨나요?",
    yesNext: "q4",
    noNext: "q5",
  },
  q4: {
    id: "q4",
    text: "교차판매를 하셨나요?",
    yesResult: ["생명보험협회", "손해보험협회", "현재 재직회사"],
    noResult: ["생명보험협회 or 손해보험협회", "현재 재직회사"],
  },
  q5: {
    id: "q5",
    text: "대리점 소속으로 일하셨나요?",
    yesNext: "q6",
    noResult: ["현재 재직회사"],
  },
  q6: {
    id: "q6",
    text: "전 소속 회사에는 생명보험&손해보험 자격이 모두 등록돼 있었나요?",
    yesResult: ["생명보험협회", "손해보험협회", "현재 재직회사"],
    noResult: ["생명보험협회 or 손해보험협회", "현재 재직회사"],
  },
};

export default function QuestionFlow({ onComplete }: QuestionFlowProps) {
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("q1");
  const [history, setHistory] = useState<Array<{ questionId: string; answer: "yes" | "no" }>>([]);
  const [results, setResults] = useState<string[] | null>(null);
  const [certifiedMailDate, setCertifiedMailDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const currentQuestion = questions[currentQuestionId];

  const handleAnswer = (answer: "yes" | "no") => {
    const newHistory = [...history, { questionId: currentQuestionId, answer }];
    setHistory(newHistory);

    const nextQuestionId = answer === "yes" ? currentQuestion.yesNext : currentQuestion.noNext;
    const resultArray = answer === "yes" ? currentQuestion.yesResult : currentQuestion.noResult;

    if (resultArray) {
      setResults(resultArray);
    } else if (nextQuestionId) {
      setCurrentQuestionId(nextQuestionId);
    }
  };

  const handleGoBack = () => {
    if (results) {
      const lastHistory = history[history.length - 1];
      setResults(null);
      setCurrentQuestionId(lastHistory.questionId);
    } else if (history.length > 0) {
      const newHistory = [...history];
      const lastEntry = newHistory.pop();
      setHistory(newHistory);

      if (lastEntry) {
        setCurrentQuestionId(lastEntry.questionId);
      }
    }
  };

  const handleContinue = () => {
    if (results) {
      onComplete(results);
    }
  };

  const handleReset = () => {
    setCurrentQuestionId("q1");
    setHistory([]);
    setResults(null);
    setCertifiedMailDate(undefined);
  };

  const handleGoToStep = (targetIndex: number) => {
    const newHistory = history.slice(0, targetIndex);
    setHistory(newHistory);

    if (targetIndex > 0) {
      setCurrentQuestionId(history[targetIndex - 1].questionId);
    } else {
      setCurrentQuestionId("q1");
    }

    if (results) {
      setResults(null);
    }
  };

  if (results) {
    if (results.includes("dismissal_certificate")) {
      return (
        <div className="space-y-4">
          <Card className="border-2 border-blue-500">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-6 w-6 text-blue-600" />
                해촉증명서 말소 신청 안내
              </CardTitle>
              <CardDescription>해촉증명서를 받으신 경우 아래 방법으로 말소 신청하실 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-green-900">
                    <CheckCircle2 className="h-5 w-5" />
                    인터넷 직접 말소
                  </h3>
                  <ul className="ml-7 space-y-2 text-sm text-green-900">
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>
                        <strong>16:30 이전 신청:</strong> 당일 접수 / 당일 처리
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>
                        <strong>16:30 이후 신청:</strong> 익일 접수 / 익일 처리
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-amber-900">
                    <CheckCircle2 className="h-5 w-5" />
                    협회 방문 접수
                  </h3>
                  <ul className="ml-7 space-y-2 text-sm text-amber-900">
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>
                        <strong>15:00 이전 방문:</strong> 당일 처리
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>
                        <strong>15:00 이후 방문:</strong> 익일 처리
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <h3 className="mb-3 font-semibold text-gray-900">인터넷 말소신청 바로가기</h3>
                    <div className="space-y-2">
                      <a
                        href="https://fp.insure.or.kr/direct/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg border border-green-200 bg-green-50 px-4 py-3 font-medium text-green-900 transition-all duration-150 hover:bg-green-100 active:scale-95"
                      >
                        🔗 생명보험협회 인터넷말소신청 바로가기
                      </a>
                      <a
                        href="https://isi.knia.or.kr/confirm/login.do"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg border border-green-200 bg-green-50 px-4 py-3 font-medium text-green-900 transition-all duration-150 hover:bg-green-100 active:scale-95"
                      >
                        🔗 손해보험협회 인터넷말소신청 바로가기
                      </a>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="mb-3 font-semibold text-gray-900">협회 방문 조회</h3>
                    <div className="space-y-2">
                      <a
                        href="https://fp.insure.or.kr/process/process01"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 font-medium text-blue-900 transition-all duration-150 hover:bg-blue-100 active:scale-95"
                      >
                        📍 생명보험협회 지부 조회
                      </a>
                      <a
                        href="https://isi.knia.or.kr/information/directions.do"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 font-medium text-blue-900 transition-all duration-150 hover:bg-blue-100 active:scale-95"
                      >
                        📍 손해보험협회 지부 조회
                      </a>
                    </div>
                  </div>
                </div>

                <Button variant="outline" onClick={handleReset} className="w-full transition-all duration-150 active:scale-95">
                  처음으로
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (results.includes("certified_mail")) {
      return (
        <div className="space-y-4">
          <Card className="border-2 border-blue-500">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-blue-600" />
                내용증명 발송일 확인
              </CardTitle>
              <CardDescription>내용증명을 발송한 날짜를 선택해주세요.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">내용증명 발송일</label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !certifiedMailDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {certifiedMailDate ? (
                          format(certifiedMailDate, "PPP", { locale: ko })
                        ) : (
                          <span>날짜를 선택해주세요</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={certifiedMailDate}
                        onSelect={(date) => {
                          setCertifiedMailDate(date);
                          setIsCalendarOpen(false);
                        }}
                        initialFocus
                        locale={ko}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {certifiedMailDate && (
                  <>
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <h3 className="mb-3 font-semibold text-blue-900">말소 신청 가능일</h3>
                      <p className="mb-2 text-sm text-blue-800">
                        내용증명 발송일{" "}
                        <strong>{format(certifiedMailDate, "yyyy년 M월 d일", { locale: ko })}</strong> 이후 11일째 되는
                        날은
                      </p>
                      <p className="mb-4 text-lg font-bold text-blue-900">
                        {format(addDays(certifiedMailDate, 11), "yyyy년 M월 d일 (EEEE)", { locale: ko })}
                      </p>
                      <p className="text-sm text-blue-800">이 날짜 이후에 인터넷으로 말소 신청하거나 협회에 방문하셔야 합니다.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="border-t pt-4">
                        <h3 className="mb-3 font-semibold text-gray-900">인터넷 말소신청 바로가기</h3>
                        <div className="space-y-2">
                          <a
                            href="https://fp.insure.or.kr/direct/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-lg border border-green-200 bg-green-50 px-4 py-3 font-medium text-green-900 transition-all duration-150 hover:bg-green-100 active:scale-95"
                          >
                            🔗 생명보험협회 인터넷말소신청 바로가기
                          </a>
                          <a
                            href="https://isi.knia.or.kr/confirm/login.do"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-lg border border-green-200 bg-green-50 px-4 py-3 font-medium text-green-900 transition-all	duration-150 hover:bg-green-100 active:scale-95"
                          >
                            🔗 손해보험협회 인터넷말소신청 바로가기
                          </a>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="mb-3 font-semibold text-gray-900">협회 방문 조회</h3>
                        <div className="space-y-2">
                          <a
                            href="https://fp.insure.or.kr/process/process01"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 font-medium text-blue-900 transition-all duration-150 hover:bg-blue-100 active:scale-95"
                          >
                            📍 생명보험협회 지부 조회
                          </a>
                          <a
                            href="https://isi.knia.or.kr/information/directions.do"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 font-medium text-blue-900 transition-all duration-150 hover:bg-blue-100 active:scale-95"
                          >
                            📍 손해보험협회 지부 조회
                          </a>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={handleGoBack} className="flex-1 transition-all duration-150 active:scale-95">
                    이전으로
                  </Button>
                  <Button variant="outline" onClick={handleReset} className="flex-1 transition-all duration-150 active:scale-95">
                    처음으로
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {history.length > 0 && (
          <div className="relative space-y-3">
            <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-blue-300" />

            {history.map((h, index) => (
              <div key={index} className="relative">
                <div className="absolute left-2.5 top-6 h-3 w-3 rounded-full border-2 border-white bg-blue-500" />

                <Card
                  className="ml-8 cursor-pointer border-gray-200 bg-gray-50 transition-all duration-150 hover:border-gray-300 hover:bg-gray-100 active:scale-95"
                  onClick={() => handleGoToStep(index)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="mb-1 text-sm text-gray-500">Q{index + 1}</p>
                        <p className="font-medium text-gray-700">{questions[h.questionId].text}</p>
                      </div>
                      <div className="ml-4">
                        <span
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${
                            h.answer === "yes" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {h.answer === "yes" ? "네" : "아니오"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-900">
            직접 말소를 진행하시려면, 아래의 기관(또는 회사)에 내용증명을 발송하셔야 합니다.
          </p>
        </div>

        <Card className="border-2 border-green-500">
          <CardHeader className="bg-green-50">
            <CardTitle>제출처 안내</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-600" />
                  <span className="font-medium text-gray-900">{result}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card
            className="cursor-pointer border-2 border-gray-300 transition-all duration-150 hover:border-gray-400 hover:shadow-lg active:scale-95"
            onClick={handleGoBack}
          >
            <CardContent className="pb-6 pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">이전으로</h3>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer border-2 border-green-500 bg-green-50 transition-all duration-150 hover:bg-green-100 hover:shadow-lg active:scale-95"
            onClick={handleContinue}
          >
            <CardContent className="pb-6 pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-900">내용증명샘플보기</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.length > 0 && (
        <div className="relative space-y-3">
          <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-blue-300" />

          {history.map((h, index) => (
            <div key={index} className="relative">
              <div className="absolute left-2.5 top-6 h-3 w-3 rounded-full border-2 border-white bg-blue-500" />

              <Card
                className="ml-8 cursor-pointer border-gray-200 bg-gray-50 transition-all duration-150 hover:border-gray-300 hover:bg-gray-100 active:scale-95"
                onClick={() => handleGoToStep(index)}
              >
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="mb-1 text-sm text-gray-500">Q{index + 1}</p>
                      <p className="fontətli text-gray-700">{questions[h.questionId].text}</p>
                    </div>
                    <div className="ml-4">
                      <span
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${h.answer === "yes" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-700"}`}
                      >
                        {h.answer === "yes" ? "네" : "아니오"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        {history.length > 0 && (
          <>
            <div className="absolute left-4 top-0 h-12 w-0.5 bg-blue-300" />
            <div className="absolute left-2.5 top-12 h-3 w-3 rounded-full border-2 border-white bg-blue-600" />
          </>
        )}

        <Card className={`border-2 border-blue-500 shadow-lg ${history.length > 0 ? "ml-8" : ""}`}>
          <CardHeader className="bg-blue-50">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-semibold text-blue-600">Q{history.length + 1}</span>
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">{currentQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => handleAnswer("yes")}
                className="flex-1 bg-blue-600 py-6 text-lg font-semibold transition-all duration-150 active:scale-95 hover:bg-blue-700"
              >
                네
              </Button>
              <Button
                onClick={() => handleAnswer("no")}
                variant="outline"
                className="flex-1 border-2 py-6 text-lg font-semibold transition-all duration-150 active:scale-95 hover:bg-gray-100"
              >
                아니오
              </Button>
            </div>

            {history.length > 0 && (
              <Button
                variant="ghost"
                onClick={handleGoBack}
                className="mt-4 w-full transition-all duration-150 active:scale-95"
              >
                이전 질문으로
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

