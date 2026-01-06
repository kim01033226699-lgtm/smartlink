"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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

function ApplicationFlowContent() {
  const searchParams = useSearchParams();
  const initialStep = searchParams.get('mode') === 'writing' ? 'personal-info' : 'questions';

  const [currentStep, setCurrentStep] = useState<FlowStep>(initialStep);
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);

  // Effect to handle direct navigation when search param changes or on mount
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'writing') {
      setCurrentStep('personal-info');
    } else if (mode === 'blank-download') {
      const blankInfo: PersonalInfo = {
        company: " ",
        companyAddress: " ",
        residentNumber: " ",
        name: " ",
        address: " ",
        phone: " ",
        submissionDate: new Date().toISOString().split('T')[0],
        recipients: []
      };
      setPersonalInfo(blankInfo);
      setSelectedResults([]);
      setCurrentStep("preview");
    } else if (mode === 'sample') {
      setSelectedResults([
        "생명보험협회 - 서울특별시 중구 퇴계로 173, 16층(충무로3가)",
        "손해보험협회 - 서울특별시 종로구 종로1길 50 15층 B동(케이트윈타워) 손해보험협회 자격관리팀",
        "A금융서비스 - 서울시 강남구 강남길 21",
      ]);
      setCurrentStep("sample-preview");
    }
  }, [searchParams]);

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
      // If we came directly to writing mode, going back should probably go to questions or home
      // But standard flow is back to sample-preview
      if (searchParams.get('mode') === 'writing') {
        setCurrentStep("questions"); // Or maybe router.back()
      } else {
        setCurrentStep("sample-preview");
      }
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
          {searchParams.get('mode') !== 'blank-download' && (
            <h1 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">협회 말소처리 안내</h1>
          )}

          {currentStep === "questions" && (
            <div className="mb-8 text-center">
              <p className="text-gray-600">본인의 상황을 알려주세요</p>
            </div>
          )}

          {currentStep === "questions" && <QuestionFlow onComplete={handleQuestionsComplete} />}

          {currentStep === "sample-preview" && (
            <div className="space-y-4">
              <div className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-md bg-white">
                <img
                  src="/images/sample-preview.png"
                  alt="내용증명 샘플"
                  className="w-full h-auto"
                />
              </div>

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
                  className="cursor-pointer border-2 border-goodrich-yellow-light bg-orange-50 transition-all duration-150 hover:bg-orange-100 hover:shadow-lg active:scale-95"
                  onClick={handleStartWriting}
                >
                  <CardContent className="pb-6 pt-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-goodrich-gray">
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
              autoDownload={searchParams.get('mode') === 'blank-download'}
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

export default function ApplicationFlowPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplicationFlowContent />
    </Suspense>
  );
}

