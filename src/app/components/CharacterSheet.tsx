import { useState, useRef } from 'react';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// --- SVG icons as base64 data URLs pour compatibilité html2canvas ---
const _shieldSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="42" viewBox="0 0 60 68"><path d="M30 4 L54 16 L54 36 Q54 56 30 64 Q6 56 6 36 L6 16 Z" fill="none" stroke="#000" stroke-width="2"/><path d="M30 14 L46 22 L46 36 Q46 50 30 56 Q14 50 14 36 L14 22 Z" fill="none" stroke="#000" stroke-width="1.5"/></svg>`;
const SHIELD_URL = `data:image/svg+xml;base64,${btoa(_shieldSvg)}`;

const _heartSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="28" viewBox="0 0 50 46"><path d="M25 42 C10 30 2 20 2 13 Q2 4 12 4 Q18 4 25 12 Q32 4 38 4 Q48 4 48 13 C48 20 40 30 25 42Z" fill="none" stroke="#000" stroke-width="2"/></svg>`;
const HEART_URL = `data:image/svg+xml;base64,${btoa(_heartSvg)}`;

interface CharacterData {
  nom: string; exp: string; pv: string; classe: string; niveau: string; or: string;
  inventaire: string; armorClass: string; maxPV: string;
  force: string; dexterite: string; vitesse: string; constitution: string;
  resistance: string; intelligence: string; foi: string; charisme: string;
  habiletes: string; sorts: string; mana: string; miracles: string; divinite: string;
  pointsMelodieux: string; ki: string; pointsNecromancie: string; chargesVampiriques: string;
}

interface VisibleSections {
  sorts: boolean; mana: boolean; miracles: boolean; divinite: boolean;
  pointsMelodieux: boolean; ki: boolean; pointsNecromancie: boolean; chargesVampiriques: boolean;
}

const B = '1px solid #000';

interface CharacterSheetProps {
  initialData?: Partial<CharacterData>;
  initialVis?: Partial<VisibleSections>;
}

export function CharacterSheet({ initialData, initialVis }: CharacterSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [char, setChar] = useState<CharacterData>({
    nom: '', exp: '', pv: '', classe: '', niveau: '', or: '',
    inventaire: '', armorClass: '', maxPV: '',
    force: '', dexterite: '', vitesse: '', constitution: '',
    resistance: '', intelligence: '', foi: '', charisme: '',
    habiletes: '', sorts: '', mana: '', miracles: '', divinite: '',
    pointsMelodieux: '', ki: '', pointsNecromancie: '', chargesVampiriques: '',
    ...initialData,
  });

  const [vis, setVis] = useState<VisibleSections>({
    sorts: true, mana: true, miracles: true, divinite: true,
    pointsMelodieux: true, ki: true, pointsNecromancie: true, chargesVampiriques: true,
    ...initialVis,
  });

  const set = (k: keyof CharacterData, v: string) => setChar(p => ({ ...p, [k]: v }));
  const toggle = (k: keyof VisibleSections) => {
    setVis(p => {
      const next = { ...p, [k]: !p[k] };
      if (k === 'sorts' && !next.sorts) next.mana = false;
      if (k === 'miracles' && !next.miracles) next.divinite = false;
      return next;
    });
  };

  const exportToPDF = async () => {
    if (!sheetRef.current) return;
    const root = document.documentElement;
    const overrides: Record<string, string> = {
      '--foreground': '#111', '--card-foreground': '#111', '--popover': '#fff',
      '--popover-foreground': '#111', '--primary-foreground': '#fff',
      '--secondary': '#f1f0f8', '--secondary-foreground': '#111', '--ring': '#aaa',
    };
    const saved: Record<string, string> = {};
    for (const p of Object.keys(overrides)) saved[p] = root.style.getPropertyValue(p);
    for (const [p, v] of Object.entries(overrides)) root.style.setProperty(p, v);

    const prevScroll = { x: window.scrollX, y: window.scrollY };
    window.scrollTo(0, 0);

    // Crée un clone hors-écran et remplace inputs/textareas par des spans/divs
    // car html2canvas ne capture pas les valeurs des champs de formulaire
    const el = sheetRef.current;
    const clone = el.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.top = '0';
    clone.style.left = '-9999px';
    clone.style.boxShadow = 'none';
    clone.style.zIndex = '-1';
    document.body.appendChild(clone);

    // Remplacer chaque <input> par un <span> avec la valeur — fond transparent dans le PDF
    const origInputs = el.querySelectorAll<HTMLInputElement>('input:not([type="checkbox"])');
    const cloneInputs = clone.querySelectorAll<HTMLInputElement>('input:not([type="checkbox"])');
    origInputs.forEach((orig, i) => {
      const cloneEl = cloneInputs[i];
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.flex = '1';
      span.style.minWidth = '0';
      span.style.width = orig.style.width || '100%';
      span.style.background = 'transparent'; // pas de gris dans le PDF
      span.style.padding = '1px 4px';
      span.style.boxSizing = 'border-box';
      span.style.fontSize = orig.style.fontSize || '13px';
      span.style.fontFamily = 'serif';
      span.style.color = '#000';
      span.style.textAlign = orig.style.textAlign || 'left';
      span.style.fontWeight = orig.style.fontWeight || 'normal';
      span.style.lineHeight = '1.4';
      span.style.verticalAlign = 'middle';
      span.style.minHeight = '14px';
      span.textContent = orig.value;
      cloneEl.parentNode?.replaceChild(span, cloneEl);
    });

    // Remplacer chaque <textarea> par un <div> avec la valeur — fond transparent dans le PDF
    const origTextareas = el.querySelectorAll<HTMLTextAreaElement>('textarea');
    const cloneTextareas = clone.querySelectorAll<HTMLTextAreaElement>('textarea');
    origTextareas.forEach((orig, i) => {
      const cloneEl = cloneTextareas[i];
      const div = document.createElement('div');
      div.style.cssText = orig.style.cssText;
      div.style.background = 'transparent'; // pas de gris dans le PDF
      div.style.whiteSpace = 'pre-wrap';
      div.style.overflow = 'hidden';
      div.textContent = orig.value;
      cloneEl.parentNode?.replaceChild(div, cloneEl);
    });

    try {
      const canvas = await html2canvas(clone, {
        scale: 3,
        backgroundColor: '#fff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 0,
        width: el.offsetWidth,
        height: el.offsetHeight,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.save(`${char.nom || 'personnage'}-fiche.pdf`);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'export PDF.");
    } finally {
      document.body.removeChild(clone);
      for (const [p, v] of Object.entries(saved)) {
        if (v) root.style.setProperty(p, v); else root.style.removeProperty(p);
      }
      window.scrollTo(prevScroll.x, prevScroll.y);
    }
  };

  // Styles communs pour inputs — fond gris visible même vide, pas de bordure ligne
  // flex:1 + minWidth:0 pour que l'input ne dépasse pas dans les flex containers
  const inp = (k: keyof CharacterData, s?: React.CSSProperties) => (
    <input value={char[k]} onChange={e => set(k, e.target.value)}
      style={{
        borderTop: 'none', borderRight: 'none', borderBottom: 'none', borderLeft: 'none',
        outline: 'none', background: '#eef0f3',
        flex: '1', minWidth: '0', width: '100%',
        fontFamily: 'inherit', fontSize: '13px', color: '#000',
        padding: '1px 4px', margin: '0', height: '16px',
        boxSizing: 'border-box', borderRadius: '3px',
        ...s
      }} />
  );

  const ta = (k: keyof CharacterData, placeholder?: string, s?: React.CSSProperties) => (
    <textarea value={char[k]} onChange={e => set(k, e.target.value)}
      placeholder={placeholder}
      style={{
        border: 'none', outline: 'none',
        background: 'transparent', // les textareas n'ont pas de fond gris, seulement les inputs
        width: '100%',
        resize: 'none', fontFamily: 'inherit', fontSize: '12px', color: '#000',
        boxSizing: 'border-box', padding: '6px 8px', margin: '0', lineHeight: '1.4',
        ...s
      }} />
  );

  const hasSorts = vis.sorts;
  const hasMiracles = vis.miracles;
  const hasBottom = vis.pointsMelodieux || vis.ki || vis.pointsNecromancie || vis.chargesVampiriques;
  const habFlex = (!hasSorts && !hasMiracles) ? 3 : 2;
  const sortsFlex = hasMiracles ? 1 : 2;
  const miraclesFlex = hasSorts ? 1 : 2;

  return (
    <div style={{ minHeight: '100vh', background: '#e8e4dc', padding: '20px', fontFamily: 'serif',
      display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Controls */}
      <div style={{ width: '210mm', maxWidth: '100%', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px' }}>
          {([
            ['sorts', 'Sorts'], ['mana', 'Mana'], ['miracles', 'Miracles'], ['divinite', 'Divinité'],
            ['pointsMelodieux', 'Pts mélodieux'], ['ki', 'Ki'],
            ['pointsNecromancie', 'Pts nécromancie'], ['chargesVampiriques', 'Charges vamp.'],
          ] as [keyof VisibleSections, string][]).map(([k, label]) => (
            <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer', color: '#333' }}>
              <input type="checkbox" checked={vis[k]} onChange={() => toggle(k)} />{label}
            </label>
          ))}
        </div>
        <button onClick={exportToPDF} style={{ display: 'flex', alignItems: 'center', gap: '6px',
          background: '#c0392b', color: '#fff', border: 'none', borderRadius: '4px',
          padding: '6px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, flexShrink: 0 }}>
          <Download size={14} /> PDF
        </button>
      </div>

      {/* Sheet — A4 ratio: 210mm x 297mm */}
      <div ref={sheetRef} style={{
        width: '210mm', height: '297mm', maxWidth: '100%',
        background: '#fff', fontFamily: 'serif', fontSize: '13px', color: '#000',
        display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
        boxShadow: '0 2px 20px rgba(0,0,0,0.2)',
      }}>
        {/* Inner content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1fr', borderBottom: B, flexShrink: 0 }}>
            <div style={{ padding: '6px 8px', borderRight: B, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>Nom :</span>{inp('nom')}
            </div>
            <div style={{ padding: '6px 8px', borderRight: B, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>Exp :</span>{inp('exp')}
            </div>
            <div style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>PV :</span>{inp('pv')}
            </div>
          </div>
          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1fr', borderBottom: B, flexShrink: 0 }}>
            <div style={{ padding: '6px 8px', borderRight: B, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>Classe :</span>{inp('classe')}
            </div>
            <div style={{ padding: '6px 8px', borderRight: B, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>Niveau :</span>{inp('niveau')}
            </div>
            <div style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>Or :</span>{inp('or')}
            </div>
          </div>

          {/* Main body */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 0 }}>
            {/* LEFT */}
            <div style={{ borderRight: B, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '4px 8px', flexShrink: 0 }}>
                <span style={{ textDecoration: 'underline' }}>Inventaire</span>
              </div>
              <div style={{ flex: 1, position: 'relative', padding: '4px' }}>
                {ta('inventaire', 'Liste de vos objets...', { position: 'absolute', top: 4, left: 4, right: 4, bottom: 4, height: 'calc(100% - 8px)', borderRadius: '4px' })}
              </div>
              {hasBottom && (
                <div style={{ borderTop: B, flexShrink: 0 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', fontSize: '11px' }}>
                    {vis.pointsMelodieux && (
                      <div style={{ padding: '4px 6px', borderRight: B,
                        borderBottom: (vis.pointsNecromancie || vis.chargesVampiriques) ? B : 'none',
                        display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ whiteSpace: 'nowrap', fontWeight: 700 }}>Points mélodieux :</span>
                        {inp('pointsMelodieux', { fontSize: '11px', height: '18px' })}
                      </div>
                    )}
                    {vis.ki && (
                      <div style={{ padding: '4px 6px',
                        borderBottom: (vis.pointsNecromancie || vis.chargesVampiriques) ? B : 'none',
                        display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ whiteSpace: 'nowrap', fontWeight: 700 }}>Ki :</span>
                        {inp('ki', { fontSize: '11px', height: '18px' })}
                      </div>
                    )}
                    {vis.pointsNecromancie && (
                      <div style={{ padding: '4px 6px', borderRight: B, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ whiteSpace: 'nowrap', fontWeight: 700 }}>Points de nécromancie :</span>
                        {inp('pointsNecromancie', { fontSize: '11px', height: '18px' })}
                      </div>
                    )}
                    {vis.chargesVampiriques && (
                      <div style={{ padding: '4px 6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ whiteSpace: 'nowrap', fontWeight: 700 }}>Charges vampiriques :</span>
                        {inp('chargesVampiriques', { fontSize: '11px', height: '18px' })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* AC + Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', borderBottom: B, flexShrink: 0 }}>
                <div style={{ borderRight: B, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ padding: '4px 4px 2px', textAlign: 'center', borderBottom: B, width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ fontWeight: 700, fontSize: '10px', marginBottom: '2px' }}>Armor Class</div>
                    {/* Bouclier rendu en <img> pour éviter le clipping html2canvas */}
                    <img src={SHIELD_URL} width={36} height={42}
                      style={{ display: 'block', margin: '0 auto 2px' }} alt="shield" />
                    {inp('armorClass', { textAlign: 'center', fontSize: '14px', fontWeight: 700 })}
                  </div>
                  <div style={{ padding: '4px 4px 2px', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ fontWeight: 700, fontSize: '10px', marginBottom: '2px' }}>Max PV</div>
                    {/* Cœur rendu en <img> pour éviter le clipping html2canvas */}
                    <img src={HEART_URL} width={30} height={28}
                      style={{ display: 'block', margin: '0 auto 2px' }} alt="heart" />
                    {inp('maxPV', { textAlign: 'center', fontSize: '14px', fontWeight: 700 })}
                  </div>
                </div>
                <div style={{ padding: '6px 8px' }}>
                  <div style={{ textDecoration: 'underline', fontWeight: 700, marginBottom: '4px', textAlign: 'center' }}>Statistiques</div>
                  {([
                    ['Force', 'force'], ['Dextérité', 'dexterite'], ['Vitesse', 'vitesse'],
                    ['Constitution', 'constitution'], ['Résistance', 'resistance'],
                    ['Intelligence', 'intelligence'], ['Foi', 'foi'], ['Charisme', 'charisme'],
                  ] as [string, keyof CharacterData][]).map(([label, key]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: '3px', gap: '4px' }}>
                      <span style={{ whiteSpace: 'nowrap', fontSize: '11px' }}>{label} :</span>
                      {inp(key, { fontSize: '11px', height: '18px' })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Habiletés */}
              <div style={{ flex: habFlex, display: 'flex', flexDirection: 'column',
                borderBottom: (hasSorts || hasMiracles) ? B : 'none', minHeight: 0 }}>
                <div style={{ padding: '4px 8px', borderBottom: B, flexShrink: 0 }}>
                  <span style={{ textDecoration: 'underline' }}>Habiletés</span>
                </div>
                <div style={{ flex: 1, position: 'relative', padding: '4px' }}>
                  {ta('habiletes', 'Décrivez vos habiletés...', { position: 'absolute', top: 4, left: 4, right: 4, bottom: 4, height: 'calc(100% - 8px)', borderRadius: '4px' })}
                </div>
              </div>

              {/* Sorts */}
              {hasSorts && (
                <div style={{ flex: sortsFlex, display: 'flex', flexDirection: 'column',
                  borderBottom: hasMiracles ? B : 'none', minHeight: 0 }}>
                  <div style={{ padding: '4px 8px', borderBottom: B, display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ textDecoration: 'underline' }}>Sorts</span>
                    {vis.mana && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        Mana {inp('mana', { width: '50px', textAlign: 'center', fontSize: '12px', height: '18px' })}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1, position: 'relative', padding: '4px' }}>
                    {ta('sorts', 'Listez vos sorts...', { position: 'absolute', top: 4, left: 4, right: 4, bottom: 4, height: 'calc(100% - 8px)', borderRadius: '4px' })}
                  </div>
                </div>
              )}

              {/* Miracles */}
              {hasMiracles && (
                <div style={{ flex: miraclesFlex, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <div style={{ padding: '4px 8px', borderBottom: B, display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <span style={{ textDecoration: 'underline' }}>Miracles</span>
                    {vis.divinite && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        Divinité {inp('divinite', { width: '50px', textAlign: 'center', fontSize: '12px', height: '18px' })}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1, position: 'relative', padding: '4px' }}>
                    {ta('miracles', 'Listez vos miracles...', { position: 'absolute', top: 4, left: 4, right: 4, bottom: 4, height: 'calc(100% - 8px)', borderRadius: '4px' })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}