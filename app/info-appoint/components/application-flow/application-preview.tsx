'use client'

import { useState, useRef, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ArrowLeft, Download, AlertCircle } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { addDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';

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
  autoDownload?: boolean;
  blankTitle?: string;
}

export default function ApplicationPreview({
  personalInfo,
  selectedResults,
  onPdfDownloaded,
  onBack,
  isSample = false,
  autoDownload = false,
  blankTitle = ""
}: ApplicationPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // 자동 다운로드 효과
  useEffect(() => {
    if (autoDownload && previewRef.current && !isGenerating) {
      setShowConfirmModal(true);
    }
  }, [autoDownload, previewRef.current]);

  // 등기발송일 기준 10일 경과일 계산
  const submissionDate = personalInfo.submissionDate ? new Date(personalInfo.submissionDate) : new Date();
  const tenDaysLater = addDays(submissionDate, 10);

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (phone: string) => {
    // 이미 하이픈이 있는 경우 그대로 반환
    if (phone.includes('-')) return phone;

    // 숫자만 있는 경우 포맷팅
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 10) {
      // 02-1234-5678 또는 010-123-4567 등
      if (cleaned.startsWith('02')) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
      }
      return cleaned.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
    }
    return phone;
  };

  // 주민번호 포맷팅 함수
  const formatResidentNumber = (rrn: string) => {
    // 이미 하이픈이 있는 경우 그대로 반환
    if (rrn.includes('-')) return rrn;

    // 숫자만 있는 경우 포맷팅
    const cleaned = rrn.replace(/[^0-9]/g, '');
    if (cleaned.length === 13) {
      return cleaned.replace(/(\d{6})(\d{7})/, '$1-$2');
    }
    return rrn;
  };

  const handleDownloadPdfClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDownload = async () => {
    setShowConfirmModal(false);
    if (!previewRef.current) return;

    setIsGenerating(true);

    // 현재 스타일 저장
    const originalStyle = {
      width: previewRef.current.style.width,
      minWidth: previewRef.current.style.minWidth,
      maxWidth: previewRef.current.style.maxWidth,
    };

    try {
      // PDF 생성을 위해 강제로 A4 크기로 고정
      previewRef.current.style.width = '210mm';
      previewRef.current.style.minWidth = '210mm';
      previewRef.current.style.maxWidth = 'none';

      // 스타일 변경이 적용되도록 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 200));

      // html2canvas를 사용하여 HTML을 캔버스로 변환
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 794, // 210mm to px (96dpi 기준 약 794px)
        windowWidth: 1080, // 모바일에서 PC 뷰포트로 인식하게 함
      });

      // 스타일 복구
      previewRef.current.style.width = originalStyle.width;
      previewRef.current.style.minWidth = originalStyle.minWidth;
      previewRef.current.style.maxWidth = originalStyle.maxWidth;

      // 캔버스를 이미지로 변환
      const imgData = canvas.toDataURL('image/png');

      // PDF 생성
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      const fileName = `내용증명_${personalInfo.name.trim() || '빈양식'}_${new Date().toISOString().split('T')[0]}.pdf`;

      // 브라우저가 File System Access API를 지원하는지 확인 (직접 폴더/이름 지정 창)
      if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
        try {
          const handle = await (window as any).showSaveFilePicker({
            suggestedName: fileName,
            types: [{
              description: 'PDF Document',
              accept: { 'application/pdf': ['.pdf'] },
            }],
          });

          const writable = await handle.createWritable();
          const pdfBlob = pdf.output('blob');
          await writable.write(pdfBlob);
          await writable.close();
        } catch (err: any) {
          // 사용자가 취소한 경우 또는 에러 발생 시 기존 방식으로 폴백 (단, 취소 에러면 아무것도 안함)
          if (err.name !== 'AbortError') {
            pdf.save(fileName);
          }
        }
      } else {
        // 지원하지 않는 브라우저(Safari, Firefox 등)는 기존 방식 사용
        pdf.save(fileName);
      }

      setIsGenerating(false);
      onPdfDownloaded();
    } catch (error) {
      console.error('PDF 생성 실패:', error);

      // 에러 발생 시에도 스타일 복구 시도
      if (previewRef.current) {
        previewRef.current.style.width = originalStyle.width;
        previewRef.current.style.minWidth = originalStyle.minWidth;
        previewRef.current.style.maxWidth = originalStyle.maxWidth;
      }

      alert('PDF 생성에 실패했습니다. 다시 시도해주세요.');
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="space-y-3 mb-6">
              {autoDownload ? (
                <>
                  <p className="text-gray-700 leading-relaxed text-center py-4">
                    <strong>내용증명</strong>을 다운로드합니다.
                  </p>
                  <p className="text-blue-600 font-semibold mt-4 text-center">
                    {typeof window !== 'undefined' && 'showSaveFilePicker' in window
                      ? "확인 버튼을 누른 후, 원하시는 저장 폴더를 선택해주세요."
                      : "확인을 누르시면 다운로드 폴더(또는 파일 앱)에 저장됩니다."}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">⚠️ 잠깐!</h2>
                  <p className="text-gray-700 leading-relaxed">
                    본 문서는 <strong>참고용으로 제공되는 자료</strong>이며, 실제 발송 시에는 내용을 꼭 확인하신 후 이용해 주세요.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    내용상의 오류나 누락에 대한 <strong className="text-red-600">책임은 사용자 본인에게 있습니다.</strong>
                  </p>
                  <p className="text-gray-900 font-semibold mt-4">
                    PDF를 다운로드 할까요?
                  </p>
                </>
              )}
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-150 active:scale-95"
              >
                {autoDownload ? '확인' : '다운로드'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card className={autoDownload ? "hidden" : ""}>
        {!isSample && (
          <CardHeader>
            <CardDescription>
              아래 내용을 확인하신 후 PDF로 다운로드하세요.
            </CardDescription>
          </CardHeader>
        )}
        <CardContent className={isSample ? "pt-6" : ""}>
          {/* 일정 안내 - 샘플 모드 또는 자동 다운로드 모드에서는 숨김 */}
          {!isSample && !autoDownload && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    직접말소 일정 안내
                  </p>
                  <p className="text-sm text-blue-800">
                    등기발송일 11월 19일 이후 10일 경과일은{' '}
                    <span className="font-semibold">2025년 11월 29일</span>입니다.{' '}
                    이후 협회 방문 또는 인터넷으로 말소신청 웹페이지에서 신청하셔야 합니다.{' '}
                    공휴일에는 인터넷 접수는 가능하지만 이후 영업일에 처리됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 신청서 미리보기 영역 - 자동 다운로드 모드가 아닐 때만 ref 사용 */}
          <div
            ref={autoDownload ? null : previewRef}
            className="bg-white p-8 border border-gray-300 rounded-lg"
            style={{ minHeight: '297mm' }}
          >
            {/* 제목 */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">내용증명</h1>
            </div>

            {/* 신청서 표 */}
            <table className="w-full border-collapse mb-6">
              <tbody>
                {personalInfo.company && (
                  <tr>
                    <td className="border border-gray-800 bg-gray-100 px-4 py-3 font-semibold w-1/4 text-center">
                      소속회사
                    </td>
                    <td className="border border-gray-800 px-4 py-3 text-center">
                      {personalInfo.company}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="border border-gray-800 bg-gray-100 px-4 py-3 font-semibold text-center">
                    성명
                  </td>
                  <td className="border border-gray-800 px-4 py-3 text-center">
                    {personalInfo.name}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 bg-gray-100 px-4 py-3 font-semibold text-center">
                    주민번호
                  </td>
                  <td className="border border-gray-800 px-4 py-3 text-center">
                    {formatResidentNumber(personalInfo.residentNumber)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 bg-gray-100 px-4 py-3 font-semibold text-center">
                    주소
                  </td>
                  <td className="border border-gray-800 px-4 py-3 text-center">
                    {personalInfo.address}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-800 bg-gray-100 px-4 py-3 font-semibold text-center">
                    전화번호
                  </td>
                  <td className="border border-gray-800 px-4 py-3 text-center">
                    {formatPhoneNumber(personalInfo.phone)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* 신청 내용 */}
            <div className="mb-8 text-center py-8">
              <p className="text-lg leading-relaxed">
                본인의 사정으로 귀사에 해촉처리를 요청하오니<br />
                처리하여 주시기 바랍니다.
              </p>
            </div>

            {/* 날짜 및 서명 */}
            <div className="mb-8 text-right">
              <p className="text-lg mb-2">내용증명 발송일자</p>
              <p className="text-lg mb-4 font-semibold">
                {personalInfo.submissionDate ? personalInfo.submissionDate.replace(/-/g, '년 ').replace(/(\d{4})년 (\d{2}) (\d{2})/, '$1년 $2월 $3일') : ''}
              </p>
              <p className="text-lg mb-8">
                신청인: {personalInfo.name} (날인 또는 서명)
              </p>
            </div>

            {/* 수신처 */}
            {personalInfo.recipients && personalInfo.recipients.length > 0 && (
              <div className="text-left">
                <p className="text-lg font-semibold mb-2">수신처:</p>
                {personalInfo.recipients.map((recipient, index) => (
                  <p key={index} className="text-lg ml-4">
                    {index + 1}. {recipient}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 영역 - 샘플 모드 또는 자동 다운로드 모드에서는 숨김 */}
          {!isSample && !autoDownload && (
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 transition-all duration-150 active:scale-95"
                disabled={isGenerating}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                이전으로
              </Button>
              <Button
                onClick={handleDownloadPdfClick}
                className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-150 active:scale-95"
                disabled={isGenerating}
              >
                <Download className="h-4 w-4 mr-2" />
                {isGenerating ? 'PDF 생성 중...' : 'PDF 다운로드'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 자동 다운로드 모드에서의 숨겨진 정적 요소 (html2canvas용) */}
      {autoDownload && (
        <div className="fixed opacity-0 pointer-events-none -z-50" style={{ left: '-9999px' }}>
          {/* html2canvas는 이 영역을 캡처할 것입니다 */}
          <div ref={previewRef} className="bg-white p-8 border border-gray-300 rounded-lg" style={{ width: '210mm', minHeight: '297mm' }}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">내용증명</h1>
            </div>
            <table className="w-full border-collapse mb-6">
              <tbody>
                <tr><td className="border border-gray-800 bg-gray-100 px-4 py-3 font-semibold w-1/4 text-center">소속회사</td><td className="border border-gray-800 px-4 py-3 text-center">&nbsp;</td></tr>
                <tr><td className="border border-gray-800 bg-gray-100 px-4 py-3 font-semibold text-center">성명</td><td className="border border-gray-800 px-4 py-3 text-center">&nbsp;</td></tr>
                <tr><td className="border border-gray-800 bg-gray-100 px-4 py-3 font-semibold text-center">주민번호</td><td className="border border-gray-800 px-4 py-3 text-center">&nbsp;</td></tr>
                <tr><td className="border border-gray-800 bg-gray-100 px-4 py-3 font-semibold text-center">주소</td><td className="border border-gray-800 px-4 py-3 text-center">&nbsp;</td></tr>
                <tr><td className="border border-gray-800 bg-gray-100 px-4 py-3 font-semibold text-center">전화번호</td><td className="border border-gray-800 px-4 py-3 text-center">&nbsp;</td></tr>
              </tbody>
            </table>
            <div className="mb-8 text-center py-8">
              <p className="text-lg leading-relaxed">본인의 사정으로 귀사에 해촉처리를 요청하오니<br />처리하여 주시기 바랍니다.</p>
            </div>
            <div className="mb-8 text-right">
              <p className="text-lg mb-2">내용증명 발송일자</p>
              <p className="text-lg mb-4 font-semibold">{format(new Date(), 'yyyy년 MM월 dd일', { locale: ko })}</p>
              <p className="text-lg mb-8">신청인: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (날인 또는 서명)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

