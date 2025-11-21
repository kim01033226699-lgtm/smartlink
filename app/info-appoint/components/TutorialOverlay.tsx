'use client';

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Button } from "@/app/components/ui/button";

interface TutorialStep {
  target: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const STEPS: TutorialStep[] = [
  {
    target: '[data-tutorial="calendar-button"]',
    title: "?ÑÏ≤¥?ÑÏ¥â?ºÏ†ïÎ≥¥Í∏∞",
    description: "?ÑÏ≤¥ ?ÑÏ¥â ?ºÏ†ï??Ï∫òÎ¶∞?îÎ°ú ?ïÏù∏?òÏÑ∏??",
    position: "bottom",
  },
  {
    target: '[data-tutorial="required-documents"]',
    title: "?ÑÏ¥â?ÑÏöî?úÎ•ò",
    description: "?ÖÎ°ú?úÌï¥?????úÎ•òÎ•??úÎàà???ïÏù∏?????àÏñ¥??",
    position: "bottom",
  },
  {
    target: '[data-tutorial="checklist"]',
    title: "?ÑÏ¥â Ï≤¥ÌÅ¨Î¶¨Ïä§??,
    description: "3Í∞ÄÏßÄÎ•?Î™®Îëê ?ÑÎ£å?¥Ïïº ?ÑÏ¥â??ÏßÑÌñâ?©Îãà??",
    position: "bottom",
  },
  {
    target: '[data-tutorial="date-selector"]',
    title: "?ÖÎ°ú?úÏôÑÎ£åÏùº?†ÌÉù",
    description: "?ÑÏ¥âÏßÄ?êÏãú?§ÌÖú ?ÖÎ°ú???ÑÎ£å???òÏöî?????†ÌÉù?òÏÑ∏??",
    position: "top",
  },
  {
    target: '[data-tutorial="search-button"]',
    title: "Ï°∞Ìöå?òÍ∏∞",
    description: "?ÖÎ†•???ïÎ≥¥Î•?Í∏∞Î∞ò?ºÎ°ú ?ÑÏ¥â ?ºÏ†ï???àÎÇ¥?©Îãà??",
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
    const update = () => {
      const element = document.querySelector(STEPS[currentStep].target);
      if (element) setTargetRect(element.getBoundingClientRect());
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [open, currentStep]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((prev) => prev + 1);
    else onClose();
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  if (!open || !targetRect) return null;

  const step = STEPS[currentStep];
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
      <div className="fixed inset-0 bg-black/60 z-[9998]" onClick={onClose} />
      <div
        className="fixed border-4 border-white rounded-lg z-[9999] pointer-events-none"
        style={{
          left: `${targetRect.left - 4}px`,
          top: `${targetRect.top - 4}px`,
          width: `${targetRect.width + 8}px`,
          height: `${targetRect.height + 8}px`,
        }}
      />
      <div
        className="fixed z-[10000] bg-white rounded-lg shadow-2xl p-6 max-w-sm"
        style={tooltipStyle}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>

        <div className="text-sm text-gray-500 mb-2">
          {currentStep + 1} / {STEPS.length}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
        <p className="text-gray-700 mb-4">{step.description}</p>

        <div className="flex justify-between items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            ?¥Ï†Ñ
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500" onClick={onClose}>
            Í±¥ÎÑà?∞Í∏∞
          </Button>
          <Button
            onClick={handleNext}
            size="sm"
            className="gap-1 bg-blue-500 hover:bg-blue-600"
          >
            {currentStep === STEPS.length - 1 ? "?ÑÎ£å" : "?§Ïùå"}
            {currentStep < STEPS.length - 1 && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </>
  );
}

