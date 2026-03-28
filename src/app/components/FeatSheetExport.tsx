import { useRef } from 'react';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FEATS } from './FeatSelector';

interface FeatSheetExportProps {
  selection: {
    nom?: string;
    classe?: string;
    selectedFeats: string[];
  };
}

const B = '1px solid #2c2416';
const ACCENT = '#7c3aed';

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

// --- Feat card ---
function FeatCard({ name, description, accentColor }: {
  name: string; description?: string; accentColor: string;
}) {
  return (
    <div style={{
      border: `1px solid ${accentColor}22`, borderLeft: `3px solid ${accentColor}`, borderRadius: '4px',
      padding: '10px 12px', marginBottom: '10px', background: '#f9f6f0',
    }}>
      <div style={{ fontWeight: 700, fontSize: '12px', color: '#1a1a1a', marginBottom: '4px' }}>
        {name}
      </div>
      {description && (
        <div style={{
          fontSize: '11px', color: '#444', lineHeight: '1.5', whiteSpace: 'pre-wrap', wordWrap: 'break-word',
        }}>
          {description}
        </div>
      )}
    </div>
  );
}

export function FeatSheetExport({ selection }: FeatSheetExportProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  const selectedFeats = FEATS.filter(f => selection.selectedFeats.includes(f.id));
  const hasFeats = selectedFeats.length > 0;

  const groupedByCategory: Record<string, typeof selectedFeats> = {};
  for (const f of selectedFeats) {
    if (!groupedByCategory[f.category]) groupedByCategory[f.category] = [];
    groupedByCategory[f.category].push(f);
  }
  const categories = Object.keys(groupedByCategory).sort();

  const exportToPDF = async () => {
    if (!sheetRef.current) return;
    const root = document.documentElement;
    const saved: Record<string, string> = {};
    const overrides: Record<string, string> = {
      '--foreground': '#111', '--background': '#fff', '--card': '#f9f6f0',
    };
    for (const p of Object.keys(overrides)) saved[p] = root.style.getPropertyValue(p);
    for (const [p, v] of Object.entries(overrides)) root.style.setProperty(p, v);

    const prevScroll = { x: window.scrollX, y: window.scrollY };
    window.scrollTo(0, 0);

    const el = sheetRef.current;
    const canvas = await html2canvas(el, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, w, h);
    pdf.save(`${selection.nom || 'personnage'}-feats.pdf`);

    window.scrollTo(prevScroll.x, prevScroll.y);
    for (const [p, v] of Object.entries(saved)) root.style.setProperty(p, v);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Fiche de Feats</h2>
        <button
          onClick={exportToPDF}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#2c2416', color: '#f5e6c0', border: 'none', borderRadius: '4px',
            padding: '8px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'serif',
          }}
        >
          <Download size={16} />
          Exporter PDF
        </button>
      </div>

      <div ref={sheetRef} style={{
        background: '#fff', color: '#1a1208', padding: '30px', border: B, fontFamily: 'serif',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center', marginBottom: '20px',
          borderBottom: '2px solid #2c2416', paddingBottom: '14px',
        }}>
          <div style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '1px', color: '#1a1208' }}>
            FICHE DE FEATS
          </div>
          <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
            {selection.nom || 'Personnage'}{selection.classe ? ` · ${selection.classe}` : ''}
          </div>
          {hasFeats && (
            <div style={{ marginTop: '10px', fontSize: '11px', fontWeight: 700, color: ACCENT }}>
              ✦ {selectedFeats.length} feat{selectedFeats.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* No feats */}
        {!hasFeats && (
          <div style={{ textAlign: 'center', color: '#888', fontSize: '13px', padding: '20px' }}>
            Aucun feat sélectionné
          </div>
        )}

        {/* Feats by category */}
        {hasFeats && (
          <div>
            {categories.map(category => (
              <div key={category}>
                <SectionHeader title={category.toUpperCase()} color={ACCENT} count={groupedByCategory[category].length} />
                {groupedByCategory[category].map(feat => (
                  <FeatCard
                    key={feat.id}
                    name={feat.name}
                    description={feat.effects.join('\n')}
                    accentColor={ACCENT}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: '30px', paddingTop: '14px', borderTop: B, fontSize: '10px',
          textAlign: 'center', color: '#888',
        }}>
          Fiche générée automatiquement · D&D Fiche de Feats
        </div>
      </div>
    </div>
  );
}
