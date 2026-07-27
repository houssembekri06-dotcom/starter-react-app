import { useEffect, useState } from 'react';
import logoMarkup from '../assets/logo-mark.svg?raw';
import './Splash.css';

export default function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2300);
    const t2 = setTimeout(() => onDone && onDone(), 2850);
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