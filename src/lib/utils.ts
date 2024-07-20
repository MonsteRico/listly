import { env } from "@/env"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { TMDB } from "tmdb-ts"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

