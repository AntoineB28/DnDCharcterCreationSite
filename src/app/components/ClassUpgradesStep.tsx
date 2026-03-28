import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import type { ClassData } from '../data/gameData';

interface ClassUpgradesStepProps {
  classe: ClassData | null;
  niveau: number;
  classUpgrades: Record<string, string | boolean>;
  onUpgradeChange: (key: string, value: string | boolean) => void;
}

/**
 * Generic component that renders class-specific upgrades based on levelSpecificChoices.
 * Dynamically creates UI for different choice types without hardcoding per-class logic.
 */
export function ClassUpgradesStep({
  classe,
  niveau,
  classUpgrades,
  onUpgradeChange,
}: ClassUpgradesStepProps) {
  if (!classe?.levelSpecificChoices || classe.levelSpecificChoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Améliorations de classe</CardTitle>
          <CardDescription>Aucune amélioration disponible pour cette classe.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Filter choices available at this level
  const availableChoices = classe.levelSpecificChoices.filter((choice) => choice.level <= niveau);

  if (availableChoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Améliorations de classe</CardTitle>
          <CardDescription>Aucune amélioration n'est disponible à votre niveau actuel.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Generate unique key for storing choice state
  const getChoiceKey = (level: number, choiceName: string): string => {
    return `${classe.id}_lvl${level}_${choiceName.toLowerCase().replace(/\s+/g, '_')}`;
  };

  // Determine if this is a toggle/confirmation choice
  const isToggleChoice = (options: string[]): boolean => {
    return options.length === 1 && options[0].toLowerCase().includes('débloquer');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Améliorations de classe</CardTitle>
          <CardDescription>
            Sélectionnez les améliorations de classe disponibles pour {classe.name}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {availableChoices.map((choice) => {
            const key = getChoiceKey(choice.level, choice.name);
            const currentValue = classUpgrades[key];
            const isToggle = isToggleChoice(choice.options);

            // For duplicate choice types (same options, different levels), filter out already chosen values
            let availableOptions = choice.options;
            if (choice.options.length > 0) {
              // Find other choices with the same options (different level, same option list)
              const sameOptionChoices = availableChoices.filter(c => 
                c.level < choice.level && 
                JSON.stringify(c.options) === JSON.stringify(choice.options)
              );
              // Collect all previously chosen values at lower levels
              const previouslyChosen = new Set<string>();
              for (const prevChoice of sameOptionChoices) {
                const prevKey = getChoiceKey(prevChoice.level, prevChoice.name);
                const prevValue = classUpgrades[prevKey];
                if (prevValue && typeof prevValue === 'string') {
                  previouslyChosen.add(prevValue);
                }
              }
              // Filter out previously chosen options
              if (previouslyChosen.size > 0) {
                availableOptions = choice.options.filter(opt => !previouslyChosen.has(opt));
              }
            }

            return (
              <div
                key={key}
                className="border rounded-lg p-4 space-y-3 bg-slate-50 dark:bg-slate-900/50"
              >
                {/* Title and description */}
                <div>
                  <h3 className="font-semibold text-base">
                    Niveau {choice.level}: {choice.name}
                  </h3>
                  {choice.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {choice.description}
                    </p>
                  )}
                </div>

                {/* Toggle/confirmation choice */}
                {isToggle ? (
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={key}
                      checked={Boolean(currentValue)}
                      onCheckedChange={(checked) => onUpgradeChange(key, Boolean(checked))}
                    />
                    <Label htmlFor={key} className="cursor-pointer text-sm font-medium">
                      {currentValue ? '✓ Débloqué' : 'Cliquez pour débloquer'}
                    </Label>
                  </div>
                ) : choice.options.length === 0 ? (
                  /* Free text input choice */
                  <div className="space-y-2">
                    <Label htmlFor={key} className="text-sm font-medium">
                      Entrez votre choix :
                    </Label>
                    <Input
                      id={key}
                      type="text"
                      placeholder="Écrivez votre réponse ici..."
                      value={String(currentValue || '')}
                      onChange={(e) => onUpgradeChange(key, e.target.value)}
                      className="w-full"
                    />
                  </div>
                ) : (
                  /* Select/dropdown choice */
                  <div className="space-y-2">
                    <Label htmlFor={key} className="text-sm font-medium">
                      Choisir une option :
                    </Label>
                    <Select value={String(currentValue || '')} onValueChange={(val) => onUpgradeChange(key, val)}>
                      <SelectTrigger id={key}>
                        <SelectValue placeholder="Sélectionner une option..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableOptions.length > 0 ? (
                          availableOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="text-sm text-slate-500 p-2">Aucune option disponible</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Confirmation display */}
                {currentValue && !isToggle && (
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-sm text-green-800 dark:text-green-300">
                    ✓ Sélectionné: <span className="font-semibold">{currentValue}</span>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
