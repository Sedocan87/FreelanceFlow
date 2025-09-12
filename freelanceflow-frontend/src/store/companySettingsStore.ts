import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CompanySettings {
  name: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  taxNumber?: string;
  bankAccount?: string;
  invoiceNotes?: string;
  primaryColor?: string;
}

interface CompanySettingsState {
  settings: CompanySettings;
  updateSettings: (settings: Partial<CompanySettings>) => void;
  setLogo: (logoUrl: string) => void;
}

export const useCompanySettingsStore = create<CompanySettingsState>()(
  persist(
    (set) => ({
      settings: {
        name: 'My Company',
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      setLogo: (logoUrl) =>
        set((state) => ({
          settings: { ...state.settings, logo: logoUrl },
        })),
    }),
    {
      name: 'company-settings',
    }
  )
);
