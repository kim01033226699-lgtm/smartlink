import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일 경로를 명시적으로 처리
  // /info-GR/, /info-gfe/, /info-appoint/로 시작하는 경로 중
  // 실제 정적 파일이 존재하는 경우 정적 파일로 서빙
  if (
    pathname.startsWith('/info-GR/') ||
    pathname.startsWith('/info-gfe/') ||
    pathname.startsWith('/info-appoint/')
  ) {
    // 정적 파일 요청인 경우 (확장자가 있는 경우)
    if (pathname.match(/\.(html|js|css|json|svg|png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot)$/)) {
      // 정적 파일은 그대로 통과시킴
      return NextResponse.next();
    }
    
    // index.html 요청인 경우
    if (pathname.endsWith('/') || pathname.endsWith('/index.html')) {
      // 정적 파일로 서빙되도록 통과
      return NextResponse.next();
    }
    
    // 하위 경로가 있는 경우 (예: /info-GR/some/path)
    // 정적 파일로 서빙되도록 통과
    if (pathname.split('/').length > 2) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/info-GR/:path*',
    '/info-gfe/:path*',
    '/info-appoint/:path*',
  ],
};

