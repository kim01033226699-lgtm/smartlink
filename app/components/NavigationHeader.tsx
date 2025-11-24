'use client';

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button } from "@/app/components/ui/button";

export default function NavigationHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    { name: "위촉차수조회", path: "/info-appoint" },
    { name: "등록교육", path: "/info-appoint/education-flow" },
    { name: "협회말소", path: "/info-appoint/application-flow" },
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    // 경로 정규화 (trailing slash 제거)
    const normalizedPathname = pathname?.replace(/\/$/, '') || '';
    const normalizedPath = path.replace(/\/$/, '');
    
    if (normalizedPath === "/info-appoint") {
      // 위촉차수조회: 정확히 일치하거나 하위 경로가 없는 경우만 활성화
      return normalizedPathname === "/info-appoint" || normalizedPathname === "";
    }
    return normalizedPathname?.startsWith(normalizedPath);
  };

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 relative">
          <div className="flex flex-row items-center justify-center gap-6 md:gap-12 lg:gap-16">
            <h1
              className="text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleNavigate("/info-appoint")}
            >
              <span className="text-gray-900">Start </span>
              <span className="text-goodrich-yellow">Good</span>
              <span className="text-gray-900">, Grow </span>
              <span className="text-goodrich-yellow">Rich</span>
              <span className="text-gray-900">!</span>
            </h1>

            <nav className="hidden lg:flex gap-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  variant={isActive(item.path) ? "default" : "outline"}
                  className={`transition-all duration-150 active:scale-95 whitespace-nowrap ${
                    isActive(item.path)
                      ? "bg-goodrich-yellow hover:opacity-90 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Button>
              ))}
            </nav>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="메뉴"
          >
            <Menu className="h-6 w-6 text-gray-900" />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
            aria-label="닫기"
          >
            <X className="h-8 w-8 text-white" />
          </button>

          <nav className="flex flex-col gap-4 w-64">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                variant={isActive(item.path) ? "default" : "outline"}
                size="lg"
                className={`w-full justify-center text-lg transition-all duration-150 active:scale-95 ${
                  isActive(item.path)
                    ? "bg-goodrich-yellow-light hover:opacity-90 text-white"
                    : "bg-white hover:bg-gray-100 text-gray-900"
                }`}
              >
                {item.name}
              </Button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

