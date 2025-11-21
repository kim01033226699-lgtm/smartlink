'use client';
import { useRouter } from 'next/navigation';
import { Calendar, Construction } from 'lucide-react';
import BottomNavigation from '@/app/components/BottomNavigation';

export default function InfoAppointPage() {
  const router = useRouter();

  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '80px' }}>
        <header style={{
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)',
          color: 'white',
          padding: '3rem 0',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div className="container">
            <Calendar size={60} style={{ margin: '0 auto 1rem', display: 'block' }} />
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>스마트위촉</h1>
            <p style={{ fontSize: '1.25rem', opacity: 0.95 }}>신규 위촉자 일정 조회 시스템</p>
          </div>
        </header>

        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '600px',
            background: 'white',
            padding: '3rem 2rem',
            borderRadius: '1.5rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}>
            <Construction size={80} style={{ color: 'var(--primary-color)', marginBottom: '2rem' }} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem', color: '#333' }}>
              페이지 준비 중입니다
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#6b7280', lineHeight: 1.6 }}>
              스마트위촉 일정 조회 기능은 현재 개발 중입니다.<br />
              빠른 시일 내에 제공하도록 하겠습니다.
            </p>
          </div>
        </main>

        <footer style={{
          background: 'var(--bg-light)',
          padding: '2rem 0',
          textAlign: 'center'
        }}>
          <div className="container"></div>
        </footer>
      </div>

      <BottomNavigation />
    </>
  );
}
