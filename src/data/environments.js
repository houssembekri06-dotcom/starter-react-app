import env1 from '../assets/env/env-1.jpg.asset.json';
import env2 from '../assets/env/env-2.jpg.asset.json';
import env3 from '../assets/env/env-3.jpg.asset.json';
import env4 from '../assets/env/env-4.jpg.asset.json';
import env5 from '../assets/env/env-5.jpg.asset.json';
import env6 from '../assets/env/env-6.jpg.asset.json';

// Environnement narratif par unité : du village à Wall Street.
// L'accent est utilisé pour teinter la courbe et les éléments de l'unité.
export const ENVIRONMENTS = {
  u1: {
    chapter: 'Chapitre 1',
    place: 'Le village',
    tagline: 'Là où tout commence',
    image: env1.url,
    accent: '#3E8E5A',
    accentSoft: 'rgba(62, 142, 90, 0.12)',
  },
  u2: {
    chapter: 'Chapitre 2',
    place: 'La petite ville',
    tagline: 'Première banque, premiers marchés',
    image: env2.url,
    accent: '#2FA6A0',
    accentSoft: 'rgba(47, 166, 160, 0.12)',
  },
  u3: {
    chapter: 'Chapitre 3',
    place: 'La bourse régionale',
    tagline: "Vos premiers ordres d'achat",
    image: env3.url,
    accent: '#2F80D6',
    accentSoft: 'rgba(47, 128, 214, 0.12)',
  },
  u4: {
    chapter: 'Chapitre 4',
    place: 'La métropole',
    tagline: 'Construire un portefeuille solide',
    image: env4.url,
    accent: '#5B4FE8',
    accentSoft: 'rgba(91, 79, 232, 0.12)',
  },
  u5: {
    chapter: 'Chapitre 5',
    place: 'La City',
    tagline: 'Analyser comme un pro',
    image: env5.url,
    accent: '#8B5CF6',
    accentSoft: 'rgba(139, 92, 246, 0.12)',
  },
  u6: {
    chapter: 'Chapitre 6',
    place: 'Wall Street',
    tagline: 'Bienvenue au sommet',
    image: env6.url,
    accent: '#C79A2A',
    accentSoft: 'rgba(199, 154, 42, 0.14)',
  },
};

export function getEnvironment(unitId) {
  return ENVIRONMENTS[unitId] || ENVIRONMENTS.u1;
}