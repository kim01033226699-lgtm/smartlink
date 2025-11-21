"use client";

import NavigationHeader from "@/app/components/NavigationHeader";
import EducationQuestionFlow from "@/app/info-appoint/components/education-flow/education-question-flow";

export default function EducationFlowPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <NavigationHeader />

      <div className="py-8 px-4">
        <div className="mx-auto max-w-3xl">
          <EducationQuestionFlow />
        </div>
      </div>
    </div>
  );
}

