"use client";

import NavigationHeader from "@/app/components/NavigationHeader";
import BottomNavigation from "@/app/components/BottomNavigation";
import EducationQuestionFlow from "@/app/info-appoint/components/education-flow/education-question-flow";

export default function EducationFlowPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <NavigationHeader />

      <div className="py-8 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">등록교육 안내</h1>
            <p className="text-gray-600">협회등록을 위한 교육과정 안내입니다.</p>
          </div>
          <EducationQuestionFlow />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}

