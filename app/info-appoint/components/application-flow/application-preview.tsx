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
  const [scale, setScale] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 브라우저 크기에 따른 미리보기 스케일 조정 로직
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const docWidth = 210 * 3.78; // 210mm to px (approx)
        if (containerWidth < docWidth) {
          setScale(containerWidth / docWidth);
        } else {
          setScale(1);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 자동 다운로드 효과
  useEffect(() => {
    if (autoDownload && previewRef.current && !isGenerating && !showConfirmModal) {
      handleConfirmDownload();
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
    if (isGenerating) return;

    if (!previewRef.current) {
      alert('미리보기 영역을 찾을 수 없습니다.');
      setShowConfirmModal(false);
      return;
    }

    setIsGenerating(true);

    // 현재 스타일 저장
    const originalStyle = {
      width: previewRef.current.style.width,
      minWidth: previewRef.current.style.minWidth,
      maxWidth: previewRef.current.style.maxWidth,
      position: previewRef.current.style.position,
      top: previewRef.current.style.top,
      left: previewRef.current.style.left,
      opacity: previewRef.current.style.opacity,
      zIndex: previewRef.current.style.zIndex,
      transform: previewRef.current.style.transform,
      padding: previewRef.current.style.padding,
      fontSize: previewRef.current.style.fontSize,
      backgroundColor: previewRef.current.style.backgroundColor,
    };

    try {
      // 1. PDF 생성을 위해 강제로 A4 크기로 고정 및 렌더링 최적화
      // 모바일 화면의 제약을 받지 않도록 fixed로 화면 밖으로 빼서 렌더링
      previewRef.current.style.position = 'fixed';
      previewRef.current.style.top = '0';
      previewRef.current.style.left = '-10000px'; // 화면 밖으로 이동
      previewRef.current.style.width = '794px';   // A4 너비 (약 210mm)
      previewRef.current.style.minWidth = '794px';
      previewRef.current.style.maxWidth = 'none';
      previewRef.current.style.transform = 'none';
      previewRef.current.style.padding = '75px 60px'; // 약 20mm 15mm
      previewRef.current.style.fontSize = '16px';  // 16px (표준 폰트 크기)
      previewRef.current.style.opacity = '1';
      previewRef.current.style.zIndex = '9999';
      previewRef.current.style.backgroundColor = 'white';

      // 스타일 변경이 브라우저에 리페인트 될 시간을 충분히 줌 (모바일 대응)
      await new Promise(resolve => setTimeout(resolve, 600));

      // 2. 모바일 기기에 따라 자동 스케일 조정 (메모리 부족 방지)
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const captureScale = isMobile ? 1.5 : 2;

      // 3. html2canvas를 사용하여 HTML을 캔버스로 변환
      const canvas = await html2canvas(previewRef.current, {
        scale: captureScale,
        useCORS: true,
        logging: false,
        width: 794, // 210mm to px (96dpi 기준 약 794px)
        windowWidth: 1200, // PC 기준으로 캡처하기 위해 고정
      });

      // 스타일 즉시 복구
      previewRef.current.style.width = originalStyle.width;
      previewRef.current.style.minWidth = originalStyle.minWidth;
      previewRef.current.style.maxWidth = originalStyle.maxWidth;
      previewRef.current.style.position = originalStyle.position;
      previewRef.current.style.top = originalStyle.top;
      previewRef.current.style.left = originalStyle.left;
      previewRef.current.style.opacity = originalStyle.opacity;
      previewRef.current.style.zIndex = originalStyle.zIndex;
      previewRef.current.style.transform = originalStyle.transform;
      previewRef.current.style.padding = originalStyle.padding;
      previewRef.current.style.fontSize = originalStyle.fontSize;
      previewRef.current.style.backgroundColor = originalStyle.backgroundColor;

      // 4. 캔버스를 이미지로 변환
      const imgData = canvas.toDataURL('image/png');

      // 5. PDF 생성
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      const fileName = `내용증명_${personalInfo.name.trim() || '빈양식'}_${new Date().toISOString().split('T')[0]}.pdf`;

      // 6. 다운로드 처리 (PC/모바일 분기)
      if (typeof window !== 'undefined' && 'showSaveFilePicker' in window && !isMobile) {
        // PC (지원 브라우저): 직접 폴더/이름 지정 창
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
          onPdfDownloaded();
        } catch (err: any) {
          if (err.name !== 'AbortError') {
            pdf.save(fileName);
            onPdfDownloaded();
          }
        }
      } else {
        // 모바일 또는 일반 브라우저: 자동 다운로드
        // blob을 직접 생성하여 다운로드하는 방식이 모바일에서 더 안정적일 수 있음
        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        onPdfDownloaded();
      }

      setIsGenerating(false);
      setShowConfirmModal(false);
    } catch (error) {
      console.error('PDF 생성 실패:', error);

      // 에러 발생 시에도 스타일 복구
      if (previewRef.current) {
        previewRef.current.style.width = originalStyle.width;
        previewRef.current.style.minWidth = originalStyle.minWidth;
        previewRef.current.style.maxWidth = originalStyle.maxWidth;
      }

      alert('PDF 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      setIsGenerating(false);
      setShowConfirmModal(false);
    }
  };

  const handleCancelDownload = () => {
    if (isGenerating) return;
    setShowConfirmModal(false);
  };

  return (
    <div className="space-y-6 px-0 sm:px-1">
      {/* 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="space-y-3 mb-6">
              {autoDownload ? (
                <>
                  <p className="text-gray-700 leading-relaxed text-center py-4 text-lg">
                    <strong>내용증명(빈양식)</strong>을 다운로드합니다.
                  </p>
                  <p className="text-blue-600 font-semibold mt-4 text-center">
                    {typeof window !== 'undefined' && 'showSaveFilePicker' in window && !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
                      ? "확인 버튼을 누른 후, 원하시는 저장 폴더를 선택해주세요."
                      : "확인을 누르시면 다운로드 폴더(파일 앱)에 저장됩니다."}
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
                disabled={isGenerating}
              >
                취소
              </Button>
              <Button
                onClick={handleConfirmDownload}
                disabled={isGenerating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-150 active:scale-95 relative"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    생성 중...
                  </span>
                ) : (autoDownload ? '확인' : '다운로드')}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={autoDownload ? "hidden" : ""}>
        {!isSample && (
          <div className="mb-4">
            <p className="text-gray-500 text-sm">
              아래 내용을 확인하신 후 PDF로 다운로드하세요.
            </p>
          </div>
        )}
        <div>
          {/* 일정 안내 - 샘플 모드 또는 자동 다운로드 모드에서는 숨김 */}
          {!isSample && !autoDownload && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    신청 전 확인사항
                  </p>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    본 문서는 <span className="font-bold underline">A4 규격</span>으로 생성됩니다. 아래 미리보기를 확인하신 후 하단의 <b>다운로드</b> 버튼을 눌러주세요.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 신청서 미리보기 영역 - 종이 문서 느낌 스타일 제거 및 여백 최소화 */}
          <div ref={containerRef} className="flex justify-center bg-white py-0 sm:py-4 overflow-hidden border-0">
            <div
              ref={autoDownload ? null : previewRef}
              className="bg-white origin-top transition-transform"
              style={{
                width: '210mm',
                minHeight: '297mm',
                padding: scale < 0.5 ? '4mm 2mm' : (scale < 0.7 ? '8mm 6mm' : '20mm 15mm'),
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                marginBottom: scale < 1 ? `-${Math.ceil((1 - scale) * 297 * 3.78)}px` : '0', // 스케일 축소 시 발생하는 공백만큼 하단 여백 제거
                fontSize: scale < 0.6 ? '1.25em' : '1em', // 작은 화면에서 텍스트 시인성 극대화
                border: 'none'
              }}
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
          </div>

          {/* 버튼 영역 - 샘플 모드 또는 자동 다운로드 모드에서는 숨김 */}
          {!isSample && !autoDownload && (
            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 transition-all duration-150 active:scale-95 border-gray-300 text-gray-600"
                disabled={isGenerating}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                수정하기
              </Button>
              <Button
                onClick={handleDownloadPdfClick}
                className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all duration-150 active:scale-95 shadow-lg shadow-blue-200"
                disabled={isGenerating}
              >
                <Download className="h-4 w-4 mr-2" />
                {isGenerating ? '생성 중...' : 'PDF 다운로드'}
              </Button>
            </div>
          )}
        </div>
      </div>

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
              <p className="text-lg mb-4 font-semibold mr-10">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;년 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;월 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;일</p>
              <p className="text-lg mb-8">신청인: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (날인 또는 서명)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

