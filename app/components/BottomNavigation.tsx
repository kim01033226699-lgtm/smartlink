'use client';

import { usePathname } from 'next/navigation';
import './BottomNavigation.css';

// 아이콘 컴포넌트 - lucide-react 스타일과 동일하게
const DollarSignIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const GraduationCapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const FileCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <path d="m9 15 2 2 4-4"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const iconMap: Record<string, React.ComponentType> = {
  '$': DollarSignIcon,
  '🎓': GraduationCapIcon,
  '📋': FileCheckIcon,
  '🏠': HomeIcon,
};

interface NavItem {
  icon: string;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: '🏠', label: '홈', path: '/' },
  { icon: '$', label: '지원금', path: '/info-GR/' },
  { icon: '🎓', label: '금융캠퍼스', path: '/info-gfe/' },
  { icon: '📋', label: '스마트위촉', path: '/info-appoint/' },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bottom-navigation visible">
      <div className="bottom-nav-wrapper">
        <div className="bottom-nav-container">
          {navItems.map((item, index) => {
            // 경로 매칭: trailing slash를 고려하여 비교
            const normalizedPathname = pathname?.replace(/\/$/, '') || '';
            const normalizedItemPath = item.path.replace(/\/$/, '');
            const isActive = normalizedPathname === normalizedItemPath ||
                            (item.path !== '/' && pathname?.startsWith(normalizedItemPath));
            const IconComponent = iconMap[item.icon];

            return (
              <a
                key={index}
                href={item.path}
                className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              >
                <div className="bottom-nav-icon">
                  {IconComponent ? <IconComponent /> : item.icon}
                </div>
                <span className="bottom-nav-label">{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
