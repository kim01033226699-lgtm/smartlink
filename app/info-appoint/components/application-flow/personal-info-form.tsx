'use client'

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Calendar } from "@/app/components/ui/calendar";
import { ArrowLeft, CalendarIcon, ExternalLink, Download, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface PersonalInfo {
  company: string;
  companyAddress: string;
  lifeAssociationAddress: string;
  generalAssociationAddress: string;
  residentNumber: string;
  name: string;
  address: string;
  phone: string;
  submissionDate: string;
  recipients: string[];
}

interface PersonalInfoFormProps {
  onComplete: (info: PersonalInfo) => void;
  onBack: () => void;
  selectedResults: string[];
  onOpenSample?: () => void;
  onOpenBlank?: () => void;
}

interface Recipient {
  company: string;
  address: string;
}

export default function PersonalInfoForm({ onComplete, onBack, selectedResults, onOpenSample, onOpenBlank }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState<PersonalInfo>({
    company: '',
    companyAddress: '',
    lifeAssociationAddress: '',
    generalAssociationAddress: '',
    residentNumber: '',
    name: '',
    address: '',
    phone: '',
    submissionDate: '',
    recipients: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PersonalInfo, string>>>({});
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    // 구글시트에서 가져온 수신처 데이터 로드
    const loadRecipients = async () => {
      try {
        const basePath = process.env.__NEXT_ROUTER_BASEPATH || '';
        const response = await fetch(`${basePath}/data.json`);
        if (response.ok) {
          const data = await response.json();
          setRecipients(data.recipients || []);
        }
      } catch (error) {
        console.error('수신처 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipients();
  }, []);

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 초기화
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleReset = () => {
    setFormData({
      company: '',
      companyAddress: '',
      lifeAssociationAddress: '',
      generalAssociationAddress: '',
      residentNumber: '',
      name: '',
      address: '',
      phone: '',
      submissionDate: '',
      recipients: [],
    });
    setSelectedDate(undefined);
    setErrors({});
  };

  const isFormValid = () => {
    const { name, residentNumber, address, phone, submissionDate } = formData;
    return (
      name.trim() !== '' &&
      residentNumber.trim() !== '' &&
      /^\d{6}-?\d{7}$/.test(residentNumber) &&
      address.trim() !== '' &&
      phone.trim() !== '' &&
      /^[\d-]{10,14}$/.test(phone) &&
      submissionDate !== ''
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PersonalInfo, string>> = {};

    // 소속회사는 선택사항이므로 필수 체크 제거

    if (!formData.residentNumber.trim()) {
      newErrors.residentNumber = '주민번호를 입력해주세요.';
    } else if (!/^\d{6}-?\d{7}$/.test(formData.residentNumber)) {
      newErrors.residentNumber = '올바른 주민번호 형식이 아닙니다. (예: 123456-1234567 또는 생략)';
    }

    if (!formData.name.trim()) {
      newErrors.name = '성명을 입력해주세요.';
    }

    if (!formData.address.trim()) {
      newErrors.address = '주소를 입력해주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^[\d-]{10,14}$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다.';
    }

    if (!formData.submissionDate) {
      newErrors.submissionDate = '신청일자를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // 질문 결과에서 수신처 생성 - 폼 입력 순서대로 정렬
      const finalRecipients: string[] = [];

      // 1. 현재 소속 회사 (폼의 첫 번째 입력) - 회사명이 입력된 경우만
      if (selectedResults.includes('현재 재직회사') && formData.company && formData.company.trim()) {
        let recipientString = formData.company;
        if (formData.companyAddress && formData.companyAddress.trim()) {
          recipientString = `${formData.company} - ${formData.companyAddress}`;
        } else {
          const matchedRecipient = recipients.find(r => r.company === formData.company);
          if (matchedRecipient) {
            recipientString = `${matchedRecipient.company} - ${matchedRecipient.address}`;
          }
        }
        finalRecipients.push(recipientString);
      }

      // 2. 생명보험협회 (폼의 두 번째 입력) - 주소가 입력된 경우만
      if (selectedResults.some(r => r.includes('생명보험협회')) &&
        formData.lifeAssociationAddress &&
        formData.lifeAssociationAddress.trim()) {
        finalRecipients.push(`생명보험협회 - ${formData.lifeAssociationAddress}`);
      }

      // 3. 손해보험협회 (폼의 세 번째 입력) - 주소가 입력된 경우만
      if (selectedResults.some(r => r.includes('손해보험협회')) &&
        formData.generalAssociationAddress &&
        formData.generalAssociationAddress.trim()) {
        finalRecipients.push(`손해보험협회 - ${formData.generalAssociationAddress}`);
      }

      // 4. 기타 수신처 (위 3개가 아닌 경우)
      selectedResults.forEach(result => {
        if (result !== '현재 재직회사' &&
          !result.includes('생명보험협회') &&
          !result.includes('손해보험협회')) {
          const matchedRecipient = recipients.find(r =>
            r.company.includes(result) || result.includes(r.company)
          );
          if (matchedRecipient) {
            const recipientString = `${matchedRecipient.company} - ${matchedRecipient.address}`;
            finalRecipients.push(recipientString);
          } else {
            finalRecipients.push(result);
          }
        }
      });

      onComplete({ ...formData, recipients: finalRecipients });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {/* 상단 샘플/양식 다운로드 버튼 (이동됨) */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            type="button"
            variant="outline"
            onClick={onOpenSample}
            className="flex items-center justify-center gap-2 h-10 border-blue-200 text-blue-600 font-bold hover:bg-blue-50 transition-colors shadow-sm"
          >
            <ExternalLink size={16} />
            샘플
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onOpenBlank}
            className="flex items-center justify-center gap-2 h-10 border-orange-200 text-orange-600 font-bold hover:bg-orange-50 transition-colors shadow-sm"
          >
            <Download size={16} />
            양식다운
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 수신처 (삭제됨) */}

          {/* 소속회사 */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              현재 소속 회사명
            </label>
            <input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.company ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="현재 소속 회사명 입력"
            />
            {errors.company && (
              <p className="text-red-500 text-sm mt-1">{errors.company}</p>
            )}
          </div>

          {/* 회사 주소 */}
          <div>
            <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
              현재 소속 회사 본사 주소(수신인:해촉담당자)
            </label>
            <input
              id="companyAddress"
              type="text"
              value={formData.companyAddress}
              onChange={(e) => handleChange('companyAddress', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="현재 소속 회사 본사 주소 입력"
            />
          </div>

          {/* 생명보험협회 주소 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="lifeAssociationAddress" className="block text-sm font-medium text-gray-700">
                생명보험협회 주소 <span className="text-xs text-gray-500">(수신인:말소담당자)</span>
              </label>
              <a
                href="https://fp.insure.or.kr/process/process01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-gray-100 hover:bg-gray-200 text-blue-600 px-2 py-1 rounded border border-gray-200 transition-colors"
              >
                협회주소찾기
              </a>
            </div>
            <input
              id="lifeAssociationAddress"
              type="text"
              value={formData.lifeAssociationAddress}
              onChange={(e) => handleChange('lifeAssociationAddress', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="해당 지역 생명보험협회 주소 입력"
            />
          </div>

          {/* 손해보험협회 주소 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="generalAssociationAddress" className="block text-sm font-medium text-gray-700">
                손해보험협회 주소 <span className="text-xs text-gray-500">(수신인:말소담당자)</span>
              </label>
              <a
                href="https://isi.knia.or.kr/cancellation/cancelInfo.do"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-gray-100 hover:bg-gray-200 text-blue-600 px-2 py-1 rounded border border-gray-200 transition-colors"
              >
                협회주소찾기
              </a>
            </div>
            <input
              id="generalAssociationAddress"
              type="text"
              value={formData.generalAssociationAddress}
              onChange={(e) => handleChange('generalAssociationAddress', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="해당 지역 손해보험협회 주소 입력"
            />
          </div>

          {/* 성명 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              성명 <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="홍길동"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* 주민번호 */}
          <div>
            <label htmlFor="residentNumber" className="block text-sm font-medium text-gray-700 mb-1">
              주민번호 <span className="text-red-500">*</span>
            </label>
            <input
              id="residentNumber"
              type="text"
              value={formData.residentNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9-]/g, ''); // 숫자와 - 만 허용
                handleChange('residentNumber', value);
              }}
              onBlur={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length === 13) {
                  handleChange('residentNumber', value.replace(/(\d{6})(\d{7})/, '$1-$2'));
                }
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.residentNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="900101-1234567"
              maxLength={14}
            />
            {errors.residentNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.residentNumber}</p>
            )}
          </div>

          {/* 주소 */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              주소 <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="본인의 집 주소를 입력하세요"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* 전화번호 */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              전화번호 <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9-]/g, ''); // 숫자와 - 만 허용
                handleChange('phone', value);
              }}
              onBlur={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length === 11) {
                  handleChange('phone', value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
                } else if (value.length === 10) {
                  if (value.startsWith('02')) {
                    handleChange('phone', value.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3'));
                  } else {
                    handleChange('phone', value.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3'));
                  }
                }
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="010-1234-5678"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* 내용증명 발송일자 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              내용증명 발송일자 <span className="text-red-500">*</span>
            </label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground",
                    errors.submissionDate && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP", { locale: ko })
                  ) : (
                    <span>날짜를 선택해주세요</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    if (date) {
                      handleChange('submissionDate', format(date, 'yyyy-MM-dd'));
                    }
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                  locale={ko}
                  weekStartsOn={0}
                  modifiers={{
                    today: new Date()
                  }}
                  modifiersStyles={{
                    today: {
                      backgroundColor: '#fffbeb', // yellow-50
                      color: '#d97706', // amber-600
                      fontWeight: 'bold',
                      border: '2px solid #fbbf24' // amber-400
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
            {errors.submissionDate && (
              <p className="text-red-500 text-sm mt-1">{errors.submissionDate}</p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="flex-1 transition-all duration-150 active:scale-95 text-gray-500 hover:text-gray-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              새로고침
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid()}
              className={cn(
                "flex-1 transition-all duration-150 active:scale-95",
                isFormValid()
                  ? "bg-blue-600 hover:bg-blue-700 shadow-md"
                  : "bg-gray-200 text-gray-400 border-gray-100 cursor-not-allowed"
              )}
            >
              미리보기
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

