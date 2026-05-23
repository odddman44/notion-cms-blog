"use client"

import { useMediaQuery } from "usehooks-ts"

export function useIsMobile() {
  return useMediaQuery("(max-width: 768px)", { initializeWithValue: false })
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 769px) and (max-width: 1024px)", { initializeWithValue: false })
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1025px)", { initializeWithValue: false })
}
