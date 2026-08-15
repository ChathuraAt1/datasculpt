'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type ConsentChoice = 'pending' | 'necessary' | 'all';

type ConsentContextValue = {
  choice: ConsentChoice;
  hydrated: boolean;
  optionalAllowed: boolean;
  acceptAll: () => void;
  acceptNecessaryOnly: () => void;
  openPreferences: () => void;
  preferencesOpen: boolean;
  closePreferences: () => void;
};

const CONSENT_KEY = 'datasculpt_consent_v1';
const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoice] = useState<ConsentChoice>('pending');
  const [hydrated, setHydrated] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored === 'necessary' || stored === 'all') setChoice(stored);
    setHydrated(true);
  }, []);

  const saveChoice = useCallback((nextChoice: Exclude<ConsentChoice, 'pending'>) => {
    setChoice(nextChoice);
    setPreferencesOpen(false);
    window.localStorage.setItem(CONSENT_KEY, nextChoice);
  }, []);

  const value = useMemo(() => ({
    choice,
    hydrated,
    optionalAllowed: choice === 'all',
    acceptAll: () => saveChoice('all'),
    acceptNecessaryOnly: () => saveChoice('necessary'),
    openPreferences: () => setPreferencesOpen(true),
    preferencesOpen,
    closePreferences: () => setPreferencesOpen(false),
  }), [choice, hydrated, preferencesOpen, saveChoice]);

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const value = useContext(ConsentContext);
  if (!value) throw new Error('useConsent must be used within ConsentProvider.');
  return value;
}
