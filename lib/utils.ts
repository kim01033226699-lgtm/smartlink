import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 환경에 따른 base path를 반환합니다.
 * 배포(GitHub Pages) 시에는 '/smartlink'가 붙고, 로컬 개발 시에는 빈 문자열이 됩니다.
 */
export const BASE_PATH = process.env.NODE_ENV === 'production' ? '/smartlink' : '';

