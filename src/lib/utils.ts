import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const addComma = (num: number) => {
  const regexp = /\B(?=(\d{3})+(?!\d))/g;
  return num.toFixed(2).toString().replace(regexp, ",");
};

export const formatDays = (day: number) => {
  if (day === 365) {
    return "1년";
  }
  if (day === 1825) {
    return "5년";
  }
  return day;
};
