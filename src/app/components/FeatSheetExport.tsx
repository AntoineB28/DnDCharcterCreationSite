import { useRef } from 'react';
import { Download, Scroll } from 'lucide-react';
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
const GOLD = '#b8860b';

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

// --- Feat card ---
function FeatCard({ name, description, accentColor }: {
  name: string; description?: string; accentColor: string;
}) {
  return (
    <div style={{
      border: `1px solid ${accentColor}44`, borderLeft: `3px solid ${accentColor}`,
      borderRadius: '5px', padding: '9px 12px', marginBottom: '7px',
      background: '#fff', breakInside: 'avoid',
    }}>
      <div style={{ fontWeight: 700, fontSize: '13px', color: '#1a1208', marginBottom: '4px' }}>
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
  const pageRef = useRef<HTMLDivElement>(null);

  const selectedFeats = FEATS.filter(f => selection.selectedFeats.includes(f.id));
  const hasFeats = selectedFeats.length > 0;

  const groupedByCategory: Record<string, typeof selectedFeats> = {};
  for (const f of selectedFeats) {
    if (!groupedByCategory[f.category]) groupedByCategory[f.category] = [];
    groupedByCategory[f.category].push(f);
  }
  const categories = Object.keys(groupedByCategory).sort();

  const exportToPDF = async () => {
    if (!pageRef.current) return;
    const canvas = await html2canvas(pageRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#faf7f2',
      logging: false,
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
    pdf.save(`fiche-feats-${selection.nom || 'personnage'}.pdf`);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
      {/* Controls bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scroll size={18} style={{ color: ACCENT }} />
          <span style={{ fontWeight: 700, fontSize: '15px', color: '#1a1208' }}>
            Fiche de Feats{selection.nom ? ` — ${selection.nom}` : ''}
          </span>
          {selection.classe && (
            <span style={{ fontSize: '12px', color: '#888', background: '#f5f5f0', padding: '2px 8px', borderRadius: '10px', border: '1px solid #ddd' }}>
              {selection.classe}
            </span>
          )}
        </div>
        <button
          onClick={exportToPDF}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
            background: '#1a1208', color: '#fff', border: 'none', borderRadius: '6px',
            cursor: 'pointer', fontFamily: 'serif', fontSize: '13px', fontWeight: 700,
          }}
        >
          <Download size={14} /> Exporter PDF
        </button>
      </div>

      {!hasFeats ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888', fontSize: '14px', background: '#faf7f2', border: B, borderRadius: '8px' }}>
          <Scroll size={32} style={{ opacity: 0.3, marginBottom: '12px', display: 'block', margin: '0 auto 12px' }} />
          Aucun feat sélectionné dans le wizard.
          <div style={{ fontSize: '12px', marginTop: '6px' }}>Retournez à l'étape 6 du wizard pour choisir vos feats.</div>
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
              FICHE DE FEATS
            </div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
              {selection.nom || 'Personnage'}{selection.classe ? ` · ${selection.classe}` : ''}
            </div>
            <div style={{ marginTop: '10px', fontSize: '11px', fontWeight: 700, color: ACCENT }}>
              ✦ {selectedFeats.length} feat{selectedFeats.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Feats by category */}
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

          {/* Footer */}
          <div style={{
            marginTop: '30px', paddingTop: '14px', borderTop: B, fontSize: '10px',
            textAlign: 'center', color: '#888',
          }}>
            Fiche générée automatiquement · D&D Fiche de Feats
          </div>
        </div>
      )}
    </div>
  );
}
