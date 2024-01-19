import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const addComma = (num: number) => {
  const regexp = /\B(?=(\d{3})+(?!\d))/g;
  return num.toFixed(2).toString().replace(regexp, ',');
};

export const formatDays = (day: number) => {
  if (day === 365) {
    return '1년';
  }
  if (day === 1825) {
    return '5년';
  }
  return day;
};

export function incrementLastNumber(str = '') {
  // 숫자 부분을 찾기 위한 정규 표현식
  const regex = /(\d+)(?!.*\d)/;

  // 문자열에서 마지막 숫자 부분을 찾습니다.
  const match = str.match(regex);
  if (match) {
    // 숫자를 추출하고 1을 증가시킵니다.
    const number = parseInt(match[0], 10) + 1;
    // 원래 문자열에서 숫자 부분을 증가된 숫자로 대체합니다.
    return str.replace(regex, (substring) => String(number));
  }
  // 숫자가 없는 경우, 기본적으로 '-1'을 추가합니다.
  return `${str}-1`;
}
