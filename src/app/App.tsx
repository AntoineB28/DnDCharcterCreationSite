import { useState } from 'react';
import { CharacterSheet } from './components/CharacterSheet';
import { FeatSelector } from './components/FeatSelector';
import { SpellSelector } from './components/SpellSelector';
import { SpellSheetExport } from './components/SpellSheetExport';
import { FeatSheetExport } from './components/FeatSheetExport';
import { CharacterWizard, type CharacterData, type VisibleSections, type SpellSelection } from './components/CharacterWizard';

type Page = 'wizard' | 'sheet' | 'feats' | 'spells' | 'spellsheet' | 'featsheet';

const TABS: { id: Page; label: string }[] = [
  { id: 'wizard',     label: '🧙 Créer un personnage' },
  { id: 'sheet',      label: '⚔️ Fiche de personnage' },
  { id: 'spellsheet', label: '📖 Fiche de sorts' },
  { id: 'featsheet',  label: '📋 Fiche de Feats' },
  { id: 'feats',      label: '✨ Feats' },
  { id: 'spells',     label: '🔮 Sorts & Miracles' },
];

export default function App() {
  const [page, setPage] = useState<Page>('wizard');
  const [sheetData, setSheetData] = useState<CharacterData | undefined>(undefined);
  const [sheetVis, setSheetVis] = useState<VisibleSections | undefined>(undefined);
  const [spellSelection, setSpellSelection] = useState<SpellSelection | undefined>(undefined);
  const [wizardDone, setWizardDone] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);

  const handleWizardComplete = (data: CharacterData, vis: VisibleSections, spells: SpellSelection) => {
    setSheetData(data);
    setSheetVis(vis);
    setSpellSelection(spells);
    setWizardDone(true);
    setSheetKey(k => k + 1);
    setPage('sheet');
  };

  return (
    <div style={{ fontFamily: 'serif' }}>
      {/* Navigation */}
      <div style={{
        display: 'flex', background: '#1a1208',
        justifyContent: 'center', position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap',
      }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setPage(tab.id)}
            style={{
              padding: '10px 20px', border: 'none', cursor: 'pointer', fontSize: '13px',
              fontFamily: 'serif', fontWeight: page === tab.id ? 700 : 400,
              background: page === tab.id ? '#c0392b' : 'transparent',
              color: page === tab.id ? '#fff' : '#c9b89a',
              borderBottom: page === tab.id ? '3px solid #e74c3c' : '3px solid transparent',
              transition: 'all 0.15s',
              position: 'relative',
            }}>
            {tab.label}
            {(tab.id === 'sheet' || tab.id === 'spellsheet' || tab.id === 'featsheet') && wizardDone && (
              <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%' }} />
            )}
          </button>
        ))}
      </div>

      {page === 'wizard' && <CharacterWizard onComplete={handleWizardComplete} />}
      {page === 'sheet' && <CharacterSheet key={sheetKey} initialData={sheetData} initialVis={sheetVis} />}
      {page === 'spellsheet' && (
        <SpellSheetExport
          selection={spellSelection ?? { spells: [], deityMiracles: [], freeMiracles: [], vampPowers: [], deity: '', classe: '', nom: '' }}
        />
      )}
      {page === 'featsheet' && (
        <FeatSheetExport
          selection={{
            nom: sheetData?.nom,
            classe: sheetData?.classe,
            selectedFeats: sheetData?.selectedFeats ?? []
          }}
        />
      )}
      {page === 'feats' && <FeatSelector />}
      {page === 'spells' && <SpellSelector />}
    </div>
  );
}
