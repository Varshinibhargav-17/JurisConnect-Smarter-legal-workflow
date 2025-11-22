import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define ClassValue if it's not globally available.
// This type is typically from 'clsx' or 'tailwind-merge'
type ClassValue = string | number | ClassDictionary | ClassArray | null | undefined | boolean;
type ClassDictionary = { [key: string]: any };
interface ClassArray extends Array<ClassValue> {}
