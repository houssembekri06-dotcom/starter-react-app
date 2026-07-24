import { NavLink } from 'react-router-dom';
import Icon from './Icon';
import './TabBar.css';

const TABS = [
  { to: '/home', icon: 'home', label: 'Accueil' },
  { to: '/wallet', icon: 'wallet', label: 'Portefeuille' },
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
          className={({ isActive }) => 'tab-bar-item' + (isActive ? ' tab-bar-item--active' : '')}
        >
          <Icon name={tab.icon} size={22} stroke={2} />
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
