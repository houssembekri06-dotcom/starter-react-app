import { NavLink } from '@/lib/router-compat';
import Icon from './Icon';
import './TabBar.css';

const TABS = [
  { to: '/home', icon: 'home', label: 'Accueil' },
  { to: '/wallet', icon: 'wallet', label: 'Portefeuille' },
  { to: '/news', icon: 'news', label: 'Actualités' },
  { to: '/league', icon: 'trophy', label: 'Ligue' },
  { to: '/profile', icon: 'user', label: 'Profil' },
];

export default function TabBar() {
  return (
    <nav className="tab-bar">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          aria-label={tab.label}
          className={({ isActive }) => 'tab-bar-item' + (isActive ? ' tab-bar-item--active' : '')}
        >
          <Icon name={tab.icon} size={24} stroke={2} />
        </NavLink>
      ))}
    </nav>
  );
}
