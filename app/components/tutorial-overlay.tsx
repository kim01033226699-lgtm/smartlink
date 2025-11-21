'use client';

import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

import { Button } from "@/app/components/ui/button";

interface TutorialStep {
  target: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    target: '[data-tutorial="calendar-button"]',
    title: "전체위촉일정보기",
    description: "전체 위촉 일정을 달력에서 확인하세요.",
    position: "bottom",
  },
  {
    target: '[data-tutorial="required-documents"]',
    title: "위촉필요서류",
    description: "위촉지원시스템에 업로드해야 하는 서류 안내입니다.",
    position: "bottom",
  },
  {
    target: '[data-tutorial="checklist"]',
    title: "위촉 체크리스트",
    description: "필수 체크리스트를 완료해야 다음 단계로 진행할 수 있습니다.",
    position: "bottom",
  },
  {
    target: '[data-tutorial="date-selector"]',
    title: "업로드완료일선택",
    description: "서류 업로드 완료일을 선택하세요. 매주 수요일만 선택 가능합니다.",
    position: "top",
  },
  {
    target: '[data-tutorial="search-button"]',
    title: "조회하기",
    description: "본인 차수의 위촉 일정을 조회합니다.",
    position: "top",
  },
];

interface TutorialOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function TutorialOverlay({ open, onClose }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!open) return;
    const updateTargetPosition = () => {
      const step = TUTORIAL_STEPS[currentStep];
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
      }
    };
    updateTargetPosition();
    window.addEventListener("resize", updateTargetPosition);
    window.addEventListener("scroll", updateTargetPosition);
    return () => {
      window.removeEventListener("resize", updateTargetPosition);
      window.removeEventListener("scroll", updateTargetPosition);
    };
  }, [open, currentStep]);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!open || !targetRect) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const padding = 20;
  let tooltipStyle: React.CSSProperties = {};

  switch (step.position) {
    case "top":
      tooltipStyle = {
        left: `${targetRect.left + targetRect.width / 2}px`,
        top: `${targetRect.top - padding}px`,
        transform: "translate(-50%, -100%)",
      };
      break;
    case "bottom":
      tooltipStyle = {
        left: `${targetRect.left + targetRect.width / 2}px`,
        top: `${targetRect.bottom + padding}px`,
        transform: "translate(-50%, 0)",
      };
      break;
    case "left":
      tooltipStyle = {
        left: `${targetRect.left - padding}px`,
        top: `${targetRect.top + targetRect.height / 2}px`,
        transform: "translate(-100%, -50%)",
      };
      break;
    case "right":
      tooltipStyle = {
        left: `${targetRect.right + padding}px`,
        top: `${targetRect.top + targetRect.height / 2}px`,
        transform: "translate(0, -50%)",
      };
      break;
  }

  return (
    <>
      <div className="fixed inset-0 z-[9998] bg-black/60" onClick={onClose} />
      <div
        className="pointer-events-none fixed z-[9999] rounded-lg border-4 border-white"
        style={{
          left: `${targetRect.left - 4}px`,
          top: `${targetRect.top - 4}px`,
          width: `${targetRect.width + 8}px`,
          height: `${targetRect.height + 8}px`,
        }}
      />
      <div
        className="fixed z-[10000] max-w-sm rounded-lg bg-white p-6 shadow-2xl"
        style={tooltipStyle}
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full p-1 transition-colors hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>

        <div className="mb-2 text-sm text-gray-500">
          {currentStep + 1} / {TUTORIAL_STEPS.length}
        </div>
        <h3 className="mb-2 text-lg font-bold text-gray-900">{step.title}</h3>
        <p className="mb-4 text-gray-700">{step.description}</p>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>
          <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-500">
            건너뛰기
          </Button>
          <Button
            onClick={handleNext}
            size="sm"
            className="gap-1 bg-blue-500 hover:bg-blue-600"
          >
            {currentStep === TUTORIAL_STEPS.length - 1 ? "완료" : "다음"}
            {currentStep < TUTORIAL_STEPS.length - 1 && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </>
  );
}

