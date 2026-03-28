import { useState, useCallback } from 'react';

export interface WizardState {
  currentStep: number;
  nom: string; exp: string; classe: string; niveau: string;
  force: number; dexterite: number; vitesse: number; constitution: number;
  resistance: number; intelligence: number; foi: number; charisme: number;
  race: string;
  arme1: string; arme2: string; armure: string;
  feats: Set<string>;
  spellSelection: { spell: string; level: number }[];
  classUpgrades: Record<string, string | boolean>;
}

export function useCharacterWizardState() {
  const [state, setState] = useState<WizardState>({
    currentStep: 0,
    nom: '',
    exp: '',
    classe: '',
    niveau: '1',
    force: 10,
    dexterite: 10,
    vitesse: 10,
    constitution: 10,
    resistance: 10,
    intelligence: 10,
    foi: 10,
    charisme: 10,
    race: '',
    arme1: '',
    arme2: '',
    armure: '',
    feats: new Set(),
    spellSelection: [],
    classUpgrades: {},
  });

  const updateState = useCallback((updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({ ...prev, currentStep: Math.max(0, prev.currentStep - 1) }));
  }, []);

  const updateStat = useCallback((stat: string, value: number) => {
    setState((prev) => ({ ...prev, [stat]: value }));
  }, []);

  const addFeat = useCallback((feat: string) => {
    setState((prev) => ({
      ...prev,
      feats: new Set([...prev.feats, feat]),
    }));
  }, []);

  const removeFeat = useCallback((feat: string) => {
    setState((prev) => {
      const newFeats = new Set(prev.feats);
      newFeats.delete(feat);
      return { ...prev, feats: newFeats };
    });
  }, []);

  const updateClassUpgrade = useCallback((key: string, value: string | boolean) => {
    setState((prev) => ({
      ...prev,
      classUpgrades: { ...prev.classUpgrades, [key]: value },
    }));
  }, []);

  return {
    state,
    updateState,
    nextStep,
    prevStep,
    updateStat,
    addFeat,
    removeFeat,
    updateClassUpgrade,
  };
}
