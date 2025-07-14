/* eslint-disable @typescript-eslint/no-explicit-any */
// store.ts
import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

// Define the type for the Audit data
interface PageSpeedResponse {
  lighthouseResult?: {
    categories?: {
      performance?: { score: number };
      accessibility?: { score: number };
      "best-practices"?: { score: number };
      seo?: { score: number };
    };
    audits?: Record<string, any>;
  };
  loadingExperience?: {
    metrics?: Record<string, any>;
  };
  error?: {
    message: string;
  };
}

// Store Type
interface Store {
  mobileData: PageSpeedResponse | null;
  desktopData: PageSpeedResponse | null;
  loading: boolean;
  error: string | null;
  setMobileData: (data: PageSpeedResponse | null) => void;
  setDesktopData: (data: PageSpeedResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
}

// Create the store using Zustand with persistence
const auditStore = createStore<Store>()(
  persist(
    (set) => ({
      mobileData: null,
      desktopData: null,
      loading: false,
      error: null,
      setMobileData: (data: PageSpeedResponse | null) =>
        set({ mobileData: data }),
      setDesktopData: (data: PageSpeedResponse | null) =>
        set({ desktopData: data }),
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      clearData: () =>
        set({ mobileData: null, desktopData: null, error: null }),
    }),
    {
      name: "audit-data-storage", // Persist to localStorage with the name `audit-data-storage`
    }
  )
);

export default auditStore;
