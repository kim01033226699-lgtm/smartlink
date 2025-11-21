'use client';

import { useRouter } from 'next/navigation';
import { DollarSign, GraduationCap, FileCheck } from 'lucide-react';
import { SupportCard } from './components/SupportCard';
import BottomNavigation from './components/BottomNavigation';
import './page.css';

export default function HomePage() {
  const router = useRouter();

  const links = [
    {
      title: '지원금',
      description: '정착교육비, 활동수수료 등 안내',
      url: '/info-GR/',
      icon: DollarSign,
      color: 'light'
    },
    {
      title: '금융캠퍼스',
      description: '무경력 신입 지원 프로그램',
      url: '/info-gfe/',
      icon: GraduationCap,
      color: 'medium'
    },
    {
      title: '스마트위촉',
      description: '원스톱위촉안내',
      url: '/info-appoint/',
      icon: FileCheck,
      color: 'dark'
    }
  ];

  return (
    <>
      <div className="smart-link-page">
        <div className="smart-link-container">
          <header className="smart-link-header">
            <h1 className="smart-link-title">Smart Link</h1>
            <p className="smart-link-subtitle">
              Start <span style={{ color: '#ff9c00' }}>Good</span>, Grow <span style={{ color: '#ff9c00' }}>Rich</span>!
            </p>
          </header>

          <div className="link-cards">
            {links.map((link, index) => (
              <SupportCard
                key={index}
                title={link.title}
                description={link.description}
                icon={link.icon}
                onClick={() => router.push(link.url)}
              />
            ))}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </>
  );
}
