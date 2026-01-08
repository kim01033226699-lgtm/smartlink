'use client';

import { X, Search, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import React, { useState, useMemo } from 'react';

interface Contact {
    role: string;
    name: string;
    position?: string;
    isVertical?: boolean;
    roleClass?: string;
    nameClass?: string;
}

interface Team {
    title: string;
    contacts: Contact[];
}

interface ManagerInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const managerData: Team[] = [
    {
        title: '부문 지원',
        contacts: [
            { role: '중부', name: '윤정희', position: '차장' },
            { role: '동부', name: '김소은', position: '과장' },
            { role: '서부', name: '공기택', position: '대리' },
            { role: '그 외 부문', name: '안다솜', position: '과장' },
        ]
    },
    {
        title: '위촉지원실',
        contacts: [
            { role: '위촉심사', name: '김지열', position: '과장' },
            { role: '시험응시', name: '방수현', position: '대리' },
            { role: '협회소속이동', name: '윤서하', position: '사원' },
            { role: '해촉담당', name: '이성연', position: '사원' },
        ]
    },
    {
        title: '채권실',
        contacts: [
            { role: '보증보험', name: '이인교', position: '과장' },
            { role: '그 외 보증', name: '김나현', position: '과장' },
        ]
    },
    {
        title: '영업지원금관리팀',
        contacts: [
            { role: '정착지원금', name: '박세현', position: '차장' },
            { role: '영업관리자 지원금', name: '성현', position: '대리' },
            { role: '기타', name: '이천영', position: '팀장', roleClass: 'text-blue-600', nameClass: 'text-blue-600' },
        ]
    },
    {
        title: '채널교육팀',
        contacts: [
            { role: '금융캠퍼스', name: '신지수', position: '과장' },
            { role: '입문과정', name: '김석현', position: '대리' },
            { role: '법인교육', name: '최인석', position: '과장' },
            { role: '테마교육', name: '김현진', position: '과장' },
            { role: '기타', name: '이철', position: '팀장', roleClass: 'text-blue-600', nameClass: 'text-blue-600' },
        ]
    },
    {
        title: '수수료',
        contacts: [
            { role: '중부, 직할', name: '한나라', position: '과장' },
            { role: '동부, 법인, 총괄', name: '박소희', position: '대리' },
            { role: '서부,영업마케팅', name: '김진경', position: '과장' },
            { role: '기타', name: '고나연', position: '팀장', roleClass: 'text-blue-600', nameClass: 'text-blue-600' },
        ]
    },
    {
        title: '시책 & 운영비',
        contacts: [
            { role: '운영비', name: '김정우', position: '대리' },
            { role: '생보시책', name: '홍희지', position: '대리' },
            { role: '손보시책', name: '최성락', position: '차장' },
            { role: '본사 규정 & 기타', name: '장흥석', position: '팀장', roleClass: 'text-blue-600', nameClass: 'text-blue-600' },
        ]
    },
    {
        title: 'DB사업팀',
        contacts: [
            { role: '미과금 DB', name: '제영록', position: '과장' },
            { role: '퍼미션, 인포DB', name: '고은서', position: '과장' },
            { role: '기계약DB', name: '안다솜', position: '과장' },
            { role: '기타', name: '이지연', position: '팀장', roleClass: 'text-blue-600', nameClass: 'text-blue-600' },
        ]
    },
    {
        title: '금융캠퍼스',
        contacts: [
            { role: '금융캠퍼스 교육 문의', name: '정진래', position: '차장' },
            { role: '베이직과정 교육 문의', name: '최인석', position: '과장' },
            { role: '지원금 지급 및 평가', name: '이천영', position: '팀장', roleClass: 'text-blue-600', nameClass: 'text-blue-600' },
            { role: '지원안 제출', name: '박세현', position: '차장' },
            { role: 'DB배정', name: '제영록', position: '과장' },
            { role: '규정 문의, DB평가', name: '고현진', position: '과장' },
        ]
    },
    {
        title: '그 외 영업 지원',
        contacts: [
            { role: '주임단 지원', name: '이서영', position: '차장' },
            { role: '금융캠퍼스 평가', name: '고현진', position: '과장' },
            { role: '조직승강격, 315, MDRT, 자격유지평가등', name: '서미해', position: '대리', isVertical: true },
            { role: '연도등 행사평가, 마케팅임원', name: '조준승', position: '차장' },
            { role: '임차 및 인프라', name: '김현철', position: '과장' },
            { role: '기타', name: '김남현', position: '팀장', roleClass: 'text-blue-600', nameClass: 'text-blue-600' },
        ]
    },
];

export default function ManagerInfoModal({ isOpen, onClose }: ManagerInfoModalProps) {
    const [expandedTeams, setExpandedTeams] = useState<Set<number>>(new Set());

    const toggleTeam = (idx: number) => {
        const next = new Set(expandedTeams);
        if (next.has(idx)) {
            next.delete(idx);
        } else {
            next.add(idx);
        }
        setExpandedTeams(next);
    };

    const expandAll = () => {
        setExpandedTeams(new Set(managerData.map((_, i) => i)));
    };

    const collapseAll = () => {
        setExpandedTeams(new Set());
    };

    const isAllExpanded = useMemo(() => expandedTeams.size === managerData.length, [expandedTeams.size]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between sticky top-0 z-10 gap-3">
                    <div className="flex items-center gap-2">
                        <Search className="text-gray-800" size={24} />
                        <h2 className="text-xl font-bold text-gray-900">본사 담당자 안내</h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50 mr-2">
                            <button
                                onClick={expandAll}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${isAllExpanded ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Eye size={14} />
                                전체 펼치기
                            </button>
                            <button
                                onClick={collapseAll}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${expandedTeams.size === 0 ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <EyeOff size={14} />
                                전체 닫기
                            </button>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {managerData.map((team, idx) => {
                            const isExpanded = expandedTeams.has(idx);
                            return (
                                <div
                                    key={idx}
                                    className={`bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200 flex flex-col ${isExpanded ? 'h-auto' : 'h-fit'}`}
                                >
                                    <button
                                        onClick={() => toggleTeam(idx)}
                                        className="w-full text-left p-4 focus:outline-none group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-gray-800 flex-1">
                                                <div className="inline-block border-[1.5px] border-teal-500/30 bg-teal-50/10 rounded-lg py-2 px-3 text-center relative w-full group-hover:border-teal-500/60 transition-colors">
                                                    <span className="relative z-10">{team.title}</span>
                                                </div>
                                            </h3>
                                            <div className="ml-3 text-gray-400 group-hover:text-teal-500 transition-colors">
                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </div>
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                            {team.contacts.map((contact, cIdx) => (
                                                <div
                                                    key={cIdx}
                                                    className={`flex ${contact.isVertical ? 'flex-col text-center' : 'flex-row text-center'} justify-center items-center gap-2 ${team.title === '그 외 영업 지원' ? 'text-[13px]' : 'text-sm'} border-b border-dashed border-gray-300 pb-2 last:border-0 last:pb-0`}
                                                >
                                                    <span className={`${contact.roleClass || 'text-gray-600'} font-medium shrink-0 break-keep whitespace-pre-line`}>{contact.role}</span>
                                                    <span className={`${contact.nameClass || 'text-gray-900'} font-bold break-keep`}>
                                                        {contact.name} {contact.position}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Orange Contact Box */}
                        <div className="md:col-span-2 lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex flex-col">
                            <div className="bg-orange-500 rounded-lg w-full h-full flex flex-col items-center justify-center p-6 text-center shadow-inner">
                                <p className="text-white font-bold text-lg leading-relaxed">
                                    문의사항은<br />
                                    <span className="text-xl text-yellow-300">부문지원 담당자</span>에게<br />
                                    쪽지 또는 메신저로<br />
                                    연락해주세요.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 mb-[50px] text-center">
                        <p className="text-xs text-red-500 font-medium px-4">
                            ※ 담당자 사정으로 변동이 있을 수 있습니다. 담당자 부재 시에는 사내 메신저를 통해 담당자를 확인하시기 바랍니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
