import { useEffect, useState } from 'react';
import logoMarkup from '../assets/logo-mark.svg?raw';
import './Splash.css';

export default function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // En reduced-motion la sortie est instantanée (voir Splash.css) : garder les
    // 550 ms de fondu laisserait l'app visible sans sa barre d'onglets, que
    // __root.tsx masque tant que le splash est monté. On démonte donc aussitôt.
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const exitMs = reduced ? 0 : 550;

    const t1 = setTimeout(() => setLeaving(true), 2300);
    const t2 = setTimeout(() => onDone && onDone(), 2300 + exitMs);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div className={'splash' + (leaving ? ' splash--leaving' : '')}>
      <div
        className="splash-logo"
        role="img"
        aria-label="iInvest"
        dangerouslySetInnerHTML={{ __html: logoMarkup }}
      />
    </div>
  );
}