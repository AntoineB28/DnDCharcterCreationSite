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

  // Parse option with embedded description (format: "Label|Description")
  const parseOptionWithDescription = (opt: string): { label: string; description: string } => {
    if (opt.includes('|')) {
      const [label, description] = opt.split('|', 2);
      return { label: label.trim(), description: description.trim() };
    }
    return { label: opt, description: '' };
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
              // Filter out previously chosen options (extract label for cards with descriptions)
              if (previouslyChosen.size > 0) {
                availableOptions = choice.options.filter(opt => {
                  const label = choice.displayAsCards ? parseOptionWithDescription(opt).label : opt;
                  return !previouslyChosen.has(label);
                });
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
                ) : choice.displayAsCards && choice.options.length > 0 ? (
                  /* Cards display for choices with descriptions */
                  <div className="grid gap-3">
                    {availableOptions.map((option) => {
                      const parsed = parseOptionWithDescription(option);
                      const isSelected = String(currentValue) === parsed.label;
                      return (
                        <button
                          key={parsed.label}
                          onClick={() => onUpgradeChange(key, parsed.label)}
                          style={{
                            border: isSelected ? '2px solid #7c3aed' : '1px solid #e5e7eb',
                            background: isSelected ? '#f3e8ff' : '#fff',
                            borderRadius: '8px',
                            padding: '12px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          <div className="font-semibold text-sm" style={{ color: isSelected ? '#7c3aed' : '#1f2937' }}>
                            {parsed.label}
                          </div>
                          {parsed.description && (
                            <div className="text-xs text-slate-600 mt-2 leading-relaxed">
                              {parsed.description}
                            </div>
                          )}
                        </button>
                      );
                    })}
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
                          availableOptions.map((option) => {
                            const parsed = parseOptionWithDescription(option);
                            const storageValue = option.includes('|') ? parsed.label : option;
                            return (
                              <SelectItem key={option} value={storageValue}>
                                {parsed.label}
                              </SelectItem>
                            );
                          })
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
