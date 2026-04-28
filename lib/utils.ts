import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getVerdictColor(verdict: string): string {
  switch (verdict) {
    case 'GOOD_DEAL':
    case 'BUY':
      return 'text-cyan-400';
    case 'FAIR':
    case 'NEGOTIATE':
      return 'text-blue-400';
    case 'OVERPRICED':
    case 'AVOID':
      return 'text-rose-400';
    default:
      return 'text-slate-400';
  }
}

export function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case 'IMMEDIATE':
    case 'URGENT':
      return 'text-rose-400';
    case 'WITHIN_6_MONTHS':
    case 'SOON':
      return 'text-blue-400';
    default:
      return 'text-slate-400';
  }
}
