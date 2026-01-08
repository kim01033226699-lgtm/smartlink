'use client';

import { X, Search, ChevronDown, ChevronUp, Eye, EyeOff, Phone, ExternalLink } from 'lucide-react';
import React, { useState, useMemo, useRef, useEffect } from 'react';

interface Contact {
    role: string;
    name: string;
    position?: string;
    phone?: string;
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
        title: '부문 영업지원',
        contacts: [
            { role: '중부', name: '윤정희', position: '차장', phone: '02-6288-5418' },
            { role: '동부', name: '김소은', position: '과장', phone: '02-6410-7398' },
            { role: '서부', name: '공기택', position: '대리', phone: '02-6410-7437' },
            { role: 'RP총괄직할, 사업부', name: '안다솜', position: '과장', phone: '02-6410-7821' },
            { role: '영업마케팅', name: '김예지', position: '대리' },
            { role: 'RM-HY', name: '임진우', position: '팀장', roleClass: 'text-blue-600', nameClass: 'text-blue-600' },
            { role: '총괄', name: '백승호', position: '대리' },
        ]
    },
    {
        title: '위촉지원실',
        contacts: [
            { role: '위촉심사', name: '김지열', position: '과장', phone: '02-6410-7817' },
            { role: '시험응시', name: '방수현', position: '대리', phone: '02-6410-7411' },
            { role: '손보협회등록', name: '곽민서', position: '사원', phone: '02-6410-7188' },
            { role: '생보협회등록', name: '김보미', position: '사원', phone: '02-6410-7233' },
            { role: '협회소속이동', name: '윤서하', position: '사원', phone: '02-6410-7417' },
            { role: '당사해촉담당', name: '이성연', position: '사원', phone: '02-6410-7410' },
            { role: '협회지점관리, 자격전환', name: '허지원', position: '사원', phone: '02-6410-7404' },
        ]
    },
    {
        title: '채권실',
        contacts: [
            { role: '보증보험', name: '이인교', position: '과장', phone: '02-6288-5000(7943)' },
            { role: '기타담보', name: '김나현', position: '과장', phone: '02-6288-5000(7145)' },
        ]
    },
    {
        title: '영업지원금관리팀',
        contacts: [
            { role: '정착지원금', name: '박세현', position: '차장', phone: '02-6288-5000(7028)' },
            { role: 'M-P, 활동수수료', name: '성현', position: '대리', phone: '02-6288-5000(7107)' },
            { role: '금융캠퍼스', name: '이천영', position: '팀장', phone: '02-6288-5000(7264)', roleClass: 'text-blue-600', nameClass: 'text-blue-600' },
        ]
    },
    {
        title: '채널교육팀',
        contacts: [
            { role: '금융캠퍼스', name: '정진래', position: '차장', phone: '02-6288-5000(7440)' },
            { role: 'BASIC과정', name: '신지수', position: '과장', phone: '02-6288-5000(7064)' },
            { role: '법인교육', name: '최인석', position: '과장', phone: '02-6288-5000(7427)' },
            { role: '테마교육', name: '김현정', position: '과장', phone: '02-6288-5000(7313)' },
            { role: '입문과정', name: '김석현', position: '대리', phone: '02-6288-5000(7429)' },
            { role: '기타', name: '이철', position: '팀장', phone: '02-6288-5000(7421)', roleClass: 'text-blue-600', nameClass: 'text-blue-600' },
        ]
    },
    {
        title: '금융캠퍼스',
        contacts: [
            { role: '금융캠퍼스 교육 문의', name: '정진래', position: '차장', phone: '02-6288-5000(7440)' },
            { role: '베이직과정 교육 문의', name: '최인석', position: '과장', phone: '02-6288-5000(7427)' },
            { role: '지원금 지급 및 평가', name: '이천영', position: '팀장', phone: '02-6288-5000(7264)', roleClass: 'text-blue-600', nameClass: 'text-blue-600' },
            { role: '지원안 제출', name: '박세현', position: '차장', phone: '02-6288-5000(7028)' },
            { role: 'DB배정', name: '제영록', position: '과장', phone: '02-6410-7431' },
            { role: '규정 문의, DB평가', name: '고현진', position: '과장', phone: '02-6410-7380' },
        ]
    },
    {
        title: 'DB사업팀',
        contacts: [
            { role: '미과금 DB', name: '제영록', position: '과장', phone: '02-6410-7431' },
            { role: '퍼미션, 인포DB', name: '고은서', position: '과장', phone: '02-6410-7431' },
            { role: '기계약DB', name: '안다솜', position: '과장', phone: '02-6410-7821' },
            { role: '기타', name: '이지연', position: '팀장', phone: '02-6288-5000(7186)', roleClass: 'text-blue-600', nameClass: 'text-blue-600' },
        ]
    },
    {
        title: '수수료',
        contacts: [
            { role: '중부, RP총괄직할', name: '한나라', position: '과장', phone: '02-6410-7317' },
            { role: '동부, 총괄', name: '박소희', position: '대리', phone: '02-6288-5000(7265)' },
            { role: '서부,영업마케팅,RMHY', name: '김진경', position: '과장', phone: '02-6288-5000(7110)' },
            { role: '사업부(RC)', name: '김현정', position: '과장', phone: '02-6288-5000(7046)' },
            { role: '기타', name: '고나연', position: '팀장', phone: '02-6288-5000(7496)', roleClass: 'text-blue-600', nameClass: 'text-blue-600' },
        ]
    },
    {
        title: '시책 및 운영비',
        contacts: [
            { role: '생보시책', name: '홍희지', position: '대리', phone: '02-6288-5000(7293)' },
            { role: '손보시책', name: '방훈', position: '사원', phone: '02-6288-5000(7199)' },
            { role: '운영비', name: '김정우', position: '대리', phone: '02-6288-5000(7267)' },
            { role: '규정 및 기타', name: '장흥석', position: '팀장', phone: '02-6288-5315', roleClass: 'text-blue-600', nameClass: 'text-blue-600' },
        ]
    },
    {
        title: '그 외 영업지원',
        contacts: [
            { role: '마케팅임원, 프로모션 평가', name: '조준승', position: '차장', phone: '02-6288-5000(7258)' },
            { role: '주임단 지원', name: '이서영', position: '차장', phone: '02-6410-7244' },
            { role: '금융캠퍼스(규정, 평가)', name: '고현진', position: '과장', phone: '02-6410-7380' },
            { role: '임차 및 인프라 지원', name: '김현철', position: '과장', phone: '02-6410-7245' },
            { role: '자격유지평가,Rich315,MDRT 등', name: '서미해', position: '대리', phone: '02-6288-5000(7439)', isVertical: true },
            { role: '기타', name: '김남헌', position: '팀장', phone: '02-6288-5000(7385)', roleClass: 'text-blue-600', nameClass: 'text-blue-600' },
        ]
    },
];

export default function ManagerInfoModal({ isOpen, onClose }: ManagerInfoModalProps) {
    const [expandedTeams, setExpandedTeams] = useState<Set<number>>(new Set());
    const [activePopup, setActivePopup] = useState<{ teamIdx: number; contactIdx: number; rect: DOMRect } | null>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    const toggleTeam = (idx: number) => {
        const next = new Set(expandedTeams);
        if (next.has(idx)) {
            next.delete(idx);
        } else {
            next.add(idx);
        }
        setExpandedTeams(next);
    };

    const handleContactClick = (e: React.MouseEvent, teamIdx: number, contactIdx: number, hasPhone: boolean) => {
        if (!hasPhone) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setActivePopup({ teamIdx, contactIdx, rect });
    };

    const expandAll = () => {
        setExpandedTeams(new Set(managerData.map((_, i) => i)));
    };

    const collapseAll = () => {
        setExpandedTeams(new Set());
        setActivePopup(null);
    };

    const isAllExpanded = useMemo(() => expandedTeams.size === managerData.length, [expandedTeams.size]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setActivePopup(null);
            }
        };
        if (activePopup) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activePopup]);

    if (!isOpen) return null;

    const formatPhoneForTel = (phone: string) => {
        const clean = phone.replace(/[()]/g, ',');
        return clean.replace(/[^0-9,]/g, '');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 relative">
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
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 relative">
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
                                        <div className="flex items-center justify-between px-2">
                                            <h3 className="text-lg font-bold text-gray-900 flex-1 text-center">
                                                {team.title}
                                            </h3>
                                            <div className="text-gray-400 group-hover:text-teal-500 transition-colors">
                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </div>
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200 border-t border-gray-50 pt-3">
                                            {team.contacts.map((contact, cIdx) => (
                                                <div
                                                    key={cIdx}
                                                    className="border-b border-dashed border-gray-300 pb-2 last:border-0 last:pb-0"
                                                >
                                                    <div
                                                        onClick={(e) => handleContactClick(e, idx, cIdx, !!contact.phone)}
                                                        className={`flex ${contact.isVertical ? 'flex-col text-center' : 'flex-row text-center'} justify-center items-center gap-2 ${team.title === '그 외 영업지원' ? 'text-[13px]' : 'text-sm'} ${contact.phone ? 'cursor-pointer hover:bg-gray-50 hover:text-teal-600' : ''} rounded-lg transition-colors py-1.5 group/item`}
                                                    >
                                                        <span className={`${contact.roleClass || 'text-gray-600'} font-medium shrink-0 break-keep whitespace-pre-line group-hover/item:text-teal-700`}>{contact.role}</span>
                                                        <span className={`${contact.nameClass || 'text-gray-900'} font-bold break-keep`}>
                                                            {contact.name} {contact.position}
                                                        </span>
                                                        {contact.phone && (
                                                            <div className="text-teal-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                                <ExternalLink size={14} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Orange Contact Box */}
                        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex flex-col">
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

                {/* Contact Popup Overlay */}
                {activePopup && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
                        <div
                            ref={popupRef}
                            className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-[280px] pointer-events-auto animate-in zoom-in-95 duration-200 flex flex-col items-center text-center gap-4"
                        >
                            <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
                                <Phone size={24} className="text-teal-600" fill="currentColor" />
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs text-gray-500 font-medium">
                                    {managerData[activePopup.teamIdx].title}
                                </p>
                                <p className="text-base font-bold text-gray-900">
                                    {managerData[activePopup.teamIdx].contacts[activePopup.contactIdx].role}
                                </p>
                                <p className="text-lg font-extrabold text-teal-700">
                                    {managerData[activePopup.teamIdx].contacts[activePopup.contactIdx].name} {managerData[activePopup.teamIdx].contacts[activePopup.contactIdx].position}
                                </p>
                                <p className="text-xl font-black text-gray-800 tracking-tight pt-1">
                                    {managerData[activePopup.teamIdx].contacts[activePopup.contactIdx].phone}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 w-full pt-1">
                                <button
                                    onClick={() => setActivePopup(null)}
                                    className="px-4 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
                                >
                                    닫기
                                </button>
                                <a
                                    href={`tel:${formatPhoneForTel(managerData[activePopup.teamIdx].contacts[activePopup.contactIdx].phone || '')}`}
                                    className="px-4 py-3 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20"
                                >
                                    <Phone size={16} fill="currentColor" />
                                    전화 연결
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
