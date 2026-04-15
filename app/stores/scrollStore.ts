import { create } from 'zustand';

interface ScrollStore {
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  /** While > 0, ScrollWrapper snaps camera to scroll-derived targets (no damp) — avoids a long “fly” after portal exit. */
  snapCameraToScrollFrames: number;
  requestSnapCameraToScroll: (frames?: number) => void;
}

export const useScrollStore = create<ScrollStore>((set, get) => ({
  scrollProgress: 0,
  setScrollProgress: (progress) => set(() => ({ scrollProgress: progress })),
  snapCameraToScrollFrames: 0,
  requestSnapCameraToScroll: (frames = 18) =>
    set(() => ({
      snapCameraToScrollFrames: Math.max(frames, get().snapCameraToScrollFrames),
    })),
}));