import { create } from "zustand";

type State = { province: "BC"|"AB"|"ON"; language: "en"|"fr"|"zh"|"pa"|"hi"; userId: string; setProvince: (p: State["province"]) => void; setLanguage: (l: State["language"]) => void; };
export const useAppStore = create<State>((set) => ({
  province: "BC",
  language: "en",
  userId: typeof window !== 'undefined' ? (localStorage.getItem('km_uid') || (localStorage.setItem('km_uid', crypto?.randomUUID?.() || Math.random().toString(36).slice(2)), localStorage.getItem('km_uid')))! : 'server',
  setProvince: (p) => { set({ province: p }); if (typeof window !== 'undefined') localStorage.setItem('km_province', p); },
  setLanguage: (l) => { set({ language: l }); if (typeof window !== 'undefined') localStorage.setItem('km_lang', l); }
}));
