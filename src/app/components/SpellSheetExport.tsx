import { useRef } from 'react';
import { Download, Scroll } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { SORTS, MIRACLES, VAMPIRIQUE } from './SpellSelector';
import type { SpellSelection } from './CharacterWizard';
import { miracleLevelLabel } from '../data/gameData';

interface SpellSheetExportProps {
  selection: SpellSelection;
}

const B = '1px solid #2c2416';
const ACCENT = '#7c3aed';
const GOLD = '#b8860b';
const BLOOD = '#8b1a1a';

const LVL_MAP: Record<string, number> = {
  'Niveau 1': 1, 'Niveau 2': 2, 'Niveau 3': 3, 'Suprême': 4, 'Ultime': 5,
};

// --- Section header ---
function SectionHeader({ title, color, count }: { title: string; color: string; count: number }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      borderBottom: `2px solid ${color}`, paddingBottom: '6px', marginBottom: '14px', marginTop: '20px',
    }}>
      <div style={{ fontWeight: 900, fontSize: '16px', color, letterSpacing: '0.5px' }}>{title}</div>
      <div style={{
        fontSize: '11px', fontWeight: 700, padding: '1px 8px', borderRadius: '10px',
        background: color + '22', color, border: `1px solid ${color}`,
      }}>{count}</div>
    </div>
  );
}

// --- Level divider ---
function LevelDivider({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0 8px' }}>
      <div style={{ width: '20px', height: '1px', background: color, opacity: 0.4 }} />
      <span style={{ fontSize: '10px', fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>{label}</span>
      <div style={{ flex: 1, height: '1px', background: color, opacity: 0.2 }} />
    </div>
  );
}

// --- Individual spell card ---
function SpellCard({ name, action, neverMisses, description, cost, category, accentColor, subcategory }: {
  name: string; action?: string; neverMisses?: boolean; description: string; cost?: string;
  category?: string; accentColor: string; subcategory?: string;
}) {
  return (
    <div style={{
      border: `1px solid ${accentColor}44`, borderLeft: `3px solid ${accentColor}`,
      borderRadius: '5px', padding: '9px 12px', marginBottom: '7px',
      background: '#fff', breakInside: 'avoid',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
        <span style={{ fontWeight: 700, fontSize: '13px', color: '#1a1208' }}>{name}</span>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexShrink: 0, marginLeft: '8px' }}>
          {action && (
            <span style={{ fontSize: '9px', padding: '1px 6px', borderRadius: '8px', background: accentColor + '22', color: accentColor, fontWeight: 700, border: `1px solid ${accentColor}44` }}>
              {action}
            </span>
          )}
          {neverMisses && (
            <span style={{ fontSize: '9px', padding: '1px 6px', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', fontWeight: 700, border: '1px solid #86efac' }}>
              ✓ Ne rate jamais
            </span>
          )}
          {cost && (
            <span style={{ fontSize: '9px', padding: '1px 6px', borderRadius: '8px', background: BLOOD + '22', color: BLOOD, fontWeight: 700 }}>
              {cost}
            </span>
          )}
        </div>
      </div>
      {category && !['Sorts', 'Vampirique'].includes(category) && (
        <div style={{ fontSize: '10px', color: GOLD, fontWeight: 700, marginBottom: '3px' }}>🏛 {category}{subcategory ? ` · ${subcategory}` : ''}</div>
      )}
      <div style={{ fontSize: '12px', color: '#3a3020', lineHeight: '1.55' }}>{description}</div>
    </div>
  );
}

export function SpellSheetExport({ selection }: SpellSheetExportProps) {
  const pageRef = useRef<HTMLDivElement>(null);

  const selectedSorts = SORTS.filter(s => selection.spells.includes(s.id));
  const selectedDeityMiracles = MIRACLES.filter(m => selection.deityMiracles.includes(m.id));
  const selectedFreeMiracles = MIRACLES.filter(m => selection.freeMiracles.includes(m.id));
  const allMiracles = [...selectedDeityMiracles, ...selectedFreeMiracles].sort((a, b) => {
    const la = LVL_MAP[a.subcategory] ?? 1;
    const lb = LVL_MAP[b.subcategory] ?? 1;
    return la - lb || a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
  });
  const selectedVamp = VAMPIRIQUE.filter(v => selection.vampPowers.includes(v.id));

  const hasSorts = selectedSorts.length > 0;
  const hasMiracles = allMiracles.length > 0;
  const hasVamp = selectedVamp.length > 0;
  const isEmpty = !hasSorts && !hasMiracles && !hasVamp;

  // Group sorts by level
  const sortsByLevel = ['Niveau 1', 'Niveau 2', 'Niveau 3'].reduce((acc, lv) => {
    const s = selectedSorts.filter(x => x.subcategory === lv);
    if (s.length) acc.push({ label: lv, items: s });
    return acc;
  }, [] as { label: string; items: typeof SORTS }[]);

  // Group miracles by level then deity
  const miraclesByLevel = [1, 2, 3, 4, 5].reduce((acc, lvl) => {
    const items = allMiracles.filter(m => (LVL_MAP[m.subcategory] ?? 1) === lvl);
    if (items.length) acc.push({ label: miracleLevelLabel(lvl), items });
    return acc;
  }, [] as { label: string; items: typeof MIRACLES }[]);

  // Group vampire powers by subcategory
  const vampByCategory = selectedVamp.reduce((acc, v) => {
    const cat = v.subcategory || 'Pouvoir';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(v);
    return acc;
  }, {} as Record<string, typeof VAMPIRIQUE>);

  const exportPDF = async () => {
    if (!pageRef.current) return;
    try {
      const el = pageRef.current;
      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.top = '0';
      clone.style.left = '-9999px';
      clone.style.zIndex = '-1';
      clone.style.boxShadow = 'none';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#faf7f2',
        logging: false,
        allowTaint: true,
        imageTimeout: 0,
        width: clone.offsetWidth,
        height: clone.offsetHeight,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = canvas.width;
      const imgH = canvas.height;
      const ratio = pageW / imgW;
      const scaledH = imgH * ratio;
      let y = 0;
      while (y < scaledH) {
        if (y > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -y, pageW, scaledH);
        y += pageH;
      }
      pdf.save(`fiche-sorts-${selection.nom || 'personnage'}.pdf`);

      document.body.removeChild(clone);
    } catch (e) {
      console.error('PDF export error:', e);
      alert('Erreur lors de l\'export PDF de la fiche de sorts.');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
      {/* Controls bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scroll size={18} style={{ color: ACCENT }} />
          <span style={{ fontWeight: 700, fontSize: '15px', color: '#1a1208' }}>
            Fiche de sorts{selection.nom ? ` — ${selection.nom}` : ''}
          </span>
          {selection.classe && (
            <span style={{ fontSize: '12px', color: '#888', background: '#f5f5f0', padding: '2px 8px', borderRadius: '10px', border: '1px solid #ddd' }}>
              {selection.classe}
            </span>
          )}
        </div>
        <button
          onClick={exportPDF}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
            background: '#1a1208', color: '#fff', border: 'none', borderRadius: '6px',
            cursor: 'pointer', fontFamily: 'serif', fontSize: '13px', fontWeight: 700,
          }}
        >
          <Download size={14} /> Exporter PDF
        </button>
      </div>

      {isEmpty ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888', fontSize: '14px', background: '#faf7f2', border: B, borderRadius: '8px' }}>
          <Scroll size={32} style={{ opacity: 0.3, marginBottom: '12px', display: 'block', margin: '0 auto 12px' }} />
          Aucun sort, miracle ou pouvoir sélectionné dans le wizard.
          <div style={{ fontSize: '12px', marginTop: '6px' }}>Retournez à l'étape 7 du wizard pour choisir vos sorts et miracles.</div>
        </div>
      ) : (
        <div
          ref={pageRef}
          style={{
            background: '#faf7f2',
            padding: '28px 32px',
            border: B,
            borderRadius: '4px',
            fontFamily: 'serif',
            minHeight: '297mm',
          }}
        >
          {/* Page header */}
          <div style={{
            textAlign: 'center', marginBottom: '20px',
            borderBottom: '2px solid #2c2416', paddingBottom: '14px',
          }}>
            <div style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '1px', color: '#1a1208' }}>
              GRIMOIRE & FICHE DE SORTS
            </div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
              {selection.nom || 'Personnage'}{selection.classe ? ` · ${selection.classe}` : ''}
              {selection.deity ? ` · ${selection.deity}` : ''}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
              {hasSorts && <span style={{ fontSize: '11px', fontWeight: 700, color: ACCENT }}>✦ {selectedSorts.length} sort{selectedSorts.length > 1 ? 's' : ''}</span>}
              {hasMiracles && <span style={{ fontSize: '11px', fontWeight: 700, color: GOLD }}>✦ {allMiracles.length} miracle{allMiracles.length > 1 ? 's' : ''}</span>}
              {hasVamp && <span style={{ fontSize: '11px', fontWeight: 700, color: BLOOD }}>✦ {selectedVamp.length} pouvoir{selectedVamp.length > 1 ? 's' : ''} vampirique{selectedVamp.length > 1 ? 's' : ''}</span>}
            </div>
          </div>

          {/* ─── Sorts ─── */}
          {hasSorts && (
            <div>
              <SectionHeader title="SORTS" color={ACCENT} count={selectedSorts.length} />
              {sortsByLevel.map(({ label, items }) => (
                <div key={label}>
                  <LevelDivider label={label} color={ACCENT} />
                  {items.map(s => (
                    <SpellCard
                      key={s.id}
                      name={s.name}
                      action={s.action}
                      neverMisses={s.neverMisses}
                      description={s.description}
                      accentColor={ACCENT}
                      subcategory={s.subcategory}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* ─── Miracles ─── */}
          {hasMiracles && (
            <div>
              <SectionHeader title="MIRACLES" color={GOLD} count={allMiracles.length} />
              {selection.deity && (
                <div style={{ fontSize: '11px', color: GOLD, marginBottom: '10px', fontStyle: 'italic' }}>
                  Divinité : <strong>{selection.deity}</strong>
                  {selectedDeityMiracles.length > 0 && ` · ${selectedDeityMiracles.length} miracle${selectedDeityMiracles.length > 1 ? 's' : ''} de divinité`}
                  {selectedFreeMiracles.length > 0 && ` · ${selectedFreeMiracles.length} miracle${selectedFreeMiracles.length > 1 ? 's' : ''} libre${selectedFreeMiracles.length > 1 ? 's' : ''}`}
                </div>
              )}
              {miraclesByLevel.map(({ label, items }) => (
                <div key={label}>
                  <LevelDivider label={label} color={GOLD} />
                  {items.map(m => {
                    const isDeity = selection.deityMiracles.includes(m.id);
                    const isFree = selection.freeMiracles.includes(m.id);
                    return (
                      <SpellCard
                        key={m.id}
                        name={m.name}
                        description={m.description}
                        cost={m.cost}
                        category={m.category}
                        subcategory={isDeity ? 'Divinité' : isFree ? 'Libre' : undefined}
                        accentColor={isDeity ? GOLD : '#7c3aed'}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* ─── Pouvoirs vampiriques ─── */}
          {hasVamp && (
            <div>
              <SectionHeader title="POUVOIRS VAMPIRIQUES" color={BLOOD} count={selectedVamp.length} />
              {Object.entries(vampByCategory).map(([cat, powers]) => (
                <div key={cat}>
                  <LevelDivider label={cat} color={BLOOD} />
                  {powers.map(v => (
                    <SpellCard
                      key={v.id}
                      name={v.name}
                      description={v.description}
                      cost={v.cost}
                      accentColor={BLOOD}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={{ marginTop: '24px', paddingTop: '10px', borderTop: '1px solid #ccc', textAlign: 'center', fontSize: '10px', color: '#aaa' }}>
            Fiche générée automatiquement · D&D Fiche de personnage
          </div>
        </div>
      )}
    </div>
  );
}
