'use client'

import { useRef, useState } from "react";
import { ArrowLeft, Download, AlertCircle } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { addDays } from "date-fns";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/app/components/ui/card";

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

interface ApplicationPreviewProps {
  personalInfo: PersonalInfo;
  selectedResults: string[];
  onPdfDownloaded: () => void;
  onBack: () => void;
  isSample?: boolean;
}

export default function ApplicationPreview({
  personalInfo,
  selectedResults,
  onPdfDownloaded,
  onBack,
  isSample = false,
}: ApplicationPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // 등기발송일 기준 10일 경과일 계산
  const submissionDate = new Date(personalInfo.submissionDate);
  const tenDaysLater = addDays(submissionDate, 10);

  const handleDownloadPdfClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDownload = async () => {
    setShowConfirmModal(false);
    if (!previewRef.current) return;

    setIsGenerating(true);

    try {
      // html2canvas를 사용하여 HTML을 캔버스로 변환
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // 캔버스를 이미지로 변환
      const imgData = canvas.toDataURL("image/png");

      // PDF 생성
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`해촉신청서_${personalInfo.name}_${new Date().toISOString().split("T")[0]}.pdf`);

      setIsGenerating(false);
      onPdfDownloaded();
    } catch (error) {
      console.error("PDF 생성 실패:", error);
      alert("PDF 생성에 실패했습니다. 다시 시도해주세요.");
      setIsGenerating(false);
    }
  };

  const handleCancelDownload = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="space-y-4">
      {/* 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">⚠️ 잠깐!</h2>
            <div className="mb-6 space-y-3">
              <p className="leading-relaxed text-gray-700">
                본 문서는 <strong>참고용으로 제공되는 자료</strong>이며, 실제 발송 시에는 내용을 꼭 확인하신 후
                이용해 주세요.
              </p>
              <p className="leading-relaxed text-gray-700">
                내용상의 오류나 누락에 대한 <strong className="text-red-600">책임은 사용자 본인에게 있습니다.</strong>
              </p>
              <p className="mt-4 font-semibold text-gray-900">PDF를 다운로드 할까요?</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancelDownload}
                className="flex-1 transition-all duration-150 active:scale-95"
              >
                취소
              </Button>
              <Button
                onClick={handleConfirmDownload}
                className="flex-1 bg-blue-600 transition-all duration-150 active:scale-95 hover:bg-blue-700"
              >
                다운로드
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card>
        {!isSample && (
          <CardHeader>
            <CardDescription>아래 내용을 확인하신 후 PDF로 다운로드하세요.</CardDescription>
          </CardHeader>
        )}
        <CardContent className={isSample ? "pt-6" : ""}>
          {/* 일정 안내 - 샘플 모드에서는 숨김 */}
          {!isSample && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <div>
                  <p className="mb-1 text-sm font-semibold text-blue-900">직접말소 일정 안내</p>
                  <p className="text-sm text-blue-800">
                    등기발송일 11월 19일 이후 10일 경과일은{" "}
                    <span className="font-semibold">2025년 11월 29일</span>입니다. 이후 협회 방문 또는 인터넷으로
                    말소신청 웹페이지에서 신청하셔야 합니다. 공휴일에는 인터넷 접수는 가능하지만 이후 영업일에
                    처리됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 신청서 미리보기 영역 */}
          <div
            ref={previewRef}
            className="rounded-lg border border-gray-300 bg-white p-8"
            style={{ minHeight: "297mm" }}
          >
            {/* 제목 */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold">[설계사]해촉 신청서</h1>
            </div>

            {/* 신청서 표 */}
            <table className="mb-6 w-full border-collapse">
              <tbody>
                <tr>
                  <td className="w-1/4 border border-gray-800 bg-gray-100 px-4 py-3 text-center font-semibold">
                    소속회사
                  </td>
                  <td className="border border-gray-800 px-4 py-3 text-center">{personalInfo.company}</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 bg-gray-100 px-4 py-3 text-center font-semibold">성명</td>
                  <td className="border border-gray-800 px-4 py-3 text-center">{personalInfo.name}</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 bg-gray-100 px-4 py-3 text-center font-semibold">주민번호</td>
                  <td className="border border-gray-800 px-4 py-3 text-center">
                    {personalInfo.residentNumber}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 bg-gray-100 px-4 py-3 text-center font-semibold">주소</td>
                  <td className="border border-gray-800 px-4 py-3 text-center">{personalInfo.address}</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 bg-gray-100 px-4 py-3 text-center font-semibold">전화번호</td>
                  <td className="border border-gray-800 px-4 py-3 text-center">{personalInfo.phone}</td>
                </tr>
              </tbody>
            </table>

            {/* 신청 내용 */}
            <div className="mb-8 py-8 text-center">
              <p className="text-lg leading-relaxed">
                본인의 사정으로 귀사에 해촉처리를 요청하오니
                <br />
                처리하여 주시기 바랍니다.
              </p>
            </div>

            {/* 날짜 및 서명 */}
            <div className="mb-8 text-right">
              <p className="mb-2 text-lg">내용증명 발송일자</p>
              <p className="mb-4 text-lg font-semibold">
                {personalInfo.submissionDate
                  .replace(/-/g, "년 ")
                  .replace(/(\d{4})년 (\d{2}) (\d{2})/, "$1년 $2월 $3일")}
              </p>
              <p className="mb-8 text-lg">신청인: {personalInfo.name} (날인 또는 서명)</p>
            </div>

            {/* 수신처 */}
            {personalInfo.recipients && personalInfo.recipients.length > 0 && (
              <div className="text-left">
                <p className="mb-2 text-lg font-semibold">수신처:</p>
                {personalInfo.recipients.map((recipient, index) => (
                  <p key={index} className="ml-4 text-lg">
                    {index + 1}. {recipient}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 영역 - 샘플 모드에서는 숨김 */}
          {!isSample && (
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 transition-all duration-150 active:scale-95"
                disabled={isGenerating}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                이전으로
              </Button>
              <Button
                onClick={handleDownloadPdfClick}
                className="flex-1 bg-blue-600 transition-all duration-150 active:scale-95 hover:bg-blue-700"
                disabled={isGenerating}
              >
                <Download className="mr-2 h-4 w-4" />
                {isGenerating ? "PDF 생성 중..." : "PDF 다운로드"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

