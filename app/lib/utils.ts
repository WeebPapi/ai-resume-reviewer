import type { ClassValue } from "clsx"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(1)} MB`
  const gb = mb / 1024
  return `${gb.toFixed(1)} GB`
}
export function generateUUID() {
  return crypto.randomUUID()
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
