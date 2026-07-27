import { useEffect, useState } from 'react';
import logoMark from '../assets/logo-mark.svg';
import './Splash.css';

export default function Splash({ onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 1500);
    const t2 = setTimeout(() => onDone && onDone(), 2050);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div className={'splash' + (leaving ? ' splash--leaving' : '')}>
      <img src={logoMark} alt="iInvest" className="splash-logo-img" />
    </div>
  );
}