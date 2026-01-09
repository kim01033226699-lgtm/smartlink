"use client";

import { useState, useEffect, useRef } from "react";
import NavigationHeader from "@/app/components/NavigationHeader";
import BottomNavigation from "@/app/components/BottomNavigation";
import { Button } from "@/app/components/ui/button";
import { Printer, Download } from "lucide-react";

interface UserInput {
    name: string;
    experience: "experienced" | "inexperienced" | "";
    qualifications?: string[];
    hasQualification?: "yes" | "no" | "";
    examRegion?: string;
    subsidies?: string[];
    region: string;
}

const AVAILABLE_REGIONS = [
    "서울", "인천", "부산", "대구", "광주", "대전",
    "원주", "울산", "전주", "서산", "강릉", "제주", "춘천"
];

const QUALIFICATIONS = ["생명보험", "손해보험", "제3보험"];
const SUBSIDIES = ["GFE", "정착교육비", "기타 지원금"];

export default function PersonalizedGuidePage() {
    const [step, setStep] = useState<"form" | "result">("form");
    const [userInput, setUserInput] = useState<UserInput>({
        name: "",
        experience: "",
        qualifications: [],
        hasQualification: "",
        examRegion: "",
        subsidies: [],
        region: "",
    });
    const [isAppDownloadModalOpen, setIsAppDownloadModalOpen] = useState(false);
    const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isExperienced = userInput.experience === "experienced";
        const isComplete = userInput.name && userInput.experience &&
            (isExperienced
                ? userInput.qualifications && userInput.qualifications.length > 0
                : userInput.hasQualification && userInput.examRegion);

        if (isComplete) {
            setStep("result");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleReset = () => {
        setUserInput({
            name: "",
            experience: "",
            qualifications: [],
            hasQualification: "",
            examRegion: "",
            subsidies: [],
            region: "",
        });
        setStep("form");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="px-4 py-8">
                <div className="mx-auto max-w-4xl">
                    <h1 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl print-hidden">
                        Smart One Page
                    </h1>

                    {step === "form" ? (
                        <FormSection
                            userInput={userInput}
                            setUserInput={setUserInput}
                            onSubmit={handleSubmit}
                        />
                    ) : (
                        <ResultSection
                            userInput={userInput}
                            onPrint={handlePrint}
                            onReset={handleReset}
                            onDownloadApp={() => setIsAppDownloadModalOpen(true)}
                            onOpenManagerCheck={() => setIsManagerModalOpen(true)}
                        />
                    )}
                </div>
            </div>

            <div className="print-hidden">
                <BottomNavigation />
            </div>

            {/* App Download Modal */}
            {isAppDownloadModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4"
                    onClick={() => setIsAppDownloadModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 max-w-sm w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">앱 설치</h3>
                            <button
                                onClick={() => setIsAppDownloadModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-6">
                            사용하시는 기기에 맞는 스토어를 선택해주세요.
                        </p>

                        <div className="space-y-3">
                            <a
                                href="https://play.google.com/store/search?q=%EC%84%9C%EC%9A%B8%EB%B3%B4%EC%A6%9D%EB%B3%B4%ED%97%98&c=apps&hl=ko"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors no-underline"
                                onClick={() => setIsAppDownloadModalOpen(false)}
                            >
                                <Download size={20} />
                                <span>Google Play</span>
                            </a>
                            <a
                                href="https://apps.apple.com/kr/app/sgi-m-sgi서울보증/id6443694425"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors no-underline"
                                onClick={() => setIsAppDownloadModalOpen(false)}
                            >
                                <Download size={20} />
                                <span>App Store</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Manager Check Modal */}
            {isManagerModalOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300"
                    onClick={() => setIsManagerModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">담당자 확인</h3>
                                <p className="text-xs text-gray-500 mt-1">도움이 필요하시면 연락주세요.</p>
                            </div>
                            <button
                                onClick={() => setIsManagerModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="space-y-3">
                            {[
                                { role: "협회소속이동", name: "윤서하", pos: "사원", phone: "02-6410-7417" },
                                { role: "보증보험 / 지원금", name: "이인교", pos: "과장", phone: "02-6410-7943" },
                                { role: "위촉심사", name: "김지열", pos: "과장", phone: "02-6410-7817" }
                            ].map((m, i) => (
                                <div key={i} className="group p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{m.role}</p>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-baseline gap-1">
                                            <span className="font-bold text-gray-900">{m.name}</span>
                                            <span className="text-xs text-gray-500">{m.pos}</span>
                                        </div>
                                        <a href={`tel:${m.phone.replace(/-/g, "")}`} className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">
                                            {m.phone}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setIsManagerModalOpen(false)}
                            className="w-full mt-8 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function FormSection({
    userInput,
    setUserInput,
    onSubmit,
}: {
    userInput: UserInput;
    setUserInput: (input: UserInput) => void;
    onSubmit: (e: React.FormEvent) => void;
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const isExperienced = userInput.experience === "experienced";
    const isInexperienced = userInput.experience === "inexperienced";
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to center the current step when it changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;

            // Short delay to allow new content to render and update scrollHeight
            setTimeout(() => {
                const scrollHeight = container.scrollHeight;
                const clientHeight = container.clientHeight;

                // Calculate position to push latest content higher (around top 20-30% of viewport)
                // We subtract less from scrollHeight to set a higher scrollTop
                const scrollPosition = scrollHeight - (clientHeight * 0.4);

                container.scrollTo({
                    top: Math.max(0, scrollPosition),
                    behavior: 'smooth'
                });
            }, 100);
        }
    }, [currentStep]);

    const toggleQualification = (qual: string) => {
        const current = userInput.qualifications || [];
        const updated = current.includes(qual)
            ? current.filter(q => q !== qual)
            : [...current, qual];
        setUserInput({ ...userInput, qualifications: updated });
    };

    const toggleSubsidy = (sub: string) => {
        const current = userInput.subsidies || [];
        const updated = current.includes(sub)
            ? current.filter(s => s !== sub)
            : [...current, sub];
        setUserInput({ ...userInput, subsidies: updated });
    };

    const canSubmit = !!(userInput.name && userInput.experience &&
        (isExperienced
            ? userInput.qualifications && userInput.qualifications.length > 0 && currentStep >= 5
            : userInput.hasQualification && userInput.examRegion && currentStep >= 6));

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12 min-h-[500px] flex flex-col relative overflow-hidden">
                {/* Top fade overlay */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />

                <div ref={scrollContainerRef} className="flex-1 space-y-6 overflow-y-auto max-h-[600px] scroll-smooth scrollbar-hide pb-60 pt-8">
                    <BotMessage text="성함을 알려주세요." isOld={currentStep > 1} />
                    {currentStep >= 1 && (
                        <UserInput isOld={currentStep > 1}>
                            <input
                                type="text"
                                value={userInput.name}
                                onChange={(e) => setUserInput({ ...userInput, name: e.target.value })}
                                onKeyPress={(e) => e.key === 'Enter' && userInput.name && setCurrentStep(2)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl rounded-tr-none focus:outline-none focus:border-gray-800 transition-colors"
                                placeholder="예: 홍길동"
                                autoFocus
                            />
                        </UserInput>
                    )}

                    {currentStep >= 2 && (
                        <>
                            <BotMessage text={`${userInput.name}님, 반갑습니다! 😊<br/><strong>보험 영업 경력</strong>이 있으신가요?`} isOld={currentStep > 2} />
                            <UserInput isOld={currentStep > 2}>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUserInput({ ...userInput, experience: "experienced" });
                                            setTimeout(() => setCurrentStep(3), 300);
                                        }}
                                        className={`px-4 py-3 rounded-xl font-medium transition-all ${isExperienced
                                            ? "bg-gray-800 text-white"
                                            : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400"
                                            }`}
                                    >
                                        경력자
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUserInput({ ...userInput, experience: "inexperienced" });
                                            setTimeout(() => setCurrentStep(3), 300);
                                        }}
                                        className={`px-4 py-3 rounded-xl font-medium transition-all ${isInexperienced
                                            ? "bg-gray-800 text-white"
                                            : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400"
                                            }`}
                                    >
                                        무경력자
                                    </button>
                                </div>
                            </UserInput>
                        </>
                    )}

                    {currentStep >= 3 && isExperienced && (
                        <>
                            <BotMessage text="좋습니다! 👍<br/>보유하신 <strong>보험 자격</strong>을 선택해주세요.<br/>(중복 선택 가능)" isOld={currentStep > 3} />
                            <UserInput isOld={currentStep > 3}>
                                <div className="space-y-2">
                                    {QUALIFICATIONS.map((qual) => (
                                        <button
                                            key={qual}
                                            type="button"
                                            onClick={() => toggleQualification(qual)}
                                            className={`w-full px-4 py-3 rounded-xl font-medium transition-all text-left ${userInput.qualifications?.includes(qual)
                                                ? "bg-gray-800 text-white"
                                                : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400"
                                                }`}
                                        >
                                            {qual} {userInput.qualifications?.includes(qual) && "✓"}
                                        </button>
                                    ))}
                                    {userInput.qualifications && userInput.qualifications.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(4)}
                                            className="w-full px-4 py-3 rounded-xl font-semibold bg-gray-800 text-white hover:bg-gray-900 transition-all mt-2"
                                        >
                                            다음 →
                                        </button>
                                    )}
                                </div>
                            </UserInput>
                        </>
                    )}

                    {currentStep >= 3 && isInexperienced && (
                        <>
                            <BotMessage text="좋습니다! 👍<br/><strong>보험 자격증</strong>을 보유하고 계신가요?" isOld={currentStep > 3} />
                            <UserInput isOld={currentStep > 3}>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUserInput({ ...userInput, hasQualification: "yes" });
                                            setTimeout(() => setCurrentStep(4), 300);
                                        }}
                                        className={`px-4 py-3 rounded-xl font-medium transition-all ${userInput.hasQualification === "yes"
                                            ? "bg-gray-800 text-white"
                                            : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400"
                                            }`}
                                    >
                                        있어요
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUserInput({ ...userInput, hasQualification: "no" });
                                            setTimeout(() => setCurrentStep(4), 300);
                                        }}
                                        className={`px-4 py-3 rounded-xl font-medium transition-all ${userInput.hasQualification === "no"
                                            ? "bg-gray-800 text-white"
                                            : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400"
                                            }`}
                                    >
                                        없어요
                                    </button>
                                </div>
                            </UserInput>
                        </>
                    )}

                    {currentStep >= 4 && isInexperienced && userInput.hasQualification && (
                        <>
                            <BotMessage text="알겠습니다! 📍<br/><strong>시험 응시 지역</strong>을 선택해주세요." isOld={currentStep > 4} />
                            <UserInput isOld={currentStep > 4}>
                                <select
                                    value={userInput.examRegion}
                                    onChange={(e) => {
                                        setUserInput({ ...userInput, examRegion: e.target.value });
                                        setTimeout(() => setCurrentStep(5), 300);
                                    }}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl rounded-tr-none focus:outline-none focus:border-gray-800 transition-colors bg-white"
                                >
                                    <option value="">지역 선택</option>
                                    {AVAILABLE_REGIONS.map((region) => (
                                        <option key={region} value={region}>
                                            {region}
                                        </option>
                                    ))}
                                </select>
                            </UserInput>
                        </>
                    )}

                    {((currentStep >= 4 && isExperienced && userInput.qualifications && userInput.qualifications.length > 0) ||
                        (currentStep >= 5 && isInexperienced && userInput.examRegion)) && (
                            <>
                                <BotMessage text="거의 다 왔어요! 💰<br/><strong>해당되는 지원금</strong>이 있나요?<br/>(중복 선택 가능, 없으면 건너뛰기)" isOld={canSubmit} />
                                <UserInput isOld={canSubmit}>
                                    <div className="space-y-2">
                                        {SUBSIDIES.map((sub) => (
                                            <button
                                                key={sub}
                                                type="button"
                                                onClick={() => toggleSubsidy(sub)}
                                                className={`w-full px-4 py-3 rounded-xl font-medium transition-all text-left ${userInput.subsidies?.includes(sub)
                                                    ? "bg-gray-800 text-white"
                                                    : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400"
                                                    }`}
                                            >
                                                {sub} {userInput.subsidies?.includes(sub) && "✓"}
                                            </button>
                                        ))}
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setUserInput({ ...userInput, subsidies: [] });
                                                    setTimeout(() => {
                                                        if (isExperienced) setCurrentStep(5);
                                                        else setCurrentStep(6);
                                                    }, 100);
                                                }}
                                                className="flex-1 px-4 py-3 rounded-xl font-medium bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-all"
                                            >
                                                건너뛰기
                                            </button>
                                            {userInput.subsidies && userInput.subsidies.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (isExperienced) setCurrentStep(5);
                                                        else setCurrentStep(6);
                                                    }}
                                                    className="flex-1 px-4 py-3 rounded-xl font-semibold bg-gray-800 text-white hover:bg-gray-900 transition-all"
                                                >
                                                    다음 →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </UserInput>
                            </>
                        )}

                    {canSubmit && (
                        <BotMessage text={`완료! 🎉<br/>${userInput.name}님의 맞춤형 위촉 가이드를 준비했습니다.`} />
                    )}
                </div>

                {canSubmit && (
                    <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                window.location.reload(); // Simple way to reset everything for this specific flow
                            }}
                            className="flex-1 px-4 py-4 rounded-xl font-medium bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-all"
                        >
                            처음으로
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onSubmit(e);
                            }}
                            className="flex-[2] bg-gray-800 hover:bg-gray-900 text-white py-4 rounded-xl font-semibold transition-colors"
                        >
                            내 위촉 절차 확인하기 →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function BotMessage({ text, isOld }: { text: string; isOld?: boolean }) {
    return (
        <div className={`flex gap-3 items-start transition-all duration-700 ease-out ${isOld ? 'opacity-25 blur-[4px] -translate-y-4 scale-95 pointer-events-none' : 'opacity-100 blur-0 translate-y-0 scale-100'}`}>
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
                AI
            </div>
            <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 inline-block shadow-sm">
                    <p className="text-gray-800" dangerouslySetInnerHTML={{ __html: text }} />
                </div>
            </div>
        </div>
    );
}

function UserInput({ children, isOld }: { children: React.ReactNode; isOld?: boolean }) {
    return (
        <div className={`flex gap-3 items-start justify-end transition-all duration-700 ease-out ${isOld ? 'opacity-25 blur-[4px] -translate-y-4 scale-95 pointer-events-none' : 'opacity-100 blur-0 translate-y-0 scale-100'}`}>
            <div className="flex-1 max-w-md">
                {children}
            </div>
        </div>
    );
}

function ResultSection({
    userInput,
    onPrint,
    onReset,
    onDownloadApp,
    onOpenManagerCheck,
}: {
    userInput: UserInput;
    onPrint: () => void;
    onReset: () => void;
    onDownloadApp: () => void;
    onOpenManagerCheck: () => void;
}) {
    const isExperienced = userInput.experience === "experienced";

    const handlePdfDownload = async () => {
        const { jsPDF } = await import('jspdf');
        const html2canvas = (await import('html2canvas')).default;

        const element = document.getElementById('result-content');
        if (!element) return;

        // Clone element to set fixed width for PDF generation
        const canvas = await html2canvas(element, {
            scale: 2,
            logging: false,
            useCORS: true,
            windowWidth: 800,
            ignoreElements: (element) => element.classList.contains('print-hidden'),
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${userInput.name}님_맞춤위촉가이드.pdf`);
    };

    return (
        <div className="space-y-6">
            <style jsx global>{`
                @media print {
                    header, footer, nav, .print-hidden {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                    }
                    .print-container {
                        margin: 0 !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    /* Ensure print starts from result-content */
                    #result-content {
                        display: block !important;
                    }
                }
            `}</style>

            <div className="flex gap-3 print-hidden">
                <Button onClick={onReset} variant="outline" className="flex-1">
                    처음으로
                </Button>
                <Button onClick={handlePdfDownload} variant="outline" className="flex-1 gap-2">
                    <Download size={20} />
                    PDF 저장
                </Button>
                <Button onClick={onPrint} variant="outline" className="flex-1 gap-2">
                    <Printer size={20} />
                    인쇄하기
                </Button>
            </div>

            <div id="result-content" className="print-container space-y-6">
                <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl p-6 shadow-lg print-hidden">
                    <h2 className="text-2xl font-bold mb-3">{userInput.name}님의 위촉 절차</h2>
                    <div className="flex flex-wrap gap-2 text-sm">
                        <span className="bg-white/20 px-3 py-1 rounded-full">
                            {isExperienced ? "경력자" : "무경력자"}
                        </span>
                        {isExperienced && userInput.qualifications && userInput.qualifications.length > 0 && (
                            <span className="bg-white/20 px-3 py-1 rounded-full">
                                {userInput.qualifications.join(", ") ?? ""}
                            </span>
                        )}
                        {!isExperienced && userInput.examRegion && (
                            <span className="bg-white/20 px-3 py-1 rounded-full">
                                응시지역: {userInput.examRegion}
                            </span>
                        )}
                        {userInput.subsidies && userInput.subsidies.length > 0 && (
                            <span className="bg-white/20 px-3 py-1 rounded-full">
                                지원금: {userInput.subsidies.join(", ") ?? ""}
                            </span>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-8">
                    {isExperienced && (
                        <div className="mb-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 print-hidden">
                            <p className="text-gray-600 text-[15px] leading-relaxed text-left">
                                새로운 시작을 앞두고 준비하실 게 조금 많으시죠?<br />
                                아래 순서대로 진행해 주시면 가장 빠르고 정확하게 도움을 드릴 수 있습니다.<br />
                                차근차근 준비해 보시고, 궁금한 점은 언제든 담당자에게 문의 바랍니다!
                            </p>
                        </div>
                    )}
                    {isExperienced ? (
                        <ExperiencedGuide userInput={userInput} onDownloadApp={onDownloadApp} onOpenManagerCheck={onOpenManagerCheck} />
                    ) : (
                        <InexperiencedGuide userInput={userInput} onDownloadApp={onDownloadApp} onOpenManagerCheck={onOpenManagerCheck} />
                    )}
                </div>
            </div>
        </div>
    );
}

function ExperiencedGuide({ userInput, onDownloadApp, onOpenManagerCheck }: { userInput: UserInput; onDownloadApp: () => void; onOpenManagerCheck: () => void }) {
    return (
        <div className="space-y-6">
            <div className="inline-block mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">경력자 위촉 프로세스</h3>
                <div className="flex flex-col gap-1">
                    <div className="h-1 bg-gray-800 w-[70%] rounded-full" />
                    <div className="h-1 bg-gray-800 w-[40%] rounded-full" />
                </div>
            </div>

            <StepCard
                number={1}
                title="협회 말소를 해주세요"
                color="blue"
                managers={[
                    { role: "협회소속이동", name: "윤서하", position: "사원", phone: "02-6410-7417" }
                ]}
            >
                <p className="mb-3 font-semibold">내용증명 또는 해촉신청서로 협회 말소를 진행하세요.</p>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li>• 내용증명 발송 후 발송일 포함 11일째부터 말소 가능</li>
                    <li>• 생명보험협회 / 손해보험협회 온라인 말소 가능</li>
                </ul>
            </StepCard>

            <StepCard
                number={2}
                title="서울보증보험에 개인정보제공동의를 해주세요"
                color="green"
                managers={[
                    { role: "보증보험", name: "이인교", position: "과장", phone: "02-6410-7943" }
                ]}
            >
                <div className="text-sm text-gray-700 space-y-1">
                    <p>• 서울보증보험 앱 설치</p>
                    <p className="ml-4">↓</p>
                    <p>• 개인 정보 동의</p>
                    <p className="ml-4">↓</p>
                    <p>• 1번 [계약 체결·이행을 위한 동의]</p>
                </div>
                <div className="flex justify-start mt-4">
                    <button
                        onClick={onDownloadApp}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded transition-colors flex items-center gap-2"
                    >
                        <Download size={14} />
                        <span>앱 설치하기</span>
                    </button>
                </div>
            </StepCard>

            <StepCard
                number={3}
                title="보험연수원 등록교육은 미리 수료해 주세요."
                color="purple"
                managers={[
                    { role: "시험응시", name: "방수현", position: "대리", phone: "02-6410-7411" }
                ]}
            >
                <p className="mb-2 font-semibold text-sm">3-1. 경력 확인:</p>
                <p className="text-sm text-gray-700 mb-3">
                    협회등록일 기준 직전 3년 이내, 1년 이상 경력 인정
                </p>
                <p className="mb-2 font-semibold text-sm">3-2. 교육 수강:</p>
                <p className="text-sm text-gray-700">
                    경력자등록교육 수강 (생보+손보 경력: 30H)
                </p>
            </StepCard>

            <StepCard
                number={4}
                title="굿리치 위촉을 아래와 같이 진행해 주세요"
                color="amber"
                managers={[
                    { role: "위촉심사", name: "김지열", position: "과장", phone: "02-6410-7817" }
                ]}
            >
                <div className="space-y-3 text-sm">
                    <div>
                        <p className="font-semibold mb-1">4-1. 기본정보 담당 주임단에 전달</p>
                        <p className="text-gray-700">성명, 주민번호, 자택주소, 휴대폰번호, 이메일</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">4-2. 위촉서류</p>
                        <p className="text-gray-700">신분증 사본, 통장사본, 수료증, 등본, 경력증명서, 이클린조회</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">4-3. 전자서명</p>
                        <p className="text-gray-700">위촉계약서 및 기타필수동의서 전자서명 (카카오톡/네이버 인증)</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">4-4. 서류업로드 & E-Clean정보 조회</p>
                        <p className="text-gray-700">이클린 보험 서비스 모바일 인증 진행</p>
                    </div>
                </div>
            </StepCard>

            {userInput.subsidies && userInput.subsidies.length > 0 && (
                <StepCard
                    number={5}
                    title="지원금 재정보증을 확인해 주세요."
                    color="green"
                    managers={[
                        { role: "보증보험", name: "이인교", position: "과장", phone: "02-6410-7943" },
                        { role: "기타보증", name: "김나현", position: "과장", phone: "02-6410-7145" }
                    ]}
                >
                    <p className="mb-3 font-semibold text-sm">선택하신 지원금({userInput.subsidies.join(", ")}) 수령을 위해 필수입니다.</p>
                    <div className="space-y-4 text-sm">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                            <p className="font-bold text-blue-900 mb-1">1. 보증보험 진행 (가장 일반적)</p>
                            <ul className="space-y-1 text-xs text-blue-800">
                                <li>• 주임단을 통해 한도조회 및 청약요청</li>
                                <li>• SGI서울보증 문자 수신 시 앱에서 전자서명 완료</li>
                                <li>• <span className="font-bold underline">청약 승인 후 14일 이내</span> 미발행 시 지급 불가</li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="font-bold text-gray-900 mb-1">2. 그외보증 (보증보험 불가 시)</p>
                            <p className="text-xs text-gray-700">근저당 설정, 예금질권 설정, 공동발행 약속어음 공증 중 선택하여 진행 가능 (상세 내용은 가이드북 참조)</p>
                        </div>
                    </div>
                </StepCard>
            )}

            <StepCard
                number={userInput.subsidies && userInput.subsidies.length > 0 ? 6 : 5}
                title="원수사 코드발급을 위해 확인해 주세요."
                color="red"
                managers={[
                    { role: "협회소속이동", name: "윤서하", position: "사원", phone: "02-6410-7417" }
                ]}
                footer={
                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-[13px] text-gray-600 leading-relaxed italic">
                            *자세한 내용 및 절차는 smartlink페이지 또는 담당자에게 문의바랍니다.
                        </p>
                    </div>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                        2주에 걸쳐 각 생명보험사별 위촉동의 URL 발송 → 각 보험사 링크에서 동의 완료
                    </p>
                </div>
            </StepCard>
        </div>
    );
}

function InexperiencedGuide({ userInput, onDownloadApp, onOpenManagerCheck }: { userInput: UserInput; onDownloadApp: () => void; onOpenManagerCheck: () => void }) {
    return (
        <div className="space-y-6">
            <div className="inline-block mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">무경력자 위촉 프로세스</h3>
                <div className="flex flex-col gap-1">
                    <div className="h-1 bg-gray-800 w-[70%] rounded-full" />
                    <div className="h-1 bg-gray-800 w-[40%] rounded-full" />
                </div>
            </div>

            <StepCard
                number={1}
                title="모집인 시험 접수를 해주세요"
                color="blue"
                managers={[
                    { role: "시험응시", name: "방수현", position: "대리", phone: "02-6410-7411" }
                ]}
            >
                <div className="space-y-3 text-sm">
                    <div>
                        <p className="font-semibold mb-1">기본정보를 소속 주임단에 제출</p>
                        <p className="text-gray-700">성명, 주민번호, 휴대폰번호, 이메일주소, 응시지역</p>
                    </div>
                    {userInput.examRegion && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="font-semibold mb-1">★ 응시 지역: {userInput.examRegion}</p>
                            <p className="text-gray-700 text-xs">
                                응시지역 및 시험 일정은 매월 GP공지사항 - 자격시험 응시 일정 공지를 통해 확인
                            </p>
                        </div>
                    )}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="font-semibold text-red-900 mb-1">생명보험 시험응시 경우</p>
                        <p className="text-gray-700 text-xs">
                            문자로 수신한 메트라이프생명 URL 접속하여 관련 서류 업로드
                        </p>
                    </div>
                </div>
            </StepCard>

            <StepCard
                number={2}
                title="서울보증보험에 개인정보제공동의를 해주세요"
                color="green"
                managers={[
                    { role: "보증보험", name: "이인교", position: "과장", phone: "02-6410-7943" }
                ]}
            >
                <div className="text-sm text-gray-700 space-y-1">
                    <p>• 서울보증보험 앱 설치</p>
                    <p className="ml-4">↓</p>
                    <p>• 개인 정보 동의</p>
                    <p className="ml-4">↓</p>
                    <p>• 1번 [계약 체결·이행을 위한 동의]</p>
                </div>
                <div className="flex justify-start mt-4">
                    <button
                        onClick={onDownloadApp}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded transition-colors flex items-center gap-2"
                    >
                        <Download size={14} />
                        <span>앱 설치하기</span>
                    </button>
                </div>
            </StepCard>

            <StepCard
                number={3}
                title="보험연수원 등록교육은 미리 수료해 주세요."
                color="purple"
                managers={[
                    { role: "시험응시", name: "방수현", position: "대리", phone: "02-6410-7411" }
                ]}
            >
                <div className="space-y-2 text-sm">
                    <p className="font-semibold">신규등록교육 전체 과정 40시간 수강</p>
                    <p className="text-gray-700">
                        보험연수원 웹사이트 → 모집종사자교육 → 신규등록교육 → (신규) 생명+손해+제3보험 (40H)
                    </p>
                    <p className="text-gray-700">
                        수료 후: 나의강의실 → 수료증 출력 → 발급사유[협회제출용] → PDF저장
                    </p>
                </div>
            </StepCard>

            <StepCard
                number={4}
                title="굿리치 위촉을 아래와 같이 진행해 주세요"
                color="amber"
                managers={[
                    { role: "위촉심사", name: "김지열", position: "과장", phone: "02-6410-7817" }
                ]}
            >
                <div className="space-y-3 text-sm">
                    <div>
                        <p className="font-semibold mb-1">4-1. 기본정보 담당 주임단에 전달</p>
                        <p className="text-gray-700">성명, 주민번호, 자택주소, 휴대폰번호, 이메일</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">4-2. 위촉서류</p>
                        <p className="text-gray-700">신분증 사본, 통장사본, 수료증, 등본, 경력증명서, 이클린조회</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">4-3. 전자서명</p>
                        <p className="text-gray-700">위촉계약서 및 기타필수동의서 전자서명 (카카오톡/네이버 인증)</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">4-4. 서류업로드 & E-Clean정보 조회</p>
                        <p className="text-gray-700">이클린 보험 서비스 모바일 인증 진행</p>
                    </div>
                </div>
            </StepCard>

            {userInput.subsidies && userInput.subsidies.length > 0 && (
                <StepCard
                    number={5}
                    title="지원금 재정보증을 확인해 주세요."
                    color="green"
                    managers={[
                        { role: "보증보험", name: "이인교", position: "과장", phone: "02-6410-7943" },
                        { role: "기타보증", name: "김나현", position: "과장", phone: "02-6410-7145" }
                    ]}
                >
                    <p className="mb-3 font-semibold text-sm">선택하신 지원금({userInput.subsidies.join(", ")}) 수령을 위해 필수입니다.</p>
                    <div className="space-y-4 text-sm">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                            <p className="font-bold text-blue-900 mb-1">1. 보증보험 진행 (가장 일반적)</p>
                            <ul className="space-y-1 text-xs text-blue-800">
                                <li>• 주임단을 통해 한도조회 및 청약요청</li>
                                <li>• SGI서울보증 문자 수신 시 앱에서 전자서명 완료</li>
                                <li>• <span className="font-bold underline">청약 승인 후 14일 이내</span> 미발행 시 지급 불가</li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="font-bold text-gray-900 mb-1">2. 그외보증 (보증보험 불가 시)</p>
                            <p className="text-xs text-gray-700">근저당 설정, 예금질권 설정, 공동발행 약속어음 공증 중 선택하여 진행 가능 (상세 내용은 가이드북 참조)</p>
                        </div>
                    </div>
                </StepCard>
            )}

            <StepCard
                number={userInput.subsidies && userInput.subsidies.length > 0 ? 6 : 5}
                title="원수사 코드발급을 위해 확인해 주세요."
                color="red"
                managers={[
                    { role: "협회소속이동", name: "윤서하", position: "사원", phone: "02-6410-7417" }
                ]}
                footer={
                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-[13px] text-gray-600 leading-relaxed italic">
                            *자세한 내용 및 절차는 smartlink페이지 또는 담당자에게 문의바랍니다.
                        </p>
                    </div>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                        2주에 걸쳐 각 생명보험사별 위촉동의 URL 발송 → 각 보험사 링크에서 동의 완료
                    </p>
                </div>
            </StepCard>
        </div>
    );
}

function StepCard({
    number,
    title,
    color,
    children,
    managers,
    footer,
}: {
    number: number;
    title: string;
    color: "blue" | "green" | "purple" | "amber" | "red";
    children: React.ReactNode;
    managers?: { role: string; name: string; position: string; phone?: string }[];
    footer?: React.ReactNode;
}) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-start gap-3 mb-3">
                <div className="bg-gray-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {number}
                </div>
                <h4 className="text-lg font-bold text-gray-900">{title}</h4>
            </div>
            <div className="pl-6 sm:pl-11">
                {children}
                {managers && managers.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-[11px] font-semibold text-gray-500 mb-1.5">📞 담당자 문의</p>
                        <div className="space-y-0.5 sm:space-y-1">
                            {managers.map((manager, idx) => (
                                <div key={idx} className="text-[13px] text-gray-700 flex flex-wrap sm:flex-nowrap items-baseline gap-x-2 py-0.5">
                                    <span className="font-semibold text-gray-900 min-w-[65px] shrink-0 text-left">{manager.role}</span>
                                    <span className="text-gray-300 shrink-0">|</span>
                                    <div className="flex flex-wrap items-baseline gap-x-2">
                                        <span className="text-gray-600 whitespace-nowrap">{manager.name} {manager.position}</span>
                                        {manager.phone && (
                                            <a
                                                href={`tel:${manager.phone.replace(/-/g, "")}`}
                                                className="text-blue-600 font-semibold hover:underline whitespace-nowrap"
                                            >
                                                {manager.phone}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {footer && <div className="mt-2 text-gray-400">{footer}</div>}
            </div>
        </div>
    );
}
