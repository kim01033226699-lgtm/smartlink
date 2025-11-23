"use client";

import { useState } from "react";

import NavigationHeader from "@/app/components/NavigationHeader";
import BottomNavigation from "@/app/components/BottomNavigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import ApplicationPreview from "@/app/info-appoint/components/application-flow/application-preview";
import PersonalInfoForm from "@/app/info-appoint/components/application-flow/personal-info-form";
import QuestionFlow from "@/app/info-appoint/components/application-flow/question-flow";

type FlowStep = "questions" | "sample-preview" | "personal-info" | "preview" | "completed";

interface PersonalInfo {
  company: string;
  companyAddress: string;
  residentNumber: string;
  name: string;
  address: string;
  phone: string;
  submissionDate: string;
  recipients: string[];
}

export default function ApplicationFlowPage() {
  const [currentStep, setCurrentStep] = useState<FlowStep>("questions");
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);

  const handleQuestionsComplete = (results: string[]) => {
    setSelectedResults(results);
    setCurrentStep("sample-preview");
  };

  const handleStartWriting = () => {
    setCurrentStep("personal-info");
  };

  const handlePersonalInfoComplete = (info: PersonalInfo) => {
    setPersonalInfo(info);
    setCurrentStep("preview");
  };

  const handlePdfDownloaded = () => {
    setCurrentStep("completed");
  };

  const handleGoBack = () => {
    if (currentStep === "sample-preview") {
      setCurrentStep("questions");
    } else if (currentStep === "personal-info") {
      setCurrentStep("sample-preview");
    } else if (currentStep === "preview") {
      setCurrentStep("personal-info");
    }
  };

  const handleReset = () => {
    setCurrentStep("questions");
    setSelectedResults([]);
    setPersonalInfo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <NavigationHeader />

      <div className="px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">협회말소 안내</h1>
            <p className="text-gray-600">현재상황에 따라 협회말소 방법을 안내해 드립니다.</p>
          </div>

          {currentStep === "questions" && <QuestionFlow onComplete={handleQuestionsComplete} />}

          {currentStep === "sample-preview" && (
            <div className="space-y-4">
              <ApplicationPreview
                personalInfo={{
                  company: "A금융서비스",
                  companyAddress: "서울시 강남구 강남길 21",
                  residentNumber: "800101-1234567",
                  name: "홍길동",
                  address: "서울시 강남구 강남길 12",
                  phone: "010-1234-5678",
                  submissionDate: "2025-01-01",
                  recipients: [
                    "생명보험협회 - 서울특별시 중구 퇴계로 173, 16층(충무로3가)",
                    "손해보험협회 - 서울특별시 종로구 종로1길 50 15층 B동(케이트윈타워) 손해보험협회 자격관리팀",
                    "A금융서비스 - 서울시 강남구 강남길 21",
                  ],
                }}
                selectedResults={selectedResults}
                onPdfDownloaded={() => {}}
                onBack={handleGoBack}
                isSample={true}
              />

              <div className="grid grid-cols-2 gap-4">
                <Card
                  className="cursor-pointer border-2 border-gray-300 transition-all duration-150 hover:border-gray-400 hover:shadow-lg active:scale-95"
                  onClick={handleGoBack}
                >
                  <CardContent className="pb-4 pt-4">
                    <div className="text-center">
                      <h3 className="text-[0.7em] font-semibold text-gray-900">이전으로</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer border-2 border-goodrich-yellow-light bg-orange-50 transition-all duration-150 hover:bg-orange-100 hover:shadow-lg active:scale-95"
                  onClick={handleStartWriting}
                >
                  <CardContent className="pb-4 pt-4">
                    <div className="text-center">
                      <h3 className="text-[0.7em] font-semibold text-goodrich-gray">
                        내용증명 작성을 도와드릴까요?
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentStep === "personal-info" && (
            <PersonalInfoForm
              onComplete={handlePersonalInfoComplete}
              onBack={handleGoBack}
              selectedResults={selectedResults}
            />
          )}

          {currentStep === "preview" && personalInfo && (
            <ApplicationPreview
              personalInfo={personalInfo}
              selectedResults={selectedResults}
              onPdfDownloaded={handlePdfDownloaded}
              onBack={handleGoBack}
            />
          )}

          {currentStep === "completed" && (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">✅</div>
              <h2 className="mb-8 text-2xl font-bold text-gray-900">다운로드가 완료됐습니다.</h2>
              <Button
                onClick={handleReset}
                className="bg-goodrich-yellow-light transition-all duration-150 hover:opacity-90 active:scale-95"
                size="lg"
              >
                처음으로
              </Button>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}

